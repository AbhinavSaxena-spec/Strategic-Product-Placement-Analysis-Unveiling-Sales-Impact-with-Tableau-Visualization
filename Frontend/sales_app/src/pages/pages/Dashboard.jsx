import TableauEmbed from '../components/TableauEmbed'
import styles from './Dashboard.module.css'

const KPIS = [
  { val: '1,830.1',   label: 'Clothing Avg Sales',    color: '#F5A623', note: '▲ Highest Category' },
  { val: '1,748.6',   label: 'Electronics Avg Sales', color: '#7FC97F', note: '▲ +4.7% vs baseline' },
  { val: '1,727.7',   label: 'Food Avg Sales',        color: '#F08080', note: '▲ Stable Growth' },
  { val: '1,769,311', label: 'Total Sales Volume',    color: '#4DB6AC', note: '▲ All Categories' },
]

const FINDINGS = [
  { icon: '🏆', title: 'Category Leader',  desc: 'Clothing leads all categories with avg 1,830.1 sales volume — outperforming Electronics by ~4.7%.' },
  { icon: '📍', title: 'Best Placement',   desc: 'Aisle-end and Front-of-Store positions drive the highest foot traffic conversion rates consistently.' },
  { icon: '🎯', title: 'Promotions Work',  desc: 'Promotional campaigns boost avg price by $1.44–$3.49 above competitor pricing across all categories.' },
]

export default function Dashboard() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <p className="eyebrow">Interactive Analysis</p>
        <h1 className={`page-title ${styles.title}`}>
          PRODUCT PLACEMENT ANALYSIS — DASHBOARD
        </h1>
        <p className={styles.sub}>
          Your live Tableau dashboard is embedded below. Use the URL bar to swap to a different viz anytime.
        </p>
      </div>

      {/* Tableau Embed — pre-loaded with your published dashboard */}
      <TableauEmbed
        title="Dashboard"
        defaultUrl="https://public.tableau.com/views/Product_Placement_Analysis_17728968652120/ProductPlacementAnalysis-Dashboard"
      />

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {KPIS.map(({ val, label, color, note }) => (
          <div key={label} className={styles.kpiCard} style={{ borderLeftColor: color }}>
            <span className={styles.kpiVal} style={{ color }}>{val}</span>
            <span className={styles.kpiLabel}>{label}</span>
            <span className={styles.kpiNote}>{note}</span>
          </div>
        ))}
      </div>

      {/* Key Findings */}
      <div className={styles.findingsGrid}>
        {FINDINGS.map(({ icon, title, desc }) => (
          <div key={title} className={styles.findingCard}>
            <span className={styles.findingIcon}>{icon}</span>
            <div className={styles.findingTitle}>{title}</div>
            <p className={styles.findingDesc}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
