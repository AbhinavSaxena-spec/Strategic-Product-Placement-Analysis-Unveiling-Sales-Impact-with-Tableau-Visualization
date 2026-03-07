import { useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'

const NAV_LINKS = ['/', '/about', '/dashboard', '/story', '/contact']
const NAV_LABELS = ['Home', 'About', 'DashBoard', 'Story', 'Contact']

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <div className={styles.brand}>SALES</div>
          <p className={styles.desc}>
            Strategic Product Placement Analysis — Unveiling Sales Impact with
            Tableau Visualization. A data-driven approach to retail excellence.
          </p>
        </div>

        <div>
          <div className={styles.colTitle}>Navigate</div>
          {NAV_LABELS.map((label, i) => (
            <button key={label} className={styles.flink} onClick={() => navigate(NAV_LINKS[i])}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <div className={styles.colTitle}>Analysis</div>
          {['Clothing Category', 'Electronics Category', 'Food Category', 'Consumer Demographics', 'Seasonal Trends'].map(t => (
            <span key={t} className={styles.flink}>{t}</span>
          ))}
        </div>

        <div>
          <div className={styles.colTitle}>Contact</div>
          <span className={styles.flink}>Gachibowli, Hyderabad</span>
          <span className={styles.flink}>businessstore@example.com</span>
          <span className={styles.flink}>89554 48855</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>
          © 2024 SALES — Strategic Product Placement Analysis. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
