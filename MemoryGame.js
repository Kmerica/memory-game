document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  let numCards = cards.length;
  let card1 = null;
  let card2 = null;
  let cardsFlipped = 0;
  let currentScore = 0;
  let lowScore = localStorage.getItem('low-score');
  let start = document.getElementById('start');

  // Retrieve the best score from localStorage and display.
  if (lowScore) {
    document.getElementById('best-score').innerText = lowScore;
  };

  // Event listener for a click on a card to execute function handleCardClick.
  for (let card of cards) {
    card.addEventListener('click', handleCardClick);
  };
  
  // Event listener for a click on the start button to execute function startGame.
  let startBtn = document.getElementById('start-button');
  console.log(startBtn);
  startBtn.addEventListener('click', startGame);

  // Function to handle a card click.
  function handleCardClick(e) {
    console.log("I heard that card click!");
    const currentCard = e.currentTarget;
    // If the current card hasn't already been flipped increment the score by 1. 
    if (!currentCard.classList.contains('flipped')) {
      setScore(currentScore + 1);
      console.log('Current Score:', currentScore);
    };
    // Toggle the class of the clicked card to have a value of flipped.
    currentCard.classList.toggle('flipped');
    if (card1 === null) {
      card1 = currentCard;
    } else {
      card2 = currentCard;
      checkForMatch();
      disableClick();
    };
    // Remove event listener for click if a card is flipped or already matched. 
    if (currentCard.classList.contains('flipped') || currentCard.classList.contains('matched')) {
      currentCard.removeEventListener('click', handleCardClick);
    };
  };

  // Function to disable click event listener for 1000ms.  
  function disableClick() {
    cards.forEach(function(card) {
      card.removeEventListener('click', handleCardClick);
    });
    setTimeout(function() {
      cards.forEach(function(card) {
        if (!card.classList.contains('matched')) {
          card.addEventListener('click', handleCardClick);
        };
      });
    }, 1000);
  };

  // Function to check if the images match when 2 cards are flipped.
  function checkForMatch() { 
    if (card1.dataset.image === card2.dataset.image) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      cardsFlipped += 2;
      card1.removeEventListener('click', handleCardClick);
      card2.removeEventListener('click', handleCardClick);
      card1 = null;
      card2 = null;
    } else {
      // If cards don't match remove flipped class to return face down after 1000ms.
      setTimeout(function() {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1 = null;
        card2 = null;
      }, 1000);
    };
    // Checks if all the cards have been flipped and executes endgame function.
    if (cardsFlipped === numCards) endGame();
  };
  
  // Function to start the game when the start button is clicked. 
  // Resets the score to 0, updates game state to playing, shuffles the cards, and assigns images to card elements.
  function startGame() {
    console.log('Game started!');
    setScore(0);
    start.classList.add('playing');
    let indices = [];
    for (let i = 1; i <= numCards / 2; i++) {
      indices.push(i.toString());
    };
    let pairs = shuffle(indices.concat(indices));

      for (let i = 0; i < cards.length; i++) {
      let path = 'seinfeld-gifs/' + pairs[i] + '.gif';
      console.log('Image path:', path);
      cards[i].querySelector('.card-back img').setAttribute('src', path);
      console.log('Image source:', cards[i].querySelector('.card-back img').src);
      cards[i].dataset.image = pairs[i];
    };
  };

  // Function to shuffle an array 
  function shuffle(arr) {
    let arrayCopy = arr.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      let idx2 = Math.floor(Math.random() * (idx1 + 1));

      let temp = arrayCopy[idx1];
      arrayCopy[idx1] = arrayCopy[idx2];
      arrayCopy[idx2] = temp;
    };
    return arrayCopy;
  };

  // Function to set the score and update innerText
  function setScore(newScore) {
    currentScore = newScore;
    console.log('Also The Current Score:', currentScore);
    document.querySelector('#current-score').innerText = currentScore;
  };

  // Function to end the game and display game over container.
  function endGame() {
    let end = document.getElementById('end');
    let score = end.children[1];
    let congratsGif = document.createElement('img');
    congratsGif.classList.add('end-gif')
    congratsGif.src = 'seinfeld-gifs/pez.gif';
    end.insertBefore(congratsGif, score);
    score.innerText = 'Total moves: ' + currentScore;
    let lowScore = +localStorage.getItem('low-score') || Infinity;
    if (currentScore < lowScore) {
      score.innerText += "\nNEW BEST SCORE!!!\nYou're like the Phoenix, rising from Arizona.";
      localStorage.setItem('low-score', currentScore);
      document.getElementById('best-score').innerText = currentScore;
    };
    end.classList.add('game-over');
  };
});



















