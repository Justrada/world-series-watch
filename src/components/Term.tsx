import { useState } from 'react'
import { GLOSSARY } from '../lib/explain'

/** A dotted-underline baseball term that reveals a plain-English definition on tap/hover. */
export default function Term({ k, children }: { k: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const def = GLOSSARY[k.toLowerCase()]
  if (!def) return <>{children ?? k}</>
  return (
    <span
      className="term"
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        e.stopPropagation()
        setOpen((v) => !v)
      }}
    >
      {children ?? k}
      {open && (
        <span className="term-pop" role="tooltip">
          {def}
        </span>
      )}
    </span>
  )
}
