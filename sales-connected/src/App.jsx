import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Story from './pages/Story'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '62px' }}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/about"     element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/story"     element={<Story />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
