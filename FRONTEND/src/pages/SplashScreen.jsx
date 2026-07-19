import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)' }}>
      <div className="splash-content" style={{ animation: 'bounceIn 1s cubic-bezier(0.36, 0, 0.66, -0.56)', maxWidth: 800, width: '100%', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <img src="/logo.png" alt="KarWaan Logo" style={{ width: '180px', height: '180px', objectFit: 'contain', display: 'block' }} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '3.5rem', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Ride Together
            </h1>
            <h1 style={{ fontSize: '3.5rem', margin: 0, color: 'var(--text-secondary)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Save Together
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
