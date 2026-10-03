import { SoundSelector } from '../components/SoundSelector'
import type { SpeechSound } from '../types'
import './HomePage.css'
import './StoriesPage.css'

interface HomePageProps {
  sounds: SpeechSound[]
  onStartPractice: (soundId: string) => void
  onOpenStories: () => void
}

export function HomePage({ sounds, onStartPractice, onOpenStories }: HomePageProps) {
  return (
    <div className="home-page">
      <header className="home-nav">
        <a className="brand" href="#"><span aria-hidden="true">✳</span> Mrs. Jana<span className="brand-dot">.</span></a>
        <span className="nav-note">Little practice. Big adventures.</span>
        <a className="nav-link" href="#sounds">Let’s play <span aria-hidden="true">↗</span></a>
      </header>
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow"><span aria-hidden="true">✦</span> THE SPEECH & PLAY CLUB</p>
            <h1 className="site-title">Small sounds.<br /><span>BIG adventures!</span></h1>
            <p className="description">Pop a balloon. Find a treasure. Make a match.<br />Let’s turn speech practice into playtime!</p>
            <button className="cta-button" onClick={() => document.getElementById('sounds')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>Let’s play! <span aria-hidden="true">→</span></button>
            <p className="hero-note">Go at your own pace. Every try counts.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-star star-one">✦</span><span className="art-star star-two">✧</span>
            <div className="speech-bubble">You’ve got this!</div>
            <div className="mascot"><div className="mascot-eyes"><i /><i /></div><div className="mascot-cheeks"><i /><i /></div><div className="mascot-smile" /></div>
            <div className="art-sticker sticker-rocket">🚀</div><div className="art-sticker sticker-rainbow">🌈</div>
            <span className="art-caption">READY, SET, SAY!</span>
          </div>
        </section>
        <div className="play-strip"><span>✦ A little learning</span><span>♡ A lot of cheering</span><span>★ A whole bunch of fun</span></div>
        <section className="sounds-section" id="sounds"><SoundSelector sounds={sounds} onSelect={onStartPractice} /></section>
        <section className="home-stories">
          <span aria-hidden="true">📚</span><div><p className="eyebrow">READ · DISCOVER · SAY</p><h2>It’s story time!</h2><p>Little adventures with letters to spot and words to practice.</p></div>
          <button className="cta-button" onClick={onOpenStories}>Explore stories →</button>
        </section>
        <section className="adventure-preview">
          <p className="eyebrow">A PEEK AT PLAYTIME</p><h2>Three ways to say “I did it!”</h2>
          <div className="preview-grid">
            <div className="preview-card"><span aria-hidden="true">🃏</span><h3>Memory Match</h3><p>Flip, say, and find a pair.</p></div>
            <div className="preview-card"><span aria-hidden="true">🎈</span><h3>Speech Pop</h3><p>Say your words and pop away!</p></div>
            <div className="preview-card"><span aria-hidden="true">🏴‍☠️</span><h3>Treasure Hunt</h3><p>A word adventure full of discoveries.</p></div>
          </div>
        </section>
      </main>
      <footer className="home-footer">Made for little voices with big things to say. <span aria-hidden="true">♡</span></footer>
    </div>
  )
}
