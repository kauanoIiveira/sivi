// Adaptado do pricing-section.tsx fornecido pelo responsável (21st.dev).
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Check,
  ShoppingBag,
  Factory,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { PUBLIC_PLANS, planQuote, money } from "../../domain/public-signup.js";
import { Reveal, signupLink } from "../../public/components";

export function PricingSection() {
  const [period, setPeriod] = useState("mensal");
  const reduced = useReducedMotion();
  return (
    <section className="sv-pricing sv-shell" aria-labelledby="planos">
      <Reveal className="sv-section-heading">
        <div>
          <h2 id="planos" tabIndex={-1}>
            O plano certo para
            <br />o seu próximo passo.
          </h2>
        </div>
        <p>
          Escolha o lado da negociação.
          <br />
          Ou faça parte dos dois.
        </p>
      </Reveal>
      <div className="sv-pricing-toolbar">
        <div
          className="sv-period"
          role="group"
          aria-label="Periodicidade dos planos"
        >
          {["mensal", "anual"].map((value) => (
            <button
              key={value}
              aria-label={value === "anual" ? "Anual" : "Mensal"}
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
            >
              {period === value && (
                <motion.span
                  className="sv-period-indicator"
                  layoutId="pricing-period"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 450, damping: 35 }
                  }
                />
              )}
              <span>{value === "anual" ? "Anual" : "Mensal"}</span>
              {value === "anual" && <small>Menor valor</small>}
            </button>
          ))}
        </div>
        <p>Pagamento demonstrativo · Nenhum valor será cobrado</p>
      </div>
      <div className="sv-plan-grid">
        {PUBLIC_PLANS.map((plan, index) => {
          const quote = planQuote(plan.id, period);
          const Icon = [ShoppingBag, Factory, Layers][index];
          return (
            <Reveal key={plan.id} delay={index * 0.06}>
              <article
                className={`sv-plan ${index === 2 ? "sv-plan--featured" : ""}`}
                data-plan={plan.id}
              >
                <div className="sv-plan-top">
                  <Icon size={22} aria-hidden="true" />
                  {index === 2 && <span>As duas atuações</span>}
                </div>
                <h3>{plan.name}</h3>
                <p>{plan.subtitle}</p>
                <div className="sv-price">
                  <span>R$</span>
                  <NumberFlow
                    value={quote.monthly}
                    locales="pt-BR"
                    animated={!reduced}
                  />
                  <small>/mês</small>
                </div>
                <p className="sv-price-condition">
                  {period === "anual"
                    ? `${money(quote.total)} por ano, em uma única contratação.`
                    : "Proposta de assinatura mensal."}
                </p>
                <a
                  className="sv-plan-button"
                  href={signupLink(plan.id, period)}
                >
                  Escolher {plan.name}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <div className="sv-plan-features">
                  <span>O que está incluído</span>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <div className="sv-plan-shared">
        <strong>Em todos os planos</strong>
        <span>Histórico dos acordos</span>
        <span>Conta com e-mail confirmado</span>
        <span>Empresa sujeita à análise</span>
      </div>
      <p className="sv-pricing-note">
        Valores propostos para a futura oferta comercial. Nesta versão, o
        cadastro cria uma conta real com um formulário de pagamento de teste.
        Não há cobrança, renovação automática ou assinatura financeira ativa. O
        pagamento dos pedidos é combinado entre as empresas.
      </p>
    </section>
  );
}
