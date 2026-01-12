let screen;
let appStarted = false;
let screenHistory = [];
let selectedVotes = [];

// بيانات اللعبة
const gameData = {
  category: null,
  players: [],
  allPlayers: [],
  impostersCount: 0,
  eliminatedImposters: 0, // 👈 عداد الإمبوسترات اللي خرجوا
  eliminatedPlayers: 0,   // 👈 عداد اللاعبين اللي خرجوا
  currentWord: null,
  imposters: [],
  currentPlayerIndex: 0,
  questions: [],
  currentQuestionIndex: 0,
votes: {},           // { voterIndex: [votedIndexes] }
currentVoter: 0

  
};


document.addEventListener("DOMContentLoaded", () => {
  screen = document.getElementById("screen");
  loadPlayers();
  loadGameState();

  showLoadingScreen(() => {
    console.log("Loading finished");

    // تأمين القيم
    gameData.players = gameData.players || [];

    showIntroScreen(); 
  });
});


function showLoadingScreen(nextScreen) {
  const loadingTips = [
    "يتم تحضير الكلمات السرية...",
    "البحث عن الإمبوستر المختبئ...",
    "تجهيز بطاقات اللاعبين...",
    "شحذ ذكاء المواطنين..."
  ];
  
  let randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];

  renderScreen(`
    <div class="loading-container">
      <div class="loader-wrapper">
        <div class="main-loader">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="ghost-icon">🕵️‍♂️</div>
        </div>
      </div>
      
      <div class="loading-text-wrapper">
        <h2 class="loading-title">انتظر قليلاً</h2>
        <p id="loading-tip" class="loading-tip">${randomTip}</p>
      </div>

      <div class="modern-progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
  `, false);

  const fill = document.querySelector(".progress-fill");
  const tipElement = document.getElementById("loading-tip");
  let width = 0;

  // تغيير النص أثناء التحميل ليعطي إيحاء بالاحترافية
  const tipInterval = setInterval(() => {
    if (width < 100) {
      tipElement.style.opacity = 0;
      setTimeout(() => {
        tipElement.innerText = loadingTips[Math.floor(Math.random() * loadingTips.length)];
        tipElement.style.opacity = 1;
      }, 300);
    }
  }, 1500);

  // ... الكود السابق للدالة ...

  const interval = setInterval(() => {
    width += 2; // نزيد 2% في كل مرة
    if (fill) fill.style.width = width + "%";

    if (width >= 100) {
      clearInterval(interval);
      clearInterval(tipInterval); // إيقاف تغيير النص
      
      setTimeout(() => {
        if (typeof nextScreen === "function") nextScreen();
      }, 400); // تأخير بسيط جداً قبل الانتقال لإعطاء شعور بالاكتمال
    }
  }, 80); // 80ms * 50 خطوة = 4000ms (4 ثوانٍ)
}



const AVATARS_DB = [
  {
    id: "robot",
    name: "روبوت",
    emoji: "🤖",
    set: "set1"
  },
  {
    id: "monster",
    name: "وحش",
    emoji: "👹",
    set: "set2"
  },
  {
    id: "android",
    name: "أندرويد",
    emoji: "🦾",
    set: "set3"
  },
  {
    id: "cat",
    name: "قطة",
    emoji: "🐱",
    set: "set4"
  }
];




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
  "دكتور",
  "مهندس",
  "مدرس",
  "محامي",
  "نجار",
  "حداد",
  "طيار",
  "صيدلي",
  "مبرمج",
  "محاسب",
  "صحفي",
  "مصور",
  "ممثل",
  "مخرج",
  "طبيب أسنان",
  "ممرض",
  "كهربائي",
  "سباك",
  "سائق",
  "ضابط",
  "عسكري",
  "قاضي",
  "سكرتير",
  "مدير",
  "تاجر",
  "بائع",
  "شيف",
  "خباز",
  "جزار",
  "فلاح",
  "مهندس معماري",
  "مصمم جرافيك",
  "معلق رياضي",
  "مذيع",
  "مراقب جودة",
  "باحث",
  "محلل بيانات",
  "مطور ألعاب",
  "مترجم",
  "مخطط مدن"
]
,
  "🚗 سيارات": [
  "تويوتا",
  "مرسيدس",
  "بي إم دبليو",
  "فيراري",
  "لامبورجيني",
  "هيونداي",
  "كيا",
  "نيسان",
  "شيفروليه",
  "هوندا",
  "فورد",
  "أودي",
  "فولكس فاجن",
  "بورش",
  "مازدا",
  "ميتسوبيشي",
  "سوبارو",
  "جيب",
  "رينو",
  "بيجو",
  "سيتروين",
  "فيات",
  "سكودا",
  "سوزوكي",
  "تسلا",
  "جاكوار",
  "لاند روفر",
  "إنفينيتي",
  "لكزس",
  "كاديلاك",
  "بوجاتي",
  "ماكلارين",
  "ألفا روميو",
  "دودج",
  "رام",
  "كرايسلر",
  "سيات",
  "شانجان",
  "جيلي",
  "BYD"
]
,
  "🍔 أكلات": [
  "بيتزا",
  "كشري",
  "برجر",
  "شاورما",
  "محشي",
  "مكرونة",
  "فراخ",
  "سمك",
  "كفتة",
  "كبسة",
  "ملوخية",
  "فتة",
  "شوربة",
  "كباب",
  "طاجن",
  "أرز",
  "مندي",
  "كريب",
  "سجق",
  "لانشون",
  "بطاطس",
  "فلافل",
  "فول",
  "بيض",
  "باستا",
  "لازانيا",
  "ريش",
  "ستيك",
  "سوشي",
  "جمبري",
  "كاليماري",
  "رز بسمتي",
  "بيتزا سي فود",
  "حواوشي",
  "فطير",
  "عيش بلدي",
  "ساندوتش",
  "تشيز كيك",
  "كيك",
  "آيس كريم"
]
,
 "🐶 حيوانات": [
  "كلب",
  "قط",
  "أسد",
  "نمر",
  "فيل",
  "قرد",
  "زرافة",
  "حصان",
  "ذئب",
  "دب",
  "ثعلب",
  "غزال",
  "جمل",
  "حمار",
  "خروف",
  "ماعز",
  "بقرة",
  "ثور",
  "كنغر",
  "باندا",
  "نسر",
  "صقر",
  "غراب",
  "حمامة",
  "بومة",
  "تمساح",
  "سحلية",
  "ثعبان",
  "ضفدع",
  "سلحفاة",
  "دولفين",
  "حوت",
  "قرش",
  "سمكة",
  "حصان البحر",
  "فقمة",
  "بطريق",
  "نملة",
  "نحلة",
  "فراشة"
]
,
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



function renderScreen(html, saveHistory = true) {
  if (saveHistory && screen.innerHTML.trim() !== "") {
    screenHistory.push({
      html: screen.innerHTML,
      state: JSON.parse(JSON.stringify(gameData))
    });
  }

  setBackAction(screenHistory.length ? goBack : null);

  screen.className = "screen-slide";
  screen.innerHTML = html;
}



function setBackAction(handler = null) {
  const btn = document.querySelector(".back-btn");
  if (!btn) return;

  if (handler) {
    btn.style.visibility = "visible";
    btn.onclick = handler;
  } else {
    btn.style.visibility = "hidden";
    btn.onclick = null;
  }
}


function goBack() {
  if (screenHistory.length === 0) return;

  const previous = screenHistory.pop();

  Object.assign(gameData, previous.state);

  screen.className = "screen-slide";

  screen.innerHTML = previous.html;
}


// منع تكرار الكلمة
let lastWord = null;

function getRandomWord(category) {
  const list = words[category].filter(w => w !== lastWord);
  const word = list[Math.floor(Math.random() * list.length)];
  lastWord = word;
  return word;
}
const categories = Object.keys(words);


function showIntroScreen() {
  renderScreen(`
  <div class="center-screen intro-screen">
    <div class="card intro-card">
      <p class="intro-line">📌 <b>الكلمة السرية:</b> تم اختيار كلمة لكل اللاعبين.</p>
      <p class="intro-line">😈 <b>الإمبوستر:</b> لا يعرف الكلمة وعليه التخفي.</p>
      <p class="intro-line">🗣️ <b>الأسئلة:</b> اسألوا بعضكم بذكاء لكشف الخائن.</p>
      <p class="intro-line">🗳️ <b>التصويت:</b> اتفقوا على إخراج المشتبه به.</p>
    </div>

    <button class="primary-btn intro-btn pulse" onclick="showCategoryScreen()">
      ▶ ابدأ اللعبة الآن
    </button>
  </div>
`, false);
}



// شاشة اختيار القسم
function showCategoryScreen() {
  // مصفوفة الأقسام موجودة لديك بالفعل في متغير categories
  renderScreen(`
    <div class="center-screen">
      <h2 style="text-align: center; margin-bottom: 10px;">اختر القسم</h2>
      <p style="text-align: center; color: var(--muted); margin-bottom: 20px;">حدد موضوع الكلمات السرية</p>
      
      <div class="categories-grid">
        ${categories.map(cat => {
          // فصل الإيموجي عن النص إذا أردت تنسيقاً أفضل
          const icon = cat.split(' ')[0];
          const name = cat.split(' ').slice(1).join(' ');
          
          return `
            <div class="card category-card" onclick="selectCategory('${cat}')">
              <span class="cat-icon">${icon}</span>
              <span class="cat-name">${name}</span>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `, true);
}





// عند اختيار القسم
function selectCategory(category) {
  gameData.category = category;
  localStorage.setItem("gameState", JSON.stringify(gameData));
  showPlayersScreen();
}





/* =====================
   المرحلة الجاية (مؤقت)
===================== */
function showPlayersScreen() {
  renderScreen(`
    <div class="screen-slide">
      <h2 style="text-align: center;">إدخال أسماء اللاعبين 👥</h2>
      
      <input id="playerName" class="input-box" placeholder="اكتب اسم اللاعب هنا..." 
             onkeypress="if(event.key==='Enter') addPlayer()">

      <button class="primary-btn wide-btn" onclick="addPlayer()">➕ إضافة لاعب</button>

      <div id="playersList" class="players-grid">
        </div>

      <button class="primary-btn wide-btn" onclick="showImposterScreen()" 
              style="background: #27ae60; margin-top: 10px;">التالي ➡️</button>
    </div>
  `, true);

  renderPlayers(); // تحديث القائمة فوراً
}

// دالة إضافة اللاعب المحسنة
function addPlayer() {
  const input = document.getElementById("playerName");
  const name = input.value.trim();
  
  if (name === "") return;
  
  // إضافة اللاعب للمصفوفة
  gameData.allPlayers.push({ name: name, isOut: false });
  input.value = ""; // مسح الخانة
  input.focus();
  
  renderPlayers(); // إعادة رسم القائمة
}

// دالة عرض قائمة اللاعبين المحسنة
function renderPlayers() {
  const list = document.getElementById("playersList");
  if (!list) return;

  list.innerHTML = gameData.allPlayers.map((player, index) => `
    <div class="player-row">
      <span>👤 ${player.name}</span>
      <button class="danger-btn" onclick="removePlayer(${index})" 
              style="padding: 5px 10px; font-size: 12px; border-radius: 8px;">حذف</button>
    </div>
  `).join("");
}




function addPlayer() {
  const input = document.getElementById("playerName");
  const name = input.value.trim();
  if (!name) return;

  gameData.pendingPlayerName = name;
  input.value = "";

  showAvatarSelection();
}



function showAvatarSelection() {
  const name = gameData.pendingPlayerName;

  renderScreen(`
  <div class="center-screen avatar-selection-screen">
    <h2 class="fade-in">اختر شخصية لـ <span style="color:var(--accent)">${name}</span></h2>
    
    <div class="avatar-grid">
      ${AVATARS_DB.map(a => {
        // إنشاء رابط المعاينة فوراً لكل أفاتار
        const previewUrl = getAvatar(a.set, `${name}_${a.id}`);
        return `
          <div class="avatar-item" onclick="selectAvatarVisual('${a.id}', this)">
            <img src="${previewUrl}" alt="${a.name}">
            <span>${a.emoji} ${a.name}</span>
          </div>
        `;
      }).join("")}
    </div>

    <input type="hidden" id="selectedAvatarId" value="">

    <button class="primary-btn wide-btn confirm-btn" onclick="confirmAvatarVisual()">
      ✅ تأكيد الشخصية
    </button>
  </div>
`, false);
}

// دالة لاختيار الأفاتار بصرياً
function selectAvatarVisual(avatarId, element) {
  // إزالة التحديد من الجميع
  document.querySelectorAll('.avatar-item').forEach(el => el.classList.remove('selected'));
  // إضافة تحديد للعنصر المختار
  element.classList.add('selected');
  // تخزين القيمة في الحقل المخفي
  document.getElementById('selectedAvatarId').value = avatarId;
}

// دالة التأكيد الجديدة
function confirmAvatarVisual() {
  const avatarId = document.getElementById('selectedAvatarId').value;
  if (!avatarId) {
    alert("من فضلك اختر شخصية أولاً!");
    return;
  }
  
  // محاكاة اختيار القيمة في الكود القديم لتجنب كسر الوظائف الأخرى
  const avatar = AVATARS_DB.find(a => a.id === avatarId);
  const name = gameData.pendingPlayerName;
  const seed = `${name}_${avatar.id}`;

  const playerObj = {
    name,
    avatarId: avatar.id,
    avatarSeed: seed,
    avatar: getAvatar(avatar.set, seed),
    imposterCount: 0,
    isOut: false 
  };

  gameData.players.push({ ...playerObj });
  gameData.allPlayers.push({ ...playerObj });
  delete gameData.pendingPlayerName;
  savePlayers();
  showPlayersScreen();
}



function previewAvatar() {
  const select = document.getElementById("avatarSelect");
  const preview = document.getElementById("avatarPreview");

  if (!select.value) {
    preview.style.display = "none";
    return;
  }

  const avatar = AVATARS_DB.find(a => a.id === select.value);
  if (!avatar) return;

  const seed = `${gameData.pendingPlayerName}_${avatar.id}`;
  preview.src = getAvatar(avatar.set, seed);
  preview.style.display = "block";
}



function getAvatar(set, seed) {
  return `https://robohash.org/${encodeURIComponent(seed)}?set=${set}&size=150x150`;
}









function confirmAvatar() {
  const select = document.getElementById("avatarSelect");
  if (!select.value) {
    alert("من فضلك اختر أفاتار");
    return;
  }

  const avatar = AVATARS_DB.find(a => a.id === select.value);
  if (!avatar) {
    alert("أفاتار غير صالح");
    return;
  }

  const name = gameData.pendingPlayerName;
  const seed = `${name}_${avatar.id}`;

  const playerObj = {
  name,
  avatarId: avatar.id,
  avatarSeed: seed,
  avatar: getAvatar(avatar.set, seed),
  imposterCount: 0,
  isOut: false   // 👈 مهم جدًا
};



  // 👇 الإضافة الصح
  gameData.players.push({ ...playerObj });
  gameData.allPlayers.push({ ...playerObj });

  delete gameData.pendingPlayerName;
  savePlayers();
  showPlayersScreen();
}



let activeEditor = null;

function openNameEditor(e, index) {
  e.stopPropagation();

  // اقفل أي محرر مفتوح
  if (activeEditor) activeEditor.remove();

  const span = e.target;
  const rect = span.getBoundingClientRect();

  const editor = document.createElement("div");
  editor.className = "name-editor";
  editor.innerHTML = `
    <input type="text" value="${gameData.players[index].name}" />
    <div class="actions">
      <button onclick="confirmNameEdit(${index}, this)">✔</button>
      <button onclick="closeNameEditor()">✖</button>
    </div>
  `;

  document.body.appendChild(editor);

  editor.style.top = `${rect.top - 50 + window.scrollY}px`;
  editor.style.left = `${rect.left + window.scrollX}px`;

  editor.querySelector("input").focus();
  activeEditor = editor;
}

function confirmNameEdit(index, btn) {
  const input = btn.closest(".name-editor").querySelector("input");
  const newName = input.value.trim();

  if (!newName) return;

  gameData.players[index].name = newName;
  savePlayers();
  renderPlayers();
  closeNameEditor();
}

function closeNameEditor() {
  if (activeEditor) {
    activeEditor.remove();
    activeEditor = null;
  }
}




function removePlayer(index) {
  // الحذف الفعلي من المصفوفة لكي يختفي من القائمة تماماً
  gameData.players.splice(index, 1);
  gameData.allPlayers.splice(index, 1);
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
          <span class="editable-name"
      onclick="openNameEditor(event, ${index})">

      ${player.name}
      </span>

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
  const maxImposters = Math.floor(gameData.allPlayers.length / 1.5);

  if (gameData.allPlayers.length < 3) {
    alert("عفواً، يجب إضافة 3 لاعبين على الأقل للبدء");
    return;
  }

  // القيمة الابتدائية
  gameData.impostersCount = gameData.impostersCount || 1;

  renderScreen(`
    <div class="screen-slide" style="text-align: center;">
      <h2>تحديد عدد الخونة 😈</h2>
      <p style="color: var(--muted);">كم إمبوستر سيكون في اللعبة؟</p>

      <div class="imposter-card">
        <button class="step-btn" onclick="changeImposters(-1)">➖</button>
        <span id="imposterCount" class="count-display">${gameData.impostersCount}</span>
        <button class="step-btn" onclick="changeImposters(1)">➕</button>
      </div>

      <p style="font-size: 14px;">الحد الأقصى المسموح به: ${maxImposters}</p>

      <button class="primary-btn wide-btn" onclick="startGame()" 
              style="font-size: 20px; margin-top: 30px;">ابدأ اللعبة 🎮</button>
    </div>
  `, true);
}

// دالة تغيير العدد مع الحماية
function changeImposters(val) {
  const maxImposters = Math.floor(gameData.allPlayers.length / 1.5);
  let current = gameData.impostersCount;
  let newVal = current + val;

  if (newVal >= 1 && newVal <= maxImposters) {
    gameData.impostersCount = newVal;
    document.getElementById("imposterCount").innerText = newVal;
  }
}



function showImpostersCountScreen() {
  renderScreen(`
    <div class="center-screen result-screen imposters-screen">

      <div class="result-header">
        <span class="result-emoji">🕵️‍♂️</span>
        <h2 class="result-title">اختيار عدد الإمبوسترات</h2>
        <p class="result-subtitle">
          اختر عدد الإمبوسترات المناسب لعدد اللاعبين
        </p>
      </div>

      <div class="imposters-options">
        ${generateImpostersButtons()}
      </div>

      <div class="result-card">
        العدد المختار:
        <b id="imposter-count-value">
          ${gameData.impostersCount ?? "—"}
        </b>
      </div>

      <button class="primary-btn confirm-btn"
        onclick="confirmImpostersCount()">
        تأكيد ✔️
      </button>

    </div>
  `);
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



function pickImpostersWeighted() {
  const candidates = gameData.players
  .map((p, index) => ({ p, index }))
  .filter(o => !o.p.isOut)
  .map(o => ({
    index: o.index,
    weight: Math.max(1, 8 - (o.p.imposterCount || 0))
  }));


  const picked = [];

  while (picked.length < gameData.impostersCount) {
    const totalWeight = candidates.reduce((s, c) => s + c.weight, 0);
    let rand = Math.random() * totalWeight;

    for (let i = 0; i < candidates.length; i++) {
      rand -= candidates[i].weight;
      if (rand <= 0) {
        picked.push(candidates[i].index);
        candidates.splice(i, 1); // منع التكرار في نفس الجولة
        break;
      }
    }
  }

  return picked;
}




function startGame() {
  // 1. اختيار كلمة عشوائية بناءً على القسم المختار
  if (!gameData.category) {
      alert("الرجاء اختيار القسم أولاً");
      return showCategoryScreen();
  }
  gameData.currentWord = getRandomWord(gameData.category);

  // 2. اختيار الإمبوسترات
  gameData.imposters = pickImpostersWeighted();

  // 3. تحديث عداد مرات الإمبوستر لكل لاعب (للعدالة في المرات القادمة)
  gameData.imposters.forEach(i => {
    if(gameData.players[i]) {
        gameData.players[i].imposterCount = (gameData.players[i].imposterCount || 0) + 1;
    }
  });

  // 4. تصفير مؤشر اللاعبين للبدء بكشف الأدوار
  gameData.currentPlayerIndex = 0;
  
  // 5. حفظ الحالة
  localStorage.setItem("gameState", JSON.stringify(gameData));

  // 6. 💡 الانتقال للشاشة التالية (هذا ما كان ينقصك)
  showPlayerReveal(); 
}



function showGameStartReady() {
  renderScreen(`
    <div class="center-screen result-screen">
       <div class="result-header">
        <span class="result-emoji">🏁</span>
        <h2 class="result-title">الكل عرف دوره؟</h2>
        <p>الآن ستبدأ مرحلة الأسئلة والنقاش.</p>
      </div>
      <button class="primary-btn wide-btn pulse" onclick="showQuestionPhase()">
        ابدأ النقاش 🗣️
      </button>
    </div>
  `, false);
}



function showCountdownBeforeReveal() {
  let count = 3;
  renderScreen(`
    <div class="center-screen">
      <h1 id="countdown" style="font-size: 80px; color: var(--accent);">${count}</h1>
      <p>سيتم كشف الخونة الآن...</p>
    </div>
  `, false);
  
  const timer = setInterval(() => {
    count--;
    if(count > 0) {
      document.getElementById("countdown").innerText = count;
    } else {
      clearInterval(timer);
      showImposterRevealThenNextRound();
    }
  }, 1000);
}


function generateQuestions() {
  gameData.questions = [];
  
  // تصفية اللاعبين الموجودين حالياً فقط
  const activePlayersIndices = gameData.players
    .map((p, i) => p.isOut ? null : i)
    .filter(i => i !== null);

  if (activePlayersIndices.length < 2) return;

  activePlayersIndices.forEach(voterIndex => {
    // اختيار شخص عشوائي ليسأل (غير نفسه)
    let targets = activePlayersIndices.filter(i => i !== voterIndex);
    
    // خلط الأهداف واختيار واحد أو اثنين
    targets.sort(() => Math.random() - 0.5);
    
    // إضافة سؤالين لكل لاعب مثلاً
    for (let i = 0; i < Math.min(2, targets.length); i++) {
      gameData.questions.push({
        from: voterIndex,
        to: targets[i]
      });
    }
  });

  // خلط ترتيب الأسئلة الكلي لكي لا يسأل الجميع بالترتيب
  gameData.questions.sort(() => Math.random() - 0.5);
}




function nextPlayer() {
  gameData.currentPlayerIndex++;

  if (gameData.currentPlayerIndex < gameData.players.length) {
    showPlayerReveal();
  } else {
    // إذا انتهى كل اللاعبين، ننتقل لشاشة "الأسئلة" أو "بدء النقاش"
    showGameStartReady(); 
  }
}


function showQuestionPhase() {
  renderScreen(`
    <div class="center-screen result-screen">
      <div class="result-header">
        <span class="result-emoji">🗣️</span>
        <h2 class="result-title">مرحلة الأسئلة</h2>
      </div>

      <div class="result-card">
        ⏱️ كل لاعب له <b>سؤالين فقط</b>
      </div>

      <div class="result-card">
        🚫 ممنوع فتح الموبايل إلا وقت دورك
      </div>

      <div class="hint-box">
        ❗ أي لاعب خرج من الجولة يتم تجاهله تلقائيًا
      </div>

      <button class="primary-btn wide-btn pulse" onclick="startQuestions()">
        ابدأ الجولة ▶
      </button>
    </div>
  `);
}

function showQuestion() {
  const q = gameData.questions[gameData.currentQuestionIndex];

  if (!q) {
    startVoting();
    return;
  }

  const fromPlayer = gameData.players[q.from];
  const toPlayer = gameData.players[q.to];

  renderScreen(`
    <div class="center-screen question-phase">
      <div class="phase-header">
        <span class="badge">سؤال رقم ${gameData.currentQuestionIndex + 1}</span>
        <h2>مرحلة النقاش 🗣️</h2>
      </div>

      <div class="question-card">
        <div class="player-box from">
          <img src="${fromPlayer.avatar}" class="avatar">
          <span>${fromPlayer.name}</span>
        </div>
        
        <div class="arrow-down">⬇️ يسأل ⬇️</div>
        
        <div class="player-box to">
          <img src="${toPlayer.avatar}" class="avatar">
          <span>${toPlayer.name}</span>
        </div>
      </div>

      <button class="primary-btn wide-btn" onclick="nextQuestion()">
        السؤال التالي ➡️
      </button>
    </div>
  `);
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
  if (!gameData.impostersCount || gameData.impostersCount < 1) {
    alert("خطأ: عدد الإمبوسترات غير صالح");
    return;
  }

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











function startNextRound() {
  startGame();
  showPlayerReveal();
}




function savePlayers() {
  localStorage.setItem("imposterPlayers", JSON.stringify(gameData.allPlayers));
  localStorage.setItem("gameState", JSON.stringify(gameData));
}




function loadPlayers() {
  const saved = localStorage.getItem("imposterPlayers");
  if (saved) {
    const data = JSON.parse(saved);
    gameData.players = data.map(p => ({ ...p }));
    gameData.allPlayers = data.map(p => ({ ...p }));
  }
}




function showVoteTurn() {
  while (
    gameData.currentVoter < gameData.players.length &&
    gameData.players[gameData.currentVoter].isOut
  ) {
    gameData.currentVoter++;
  }

  if (gameData.currentVoter >= gameData.players.length) {
    showVoteResult();
    return;
  }

  const voter = gameData.players[gameData.currentVoter];

  renderScreen(`
    <h2>🗳️ دور التصويت</h2>
    <div class="card">
      الدور على: <b>${voter.name}</b>
    </div>

    <p>اختار اللاعبين</p>
    <div id="voteList"></div>

    <button onclick="confirmVote()">تأكيد التصويت</button>
  `);

  renderVoteOptions();
}





function renderVoteOptions() {
  const list = document.getElementById("voteList");
  list.innerHTML = "";
  selectedVotes = [];

  gameData.players.forEach((player, index) => {
  if (player.isOut) return;
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
    alert(`لازم تختار ${requiredVotes} لاعب`);
    return;
  }

  gameData.votes[gameData.currentVoter] = [...selectedVotes];

  do {
    gameData.currentVoter++;
  } while (
    gameData.currentVoter < gameData.players.length &&
    gameData.players[gameData.currentVoter].isOut
  );

  localStorage.setItem("gameState", JSON.stringify(gameData));

  if (gameData.currentVoter < gameData.players.length) {
    showVoteTurn();      // 👈 المصوّت التالي
  } else {
    showVoteResult();   // 👈 نهاية التصويت
  }
}



function setImpostersCount(count, btn) {
  gameData.impostersCount = count;

  const valueEl = document.getElementById("imposter-count-value");
  if (valueEl) valueEl.innerText = count;

  document
    .querySelectorAll(".imposter-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}



function confirmImpostersCount() {
  const count = gameData.impostersCount;
  const alivePlayers = gameData.players.filter(p => !p.isOut).length;
const maxAllowed = alivePlayers - 1;


  if (!count || count < 1 || count > maxAllowed) {
    screen.classList.add("shake");
    setTimeout(() => screen.classList.remove("shake"), 400);
    return;
  }

  startGame();
  showPlayerReveal();
}


function startQuestions() {
  // 1. توليد الأسئلة أولاً لتعبئة المصفوفة
  generateQuestions(); 
  
  // 2. تصفير العداد للبدء من أول سؤال
  gameData.currentQuestionIndex = 0;
  
  // 3. عرض شاشة الأسئلة
  showQuestion();
}

function generateImpostersButtons() {
  const alivePlayers = gameData.players.filter(p => !p.isOut).length;
const maxAllowed = alivePlayers - 1;

  let html = "";

  for (let i = 1; i <= maxAllowed; i++) {
    html += `
      <button class="imposter-btn"
        onclick="setImpostersCount(${i}, this)">
        ${i}
      </button>
    `;
  }

  return html;
}





function startNewRoundAfterTie() {
  regenerateImposters();
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



/* =====================
   تعديل شاشات الكشف / النتائج
===================== */

function revealRole() {
  const currentPlayerIndex = gameData.currentPlayerIndex;
  const isImposter = gameData.imposters.includes(currentPlayerIndex);
  
  let content = "";
  
  if (isImposter) {
    // جلب أسماء كل الإمبوسترات ما عدا اللاعب الحالي
    const otherImposters = gameData.imposters
      .filter(index => index !== currentPlayerIndex)
      .map(index => gameData.players[index].name);

    let partnersText = "";
    if (otherImposters.length > 0) {
      partnersText = `
        <div class="partners-box">
          <p style="font-size: 14px; margin-bottom: 5px; color: #ff9f43;">شركاؤك في الفريق هم:</p>
          <div style="font-weight: bold; font-size: 18px;">${otherImposters.join(" و ")}</div>
        </div>
      `;
    } else {
      partnersText = `<p style="color: #ff9f43;">أنت الإمبوستر الوحيد في هذه الجولة.</p>`;
    }

    content = `
      <div class="imposter-alert">
        <div style="font-size: 50px; animation: pulse 1s infinite;">😈</div>
        <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">أنت الإمبوستر!</div>
        ${partnersText}
        <p style="font-size: 15px; color: #eee; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px;">
          تذكر: هدفكم هو التمويه حتى يتساوى عددكم مع عدد المواطنين.
        </p>
      </div>
    `;
  } else {
    content = `
      <p style="font-size: 18px; color: var(--muted);">كلمتك السرية هي:</p>
      <div class="word-card">
        ${gameData.currentWord}
      </div>
      <p style="color: var(--accent); font-weight: bold; margin-top: 15px;">تذكرها جيداً ولا تنطقها!</p>
    `;
  }

  renderScreen(`
    <div class="reveal-container screen-slide">
      <h3 style="margin-bottom: 20px;">كشف الدور 🎭</h3>
      
      <div class="card reveal-card">
        ${content}
      </div>

      <button class="primary-btn wide-btn" onclick="nextPlayer()" style="margin-top: 25px;">
        تم، فهمت ✅
      </button>
    </div>
  `, false);
}





function showVoteResult() {
  const voteCount = {};
  Object.values(gameData.votes).forEach(voted =>
    voted.forEach(i => voteCount[i] = (voteCount[i] || 0) + 1)
  );

  const entries = Object.entries(voteCount);
  if (entries.length === 0) return startNextRound();

  const maxVotes = Math.max(...entries.map(e => e[1]));
  const topPlayers = entries
    .filter(e => e[1] === maxVotes)
    .map(e => Number(e[0]));

  // حالة التعادل
  if (topPlayers.length > 1) {
    renderScreen(`
      <div class="center-screen result-screen">
        <h2>⚖️ تعادل في الأصوات</h2>
        <p>لم يخرج أحد. استعدوا للجولة القادمة!</p>
        <button class="primary-btn wide-btn" onclick="startNextRound()">استمرار اللعب</button>
      </div>
    `, false);
    return;
  }

  // إخراج اللاعب وتحديث حالته
  const eliminatedIndex = topPlayers[0];
  gameData.players[eliminatedIndex].isOut = true; 
  const wasImposter = gameData.imposters.includes(eliminatedIndex);

  renderScreen(`
    <div class="center-screen result-screen">
      <div class="result-header">
        <span class="result-emoji">${wasImposter ? '🔥' : '💀'}</span>
        <h2 class="result-title">نتيجة التصويت</h2>
      </div>
      <div class="result-card">
         خرج الآن: <b>${gameData.players[eliminatedIndex].name}</b><br>
         <span style="color: ${wasImposter ? '#27ae60' : '#e74c3c'}">
            ${wasImposter ? "(طلع إمبوستر فعلاً!)" : "(للأسف كان بريء)"}
         </span>
      </div>
      <button class="primary-btn wide-btn" onclick="proceedAfterVote()">متابعة</button>
    </div>
  `, false);
}

// دالة وسيطة لربط النتيجة بالتحقق
function proceedAfterVote() {
  if (!checkGameOver()) {
    startNextRound(); // يبدأ جولة جديدة بكلمات جديدة
  }
}




function showImposterRevealThenNextRound() {
  const names = gameData.imposters
    .map(i => gameData.players[i]?.name)
    .filter(Boolean)
    .join(" ، ");

  renderScreen(`
    <div class="center-screen result-screen">
      <div class="result-header">
        <span class="result-emoji">👀</span>
        <h2 class="result-title">كشف الإمبوسترات</h2>
      </div>

      <div class="result-card">
        ${names || "لا يوجد"}
      </div>

      <div class="result-card">
        ⚠️ الجولة الجاية بكلمة جديدة
      </div>

      <button class="primary-btn wide-btn"
        onclick="prepareNextRound()">
        ابدأ الجولة التالية ▶
      </button>
    </div>
  `, false);
}




/* =====================
   تعديل شاشات الفوز النهائية
===================== */

function renderPlayersWin() {
  renderScreen(`
    <div class="center-screen result-screen win-players">
      <div class="result-header">
        <span class="result-emoji" style="font-size: 80px;">🏆</span>
        <h1 class="result-title" style="color: #27ae60;">انتصر المواطنون!</h1>
        <p>لقد نجحتم في كشف الإمبوسترات وتطهير المدينة.</p>
      </div>

      <div class="result-card">
        <b>الكلمة كانت:</b> <span style="color: var(--accent);">${gameData.currentWord}</span>
      </div>

      <button class="primary-btn wide-btn pulse" onclick="resetGameFull()">
        لعبة جديدة 🔄
      </button>
    </div>
  `, false);
}

function renderImpostersWin() {
  const names = gameData.imposters
    .map(i => gameData.players[i].name)
    .join(" و ");

  renderScreen(`
    <div class="center-screen result-screen win-imposters">
      <div class="result-header">
        <span class="result-emoji" style="font-size: 80px;">😈</span>
        <h1 class="result-title" style="color: #e74c3c;">فاز الإمبوستر!</h1>
        <p>لقد نجح الخونة في خداع الجميع.</p>
      </div>

      <div class="result-card">
        <b>الخونة هم:</b> <br>
        <span style="font-size: 20px; color: #e74c3c;">${names}</span>
      </div>

      <button class="primary-btn wide-btn pulse" onclick="resetGameFull()" style="background: #e74c3c;">
        حاول مرة أخرى 🔄
      </button>
    </div>
  `, false);
}
function checkGameOver() {
  // 1. جلب اللاعبين الأحياء فقط
  const alivePlayers = gameData.players.filter(p => !p.isOut);
  
  // 2. جلب الإمبوسترات الأحياء فقط
  const aliveImposters = alivePlayers.filter((p) => {
    const originalIndex = gameData.players.indexOf(p);
    return gameData.imposters.includes(originalIndex);
  });

  const aliveCitizensCount = alivePlayers.length - aliveImposters.length;

  // فحص فوز المواطنين (إذا انتهى كل الإمبوسترز)
  if (aliveImposters.length === 0) {
    renderPlayersWin();
    return true;
  }

  // فحص فوز الإمبوستر (قانونك: التساوي أو التفوق)
  if (aliveImposters.length >= aliveCitizensCount) {
    renderImpostersWin();
    return true;
  }

  return false; // اللعبة مستمرة
}



function resetGameFull() {
  // تصفير بيانات الجولة مع الحفاظ على "كل اللاعبين"
  gameData.players = gameData.allPlayers.map(p => ({
    ...p,
    isOut: false
  }));
  gameData.imposters = [];
  gameData.votes = {};
  gameData.currentVoter = 0;
  gameData.currentQuestionIndex = 0;
  
  // العودة لشاشة اختيار القسم
  showCategoryScreen();
}


/* =====================
   تحسين شاشة الدور على
===================== */

function showPlayerReveal() {
  const player = gameData.players[gameData.currentPlayerIndex];
  
  // إذا كان اللاعب خارج اللعبة، ننتقل للتالي فوراً
  if (player.isOut) {
    nextPlayer();
    return;
  }

  renderScreen(`
    <div class="center-screen reveal-screen">
      <div class="player-intro-card">
        <img src="${player.avatar}" class="avatar large-avatar">
        <h2 class="player-name-title">دور اللاعب: ${player.name}</h2>
        <p class="warning-text">مرر الموبايل لـ ${player.name} ولا تنظر للشاشة!</p>
      </div>
      
      <button class="primary-btn wide-btn reveal-btn pulse" onclick="revealRole()">
        👁️ اكشف دوري
      </button>
    </div>
  `, false);
}






function showCountdownBeforeReveal() {
  let time = 3;

  renderScreen(`
    <div class="center-screen">
      <h2>⏳ تجهيز الكشف</h2>
      <div class="timer-circle">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="54"
            stroke="rgba(255,255,255,0.15)"
            stroke-width="8" fill="none" />
          <circle id="timerProgress"
            cx="60" cy="60" r="54"
            stroke="var(--accent)"
            stroke-width="8"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="339"
            stroke-dashoffset="0"/>
        </svg>
        <span id="timerText">${time}</span>
      </div>
    </div>
  `, false);

  setTimeout(showImposterRevealThenNextRound, 3000);

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
  const isDark = document.body.classList.toggle("dark");

  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute(
      "content",
      isDark ? "#0f0f13" : "#f4f6fb"
    );

  localStorage.setItem("theme", isDark ? "dark" : "light");

  const btn = document.querySelector(".theme-btn");
  if (btn) btn.innerText = isDark ? "☀️" : "🌙";
}



function loadGameState() {
  const saved = localStorage.getItem("gameState");
  if (saved) {
    Object.assign(gameData, JSON.parse(saved));
  }
}





// عند التشغيل
(function loadTheme() {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.body.classList.add("dark");
    const btn = document.querySelector(".theme-btn");
    if (btn) btn.innerText = "☀️";
  }
})();


const getName = i => gameData.players[i].name;



// تشغيل اللعبة
loadGameState();


function startNewGame() {
  // إعادة تكوين لاعبي الجولة من المسجلين
  gameData.players = gameData.allPlayers.map(p => ({
  ...p,
  isOut: false
}));

  // تصفير حالة الجيم
  gameData.category = null;
  gameData.currentWord = null;
  gameData.imposters = [];
  gameData.questions = [];
  gameData.votes = {};
  gameData.currentPlayerIndex = 0;
  gameData.currentQuestionIndex = 0;
  gameData.currentVoter = 0;
  gameData.eliminatedImposters = 0;
  gameData.eliminatedPlayers = 0;

  showCategoryScreen();
}




function exitGame() {
  localStorage.removeItem("gameState"); 
  location.reload();
}
// تأكد من حذف أي } زائدة هنا
