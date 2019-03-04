
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

/* DRAG & DROP  */

const dragzone = document.querySelector(".dragzone");
Sortable.create(dragzone, {
  group: "sorting",
  sort: true,
  animation: 150,
  chosenClass: "chosen"
});


// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

/* NEW GAME - VARIABLES */

const instructions = Array.prototype.slice.call(document.querySelectorAll("#instructions > p"));
const guideHeading = document.getElementById("guide");
const chunkDivs = Array.prototype.slice.call(document.getElementsByClassName("chunk"));
const chunkParagraphs = Array.prototype.slice.call(document.querySelectorAll(".chunk > p"));

const readyBtn = document.getElementById("ready-game");
const startGameBtn = document.getElementById("start-game");
const quitGameBtn = document.getElementById("quit-btn");
let currentBtn = null;
let isStart = true;

const selectedGenre = document.getElementById('selected-genre');
let genre = document.getElementById("genreSelect");
let songs = [];
let songsClone = [];
let tmpArrSongs = [];
let randomSongIdx;
let currentSongTitle;

const artist = document.getElementById("artist");
const title = document.getElementById("title");
const ytVideo = document.querySelectorAll(".yt-video > iframe")[0];
const roundDisplay = document.getElementById("roundDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
let round = 0;
let score = 0;
let summaryDisplay = false;


// ------------------------------------------------------------------------------------------------------------
/* NEW GAME - FUNCTIONS  */

const ready = () => {
  resetOverview();
  hideIntro();
  summaryDisplay ? gameOverview.removeChild(resultDisplay) :  resultDisplay.className = null;
  guideHeading.style.opacity = 0;
  switchButtons(readyBtn, startGameBtn);
  chunkDivs.forEach(chunk => chunk.classList.add("cover"));
};

const selectGenre = () => {
  genre.value === "indie" ? songs = indie : songs = mixed;
  songsClone = songs.slice(0);
};

const resetOverview = () => {
  round = 0; 
  score = 0;
  roundDisplay.textContent = round;
  scoreDisplay.textContent = score;
}

const start = () => {
  songs.length === 0 ? selectGenre() : songs;
  round += 1;
  
  randomSongIdx = generateIdx(songsClone);
  currentSongTitle = songsClone[randomSongIdx].title;
  tmpArrSongs.push(songsClone[randomSongIdx]);
  for (let i = 0; i < chunkParagraphs.length; i++) {
    chunkParagraphs[i].textContent = songsClone[randomSongIdx].lyrics[i];
  }
  juggleLyrics(dragzone, chunkDivs);
  updateDisplay();
  displaySongInfo();
  chunkDivs.forEach(chunk => {
    chunk.classList.remove("cover");
    chunk.classList.add("uncover");
  });

  songsClone.splice(randomSongIdx, 1);
  currentBtn = document.getElementsByClassName('displayed')[0];
  switchButtons(currentBtn, submitBtn);
  hideGenreSelect();
};

const updateDisplay = () => {
  readyBtn.textContent = 'Ready to play again?';
  guideHeading.textContent = "Order the lyrics";
  guideHeading.style.opacity = 1;
  roundDisplay.textContent = round;
  artist.textContent = songsClone[randomSongIdx].artist;
  title.textContent = songsClone[randomSongIdx].title;
  ytVideo.setAttribute("src", songsClone[randomSongIdx].link);
}

const generateIdx = arr => Math.floor(Math.random() * arr.length);

const juggleLyrics = (parent, arr) => {
  for (let i = arr.length; i > 0; i--) {
    parent.appendChild(arr[(Math.random() * i) | 0]);
  }
};

const displaySongInfo = () => {
  artist.style.opacity = 1;
  setTimeout(() => {
    title.style.opacity = 1;
  }, 500);
};

const hideIntro = () => {
  for (let i = 0; i < instructions.length; i++) {
    if (i !== 2) {
      setTimeout(() => {
        instructions[i].style.display = "none";
      }, 1000);
      instructions[i].style.opacity = 0;
    } else {
      instructions[i].style.marginBottom = "1.5em";
    }
  }
};

const hideGenreSelect = () => {
  setTimeout(() => {
    genre.style.display = "none";
  }, 1000);
  genre.style.opacity = 0;
  selectedGenre.innerHTML = `Genre: <span>${genre.value}</span>`;
};

const showGenreSelect = () => {
  genre.style.opacity = 1;
  genre.style.display = "inline-block";
  selectedGenre.innerHTML = `Genre: ${genre.outerHTML}`;
  genre = document.getElementById("genreSelect");
  genre.addEventListener("change", selectGenre);
};

const switchButtons = (button_1, button_2) => {
  button_1.style.opacity = 0;
  button_2.style.opacity = 0;
  setTimeout(() => {
    button_1.classList.remove("displayed");
    button_2.classList.add("displayed");
    button_2.style.opacity = 1;
  }, 400);
};

// ------------------------------------------------------------------------------------------------------------
/* NEW GAME - EVENT LISTENERS */
genre.addEventListener("change", selectGenre);
readyBtn.addEventListener("click", ready);
startGameBtn.addEventListener("click", start);


// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

/* EVALUATION - VARIABLES */

const overview = document.getElementById("overview");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const repeatBtn = document.getElementById("repeat-btn");
const gameOverview = document.getElementsByClassName("game-overview")[0];
const resultDisplay = document.createElement("p");
const winText = " Well done! Your solution is CORRECT.";
const failText = "Try again! Your solution was NOT CORRECT.";
let currentSong;
let isCorrect;

// ------------------------------------------------------------------------------------------------------------
/* EVALUATION - FUNCTIONS */

const evaluate = () => {
  isStart = false;
  currentSong = songs.find((currentSong) => currentSong.title === currentSongTitle);
  let songLyrics = currentSong.lyrics;
  let newChunkParagraphs = Array.prototype.slice.call(document.querySelectorAll(".chunk > p"));
  let userLyrics = [];
  for (let i = 0; i < newChunkParagraphs.length; i++) {
    userLyrics.push(newChunkParagraphs[i].textContent);
  }
  compare(songLyrics, userLyrics);
  result(isCorrect, resultDisplay);
  gameOverview.appendChild(resultDisplay);
  setTimeout(() => { 
    resultDisplay.style.opacity = 1; 
  }, 400);
};

const compare = (arr_1, arr_2) => {
  let compareArr = [];
  for (let i = 0; i < arr_1.length; i++) {
    arr_1[i] === arr_2[i] ? compareArr.push(arr_1[i]) : null;
  }
  compareArr.length === 6 ? isCorrect = true : isCorrect = false;
};

const result = (bool, el) => {
  if (bool) {
    dragzone.style.border = "2px dashed #86A358";
    el.textContent = winText;
    el.classList.add("winnerStyle");
    score += 10;
    scoreDisplay.textContent = score;
    switchButtons(submitBtn, nextBtn);
  } else {
    dragzone.style.border = "2px dashed #ED5C5C";
    el.textContent = failText;
    el.classList.add("loserStyle");
    switchButtons(submitBtn, repeatBtn);
  }
};

const next = () => {
  if (songsClone.length === 0) { quitGame(); }
  else { resetToRepeat(); start(); }
};

const repeat = () => {
  resetToRepeat();
  switchButtons(repeatBtn, submitBtn);
  for (let i = 0; i < chunkParagraphs.length; i++) {
    chunkParagraphs[i].textContent = currentSong.lyrics[i];
  }
  juggleLyrics(dragzone, chunkDivs);
};

const resetToRepeat = () => {
  gameOverview.removeChild(resultDisplay);
  isCorrect = null;
  resultDisplay.className = null;
  dragzone.style.border = null;
  chunkDivs.forEach(chunk => {
    chunk.parentNode.removeChild(chunk);
    dragzone.appendChild(chunk);
  });
};

// ------------------------------------------------------------------------------------------------------------
/* EVALUATION - EVENT LISTENERS */
submitBtn.addEventListener("click", evaluate);
nextBtn.addEventListener("click", next);
repeatBtn.addEventListener("click", repeat);


// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

/* END GAME - FUNCTIONS */

const quitGame = () => {
  let currentBtn = document.getElementsByClassName('displayed')[0];
  switchButtons(currentBtn, readyBtn);
  gameOverview.appendChild(resultDisplay);
  if (songsClone.length === 0) {
    resultDisplay.textContent = `Well done! You've exhausted all the songs. Your overall score is ${score}.`;
  } else {
    resultDisplay.textContent = `Your overall score from this game is ${score}.`;
  }
  resultDisplay.className = 'summary';
  summaryDisplay = true;
  dragzone.style.border = null;
  showGenreSelect();
  selectGenre();
}

// ------------------------------------------------------------------------------------------------------------
/* END GAME - EVENT LISTENERS */
quitGameBtn.addEventListener('click', quitGame);