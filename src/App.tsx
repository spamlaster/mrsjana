import { useRef, useState } from 'react'
import { StoriesPage } from './pages/StoriesPage'
import { HomePage } from './pages/HomePage'
import { SoundSelector } from './components/SoundSelector'
import { CategorySelector } from './components/CategorySelector'
import { GameSelector } from './components/GameSelector'
import { SessionHeader } from './components/SessionHeader'
import { SessionComplete } from './components/SessionComplete'
import { MemoryMatch } from './games/MemoryMatch'
import { SpeechPop } from './games/SpeechPop'
import { TreasureHunt } from './games/TreasureHunt'
import {
  speechSounds,
  games,
  getSpeechSound,
  getSpeechCategory,
} from './data/speeches'
import './App.css'

type Screen = 'home' | 'sound-select' | 'category-select' | 'game-select' | 'playing' | 'complete' | 'stories'

interface SessionStats {
  wordsPracticed: number
  speechReps: number
}

function App() {
  const gameRun = useRef(0)
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    wordsPracticed: 0,
    speechReps: 0,
  })

  const currentSound = selectedSound ? getSpeechSound(selectedSound) : null
  const currentCategory = selectedCategory
    ? getSpeechCategory(selectedSound || '', selectedCategory)
    : null
  const currentGameDef = selectedGame ? games.find(g => g.id === selectedGame) : null

  const handleStartPractice = (soundId: string) => {
    if (soundId) {
      setSelectedSound(soundId)
      setScreen('category-select')
    } else {
      setScreen('sound-select')
    }
  }

  const handleSelectSound = (soundId: string) => {
    setSelectedSound(soundId)
    setScreen('category-select')
  }

  const handleBackFromCategory = () => {
    setSelectedSound(null)
    setScreen('sound-select')
  }

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setScreen('game-select')
  }

  const handleBackFromGame = () => {
    setSelectedCategory(null)
    setScreen('category-select')
  }

  const handleSelectGame = (gameId: string) => {
    gameRun.current += 1
    setSelectedGame(gameId)
    setScreen('playing')
  }

  const handleGameComplete = (stats: { wordsPracticed: number; speechReps: number }) => {
    setSessionStats(stats)
    setScreen('complete')
  }

  const handlePlayAgain = () => {
    gameRun.current += 1
    setScreen('playing')
  }

  const handleChooseGame = () => {
    gameRun.current += 1
    setScreen('game-select')
  }

  const handleChangeSound = () => {
    setSelectedSound(null)
    setSelectedCategory(null)
    setSelectedGame(null)
    setScreen('sound-select')
  }

  const handleHome = () => {
    gameRun.current += 1
    setSelectedSound(null)
    setSelectedCategory(null)
    setSelectedGame(null)
    setScreen('home')
  }

  const renderGame = () => {
    if (!currentCategory) return null

    const run = gameRun.current
    const completeCurrentGame = (stats: SessionStats) => {
      if (gameRun.current === run) handleGameComplete(stats)
    }
    switch (selectedGame) {
      case 'memory-match':
        return (
          <MemoryMatch
            words={currentCategory.words}
            onComplete={completeCurrentGame}
          />
        )
      case 'speech-pop':
        return (
          <SpeechPop
            words={currentCategory.words}
            onComplete={completeCurrentGame}
          />
        )
      case 'treasure-hunt':
        return (
          <TreasureHunt
            words={currentCategory.words}
            onComplete={completeCurrentGame}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      {screen !== 'home' && (
        <nav className="app-nav" aria-label="Practice navigation">
          <button className="app-home" onClick={handleHome}>← Back to home</button>
          {screen === 'stories' ? <span className="stories-nav-label">📚 Story time</span> : <ol className="practice-steps" aria-label="Practice steps">
            <li className={screen === 'sound-select' ? 'current' : ''} aria-current={screen === 'sound-select' ? 'step' : undefined}>1 · Sound</li>
            <li className={screen === 'category-select' ? 'current' : ''} aria-current={screen === 'category-select' ? 'step' : undefined}>2 · Words</li>
            <li className={['game-select', 'playing', 'complete'].includes(screen) ? 'current' : ''} aria-current={['game-select', 'playing', 'complete'].includes(screen) ? 'step' : undefined}>3 · Play!</li>
          </ol>}
        </nav>
      )}
      {screen === 'home' && (
        <HomePage sounds={speechSounds} onStartPractice={handleStartPractice} onOpenStories={() => setScreen('stories')} />
      )}

      {screen === 'stories' && <main className="screen"><StoriesPage /></main>}

      {screen === 'sound-select' && (
        <div className="screen">
          <SoundSelector
            sounds={speechSounds}
            onSelect={handleSelectSound}
          />
        </div>
      )}

      {screen === 'category-select' && currentSound && (
        <div className="screen">
          <CategorySelector
            categories={currentSound.categories}
            soundName={currentSound.name}
            onSelect={handleSelectCategory}
            onBack={handleBackFromCategory}
          />
        </div>
      )}

      {screen === 'game-select' && currentSound && currentCategory && (
        <div className="screen">
          <GameSelector
            games={games}
            soundName={currentSound.name}
            categoryName={currentCategory.name}
            onSelect={handleSelectGame}
            onBack={handleBackFromGame}
          />
        </div>
      )}

      {screen === 'playing' && currentSound && currentCategory && currentGameDef && (
        <div className="screen">
          <button className="back-to-games" onClick={handleChooseGame}>← Back to games</button>
          <SessionHeader
            soundName={currentSound.name}
            categoryName={currentCategory.name}
            gameName={currentGameDef.name}
          />
          {renderGame()}
        </div>
      )}

      {screen === 'complete' && currentSound && currentCategory && currentGameDef && (
        <div className="screen">
          <SessionComplete
            soundName={currentSound.name}
            categoryName={currentCategory.name}
            gameName={currentGameDef.name}
            wordsPracticed={sessionStats.wordsPracticed}
            speechReps={sessionStats.speechReps}
            onPlayAgain={handlePlayAgain}
            onChooseGame={handleChooseGame}
            onChangeSound={handleChangeSound}
            onHome={handleHome}
          />
        </div>
      )}
    </div>
  )
}

export default App
