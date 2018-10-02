// ==============================
// Functions
// ==============================
/**
* Initialize variables and initial display states
*/
function init() {
  // Variables, globally scoped (on purpose)
  // Possible game states: start, playing, win, gameOver
  state = "start";
  modal = document.getElementById("modal");
  // Possible words — no longer than 12 letters!
  masterWordBank = [
    "explosion",
    "emergency",
    "detective",
    "beretta",
    "monologue",
    "cliffhanger",
    "villain",
    "bullets",
    "detonate"
  ];
  // Make a copy of the array
  // Note: Using slice() ensures the copies are independent of each other
  wordBank = masterWordBank.slice();
  // Score and other tallies
  wins = 0;
  document.getElementById("wins").textContent = wins;
  maxTurns = 12;
  turns = maxTurns;
  document.getElementById("turns").textContent = "00:"+pad(turns);
  guessed = [];

  //generateWord();
}

/**
* Generates a new word to guess
*/
function generateWord() {
  // Randomly choose from word bank
  var randomNum = Math.floor(((Math.random()) * wordBank.length));
  // Remove chosen word from array (so it doesn't show up again)
  word = wordBank.splice(randomNum, 1);
  // Convert from array
  word = word[0];
  blankCounter = word.length;
  //console.log("Word to guess: " + word);
  //console.log(wordBank);
  var blanks = document.getElementById("blanks");
  var html = "";
  for (var i=0; i < word.length; i++) {
    html += "<td id='let"+i+"'>_</td>";
  }
  blanks.innerHTML = html;
}
/**
* Use regex to see if input is a standard latin character (no accents)
*/
function isLetter(str) {
  // Convert to lower case
  str = str.toLowerCase();
  // If match, return true
  return str.length === 1 && str.match(/[a-z]/i);
}

/**
* Add a leading zero to numbers less than 10
*/
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

/**
* Clear error message
*/
function clearError() {
  var err = document.getElementById("error");
  err.className += " hide";
}

/**
* Output error message
*/
function errorMessage(msg) {
  var err = document.getElementById("error");
  // err.style.display = "block";
  err.className = "alert alert-danger";
  err.textContent = msg;
}

/**
* Reset round, get ready for new word (keep score)
**/
function resetRound() {
  turns = maxTurns;
  document.getElementById("turns").textContent = "00:"+pad(turns);
  guessed = [];
  document.getElementById("guessed").textContent = "";
  // Are there still words left to guess?
  if (wordBank.length === 0) {
    console.log("Word empty, refilling it!");
    // Repopulate the word bank
    wordBank = masterWordBank;
  }
  generateWord();
}

/**
* Reset game completely, wiping out score
**/
function gameOver() {
  wins = 0;
  document.getElementById("wins").textContent = wins;
  resetRound();
}


// ==============================
// Logic
// ==============================
// Set everything up
window.onload = function() {
  init();
};
// Primary game loop, triggered by user input
document.onkeyup = function(event) {
  // Clear any errors from previous input
  clearError();

  // Store user input
  var key = event.key.toLowerCase();
  // console.log("keycode pressed = "+ event.keyCode);

  // Check game state
  if (state !== "playing") {
    // Spacebar pressed?
    if(event.keyCode === 32) {
      // change game state
      state = "playing";
      // hide modal
      modal.style.display = "none";
      document.getElementById("win").style.display = "none";
      document.getElementById("lose").style.display = "none";
      resetRound();
    }
    return; // exit the event loop
  }


  // Is it a letter?
  if(!(isLetter(key))) {
    // Display error
    errorMessage("That's not a letter. Try again.");
    // Exit the event loop
    return;
  }
  // Has it been guessed already?
  if(guessed.indexOf(key) !== -1) {
    errorMessage("You already guessed that letter. Try again.");
    // Exit the event loop
    return;
  }

  // Add letter to letters guessed collection
  guessed.push(key);
  guessed.sort();

  var list = ""; // text container
  for (var i=0; i<guessed.length; i++) {
    list += guessed[i];
    list += " ";
  }
  document.getElementById("guessed").textContent = list;

  // Compare input to target word
  // Array to store any matches
  var indices = [];
  // Search
  for(var i=0; i<word.length;i++) {
      if (word[i] === key) indices.push(i);
  }
  // If there are any matches, let's deal with 'em
  if (indices.length > 0) {
    // console.log("Found a match! Here's the index: " + indices);
    // Map the index of found letters to the word table
    for (var j=0; j<indices.length; j++) {
      var pos = indices[j];
      document.getElementById("let"+pos).textContent = key;
      blankCounter--;
    }
    // No blanks left? Nicely done!
    if(blankCounter===0) {
      console.log("YOU WON!");
      wins++;
      document.getElementById("wins").textContent = wins;
      state = "win";

    }
  } else {
    // No match, take a turn away
    console.log("No match.");
    // Decrement turns remaining
    turns--;
    console.log("Turns remaining: "+turns);
    document.getElementById("turns").textContent = "00:"+pad(turns);
    // Running out of turns?
    if(turns<5) {
      document.getElementById("turns").style.color = "red";
    }
    // No more turns? Game over, baby...
    if(turns===0) {
      // Game over!
      // errorMessage("You ran out of turns. GAME OVER, LOSER.");
      state = "gameOver";
      gameOver();
    }
  } // end if else

  if (state === "win") {
    document.getElementById("win").style.display = "block";
    document.getElementById("wordSolved").textContent = "\""+word+"\"";
    document.getElementById("turnsLeft").textContent = turns;
    // resetRound();
    return; // exit the event loop
  }

  if (state === "gameOver") {
    document.getElementById("lose").style.display = "block";
    return; // exit the event loop
  }


};