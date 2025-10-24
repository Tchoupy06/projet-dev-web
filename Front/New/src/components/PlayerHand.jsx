import Card from './Card'
import { calculateScore } from '../utils/cardUtils'
import './PlayerHand.css'

function PlayerHand({ 
  hand, 
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
    <div className="joueur">
      <h3>Vos cartes:</h3>
      <div className="cartes-container">
        {hand.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <p>Total: {calculateScore(hand)}</p>
      
      <div className="all-buttons-container">
        {!gameOver && (
          <div className="game-buttons">
            <button onClick={onStand} className="game-btn">Conserver ses cartes</button>
            <button onClick={onHit} className="game-btn">Une de plus</button>
          </div>
        )}

        <div className="control-buttons">
          {score > 0 && isDefeated && !scoreSaved && (
            <button onClick={onSaveScore} className="control-btn save-btn">
              Sauvegarder ce score
            </button>
          )}

          {isDefeated && (
            <button onClick={onNewGameAfterDefeat} className="control-btn new-game-btn">
              Nouvelle partie
            </button>
          )}

          {showContinueButton && (
            <>
              <button onClick={onContinue} className="control-btn continue-btn">
                Continuer (Partie suivante)
              </button>
              <button onClick={onReset} className="control-btn reset-btn">
                Recommencer (Score à 0)
              </button>
            </>
          )}

          <button onClick={onBackToHome} className="control-btn home-btn">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlayerHand