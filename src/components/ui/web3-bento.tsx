// Fragmento de gráfico adaptado do web3-bento.tsx fornecido pelo responsável.
import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SlidingIndicator } from "../../public/motion/SlidingIndicator";
import NumberFlow from "@number-flow/react";
import { Check, FileText, ArrowUpRight } from "lucide-react";
import { exampleOperations, money } from "../../domain/public-signup.js";

const stageColors = [
  "var(--sv-orange)",
  "color-mix(in srgb, var(--sv-dark), var(--sv-paper) 55%)",
  "var(--sv-dark)",
  "var(--sv-ink)",
];

export function IndustrialBento() {
  const [range, setRange] = useState("90"),
    [hover, setHover] = useState<number | null>(null);
  const [role, setRole] = useState("buyer");
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const operations = exampleOperations(range, role),
    data = operations.series;
  const buying = role === "buyer",
    proposalLabel = buying ? "recebidas" : "enviadas";
  const W = 600,
    H = 180;
  const points = data.values.map((v, i) => [
    (i / (data.values.length - 1)) * W,
    H - 20 - (v / 18) * (H - 35),
  ]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const active = hover ?? data.values.length - 1;
  return (
    <div className="sv-demo" data-ui="industrial-demo">
      <div className="sv-demo-header">
        <div>
          <img
            src="./src/assets/brand/raposa.svg"
            alt=""
            width="23"
            height="23"
          />
          <strong>
            SIVI{" "}
            <span>
              / {buying ? "Visão de compras" : "Visão de fornecimento"}
            </span>
          </strong>
        </div>
        <span className="sv-example-label">
          Demonstração · dados ilustrativos
        </span>
      </div>
      <div className="sv-demo-body">
        <div className="sv-demo-sidebar" aria-hidden="true">
          <span className="is-active">Visão geral</span>
          <span>Demandas</span>
          <span>Propostas</span>
          <span>Pedidos</span>
          <span>Fornecedores</span>
          <div>
            METALÚRGICA EXEMPLO
            <br />
            <small>Atuação {buying ? "compradora" : "fornecedora"}</small>
          </div>
        </div>
        <div className="sv-demo-main">
          <div className="sv-demo-title">
            <div>
              <small>Acordos que viram registros</small>
              <h3>
                {buying
                  ? "O movimento da sua compra."
                  : "Sua capacidade em movimento."}
              </h3>
            </div>
            <div
              className="sv-demo-role t-tabs"
              role="group"
              aria-label="Atuação da demonstração"
            >
              <SlidingIndicator selected={role} />
              {[
                ["buyer", "Comprador"],
                ["supplier", "Fornecedor"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  aria-pressed={role === value}
                  onClick={() => {
                    setRole(value);
                    setHover(null);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="sv-demo-cards">
            <div>
              <span>Propostas {proposalLabel}</span>
              <strong>
                <NumberFlow value={data.total} animated={!reduced} />
              </strong>
              <small>No período ilustrativo selecionado</small>
            </div>
            <div>
              <span>Demanda em destaque</span>
              <strong>Usinagem CNC</strong>
              <small>Alumínio 6061 · 240 peças</small>
            </div>
            <div>
              <span>Pedido de exemplo</span>
              <strong className="sv-status">
                <i />
                Em inspeção
              </strong>
              <small>Condições aceitas preservadas</small>
            </div>
          </div>
          <div className="sv-chart">
            <div className="sv-chart-top">
              <div>
                <h4>Propostas {proposalLabel} por semana</h4>
                <p>
                  {data.total} propostas em {data.values.length} semanas de
                  exemplo
                </p>
              </div>
              <div
                className="sv-chart-filter t-tabs"
                role="group"
                aria-label="Período do gráfico"
              >
                <SlidingIndicator selected={range} />
                {["30", "60", "90"].map((value) => (
                  <button
                    key={value}
                    aria-pressed={range === value}
                    onClick={() => {
                      setRange(value);
                      setHover(null);
                    }}
                  >
                    {value} dias
                  </button>
                ))}
              </div>
            </div>
            <div
              className="sv-chart-area"
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHover(
                  Math.max(
                    0,
                    Math.min(
                      data.values.length - 1,
                      Math.round(
                        ((e.clientX - rect.left) / rect.width) *
                          (data.values.length - 1),
                      ),
                    ),
                  ),
                );
              }}
              onPointerLeave={() => setHover(null)}
            >
              <svg
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                role="img"
                aria-label={`${data.total} propostas ilustrativas, distribuídas por ${data.values.length} semanas`}
              >
                <defs>
                  <linearGradient id={`${uid}fill`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--sv-orange)" stopOpacity=".25" />
                    <stop offset="1" stopColor="var(--sv-orange)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((f) => (
                  <line
                    key={f}
                    x1="0"
                    x2={W}
                    y1={H * f}
                    y2={H * f}
                    stroke="var(--sv-line)"
                    strokeDasharray="2 5"
                  />
                ))}
                <path
                  d={`${line} L${W},${H} L0,${H} Z`}
                  fill={`url(#${uid}fill)`}
                />
                <motion.path
                  key={`${role}-${range}`}
                  d={line}
                  fill="none"
                  stroke="color-mix(in srgb, var(--sv-orange), var(--sv-ink) 25%)"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: reduced ? 0 : 0.45 }}
                />
                <circle
                  cx={points[active][0]}
                  cy={points[active][1]}
                  r="5"
                  fill="color-mix(in srgb, var(--sv-orange), var(--sv-ink) 25%)"
                  stroke="white"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <div className="sv-chart-axis">
              <span>Início do período</span>
              <span aria-live="polite">
                Semana {active + 1}: {data.values[active]} propostas
              </span>
              <span>Final</span>
            </div>
            <details className="sv-data-table">
              <summary>Consultar dados do gráfico</summary>
              <table>
                <caption>Valores ilustrativos por semana</caption>
                <thead>
                  <tr>
                    <th>Semana</th>
                    <th>Propostas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.values.map((v, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
          <div className="sv-demo-detail-grid">
            <section
              className="sv-demo-comparison"
              aria-label={
                buying
                  ? "Comparação ilustrativa de propostas"
                  : "Revisões ilustrativas da proposta"
              }
            >
              <h4>
                {buying ? "Condições em comparação" : "Versões da proposta"}
              </h4>
              <p>240 peças · usinagem CNC · valores de exemplo</p>
              <ul>
                {operations.quotes.map((quote) => (
                  <li key={quote.label}>
                    <div>
                      <strong>{quote.label}</strong>
                      <span>
                        {money(quote.amount)} <small>· {quote.days} dias</small>
                      </span>
                    </div>
                    <span className="sv-quote-track" aria-hidden="true">
                      <motion.i
                        initial={false}
                        animate={{ width: `${(quote.amount / 24000) * 100}%` }}
                        transition={{ duration: reduced ? 0 : 0.5 }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
              <small>
                {buying
                  ? "Compare também frete e pagamento antes do aceite."
                  : "Cada revisão mantém a versão anterior no histórico."}
              </small>
            </section>
            <section
              className="sv-demo-distribution"
              aria-label="Distribuição ilustrativa dos pedidos"
            >
              <h4>Pedidos por etapa</h4>
              <p>
                {operations.orders.length} pedidos ilustrativos no período
                selecionado
              </p>
              <div className="sv-stage-bar" aria-hidden="true">
                {operations.stages.map((stage, i) => (
                  <motion.span
                    key={stage.name}
                    style={{ background: stageColors[i] }}
                    animate={{
                      flexBasis: `${(stage.count / operations.orders.length) * 100}%`,
                    }}
                    transition={{ duration: reduced ? 0 : 0.5 }}
                  />
                ))}
              </div>
              <ul>
                {operations.stages.map((stage, i) => (
                  <li key={stage.name}>
                    <span>
                      <i
                        aria-hidden="true"
                        style={{ background: stageColors[i] }}
                      />
                      {stage.name}
                    </span>
                    <strong>{stage.count}</strong>
                  </li>
                ))}
              </ul>
              <small>A distribuição acompanha o período e a atuação.</small>
            </section>
          </div>
          <div className="sv-demo-record">
            <FileText size={19} />
            <div>
              <strong>Uma referência para os dois lados</strong>
              <span>Especificações e condições registradas no pedido.</span>
            </div>
            <Check size={18} />
          </div>
        </div>
      </div>
      <div className="sv-demo-foot">
        <span>
          Exemplo de uso: os números não representam atividade real do SIVI.
        </span>
        <ArrowUpRight size={16} />
      </div>
    </div>
  );
}
