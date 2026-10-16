import { navigate } from '../../routing/router'
import type { ActivityInfo } from '../activities/catalog'
import type { PairRoles } from '../content/types'
import { centerPath, type CenterRoute } from '../route'
import { trialCounts } from '../session/trialSession'
import { PairPicture } from './PairPicture'

interface SessionSetupProps {
  route: CenterRoute
  activity: ActivityInfo
  roles: PairRoles
}

// Step 6: 10 or 20 turns, then go. Each word comes up exactly half the time, in a shuffled order.
export function SessionSetup({ route, activity, roles }: SessionSetupProps) {
  return (
    <section className="mp-picker mp-setup">
      <p className="eyebrow">STEP 6 · HOW MANY TURNS?</p>
      <span className="mp-setup-icon" aria-hidden="true">{activity.icon}</span>
      <h2>{activity.name}</h2>
      <p className="mp-picker-hint">{activity.description}</p>
      <div className="mp-setup-words">
        <span className="mp-pair-word mp-pair-target"><PairPicture word={roles.target} size="md" /><span>{roles.target.text}</span></span>
        <span className="mp-pair-word"><PairPicture word={roles.contrast} size="md" /><span>{roles.contrast.text}</span></span>
      </div>
      <div className="mp-setup-choices">
        {trialCounts.map(trials => (
          <button key={trials} className="mp-turns" onClick={() => navigate(centerPath({ ...route, view: 'playing', trials }))}>
            <span className="mp-turns-number">{trials}</span>
            <span>turns · {trials / 2} of each word</span>
          </button>
        ))}
      </div>
      <p className="mp-setup-note">
        {activity.id === 'bubble-pop' ? 'Say the word, then pop the bubble. The next bubble arrives on its own! Grown-up scoring is optional.' : activity.kind === 'listening'
          ? 'The child hears a word and taps a picture. Taps are scored automatically.'
          : 'After each try, a grown-up taps Correct, Incorrect, or Cued. The game moves on either way.'}
      </p>
    </section>
  )
}
