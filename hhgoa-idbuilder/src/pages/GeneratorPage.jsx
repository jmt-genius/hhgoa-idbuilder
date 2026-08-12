import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SideRails from '../components/SideRails'
import FormatSelector from '../components/FormatSelector'
import PfpGenerator from '../components/PfpGenerator'

export default function GeneratorPage() {
  const [format, setFormat] = useState('pfp')

  return (
    <>
      <SideRails />

      <main
        className="field-texture"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100dvh',
          padding: '40px 20px 64px',
        }}
      >
        <Header />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%' }}>
          {/* Format selector */}
          <FormatSelector value={format} onChange={setFormat} />

          {/* Conditional page render */}
          {format === 'pfp' && <PfpGenerator />}

          {format === 'builder' && (
            <div style={{ width: '100%', maxWidth: '1280px' }}>
              <iframe
                src="/hacker-house-goa-id-generator.html"
                style={{
                  width: '100%',
                  height: '1050px',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  background: 'rgba(7, 19, 12, 0.4)'
                }}
                title="Builder Pass Generator"
              />
            </div>
          )}

          {format === 'team' && (
            <div style={{ width: '100%', maxWidth: '1380px' }}>
              <iframe
                src="/hacker-house-goa-team-frame-generator.html"
                style={{
                  width: '100%',
                  height: '1150px',
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  background: 'rgba(7, 19, 12, 0.4)'
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
