import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  SIGNUP_ACTIVITIES,
  resolveSignupActivity,
  validateSignup,
} from "../domain/public-signup.js";
import {
  normalizeApplication,
  states,
} from "../domain/organization-application.js";
import { signupDraftStore } from "../core/signup-draft-store.js";
import { getAuthErrorMessage } from "../services/auth-errors.js";
import { Brand, infoLink } from "./components";

function Field({
  label,
  name,
  id,
  type = "text",
  value,
  onChange,
  error,
  hint,
  autoComplete,
  maxLength,
  ...rest
}: any) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="sa-field">
      <label htmlFor={id}>{label}</label>
      <div className="sa-input-wrap">
        <input
          {...rest}
          id={id}
          name={name}
          type={type === "password" && visible ? "text" : type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
        {type === "password" && (
          <button
            type="button"
            className="sa-password"
            aria-label={
              visible
                ? `Ocultar ${label.toLowerCase()}`
                : `Mostrar ${label.toLowerCase()}`
            }
            aria-pressed={visible}
            aria-controls={id}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint && !error && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small className="sa-error" id={`${id}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}
const personalInitial = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export function AuthExperience({ bridge }: any) {
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const register = params.get("modo") !== "login";
  const [activity, setActivity] = useState(
    () => resolveSignupActivity(params.get("atuacao"), params.get("plano")).id,
  );
  const [step, setStep] = useState(0),
    [values, setValues] = useState<any>({
      ...personalInitial,
      name: "",
      cnpj: "",
      city: "",
      state: "",
      contact: "",
    });
  const [errors, setErrors] = useState<any>({}),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [success, setSuccess] = useState<any>(null),
    [reset, setReset] = useState(false),
    [loginEmail, setLoginEmail] = useState(""),
    [loginPassword, setLoginPassword] = useState("");
  const lock = useRef(false);
  const active = useRef(true);
  const title = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const selected = resolveSignupActivity(activity);
  const store = signupDraftStore();
  useEffect(
    () => () => {
      active.current = false;
    },
    [],
  );
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
  }, [step, success, reset]);
  const change = (name: string, value: any) => {
    setValues((v: any) => ({ ...v, [name]: value }));
    setErrors((e: any) => ({ ...e, [name]: undefined, company: undefined }));
  };
  const feedback = (message: string) => {
    setStatus(message);
    requestAnimationFrame(() => statusRef.current?.focus());
  };
  const invalid = (next: any) => {
    setErrors(next);
    feedback("Confira os campos indicados antes de continuar.");
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLInputElement>('.sivi-auth-ui [aria-invalid="true"]')
        ?.focus(),
    );
  };
  async function submitRegistration(e: any) {
    e.preventDefault();
    if (lock.current) return;
    const input = { ...values, roles: selected.roles };
    const next = validateSignup(input, step);
    if (Object.keys(next).length) {
      invalid(next);
      return;
    }
    if (step === 0) {
      setStep(step + 1);
      setStatus("");
      setErrors({});
      window.scrollTo(0, 0);
      return;
    }
    const all = {
      ...validateSignup(input, 0),
      ...next,
    };
    if (Object.keys(all).length) {
      setStep(Object.keys(validateSignup(input, 0)).length ? 0 : 1);
      invalid(all);
      return;
    }
    lock.current = true;
    setBusy(true);
    setStatus("Criando sua conta. Aguarde a confirmação.");
    let draftId: string | undefined;
    try {
      draftId = store.stage({
        email: values.email,
        organization: normalizeApplication(input),
      });
      const service = await bridge.loadAuth();
      const result = await service.registerWithEmail({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      store.bind(draftId, {
        uid: result.user.uid,
        email: result.user.email ?? values.email,
      });
      if (!active.current) return;
      setSuccess({
        ...result,
        email: values.email.trim(),
        persistent: store.persistent,
      });
      setValues((v: any) => ({
        ...v,
        password: "",
        confirmPassword: "",
      }));
      setStatus("");
    } catch (error: any) {
      if (active.current)
        feedback(
          error.code === "auth/email-already-in-use"
            ? "Este e-mail já tem uma conta. Entre ou recupere sua senha para continuar."
            : getAuthErrorMessage(error),
        );
    } finally {
      lock.current = false;
      if (active.current) setBusy(false);
    }
  }
  async function login(e: any) {
    e.preventDefault();
    if (lock.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      feedback("Informe um e-mail válido.");
      return;
    }
    if (!reset && !loginPassword) {
      feedback("Informe sua senha.");
      return;
    }
    lock.current = true;
    setBusy(true);
    setStatus(reset ? "Preparando as orientações…" : "Entrando na sua conta…");
    try {
      const service = await bridge.loadAuth();
      if (reset) {
        await service.requestPasswordReset(loginEmail.trim());
        feedback(
          "Se houver uma conta com este e-mail, você receberá as orientações para redefinir a senha. Confira também o spam.",
        );
      } else {
        await service.loginWithEmail({
          email: loginEmail.trim(),
          password: loginPassword,
        });
      }
    } catch (error) {
      if (active.current) feedback(getAuthErrorMessage(error));
    } finally {
      lock.current = false;
      if (active.current) setBusy(false);
    }
  }
  async function provider(name: string) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setStatus("Abrindo o provedor de acesso…");
    try {
      const service = await bridge.loadAuth();
      await service.loginWithProvider(name);
    } catch (error) {
      if (active.current) feedback(getAuthErrorMessage(error));
    } finally {
      lock.current = false;
      if (active.current) setBusy(false);
    }
  }
  const personalField = (
    name: string,
    label: string,
    type = "text",
    autoComplete?: string,
  ) => (
    <Field
      key={name}
      id={
        {
          firstName: "first-name",
          lastName: "last-name",
          email: "register-email",
          password: "register-password",
          confirmPassword: "confirm-password",
        }[name]
      }
      name={name}
      label={label}
      type={type}
      autoComplete={autoComplete}
      maxLength={name.includes("assword") ? 128 : name === "email" ? 254 : 80}
      value={values[name]}
      onChange={change}
      error={errors[name]}
      hint={
        name === "password"
          ? "8 ou mais caracteres, com maiúscula, minúscula e número."
          : undefined
      }
    />
  );
  return (
    <div
      className="sa-layout auth-shell"
      data-mode={register ? "register" : "login"}
      data-ui-ready="true"
      aria-busy={busy}
    >
      <aside className="sa-story">
        <img
          className="sa-story-photo"
          src="./assets/operador-torno.jpg"
          alt="Operador trabalhando em uma máquina industrial"
        />
        <div className="sa-story-shade" />
        <div className="sa-story-top">
          <Brand back />
          <span>
            DA NECESSIDADE
            <br />
            AO ACORDO.
          </span>
        </div>
        <div className="sa-story-copy">
          <p className="sv-eyebrow">Boas conexões movem a indústria</p>
          <h2>
            O próximo acordo
            <br />
            tem uma empresa
            <br />
            como a sua.
          </h2>
          <p>
            Requisitos claros. Condições registradas.
            <br />
            Um caminho compartilhado até o recebimento.
          </p>
          <div className="sa-story-proof">
            <ShieldCheck size={20} />
            <span>
              E-mail confirmado.
              <br />
              Empresa sujeita à análise.
            </span>
          </div>
        </div>
        <small className="sa-story-credit">
          Fotografia real · Tima Miroshnichenko / Pexels
        </small>
      </aside>
      <main className="sa-main">
        <div className="sa-mobile-brand">
          <Brand back />
        </div>
        <div className="sa-top">
          <a href="#/" className="sa-back">
            <ArrowLeft size={16} /> Voltar ao início
          </a>
          <span>
            {register ? "Já tem conta?" : "Primeiro acesso?"}{" "}
            <a
              href={register ? "#/acesso?modo=login" : "#/acesso?modo=register"}
              data-switch-mode={register ? "login" : "register"}
            >
              {register ? "Entrar" : "Criar conta"} <ArrowUpRight size={14} />
            </a>
          </span>
        </div>
        <div className="sa-content form-view is-active">
          {success ? (
            <section className="sa-success">
              <div className="sa-success-symbol">
                <Check size={30} />
              </div>
              <p className="sv-eyebrow">Seu primeiro passo está concluído</p>
              <h1 ref={title} tabIndex={-1}>
                Sua conta foi criada.
              </h1>
              <p>
                Agora confirme o e-mail <strong>{success.email}</strong> para
                continuar.
              </p>
              <ol>
                <li>
                  <strong>Abra a mensagem de verificação.</strong>
                  <span>
                    {success.verificationSent
                      ? "O link foi enviado. Confira a caixa de entrada e o spam."
                      : "Não foi possível enviar a mensagem agora. Tente entrar para solicitar um novo envio."}
                  </span>
                </li>
                <li>
                  <strong>Entre e revise a empresa.</strong>
                  <span>
                    {success.persistent
                      ? "Os dados empresariais ficam neste navegador por até sete dias para você retomar a revisão."
                      : "Este navegador não permitiu salvar o rascunho. Ao entrar, apresente novamente os dados da empresa."}
                  </span>
                </li>
                <li>
                  <strong>Envie para análise.</strong>
                  <span>
                    O acesso comercial será liberado após a aprovação do
                    cadastro empresarial.
                  </span>
                </li>
              </ol>
              {(!success.profileSaved || !success.displayNameSaved) && (
                <p className="sa-notice">
                  A conta existe, mas parte dos dados do perfil não pôde ser
                  salva. Confira seu perfil após entrar.
                </p>
              )}
              <a className="sa-submit" href="#/acesso?modo=login">
                Ir para entrar <ArrowUpRight size={18} />
              </a>
            </section>
          ) : register ? (
            <>
              <div className="sa-form-heading">
                <p className="sv-eyebrow">Sua empresa no SIVI</p>
                <h1 ref={title} tabIndex={-1}>
                  {
                    [
                      "Comece uma nova conexão.",
                      "Apresente sua empresa.",
                    ][step]
                  }
                </h1>
                <p>
                  {
                    [
                      "Preencha seus dados para criar um acesso acadêmico.",
                      "Informe o nome e a atuação da empresa. Os dados complementares são opcionais.",
                    ][step]
                  }
                </p>
              </div>
              <ol className="sa-steps" aria-label="Etapas do cadastro">
                {["Seu acesso", "Sua empresa"].map(
                  (label, i) => (
                    <li
                      key={label}
                      aria-current={i === step ? "step" : undefined}
                      className={i <= step ? "is-active" : ""}
                    >
                      <button
                        type="button"
                        disabled={i > step || busy}
                        onClick={() => {
                          setStep(i);
                          setStatus("");
                          setErrors({});
                        }}
                      >
                        <span>{i < step ? <Check size={13} /> : i + 1}</span>
                        {label}
                      </button>
                    </li>
                  ),
                )}
              </ol>
              <form id="register-form" noValidate onSubmit={submitRegistration}>
                <fieldset disabled={busy}>
                  {step === 0 && (
                    <>
                      <div className="sa-row">
                        {personalField(
                          "firstName",
                          "Nome",
                          "text",
                          "given-name",
                        )}
                        {personalField(
                          "lastName",
                          "Sobrenome",
                          "text",
                          "family-name",
                        )}
                      </div>
                      {personalField("email", "E-mail", "email", "email")}
                      {personalField(
                        "password",
                        "Senha",
                        "password",
                        "new-password",
                      )}
                      {personalField(
                        "confirmPassword",
                        "Confirmar senha",
                        "password",
                        "new-password",
                      )}
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <Field
                        label="Nome da empresa"
                        id="company-name"
                        name="name"
                        autoComplete="organization"
                        maxLength={120}
                        value={values.name}
                        onChange={change}
                        error={errors.name}
                      />
                      <Field
                        label="CNPJ"
                        id="company-cnpj"
                        error={errors.cnpj}
                        name="cnpj"
                        maxLength={18}
                        value={values.cnpj}
                        onChange={change}
                      />
                      <div className="sa-row sa-row--city">
                        <Field
                          label="Cidade"
                          id="company-city"
                          error={errors.city}
                          name="city"
                          autoComplete="address-level2"
                          maxLength={100}
                          value={values.city}
                          onChange={change}
                        />
                        <div className="sa-field">
                          <label htmlFor="company-state">UF</label>
                          <select
                            id="company-state"
                            aria-invalid={Boolean(errors.state)}
                            aria-describedby={
                              errors.state ? "company-state-error" : undefined
                            }
                            name="state"
                            value={values.state}
                            onChange={(e) => change("state", e.target.value)}
                          >
                            <option value="">Selecione</option>
                            {states.map((state) => (
                              <option key={state}>{state}</option>
                            ))}
                          </select>
                          {errors.state && (
                            <small
                              id="company-state-error"
                              className="sa-error"
                            >
                              {errors.state}
                            </small>
                          )}
                        </div>
                      </div>
                      <Field
                        label="Telefone ou e-mail de contato"
                        id="company-contact"
                        error={errors.contact}
                        name="contact"
                        maxLength={120}
                        value={values.contact}
                        onChange={change}
                      />
                      <div className="sa-field">
                        <label htmlFor="signup-activity">Atuação da empresa</label>
                        <select
                          id="signup-activity"
                          value={activity}
                          onChange={(e) => setActivity(e.target.value)}
                        >
                          {SIGNUP_ACTIVITIES.map((option) => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  <div
                    ref={statusRef}
                    className={`sa-feedback ${status ? "is-visible" : ""}`}
                    role="status"
                    tabIndex={-1}
                    data-status="register"
                  >
                    {status}
                  </div>
                  <button type="submit" className="sa-submit">
                    {busy
                      ? "Criando sua conta…"
                      : step === 0 ? "Continuar para empresa" : "Criar conta"}
                    {!busy && <ArrowUpRight size={18} />}
                  </button>
                  {step > 0 && (
                    <button
                      className="sa-previous"
                      type="button"
                      onClick={() => {
                        setStep(step - 1);
                        setStatus("");
                        setErrors({});
                      }}
                    >
                      ← Voltar e revisar
                    </button>
                  )}
                  <p className="sa-legal">
                    Ao criar a conta, você declara estar autorizado a
                    representar a empresa. Conheça as{" "}
                    <a
                      href={infoLink("condicoes")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      condições de uso
                    </a>{" "}
                    e o uso de dados na{" "}
                    <a
                      href={infoLink("privacidade")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      privacidade
                    </a>
                    .
                  </p>
                </fieldset>
              </form>
            </>
          ) : (
            <>
              <div className="sa-form-heading">
                <p className="sv-eyebrow">Bem-vindo de volta</p>
                <h1 ref={title} tabIndex={-1}>
                  {reset
                    ? "Recupere seu acesso."
                    : "Seu próximo acordo espera."}
                </h1>
                <p>
                  {reset
                    ? "Informe o e-mail usado no cadastro para receber as orientações."
                    : "Entre para acompanhar sua empresa e continuar de onde parou."}
                </p>
              </div>
              <form id="login-form" noValidate onSubmit={login}>
                <fieldset disabled={busy}>
                  <Field
                    id="login-email"
                    label="E-mail"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(_: any, v: string) => setLoginEmail(v)}
                  />
                  {!reset && (
                    <Field
                      id="login-password"
                      label="Senha"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(_: any, v: string) => setLoginPassword(v)}
                    />
                  )}
                  <div
                    ref={statusRef}
                    className={`sa-feedback ${status ? "is-visible" : ""}`}
                    role="status"
                    tabIndex={-1}
                    data-status="login"
                  >
                    {status}
                  </div>
                  <button type="submit" className="sa-submit">
                    {busy
                      ? "Aguarde…"
                      : reset
                        ? "Enviar orientações"
                        : "Entrar na minha conta"}
                    {!busy && <ArrowUpRight size={18} />}
                  </button>
                  <button
                    className="sa-previous"
                    type="button"
                    data-reset-password
                    onClick={() => {
                      setReset(!reset);
                      setStatus("");
                    }}
                  >
                    {reset ? "← Voltar para entrar" : "Esqueci minha senha"}
                  </button>
                </fieldset>
              </form>
              {!reset && (
                <>
                  <div className="sa-divider">
                    <span>ou entre com</span>
                  </div>
                  <div className="sa-providers">
                    <button
                      disabled={busy}
                      data-provider="google"
                      onClick={() => provider("google")}
                    >
                      <span aria-hidden="true" className="sa-google">
                        G
                      </span>
                      Google
                    </button>
                    <button
                      disabled={busy}
                      data-provider="github"
                      onClick={() => provider("github")}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.71 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
                      </svg>
                      GitHub
                    </button>
                  </div>
                </>
              )}
              <p className="sa-login-help">
                O acesso da empresa depende da confirmação de e-mail e da
                análise cadastral.{" "}
                <a href={infoLink("ajuda")}>Precisa de orientação?</a>
              </p>
            </>
          )}
        </div>
        <footer className="sa-footer">
          <span>© {new Date().getFullYear()} SIVI</span>
          <a href={infoLink("privacidade")}>Privacidade</a>
          <a href={infoLink("condicoes")}>Condições</a>
          <a href={infoLink("ajuda")}>Ajuda</a>
        </footer>
      </main>
    </div>
  );
}
