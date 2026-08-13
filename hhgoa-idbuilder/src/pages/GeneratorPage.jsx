import { useState } from 'react'
import TacticalMapBackground from '../components/TacticalMapBackground'
import Footer from '../components/Footer'
import FormatSelector from '../components/FormatSelector'
import PfpGenerator from '../components/PfpGenerator'
import IdGeneratorPage from './IdGeneratorPage'
import TeamFramePage from './TeamFramePage'

export default function GeneratorPage() {
  const [format, setFormat] = useState('pfp')

  return (
    <>
      <TacticalMapBackground />

      <main
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100dvh',
          padding: '100px 20px 64px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', width: '100%' }}>
          {/* Format selector */}
          <FormatSelector value={format} onChange={setFormat} />

          {/* Conditional page render */}
          {format === 'pfp' && <PfpGenerator />}

          {format === 'builder' && (
            <div style={{ width: '100%', maxWidth: '1280px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(0.95)', transformOrigin: 'top center', width: '100%' }}>
                <IdGeneratorPage />
              </div>
            </div>
          )}

          {format === 'team' && (
            <div style={{ width: '100%', maxWidth: '1380px' }}>
              <iframe
                src="/hacker-house-goa-team-frame-generator-2-3.html"
                scrolling="no"
                style={{
                  width: '100%',
                  height: '2000px',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  background: 'rgba(7, 19, 12, 0.4)',
                  overflow: 'hidden'
                }}
                title="Team Builder Pass Generator"
              />
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  )
}
