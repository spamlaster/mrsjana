import { useState } from 'react'
import { readRecords, writeRecords } from '../practice/store'
import './PracticePage.css'
export function ReviewPage() {
  const [records, setRecords] = useState(readRecords)
  const [studentId, setStudentId] = useState('')
  const [message, setMessage] = useState('')
  const attempts = records.attempts.filter(item => item.studentId === studentId)
  return <main className="practice-page"><p className="eyebrow">MS. JANA’S REVIEW</p><h1>Practice results</h1><p className="practice-note">Local prototype · This browser only · No saved audio · Not a protected teacher portal</p>
    <label>Student<select value={studentId} onChange={event => setStudentId(event.target.value)}><option value="">Choose a student</option>{records.students.map((student, i) => <option key={student.id} value={student.id}>{student.name} · Profile {i + 1}</option>)}</select></label>
    <p role="status">{message}</p>
    {studentId && <><p className="practice-note">{attempts.length} recorded attempts. Adult observations and automated estimates are shown separately. Unassessed attempts have no score.</p><div className="review-table"><table><thead><tr><th>Date</th><th>Word / sound</th><th>Source</th><th>Result</th></tr></thead><tbody>{[...attempts].reverse().map(item => <tr key={item.id}><td>{new Date(item.at).toLocaleString()}</td><td>{item.word} · {item.sound.toUpperCase()} · {item.category}</td><td>{item.source === 'teacher' ? 'Adult observation' : `Automated · ${item.provider}`}</td><td>{item.source === 'automated' ? item.score === null ? 'Unassessed' : `${item.score}/100 · estimate` : ({ independent: 'Correct independently', helped: 'Correct with help', practicing: 'Still practicing', unassessed: 'Not assessed' }[item.outcome])}</td></tr>)}</tbody></table></div>{!attempts.length && <p>No results for this student yet.</p>}
    <button className="house-reset" onClick={() => { if (!window.confirm('Delete this student profile and all their saved results from this browser?')) return; const next = { students: records.students.filter(item => item.id !== studentId), attempts: records.attempts.filter(item => item.studentId !== studentId) }; try { writeRecords(next); setRecords(next); setStudentId(''); setMessage('Profile and results deleted.') } catch { setMessage('Couldn’t delete the records. Please try again.') } }}>Delete profile and results</button></>}
  </main>
}
