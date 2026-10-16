import { navigate } from '../../routing/router'
import { audioFile, hasRecording, isAudioReviewed } from '../content/audio'
import { illustrationFile, pictureSource, type PictureSource } from '../content/illustrations'
import { groupPairs, statusLabels } from '../content/labels'
import { rejectedPictures } from '../content/picture-audit'
import { pairListeningReady } from '../content/readiness'
import { getProcess, getWord, library, pairStatus, rolesFor, soundId } from '../content/selectors'
import type { LexiconWord, MinimalPair } from '../content/types'
import { centerPath } from '../route'

const pictureLabels: Record<PictureSource, string> = { illustration: 'illustration', picture: 'site picture', emoji: 'emoji', placeholder: 'placeholder' }
const pictureState = (word: LexiconWord) => pictureLabels[pictureSource(word)]
const audioState = (word: LexiconWord) => (isAudioReviewed(audioFile(word)) ? 'reviewed' : hasRecording(word) ? 'not reviewed' : 'missing')

// Where "Try it" opens a pair: its first process, at the sound that process practices.
function tryPath(pair: MinimalPair): string | null {
  for (const processId of pair.processes) {
    for (const rule of getProcess(processId)?.rules ?? []) {
      const sound = soundId(rule.target)
      if (rolesFor(pair, processId, sound)) return centerPath({ processId, sound, position: pair.position, pairId: pair.id })
    }
  }
  return null
}

// Grown-up page for Jana's review (preview mode only): where every pair stands. Clinical approval,
// transcription checks, pictures, and recordings are separate reviews and are shown separately.
export function ReviewStatus() {
  const { pairs, lexicon } = library
  const statuses = pairs.map(pairStatus)
  const groups = groupPairs(pairs)
  const needsArt = lexicon.filter(word => pictureSource(word) === 'placeholder')
  const illustrated = lexicon.filter(word => pictureSource(word) === 'illustration').length
  return (
    <section className="mp-review">
      <button className="mp-button mp-button-soft mp-button-small" onClick={() => navigate('/phonological')}>← All patterns</button>
      <p className="eyebrow">FOR GROWN-UPS · REVIEW STATUS</p>
      <h2>Where every word pair stands</h2>
      <p className="mp-picker-hint">Preview mode shows pairs that are awaiting approval so the games can be tried. Families only ever see pairs Jana has approved.</p>
      <p><button className="mp-button" onClick={() => navigate(centerPath({ view: 'recordings' }))}>🎧 Check recordings</button></p>
      <dl className="mp-review-totals">
        <div><dt>Approved</dt><dd>{statuses.filter(status => status === 'approved').length} of {pairs.length} pairs</dd></div>
        <div><dt>Awaiting approval</dt><dd>{statuses.filter(status => status === 'accepted-for-development').length} pairs</dd></div>
        <div><dt>Sounds (transcriptions) checked</dt><dd>{lexicon.filter(word => word.phonemesReviewed).length} of {lexicon.length} words</dd></div>
        <div><dt>Pictures ready</dt><dd>{lexicon.length - needsArt.length} of {lexicon.length} words</dd></div>
        <div><dt>Custom illustrations</dt><dd>{illustrated} of {lexicon.length} words</dd></div>
        <div><dt>Recordings checked</dt><dd>{lexicon.filter(word => audioState(word) === 'reviewed').length} of {lexicon.length} words</dd></div>
        <div><dt>Listening game ready</dt><dd>{pairs.filter(pair => pairListeningReady(pair)).length} pairs</dd></div>
      </dl>
      {[...groups].map(([title, items]) => (
        <div key={title} className="mp-review-group">
          <h3>{title} <span>({items.length})</span></h3>
          <div className="mp-review-table-wrap">
            <table className="mp-review-table">
              <thead><tr><th>Pair</th><th>Clinical status</th><th>Sounds checked</th><th>Pictures</th><th>Recordings</th><th>Listening</th><th><span className="mp-visually-hidden">Try it</span></th></tr></thead>
              <tbody>
                {items.map(pair => {
                  const words = pair.words.map(id => getWord(id)).filter((word): word is LexiconWord => Boolean(word))
                  const path = tryPath(pair)
                  return (
                    <tr key={pair.id}>
                      <th scope="row">{words.map(word => word.text).join(' / ')}{pair.notes && <span className="mp-review-note">{pair.notes}</span>}</th>
                      <td><span className={`mp-status mp-status-${pairStatus(pair)}`}>{statusLabels[pairStatus(pair)]}</span></td>
                      <td>{words.every(word => word.phonemesReviewed) ? 'Yes' : 'Not yet'}</td>
                      <td>{words.map(word => `${word.text}: ${pictureState(word)}`).join(', ')}</td>
                      <td>{words.map(word => `${word.text}: ${audioState(word)}`).join(', ')}</td>
                      <td>{pairListeningReady(pair) ? 'Ready' : 'Not yet'}</td>
                      <td>{path && <button className="mp-button mp-button-small" onClick={() => navigate(path)}>Try it</button>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="mp-review-group">
        <h3>Words waiting for a picture <span>({needsArt.length})</span></h3>
        <ul className="mp-review-words">
          {needsArt.map(word => (
            <li key={word.id}>
              <strong>{word.text}</strong>: {word.imageAlt} · <code>{illustrationFile(word)}</code>
              {word.pictureRequirement && <> · <em>Must be: {word.pictureRequirement}</em></>}
              {rejectedPictures[word.id] && <> · Existing picture not used: {rejectedPictures[word.id]}</>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
