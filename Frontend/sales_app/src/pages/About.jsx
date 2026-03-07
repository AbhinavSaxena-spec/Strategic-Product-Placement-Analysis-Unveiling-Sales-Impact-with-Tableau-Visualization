import styles from './About.module.css'

const PROCESS = [
  {
    icon: '📊',
    name: 'Data Collection',
    desc: 'Data collection is the process of gathering and measuring information on variables of interest, in an established systematic fashion that enables one to answer stated research questions, test hypothesis, and evaluate outcomes and generate insights from the data.',
  },
  {
    icon: '🔧',
    name: 'Data Preparation',
    desc: 'Data preparation is the process of cleaning, transforming, and organizing data in order to make it suitable for analysis. It is an important step in the data analysis process, as the quality of the data used can have a significant impact on the accuracy and reliability of the results.',
  },
  {
    icon: '📈',
    name: 'Data Visualization',
    desc: 'Data visualization is the process of creating graphical representations of data in order to help people understand and explore the information. By using visual elements such as charts, graphs, and maps, data visualizations can help people quickly identify patterns, trends, and outliers in the data.',
  },
]

const PILLARS = [
  { num: '01', name: 'Tableau Visualization', txt: 'Advanced dashboards built in Tableau to reveal hidden patterns in product placement and sales volume across all retail categories.' },
  { num: '02', name: 'Statistical Analysis',  txt: 'Deep-dive into correlations between shelf position, foot traffic, promotions, pricing, and revenue outcomes across consumer segments.' },
  { num: '03', name: 'Strategic Insights',    txt: 'Actionable recommendations for store layout optimization to maximize sales impact across all consumer demographics and seasons.' },
]

const KPIS = [
  { val: '1,830.1',   label: 'Clothing Avg Sales',    color: '#F5A623' },
  { val: '1,748.6',   label: 'Electronics Avg Sales', color: '#7FC97F' },
  { val: '1,727.7',   label: 'Food Avg Sales',        color: '#F08080' },
  { val: '1,769,311', label: 'Total Sales Volume',    color: '#4DB6AC' },
]

export default function About() {
  return (
    <div className={styles.page}>
      {/* Hero band */}
      <div className={styles.heroBand}>
        <p className="eyebrow">About the Project</p>
        <h1 className={`page-title ${styles.heroTitle}`}>
          Strategic Product<br />Placement Analysis
        </h1>
        <p className={styles.heroSub}>
          A comprehensive data analytics initiative to understand how product
          placement drives retail sales outcomes across multiple categories and
          consumer demographics.
        </p>
      </div>

      {/* Process + image */}
      <div className={styles.body}>
        <div className={styles.left}>
          {PROCESS.map(({ icon, name, desc }) => (
            <div key={name} className={styles.processRow}>
              <div className={styles.processIcon}>{icon}</div>
              <div>
                <div className={styles.processName}>{name}</div>
                <p className={styles.processDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.right} />
      </div>

      {/* Pillars */}
      <div className={styles.pillars}>
        {PILLARS.map(({ num, name, txt }) => (
          <div key={num} className={styles.pillar}>
            <div className={styles.pillarNum}>{num}</div>
            <div className={styles.pillarName}>{name}</div>
            <p className={styles.pillarTxt}>{txt}</p>
          </div>
        ))}
      </div>

      {/* KPI strip */}
      <div className={styles.kpiStrip}>
        {KPIS.map(({ val, label, color }) => (
          <div key={label} className={styles.kpiCard} style={{ borderLeftColor: color }}>
            <span className={styles.kpiVal} style={{ color }}>{val}</span>
            <span className={styles.kpiLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
