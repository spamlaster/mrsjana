import './SessionHeader.css'

interface SessionHeaderProps {
  soundName: string
  categoryName: string
  gameName: string
}

export function SessionHeader({
  soundName,
  categoryName,
  gameName,
}: SessionHeaderProps) {
  return (
    <div className="session-header">
      <div className="breadcrumb">
        {soundName} • {categoryName} • {gameName}
      </div>
    </div>
  )
}
