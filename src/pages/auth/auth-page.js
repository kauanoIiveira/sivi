import { getAuthErrorMessage } from "../../services/auth-errors.js";
import { runAnimation } from "../../utils/animation.js";
import { createAuthTransitions } from "./auth-transitions.js";
import { evaluatePassword, isValidEmail } from "./auth-validation.js";

let authServicePromise;
let authService;
let activeMountCleanup = () => {};

function loadAuthService() {
  if (authService) return Promise.resolve(authService);

  authServicePromise ??= import("../../services/auth-service.js")
    .then((service) => {
      authService = service;
      return service;
    })
    .catch((cause) => {
      authServicePromise = undefined;
      const error = new Error("O SDK de autenticação não pôde ser carregado.", { cause });
      error.code = "auth/sdk-unavailable";
      throw error;
    });

  return authServicePromise;
}

const findById = (root, id) => [...root.querySelectorAll("[id]")].find((element) => element.id === id);
const findStatus = (root, mode) => [...root.querySelectorAll("[data-status]")]
  .find((element) => element.dataset.status === mode);

export function mountAuthSurface({ root } = {}) {
  if (!root) throw new Error("A raiz da superfície de acesso é obrigatória.");
  activeMountCleanup();

  const shell = root.querySelector(".auth-shell");
  const storyPanel = root.querySelector(".story-panel");
  const formStage = root.querySelector(".form-stage");
  const registerForm = root.querySelector("#register-form");
  const loginForm = root.querySelector("#login-form");
  const toastRegion = root.querySelector(".toast-region");
  if (!shell || !storyPanel || !formStage || !registerForm || !loginForm || !toastRegion) {
    throw new Error("A marcação da superfície de acesso está incompleta.");
  }

  const compactQuery = window.matchMedia("(max-width: 899px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const animationController = new AbortController();
  const listenerCleanups = [];
  const toastTimeouts = new Set();
  let active = true;
  let authPending = false;
  let transitions;

  const listen = (target, type, listener, options) => {
    target.addEventListener(type, listener, options);
    listenerCleanups.push(() => target.removeEventListener(type, listener, options));
  };

  function refreshControlLocks() {
    if (!active) return;
    const busy = transitions.isTransitioning || authPending;
    root
      .querySelectorAll("[data-switch-mode], [data-provider], button[type='submit'], [data-reset-password]")
      .forEach((button) => {
        const providerWaitingForSdk = button.matches("[data-provider]") && !authService;
        button.disabled = busy || providerWaitingForSdk;
      });
    shell.setAttribute("aria-busy", String(busy));
  }

  const requestedMode = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('modo');
  if (['login', 'register'].includes(requestedMode)) shell.dataset.mode = requestedMode;
  transitions = createAuthTransitions({
    root,
    shell,
    storyPanel,
    formStage,
    compactQuery,
    reducedMotionQuery,
    onTransitionChange: refreshControlLocks,
    animationSignal: animationController.signal,
  });

  function setAuthPending(pending) {
    if (!active) return;
    authPending = pending;
    refreshControlLocks();
  }

  function resetPasswordVisibility(scope) {
    scope.querySelectorAll(".password-toggle").forEach((button) => {
      const input = findById(root, button.getAttribute("aria-controls"));
      if (!input) return;
      input.type = "password";
      button.classList.remove("is-visible");
      button.setAttribute("aria-label", button.dataset.hiddenLabel);
    });
  }

  function showFieldError(input, message = "") {
    if (!active) return;
    const field = input.closest(".field");
    const error = field?.querySelector(".field-error");
    const defaultDescribedBy = input.dataset.defaultDescribedby ?? input.getAttribute("aria-describedby") ?? "";
    if (input.dataset.defaultDescribedby === undefined) input.dataset.defaultDescribedby = defaultDescribedBy;
    field?.classList.toggle("has-error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) {
      error.textContent = message;
      const describedBy = [defaultDescribedBy, message ? error.id : ""].filter(Boolean).join(" ");
      if (describedBy) input.setAttribute("aria-describedby", describedBy);
      else input.removeAttribute("aria-describedby");
    }
    transitions.scheduleCompactHeight();
  }

  function validateRegisterForm() {
    const data = Object.fromEntries(new FormData(registerForm));
    const fields = {
      firstName: registerForm.elements.firstName,
      lastName: registerForm.elements.lastName,
      email: registerForm.elements.email,
      password: registerForm.elements.password,
      confirmPassword: registerForm.elements.confirmPassword,
    };
    const passwordResult = evaluatePassword(data.password);
    let valid = true;
    const validations = [
      [fields.firstName, data.firstName.trim().length >= 2, "Informe seu nome."],
      [fields.lastName, data.lastName.trim().length >= 2, "Informe seu sobrenome."],
      [fields.email, isValidEmail(data.email.trim()), "Informe um e-mail válido."],
      [fields.password, passwordResult.score === 4, "Use 8 caracteres ou mais, incluindo maiúscula, minúscula e número."],
      [fields.confirmPassword, data.confirmPassword === data.password && data.confirmPassword.length > 0, "As senhas precisam ser iguais."],
    ];
    validations.forEach(([input, condition, message]) => {
      showFieldError(input, condition ? "" : message);
      valid &&= condition;
    });
    if (!valid) validations.find(([, condition]) => !condition)?.[0]?.focus();
    return {
      valid,
      values: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      },
    };
  }

  function validateLoginForm() {
    const data = Object.fromEntries(new FormData(loginForm));
    const email = loginForm.elements.email;
    const password = loginForm.elements.password;
    const emailValid = isValidEmail(data.email.trim());
    const passwordValid = data.password.length > 0;
    showFieldError(email, emailValid ? "" : "Informe um e-mail válido.");
    showFieldError(password, passwordValid ? "" : "Informe sua senha.");
    if (!emailValid) email.focus();
    else if (!passwordValid) password.focus();
    return {
      valid: emailValid && passwordValid,
      values: { email: data.email.trim().toLowerCase(), password: data.password },
    };
  }

  function setFormStatus(mode, message = "", type = "") {
    if (!active) return;
    const status = findStatus(root, mode);
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
    transitions.scheduleCompactHeight();
  }

  function setFormLoading(form, loading, label) {
    if (!active) return;
    const button = form.querySelector("button[type='submit']");
    button.disabled = loading;
    button.classList.toggle("is-loading", loading);
    button.querySelector("span").textContent = loading ? label : button.dataset.defaultLabel;
  }

  function showToast(message) {
    if (!active) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastRegion.append(toast);
    if (!reducedMotionQuery.matches) {
      void runAnimation(toast, {
        opacity: [0, 1], x: [18, 0], duration: 240, ease: "outCubic", signal: animationController.signal,
      });
    }
    const timeout = window.setTimeout(async () => {
      toastTimeouts.delete(timeout);
      if (!active) return;
      if (!reducedMotionQuery.matches) {
        await runAnimation(toast, {
          opacity: 0, x: 12, duration: 180, ease: "inQuad", signal: animationController.signal,
        });
      }
      if (active) toast.remove();
    }, 4300);
    toastTimeouts.add(timeout);
  }

  root.querySelectorAll("button[type='submit']").forEach((button) => {
    button.dataset.defaultLabel ??= button.querySelector("span").textContent;
  });
  root.querySelectorAll("[data-switch-mode]").forEach((button) => {
    listen(button, "click", () => {
      if (!authPending) void transitions.switchMode(button.dataset.switchMode);
    });
  });
  root.querySelectorAll(".password-toggle").forEach((button) => {
    button.dataset.hiddenLabel ??= button.getAttribute("aria-label");
    button.dataset.visibleLabel ??= button.dataset.hiddenLabel.replace("Mostrar", "Ocultar");
    listen(button, "click", () => {
      const input = findById(root, button.getAttribute("aria-controls"));
      if (!input) return;
      const shouldShow = input.type === "password";
      input.type = shouldShow ? "text" : "password";
      button.classList.toggle("is-visible", shouldShow);
      button.setAttribute("aria-label", shouldShow ? button.dataset.visibleLabel : button.dataset.hiddenLabel);
    });
  });

  listen(registerForm.elements.password, "input", (event) => {
    const { checks, score } = evaluatePassword(event.target.value);
    const track = root.querySelector(".password-strength");
    const meter = track.querySelector("[role='meter']");
    const message = track.querySelector(".password-strength__message");
    const percentages = [0, 25, 50, 75, 100];
    const colors = [
      "var(--feedback-danger)", "var(--feedback-danger)", "var(--feedback-warning)",
      "var(--focus-ring)", "var(--feedback-success)",
    ];
    const missingLabels = [
      [checks.length, "8 caracteres"],
      [checks.uppercase, "uma letra maiúscula"],
      [checks.lowercase, "uma letra minúscula"],
      [checks.number, "um número"],
    ].filter(([passed]) => !passed).map(([, label]) => label);
    track.style.setProperty("--password-strength", `${percentages[score]}%`);
    track.style.setProperty("--password-color", colors[score]);
    meter.setAttribute("aria-valuenow", String(score));
    meter.setAttribute("aria-valuetext", `${score} de 4 requisitos atendidos`);
    message.textContent = score === 4
      ? "Todos os requisitos mínimos foram atendidos."
      : `Ainda falta: ${missingLabels.join(", ")}.`;
    if (registerForm.elements.confirmPassword.value) {
      const matches = registerForm.elements.confirmPassword.value === event.target.value;
      showFieldError(registerForm.elements.confirmPassword, matches ? "" : "As senhas precisam ser iguais.");
    }
  });
  listen(registerForm.elements.confirmPassword, "input", (event) => {
    const matches = event.target.value === registerForm.elements.password.value;
    showFieldError(event.target, matches ? "" : "As senhas precisam ser iguais.");
  });
  root.querySelectorAll("input").forEach((input) => {
    listen(input, "input", () => {
      if (input.closest(".field")?.classList.contains("has-error") && !input.id.includes("confirm-password")) {
        showFieldError(input);
      }
    });
  });

  listen(registerForm, "submit", async (event) => {
    event.preventDefault();
    if (authPending) return;
    setFormStatus("register");
    const { valid, values } = validateRegisterForm();
    if (!valid) return;
    setAuthPending(true);
    setFormLoading(registerForm, true, "Criando conta...");
    try {
      const { registerWithEmail } = await loadAuthService();
      const result = await registerWithEmail(values);
      if (!active) return;
      const details = [
        result.verificationSent ? "Enviamos um link de verificação para o seu e-mail." : "O envio do e-mail de verificação ficou pendente.",
        result.displayNameSaved ? "" : "O nome de exibição no Authentication ficou pendente.",
        result.profileSaved ? "" : "O perfil não foi salvo; revise as regras do banco antes de continuar o cadastro.",
      ].filter(Boolean);
      setFormStatus("register", `Conta criada. ${details.join(" ")}`, "success");
      registerForm.reset();
      resetPasswordVisibility(registerForm);
      const strength = root.querySelector(".password-strength");
      strength.style.setProperty("--password-strength", "0%");
      strength.querySelector("[role='meter']").setAttribute("aria-valuenow", "0");
      strength.querySelector("[role='meter']").setAttribute("aria-valuetext", "Nenhum requisito atendido");
      strength.querySelector(".password-strength__message").textContent = "Use pelo menos 8 caracteres, com maiúscula, minúscula e número.";
    } catch (error) {
      if (active) setFormStatus("register", getAuthErrorMessage(error), "error");
    } finally {
      setFormLoading(registerForm, false);
      setAuthPending(false);
    }
  });

  listen(loginForm, "submit", async (event) => {
    event.preventDefault();
    if (authPending) return;
    setFormStatus("login");
    const { valid, values } = validateLoginForm();
    if (!valid) return;
    setAuthPending(true);
    setFormLoading(loginForm, true, "Entrando...");
    try {
      const { loginWithEmail } = await loadAuthService();
      const user = await loginWithEmail(values);
      if (!active) return;
      loginForm.elements.password.value = "";
      resetPasswordVisibility(loginForm);
      setFormStatus("login", `Acesso realizado como ${user.displayName || user.email}.`, "success");
    } catch (error) {
      if (active) setFormStatus("login", getAuthErrorMessage(error), "error");
    } finally {
      setFormLoading(loginForm, false);
      setAuthPending(false);
    }
  });

  root.querySelectorAll("[data-provider]").forEach((button) => {
    listen(button, "click", async () => {
      if (authPending) return;
      const provider = button.dataset.provider;
      const mode = button.closest("[data-view]")?.dataset.view ?? transitions.currentMode;
      setFormStatus(mode);
      setAuthPending(true);
      try {
        const { loginWithProvider } = await loadAuthService();
        const user = await loginWithProvider(provider);
        if (active) setFormStatus(mode, `Acesso realizado como ${user.displayName || user.email}.`, "success");
      } catch (error) {
        if (active) setFormStatus(mode, getAuthErrorMessage(error), "error");
      } finally {
        setAuthPending(false);
      }
    });
  });

  const resetPasswordButton = root.querySelector("[data-reset-password]");
  listen(resetPasswordButton, "click", async () => {
    if (authPending) return;
    const emailInput = loginForm.elements.email;
    const email = emailInput.value.trim().toLowerCase();
    if (!isValidEmail(email)) {
      showFieldError(emailInput, "Informe seu e-mail para receber as instruções.");
      emailInput.focus();
      return;
    }
    setAuthPending(true);
    try {
      const { requestPasswordReset } = await loadAuthService();
      await requestPasswordReset(email);
      showToast("Se existir uma conta para este e-mail, você receberá as instruções de recuperação.");
    } catch (error) {
      if (!active) return;
      if (error?.code === "auth/too-many-requests" || error?.code === "auth/network-request-failed") {
        showToast(getAuthErrorMessage(error));
      } else {
        showToast("Se existir uma conta para este e-mail, você receberá as instruções de recuperação.");
      }
    } finally {
      setAuthPending(false);
    }
  });

  transitions.initialize();
  refreshControlLocks();
  shell.dataset.uiReady = "true";
  window.dispatchEvent(new CustomEvent("sivi:ui-ready"));
  loadAuthService().then(refreshControlLocks).catch((error) => {
    if (!active) return;
    console.warn("O Firebase ficará indisponível até uma nova tentativa de conexão.", error);
    refreshControlLocks();
  });
  listen(window, "online", () => {
    if (active && !authService) loadAuthService().then(refreshControlLocks).catch(() => {});
  });

  if (!reducedMotionQuery.matches) {
    const initialFrame = transitions.getView(transitions.currentMode).querySelector(".form-frame");
    void runAnimation(storyPanel, {
      opacity: [0, 1], duration: 520, ease: "outCubic", signal: animationController.signal,
    });
    void runAnimation(initialFrame, {
      opacity: [0, 1], y: [14, 0], duration: 480, delay: 90, ease: "outCubic", signal: animationController.signal,
    });
  }

  const cleanup = () => {
    if (!active) return;
    active = false;
    animationController.abort();
    transitions.destroy();
    listenerCleanups.splice(0).forEach((removeListener) => removeListener());
    toastTimeouts.forEach((timeout) => window.clearTimeout(timeout));
    toastTimeouts.clear();
    toastRegion.replaceChildren();
    root.querySelectorAll("button[type='submit']").forEach((button) => {
      button.classList.remove("is-loading");
      button.disabled = false;
      button.querySelector("span").textContent = button.dataset.defaultLabel;
    });
    delete shell.dataset.uiReady;
    shell.setAttribute("aria-busy", "false");
    if (activeMountCleanup === cleanup) activeMountCleanup = () => {};
  };
  activeMountCleanup = cleanup;
  return cleanup;
}
