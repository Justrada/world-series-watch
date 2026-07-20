import { useState } from 'react'
import { HOW_IT_WORKS } from '../lib/explain'

export default function HowItWorks({ startOpen = false }: { startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <section className="how" id="how">
      <div className="how-head" onClick={() => setOpen((v) => !v)}>
        <h2>New to baseball? Start here</h2>
        <button className="how-toggle">{open ? 'Hide' : 'Show me how it works'}</button>
      </div>
      {open && (
        <>
          <div className="how-grid">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} className="how-card">
                <span className="how-emoji">{s.emoji}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="how-tip">
            💡 Tip: anywhere you see a <span className="term-demo">dotted word</span>, tap it for a plain-English
            definition.
          </p>
        </>
      )}
    </section>
  )
}
