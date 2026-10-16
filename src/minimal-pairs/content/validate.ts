import { affricates, approvedSBlends, phonemes } from './processes'
import { contrastPosition, getWord, library, matchingProcesses, soundId } from './selectors'
import type { ContentLibrary, ProcessRule } from './types'

const positions = ['initial', 'final']
const processIds = ['fronting', 'backing', 'stopping', 'cluster-reduction', 'deaffrication']
const ruleKey = (rule: ProcessRule) => `${rule.target.join(' ')} > ${rule.error.join(' ')} @ ${[...rule.positions].sort().join(',')}`
const duplicates = (ids: string[]) => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]
const unknownSounds = (sounds: string[]) => sounds.filter(sound => !phonemes.includes(sound))

// Structural and clinical checks on the content. Returns problems; an empty list means valid.
// Missing pictures and audio are not problems here; readiness.ts reports them separately.
// Valid is not approved: approval only ever comes from Jana.
export function validateLibrary(lib: ContentLibrary = library): string[] {
  const problems: string[] = []
  const process = (id: string) => lib.processes.find(item => item.id === id)

  // Processes and their rules.
  for (const id of duplicates(lib.processes.map(item => item.id))) problems.push(`Duplicate process id ${id}`)
  for (const id of processIds) if (!process(id)) problems.push(`Missing process ${id}`)
  for (const item of lib.processes) {
    if (!processIds.includes(item.id)) problems.push(`Unknown process ${item.id}`)
    for (const rule of item.rules) {
      const sounds = [...rule.target, ...rule.error]
      if (unknownSounds(sounds).length) problems.push(`${item.id} rule ${ruleKey(rule)} uses unknown sounds ${unknownSounds(sounds).join(', ')}`)
      if (!rule.target.length || soundId(rule.target) === soundId(rule.error)) problems.push(`${item.id} rule ${ruleKey(rule)} is not a contrast`)
      if (!rule.positions.length || rule.positions.some(position => !positions.includes(position))) problems.push(`${item.id} rule ${ruleKey(rule)} has invalid positions`)
    }
  }
  const targetsById = new Map<string, string>()
  for (const rule of lib.processes.flatMap(item => item.rules)) {
    const id = soundId(rule.target), sounds = rule.target.join(' ')
    if (targetsById.has(id) && targetsById.get(id) !== sounds) problems.push(`Sound id ${id} is ambiguous: ${targetsById.get(id)} and ${sounds}`)
    targetsById.set(id, sounds)
  }
  const fronting = process('fronting'), backing = process('backing')
  if (fronting && backing) {
    const reversed = fronting.rules.map(rule => ruleKey({ ...rule, target: rule.error, error: rule.target })).sort()
    if (reversed.join('|') !== backing.rules.map(ruleKey).sort().join('|')) problems.push('Backing rules must be exactly the Fronting rules with target and error reversed')
  }
  for (const rule of process('stopping')?.rules ?? []) {
    if (rule.target.some(sound => affricates.includes(sound))) problems.push(`Stopping must not contain affricate rule ${ruleKey(rule)}; it belongs to Deaffrication`)
  }
  for (const rule of process('deaffrication')?.rules ?? []) {
    if (rule.target.length !== 1 || !affricates.includes(rule.target[0])) problems.push(`Deaffrication rule ${ruleKey(rule)} must start from an affricate`)
  }
  for (const rule of process('cluster-reduction')?.rules ?? []) {
    const approvedBlend = approvedSBlends.some(blend => soundId(blend) === soundId(rule.target))
    if (!approvedBlend || soundId(rule.error) !== soundId(rule.target.slice(1)) || rule.positions.join() !== 'initial') {
      problems.push(`Cluster Reduction rule ${ruleKey(rule)} must reduce an approved s-blend to its second sound, initial position only`)
    }
  }

  // Lexicon.
  for (const id of duplicates(lib.lexicon.map(word => word.id))) problems.push(`Duplicate word id ${id}`)
  for (const word of lib.lexicon) {
    if (!word.id.trim() || !word.text.trim() || !word.imageAlt.trim()) problems.push(`Word ${word.id || '(no id)'} needs an id, text, and imageAlt`)
    if (word.text !== word.text.trim().toLowerCase()) problems.push(`Word ${word.id} text must be lowercase and trimmed`)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(word.id)) problems.push(`Word id ${word.id} must be lowercase letters, digits, and hyphens; it names the recording`)
    if (word.pronunciationHint !== undefined && !word.pronunciationHint.trim()) problems.push(`Word ${word.id} has an empty pronunciation hint`)
    if (word.emoji !== undefined && !word.emoji.trim()) problems.push(`Word ${word.id} has an empty emoji`)
    if (word.pictureRequirement !== undefined && !word.pictureRequirement.trim()) problems.push(`Word ${word.id} has an empty picture requirement`)
    if (!word.phonemes.length || unknownSounds(word.phonemes).length) problems.push(`Word ${word.id} has missing or unknown phonemes ${unknownSounds(word.phonemes).join(', ')}`)
  }

  // Pairs.
  for (const id of duplicates(lib.pairs.map(pair => pair.id))) problems.push(`Duplicate pair id ${id}`)
  for (const key of duplicates(lib.pairs.map(pair => [...pair.words].sort().join('+')))) problems.push(`Words ${key} are paired more than once`)
  for (const pair of lib.pairs) {
    const label = `Pair ${pair.id}`
    const missing = pair.words.filter(id => !getWord(id, lib))
    if (missing.length) { problems.push(`${label} references missing words ${missing.join(', ')}`); continue }
    if (pair.words[0] === pair.words[1]) { problems.push(`${label} pairs a word with itself`); continue }
    if (!positions.includes(pair.position)) problems.push(`${label} has invalid position ${pair.position}`)
    if (!pair.processes.length || duplicates(pair.processes).length) problems.push(`${label} must list each of its processes once`)
    const [a, b] = pair.words.map(id => getWord(id, lib)!)
    const contrast = [...pair.contrast].sort().join()
    for (const id of pair.processes) {
      // The rule for the declared contrast must turn one word into the other at the pair's position, in either role order.
      const fits = process(id)?.rules.some(rule => [soundId(rule.target), soundId(rule.error)].sort().join() === contrast && rule.positions.includes(pair.position) &&
        (contrastPosition(a.phonemes, b.phonemes, rule) === pair.position || contrastPosition(b.phonemes, a.phonemes, rule) === pair.position))
      if (!fits) problems.push(`${label} is not a ${pair.position} ${pair.contrast.join('/')} contrast under ${id}; the words must differ only by that contrast`)
    }
    for (const id of matchingProcesses(pair, lib)) if (!pair.processes.includes(id)) problems.push(`${label} also fits ${id} and must list it`)
    if (pair.approval && (!pair.approval.by.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(pair.approval.on))) problems.push(`${label} approval needs a name and a YYYY-MM-DD date`)
    if (pair.approval) for (const word of [a, b]) if (!word.phonemesReviewed) problems.push(`${label} is approved but the transcription of ${word.id} has not been checked`)
  }
  return problems
}
