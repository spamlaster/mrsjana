import './SessionHeader.css'

interface SessionHeaderProps {
  soundName: string
  categoryName: string
  gameName: string
  compact?: boolean
}

export function SessionHeader({
  soundName,
  categoryName,
  gameName,
  compact = false,
}: SessionHeaderProps) {
  return (
    <div className={`session-header${compact ? ' compact' : ''}`}>
      <div className="breadcrumb">
        {soundName} • {categoryName} • {gameName}
      </div>
    </div>
  )
}
