import { ClipboardCheck, FileText, Layers3, PackageCheck, type LucideIcon } from "lucide-react";

type PurchaseExample = {
  id: string;
  step: number;
  Icon: LucideIcon;
  title: string;
  context: string;
  walkthrough: string;
  record: string;
  fields: [string, string][];
};

export const purchaseExamples: PurchaseExample[] = [
  {
    id: "ficha-de-demanda",
    step: 1,
    Icon: FileText,
    title: "Ficha de demanda",
    context: "Uma empresa precisa encomendar 240 peças em alumínio. Para cotar corretamente, o fornecedor precisa saber qual liga usar e qual processo está previsto.",
    walkthrough: "O comprador descreve o item, indica material, processo e quantidade e publica a demanda. O fornecedor consulta a especificação antes de preparar a proposta.",
    record: "Os requisitos ficam disponíveis no contexto da demanda que deu origem à negociação.",
    fields: [["Material", "Alumínio 6061"], ["Processo", "Usinagem CNC"], ["Quantidade", "240 peças"]],
  },
  {
    id: "comparacao-de-propostas",
    step: 3,
    Icon: Layers3,
    title: "Comparação de propostas",
    context: "Uma cotação tem o menor preço e outra atende a um prazo mais curto. A escolha também depende do frete e das condições de pagamento.",
    walkthrough: "O comprador compara as propostas da mesma demanda. Se o fornecedor ajustar preço ou prazo, envia uma revisão e a versão anterior continua disponível.",
    record: "Quando a proposta é aceita, o pedido preserva os itens e as condições daquela versão.",
    fields: [["Preço", "Valor da proposta"], ["Prazo", "Dias para entrega"], ["Condições", "Frete e pagamento"]],
  },
  {
    id: "registro-de-inspecao",
    step: 5,
    Icon: ClipboardCheck,
    title: "Registro de inspeção",
    context: "Antes da expedição, o fornecedor precisa registrar o que foi conferido e o que ainda está pendente em cada item do pedido.",
    walkthrough: "O fornecedor informa o plano de inspeção, as evidências e a quantidade aprovada. As pendências precisam ser resolvidas antes da liberação.",
    record: "O pedido mantém o resultado da inspeção por item para consulta das duas empresas.",
    fields: [["Verificação", "Plano de inspeção"], ["Resultado", "Quantidade aprovada"], ["Pendências", "Por item"]],
  },
  {
    id: "recebimento-do-pedido",
    step: 7,
    Icon: PackageCheck,
    title: "Recebimento do pedido",
    context: "O fornecedor registrou a expedição. A compradora ainda precisa conferir se o material chegou antes de encerrar a compra.",
    walkthrough: "Depois de receber os itens, o comprador confirma o recebimento e pode avaliar o fornecimento. O fornecedor acompanha a confirmação pelo pedido.",
    record: "A expedição, o recebimento e a avaliação ficam associados ao pedido já concluído.",
    fields: [["Fornecedor", "Registra a expedição"], ["Comprador", "Confirma o recebimento"], ["Histórico", "Pedido e avaliação"]],
  },
];

export function PurchaseRecord({ example }: { example: PurchaseExample }) {
  const { Icon, title, fields } = example;
  return (
    <div className="sv-quote sv-editorial-record">
      <div className="sv-quote-heading">
        <span><Icon size={18} aria-hidden="true" /> {title}</span>
        <small>Exemplo</small>
      </div>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </div>
  );
}
