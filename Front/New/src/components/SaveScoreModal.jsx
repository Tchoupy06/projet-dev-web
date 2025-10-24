import { useState } from 'react'
import './SaveScoreModal.css'

function SaveScoreModal({ score, onSave, onCancel }) {
  const [playerName, setPlayerName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!playerName.trim()) return

    setSaving(true)
    try {
      const response = await fetch('http://localhost:8000/Scores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: score,
          player_name: playerName.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde du score')
      }

      onSave()
    } catch (error) {
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🏆 Félicitations !</h2>
        <p>Votre score final est de <strong>{score}</strong> parties gagnées</p>
        <p>Entrez votre nom pour sauvegarder ce score :</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Votre nom..."
            maxLength={50}
            autoFocus
            disabled={saving}
          />
          <div className="modal-buttons">
            <button 
              type="submit" 
              disabled={!playerName.trim() || saving}
              className="save-btn"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              disabled={saving}
              className="cancel-btn"
            >
              Ignorer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaveScoreModal