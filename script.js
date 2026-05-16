/* =========================================
   1. 音声ファイルの設定
   ========================================= */
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2; // BGMの音量を20%に下げる（声を目立たせるため）

const openSe = new Audio('open.mp3');
openSe.volume = 0.6; // カーテンの音を60%に下げる

const popSe = new Audio('pop.mp3');
popSe.volume = 0.6; // 絵文字が出る音を60%に下げる

/* =========================================
   2. ゲームロジック
   ========================================= */
const items = [
  { emoji: '🐶', name: 'いぬ' },
  { emoji: '🐱', name: 'ねこ' },
  { emoji: '🚗', name: 'くるま' },
  { emoji: '🍎', name: 'りんご' },
  { emoji: '🐘', name: 'ぞう' },
  { emoji: '🚃', name: 'でんしゃ' },
  { emoji: '🐸', name: 'かえる' }
];

let currentItem = null;
let isCurtainOpen = false;
let crazyInterval = null;
let buttonPressCount = 0; 
const MAX_PRESSES = 3;    

// DOM要素
const curtainLeft = document.getElementById('curtain-left');
const curtainRight = document.getElementById('curtain-right');
const emojiDisplay = document.getElementById('emoji-display');
const wordBtn = document.getElementById('word-btn');

function initGame() {
  curtainLeft.addEventListener('pointerdown', handleCurtainTap);
  curtainRight.addEventListener('pointerdown', handleCurtainTap);
  wordBtn.addEventListener('pointerdown', handleButtonTap);
}

function handleCurtainTap(e) {
  if (isCurtainOpen) return;
  
  if (bgm.paused) {
    bgm.play().catch(e => console.log("BGMの再生がブロックされました"));
  }

  openSe.currentTime = 0; 
  openSe.play().catch(e => console.log("SEの再生がブロックされました"));

  curtainLeft.classList.add('open');
  curtainRight.classList.add('open');
  isCurtainOpen = true;

  setTimeout(showRandomEmoji, 800);
}

function showRandomEmoji() {
  currentItem = items[Math.floor(Math.random() * items.length)];
  buttonPressCount = 0; 
  
  emojiDisplay.innerText = currentItem.emoji;
  emojiDisplay.className = 'floating';
  emojiDisplay.style.transform = '';
  
  wordBtn.innerText = currentItem.name;
  wordBtn.style.display = 'block';
  
  popSe.currentTime = 0;
  popSe.play().catch(e => console.log("SEの再生がブロックされました"));
  
  teleportButton();
}

function handleButtonTap(e) {
  e.preventDefault();
  
  buttonPressCount++;

  // ひらがなを発話（音量を最大に設定）
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel(); 
    const ut = new SpeechSynthesisUtterance(currentItem.name);
    ut.lang = 'ja-JP';
    ut.rate = 1.1; 
    ut.volume = 1.0; // ←ここでアプリ側で出せる最大音量を指定しています
    speechSynthesis.speak(ut);
  }

  makeEmojiCrazy();
  teleportButton();

  if (buttonPressCount >= MAX_PRESSES) {
    wordBtn.style.display = 'none'; 
    setTimeout(closeCurtain, 1500); 
  }
}

function teleportButton() {
  const btnWidth = wordBtn.offsetWidth || 150;
  const btnHeight = wordBtn.offsetHeight || 80;
  
  const maxX = window.innerWidth - btnWidth - 20; 
  const maxY = window.innerHeight - btnHeight - 20;
  
  const randomX = Math.max(10, Math.floor(Math.random() * maxX));
  const randomY = Math.max(10, Math.floor(Math.random() * maxY));
  
  wordBtn.style.left = `${randomX}px`;
  wordBtn.style.top = `${randomY}px`;
}

function makeEmojiCrazy() {
  if (crazyInterval) clearInterval(crazyInterval);
  
  emojiDisplay.classList.remove('floating');
  
  let count = 0;
  crazyInterval = setInterval(() => {
    const moveX = (Math.random() - 0.5) * (window.innerWidth * 0.4); 
    const moveY = (Math.random() - 0.5) * (window.innerHeight * 0.4);
    const rot = (Math.random() - 0.5) * 720;
    const scale = 0.5 + Math.random() * 1.5;
    
    emojiDisplay.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rot}deg) scale(${scale})`;
    
    count++;
    if (count > 20) { 
      clearInterval(crazyInterval);
      emojiDisplay.style.transform = '';
      emojiDisplay.classList.add('floating');
    }
  }, 50);
}

function closeCurtain() {
  if (!isCurtainOpen) return;

  if (crazyInterval) clearInterval(crazyInterval);
  emojiDisplay.style.transform = '';
  emojiDisplay.classList.remove('floating');
  emojiDisplay.innerText = '';
  
  curtainLeft.classList.remove('open');
  curtainRight.classList.remove('open');
  isCurtainOpen = false;
}

window.onload = initGame;