import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_ITEMS = [
  { label: 'Home',      to: '/' },
  { label: 'About',     to: '/about' },
  { label: 'DashBoard', to: '/dashboard' },
  { label: 'Story',     to: '/story' },
  { label: 'Contact',   to: '/contact' },
]

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo} onClick={() => navigate('/')}>
        SALE<span>S</span>
      </span>

      <div className={styles.links}>
        {NAV_ITEMS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
        <button className={styles.cta} onClick={() => navigate('/contact')}>
          Get Started
        </button>
      </div>
    </nav>
  )
}
