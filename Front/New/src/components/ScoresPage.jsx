import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ScoresPage.css'

function ScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/Scores/')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des scores')
      }
      const data = await response.json()
      // Trier les scores par ordre décroissant
      const sortedScores = data.sort((a, b) => b.score - a.score)
      setScores(sortedScores)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <div className="scores-page">
        <div className="loading">Chargement des scores...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="scores-page">
        <div className="error">Erreur: {error}</div>
        <div className="error-note">
          Assurez-vous que le backend est démarré sur http://localhost:8000
        </div>
        <Link to="/" className="back-button">Retour au jeu</Link>
      </div>
    )
  }

  return (
    <div className="scores-page">
      <div className="scores-container">
        <h1>🏆 Tableau des Scores 🏆</h1>
        
        <div className="scores-actions">
          <Link to="/" className="back-button">Retour au jeu</Link>
          <button onClick={fetchScores} className="refresh-button">
            🔄 Actualiser
          </button>
        </div>

        {scores.length === 0 ? (
          <div className="no-scores">
            <p>Aucun score enregistré pour le moment</p>
            <p>Jouez une partie pour apparaître dans le classement !</p>
          </div>
        ) : (
          <div className="scores-table-container">
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Joueur</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={score.id} className={index < 3 ? `rank-${index + 1}` : ''}>
                    <td className="rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </td>
                    <td className="player-name">{score.player_name}</td>
                    <td className="score-value">{score.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScoresPage