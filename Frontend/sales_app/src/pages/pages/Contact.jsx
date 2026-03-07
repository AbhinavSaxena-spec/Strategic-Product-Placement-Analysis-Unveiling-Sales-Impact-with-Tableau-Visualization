import { useState } from 'react'
import styles from './Contact.module.css'

const INFO = [
  { icon: '📍', label: 'Location:', val: 'Gachibowli Circle, Gachibowli,\nHyderabad, INDIA' },
  { icon: '✉️', label: 'Email:',    val: 'businessstore@example.com' },
  { icon: '📱', label: 'Call:',     val: '89554 48855' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <div className={styles.page}>
      <p className="eyebrow">Get In Touch</p>
      <h1 className={`page-title ${styles.title}`}>CONTACT US</h1>

      <div className={styles.grid}>
        {/* Info card */}
        <div className={styles.infoCard}>
          {INFO.map(({ icon, label, val }) => (
            <div key={label} className={styles.infoItem}>
              <div className={styles.infoIcon}>{icon}</div>
              <div>
                <div className={styles.infoLabel}>{label}</div>
                <div className={styles.infoVal} style={{ whiteSpace: 'pre-line' }}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className={styles.formCard}>
          <div className={styles.row2}>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={set('name')}
              />
            </div>
            <div className={styles.field}>
              <input
                className={styles.input}
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={set('email')}
              />
            </div>
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={set('subject')}
            />
          </div>

          <div className={styles.field}>
            <textarea
              className={styles.textarea}
              rows={7}
              placeholder="Message"
              value={form.message}
              onChange={set('message')}
            />
          </div>

          <div className={styles.submitRow}>
            {sent && (
              <span className={styles.sentMsg}>✅ Message sent successfully!</span>
            )}
            <button className="btn-gold" onClick={handleSubmit}>
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
