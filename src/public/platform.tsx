import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Arrow, Action, publicLink, signupLink } from "./components";
import { PublicLayout } from "./public-layout";
import { purchaseExamples } from "./purchase-examples";
import SplitText from "./motion/SplitText";

const recordMotion = {
  hidden: {},
  visible: { transition: { staggerChildren: .045 } },
};

const recordItemMotion = {
  hidden: { x: 15, opacity: 0, clipPath: "inset(0 0 30% 0)" },
  visible: {
    x: 0, opacity: 1, clipPath: "inset(0 0 0% 0)",
    transition: { duration: .38, ease: "easeOut" as const },
  },
  settled: { x: 0, opacity: 1, clipPath: "inset(0)", transition: { duration: 0 } },
};

const roles = [
  { id: "buyer", label: "Quero comprar", anchor: "compras", panelLabel: "Comprador" },
  { id: "supplier", label: "Quero fornecer", anchor: "fornecimento", panelLabel: "Fornecedor" },
] as const;

type Role = (typeof roles)[number]["id"];
type RecordCopy = { title: string; description: string; rows: [string, string][] };
type PurchaseStage = { label: string; status: string; buyer: RecordCopy; supplier: RecordCopy };

const stages = {
  demand: {
    label: "Demanda",
    status: "Publicada",
    buyer: {
      title: "Especifique os itens da compra.",
      description: "Publique os requisitos da peça e informe quando precisa recebê-la.",
      rows: [...purchaseExamples[0].fields, ["Prazo desejado", "12 dias"], ["Compatibilidade", "Confira os requisitos atendidos e os itens que ainda precisam de confirmação."]],
    },
    supplier: {
      title: "Confira se a demanda é compatível.",
      description: "Consulte os requisitos e compare o que foi pedido com o perfil industrial da sua empresa.",
      rows: [...purchaseExamples[0].fields, ["Compatibilidade", "O material e a usinagem constam no perfil. Confirme a disponibilidade para o prazo."]],
    },
  },
  proposals: {
    label: "Propostas",
    status: "Em cotação",
    buyer: {
      title: "Compare as condições da compra.",
      description: "Confira preço, prazo, frete e pagamento. As versões anteriores ficam disponíveis no histórico.",
      rows: [["Proposta A", "R$ 4.800 · 12 dias · frete a combinar"], ["Proposta B", "R$ 5.280 · 8 dias · frete incluso"], ["Versão da proposta B", "2 · pagamento em 30 dias"]],
    },
    supplier: {
      title: "Envie suas condições de fornecimento.",
      description: "Registre uma proposta por item. Se as condições mudarem, envie uma nova versão.",
      rows: [["Proposta", "B · versão 2"], ["Valor", "R$ 5.280"], ["Prazo, frete e pagamento", "8 dias · frete incluso · 30 dias"]],
    },
  },
  order: {
    label: "Pedido",
    status: "Aceito",
    buyer: {
      title: "Consulte o que foi aceito.",
      description: "O aceite da proposta gera um pedido com os itens e as condições daquela versão.",
      rows: [["Origem", "Proposta B · versão 2"], ["Itens", "240 peças em alumínio 6061"], ["Condições aceitas", "R$ 5.280 · 8 dias · frete incluso · pagamento em 30 dias"]],
    },
    supplier: {
      title: "Execute o fornecimento pelo pedido.",
      description: "Use a versão aceita como referência para preparar os itens e acompanhar as próximas ações.",
      rows: [["Origem", "Proposta B · versão 2"], ["Itens", "240 peças em alumínio 6061"], ["Condições aceitas", "R$ 5.280 · 8 dias · frete incluso · pagamento em 30 dias"]],
    },
  },
  inspection: {
    label: "Inspeção e expedição",
    status: "Expedido",
    buyer: {
      title: "Acompanhe a inspeção e a expedição.",
      description: "Consulte a liberação das peças e o registro de saída no histórico do pedido.",
      rows: [["Inspeção", "240 de 240 peças aprovadas"], ["Evidências", "Resultado da inspeção por item"], ["Expedição", "Registrada após a liberação"]],
    },
    supplier: {
      title: "Registre a qualidade e a saída.",
      description: "Informe a inspeção por item e registre a expedição quando o pedido estiver liberado.",
      rows: [["Inspeção", "Plano, evidências e 240 peças aprovadas"], ["Liberação", "Pedido liberado para expedição"], ["Expedição", "Saída registrada pelo fornecedor"]],
    },
  },
  receipt: {
    label: "Recebimento",
    status: "Recebido",
    buyer: {
      title: "Confirme que o pedido chegou.",
      description: "Registre o recebimento e, se desejar, avalie o fornecimento.",
      rows: [["Recebimento", "240 peças recebidas"], ["Confirmação", "Registrada pelo comprador"], ["Histórico", "O pedido permanece disponível para consulta"]],
    },
    supplier: {
      title: "Confira a confirmação do comprador.",
      description: "Acompanhe a conclusão do pedido e consulte a avaliação quando estiver disponível.",
      rows: [["Recebimento", "240 peças recebidas"], ["Confirmação", "Registrada pelo comprador"], ["Histórico", "Expedição, recebimento e avaliação vinculados ao pedido"]],
    },
  },
} satisfies Record<string, PurchaseStage>;

type Step = keyof typeof stages;
const legacySteps: Step[] = ["demand", "demand", "proposals", "order", "inspection", "inspection", "receipt"];
const orderedSteps = Object.keys(stages) as Step[];

function resolveDemoSelection(params: URLSearchParams): { role: Role; step: Step } {
  const number = Number(params.get("etapa"));
  return {
    role: params.get("secao") === "fornecimento" ? "supplier" : "buyer",
    step: Number.isInteger(number) ? legacySteps[number - 1] ?? "demand" : "demand",
  };
}

export function PlatformPage() {
  const [selection, setSelection] = useState(() => resolveDemoSelection(new URLSearchParams(location.hash.split("?")[1])));
  const previewRecord = useRef<HTMLDivElement>(null);
  const recordInView = useInView(previewRecord, { once: true, margin: "0px 0px -8% 0px" });
  const reducedMotion = useReducedMotion();
  const stage = stages[selection.step];
  const record = stage[selection.role];
  const perspective = roles.find(({ id }) => id === selection.role)?.panelLabel;

  return (
    <PublicLayout page="platform" lightHeader editorial>
      <section className="sv-shell sv-editorial-intro sv-editorial-platform" aria-labelledby="public-title">
        <div>
          <SplitText id="public-title" className="sv-editorial-title" tag="h1" tabIndex={-1}
            text="Uma compra industrial, da demanda ao recebimento" textAlign="start" trigger="load"
            splitType="words, chars" duration={.78} delay={16}
            from={{ opacity: 0, yPercent: 62, rotationX: -48, transformPerspective: 480, transformOrigin: "50% 100%" }}
            to={{ opacity: 1, yPercent: 0, rotationX: 0 }} />
          <SplitText className="sv-editorial-lead" textAlign="start" trigger="load" splitType="lines"
            text="Explore a mesma negociação pelos dois lados e veja o que cada empresa faz em cada etapa."
            effect="fade" startDelay={.26} duration={.58} delay={80} />
          <div className="sv-purchase-preview-roles" role="group" aria-label="Perspectiva da compra">
            {roles.map(({ id, label, anchor }) => (
              <button id={anchor} key={id} type="button" aria-pressed={selection.role === id}
                aria-controls="registro-de-compra" onClick={() => setSelection(current => ({ ...current, role: id }))}>
                {label}
              </button>
            ))}
          </div>
          <Action className="sv-editorial-action" href={signupLink(selection.role)}>Cadastrar empresa</Action>
        </div>
        <section id="funcionamento" className="sv-editorial-demo" aria-label="Etapas da demonstração" tabIndex={-1}>
          <div className="sv-purchase-preview-bar">
            <strong>Exemplo de compra</strong>
            <span>{perspective}</span>
          </div>
          <div className="sv-purchase-preview-steps" role="group" aria-label="Etapas da compra">
            {orderedSteps.map((step, index) => (
              <button key={step} type="button" aria-pressed={selection.step === step} aria-controls="registro-de-compra"
                onClick={() => setSelection(current => ({ ...current, step }))}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {stages[step].label}
              </button>
            ))}
          </div>
          <div ref={previewRecord} id="registro-de-compra" className="sv-purchase-preview-record" data-demo-step={selection.step} data-demo-role={selection.role} aria-live="polite">
            <motion.div key={selection.role + selection.step} initial={reducedMotion ? false : "hidden"}
              animate={reducedMotion ? "settled" : recordInView ? "visible" : "hidden"} variants={recordMotion}>
              <motion.p className="sv-purchase-preview-status" variants={recordItemMotion}>{stage.status}</motion.p>
              <motion.h2 variants={recordItemMotion}>{record.title}</motion.h2>
              <motion.p className="sv-purchase-preview-description" variants={recordItemMotion}>{record.description}</motion.p>
              <dl>
                {record.rows.map(([key, value]) => (
                  <motion.div key={key} variants={recordItemMotion}><dt>{key}</dt><dd>{value}</dd></motion.div>
                ))}
              </dl>
            </motion.div>
          </div>
        </section>
      </section>
      <section className="sv-editorial-section sv-editorial-story" aria-labelledby="proximo-passo">
        <div className="sv-shell sv-editorial-close sv-platform-next">
          <div className="sv-editorial-copy">
            <SplitText id="proximo-passo" className="sv-editorial-subtitle" tag="h2" textAlign="start" splitType="lines" mask
              text="Da conta à primeira negociação." duration={.84} delay={110} threshold={.14} rootMargin="0px"
              from={{ xPercent: -35, opacity: 0 }} to={{ xPercent: 0, opacity: 1 }} />
            <SplitText textAlign="start" splitType="lines" effect="blur" startDelay={.16} duration={.7} delay={72}
              text="Crie seu acesso, confirme o e-mail e envie os dados da empresa para análise. A atuação escolhida define o que sua empresa pode fazer na plataforma." />
          </div>
          <a className="sv-editorial-link" href={publicLink("faq")}>Consultar perguntas frequentes <Arrow /></a>
        </div>
      </section>
    </PublicLayout>
  );
}
