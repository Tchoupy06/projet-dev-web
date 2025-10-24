import './ScoreBoard.css'

function ScoreBoard({ score, cardsLeft }) {
  return (
    <div className="score-board">
      <div className="score-display">
        <h2>Score: {score}</h2>
        <p>Parties gagnées</p>
      </div>
    </div>
  )
}

export default ScoreBoard