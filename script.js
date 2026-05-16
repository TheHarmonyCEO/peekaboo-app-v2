/* =========================================
   1. 音声ファイルの設定
   ========================================= */
const bgm = new Audio('bgm.mp3');
bgm.loop = true;

const openSe = new Audio('open.mp3');
const popSe = new Audio('pop.mp3');

/* =========================================
   2. ゲームロジック
   ========================================= */
// 数字の絵文字を含めたお子様向け絵文字リスト
const items = [
  // ユーザー作成リスト
  { emoji: '🐶', name: 'いぬ' }, { emoji: '🐱', name: 'ねこ' }, { emoji: '🐭', name: 'ねずみ' },
  { emoji: '🐰', name: 'うさぎ' }, { emoji: '🦊', name: 'きつね' }, { emoji: '🐻', name: 'くま' },
  { emoji: '🐼', name: 'ぱんだ' }, { emoji: '🐯', name: 'とら' }, { emoji: '🦁', name: 'らいおん' },
  { emoji: '🐮', name: 'うし' }, { emoji: '🐷', name: 'ぶた' }, { emoji: '🐸', name: 'かえる' },
  { emoji: '🐵', name: 'さる' }, { emoji: '🐧', name: 'ぺんぎん' }, { emoji: '🐤', name: 'ひよこ' },
  { emoji: '🐘', name: 'ぞう' }, { emoji: '🦒', name: 'きりん' },
  { emoji: '🍎', name: 'りんご' }, { emoji: '🍊', name: 'みかん' }, { emoji: '🍌', name: 'ばなな' },
  { emoji: '🍉', name: 'すいか' }, { emoji: '🍇', name: 'ぶどう' }, { emoji: '🍓', name: 'いちご' },
  { emoji: '🍅', name: 'とまと' }, { emoji: '🍙', name: 'おにぎり' }, { emoji: '🍞', name: 'ぱん' },
  { emoji: '🚗', name: 'くるま' }, { emoji: '🚌', name: 'ばす' }, { emoji: '🚓', name: 'ぱとかー' },
  { emoji: '🚑', name: 'きゅうきゅうしゃ' }, { emoji: '🚒', name: 'しょうぼうしゃ' }, { emoji: '✈️', name: 'ひこうき' },
  { emoji: '🚂', name: 'きしゃ' }, { emoji: '⛵', name: 'ふね' },
  { emoji: '🌻', name: 'ひまわり' }, { emoji: '⭐', name: 'ほし' }, { emoji: '🎈', name: 'ふうせん' },
  { emoji: '✂️', name: 'はさみ' }, { emoji: '🥄', name: 'すぷーん' },
  
  // 追加：数字の絵文字（ハッキリした発音用にひらがなを設定）
  { emoji: '0️⃣', name: 'ぜろ' }, { emoji: '1️⃣', name: 'いち' }, { emoji: '2️⃣', name: 'に' },
  { emoji: '3️⃣', name: 'さん' }, { emoji: '4️⃣', name: 'よん' }, { emoji: '5️⃣', name: 'ご' },
  { emoji: '6️⃣', name: 'ろく' }, { emoji: '7️⃣', name: 'なな' }, { emoji: '8️⃣', name: 'はち' },
  { emoji: '9️⃣', name: 'きゅう' }, { emoji: '🔟', name: 'じゅう' },

  // 追加ピックアップ
  { emoji: '👻', name: 'おばけ' }, { emoji: '💩', name: 'うんち' }, { emoji: '🤖', name: 'ろぼっと' },
  { emoji: '☂️', name: 'かさ' }, { emoji: '🦋', name: 'ちょうちょ' }, { emoji: '🐞', name: 'てんとうむし' },
  { emoji: '🐢', name: 'かめ' }, { emoji: '🐙', name: 'たこ' }, { emoji: '🐟', name: 'さかな' },
  { emoji: '🐬', name: 'いるか' }, { emoji: '☀️', name: 'たいよう' }, { emoji: '🌙', name: 'つき' },
  { emoji: '🌈', name: 'にじ' }, { emoji: '⛄️', name: 'ゆきだるま' }, { emoji: '🍰', name: 'けーき' }
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

  if ('speechSynthesis' in window) {
    speechSynthesis.cancel(); 
    const ut = new SpeechSynthesisUtterance(currentItem.name);
    ut.lang = 'ja-JP';
    ut.rate = 1.1; 
    ut.volume = 1.0; 
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