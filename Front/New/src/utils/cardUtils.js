const suits = ['♠', '♥', '♦', '♣']
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function getCardPoints(value) {
  if (value === 'A') {
    return 11
  } else if (['J', 'Q', 'K'].includes(value)) {
    return 10
  } else {
    return parseInt(value)
  }
}

export function createDeck() {
  const deck = []
  for (let suit of suits) {
    for (let value of values) {
      deck.push({
        value: value,
        suit: suit,
        points: getCardPoints(value),
      })
    }
  }
  return deck
}

export function shuffleDeck(deck) {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function dealCards(deck) {
  const playerCards = [deck[deck.length - 1], deck[deck.length - 2]]
  const dealerCards = [deck[deck.length - 3], deck[deck.length - 4]]
  const remainingDeck = deck.slice(0, -4)
  
  return {
    playerCards,
    dealerCards,
    remainingDeck
  }
}

export function calculateScore(hand) {
  let score = 0
  let aces = 0

  for (let card of hand) {
    if (card.value === 'A') {
      aces++
      score += 11
    } else {
      score += card.points
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10
    aces--
  }

  return score
}

export function isBlackjack(hand) {
  return hand.length === 2 && calculateScore(hand) === 21
}