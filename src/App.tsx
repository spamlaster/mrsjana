import { getRoute, goBack, navigate, useRoute } from './routing/router'
import { PracticePage } from './pages/PracticePage'
import { ReviewPage } from './pages/ReviewPage'
import { StoriesPage } from './pages/StoriesPage'
import { HomePage } from './pages/HomePage'
import { SoundSelector } from './components/SoundSelector'
import { CategorySelector } from './components/CategorySelector'
import { GameSelector } from './components/GameSelector'
import { SessionHeader } from './components/SessionHeader'
import { SessionComplete } from './components/SessionComplete'
import { MemoryMatch } from './games/MemoryMatch'
import { SpeechPop } from './games/SpeechPop'
import { KeyHouse } from './games/KeyHouse'
import { TreasureHunt } from './games/TreasureHunt'
import {
  speechSounds,
  games,
  getSpeechSound,
  getSpeechCategory,
} from './data/speeches'
import './App.css'

interface SessionStats {
  wordsPracticed: number
  speechReps: number
}

function App() {
  const route = useRoute()
  const { screen, soundId: selectedSound, categoryId: selectedCategory, gameId: selectedGame } = route
  const sessionStats = route.stats || { wordsPracticed: 0, speechReps: 0 }
  const soundPath = `/sounds/${selectedSound}`
  const categoryPath = `${soundPath}/${selectedCategory}`
  const gamePath = `${categoryPath}/${selectedGame}`
  const currentSound = selectedSound ? getSpeechSound(selectedSound) : null
  const currentCategory = selectedCategory
    ? getSpeechCategory(selectedSound || '', selectedCategory)
    : null
  const currentGameDef = selectedGame ? games.find(g => g.id === selectedGame) : null

  const handleStartPractice = (soundId: string) => navigate(soundId ? `/sounds/${soundId}` : '/sounds')
  const handleSelectSound = (soundId: string) => navigate(`/sounds/${soundId}`)
  const handleBackFromCategory = () => goBack('/sounds')
  const handleSelectCategory = (categoryId: string) => navigate(`${soundPath}/${categoryId}`)
  const handleBackFromGame = () => goBack(soundPath)
  const handleSelectGame = (gameId: string) => navigate(`${categoryPath}/${gameId}`)
  const handleGameComplete = (stats: SessionStats) => navigate(`${gamePath}/complete`, stats)
  const handlePlayAgain = () => navigate(gamePath)
  const handleChooseGame = () => navigate(categoryPath)
  const handleChangeSound = () => navigate('/sounds')
  const handleHome = () => navigate('/')

  const renderGame = () => {
    if (!currentCategory) return null

    const completeCurrentGame = (stats: SessionStats) => {
      if (getRoute() === route) handleGameComplete(stats)
    }
    switch (selectedGame) {
      case 'key-house':
        return <KeyHouse words={currentCategory.words} onComplete={completeCurrentGame} />
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
    <div className="app-container" key={`${screen}-${selectedSound}-${selectedCategory}-${selectedGame}`}>
      {screen !== 'home' && (
        <nav className="app-nav" aria-label="Practice navigation">
          <div className="app-nav-actions"><button className="app-home" onClick={() => goBack('/')}>← Back</button><button className="app-home" onClick={handleHome}>Home</button></div>
          {['stories', 'coach', 'review'].includes(screen) ? <span className="stories-nav-label">{screen === 'stories' ? '📚 Story time' : screen === 'coach' ? '🌼 Practice with Ms. Jana' : 'Practice review'}</span> : <ol className="practice-steps" aria-label="Practice steps">
            <li className={screen === 'sound-select' ? 'current' : ''} aria-current={screen === 'sound-select' ? 'step' : undefined}>1 · Sound</li>
            <li className={screen === 'category-select' ? 'current' : ''} aria-current={screen === 'category-select' ? 'step' : undefined}>2 · Words</li>
            <li className={['game-select', 'playing', 'complete'].includes(screen) ? 'current' : ''} aria-current={['game-select', 'playing', 'complete'].includes(screen) ? 'step' : undefined}>3 · Play!</li>
          </ol>}
        </nav>
      )}
      {screen === 'home' && (
        <HomePage sounds={speechSounds} onStartPractice={handleStartPractice} onOpenStories={() => navigate('/stories')} />
      )}

      {screen === 'coach' && <div className="screen"><PracticePage /></div>}
      {screen === 'review' && <div className="screen"><ReviewPage /></div>}
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
          <SessionHeader
            soundName={currentSound.name}
            categoryName={currentCategory.name}
            gameName={currentGameDef.name}
            compact={selectedGame === 'key-house'}
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
