import './Card.css'

function Card({ card, hidden = false }) {
  if (hidden) {
    return <div className="carte carte-cachee">?</div>
  }
  
  return (
    <div className="carte">
      {card.value}{card.suit}
    </div>
  )
}

export default Card