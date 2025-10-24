import Card from './Card'
import { calculateScore } from '../utils/cardUtils'
import './DealerHand.css'

function DealerHand({ hand, gameOver }) {
  return (
    <div className="croupier">
      <h3>Cartes du croupier:</h3>
      <div className="cartes-container">
        <Card card={hand[0]} />
        {gameOver ? (
          hand.slice(1).map((card, index) => (
            <Card key={index + 1} card={card} />
          ))
        ) : (
          <Card hidden={true} />
        )}
      </div>
      {gameOver && <p>Total: {calculateScore(hand)}</p>}
    </div>
  )
}

export default DealerHand