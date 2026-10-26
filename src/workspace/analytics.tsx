import { useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { ArrowUpRight, ChartNoAxesCombined, Package, Table2 } from 'lucide-react';
import { buildWorkspaceInsights } from '../domain/workspace-insights.js';
import './analytics.css';

type Records = { demands?: any[]; proposals?: any[]; orders?: any[] };
type Props = { records: Records; role?: string; now?: number };
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const kinds = (role: string) => [
  { id: 'proposals', label: 'Propostas', detail: role === 'supplier' ? 'propostas enviadas' : 'propostas recebidas' },
  { id: 'orders', label: 'Pedidos', detail: 'pedidos criados' },
  { id: 'demands', label: role === 'supplier' ? 'Oportunidades' : 'Demandas', detail: role === 'supplier' ? 'oportunidades acessíveis criadas' : 'demandas criadas' },
];
const curve = (points: number[][]) => points.reduce((path, point, index) => {
  if (!index) return `M ${point[0]} ${point[1]}`;
  const previous = points[index - 1];
  const middle = (previous[0] + point[0]) / 2;
  return `${path} C ${middle} ${previous[1]}, ${middle} ${point[1]}, ${point[0]} ${point[1]}`;
}, '');

export function WorkspaceAnalytics({ records, role = 'buyer', now }: Props) {
  const [days, setDays] = useState(90);
  const [kind, setKind] = useState('proposals');
  const [pointIndex, setPointIndex] = useState<number | null>(null);
  const [asOf] = useState(() => now ?? Date.now());
  const reduced = useReducedMotion();
  const headingId = useId();
  const portfolioId = useId();
  const data = useMemo(() => buildWorkspaceInsights(records, { role, days, now: asOf }), [records, role, days, asOf]);
  const options = kinds(role);
  const selection = options.find(item => item.id === kind)!;
  const total = data.totals[kind];
  const maximum = Math.max(4, Math.ceil(Math.max(...data.series.map(row => row[kind])) / 4) * 4);
  const points = data.series.map((row, index) => [4 + index * 126.4, 170 - row[kind] / maximum * 140]);
  const active = pointIndex ?? 5;
  const selectedPoint = points[active];
  const orderCount = data.portfolio.reduce((sum, row) => sum + row.count, 0);
  const missing = data.omitted[kind];
  const destination = role === 'supplier' ? '#/app/fornecedor/oportunidades' : '#/app/comprador/demandas';
  let offset = 0;

  return <section className="workspace-insights" data-workspace-insights aria-label="Indicadores da operação">
    <section className="workspace-insights__movement" aria-labelledby={headingId}>
      <div className="workspace-insights__heading">
        <div><h2 id={headingId}>O movimento da sua operação</h2><p>Registros criados no período · horário de São Paulo</p></div>
        <div className="workspace-insights__period" aria-label="Período dos indicadores">
          {[30, 60, 90].map(value => <button key={value} type="button" aria-pressed={days === value} onClick={() => { setDays(value); setPointIndex(null); }}>{value} dias</button>)}
        </div>
      </div>
      <div className="workspace-insights__tabs" aria-label="Tipo de atividade">
        {options.map(option => <button key={option.id} type="button" aria-label={option.label} aria-pressed={kind === option.id} onClick={() => { setKind(option.id); setPointIndex(null); }}><span>{option.label}</span><span aria-hidden="true">{data.totals[option.id]}</span></button>)}
      </div>
      <div className="workspace-insights__figure"><output data-insight-total aria-label={`${selection.detail}: ${total}`} aria-live="polite"><NumberFlow value={total} locales="pt-BR" animated={!reduced} aria-hidden="true" /></output><div><span>{selection.detail}</span><small>{data.period.start.split('-').reverse().join('/')} a {data.period.end.split('-').reverse().join('/')}</small></div><ChartNoAxesCombined size={24} aria-hidden="true" /></div>
      <div className="workspace-insights__plot" onPointerLeave={() => setPointIndex(null)}>
        <svg viewBox="0 0 640 200" role="img" aria-label={`${total} ${selection.detail} em seis intervalos. Dados na tabela abaixo.`} preserveAspectRatio="none">
          {[0, 1, 2, 3, 4].map(index => <line key={index} x1="0" x2="640" y1={30 + index * 35} y2={30 + index * 35} className="workspace-insights__grid" />)}
          <motion.path d={curve(points)} className="workspace-insights__curve" initial={false} animate={{ d: curve(points) }} transition={{ duration: reduced ? 0 : .35 }} />
          <line x1={selectedPoint[0]} x2={selectedPoint[0]} y1="25" y2="170" className="workspace-insights__guide" />
          {points.map((point, index) => <circle key={index} cx={point[0]} cy={point[1]} r={index === active ? 5 : 3} className="workspace-insights__point" />)}
        </svg>
        <div className="workspace-insights__y-axis" aria-hidden="true">{[0,1,2,3,4].map(index=><span key={index} style={{top:`${15+index*17.5}%`}}>{maximum-index*maximum/4}</span>)}</div>
        <div className="workspace-insights__hit-targets">{data.series.map((row, index) => <button key={row.start} type="button" aria-label={`${row.label}: ${row[kind]} ${selection.detail}`} onPointerEnter={() => setPointIndex(index)} onFocus={() => setPointIndex(index)} onBlur={() => setPointIndex(null)} onClick={() => setPointIndex(index)} />)}</div>
      </div>
      <div className="workspace-insights__axis"><span>{data.series[0].start.split('-').reverse().slice(0, 2).join('/')}</span><span>{data.series[active].label} <strong>{data.series[active][kind]} {selection.label.toLocaleLowerCase('pt-BR')}</strong></span><span>{data.series[5].end.split('-').reverse().slice(0, 2).join('/')}</span></div>
      {total === 0 && <p className="workspace-insights__empty">Nenhuma criação registrada neste período.</p>}
      {missing > 0 && <p className="workspace-insights__note">{missing} {selection.label.toLocaleLowerCase('pt-BR')} sem data de criação válida não entram nesta série.</p>}
      {role === 'supplier' && kind === 'demands' && <p className="workspace-insights__note">Data de criação das oportunidades atualmente acessíveis; não mede quando foram liberadas.</p>}
      <details className="workspace-insights__data"><summary><Table2 size={15} aria-hidden="true" />Consultar dados do período</summary><div><table><caption>Criações por intervalo · {days} dias</caption><thead><tr><th scope="col">Intervalo</th>{options.map(option => <th scope="col" key={option.id}>{option.label}</th>)}</tr></thead><tbody>{data.series.map(row => <tr key={row.start}><th scope="row">{row.label}</th>{options.map(option => <td key={option.id}>{row[option.id]}</td>)}</tr>)}</tbody></table></div></details>
    </section>
    <section className="workspace-insights__portfolio" aria-labelledby={portfolioId}>
      <div className="workspace-insights__heading"><div><h2 id={portfolioId}>Carteira de pedidos</h2><p>Estado atual · todos os períodos</p></div><Package size={19} aria-hidden="true" /></div>
      <div className="workspace-insights__donut" role="img" aria-label={`${orderCount} pedidos. ${data.portfolio.map(item => `${item.label}: ${item.count}`).join('. ')}`}>
        <svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="55" className="workspace-insights__track" />{data.portfolio.filter(item => item.count).map(item => {
          const length = item.count / orderCount * 345.575;
          const start = offset;
          offset += length;
          return <circle key={item.id} cx="70" cy="70" r="55" pathLength="345.575" strokeDasharray={`${Math.max(0, length - (data.portfolio.filter(item => item.count).length > 1 ? 3 : 0))} 345.575`} strokeDashoffset={-start} className={`workspace-insights__segment workspace-insights__segment--${item.tone}`} />;
        })}</svg><div><strong data-portfolio-total>{orderCount}</strong><span>pedidos</span></div>
      </div>
      {orderCount ? <ul className="workspace-insights__legend">{data.portfolio.filter(item => item.count).map(item => <li key={item.id}><i className={`workspace-insights__swatch workspace-insights__swatch--${item.tone}`} aria-hidden="true" /><span>{item.label}</span><strong>{item.count}</strong></li>)}</ul> : <p className="workspace-insights__empty">Seus pedidos aparecerão aqui após o aceite.</p>}
      <div className="workspace-insights__value"><span>Valor registrado em pedidos</span><strong>{money.format(data.orderValueCents / 100)}</strong><small>{data.incompleteOrderValues ? `${data.incompleteOrderValues} pedido(s) com valor incompleto fora da soma. ` : ''}Inclui frete. Não representa pagamento recebido.</small></div>
      <a className="workspace-insights__link" href={orderCount ? `#/app/${role === 'supplier' ? 'fornecedor' : 'comprador'}/pedidos` : destination}>{orderCount ? 'Acompanhar pedidos' : role === 'supplier' ? 'Ver oportunidades' : 'Ver minhas demandas'}<ArrowUpRight size={16} aria-hidden="true" /></a>
    </section>
  </section>;
}
