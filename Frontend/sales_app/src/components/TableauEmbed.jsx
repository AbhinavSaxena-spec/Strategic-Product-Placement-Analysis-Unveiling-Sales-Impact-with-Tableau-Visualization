import { useState } from 'react'
import styles from './TableauEmbed.module.css'

/** Strip tracking/share params and return a clean embed URL */
function toEmbedUrl(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  // Keep only the base path (before any ?)
  const base = trimmed.split('?')[0]
  return `${base}?:embed=yes&:showVizHome=no&:toolbar=yes&:animate_transition=yes`
}

export default function TableauEmbed({ title, defaultUrl = '' }) {
  const [inputVal, setInputVal]   = useState(defaultUrl)
  const [activeUrl, setActiveUrl] = useState(() => toEmbedUrl(defaultUrl))

  const handleEmbed = () => {
    const url = toEmbedUrl(inputVal)
    if (!url) return
    setActiveUrl(url)
  }

  const handleClear = () => {
    setActiveUrl('')
    setInputVal('')
  }

  return (
    <div className={styles.panel}>
      {/* ── URL input row ── */}
      <div className={styles.inputSection}>
        <p className={styles.inputLabel}>
          📊 <strong>Tableau Public</strong> URL — edit below to swap the viz anytime
        </p>
        <div className={styles.urlRow}>
          <input
            type="text"
            className={styles.urlInput}
            placeholder="e.g. https://public.tableau.com/views/YourWorkbook/YourSheet"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEmbed()}
          />
          <button className={styles.embedBtn} onClick={handleEmbed}>
            Load
          </button>
          {activeUrl && (
            <button className={styles.clearBtn} onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── iframe / placeholder ── */}
      <div className={styles.iframeWrap}>
        {activeUrl ? (
          <iframe
            src={activeUrl}
            title={title}
            allowFullScreen
            className={styles.iframe}
          />
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>📊</div>
            <div className={styles.placeholderTitle}>
              Your Tableau {title} will appear here
            </div>
            <div className={styles.placeholderHint}>
              Paste your published Tableau URL above and click <strong>Load</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
