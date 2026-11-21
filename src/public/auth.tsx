import { useEffect, useRef, useState, type ClipboardEvent } from "react";
import {
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  PUBLIC_PLANS,
  resolvePlan,
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
  labelAction,
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
      <div className="sa-field-heading">
        <label htmlFor={id}>{label}</label>
        {labelAction}
      </div>
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
const cnpjLength = 14;
const cleanCnpjInput = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

const signupBenefits = [
  ["Publicar demandas", "Informe o que sua empresa precisa comprar e receba propostas."],
  ["Encontrar oportunidades", "Consulte demandas compatíveis com o que sua empresa fornece."],
  ["Acompanhar pedidos", "Consulte as condições do pedido e os registros de inspeção, expedição e recebimento."],
];

function AuthStory({ register }: { register: boolean }) {
  if (register) {
    return (
      <aside className="sa-story sa-story--benefits" aria-labelledby="signup-benefits">
        <img className="sa-story-photo" src="./assets/home-inspection.webp" width={1200} height={800} alt="" />
        <div className="sa-benefits">
          <h2 id="signup-benefits">O que sua empresa pode fazer no SIVI</h2>
          <p>A conta é gratuita. Os recursos ficam disponíveis após a aprovação da empresa.</p>
          <ul>
            {signupBenefits.map(([label, description]) => (
              <li key={label}>
                <Check size={18} aria-hidden="true" />
                <div>
                  <strong>{label}</strong>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sa-story">
      <img className="sa-story-photo" src="./assets/operador-torno.jpg" width={1920} height={1280} alt="" fetchPriority="high" />
      <div className="sa-story-content">
        <h2>Da cotação<br />ao recebimento.</h2>
        <p>Compradores e fornecedores no mesmo lugar, com cada etapa da negociação registrada.</p>
      </div>
    </aside>
  );
}

export function AuthExperience({ bridge }: any) {
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const register = params.get("modo") !== "login";
  const [plan, setPlan] = useState(
    () =>
      resolvePlan(
        params.get("plano") ??
          (params.get("atuacao") === "supplier" ? "fornecimento" : "compras"),
      ).id,
  );
  const period = params.get("periodo") === "anual" ? "anual" : "mensal";
  const [step, setStep] = useState(0),
    [values, setValues] = useState<any>({
      ...personalInitial,
      name: "",
      cnpj: "",
      city: "",
      state: "SP",
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
  const selected = resolvePlan(plan);
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
    setValues((v: any) => ({ ...v, [name]: name === "cnpj" ? cleanCnpjInput(value).slice(0, cnpjLength) : value }));
    setErrors((e: any) => ({ ...e, [name]: undefined, company: undefined }));
  };
  function pasteCnpj(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = cleanCnpjInput(event.clipboardData.getData("text"));
    if (!pasted) return;
    const input = event.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const available = cnpjLength - input.value.length + end - start;
    const inserted = pasted.slice(0, available);
    change("cnpj", input.value.slice(0, start) + inserted + input.value.slice(end));
    requestAnimationFrame(() => input.setSelectionRange(start + inserted.length, start + inserted.length));
  }
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
  const terms = (
    <p id="access-terms" className="sa-terms">
      Ao continuar, você concorda com as <a href={infoLink("condicoes")}>condições de uso</a>
      {" e com a "}<a href={infoLink("privacidade")}>política de privacidade</a>.
    </p>
  );
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
      setStep(1);
      setStatus("");
      setErrors({});
      window.scrollTo(0, 0);
      return;
    }
    const personalErrors = validateSignup(input, 0);
    if (Object.keys(personalErrors).length) {
      setStep(0);
      invalid(personalErrors);
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
        plan,
        period,
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
      setValues((v: any) => ({ ...v, password: "", confirmPassword: "" }));
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
  async function provider(name: "google" | "apple") {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setStatus(name === "apple" ? "Abrindo o acesso com Apple…" : "Abrindo o acesso com Google…");
    try {
      const service = await bridge.loadAuth();
      await service.loginWithProvider(name);
    } catch (error) {
      if (active.current) {
        const code = (error as { code?: string } | null)?.code;
        const appleUnavailable = name === "apple" && (
          code === "auth/operation-not-allowed" || code === "auth/invalid-oauth-client-id"
        );
        feedback(appleUnavailable
          ? "O acesso com Apple está indisponível. Entre com Google ou e-mail."
          : getAuthErrorMessage(error));
      }
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
    placeholder?: string,
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
      placeholder={placeholder}
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
  const switchMode = (
    <p className="sa-switch-mode">
      {register ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
      <a
        href={register ? "#/acesso?modo=login" : "#/acesso?modo=register"}
        data-switch-mode={register ? "login" : "register"}
      >
        {register ? "Entrar" : "Cadastre-se"}
      </a>
    </p>
  );
  const statusRegion = (
    <div
      ref={statusRef}
      className={`sa-feedback ${status ? "is-visible" : ""}`}
      role="status"
      tabIndex={-1}
      data-status={register ? "register" : "login"}
    >
      {status}
    </div>
  );

  return (
    <div className="sa-layout auth-shell" data-mode={register ? "register" : "login"} data-ui-ready="true" aria-busy={busy}>
      <main className="sa-main">
        <div className="sa-content form-view is-active">
          <div className="sa-brand"><Brand back /></div>
          {success ? (
            <section className="sa-success">
              <span className="sa-success-symbol"><Check size={22} aria-hidden="true" /></span>
              <h1 ref={title} tabIndex={-1}>Sua conta foi criada.</h1>
              <p>
                {success.verificationSent
                  ? <>Enviamos um link para <strong>{success.email}</strong>. Confirme seu e-mail para continuar.</>
                  : "Entre com sua conta para solicitar um novo e-mail de verificação."}
              </p>
              <p>
                {success.persistent
                  ? "Depois de confirmar o e-mail, entre para revisar e enviar os dados da empresa para análise."
                  : "Depois de confirmar o e-mail, entre e preencha novamente os dados da empresa neste navegador."}
              </p>
              {(!success.profileSaved || !success.displayNameSaved) && (
                <p className="sa-notice">Confira os dados do perfil após entrar. Parte deles não pôde ser salva.</p>
              )}
              <a className="sa-submit" href="#/acesso?modo=login">Ir para o login</a>
            </section>
          ) : register ? (
            <>
              <div className="sa-form-heading">
                <h1 ref={title} tabIndex={-1}>{step === 0 ? "Crie sua conta" : "Dados da empresa"}</h1>
                {step === 0 && <p>Informe seus dados para começar.</p>}
              </div>
              <ol className="sa-steps" aria-label="Etapas do cadastro">
                <li aria-current={step === 0 ? "step" : undefined}>
                  {step === 0 ? (
                    <span className="sa-step"><span className="sa-step-number" aria-hidden="true">1</span> Conta</span>
                  ) : (
                    <button type="button" className="sa-step" aria-label="Voltar à etapa 1, Conta" disabled={busy} onClick={() => {
                      setStep(0);
                      setStatus("");
                      setErrors({});
                      window.scrollTo(0, 0);
                    }}>
                      <span className="sa-step-number" aria-hidden="true">1</span> Conta
                    </button>
                  )}
                </li>
                <li aria-current={step === 1 ? "step" : undefined}>
                  <span className="sa-step"><span className="sa-step-number" aria-hidden="true">2</span> Empresa</span>
                </li>
              </ol>
              <form id="register-form" noValidate onSubmit={submitRegistration}>
                <fieldset disabled={busy}>
                  {step === 0 ? (
                    <>
                      <div className="sa-row">
                        {personalField("firstName", "Nome", "text", "given-name")}
                        {personalField("lastName", "Sobrenome", "text", "family-name")}
                      </div>
                      {personalField("email", "E-mail", "email", "email", "nome@empresa.com")}
                      {personalField("password", "Senha", "password", "new-password", "Crie uma senha")}
                      {personalField("confirmPassword", "Confirmar senha", "password", "new-password", "Repita a senha")}
                    </>
                  ) : (
                    <>
                      <Field label="Nome da empresa" id="company-name" name="name" placeholder="Ex.: Metalúrgica Horizonte" autoComplete="organization" maxLength={120} value={values.name} onChange={change} error={errors.name} />
                      <Field label="CNPJ" id="company-cnpj" name="cnpj" placeholder="14 caracteres" autoComplete="off" maxLength={cnpjLength} value={values.cnpj} onChange={change} onPaste={pasteCnpj} error={errors.cnpj} />
                      <div className="sa-row sa-row--city">
                        <Field label="Cidade" id="company-city" name="city" placeholder="Ex.: Diadema" autoComplete="address-level2" maxLength={100} value={values.city} onChange={change} error={errors.city} />
                        <div className="sa-field">
                          <label htmlFor="company-state">UF</label>
                          <select id="company-state" name="state" autoComplete="address-level1" value={values.state} onChange={(event) => change("state", event.target.value)} aria-invalid={Boolean(errors.state)} aria-describedby={errors.state ? "company-state-error" : undefined}>
                            {states.map((state) => <option key={state}>{state}</option>)}
                          </select>
                          {errors.state && <small className="sa-error" id="company-state-error">{errors.state}</small>}
                        </div>
                      </div>
                      <Field label="Telefone ou e-mail de contato" id="company-contact" name="contact" placeholder="contato@empresa.com" maxLength={120} value={values.contact} onChange={change} error={errors.contact} />
                      <div className="sa-field">
                        <label htmlFor="signup-plan">Atuação da empresa</label>
                        <select id="signup-plan" value={plan} onChange={(event) => setPlan(event.target.value)}>
                          {PUBLIC_PLANS.map(({ id, roles }) => (
                            <option key={id} value={id}>
                              {roles.length === 2 ? "Comprar e fornecer" : roles[0] === "buyer" ? "Comprar" : "Fornecer"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  {statusRegion}
                  <button type="submit" className="sa-submit" aria-describedby="access-terms">
                    {busy ? "Criando sua conta…" : step === 0 ? "Continuar para dados da empresa" : "Criar conta"}
                  </button>
                </fieldset>
              </form>
              {switchMode}
              {terms}
            </>
          ) : (
            <>
              <div className="sa-form-heading">
                <h1 ref={title} tabIndex={-1}>{reset ? "Recupere seu acesso" : "Bem-vindo de volta ao SIVI!"}</h1>
                {reset && <p>Informe o e-mail usado no cadastro.</p>}
              </div>
              <form id="login-form" noValidate onSubmit={login}>
                <fieldset disabled={busy}>
                  <Field id="login-email" label="E-mail" name="email" type="email" placeholder="nome@empresa.com" autoComplete="username" maxLength={254} value={loginEmail} onChange={(_: string, value: string) => setLoginEmail(value)} />
                  {!reset && (
                    <>
                      <Field
                        id="login-password"
                        label="Senha"
                        name="password"
                        type="password"
                        placeholder="Sua senha"
                        autoComplete="current-password"
                        maxLength={128}
                        value={loginPassword}
                        onChange={(_: string, value: string) => setLoginPassword(value)}
                        labelAction={
                          <button className="sa-reset" type="button" data-reset-password onClick={() => { setReset(true); setStatus(""); }}>
                            Esqueci minha senha
                          </button>
                        }
                      />
                    </>
                  )}
                  {statusRegion}
                  <button type="submit" className="sa-submit" aria-describedby={reset ? undefined : "access-terms"}>
                    {busy ? "Aguarde…" : reset ? "Enviar orientações" : "Entrar"}
                  </button>
                  {reset && (
                    <button className="sa-reset sa-reset--return" type="button" data-reset-password onClick={() => { setReset(false); setStatus(""); }}>
                      Voltar ao login
                    </button>
                  )}
                </fieldset>
              </form>
              {!reset && (
                <>
                  <div className="sa-divider"><span>ou</span></div>
                  <div className="sa-providers">
                    <button type="button" disabled={busy} data-provider="google" aria-describedby="access-terms" onClick={() => provider("google")}>
                      <img src="./assets/sign-in-google.png" width={18} height={18} alt="" />
                      Entrar com Google
                    </button>
                    <button type="button" disabled={busy} data-provider="apple" aria-describedby="access-terms" onClick={() => provider("apple")}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                      </svg>
                      Entrar com Apple
                    </button>
                  </div>
                  {switchMode}
                  {terms}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <AuthStory register={register} />
    </div>
  );
}
