// Ici vous pouvez écrire votre javascript
const StartButton = document.getElementById('StartButton');
const startcontainer = document.querySelector('.start');
const gamecontainer = document.querySelector('.game');

function startgame() {
  startcontainer.classList.add('hide');
  gamecontainer.classList.add('activ');

  creerJeuDeCartes();
  distribuerCartes();
  afficherCartesJoueur();
  afficherCartesCroupier(false);
}

function conserver() {
  afficherCartesCroupier(true);
  afficherMessage('Fin de partie');
  desactiverBoutons();
}

function afficherMessage(message, type = '') {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = message;
  messageBox.className = `message-box show ${type}`;

  // Cacher le message après 3 secondes
  setTimeout(() => {
    messageBox.classList.remove('show');
  }, 3000);
}

function desactiverBoutons() {
  const boutons = document.querySelectorAll('.button-container button');
  boutons.forEach((bouton) => {
    bouton.disabled = true;
    bouton.style.opacity = '0.5';
  });
}
