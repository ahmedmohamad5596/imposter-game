const screen = document.getElementById("screen");
let selectedAvatarType = "boy";

// بيانات اللعبة
const gameData = {
  category: null,
  players: [],
  impostersCount: 0,
  currentWord: null,
  imposters: [],
  currentPlayerIndex: 0,
  questions: [],
  currentQuestionIndex: 0,
votes: {},           // { voterIndex: [votedIndexes] }
currentVoter: 0

  
};



// الأقسام
const words = {
  "🎬 أفلام": [
  // 2000 – 2005
  "صعيدي في الجامعة الأمريكية",
  "همام في أمستردام",
  "الناظر",
  "سلام يا صاحبى",
  "مافيا",
  "السلم والثعبان",
  "إسماعيلية رايح جاي",
  "شورت وفانلة وكاب",
  "زكي شان",
  "تيتو",

  // 2006 – 2010
  "عمارة يعقوبيان",
  "كده رضا",
  "حين ميسرة",
  "الجزيرة",
  "إبراهيم الأبيض",
  "ألف مبروك",
  "بدل فاقد",
  "احكي يا شهرزاد",
  "واحد صفر",
  "دكان شحاتة",

  // 2011 – 2015
  "إكس لارج",
  "الفيل الأزرق",
  "هيبتا",
  "الخلية",
  "ولاد رزق",
  "الحفلة",
  "المصلحة",
  "عبده موتة",
  "قلب الأسد",
  "بعد الموقعة",

  // 2016 – 2020
  "الفيل الأزرق 2",
  "تراب الماس",
  "الكنز",
  "البدلة",
  "كيرة والجن",
  "الديزل",
  "بنك الحظ",
  "حرب كرموز",
  "العارف",
  "صاحب المقام",

  // 2021 – 2025
  "كازابلانكا",
  "وقفة رجالة",
  "مش أنا",
  "من أجل زيكو",
  "العنكبوت",
  "بيت الروبي",
  "تاج",
  "شماريخ",
  "السرب",
  "أبو نسب"
],
  "👨‍🔧 مهن": [
    "دكتور", "مهندس", "مدرس", "محامي", "نجار",
    "حداد", "طيار", "صيدلي", "مبرمج", "محاسب"
  ],
  "🚗 سيارات": [
    "تويوتا", "مرسيدس", "بي إم دبليو", "فيراري", "لامبورجيني",
    "هيونداي", "كيا", "نيسان", "شيفروليه", "هوندا"
  ],
  "🍔 أكلات": [
    "بيتزا", "كشري", "برجر", "شاورما", "محشي",
    "مكرونة", "فراخ", "سمك", "كفتة", "كبسة"
  ],
  "🐶 حيوانات": [
    "كلب", "قط", "أسد", "نمر", "فيل",
    "قرد", "زرافة", "حصان", "ذئب", "دب"
  ],
  "🎲 متنوع": [
  "مفتاح",
  "مطر",
  "موبايل",
  "شنطة",
  "بحر",
  "نور",
  "ساعة",
  "طريق",
  "كرسي",
  "باب",

  "نظارة",
  "مصباح",
  "حديقة",
  "قطار",
  "سلم",
  "مرآة",
  "قلم",
  "دفتر",
  "سحابة",
  "شباك",

  "كاميرا",
  "مروحة",
  "كوب",
  "مطرقة",
  "وسادة",
  "خريطة",
  "شمعة",
  "جرس",
  "مظلة",
  "مفتاح USB",

  "ساعة حائط",
  "سماعة",
  "حقيبة سفر",
  "إشارة مرور",
  "مصعد",
  "درج",
  "مقعد",
  "حبل",
  "مرسى",
  "نفق",

  "بطاقة",
  "كتاب",
  "مكتب",
  "مياه",
  "هواء",
  "ظل",
  "ضوء",
  "طاولة"
]

};

// منع تكرار الكلمة
let lastWord = null;

function getRandomWord(category) {
  const list = words[category].filter(w => w !== lastWord);
  const word = list[Math.floor(Math.random() * list.length)];
  lastWord = word;
  return word;
}

// شاشة اختيار القسم
function showCategoryScreen() {
  screen.className = "fade-in";
    screen.innerHTML = `
  

    <h2>اختر القسم</h2>
    ${categories.map(cat => `
      <div class="card" onclick="selectCategory('${cat}')">
        ${cat}
      </div>
    `).join("")}
  `;
}

// عند اختيار القسم
function selectCategory(category) {
  gameData.category = category;
  showPlayersScreen();
}
function setAvatarType(type, btn) {
  selectedAvatarType = type;

  document.querySelectorAll(".type-btn").forEach(b =>
    b.classList.remove("active")
  );

  btn.classList.add("active");
}


/* =====================
   المرحلة الجاية (مؤقت)
===================== */
function showPlayersScreen() {
  screen.className = "fade-in";
    screen.innerHTML = `
  

    <h2>إدخال أسماء اللاعبين</h2>

    <input id="playerName" placeholder="اسم اللاعب" />

    <div class="avatar-types">
      <button onclick="setAvatarType('boy', this)" class="type-btn active">👦 ولد</button>
      <button onclick="setAvatarType('girl', this)" class="type-btn">👧 بنت</button>
      <button onclick="setAvatarType('ninja', this)" class="type-btn">🥷 نينجا</button>

    </div>

    <button onclick="addPlayer()">➕ إضافة لاعب</button>

    <div id="playersList" class="players-grid"></div>

    <button onclick="showImposterScreen()">التالي</button>
  `;

  renderPlayers();
}

function getRandomAvatar(type = "boy") {
  const id = Math.floor(Math.random() * 1000);

  const styles = {
    boy: "adventurer",
    girl: "avataaars",
    ninja: "pixel-art"
  };

  return `https://api.dicebear.com/7.x/${styles[type]}/svg?seed=anime${id}`;
}


function addPlayer() {
  const input = document.getElementById("playerName");
  const name = input.value.trim();

  if (name === "") return;

 gameData.players.push({
  name: name,
  avatar: getRandomAvatar(selectedAvatarType),
  avatarType: selectedAvatarType
  
});
savePlayers();
  input.value = "";
  renderPlayers();
}

function removePlayer(index) {
  gameData.players.splice(index, 1);
  savePlayers();
  renderPlayers();
}

function renderPlayers() {
  const list = document.getElementById("playersList");
  list.innerHTML = "";

  gameData.players.forEach((player, index) => {
    list.innerHTML += `
      <div class="card">
        <div class="player-info">
          <img src="${player.avatar}" class="avatar">
          <span>${player.name}</span>
        </div>
        <button onclick="removePlayer(${index})">❌</button>
      </div>
    `;
  });
}


/* =====================
   المرحلة الجاية (مؤقت)
===================== */
function showImposterScreen() {
  const maxImposters = Math.floor(gameData.players.length / 2);

  if (gameData.players.length < 3) {
    alert("لازم على الأقل 3 لاعبين");
    return;
  }

  gameData.impostersCount = 1;
screen.className = "fade-in";
  screen.innerHTML = `
    
    <h2>اختيار عدد الإمبوسترات</h2>

    <div class="card">
      <button onclick="changeImposters(-1)">➖</button>
      <span id="imposterCount">${gameData.impostersCount}</span>
      <button onclick="changeImposters(1)">➕</button>
    </div>

    <p>الحد الأقصى: ${maxImposters}</p>

    <button onclick="startGame()">ابدأ اللعبة 🎮</button>
  `;
}

function changeImposters(value) {
  const maxImposters = Math.floor(gameData.players.length / 2);
  gameData.impostersCount += value;

  if (gameData.impostersCount < 1) gameData.impostersCount = 1;
  if (gameData.impostersCount > maxImposters)
    gameData.impostersCount = maxImposters;

  document.getElementById("imposterCount").innerText =
    gameData.impostersCount;
}

function startGame() {
  // اختيار كلمة عشوائية
  const categoryWords = words[gameData.category];
  gameData.currentWord = getRandomWord(gameData.category);

  // اختيار إمبوسترات عشوائيين
  gameData.imposters = [];
  const indices = [...Array(gameData.players.length).keys()];

  while (gameData.imposters.length < gameData.impostersCount) {
    const rand = indices.splice(
      Math.floor(Math.random() * indices.length),
      1
    )[0];
    gameData.imposters.push(rand);
  }

  gameData.currentPlayerIndex = 0;
  showPlayerReveal();
}
function generateQuestions() {
  gameData.questions = [];

  const totalPlayers = gameData.players.length;
  const maxQuestionsPerPlayer = 2;

  const askedCount = Array(totalPlayers).fill(0);

  for (let i = 0; i < totalPlayers; i++) {
    let availableTargets = [];

    for (let j = 0; j < totalPlayers; j++) {
      if (i !== j) availableTargets.push(j);
    }

    // خلط عشوائي
    availableTargets.sort(() => Math.random() - 0.5);

    let questionsAsked = 0;

    for (let target of availableTargets) {
      if (questionsAsked >= maxQuestionsPerPlayer) break;

      gameData.questions.push({
  from: i,
  to: target
});


      askedCount[target]++;
      questionsAsked++;
    }
  }

  // خلط نهائي للأسئلة
  gameData.questions.sort(() => Math.random() - 0.5);

  gameData.currentQuestionIndex = 0;
}



function showPlayerReveal() {
 const playerName =
  gameData.players[gameData.currentPlayerIndex].name;

screen.className = "fade-in";
  screen.innerHTML = `
  

    <h2>📱 الدور على</h2>
    <div class="card">${playerName}</div>
    <button onclick="revealRole()">عرض الدور</button>
  `;
}

function revealRole() {
  const index = gameData.currentPlayerIndex;
  const isImposter = gameData.imposters.includes(index);

  let extraInfo = "";

  if (isImposter && gameData.imposters.length > 1) {
    const otherImposters = gameData.imposters
      .filter(i => i !== index)
      .map(i => gameData.players[i].name);


    extraInfo = `
      <p>👀 الإمبوسترز معاك:</p>
      <div class="card">
        ${otherImposters.join(" ، ")}
      </div>
    `;
  }
screen.className = "fade-in";
  screen.innerHTML = `
    
    <h2>${isImposter ? "🚨 إمبوستر" : "✅ كلمتك"}</h2>

    <div class="card" style="font-size: 24px">
      ${isImposter ? "أنت إمبوستر 😈" : gameData.currentWord}
    </div>

    ${extraInfo}

    <button onclick="nextPlayer()">التالي</button>
  `;
}


function nextPlayer() {
  gameData.currentPlayerIndex++;

  if (gameData.currentPlayerIndex < gameData.players.length) {
    showPlayerReveal();
  } else {
  generateQuestions();
  showQuestionPhase(); // شاشة انتقال
}

}

function showQuestionPhase() {
    screen.className = "fade-in";
  screen.innerHTML = `
    
    <h2>🗣️ مرحلة الأسئلة</h2>

    <div class="card pulse">
      كل لاعب له <b>سؤالين فقط</b>
    </div>

    <p>🚫 ممنوع فتح الموبايل غير وقت دورك</p>

    <button onclick="showQuestion()">ابدأ ▶️</button>
  `;
}



function showQuestion() {
  const q = gameData.questions[gameData.currentQuestionIndex];

  if (!q) {
    startVoting();
    return;
  }

  const fromPlayer = gameData.players[q.from];
  const toPlayer   = gameData.players[q.to];
screen.className = "fade-in";
  screen.innerHTML = `
  

    <h2>🗣️ مرحلة الأسئلة</h2>

    <div class="card">
      <div class="player-info">
        <img src="${fromPlayer.avatar}" class="avatar">
        <b>${fromPlayer.name}</b>
      </div>

      <p>يسأل</p>

      <div class="player-info">
        <img src="${toPlayer.avatar}" class="avatar">
        <b>${toPlayer.name}</b>
      </div>
    </div>

    <button onclick="nextQuestion()">التالي ▶️</button>

    ${
      canShowEarlyVote()
        ? `<button class="vote-btn" onclick="startVoting()">
             🗳️ تصويت الآن
           </button>`
        : ""
    }
  `;
}
let selectedVotes = [];

function canShowEarlyVote() {
  return (
    gameData.currentQuestionIndex >=
    Math.floor(gameData.questions.length / 2)
  );
}


function nextQuestion() {
  gameData.currentQuestionIndex++;

  if (gameData.currentQuestionIndex < gameData.questions.length) {
    showQuestion();
  } else {
    startVoting();
  }
}


function startVoting() {
  gameData.votes = {};
  gameData.currentVoter = 0;
  showVoteTurn();
}

function toggleVote(card) {
  const index = Number(card.dataset.index);
  const maxVotes = gameData.impostersCount;

  if (selectedVotes.includes(index)) {
    selectedVotes = selectedVotes.filter(i => i !== index);
    card.classList.remove("selected");
  } else {
    if (selectedVotes.length >= maxVotes) return;
    selectedVotes.push(index);
    card.classList.add("selected");
  }
}







function showEliminationResult(eliminated) {
  const eliminatedNames =
  eliminated.map(i => gameData.players[i].name);


  const wasImposter = eliminated.some(i =>
    gameData.imposters.includes(i)
  );
screen.className = "fade-in";
  screen.innerHTML = `
  

    <h2>❌ خرج من اللعبة</h2>

    <div class="card">
      ${eliminatedNames.join(" ، ")}
    </div>

    <p>
      ${wasImposter ? "🔥 كان إمبوستر!" : "❌ لم يكن إمبوستر"}
    </p>

    <button onclick="nextRound(${JSON.stringify(eliminated)})">
      الجولة التالية 🔁
    </button>
  `;
}
function nextRound(eliminated) {
  // حذف اللاعبين
  eliminated.sort((a, b) => b - a);
  eliminated.forEach(i => gameData.players.splice(i, 1));

  // تحديث الإمبوسترات
  gameData.imposters = gameData.imposters
    .filter(i => !eliminated.includes(i))
    .map(i => i - eliminated.filter(e => e < i).length);

  // شروط النهاية
  if (gameData.imposters.length === 0) {
    screen.className = "fade-in";
    screen.innerHTML = `
    

      <h2>🎉 فوز اللاعبين</h2>
      <p>تم كشف كل الإمبوسترات</p>
    `;
    return;
  }

  if (gameData.imposters.length >= gameData.players.length) {
    screen.className = "fade-in";
    screen.innerHTML = `
    

      <h2>😈 فوز الإمبوسترات</h2>
      <p>سيطروا على اللعبة</p>
    `;
    return;
  }

  // جولة جديدة
  gameData.impostersCount = gameData.imposters.length;
  startGame();
}
function savePlayers() {
  localStorage.setItem(
    "imposterPlayers",
    JSON.stringify(gameData.players)
  );
}
function loadPlayers() {
  const saved = localStorage.getItem("imposterPlayers");
  if (saved) {
    gameData.players = JSON.parse(saved);
  }
}
function showVoteTurn() {
  const voter = gameData.players[gameData.currentVoter];
screen.className = "fade-in";
  screen.innerHTML = `
  

    <h2>🗳️ دور التصويت</h2>
    <div class="card">
      الدور على: <b>${voter.name}</b>
    </div>

    <p>اختار اللاعبين</p>
    <div id="voteList"></div>

    <button onclick="confirmVote()">تأكيد التصويت</button>
  `;

  renderVoteOptions();
}


function renderVoteOptions() {
  const list = document.getElementById("voteList");
  list.innerHTML = "";
  selectedVotes = [];

  gameData.players.forEach((player, index) => {
    if (index === gameData.currentVoter) return;

    list.innerHTML += `
      <div class="card vote-card"
           data-index="${index}"
           onclick="toggleVote(this)">
        <img src="${player.avatar}" class="avatar">
        <span>${player.name}</span>
      </div>
    `;
  });
}

function confirmVote() {
  const requiredVotes = gameData.impostersCount;

  if (selectedVotes.length !== requiredVotes) {
    alert(`لازم تختار ${requiredVotes} لاعب${requiredVotes > 1 ? "ين" : ""}`);
    return;
  }

  gameData.votes[gameData.currentVoter] = [...selectedVotes];
  gameData.currentVoter++;

  if (gameData.currentVoter < gameData.players.length) {
    showVoteTurn();
  } else {
    showVoteResult();
  }
}

function showVoteResult() {
  const voteCount = {};

  Object.values(gameData.votes).forEach(votedList => {
    votedList.forEach(i => {
      voteCount[i] = (voteCount[i] || 0) + 1;
    });
  });

  const entries = Object.entries(voteCount);
  const maxVotes = Math.max(...entries.map(e => e[1]));

  const topPlayers = entries
    .filter(e => e[1] === maxVotes)
    .map(e => Number(e[0]));

  // ⚖️ حالة التعادل
  if (topPlayers.length > 1) {
    screen.className = "fade-in";
    screen.innerHTML = `
    

      <h2>⚖️ تعادل في التصويت</h2>

      <div class="card">
        لا يوجد لاعب خرج من الجولة
      </div>

      <p>سيتم بدء جولة جديدة</p>

      <button onclick="showCountdownBeforeReveal()">كشف الإمبوسترات 👀</button>


    `;
    return;
  }

  // ❌ لاعب واحد فقط خرج
  const eliminated = topPlayers[0];
  gameData.lastEliminated = eliminated;

  const wasImposter = gameData.imposters.includes(eliminated);
screen.className = "fade-in";
  screen.innerHTML = `
  

    <h2>📢 نتيجة التصويت</h2>

    <div class="card">
      ❌ خرج: <b>${gameData.players[eliminated].name}</b>
    </div>

    <p>
      ${wasImposter ? "🔥 كان إمبوستر" : "❌ لم يكن إمبوستر"}
    </p>

    <button onclick="showCountdownBeforeReveal()">كشف الإمبوسترات 👀</button>


  `;
}
function startNewRoundAfterTie() {
  regenerateImposters();
  startNextRound();
}


function prepareNextRound() {
  const eliminated = gameData.lastEliminated;

  // حذف اللاعب
  gameData.players.splice(eliminated, 1);

  regenerateImposters();

  // شروط النهاية

// ✅ فوز اللاعبين
if (gameData.imposters.length === 0) {
  screen.innerHTML = `
    screen.className = "fade-in";

    <h2>🎉 فوز اللاعبين</h2>
    <p>تم كشف كل الإمبوسترات</p>
  `;
  return;
}

// 🔴 فوز الإمبوسترز (الشرط الجديد الصحيح)
const normalPlayers =
  gameData.players.length - gameData.imposters.length;

if (gameData.imposters.length >= normalPlayers) {
  screen.innerHTML = `
    screen.className = "fade-in";

    <h2>😈 فوز الإمبوسترز</h2>
    <p>عددهم أصبح مسيطر على اللعبة</p>
  `;
  return;
}


  startNextRound();
}
function regenerateImposters() {
  gameData.imposters = [];
  const indices = [...Array(gameData.players.length).keys()];

  while (gameData.imposters.length < gameData.impostersCount) {
    const rand = indices.splice(
      Math.floor(Math.random() * indices.length),
      1
    )[0];
    gameData.imposters.push(rand);
  }
}


function showImposterRevealThenNextRound() {
  const impostersNames = gameData.imposters
    .map(i => gameData.players[i]?.name)
    .filter(Boolean)
    .join(" ، ");
screen.className = "fade-in";
  screen.innerHTML = `
  

    <h2>👀 كشف الإمبوسترات</h2>

    <div class="card" style="font-size:22px">
      ${impostersNames || "لا يوجد"}
    </div>

    <p>⚠️ انتبه! الجولة الجاية بكلمة جديدة</p>

    <button onclick="prepareNextRound()">ابدأ الجولة التالية ▶️</button>
  `;
}

function startNextRound() {
  // اختيار كلمة جديدة
  const categoryWords = words[gameData.category];
  gameData.currentWord = getRandomWord(gameData.category);


  // إعادة الضبط
  gameData.currentPlayerIndex = 0;
  gameData.questions = [];
  gameData.currentQuestionIndex = 0;
  gameData.votes = {};
  gameData.currentVoter = 0;

  showPlayerReveal();
}
function showCountdownBeforeReveal() {
  let time = 3;

  screen.innerHTML = `
    <h2>⏳ تجهيز الكشف</h2>
    <div class="timer-circle" id="timer">${time}</div>
  `;
  screen.className = "fade-in";

  playSound("tick");

  const interval = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = time;

    playSound("tick");

    if (time === 0) {
      clearInterval(interval);
      playSound("reveal");
      showImposterRevealThenNextRound();
    }
  }, 1000);
}
function showImposterRevealThenNextRound() {
  const impostersNames = gameData.imposters
    .map(i => gameData.players[i]?.name)
    .join(" ، ");

  screen.innerHTML = `
    <h2 class="shake">🚨 الإمبوسترات</h2>

    <div class="card dramatic">
      ${impostersNames}
    </div>

    <button onclick="prepareNextRound()">ابدأ الجولة التالية ▶️</button>
  `;
  screen.className = "fade-in";
}

function playSound(type) {
  const sounds = {
    tick: document.getElementById("tickSound"),
    reveal: document.getElementById("revealSound")
  };

  sounds[type].currentTime = 0;
  sounds[type].play();
}

function toggleTheme() {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  document.getElementById("themeToggle").innerText =
    isDark ? "☀️" : "🌙";
}

// عند التشغيل
(function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").innerText = "☀️";
  }
})();

const getName = i => gameData.players[i].name;

const categories = Object.keys(words);

// تشغيل اللعبة
loadPlayers();
showCategoryScreen();
