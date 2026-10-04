export interface Student { id: string; name: string }
export interface Attempt { id: string; studentId: string; word: string; sound: string; category: string; at: string; source: 'teacher' | 'automated'; score: number | null; outcome: 'independent' | 'helped' | 'practicing' | 'unassessed'; provider?: string }
export interface PracticeRecords { students: Student[]; attempts: Attempt[] }
const key = 'ms-jana-practice-v1'
export function readRecords(): PracticeRecords {
  try { const data = JSON.parse(localStorage.getItem(key) || 'null'); if (Array.isArray(data?.students) && Array.isArray(data?.attempts)) return data } catch { /* A damaged or unavailable store starts empty. */ }
  return { students: [], attempts: [] }
}
export function writeRecords(records: PracticeRecords) { localStorage.setItem(key, JSON.stringify(records)) }
export function newStudent(name: string): Student { return { id: crypto.randomUUID(), name: name.trim() } }
export function teacherAttempt(studentId: string, word: string, sound: string, category: string, outcome: Attempt['outcome']): Attempt {
  return { id: crypto.randomUUID(), studentId, word, sound, category, at: new Date().toISOString(), source: 'teacher', score: null, outcome }
}
export function parseAssessment(value: unknown): { score: number | null; provider: string } {
  if (!value || typeof value !== 'object') throw new Error('Invalid assessment response')
  const data = value as Record<string, unknown>
  if (typeof data.provider !== 'string' || !data.provider.trim()) throw new Error('Missing assessment provider')
  if (data.score !== null && (typeof data.score !== 'number' || !Number.isFinite(data.score) || data.score < 0 || data.score > 100)) throw new Error('Invalid assessment score')
  return { score: data.score as number | null, provider: data.provider }
}
