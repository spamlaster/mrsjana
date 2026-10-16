import { SectionNav } from '../components/SectionNav'
import { MinimalPairsCenter } from '../minimal-pairs/MinimalPairsCenter'
import type { CenterRoute } from '../minimal-pairs/route'
import type { SessionResult } from '../minimal-pairs/session/result'
import './HomePage.css'
import './PhonologicalPage.css'

interface PhonologicalPageProps {
  center: CenterRoute
  result?: SessionResult
}

export function PhonologicalPage({ center, result }: PhonologicalPageProps) {
  const playing = center.view === 'playing'
  return (
    <div className="home-page">
      <header className={`home-nav${playing ? ' phonological-nav-compact' : ''}`}>
        <a className="brand" href="#/"><span aria-hidden="true">✳</span> Ms. Jana</a>
        <SectionNav current="phonological" />
      </header>
      <main className="phonological-page">
        {center.view === 'processes' && (
          <header className="phonological-hero">
            <p className="eyebrow">PHONOLOGICAL PROCESSES</p>
            <h1>Minimal Pairs Play Center</h1>
            <p className="phonological-intro">Two words, one sound apart. Practice hearing and saying the difference with games that make every try count.</p>
          </header>
        )}
        <MinimalPairsCenter route={center} result={result} />
      </main>
    </div>
  )
}
