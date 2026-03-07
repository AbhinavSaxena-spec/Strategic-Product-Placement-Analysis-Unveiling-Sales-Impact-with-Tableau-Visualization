import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const STATS = [
  { val: '1.77M+', label: 'Total Sales Volume' },
  { val: '3',      label: 'Product Categories' },
  { val: '4',      label: 'Consumer Segments' },
  { val: '1,830',  label: 'Clothing Avg. Sales' },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Data Analytics · Tableau · Product Strategy</p>
        <h1 className={styles.title}>
          Strategic<br />
          <em>Product</em><br />
          Placement<br />
          Analysis
        </h1>
        <p className={styles.sub}>
          Unveiling Sales Impact with Tableau Visualization. A data-driven
          approach to retail excellence across Clothing, Electronics &amp; Food.
        </p>
        <div className={styles.ctas}>
          <button className="btn-gold" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
          <button className="btn-ghost" onClick={() => navigate('/about')}>
            About the Project
          </button>
        </div>
      </div>

      <div className={styles.statsBar}>
        {STATS.map(({ val, label }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statVal}>{val}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
