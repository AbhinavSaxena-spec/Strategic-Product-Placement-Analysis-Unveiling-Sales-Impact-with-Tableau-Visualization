import TableauEmbed from '../components/TableauEmbed'
import styles from './Story.module.css'

const HIGHLIGHTS = [
  { num: '01', title: 'Clothing Leads',       desc: 'The average sales volume is highest for Clothing (1,830.1), driven by strategic placement at front-of-store positions and aggressive promotional campaigns.' },
  { num: '02', title: 'Aisle Advantage',      desc: 'Sales volume peaks when products are placed at Aisle positions, indicating high foot-traffic conversion — consistent across all three product categories.' },
  { num: '03', title: 'Promotion Impact',     desc: 'Promotions consistently boost sales. Non-promotional Spring sales peak at 1,844.6 while promotional strategies sustain volume across all seasons.' },
  { num: '04', title: 'Demographics',         desc: 'College students represent the top buying segment (450,063 total volume), followed closely by Seniors (444,089) and Young Adults (431,883).' },
  { num: '05', title: 'Price Premium',        desc: 'All categories price above competitors — Food maintains the highest premium at $2.53 above competitor pricing, signaling strong brand positioning.' },
  { num: '06', title: 'Seasonal Stability',   desc: 'While Spring is peak season, promotional strategies effectively flatten seasonal dips — Summer and Fall show resilient performance year-round.' },
]

export default function Story() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <p className="eyebrow">Data Narrative</p>
        <h1 className={`page-title ${styles.title}`}>
          PRODUCT PLACEMENT ANALYSIS — STORY
        </h1>
        <p className={styles.sub}>
          Your live Tableau story is embedded below. Use the URL bar to swap to a different viz anytime.
        </p>
      </div>

      {/* Tableau Embed — pre-loaded with your published story */}
      <TableauEmbed
        title="Story"
        defaultUrl="https://public.tableau.com/views/Product_Placement_Analysis_17728968652120/ProductPlacementAnalysis-Story"
      />

      {/* Story Highlights */}
      <div className={styles.hlHeader}>Key Story Highlights</div>
      <div className={styles.hlGrid}>
        {HIGHLIGHTS.map(({ num, title, desc }) => (
          <div key={num} className={styles.hlCard}>
            <div className={styles.hlNum}>{num}</div>
            <div className={styles.hlTitle}>{title}</div>
            <p className={styles.hlDesc}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
