import { useEffect, useRef } from 'react'
import './BurnEffect.css'

function BurnEffect({ show, onComplete }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const fireRef = useRef(null)

  useEffect(() => {
    if (show && canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Configuration du feu (adaptée du burn.js)
      const height = 80
      const width = 100
      const fire = new Array(width * height).fill(0)
      fireRef.current = fire

      // Redimensionner le canvas pour couvrir l'écran
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const scaleX = canvas.width / (width * 10)
      const scaleY = canvas.height / (height * 10)

      function burn() {
        // Randomiser la deuxième ligne depuis le bas
        for(let i = 0; i < width; i++) {
          fire[i + width] = Math.random() * 255
        }

        // Calculer la propagation du feu
        for(let y = height; y > 1; y--) {
          for(let x = 0; x < width; x++) {
            let i = y * width + x
            fire[i] = Math.floor((
              fire[(y-1) * width + (x-1+width) % width] +     // en bas à gauche
              fire[(y-1) * width + (x  +width) % width] +     // directement en bas
              fire[(y-1) * width + (x+1+width) % width] +     // en bas à droite
              fire[(y-2) * width + (x  +width) % width]       // deux lignes en bas
            ) / 4.04)
          }
        }

        // Effacer le canvas
        context.clearRect(0, 0, canvas.width, canvas.height)

        // Dessiner le feu
        for(let i = width * 4; i < width * height; i++) {
          if (fire[i] > 0) {
            context.beginPath()
            const x = (i % width) * 10 * scaleX
            const y = (height - Math.floor(i / width)) * 10 * scaleY
            const cellWidth = 10 * scaleX
            const cellHeight = 10 * scaleY
            
            context.rect(x, y, cellWidth, cellHeight)
            
            // Créer un gradient de couleur du rouge au jaune selon l'intensité
            const intensity = fire[i]
            let red = Math.min(255, intensity)
            let green = Math.max(0, intensity - 100)
            let blue = 0
            
            context.fillStyle = `rgb(${red}, ${green}, ${blue})`
            context.fill()
          }
        }

        if (show) {
          animationRef.current = window.requestAnimationFrame(burn)
        }
      }

      // Démarrer l'animation
      burn()

      return () => {
        if (animationRef.current) {
          window.cancelAnimationFrame(animationRef.current)
        }
      }
    } else if (!show && animationRef.current) {
      // Arrêter l'animation quand show devient false
      window.cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [show])

  if (!show) return null

  return (
    <div className="burn-overlay">
      <canvas 
        ref={canvasRef}
        className="burn-canvas"
      />
      <div className="burn-text">🔥 BRÛLÉ! 🔥</div>
    </div>
  )
}

export default BurnEffect