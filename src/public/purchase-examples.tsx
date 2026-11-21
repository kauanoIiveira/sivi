import { ClipboardCheck, FileText, Layers3, PackageCheck, type LucideIcon } from "lucide-react";

type PurchaseExample = {
  id: string;
  step: number;
  Icon: LucideIcon;
  title: string;
  fields: [string, string][];
};

export const purchaseExamples: PurchaseExample[] = [
  {
    id: "ficha-de-demanda",
    step: 1,
    Icon: FileText,
    title: "Ficha de demanda",
    fields: [["Material", "Alumínio 6061"], ["Processo", "Usinagem CNC"], ["Quantidade", "240 peças"]],
  },
  {
    id: "comparacao-de-propostas",
    step: 3,
    Icon: Layers3,
    title: "Comparação de propostas",
    fields: [["Preço", "Valor da proposta"], ["Prazo", "Dias para entrega"], ["Condições", "Frete e pagamento"]],
  },
  {
    id: "registro-de-inspecao",
    step: 5,
    Icon: ClipboardCheck,
    title: "Registro de inspeção",
    fields: [["Verificação", "Plano de inspeção"], ["Resultado", "Quantidade aprovada"], ["Pendências", "Por item"]],
  },
  {
    id: "recebimento-do-pedido",
    step: 7,
    Icon: PackageCheck,
    title: "Recebimento do pedido",
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
