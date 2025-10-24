import DealerHand from './DealerHand'
import PlayerHand from './PlayerHand'
import './GameBoard.css'

function GameBoard({ 
  playerHand, 
  dealerHand, 
  gameOver, 
  onHit, 
  onStand,
  score,
  showContinueButton, 
  onContinue, 
  onReset, 
  onSaveScore, 
  onBackToHome, 
  isDefeated, 
  onNewGameAfterDefeat,
  scoreSaved
}) {
  return (
    <div className="game">
      <DealerHand hand={dealerHand} gameOver={gameOver} />
      <PlayerHand 
        hand={playerHand} 
        gameOver={gameOver} 
        onHit={onHit} 
        onStand={onStand}
        score={score}
        showContinueButton={showContinueButton}
        onContinue={onContinue}
        onReset={onReset}
        onSaveScore={onSaveScore}
        onBackToHome={onBackToHome}
        isDefeated={isDefeated}
        onNewGameAfterDefeat={onNewGameAfterDefeat}
        scoreSaved={scoreSaved}
      />
    </div>
  )
}

export default GameBoard