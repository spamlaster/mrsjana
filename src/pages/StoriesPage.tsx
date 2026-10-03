import { goBack, navigate, useRoute } from '../routing/router'
import { speechSounds } from '../data/speeches'
import { stories, type PracticeStory } from '../data/stories'
import './StoriesPage.css'

function HighlightedText({ text, letters }: { text: string; letters: string }) {
  // Plain string matching avoids interpreting story content as HTML or regular expressions.
  const parts = text.split(new RegExp(`(${letters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return <>{parts.map((part, index) => part.toLowerCase() === letters.toLowerCase()
    ? <mark key={index}>{part}</mark> : part)}</>
}

function StoryReader({ story, onBack }: { story: PracticeStory; onBack: () => void }) {
  const route = useRoute()
  const page = (route.page || 1) - 1
  const finished = page === story.pages.length
  const openPage = (nextPage: number) => navigate(`/stories/${story.id}/${nextPage + 1}`)
  const current = story.pages[page]
  return (
    <article className="story-reader">
      <button className="story-back" onClick={onBack}>← Back</button>
      <p className="eyebrow">{story.targetLetters.toUpperCase()} · READ & SAY</p>
      <h1>{story.title}</h1>
      {finished ? <div className="story-finished" aria-live="polite">
        <span aria-hidden="true">🌟</span><h2>You read the whole story!</h2><p>Every word was a little adventure. Great trying!</p>
        <button className="cta-button" onClick={() => openPage(0)}>Read again ↻</button>
      </div> : <>
        <p className="story-tip">Read together or on your own. Look for the highlighted {story.targetLetters.toUpperCase()} letters!</p>
        <progress value={page + 1} max={story.pages.length} aria-label="Story progress" />
        <div className="story-page" key={page}>
          <span className="story-picture" aria-hidden="true">{current.emoji}</span>
          <p className="story-text"><HighlightedText text={current.text} letters={story.targetLetters} /></p>
          <div className="story-practice"><h2>Pause & say</h2><p>Try these words aloud. Take your time!</p>
            <ul>{current.practiceWords.map(word => <li key={word}><HighlightedText text={word} letters={story.targetLetters} /></li>)}</ul>
          </div>
        </div>
        <div className="story-controls">
          <button className="story-back" disabled={page === 0} onClick={() => openPage(page - 1)}>← Previous</button>
          <span aria-live="polite">Page {page + 1} of {story.pages.length}</span>
          <button className="cta-button" onClick={() => openPage(page + 1)}>{page === story.pages.length - 1 ? 'Finish story ★' : 'Next page →'}</button>
        </div>
      </>}
    </article>
  )
}

export function StoriesPage() {
  const route = useRoute()
  const sound = route.filter || 'all'
  const selected = stories.find(story => story.id === route.storyId)
  if (selected) return <StoryReader key={selected.id} story={selected} onBack={() => goBack('/stories')} />
  const available = stories.filter(story => sound === 'all' || story.soundId === sound)
  return <section className="stories-library">
    <p className="eyebrow">A LITTLE STORY. A LOT TO SAY.</p><h1>Story time!</h1>
    <p>Read an adventure and practice letters and sounds along the way.</p>
    <div className="story-filters" role="group" aria-label="Filter stories by sound">
      {[{ id: 'all', name: 'All stories' }, ...speechSounds].map(item => <button key={item.id} aria-pressed={sound === item.id} onClick={() => navigate(item.id === 'all' ? '/stories' : `/stories?sound=${item.id}`)}>{item.name}</button>)}
    </div>
    <div className="story-grid">{available.map(story => <button className="story-card" key={story.id} onClick={() => navigate(`/stories/${story.id}/1`)}>
      <span className="story-cover" aria-hidden="true">{story.emoji}</span><span className="eyebrow">{story.targetLetters.toUpperCase()} LETTER PRACTICE · {story.pages.length} PAGES</span>
      <h2>{story.title}</h2><p>{story.description}</p><span className="game-play">Read the story →</span>
    </button>)}</div>
    {available.length === 0 && <div className="story-empty"><span aria-hidden="true">📚</span><h2>More adventures are on the way!</h2><p>There aren’t any stories for this sound yet. Choose “All stories” to explore.</p></div>}
  </section>
}
