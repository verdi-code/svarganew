const gameGrid = document.getElementById('game-grid');
const timerEl = document.getElementById('timer');
const resultEl = document.getElementById('result');
const livesEl = document.getElementById('lives');
const winSound = document.getElementById('win-sound');
const failSound = document.getElementById('fail-sound');
const highScoreEl = document.getElementById('highscore');

let chances = 3;
let timer;
let interval;
let flipped = [], matched = [], symbols = [];

function shuffleSymbols() {
  const iconList = [
    'twemoji:sushi',
    'twemoji:rice-ball',
    'twemoji:oden',
    'twemoji:fish-cake-with-swirl',
    'twemoji:shrimp',
    'twemoji:curry-rice',
    'twemoji:rice-cracker',
    'twemoji:dango'
  ];
  symbols = [...iconList, ...iconList].sort(() => 0.5 - Math.random());
}

function updateLives() {
  livesEl.classList.add('animate');
  livesEl.innerText = '❤️'.repeat(chances);
  setTimeout(() => livesEl.classList.remove('animate'), 300);
}

function createGrid() {
  gameGrid.innerHTML = '';
  symbols.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;

    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', symbol);
    icon.setAttribute('width', '36');
    icon.setAttribute('height', '36');
    icon.style.display = 'none'; // disembunyikan

    card.appendChild(icon);
    card.addEventListener('click', () => flipCard(card));
    gameGrid.appendChild(card);
  });
}

function flipCard(card) {
  if (flipped.length >= 2 || matched.includes(card.dataset.index)) return;

  const icon = card.querySelector('iconify-icon');
  icon.style.display = 'block';

  flipped.push(card);

  if (flipped.length === 2) {
    const [first, second] = flipped;
    if (first.dataset.symbol === second.dataset.symbol) {
      winSound.play();
      matched.push(first.dataset.index, second.dataset.index);
      flipped = [];
      if (matched.length === symbols.length) {
        clearInterval(interval);
        const nextTime = new Date().getTime() + 24*60*60*1000;
        localStorage.setItem('playedUntil', nextTime);
        resultEl.innerText = '🎉 Selamat!';
        showWinPopup();
        const score = 30 - timer;
        const best = localStorage.getItem('highScore') || 99;
        if (score < best) {
          localStorage.setItem('highScore', score);
          highScoreEl.innerText = score;
        }
      }
    } else {
      setTimeout(() => {
        flipped.forEach(c => {
          c.querySelector('iconify-icon').style.display = 'none';
        });
        flipped = [];
      }, 800);
    }
  }
}

function resetGame() {
  flipped = [];
  matched = [];
  timer = 30;
  updateLives();
  shuffleSymbols();
  createGrid();
  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    timerEl.innerText = `Waktu: ${timer}`;
    if (timer <= 0) {
      clearInterval(interval);
      chances--;
      failSound.play();
      if (chances > 0) {
        updateLives();
        resultEl.innerText = `⏰ Waktu habis! Sisa nyawa: ${chances}. Main lagi!`;
        setTimeout(() => resetGame(), 1500);
      } else {
        const nextTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('playedUntil', nextTime);
        resultEl.innerText = '💀 Kesempatan habis! Coba lagi besok.';
        updateLives();
      }
    }
  }, 1000);
}

function startGame() {
  const playedUntil = localStorage.getItem('playedUntil');
  if (playedUntil && new Date().getTime() < parseInt(playedUntil)) {
    resultEl.innerText = "⛔ Kamu sudah bermain hari ini. Silakan kembali besok.";
    return;
  }

  const high = localStorage.getItem('highScore') || 0;
  highScoreEl.innerText = high;
  resetGame();
}

document.getElementById('playButton').addEventListener('click', () => {
  document.getElementById('playButton').style.display = 'none';
  startGame();
});