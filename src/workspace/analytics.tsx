import { useId, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { ArrowUpRight, ChartNoAxesColumn, ChevronDown, Table2 } from 'lucide-react';
import { buildWorkspaceInsights } from '../domain/workspace-insights.js';
import './analytics.css';

type Records = { demands?: any[]; proposals?: any[]; orders?: any[] };
type Props = { records: Records; role?: string; now?: number };
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const number = new Intl.NumberFormat('pt-BR');
const compactNumber = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
const periods = [30, 60, 90];
const gridLines = [4, 3, 2, 1, 0];
const shortDate = (date: string) => date.slice(8, 10) + '/' + date.slice(5, 7);
const fullDate = (date: string) => shortDate(date) + '/' + date.slice(0, 4);
const kinds = (role: string) => [
  { id: 'proposals', label: 'Propostas', detail: role === 'supplier' ? 'propostas enviadas' : 'propostas recebidas' },
  { id: 'orders', label: 'Pedidos', detail: 'pedidos criados' },
  { id: 'demands', label: role === 'supplier' ? 'Oportunidades' : 'Demandas', detail: role === 'supplier' ? 'oportunidades acessíveis criadas' : 'demandas criadas' },
];

export function WorkspaceAnalytics({ records, role = 'buyer', now }: Props) {
  const [days, setDays] = useState(90);
  const [kind, setKind] = useState('proposals');
  const [selectedInterval, setSelectedInterval] = useState<string | null>(null);
  const [asOf] = useState(() => now ?? Date.now());
  const reduced = useReducedMotion();
  const headingId = useId();
  const portfolioId = useId();
  const data = useMemo(() => buildWorkspaceInsights(records, { role, days, now: asOf }), [records, role, days, asOf]);
  const options = kinds(role);
  const selection = options.find(item => item.id === kind)!;
  const total = data.totals[kind];
  const step = Math.max(1, Math.ceil(Math.max(...data.series.map(row => row[kind])) / 4));
  const activeInterval = data.series.find(row => row.start === selectedInterval)
    ?? data.series.reduce((last, row) => row[kind] > 0 ? row : last, data.series[0]);
  const portfolioSegments = data.portfolio.filter(item => item.count > 0);
  const orderCount = portfolioSegments.reduce((sum, row) => sum + row.count, 0);
  const missing = data.omitted[kind];
  const destination = role === 'supplier' ? '#/app/fornecedor/oportunidades' : '#/app/comprador/demandas';
  const ordersPath = role === 'supplier' ? '#/app/fornecedor/pedidos' : '#/app/comprador/pedidos';

  return <section className="workspace-insights" data-workspace-insights aria-label="Indicadores da operação">
    <section className="workspace-insights__movement" aria-labelledby={headingId}>
      <div className="workspace-insights__heading">
        <div>
          <h2 id={headingId}>Atividade da operação</h2>
          <p>{fullDate(data.period.start)} a {fullDate(data.period.end)} · horário de São Paulo</p>
        </div>
        <div className="workspace-insights__period" role="group" aria-label="Período dos indicadores">
          {periods.map(value => <button key={value} type="button" aria-pressed={days === value} onClick={() => { setDays(value); setSelectedInterval(null); }}>{value} dias</button>)}
        </div>
      </div>
      <div className="workspace-insights__tabs" role="group" aria-label="Tipo de atividade">
        {options.map(option => <button key={option.id} type="button" aria-pressed={kind === option.id} onClick={() => { setKind(option.id); setSelectedInterval(null); }}>{option.label}</button>)}
      </div>
      <div className="workspace-insights__figure">
        <output data-insight-total aria-label={selection.detail + ': ' + total} aria-live="polite">
          <NumberFlow value={total} locales="pt-BR" animated={!reduced} aria-hidden="true" />
        </output>
        <span>{selection.detail} no período</span>
      </div>
      {total > 0 ? <>
        <div className="workspace-insights__plot">
          <div className="workspace-insights__y-axis" aria-hidden="true">
            {gridLines.map(level => <span key={level}>{compactNumber.format(level * step)}</span>)}
          </div>
          <div className="workspace-insights__columns" role="group" aria-label="Criações por intervalo">
            {data.series.map(row => <button
              key={row.start}
              type="button"
              aria-label={row.label + ': ' + number.format(row[kind]) + ' · ' + selection.detail}
              aria-pressed={row.start === activeInterval.start}
              onClick={() => setSelectedInterval(row.start)}
            >
              <span className="workspace-insights__bar-track" aria-hidden="true">
                <span className="workspace-insights__bar" data-zero={row[kind] === 0} style={{ height: (row[kind] / (step * 4) * 100) + '%' }} />
              </span>
              <span>{shortDate(row.start)}</span>
            </button>)}
          </div>
        </div>
        <p className="workspace-insights__interval" role="status">
          <span>{activeInterval.label}</span><strong>{number.format(activeInterval[kind])} no intervalo</strong>
        </p>
      </> : <div className="workspace-insights__empty">
        <ChartNoAxesColumn size={20} aria-hidden="true" />
        <p>Nenhuma criação registrada neste período.</p>
      </div>}
      {missing > 0 && <p className="workspace-insights__note">{missing} {selection.label.toLocaleLowerCase('pt-BR')} sem data de criação válida não entram nesta série.</p>}
      {role === 'supplier' && kind === 'demands' && <p className="workspace-insights__note">Data de criação das oportunidades atualmente acessíveis; não mede quando foram liberadas.</p>}
      <details className="workspace-insights__data">
        <summary><Table2 size={16} aria-hidden="true" />Consultar dados do período<ChevronDown size={16} aria-hidden="true" /></summary>
        <div>
          <table>
            <caption>Criações por intervalo · {days} dias</caption>
            <thead><tr><th scope="col">Intervalo</th>{options.map(option => <th scope="col" key={option.id}>{option.label}</th>)}</tr></thead>
            <tbody>{data.series.map(row => <tr key={row.start}><th scope="row">{row.label}</th>{options.map(option => <td key={option.id}>{number.format(row[option.id])}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
    <section className="workspace-insights__portfolio" aria-labelledby={portfolioId}>
      <div className="workspace-insights__heading">
        <div><h2 id={portfolioId}>Carteira de pedidos</h2><p>Estado atual · todos os períodos</p></div>
      </div>
      <div className="workspace-insights__order-summary">
        <div><span>Total de pedidos</span><strong data-portfolio-total>{number.format(orderCount)}</strong></div>
        <div><span>Valor registrado</span><strong>{money.format(data.orderValueCents / 100)}</strong></div>
      </div>
      {orderCount > 0 ? <>
        <div className="workspace-insights__distribution" aria-hidden="true">
          {portfolioSegments.map(item => <span key={item.id} className={'workspace-insights__status--' + item.tone} style={{ flexGrow: item.count }} />)}
        </div>
        <ul className="workspace-insights__legend" aria-label="Pedidos por status">
          {portfolioSegments.map(item => <li key={item.id}>
            <i className={'workspace-insights__status--' + item.tone} aria-hidden="true" />
            <span>{item.label}</span><strong>{number.format(item.count)}</strong>
          </li>)}
        </ul>
      </> : <p className="workspace-insights__portfolio-empty">Seus pedidos aparecerão aqui após o aceite.</p>}
      <p className="workspace-insights__value-note">
        {data.incompleteOrderValues ? data.incompleteOrderValues + ' pedido(s) com valor incompleto fora da soma. ' : ''}
        Inclui frete. Não representa pagamento recebido.
      </p>
      <a className="workspace-insights__link" href={orderCount ? ordersPath : destination}>
        {orderCount ? 'Acompanhar pedidos' : role === 'supplier' ? 'Ver oportunidades' : 'Ver minhas demandas'}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </section>
  </section>;
}
