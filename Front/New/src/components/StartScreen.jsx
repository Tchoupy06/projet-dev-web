import { Link } from 'react-router-dom'
import './StartScreen.css'

function StartScreen({ onStartGame }) {
  return (
    <div className="start">
      <h1>Black Jack !</h1>
      <p>
        Essayez de battre le croupier en obtenant une main aussi proche que
        possible de 21
      </p>
      <div className="start-buttons">
        <button id="StartButton" onClick={onStartGame}>
          Démarrer une nouvelle partie
        </button>
        <Link to="/scores" className="scores-button">
          🏆 Voir les scores
        </Link>
      </div>
    </div>
  )
}

export default StartScreen