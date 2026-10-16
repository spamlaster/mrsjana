import './SectionNav.css'

interface SectionNavProps {
  current: 'articulation' | 'phonological'
}

const sections = [
  { id: 'articulation', label: 'Articulation', href: '#/' },
  { id: 'phonological', label: 'Phonological Processes', href: '#/phonological' },
] as const

export function SectionNav({ current }: SectionNavProps) {
  return (
    <nav className="section-nav" aria-label="Practice areas">
      <ul>
        {sections.map(section => (
          <li key={section.id}>
            <a href={section.href} className={section.id === current ? 'current' : ''} aria-current={section.id === current ? 'page' : undefined}>{section.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
