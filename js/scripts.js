/**
 * An object literal containing references to all DOM nodes that need to be targeted
 * during operation of the app. This ensures that all HTML elements can be easily
 * referenced from a single data structure. The outer properties refer to the section of
 * the document the elements are found in, while the properties nested below these refer
 * to the elements themselves.
 */
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
        buttonsArray: Array.from(document.querySelectorAll('.selectButton')), 
        // note: ALL elements with selectButton class are added to buttonsArray
    },
    secretConfettiButton: document.querySelector('#secretConfettiButton'),
}


// Setting of starting values:

// p1Score and p2Score variables keep track of number of wins for each player
// The initial displayed values are set to zero using the html reference object
let p1Score = 0
html.scores.player1.textContent = p1Score
let p2Score = 0
html.scores.player2.textContent = p2Score

// The starting images in each player's panel are set to a neutral fist
html.images.player1.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p1starting.png`)
html.images.player2.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p2starting.png`)

/** 
 * A Boolean value indicating if the user (player 1) has won (true) or not (false)
 */
let p1Wins = null
// is used by several functions, therefore must be initialized externally


// Functions for visual enhancements:

/** 
 * Function that applies the appropriate CSS class to the images in each player's panel
 * that runs a bouncing animation. This should be applied every time a new round of the game
 * is started
 */
const bounceAnimation = () => {
    html.images.player1.classList.add('selectedImagesBouncing')
    html.images.player2.classList.add('selectedImagesBouncing')
}

/** 
 * Object containing the default settings for the confetti effect
 */
const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };
  
/** 
* Function that generates a confetti effect when the user (player 1) wins a round
*/
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


// Rules Overlay handlers:

/** 
 * Event handler fired by clicking the How to Play button in the nav bar which opens the
 * Rules Overlay
 */
const handleOpenRules = () => {
    html.rules.overlay.style.display = 'block'
}
html.navButtons.rules.addEventListener("click", handleOpenRules)

/** Event handler which closes the Rules Overlay on click of its close button*/
const handleCloseRules = () => {
    html.rules.overlay.style.display = 'none'
}
html.rules.close.addEventListener("click", handleCloseRules)


// Info Overlay handlers:

/** 
 * Event handler fired by clicking the Info button in the nav bar which opens the Info
 * Overlay
 */
const handleOpenInfo = () => {
    html.info.overlay.style.display = 'block'
}
html.navButtons.info.addEventListener("click", handleOpenInfo)

/** Event handler which closes the Info Overlay on click of its close button*/
const handleCloseInfo = () => {
    html.info.overlay.style.display = 'none'
}
html.info.close.addEventListener("click", handleCloseInfo)


// Reset handler:

/** 
 * Event handler fired by clicking the Reset button in the nav bar which clears the board
 * of any existing data, re-applies all original styling and restores HTML text to starting
 * defaults
 */
const handleReset = () => {
    // Score variables are reset
    p1Score = 0
    html.scores.player1.textContent = p1Score
    p2Score = 0
    html.scores.player2.textContent = p2Score

    // Images in the players panel are reset to starting images
    html.images.player1.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p1starting.png`)
    html.images.player2.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p2starting.png`)

    // Styling applied on the image in the winning player's panel is removed
    html.images.player1.classList.remove('selectedImagesWin')
    html.images.player2.classList.remove('selectedImagesWin')

    // The status indicator in the game menu is reset to the starting text
    html.menu.status.textContent = "Waiting for move"

    // All menu buttons are re-styled to original color
    for (const button of html.menu.buttonsArray){
        button.style.background = "#D9D9D9"
    }
}
html.navButtons.reset.addEventListener("click", handleReset)


// Status indicator functions

/** 
 * Function that sets the text of the status indicator to ellipses while a round is being
 * played, to indicate ongoing action
 */
const updateStatusPlaying = () => {
    html.menu.status.textContent = ". . ."
}

/** 
 * Function that sets the text of the status indicator according to the result of the round
 * Uses {@link p1Wins} to determine the result.
 */
const updateStatusResult = () => {
    if(p1Wins === true) {
        html.menu.status.textContent = "You Win!!!";

    } else if (p1Wins === false) {
        html.menu.status.textContent = "You Lose";

    } else {
        html.menu.status.textContent = "It's a Draw";
    }
}

// Main game logic

/** 
 * Function that runs a single round of the game. It determines the user's selection
 * (player 1), then simulates a selection for player 2 and determines which player has
 * won according to the winning conditions for each selection. The player's scores are
 * updated and visual effects are added to the player's panel images accordingly.
 * @param {object} event - event object generated by the event listener on the selected
 * menu button
 * @returns {Boolean} {@link p1Wins} 
 */
const runGame = (event) => {
    // extracts the user's selection from the event listener that was fired and stores it
    // in the p1Selection variable
    const { target } = event
    const p1Selection = Object.keys(target.dataset)[0]

    // randomly selects an option for player 2
    const p2Options = ['rock', 'paper', 'scissors', 'lizard', 'spock']
    const p2Selection = p2Options[Math.floor(Math.random()*5)]

    // updates the images in the player's panels according to their selections
    html.images.player1.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p1${p1Selection}.png`)
    html.images.player2.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p2${p2Selection}.png`)

    /** 
    * winningConditions array stores the options that player 2 could have selected that
    * would result in player 1 winning. These values will change based on what player 1
    * has selected
    */
    let winningConditions = null

        /** compares player 1 selection agaisnt player 2 selection to set the value of
        * {@link p1Wins}, using the includes() method to check if p2 selection is in the
        * winning conditions array
        */
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

    // conditional that evaluates which actions to take based on which player won
    if(p1Wins === true) {
        // updates score
        p1Score = p1Score + 1;
        html.scores.player1.textContent = p1Score;

        // adds winning visual highlight effect to player's image
        html.images.player1.classList.add('selectedImagesWin')
          
        // produces confetti when the user has won (player 1 only)
          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);

    } else if (p1Wins === false) {
        p2Score = p2Score + 1;
        html.scores.player2.textContent = p2Score;
        html.images.player2.classList.add('selectedImagesWin')

    } else {
        // in the case of a draw, no scores are added and both images get the winning
        // visual highlight effect
        html.images.player1.classList.add('selectedImagesWin')
        html.images.player2.classList.add('selectedImagesWin')
    }

    /** 
    * CSS classes applied to player images by {@link bounceAnimation} function need to be
    * cleared at the end of each round to allow the animation to run when next applied
    */
    html.images.player1.classList.remove('selectedImagesBouncing')
    html.images.player2.classList.remove('selectedImagesBouncing')

    return p1Wins
}

/** 
 * Event handler fired by clicking one of the menu buttons, which triggers a new round of
 * the game. The styling of the clicked button is updated, the player's images are
 * re-initialized to starting conditions, and visual cues are added to indicate the game is
 * in progress using {@link updateStatusPlaying} and {@link bounceAnimation}. The game is
 * run using {@link runGame} and status indicator is updated according to the result of
 * the round using {@link updateStatusResult}
 * @param {object} event - event object generated by the event listener on the selected
 * menu button 
 */
const handleSelection = (event) => {
    // resets any previously styled menu buttons on start of new round
    for (const button of html.menu.buttonsArray){
        button.style.background = "#D9D9D9"
    }
    // determines which button was clicked and restyles it to show user which button they
    // chose
    const { target } = event
    target.style.background = "rgba(255, 199, 0, 0.5)"
    
    // removes winning styling effects that may have been applied in previous rounds
    html.images.player1.classList.remove('selectedImagesWin')
    html.images.player2.classList.remove('selectedImagesWin')

    // sets player images to starting defaults
    html.images.player1.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p1starting.png`)
    html.images.player2.setAttribute('src', `https://catherinewickham.co.za/projects/rpsls/images/p2starting.png`)

    // shows visual cues to indicate game in progress 
    updateStatusPlaying()
    bounceAnimation()

    // after a delay that allows the bounce animation to run, the round is played and the
    // status indicator is updated with the result of the round
    setTimeout(runGame, 1700, event)
    setTimeout(updateStatusResult, 1700)
}
// loops over all menu buttons and applies the event listener to each
for (const button of html.menu.buttonsArray){
    button.addEventListener('click', handleSelection)
}

// hidden Easter egg function that generates more confetti :P
const handleSecretConfetti = () => {
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 150);
    setTimeout(shoot, 200);
    setTimeout(shoot, 250);
    setTimeout(shoot, 260);
}
html.secretConfettiButton.addEventListener('click', handleSecretConfetti)