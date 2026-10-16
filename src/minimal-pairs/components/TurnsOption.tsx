import { navigate } from '../../routing/router'
import { centerPath, type CenterRoute } from '../route'
import { defaultTrialCount, type TrialCount } from '../session/trialSession'

interface TurnsOptionProps {
  route: CenterRoute
  trials: TrialCount
  noun?: string // what a turn is called in this game, e.g. "bubbles"
}

const shortTrialCount: TrialCount = 10

// Games default to 20 turns (10 of each word). Before the first turn, a grown-up can switch to 10.
// Changing it changes the address, which starts a fresh session.
export function TurnsOption({ route, trials, noun = 'turns' }: TurnsOptionProps) {
  const short = trials !== defaultTrialCount
  return (
    <label className={`mp-turns-option${short ? ' checked' : ''}`}>
      <input type="checkbox" checked={short} onChange={event => navigate(centerPath({ ...route, view: 'playing', trials: event.target.checked ? shortTrialCount : defaultTrialCount }))} />
      <span>
        <strong>Fewer {noun}: {shortTrialCount / 2} of each word</strong>
        <small>{short ? `${shortTrialCount} ${noun} in all` : `Now ${defaultTrialCount} ${noun}, ${defaultTrialCount / 2} of each word`}</small>
      </span>
    </label>
  )
}
