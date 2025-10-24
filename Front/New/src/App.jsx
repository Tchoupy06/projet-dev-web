import { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameBoard from './components/GameBoard'
import MessageBox from './components/MessageBox'
import BurnEffect from './components/BurnEffect'
import ScoreBoard from './components/ScoreBoard'
import SaveScoreModal from './components/SaveScoreModal'
import { createDeck, shuffleDeck, dealCards, calculateScore, isBlackjack } from './utils/cardUtils'
import './App.css'
import JSConfetti from 'js-confetti'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showBurnEffect, setShowBurnEffect] = useState(false)
  const [score, setScore] = useState(0)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [isDefeated, setIsDefeated] = useState(false)
  const [scoreSaved, setScoreSaved] = useState(false)

  const startGame = () => {
    const newDeck = shuffleDeck(createDeck())
    const { playerCards, dealerCards, remainingDeck } = dealCards(newDeck)
    
    setDeck(remainingDeck)
    setPlayerHand(playerCards)
    setDealerHand(dealerCards)
    setGameStarted(true)
    setGameOver(false)
    setMessage('')
    setShowMessage(false)
    setShowBurnEffect(false)
    setShowContinueButton(false)
    setIsDefeated(false)

    // Vérifier les Blackjacks initiaux
    const playerBlackjack = isBlackjack(playerCards)
    const dealerBlackjack = isBlackjack(dealerCards)

    if (playerBlackjack || dealerBlackjack) {
      setGameOver(true)
      
      if (playerBlackjack && !dealerBlackjack) {
        setScore(prev => prev + 2) // Bonus pour Blackjack
        showMessageBox('BLACKJACK IMMÉDIAT! Vous gagnez!', 'win')
        setShowContinueButton(true)
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti()
      } else if (!playerBlackjack && dealerBlackjack) {
        showMessageBox('Le croupier a un Blackjack! Vous perdez!', 'lose')
        setShowBurnEffect(true)
      } else {
        showMessageBox('Double Blackjack! Égalité!', '')
        setShowContinueButton(true)
      }
    }
  }

  const continueGame = () => {
    // Vérifier s'il reste assez de cartes (au moins 4 cartes pour distribuer)
    if (deck.length < 4) {
      // Pas assez de cartes, créer un nouveau jeu
      showMessageBox('🔄 Nouveau jeu mélangé!', '')
      setTimeout(() => {
        startGame()
      }, 1000)
    } else {
      // Assez de cartes, continuer avec le deck existant
      const { playerCards, dealerCards, remainingDeck } = dealCards(deck)
      
      setPlayerHand(playerCards)
      setDealerHand(dealerCards)
      setDeck(remainingDeck)
      setGameOver(false)
      setMessage('')
      setShowMessage(false)
      setShowBurnEffect(false)
      setShowContinueButton(false)
      setIsDefeated(false)

      // Vérifier les Blackjacks initiaux
      const playerBlackjack = isBlackjack(playerCards)
      const dealerBlackjack = isBlackjack(dealerCards)

      if (playerBlackjack || dealerBlackjack) {
        setGameOver(true)
        
        if (playerBlackjack && !dealerBlackjack) {
          setScore(prev => prev + 2) // Bonus pour Blackjack
          showMessageBox('BLACKJACK IMMÉDIAT! Vous gagnez!', 'win')
          setShowContinueButton(true)
          const jsConfetti = new JSConfetti()
          jsConfetti.addConfetti()
        } else if (!playerBlackjack && dealerBlackjack) {
          setIsDefeated(true)
          setTimeout(() => {
            showMessageBox('Le croupier a un Blackjack! Vous perdez!', 'lose')
            setShowBurnEffect(true)
          }, 100)
        } else {
          showMessageBox('Double Blackjack! Égalité!', '')
          setShowContinueButton(true)
        }
      }
    }
  }

  const resetGame = () => {
    setScore(0)
    setGameStarted(false)
    setShowContinueButton(false)
    setGameOver(false)
    setMessage('')
    setShowMessage(false)
    setShowBurnEffect(false)
    setShowSaveModal(false)
    setIsDefeated(false)
    setScoreSaved(false)
    setPlayerHand([])
    setDealerHand([])
    setDeck([])
  }

  const backToHome = () => {
    setScore(0)
    setGameStarted(false)
    setGameOver(false)
    setMessage('')
    setShowMessage(false)
    setShowBurnEffect(false)
    setShowContinueButton(false)
    setShowSaveModal(false)
    setIsDefeated(false)
    setScoreSaved(false)
    setPlayerHand([])
    setDealerHand([])
    setDeck([])
  }

  const startNewGameAfterDefeat = () => {
    // Remet le score à 0 et démarre une nouvelle partie directement
    setScore(0)
    setShowBurnEffect(false)
    setMessage('')
    setShowMessage(false)
    setShowContinueButton(false)
    setShowSaveModal(false)
    startGame()
  }

  const hitCard = () => {
    if (deck.length === 0 || gameOver) return
    
    const newCard = deck[deck.length - 1]
    const newPlayerHand = [...playerHand]
    newPlayerHand.push(newCard)
    const newDeck = deck.slice(0, -1)
    
    setPlayerHand(newPlayerHand)
    setDeck(newDeck)
    
    const playerScore = calculateScore(newPlayerHand)
    if (playerScore > 21) {
      setGameOver(true)
      setIsDefeated(true)
      setTimeout(() => {
        showMessageBox('Vous avez brûlé!', 'lose')
        setShowBurnEffect(true)
      }, 100)
    }
  }

  const stand = () => {
    setGameOver(true)
    
    // Logique du croupier
    let newDealerHand = [...dealerHand]
    let newDeck = [...deck]
    const playerScore = calculateScore(playerHand)

    while (calculateScore(newDealerHand) < playerScore && newDeck.length > 0) {
      const newCard = newDeck[newDeck.length - 1]
      newDealerHand.push(newCard)
      newDeck = newDeck.slice(0, -1)
    }
    
    setDealerHand(newDealerHand)
    setDeck(newDeck)
    
    // Déterminer le gagnant
    const dealerScore = calculateScore(newDealerHand)
    const playerBlackjack = isBlackjack(playerHand)
    const dealerBlackjack = isBlackjack(newDealerHand)
    
    if (dealerScore > 21) {
      // Croupier brûlé
      setScore(prev => prev + 1)
      showMessageBox('Le croupier a brûlé! Vous gagnez!', 'win')
      setShowContinueButton(true)
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()

    } else if (playerBlackjack && !dealerBlackjack) {
      // Joueur a un Blackjack, pas le croupier
      setScore(prev => prev + 2) // Bonus pour Blackjack
      showMessageBox('BLACKJACK! Vous gagnez!', 'win')
      setShowContinueButton(true)
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()

    } else if (!playerBlackjack && dealerBlackjack) {
      // Croupier a un Blackjack, pas le joueur
      setIsDefeated(true)
      setTimeout(() => {
        showMessageBox('Le croupier a un Blackjack! Vous perdez!', 'lose')
        setShowBurnEffect(true)
      }, 100)

    } else if (playerBlackjack && dealerBlackjack) {
      // Les deux ont un Blackjack
      showMessageBox('Double Blackjack! Égalité!', '')
      setShowContinueButton(true)

    } else if (playerScore > dealerScore) {
      // Score normal plus élevé
      setScore(prev => prev + 1)
      showMessageBox('Vous gagnez!', 'win')
      setShowContinueButton(true)
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti()

    } else if (playerScore < dealerScore) {
      // Score normal plus faible
      setIsDefeated(true)
      setTimeout(() => {
        showMessageBox('Le croupier gagne!', 'lose')
        setShowBurnEffect(true)
      }, 100)

    } else {
      // Égalité de scores normaux
      showMessageBox('Égalité!', '')
      setShowContinueButton(true)
    }
  }

  const showMessageBox = (text, type = '') => {
    setMessage(text)
    setMessageType(type)
    setShowMessage(true)
    
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  const handleBurnEffectComplete = () => {
    setShowBurnEffect(false)
  }

  const handleSaveScore = () => {
    setShowSaveModal(true)
  }

  const handleScoreSaved = () => {
    setShowSaveModal(false)
    setScoreSaved(true)
    // Retour à l'accueil après sauvegarde
    setTimeout(() => {
      backToHome()
    }, 1000)
  }

  const handleSaveCancel = () => {
    setShowSaveModal(false)
  }

  return (
    <div id="app">
      {!gameStarted ? (
        <StartScreen onStartGame={startGame} />
      ) : (
        <GameBoard
          playerHand={playerHand}
          dealerHand={dealerHand}
          gameOver={gameOver}
          onHit={hitCard}
          onStand={stand}
          score={score}
          showContinueButton={showContinueButton}
          onContinue={continueGame}
          onReset={resetGame}
          onSaveScore={handleSaveScore}
          onBackToHome={backToHome}
          isDefeated={isDefeated}
          onNewGameAfterDefeat={startNewGameAfterDefeat}
          scoreSaved={scoreSaved}
        />
      )}
      <MessageBox
        message={message}
        type={messageType}
        show={showMessage}
      />
      <BurnEffect
        show={showBurnEffect}
        onComplete={handleBurnEffectComplete}
      />
      {gameStarted && (
        <ScoreBoard
          score={score}
          cardsLeft={deck.length}
        />
      )}
      {showSaveModal && (
        <SaveScoreModal
          score={score}
          onSave={handleScoreSaved}
          onCancel={handleSaveCancel}
        />
      )}
    </div>
  )
}

export default App