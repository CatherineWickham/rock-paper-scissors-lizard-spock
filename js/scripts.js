// reference object for DOM nodes
const html = {
    navButtons: {
        rules: document.querySelector('[data-nav-rules]'),
        reset: document.querySelector('[data-nav-reset]'),
        info: document.querySelector('[data-nav-info]'),
    },
    rules: {
        overlay: document.querySelector('[data-rules-overlay]'),
        close: document.querySelector('[data-rules-close]'),
    },
    info: {
        overlay: document.querySelector('[data-info-overlay]'),
        close: document.querySelector('[data-info-close]'),

    },
    images: {
        player1: document.querySelector('[data-p1-selected-image]'),
        player2: document.querySelector('[data-p2-selected-image]'),
    },
    scores: {
        player1: document.querySelector('#player1Score'),
        player2: document.querySelector('#player2Score'),
    },
    menu: {
        status: document.querySelector('#status'),
        buttonsArray: Array.from(document.querySelectorAll('.selectButton')), // all HTML elements with selectButton class are added to buttonsArray
    },
    secretConfettiButton: document.querySelector('#secretConfettiButton'),
}

// initialization of overall player scores, sets displayed values
let p1Score = 0
html.scores.player1.textContent = p1Score
let p2Score = 0
html.scores.player2.textContent = p2Score

html.images.player1.setAttribute('src', `/images/p1starting.png`)
html.images.player2.setAttribute('src', `/images/p2starting.png`)


const handleOpenRules = () => {
    html.rules.overlay.style.display = 'block'
}
html.navButtons.rules.addEventListener("click", handleOpenRules)

const handleCloseRules = () => {
    html.rules.overlay.style.display = 'none'
}
html.rules.close.addEventListener("click", handleCloseRules)


const handleOpenInfo = () => {
    html.info.overlay.style.display = 'block'
}
html.navButtons.info.addEventListener("click", handleOpenInfo)

const handleCloseInfo = () => {
    html.info.overlay.style.display = 'none'
}
html.info.close.addEventListener("click", handleCloseInfo)


const handleReset = () => {
    p1Score = 0
    html.scores.player1.textContent = p1Score
    p2Score = 0
    html.scores.player2.textContent = p2Score

    html.images.player1.setAttribute('src', `/images/p1starting.png`)
    html.images.player2.setAttribute('src', `/images/p2starting.png`)

    html.images.player1.classList.remove('selectedImagesWin')
    html.images.player2.classList.remove('selectedImagesWin')

    html.menu.status.textContent = "Waiting for move"

    for (const button of html.menu.buttonsArray){
        button.style.background = "#D9D9D9"
    }
}
html.navButtons.reset.addEventListener("click", handleReset)


const bounceAnimation = () => {
    html.images.player1.classList.add('selectedImagesBouncing')
    html.images.player2.classList.add('selectedImagesBouncing')
}

// confetti function
const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };
  
  function shoot() {
    confetti({
      ...defaults,
      particleCount: 100,
      scalar: 1.2,
      shapes: ["star"],
    });
  
    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

// needs to be initialized outside of function so it can be accessed later
let p1Wins = null

const runGame = (event) => {
    const { target } = event
    const p1Selection = Object.keys(target.dataset)[0]

    const p2Options = ['rock', 'paper', 'scissors', 'lizard', 'spock']
    const p2Selection = p2Options[Math.floor(Math.random()*5)]

    html.images.player1.setAttribute('src', `/images/p1${p1Selection}.png`)
    html.images.player2.setAttribute('src', `/images/p2${p2Selection}.png`)

    let winningConditions = null

        switch (p1Selection) {
        case p2Selection:
            p1Wins = null;
            break;
            // in the case of a draw, p1Wins is neither true nor false, therefore null
        case 'rock':
            winningConditions = ['lizard', 'scissors'];
            winningConditions.includes(p2Selection) ? p1Wins = true : p1Wins = false;
            break;
        case 'paper': 
            winningConditions = ['rock', 'spock'];
            winningConditions.includes(p2Selection) ? p1Wins = true : p1Wins = false;
            break;
        case 'scissors': 
            winningConditions = ['paper', 'lizard'];
            winningConditions.includes(p2Selection) ? p1Wins = true : p1Wins = false;
            break;
        case 'lizard': 
            winningConditions = ['spock', 'paper'];
            winningConditions.includes(p2Selection) ? p1Wins = true : p1Wins = false;
            break;
        case 'spock': 
            winningConditions = ['scissors', 'rock'];
            winningConditions.includes(p2Selection) ? p1Wins = true : p1Wins = false;
            break;
    }

    if(p1Wins === true) {
        p1Score = p1Score + 1;
        html.scores.player1.textContent = p1Score;
        html.images.player1.classList.add('selectedImagesWin')
          
          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);

    } else if (p1Wins === false) {
        p2Score = p2Score + 1;
        html.scores.player2.textContent = p2Score;
        html.images.player2.classList.add('selectedImagesWin')

    } else {
        html.images.player1.classList.add('selectedImagesWin')
        html.images.player2.classList.add('selectedImagesWin')
    }

    html.images.player1.classList.remove('selectedImagesBouncing')
    html.images.player2.classList.remove('selectedImagesBouncing')

    return p1Wins
}

const updateStatusPlaying = () => {
    html.menu.status.textContent = ". . ."
}

const updateStatusResult = () => {
    if(p1Wins === true) {
        html.menu.status.textContent = "You Win!!!";

    } else if (p1Wins === false) {
        html.menu.status.textContent = "You Lose";

    } else {
        html.menu.status.textContent = "It's a Draw";
    }
}

const handleSelection = (event) => {
    for (const button of html.menu.buttonsArray){
        button.style.background = "#D9D9D9"
    }
    const { target } = event
    target.style.background = "rgba(255, 199, 0, 0.5)"
    
    updateStatusPlaying()

    html.images.player1.setAttribute('src', `/images/p1starting.png`)
    html.images.player2.setAttribute('src', `/images/p2starting.png`)

    html.images.player1.classList.remove('selectedImagesWin')
    html.images.player2.classList.remove('selectedImagesWin')

    bounceAnimation()

    setTimeout(runGame, 1700, event)
    setTimeout(updateStatusResult, 1700)
}

// loops over all selector buttons and applies event listener
for (const button of html.menu.buttonsArray){
    button.addEventListener('click', handleSelection)
}

const handleSecretConfetti = () => {
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 150);
    setTimeout(shoot, 200);
    setTimeout(shoot, 250);
    setTimeout(shoot, 260);
}
html.secretConfettiButton.addEventListener('click', handleSecretConfetti)