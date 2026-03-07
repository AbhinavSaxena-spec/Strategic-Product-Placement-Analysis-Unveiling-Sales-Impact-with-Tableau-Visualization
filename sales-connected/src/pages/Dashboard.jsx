import { useState, useEffect } from 'react'
import TableauEmbed from '../components/TableauEmbed'
import { api } from '../api'
import styles from './Dashboard.module.css'

/* ─── fallback static KPIs (shown while loading or if Flask is offline) ─── */
const STATIC_KPIS = [
  { val: '1,830.1',   label: 'Clothing Avg Sales',    color: '#F5A623', note: '▲ Highest Category' },
  { val: '1,748.6',   label: 'Electronics Avg Sales', color: '#7FC97F', note: '▲ +4.7% vs baseline' },
  { val: '1,727.7',   label: 'Food Avg Sales',        color: '#F08080', note: '▲ Stable Growth'     },
  { val: '1,769,311', label: 'Total Sales Volume',    color: '#4DB6AC', note: '▲ All Categories'    },
]

const FINDINGS = [
  { icon: '🏆', title: 'Category Leader', desc: 'Clothing leads all categories with avg 1,830.1 sales volume — outperforming Electronics by ~4.7%.' },
  { icon: '📍', title: 'Best Placement',  desc: 'Aisle-end and Front-of-Store positions drive the highest foot traffic conversion rates consistently.' },
  { icon: '🎯', title: 'Promotions Work', desc: 'Promotional campaigns boost avg price by $1.44–$3.49 above competitor pricing across all categories.' },
]

/* ─── tiny status banners ─── */
function StatusBanner({ loading, error }) {
  if (loading) return <div className={styles.statusLoading}>⏳ Fetching live data from Flask API…</div>
  if (error)   return <div className={styles.statusError}>⚠️ Backend offline — showing static data. Start Flask: <code>python app.py</code></div>
  return <div className={styles.statusOk}>✅ Live data connected · Flask API responding</div>
}

/* ─── pure-CSS horizontal bar chart ─── */
function BarChart({ items, valueKey, labelKey, color }) {
  const max = Math.max(...items.map(i => i[valueKey]))
  return (
    <div className={styles.barChart}>
      {items.map(item => (
        <div key={item[labelKey]} className={styles.barRow}>
          <div className={styles.barLabel}>{item[labelKey]}</div>
          <div className={styles.barTrack}>
            <div className={styles.barFill}
              style={{ width: `${(item[valueKey] / max) * 100}%`, background: color }} />
          </div>
          <div className={styles.barVal}>
            {Number(item[valueKey]).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── donut chart via conic-gradient ─── */
const PIE_COLORS = ['#F5A623', '#7FC97F', '#4DB6AC', '#F08080', '#a78bfa', '#60a5fa']
function DonutChart({ items, valueKey, labelKey }) {
  const total = items.reduce((s, i) => s + i[valueKey], 0)
  let cursor = 0
  const slices = items.map((item, idx) => {
    const pct = (item[valueKey] / total) * 100
    const from = cursor; cursor += pct
    return { ...item, pct, from, color: PIE_COLORS[idx % PIE_COLORS.length] }
  })
  const gradient = slices.map(s =>
    `${s.color} ${s.from.toFixed(1)}% ${(s.from + s.pct).toFixed(1)}%`
  ).join(', ')
  return (
    <div className={styles.donutWrap}>
      <div className={styles.donut} style={{ background: `conic-gradient(${gradient})` }} />
      <div className={styles.legend}>
        {slices.map(s => (
          <div key={s[labelKey]} className={styles.legendRow}>
            <span className={styles.legendDot} style={{ background: s.color }} />
            <span className={styles.legendName}>{s[labelKey]}</span>
            <span className={styles.legendPct}>{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════ */
export default function Dashboard() {
  const [kpis,    setKpis]    = useState(null)
  const [cats,    setCats]    = useState(null)
  const [pos,     setPos]     = useState(null)
  const [demo,    setDemo]    = useState(null)
  const [pricing, setPricing] = useState(null)
  const [promo,   setPromo]   = useState(null)
  const [recs,    setRecs]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const [filter, setFilter] = useState({ category: '', position: '', promotion: '' })

  /* re-fetch whenever a filter changes */
  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true); setError(null)
      try {
        const f = filter
        const [k, c, p, d, pr, prm, r] = await Promise.all([
          api.kpis(f),
          api.categories(f),
          api.positions(f),
          api.demographics(f),
          api.pricing(f),
          api.promotions(f),
          api.recommendations(),
        ])
        if (!alive) return
        setKpis(k); setCats(c.categories); setPos(p.positions)
        setDemo(d.demographics); setPricing(pr); setPromo(prm); setRecs(r.recommendations)
      } catch (e) { if (alive) setError(e.message) }
      finally { if (alive) setLoading(false) }
    }
    load()
    return () => { alive = false }
  }, [filter.category, filter.position, filter.promotion])

  /* live KPI cards built from API data */
  const displayKpis = kpis
    ? [
        { val: Number(kpis.avg_sales_per_product).toLocaleString(), label: 'Avg Sales / Product', color: '#F5A623', note: `▲ Top: ${kpis.top_category}` },
        { val: `$${kpis.avg_price}`,                                label: 'Avg Price',           color: '#7FC97F', note: `Competitor: $${kpis.avg_competitor_price}` },
        { val: `+${kpis.promotion_lift_pct}%`,                      label: 'Promo Lift',          color: '#F08080', note: '▲ vs non-promo products' },
        { val: Number(kpis.total_sales_volume).toLocaleString(),    label: 'Total Sales Volume',  color: '#4DB6AC', note: `${kpis.total_records} records` },
      ]
    : STATIC_KPIS

  const setF = key => e => setFilter(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <p className="eyebrow">Interactive Analysis</p>
        <h1 className={`page-title ${styles.title}`}>PRODUCT PLACEMENT ANALYSIS — DASHBOARD</h1>
        <p className={styles.sub}>Live Flask API · Tableau Embedded · Filter &amp; Export below</p>
      </div>

      <StatusBanner loading={loading} error={error} />

      {/* ── Filter + Export bar ── */}
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>🔍 Filter data:</span>

        <select className={styles.sel} value={filter.category} onChange={setF('category')}>
          <option value="">All Categories</option>
          <option>Clothing</option>
          <option>Electronics</option>
          <option value="Food & Beverages">Food &amp; Beverages</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Home & Kitchen">Home &amp; Kitchen</option>
          <option>Sports</option>
        </select>

        <select className={styles.sel} value={filter.position} onChange={setF('position')}>
          <option value="">All Positions</option>
          <option value="Eye Level">Eye Level</option>
          <option value="End Cap">End Cap</option>
          <option value="Floor Level">Floor Level</option>
          <option value="Top Shelf">Top Shelf</option>
          <option value="Checkout Zone">Checkout Zone</option>
          <option value="Entrance Display">Entrance Display</option>
        </select>

        <select className={styles.sel} value={filter.promotion} onChange={setF('promotion')}>
          <option value="">All (Promo + Non-Promo)</option>
          <option value="Yes">With Promotion</option>
          <option value="No">Without Promotion</option>
        </select>

        <button className={styles.resetBtn}
          onClick={() => setFilter({ category: '', position: '', promotion: '' })}>
          ✕ Reset
        </button>

        <a className={styles.exportBtn} href={api.exportUrl(filter)} download>
          ⬇ Export CSV
        </a>
      </div>

      {/* ── Live KPI Cards ── */}
      <div className={styles.kpiGrid}>
        {displayKpis.map(({ val, label, color, note }) => (
          <div key={label} className={styles.kpiCard} style={{ borderLeftColor: color }}>
            <span className={styles.kpiVal} style={{ color }}>{val}</span>
            <span className={styles.kpiLabel}>{label}</span>
            <span className={styles.kpiNote}>{note}</span>
          </div>
        ))}
      </div>

      {/* ── Live Charts (3-column) ── */}
      {!loading && !error && cats && pos && demo && (
        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>📦 Avg Sales by Category</div>
            <BarChart items={cats} valueKey="avg_sales" labelKey="Product Category" color="#F5A623" />
          </div>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>📍 Avg Sales by Position</div>
            <BarChart items={pos} valueKey="avg_sales" labelKey="Product Position" color="#4DB6AC" />
          </div>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>👥 Volume by Demographics</div>
            <DonutChart items={demo} valueKey="total_sales" labelKey="Consumer Demographics" />
          </div>
        </div>
      )}

      {/* ── Pricing vs Competitor ── */}
      {!loading && !error && pricing && (
        <div className={styles.chartsRow}>
          <div className={`${styles.chartCard} ${styles.chartWide}`}>
            <div className={styles.chartTitle}>💰 Price vs Competitor by Category</div>
            <div className={styles.pricingTable}>
              <div className={styles.pricingHead}>
                <span>Category</span><span>Our Avg Price</span><span>Competitor</span><span>Difference</span>
              </div>
              {pricing.category_pricing?.map(row => {
                const diff = (row.avg_price - row.avg_comp_price).toFixed(2)
                const pos2 = parseFloat(diff) >= 0
                return (
                  <div key={row['Product Category']} className={styles.pricingRow}>
                    <span>{row['Product Category']}</span>
                    <span>${row.avg_price}</span>
                    <span>${row.avg_comp_price}</span>
                    <span style={{ color: pos2 ? '#F5A623' : '#F08080' }}>
                      {pos2 ? '+' : ''}{diff}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Promo impact */}
          {promo && (
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>🎯 Promotion Impact</div>
              <BarChart
                items={promo.promotion_summary}
                valueKey="avg_sales"
                labelKey="Promotion"
                color="#F08080"
              />
              <div className={styles.promoNote}>
                Promoted products vs non-promoted, filtered to current selection
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tableau Embed ── */}
      <div className={styles.sectionHead}>📊 Tableau Dashboard</div>
      <TableauEmbed
        title="Dashboard"
        defaultUrl="https://public.tableau.com/views/Product_Placement_Analysis_17728968652120/ProductPlacementAnalysis-Dashboard"
      />

      {/* ── AI Recommendations from Flask ── */}
      {recs && (
        <>
          <div className={styles.sectionHead}>🎯 Smart Recommendations — Flask API</div>
          <div className={styles.recsGrid}>
            {recs.map(r => (
              <div key={r.title} className={`${styles.recCard} ${styles['p_' + r.priority.toLowerCase()]}`}>
                <div className={styles.recBadge}>{r.priority}</div>
                <div className={styles.recTitle}>{r.title}</div>
                <p className={styles.recDesc}>{r.detail}</p>
                <div className={styles.recMeta}>
                  <span>Impact <strong>{r.impact}</strong></span>
                  <span>Effort <strong>{r.effort}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Key Findings ── */}
      <div className={styles.sectionHead}>🔍 Key Findings</div>
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
