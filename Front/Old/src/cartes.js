const couleurs = ['♠', '♥', '♦', '♣'];
const valeurs = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
];

let jeuDeCartes = [];
let mainJoueur = [];
let mainCroupier = [];

function obtenirPoint(valeur) {
  if (valeur === 'A') {
    return 11;
  } else if (['J', 'Q', 'K'].includes(valeur)) {
    return 10;
  } else {
    return parseInt(valeur);
  }
}

function melangerCartes() {
  for (let i = jeuDeCartes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [jeuDeCartes[i], jeuDeCartes[j]] = [jeuDeCartes[j], jeuDeCartes[i]];
  }
}

function creerJeuDeCartes() {
  jeuDeCartes = [];
  for (let couleur of couleurs) {
    for (let valeur of valeurs) {
      jeuDeCartes.push({
        valeur: valeur,
        couleur: couleur,
        points: obtenirPoint(valeur),
      });
    }
  }
  melangerCartes();
}

function tirerCarte() {
  return jeuDeCartes.pop();
}

function distribuerCartes() {
  mainJoueur = [];
  mainCroupier = [];

  mainJoueur.push(tirerCarte());
  mainJoueur.push(tirerCarte());

  mainCroupier.push(tirerCarte());
  mainCroupier.push(tirerCarte());
}

function calculerScore(main) {
  let score = 0;
  let as = 0;

  for (let carte of main) {
    if (carte.valeur === 'A') {
      as++;
      score += 11;
    } else {
      score += carte.points;
    }
  }

  while (score > 21 && as > 0) {
    score -= 10;
    as--;
  }

  return score;
}

function uneDePlus() {
  mainJoueur.push(tirerCarte());
  afficherCartesJoueur();

  if (calculerScore(mainJoueur) > 21) {
    afficherMessage('Vous avez brulé', 'plus de 21');
    desactiverBoutons();
  }
}

function creerCarteHTML(carte, cachee = false) {
  if (cachee) {
    return `<div class="carte carte-cachee">?</div>`;
  }
  return `<div class="carte">${carte.valeur}${carte.couleur}</div>`;
}

function afficherCartesCroupier(montrerTout = false) {
  const croupierDiv = document.querySelector('.croupier');
  let cartesHTML = '<h3>Cartes du croupier:</h3>';

  cartesHTML += creerCarteHTML(mainCroupier[0]);

  if (montrerTout) {
    for (let i = 1; i < mainCroupier.length; i++) {
      cartesHTML += creerCarteHTML(mainCroupier[i]);
    }
    cartesHTML += `<p>Total: ${calculerScore(mainCroupier)}</p>`;
  } else {
    cartesHTML += creerCarteHTML(mainCroupier[1], true);
  }

  croupierDiv.innerHTML = cartesHTML;
}

function afficherCartesJoueur() {
  const joueurDiv = document.querySelector('.joueur');
  let cartesHTML = '<h3>Vos cartes:</h3>';

  for (let carte of mainJoueur) {
    cartesHTML += creerCarteHTML(carte);
  }

  cartesHTML += `<p>Total: ${calculerScore(mainJoueur)}</p>`;
  cartesHTML += `
        <div class="button-container">
            <button onclick="conserver()">Conserver ses cartes</button>
            <button onclick="uneDePlus()">Une de plus</button>
        </div>
    `;
  joueurDiv.innerHTML = cartesHTML;
}
