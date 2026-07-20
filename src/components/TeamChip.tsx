import type { Team } from '../types'

interface Props {
  team: Team | null
  seed?: number
  tag?: string
  size?: 'sm' | 'md' | 'lg'
  sub?: string
  onClick?: () => void
  selected?: boolean
  faded?: boolean
}

export default function TeamChip({ team, seed, tag, size = 'md', sub, onClick, selected, faded }: Props) {
  if (!team) {
    return (
      <div className={`team-chip tbd ${size}`}>
        <span className="tc-tbd">{sub ?? 'To be decided'}</span>
      </div>
    )
  }
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      className={`team-chip ${size} ${selected ? 'selected' : ''} ${faded ? 'faded' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{ ['--team' as string]: team.color }}
    >
      {seed != null && <span className="tc-seed">{seed}</span>}
      <img className="tc-logo" src={team.logo} alt="" loading="lazy" />
      <span className="tc-name">
        <span className="tc-loc">{size === 'lg' ? team.name : team.shortName}</span>
        {sub && <span className="tc-sub">{sub}</span>}
      </span>
      {tag && <span className={`tc-tag tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}>{tag}</span>}
    </Comp>
  )
}
