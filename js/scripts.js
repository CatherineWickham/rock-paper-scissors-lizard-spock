// reference object for DOM nodes
const html = {
    navButtons: {
        rules: document.querySelector('[data-nav-rules]'),
        reset: document.querySelector('[data-nav-reset]')
    },
    rulesOverlay: document.querySelector('[data-rules-overlay]'),
    rulesClose: document.querySelector('[data-rules-close]'),
    p1Image: document.querySelector('[data-p1-selected-image]'),
    p2Image: document.querySelector('[data-p2-selected-image]'),
    player1Score: document.querySelector('#player1Score'),
    player2Score: document.querySelector('#player2Score'),
    status: document.querySelector('#status')
}

// initialization of overall player scores, sets displayed values
let p1Score = 0
html.player1Score.textContent = p1Score
let p2Score = 0
html.player2Score.textContent = p2Score

html.p1Image.setAttribute('src', `/images/p1starting.png`)
html.p2Image.setAttribute('src', `/images/p2starting.png`)


const handleOpenRules = () => {
    html.rulesOverlay.style.display = 'block'
}
html.navButtons.rules.addEventListener("click", handleOpenRules)


const handleCloseRules = () => {
    html.rulesOverlay.style.display = 'none'
}
html.rulesClose.addEventListener("click", handleCloseRules)


const handleReset = () => {
    p1Score = 0
    html.player1Score.textContent = p1Score
    p2Score = 0
    html.player2Score.textContent = p2Score

    html.p1Image.setAttribute('src', `/images/p1starting.png`)
    html.p2Image.setAttribute('src', `/images/p2starting.png`)

    html.p1Image.classList.remove('selectedImagesWin')
    html.p2Image.classList.remove('selectedImagesWin')

    html.status.textContent = "Waiting for move"
}
html.navButtons.reset.addEventListener("click", handleReset)


const bounceAnimation = () => {
    html.p1Image.classList.add('selectedImagesBouncing')
    html.p2Image.classList.add('selectedImagesBouncing')
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
      particleCount: 30,
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

    html.p1Image.setAttribute('src', `/images/p1${p1Selection}.png`)
    html.p2Image.setAttribute('src', `/images/p2${p2Selection}.png`)

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
        html.player1Score.textContent = p1Score;
        html.p1Image.classList.add('selectedImagesWin')
          
          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);

    } else if (p1Wins === false) {
        p2Score = p2Score + 1;
        html.player2Score.textContent = p2Score;
        html.p2Image.classList.add('selectedImagesWin')

    } else {
        html.p1Image.classList.add('selectedImagesWin')
        html.p2Image.classList.add('selectedImagesWin')
    }

    html.p1Image.classList.remove('selectedImagesBouncing')
    html.p2Image.classList.remove('selectedImagesBouncing')

    return p1Wins
}

const updateStatusPlaying = () => {
    html.status.textContent = ". . ."
}

const updateStatusResult = () => {
    if(p1Wins === true) {
        html.status.textContent = "You Win!!!";

    } else if (p1Wins === false) {
        html.status.textContent = "You Lose";

    } else {
        html.status.textContent = "It's a Draw";
    }
}

const handleSelection = (event) => {
    updateStatusPlaying()

    html.p1Image.setAttribute('src', `/images/p1starting.png`)
    html.p2Image.setAttribute('src', `/images/p2starting.png`)

    html.p1Image.classList.remove('selectedImagesWin')
    html.p2Image.classList.remove('selectedImagesWin')

    bounceAnimation()

    setTimeout(runGame, 1700, event)
    setTimeout(updateStatusResult, 1700)
}


// all HTML elements with selectButton class are added to buttonsArray
const buttonsArray = Array.from(document.querySelectorAll('.selectButton'))

    // loops over all selector buttons and applies event listener
    for (const button of buttonsArray){
        button.addEventListener('click', handleSelection)
    }
