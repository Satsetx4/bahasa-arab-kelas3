// Logika Utama Aplikasi Pembelajaran & Bank Soal Bahasa Arab Kelas 3 SDIT
// SDIT Tahfidz Bintangku Kota Probolinggo

let appState = {
  currentTab: 'materi',
  selectedCategory: 'all',
  searchQuery: '',
  flashcardIndex: 0,
  flashcardFlipped: false,
  
  // Quiz State
  currentQuizIndex: 0,
  quizAnswers: {},
  quizSubmitted: false,
  quizFilterType: 'all',
  quizQuestions: [],
  quizScore: 0,

  // Assessment Exam State
  examQuestions: [],
  examAnswers: {},
  examStartTime: null,
  examSubmitted: false,
  examTimerInterval: null,
  examSecondsRemaining: 30 * 60, // 30 Menit

  // Kitabah Pad Instance
  pad: null
};

// ==========================================
// INISIALISASI APLIKASI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  initNavigation();
  initMateriTab();
  initCeritaTab();
  initKitabahTab();
  initKuisTab();
  initAsesmenTab();
  initCetakTab();
  initSpeechSynthesis();

  // Restore tab terakhir yang dibuka pengguna jika ada
  try {
    const savedTab = localStorage.getItem('arab3_current_tab');
    if (savedTab && document.getElementById(`tab-${savedTab}`)) {
      switchTab(savedTab, false);
    }
  } catch (e) {}

  // Load Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

function loadSavedState() {
  try {
    const savedQuizAnswers = localStorage.getItem('arab3_quiz_answers');
    if (savedQuizAnswers) {
      appState.quizAnswers = JSON.parse(savedQuizAnswers) || {};
    }

    const savedExam = localStorage.getItem('arab3_exam_state');
    if (savedExam) {
      const parsed = JSON.parse(savedExam);
      if (parsed && parsed.questions && parsed.questions.length > 0 && !parsed.submitted && parsed.secondsRemaining > 0) {
        appState.examQuestions = parsed.questions;
        appState.examAnswers = parsed.answers || {};
        appState.examSecondsRemaining = parsed.secondsRemaining;
        appState.hasActiveExamSession = true;
      }
    }
  } catch (e) {
    console.warn('Storage read error:', e);
  }
}

// ==========================================
// SISTEM NAVIGASI TAB
// ==========================================
function initNavigation() {
  const navButtons = document.querySelectorAll('[data-tab-target]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab-target');
      switchTab(targetTab);
    });
  });

  // Mobile menu toggle if any
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }
}

function switchTab(tabId, shouldScroll = true) {
  appState.currentTab = tabId;

  // Sembunyikan semua tab section
  document.querySelectorAll('.tab-section').forEach(sec => {
    sec.classList.add('hidden');
  });

  // Tampilkan tab yang dipilih
  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  // Update styling button aktif di header
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    const isCurrent = btn.getAttribute('data-tab-target') === tabId;
    if (isCurrent) {
      btn.classList.remove('text-slate-600', 'bg-white', 'hover:bg-slate-50');
      btn.classList.add('text-emerald-700', 'bg-emerald-50', 'border-emerald-600', 'shadow-sm', 'font-semibold');
    } else {
      btn.classList.remove('text-emerald-700', 'bg-emerald-50', 'border-emerald-600', 'shadow-sm', 'font-semibold');
      btn.classList.add('text-slate-600', 'bg-white', 'hover:bg-slate-50');
    }
  });

  // Update styling tombol aktif di Mobile Bottom Navigation Bar
  document.querySelectorAll('#mobile-bottom-nav button[data-mobile-tab]').forEach(btn => {
    const isCurrent = btn.getAttribute('data-mobile-tab') === tabId;
    if (isCurrent) {
      btn.classList.add('active-mobile-tab', 'text-emerald-700', 'font-bold');
      btn.classList.remove('text-slate-500');
    } else {
      btn.classList.remove('active-mobile-tab', 'text-emerald-700', 'font-bold');
      btn.classList.add('text-slate-500');
    }
  });

  // Simpan preferensi tab
  try {
    localStorage.setItem('arab3_current_tab', tabId);
  } catch (e) {}

  // Khusus tab kitabah: resize canvas agar pas dengan kontainer
  if (tabId === 'kitabah') {
    setTimeout(() => {
      if (!appState.pad) {
        appState.pad = new window.KitabahPad('kitabah-canvas');
      } else {
        appState.pad.initCanvasSize();
      }
    }, 150);
  }

  // Khusus tab kuis / asesmen
  if (tabId === 'kuis' && appState.quizQuestions.length === 0) {
    loadQuizQuestions(appState.quizFilterType || 'all');
  }

  // Scroll to top jika diminta
  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==========================================
// AUDIO & SPEECH SYNTHESIS (Pengucapan Arab)
// ==========================================
let arabicVoice = null;

function initSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Cari suara bahasa Arab (ar-SA, ar-EG, dll)
      arabicVoice = voices.find(v => v.lang.startsWith('ar')) || null;
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

function playArabicSpeech(text) {
  if (!('speechSynthesis' in window)) {
    alert('Peramban Anda belum mendukung fitur pemutar suara teks otomatis.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop suara yang sedang berbunyi

  const cleanText = text.replace(/[0-9.]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85; // Sedikit lebih lambat agar jelas untuk anak SD

  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  // Efek visual tombol yang sedang berbunyi
  window.speechSynthesis.speak(utterance);
}

// Sound effect feedback sederhana via Web Audio API
function playSoundEffect(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      // Dua nada naik ceria
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'wrong') {
      // Nada rendah
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Abaikan jika browser memblokir autoplay audio
  }
}

// ==========================================
// MODUL 1: MATERI & KOSAKATA INTERAKTIF
// ==========================================
function initMateriTab() {
  const container = document.getElementById('vocab-list-container');
  const searchInput = document.getElementById('vocab-search');
  const categoryFilters = document.querySelectorAll('[data-vocab-filter]');

  // Render awal
  renderVocabCards();

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase().trim();
      renderVocabCards();
    });
  }

  // Filter kategori
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      btn.classList.add('bg-emerald-600', 'text-white', 'shadow');

      appState.selectedCategory = btn.getAttribute('data-vocab-filter');
      renderVocabCards();
    });
  });

  // Tombol mode flashcard
  const switchFlashcardBtn = document.getElementById('btn-mode-flashcard');
  const switchGridBtn = document.getElementById('btn-mode-grid');
  const gridView = document.getElementById('vocab-grid-view');
  const flashcardView = document.getElementById('vocab-flashcard-view');

  if (switchFlashcardBtn && switchGridBtn) {
    switchFlashcardBtn.addEventListener('click', () => {
      switchFlashcardBtn.classList.add('bg-emerald-600', 'text-white');
      switchFlashcardBtn.classList.remove('bg-slate-100', 'text-slate-700');
      switchGridBtn.classList.remove('bg-emerald-600', 'text-white');
      switchGridBtn.classList.add('bg-slate-100', 'text-slate-700');

      gridView.classList.add('hidden');
      flashcardView.classList.remove('hidden');
      updateFlashcardDisplay();
    });

    switchGridBtn.addEventListener('click', () => {
      switchGridBtn.classList.add('bg-emerald-600', 'text-white');
      switchGridBtn.classList.remove('bg-slate-100', 'text-slate-700');
      switchFlashcardBtn.classList.remove('bg-emerald-600', 'text-white');
      switchFlashcardBtn.classList.add('bg-slate-100', 'text-slate-700');

      flashcardView.classList.add('hidden');
      gridView.classList.remove('hidden');
    });
  }

  // Flashcard controls
  setupFlashcardControls();
}

function getFilteredVocabularies() {
  return ARABIC_DATA.vocabularies.filter(v => {
    const matchCategory = appState.selectedCategory === 'all' || v.category === appState.selectedCategory;
    const matchSearch = !appState.searchQuery || 
      v.arabic.includes(appState.searchQuery) ||
      v.latin.toLowerCase().includes(appState.searchQuery) ||
      v.meaning.toLowerCase().includes(appState.searchQuery);
    return matchCategory && matchSearch;
  });
}

function renderVocabCards() {
  const container = document.getElementById('vocab-list-container');
  if (!container) return;

  const vocabs = getFilteredVocabularies();

  if (vocabs.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
        <div class="text-4xl mb-2">🔍</div>
        <p class="text-slate-600 font-medium">Kosakata tidak ditemukan.</p>
        <p class="text-sm text-slate-400">Coba ubah kata kunci pencarian atau filter kategori.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = vocabs.map((item, idx) => {
    const isAlatTulis = item.category === 'alat_tulis';
    const badgeColor = isAlatTulis 
      ? 'bg-amber-100 text-amber-800 border-amber-200' 
      : 'bg-emerald-100 text-emerald-800 border-emerald-200';
    const categoryName = isAlatTulis ? 'Alat Tulis' : 'Benda Kelas';

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 card-hover shadow-sm flex flex-col justify-between relative group">
        <!-- Top Badges & Number -->
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}">
            <span>${item.emoji}</span>
            <span>${categoryName}</span>
          </span>
          <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">#${idx + 1}</span>
        </div>

        <!-- Arabic Main Display -->
        <div class="text-center py-4 bg-gradient-to-b from-slate-50/70 to-emerald-50/30 rounded-xl mb-4 border border-slate-100 relative">
          <button 
            onclick="playArabicSpeech('${item.audio_text}')"
            title="Dengarkan Pelafalan"
            class="absolute top-2 right-2 p-2 rounded-lg bg-white/80 hover:bg-emerald-600 hover:text-white text-emerald-600 border border-slate-200 shadow-sm transition-all">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>
          <div class="font-arabic text-4xl text-slate-800 font-bold leading-relaxed mb-1" dir="rtl">
            ${item.arabic}
          </div>
          <div class="text-xs font-bold text-emerald-700 tracking-wider uppercase">
            ${item.latin}
          </div>
        </div>

        <!-- Meaning & Context -->
        <div class="space-y-2">
          <div class="flex items-baseline justify-between border-b border-slate-100 pb-2">
            <span class="text-xs text-slate-400">Artinya:</span>
            <span class="text-sm font-bold text-slate-800 text-right">${item.meaning}</span>
          </div>

          <!-- Letters breakdown (Maharatul Kitabah teaser) -->
          <div class="pt-1">
            <div class="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
              <span>Huruf Terpisah:</span>
              <span class="text-slate-500 font-mono">${item.letters.length} huruf</span>
            </div>
            <div class="flex flex-wrap gap-1 justify-end font-arabic text-sm text-slate-700 bg-slate-50 p-1.5 rounded-lg" dir="rtl">
              ${item.letters.map(l => `<span class="px-2 py-0.5 bg-white rounded border border-slate-200 shadow-xs font-bold">${l}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Bottom Action -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button 
            onclick="openWordInTracingPad('${item.arabic}')"
            class="text-emerald-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            <span>Latihan Tulis</span>
          </button>
          <button 
            onclick="playArabicSpeech('${item.arabic}')"
            class="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1">
            <i data-lucide="volume-1" class="w-3.5 h-3.5"></i>
            <span>Lafalkan</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Flashcard Interactive Functionality
function setupFlashcardControls() {
  const cardElement = document.getElementById('flashcard-element');
  const prevBtn = document.getElementById('fc-prev-btn');
  const nextBtn = document.getElementById('fc-next-btn');
  const flipBtn = document.getElementById('fc-flip-btn');
  const soundBtn = document.getElementById('fc-sound-btn');

  if (cardElement) {
    cardElement.addEventListener('click', () => {
      toggleFlashcardFlip();
    });
  }

  if (flipBtn) {
    flipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFlashcardFlip();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const list = getFilteredVocabularies();
      if (appState.flashcardIndex > 0) {
        appState.flashcardIndex--;
        appState.flashcardFlipped = false;
        updateFlashcardDisplay();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const list = getFilteredVocabularies();
      if (appState.flashcardIndex < list.length - 1) {
        appState.flashcardIndex++;
        appState.flashcardFlipped = false;
        updateFlashcardDisplay();
      }
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const list = getFilteredVocabularies();
      const current = list[appState.flashcardIndex];
      if (current) playArabicSpeech(current.audio_text);
    });
  }
}

function toggleFlashcardFlip() {
  appState.flashcardFlipped = !appState.flashcardFlipped;
  const innerCard = document.getElementById('flashcard-inner');
  if (innerCard) {
    if (appState.flashcardFlipped) {
      innerCard.classList.add('flipped');
    } else {
      innerCard.classList.remove('flipped');
    }
  }
}

function updateFlashcardDisplay() {
  const list = getFilteredVocabularies();
  if (list.length === 0) return;

  if (appState.flashcardIndex >= list.length) {
    appState.flashcardIndex = 0;
  }

  const item = list[appState.flashcardIndex];
  const innerCard = document.getElementById('flashcard-inner');
  if (innerCard) innerCard.classList.remove('flipped');
  appState.flashcardFlipped = false;

  // Front Elements
  document.getElementById('fc-front-arabic').textContent = item.arabic;
  document.getElementById('fc-front-latin').textContent = item.latin;
  document.getElementById('fc-front-emoji').textContent = item.emoji;
  document.getElementById('fc-front-category').textContent = item.category === 'alat_tulis' ? 'Alat Tulis' : 'Benda Kelas';

  // Back Elements
  document.getElementById('fc-back-meaning').textContent = item.meaning;
  document.getElementById('fc-back-arabic').textContent = item.arabic;
  document.getElementById('fc-back-example').textContent = item.example || '';
  document.getElementById('fc-back-trans').textContent = item.example_trans || '';
  
  // Counter & Progress
  document.getElementById('fc-counter').textContent = `${appState.flashcardIndex + 1} / ${list.length}`;
  const progressBar = document.getElementById('fc-progress-bar');
  if (progressBar) {
    const pct = ((appState.flashcardIndex + 1) / list.length) * 100;
    progressBar.style.width = `${pct}%`;
  }
}

// Buka kata langsung di papan tulis tracing
function openWordInTracingPad(word) {
  switchTab('kitabah');
  setTimeout(() => {
    if (appState.pad) {
      appState.pad.renderTemplate(word);
      const sel = document.getElementById('tracing-word-select');
      if (sel) sel.value = word;
    }
  }, 200);
}

// ==========================================
// MODUL 2: TEKS BACAAN CERITA INTERAKTIF ("فِي فَصْلِيْ")
// ==========================================
function initCeritaTab() {
  const storyContainer = document.getElementById('story-interactive-container');
  if (!storyContainer) return;

  const mainStory = ARABIC_DATA.reading_materials[0];

  let html = `
    <!-- Header Materi Cerita -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden mb-8">
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
          <span>Bahan Bacaan Asesmen Tengah Semester</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="font-arabic text-4xl sm:text-5xl font-bold mb-2 tracking-wide" dir="rtl">${mainStory.title_ar}</h2>
            <p class="text-emerald-100 text-lg font-medium">Judul: ${mainStory.title_id} (${mainStory.subtitle})</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              onclick="playFullStoryAudio()"
              class="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2">
              <i data-lucide="volume-2" class="w-4 h-4"></i>
              <span>Dengarkan Seluruh Teks</span>
            </button>
          </div>
        </div>
      </div>
      <!-- Decorative circle -->
      <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
    </div>

    <!-- Petunjuk Interaktif -->
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 text-amber-900 text-sm">
      <span class="text-xl">💡</span>
      <div>
        <strong class="font-semibold">Petunjuk Belajar Siswa SDIT:</strong>
        <p class="mt-0.5 text-xs text-amber-800">
          Klik pada setiap <strong>kata bahasa Arab</strong> untuk melihat arti dan fungsinya. Perhatikan benda-benda yang ada di dalam kelas serta alat tulis di dalam tas untuk persiapan asesmen tertulis!
        </p>
      </div>
    </div>

    <!-- Kalimat-Kalimat Cerita Interaktif -->
    <div class="space-y-6">
  `;

  mainStory.paragraphs.forEach((p, idx) => {
    // Generate word spans
    const wordSpans = p.words.map(w => {
      const isClassItem = w.type === 'benda_kelas';
      const isBagItem = w.type === 'alat_tulis';
      let typeBadge = '';
      if (isClassItem) typeBadge = 'border-b-2 border-emerald-500 font-bold text-emerald-900';
      else if (isBagItem) typeBadge = 'border-b-2 border-amber-500 font-bold text-amber-900';

      return `
        <span 
          class="story-word ${typeBadge}" 
          onclick="showWordDetail('${w.ar}', '${w.id}', '${w.type || ''}')"
          title="${w.id}">
          ${w.ar}
        </span>
      `;
    }).join(' ');

    html += `
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative hover:border-emerald-300 transition-all">
        <!-- Kalimat Number & Quick Audio -->
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              ${idx + 1}
            </span>
            <span class="text-xs font-semibold text-slate-500">Kalimat ke-${idx + 1}</span>
          </div>
          <button 
            onclick="playArabicSpeech('${p.sentence_ar}')"
            class="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors">
            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
            <span>Dengarkan Kalimat</span>
          </button>
        </div>

        <!-- Teks Arab Kalimat -->
        <div class="font-arabic text-3xl sm:text-4xl text-slate-800 leading-loose text-right mb-4 py-2" dir="rtl">
          ${wordSpans}
        </div>

        <!-- Transliterasi & Arti -->
        <div class="bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-100">
          <div class="text-xs text-emerald-800 font-medium tracking-wide">
            <strong>Cara Baca:</strong> ${p.transliteration}
          </div>
          <div class="text-sm text-slate-800 font-semibold">
            <strong>Artinya:</strong> "${p.meaning}"
          </div>
        </div>

        <!-- Benda yang Ditemukan pada Kalimat ini -->
        <div class="mt-4 pt-3 flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-400 font-medium">Benda dalam teks ini:</span>
          ${p.items_found.map(item => `
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
              ${item}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  });

  html += `
    </div>

    <!-- Teks Latihan Tambahan: Di Hari Kebersihan Kelas -->
    <div class="mt-12 pt-8 border-t-2 border-slate-200">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-lg text-slate-800">📖 Latihan Cerita Tambahan: فِي يَوْمِ النَّظَافَةِ</h3>
          <p class="text-xs text-slate-500">Membaca teks baru untuk melatih kepekaan menemukan kosakata sapu (مِكْنَسَةٌ), tempat sampah (مَزْبَلَةٌ), dan rak (رَفٌّ).</p>
        </div>
        <button 
          onclick="playArabicSpeech('الْفَصْلُ نَظِيفٌ جِدًّا. فِي الْفَصْلِ مِكْنَسَةٌ وَمَزْبَلَةٌ. عَلَى الرَّفِّ كُتُبٌ، وَالزُّجَاجُ صَافٍ.')"
          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          <span>Putar Suara</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div class="font-arabic text-2xl text-slate-800 text-right leading-loose" dir="rtl">
          الْفَصْلُ نَظِيفٌ جِدًّا. فِي الْفَصْلِ <span class="text-emerald-700 font-bold">مِكْنَسَةٌ</span> وَ<span class="text-emerald-700 font-bold">مَزْبَلَةٌ</span>. عَلَى <span class="text-emerald-700 font-bold">الرَّفِّ</span> كُتُبٌ، وَ<span class="text-emerald-700 font-bold">الزُّجَاجُ</span> صَافٍ.
        </div>
        <div class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
          <strong>Artinya:</strong> "Kelas sangat bersih. Di dalam kelas ada sapu dan tempat sampah. Di atas rak ada buku-buku, dan kaca jendela tampak bening."
        </div>
      </div>
    </div>
  `;

  storyContainer.innerHTML = html;
}

function showWordDetail(arabic, translation, type) {
  playArabicSpeech(arabic);

  const typeDesc = type === 'alat_tulis' 
    ? '✏️ Termasuk kategori: Alat Tulis & Peralatan Sekolah' 
    : (type === 'benda_kelas' ? '🏫 Termasuk kategori: Benda di Dalam Kelas' : 'Kata penghubung / keterangan');

  const popup = document.getElementById('word-detail-modal');
  if (popup) {
    document.getElementById('modal-word-arabic').textContent = arabic;
    document.getElementById('modal-word-trans').textContent = translation;
    document.getElementById('modal-word-type').textContent = typeDesc;
    popup.classList.remove('hidden');
    popup.classList.add('flex');
  }
}

function closeWordModal() {
  const popup = document.getElementById('word-detail-modal');
  if (popup) {
    popup.classList.add('hidden');
    popup.classList.remove('flex');
  }
}

function playFullStoryAudio() {
  const fullStory = "هٰذَا فَصْلِيْ. فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ. عَلَى الْجِدَارِ سَاعَةٌ وَمِصْبَاحٌ. فِيْ حَقِيْبَتِيْ دَفْتَرٌ وَقَلَمٌ وَقَلَمُ الرَّصَاصِ وَمِسْطَرَةٌ.";
  playArabicSpeech(fullStory);
}

// ==========================================
// MODUL 3: MAHARATUL KITABAH (PAPAN TULIS TRACING & PUZZLE SAMBUNG)
// ==========================================
function initKitabahTab() {
  const wordSelect = document.getElementById('tracing-word-select');
  const colorButtons = document.querySelectorAll('[data-draw-color]');
  const sizeButtons = document.querySelectorAll('[data-draw-size]');
  const clearBtn = document.getElementById('canvas-clear-btn');
  const undoBtn = document.getElementById('canvas-undo-btn');
  const eraserBtn = document.getElementById('canvas-eraser-btn');
  const toggleGuideBtn = document.getElementById('canvas-guide-btn');
  const downloadBtn = document.getElementById('canvas-download-btn');

  // Populate word selector with all 22 vocabularies
  if (wordSelect) {
    wordSelect.innerHTML = ARABIC_DATA.vocabularies.map(v => `
      <option value="${v.arabic}">${v.arabic} (${v.latin} - ${v.meaning})</option>
    `).join('');

    wordSelect.addEventListener('change', (e) => {
      if (appState.pad) {
        appState.pad.renderTemplate(e.target.value);
      }
    });
  }

  // Drawing colors
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('ring-4', 'ring-emerald-300'));
      btn.classList.add('ring-4', 'ring-emerald-300');
      const color = btn.getAttribute('data-draw-color');
      if (appState.pad) appState.pad.setColor(color);
    });
  });

  // Size buttons
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('bg-emerald-600', 'text-white'));
      btn.classList.add('bg-emerald-600', 'text-white');
      const size = parseInt(btn.getAttribute('data-draw-size'), 10);
      if (appState.pad) appState.pad.setSize(size);
    });
  });

  if (clearBtn) clearBtn.addEventListener('click', () => appState.pad && appState.pad.clearCanvas());
  if (undoBtn) undoBtn.addEventListener('click', () => appState.pad && appState.pad.undo());
  if (eraserBtn) {
    eraserBtn.addEventListener('click', () => {
      if (!appState.pad) return;
      const isNowEraser = !appState.pad.isEraser;
      appState.pad.setEraser(isNowEraser);
      if (isNowEraser) {
        eraserBtn.classList.add('bg-amber-600', 'text-white');
      } else {
        eraserBtn.classList.remove('bg-amber-600', 'text-white');
      }
    });
  }
  if (toggleGuideBtn) toggleGuideBtn.addEventListener('click', () => appState.pad && appState.pad.toggleGuideline());
  if (downloadBtn) downloadBtn.addEventListener('click', () => appState.pad && appState.pad.downloadDrawing());

  // Inisialisasi puzzle sambung huruf
  initSambungHurufInteractive();
}

// Interaktif Puzzle Sambung Huruf di Tab Kitabah
let currentPuzzleIndex = 0;
const sambungItems = ARABIC_DATA.question_bank.filter(q => q.type === 'sambung_huruf');

function initSambungHurufInteractive() {
  renderSambungPuzzle();

  const nextBtn = document.getElementById('puzzle-next-btn');
  const prevBtn = document.getElementById('puzzle-prev-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPuzzleIndex < sambungItems.length - 1) {
        currentPuzzleIndex++;
        renderSambungPuzzle();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPuzzleIndex > 0) {
        currentPuzzleIndex--;
        renderSambungPuzzle();
      }
    });
  }
}

function renderSambungPuzzle() {
  const container = document.getElementById('sambung-puzzle-content');
  if (!container || sambungItems.length === 0) return;

  const item = sambungItems[currentPuzzleIndex];
  const counter = document.getElementById('puzzle-counter');
  if (counter) counter.textContent = `Soal ${currentPuzzleIndex + 1} dari ${sambungItems.length}`;

  container.innerHTML = `
    <div class="text-center">
      <div class="text-xs text-slate-500 font-semibold mb-2">Huruf Hijaiyah Terpisah:</div>
      <div class="flex items-center justify-center gap-3 font-arabic text-3xl sm:text-4xl text-emerald-800 py-3 mb-4 bg-emerald-50 rounded-2xl border border-emerald-100" dir="rtl">
        ${item.letters.map(l => `<span class="px-3 py-1 bg-white rounded-xl shadow-xs border border-emerald-200">${l}</span>`).join('<span class="text-slate-400 text-lg">+</span>')}
      </div>
      <p class="text-sm font-medium text-slate-600 mb-6">Manakah bentuk tulisan bersambung yang tepat untuk kata di atas?</p>

      <!-- Pilihan Jawaban Puzzle -->
      <div class="grid grid-cols-2 gap-3 max-w-md mx-auto" id="puzzle-options">
        ${item.options.map((opt, idx) => `
          <button 
            onclick="checkSambungAnswer(${idx}, ${item.correct_answer}, '${item.target_word}')"
            class="puzzle-opt-btn p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 bg-white font-arabic text-2xl font-bold text-slate-800 transition-all text-center">
            ${opt}
          </button>
        `).join('')}
      </div>

      <div id="puzzle-feedback" class="mt-4 hidden p-4 rounded-xl text-sm font-medium"></div>
    </div>
  `;
}

function checkSambungAnswer(chosenIdx, correctIdx, targetWord) {
  const feedback = document.getElementById('puzzle-feedback');
  const buttons = document.querySelectorAll('.puzzle-opt-btn');

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === correctIdx) {
      btn.classList.add('bg-emerald-100', 'border-emerald-600', 'text-emerald-900');
    } else if (idx === chosenIdx) {
      btn.classList.add('bg-red-100', 'border-red-500', 'text-red-900');
    }
  });

  feedback.classList.remove('hidden');
  if (chosenIdx === correctIdx) {
    playSoundEffect('correct');
    feedback.className = 'mt-4 p-4 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-900 border border-emerald-300';
    feedback.innerHTML = `
      <div class="flex items-center justify-center gap-2 text-base">
        <span>🎉 Mumtaz! Benar sekali!</span>
      </div>
      <p class="mt-1 font-normal text-xs text-emerald-800">Bentuk sambung yang benar adalah <span class="font-arabic text-lg font-bold">${targetWord}</span>.</p>
    `;
  } else {
    playSoundEffect('wrong');
    feedback.className = 'mt-4 p-4 rounded-xl text-sm font-bold bg-red-50 text-red-900 border border-red-200';
    feedback.innerHTML = `
      <div>Kurang tepat. Coba perhatikan bentuk huruf yang bisa dan tidak bisa menyambung.</div>
      <div class="mt-1 text-xs font-normal">Jawaban yang benar adalah <span class="font-arabic text-lg font-bold">${targetWord}</span>.</div>
    `;
  }
}

// ==========================================
// MODUL 4: BANK SOAL & KUIS INTERAKTIF
// ==========================================
function initKuisTab() {
  const filterButtons = document.querySelectorAll('[data-quiz-filter]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      btn.classList.add('bg-emerald-600', 'text-white', 'shadow');

      const filterType = btn.getAttribute('data-quiz-filter');
      loadQuizQuestions(filterType);
    });
  });
}

function loadQuizQuestions(filterType = 'all') {
  appState.quizFilterType = filterType;
  appState.quizSubmitted = false;
  appState.quizScore = 0;

  try {
    localStorage.setItem('arab3_quiz_filter', filterType);
  } catch (e) {}

  if (filterType === 'all') {
    appState.quizQuestions = [...ARABIC_DATA.question_bank];
  } else {
    appState.quizQuestions = ARABIC_DATA.question_bank.filter(q => q.type === filterType);
  }

  renderQuizList();
  updateLiveScore();
}

function renderQuizList() {
  const container = document.getElementById('quiz-questions-list');
  const countDisplay = document.getElementById('quiz-total-count');
  if (!container) return;

  const questions = appState.quizQuestions;
  if (countDisplay) countDisplay.textContent = `${questions.length} Butir Soal`;

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
        <p class="text-slate-500">Tidak ada soal pada kategori ini.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = questions.map((q, idx) => {
    let typeBadge = '';
    if (q.type === 'teks_cerita') {
      typeBadge = '<span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">📖 Pemahaman Teks Cerita</span>';
    } else if (q.type === 'sambung_huruf') {
      typeBadge = '<span class="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">✍️ Maharatul Kitabah</span>';
    } else if (q.type === 'ikmal_huruf') {
      typeBadge = '<span class="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-200">🔤 Lengkapi Huruf</span>';
    } else {
      typeBadge = '<span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">🎯 Pilihan Ganda</span>';
    }

    const answered = appState.quizAnswers[q.id];
    const hasAnswered = answered !== undefined;

    return `
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm" id="quiz-item-${q.id}">
        <!-- Top Info -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
              ${idx + 1}
            </span>
            ${typeBadge}
          </div>
          <span class="text-xs text-slate-400 font-medium">${q.category}</span>
        </div>

        <!-- Story Snippet jika ada -->
        ${q.story_snippet ? `
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-right">
            <div class="text-xs text-slate-400 mb-1 text-left font-medium">Kutipan Teks Cerita:</div>
            <div class="font-arabic text-2xl text-emerald-900 leading-relaxed font-bold" dir="rtl">
              « ${q.story_snippet} »
            </div>
          </div>
        ` : ''}

        <!-- Pertanyaan -->
        <h4 class="text-base font-bold text-slate-800 mb-4">
          ${q.question}
        </h4>

        <!-- Pilihan Ganda -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          ${q.options.map((opt, optIdx) => {
            let optClasses = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-slate-200 font-medium text-slate-700 flex items-center gap-3 transition-all';
            let badgeClasses = 'w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0';

            if (hasAnswered) {
              if (answered === optIdx && optIdx === q.correct_answer) {
                optClasses = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-bold flex items-center gap-3';
                badgeClasses = 'w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
              } else if (answered === optIdx && optIdx !== q.correct_answer) {
                optClasses = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-red-500 bg-red-50 text-red-900 font-medium flex items-center gap-3';
                badgeClasses = 'w-6 h-6 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
              } else if (optIdx === q.correct_answer) {
                optClasses = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-bold flex items-center gap-3';
                badgeClasses = 'w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
              }
            } else {
              optClasses += ' hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer';
            }

            return `
              <button 
                id="opt-btn-${q.id}-${optIdx}"
                ${hasAnswered ? 'disabled' : ''}
                onclick="selectQuizAnswer('${q.id}', ${optIdx})"
                class="${optClasses}">
                <span class="${badgeClasses}">
                  ${['A', 'B', 'C', 'D'][optIdx]}
                </span>
                <span class="${opt.match(/[\u0600-\u06FF]/) ? 'font-arabic text-xl font-bold' : 'text-sm'}">${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Pembahasan -->
        <div id="explanation-${q.id}" class="${hasAnswered ? '' : 'hidden'} mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div class="font-bold text-slate-700 flex items-center gap-1.5">
            <i data-lucide="info" class="w-3.5 h-3.5 text-emerald-600"></i>
            <span>Kunci Jawaban & Pembahasan:</span>
          </div>
          <p class="text-slate-600">${q.explanation}</p>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function selectQuizAnswer(questionId, selectedOptIdx) {
  const q = appState.quizQuestions.find(item => item.id === questionId);
  if (!q) return;

  if (appState.quizAnswers[questionId] !== undefined) return;

  appState.quizAnswers[questionId] = selectedOptIdx;

  try {
    localStorage.setItem('arab3_quiz_answers', JSON.stringify(appState.quizAnswers));
  } catch (e) {}

  const isCorrect = selectedOptIdx === q.correct_answer;
  const chosenBtn = document.getElementById(`opt-btn-${questionId}-${selectedOptIdx}`);
  const correctBtn = document.getElementById(`opt-btn-${questionId}-${q.correct_answer}`);
  const expBox = document.getElementById(`explanation-${questionId}`);

  q.options.forEach((_, idx) => {
    const btn = document.getElementById(`opt-btn-${questionId}-${idx}`);
    if (btn) btn.disabled = true;
  });

  if (isCorrect) {
    playSoundEffect('correct');
    if (chosenBtn) {
      chosenBtn.className = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-bold flex items-center gap-3';
      const badge = chosenBtn.querySelector('span');
      if (badge) badge.className = 'w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
    }
  } else {
    playSoundEffect('wrong');
    if (chosenBtn) {
      chosenBtn.className = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-red-500 bg-red-50 text-red-900 font-medium flex items-center gap-3';
      const badge = chosenBtn.querySelector('span');
      if (badge) badge.className = 'w-6 h-6 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
    }
    if (correctBtn) {
      correctBtn.className = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-bold flex items-center gap-3';
      const badge = correctBtn.querySelector('span');
      if (badge) badge.className = 'w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
    }
  }

  if (expBox) {
    expBox.classList.remove('hidden');
  }

  updateLiveScore();
}

function updateLiveScore() {
  const totalAnswered = Object.keys(appState.quizAnswers).length;
  let correctCount = 0;

  const currentList = appState.quizQuestions.length > 0 ? appState.quizQuestions : ARABIC_DATA.question_bank;
  let currentListAnswered = 0;

  currentList.forEach(q => {
    if (appState.quizAnswers[q.id] !== undefined) {
      currentListAnswered++;
      if (appState.quizAnswers[q.id] === q.correct_answer) {
        correctCount++;
      }
    }
  });

  const liveScoreDisplay = document.getElementById('quiz-live-score');
  if (liveScoreDisplay) {
    liveScoreDisplay.textContent = `Benar: ${correctCount} / ${currentListAnswered}`;
  }

  if (currentListAnswered === currentList.length && currentListAnswered > 0) {
    const percentage = Math.round((correctCount / currentListAnswered) * 100);
    if (percentage >= 70 && window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
}

// ==========================================
// MODUL 5: SIMULASI ASESMEN TENGAH SEMESTER
// ==========================================
function initAsesmenTab() {
  const startBtn = document.getElementById('start-exam-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startExamSimulation();
    });
  }

  const submitBtn = document.getElementById('submit-exam-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      openExamConfirmModal();
    });
  }

  if (appState.hasActiveExamSession) {
    showResumeExamOption();
  }
}

function showResumeExamOption() {
  const introBox = document.getElementById('exam-intro-box');
  if (!introBox) return;

  const existingResume = document.getElementById('exam-resume-banner');
  if (existingResume) existingResume.remove();

  const mins = Math.floor(appState.examSecondsRemaining / 60);
  const secs = appState.examSecondsRemaining % 60;
  const answeredCount = Object.keys(appState.examAnswers).length;

  const banner = document.createElement('div');
  banner.id = 'exam-resume-banner';
  banner.className = 'p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl mb-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm';
  banner.innerHTML = `
    <div>
      <div class="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
        <span>⏱️ Sesi Ujian Berlangsung Tersimpan</span>
      </div>
      <p class="text-xs text-emerald-800 mt-0.5">
        Terjawab <strong>${answeredCount} dari 15 soal</strong> • Sisa waktu: <strong>${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</strong>
      </p>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="resumeExamSimulation()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all">
        Lanjutkan Ujian
      </button>
      <button onclick="discardAndRestartExam()" class="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition-all">
        Ulangi Baru
      </button>
    </div>
  `;

  introBox.insertBefore(banner, introBox.firstChild);
}

function resumeExamSimulation() {
  document.getElementById('exam-intro-box').classList.add('hidden');
  document.getElementById('exam-active-box').classList.remove('hidden');
  document.getElementById('exam-result-box').classList.add('hidden');

  renderExamQuestions();
  startExamTimer();

  const answeredCount = Object.keys(appState.examAnswers).length;
  const progressText = document.getElementById('exam-progress-text');
  if (progressText) {
    progressText.textContent = `Terjawab: ${answeredCount} / ${appState.examQuestions.length}`;
  }
}

function discardAndRestartExam() {
  try {
    localStorage.removeItem('arab3_exam_state');
  } catch (e) {}
  appState.hasActiveExamSession = false;
  appState.examQuestions = [];
  appState.examAnswers = {};
  const banner = document.getElementById('exam-resume-banner');
  if (banner) banner.remove();
  startExamSimulation();
}

function startExamSimulation() {
  const shuffled = [...ARABIC_DATA.question_bank].sort(() => 0.5 - Math.random());
  appState.examQuestions = shuffled.slice(0, 15);
  appState.examAnswers = {};
  appState.examSubmitted = false;
  appState.examSecondsRemaining = 30 * 60; // 30 Menit

  document.getElementById('exam-intro-box').classList.add('hidden');
  document.getElementById('exam-active-box').classList.remove('hidden');
  document.getElementById('exam-result-box').classList.add('hidden');

  renderExamQuestions();
  startExamTimer();
  saveExamStateToStorage();
}

function renderExamQuestions() {
  const container = document.getElementById('exam-questions-container');
  if (!container) return;

  container.innerHTML = appState.examQuestions.map((q, idx) => {
    const selectedAnswer = appState.examAnswers[q.id];

    return `
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            Soal No. ${idx + 1}
          </span>
          <span class="text-xs text-slate-400">${q.category}</span>
        </div>

        ${q.story_snippet ? `
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-right">
            <div class="font-arabic text-xl text-slate-800 font-bold" dir="rtl">« ${q.story_snippet} »</div>
          </div>
        ` : ''}

        <div class="text-sm font-bold text-slate-800 mb-4">${q.question}</div>

        <div class="space-y-2">
          ${q.options.map((opt, optIdx) => `
            <label class="flex items-center gap-3 p-3 rounded-xl border ${selectedAnswer === optIdx ? 'border-emerald-500 bg-emerald-50/50 font-bold' : 'border-slate-200'} hover:bg-slate-50 cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="exam-q-${q.id}" 
                value="${optIdx}" 
                ${selectedAnswer === optIdx ? 'checked' : ''}
                onchange="recordExamAnswer('${q.id}', ${optIdx})"
                class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300">
              <span class="${opt.match(/[\u0600-\u06FF]/) ? 'font-arabic text-xl font-bold' : 'text-sm font-medium text-slate-700'}">${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function recordExamAnswer(questionId, optionIdx) {
  appState.examAnswers[questionId] = optionIdx;
  saveExamStateToStorage();

  const answeredCount = Object.keys(appState.examAnswers).length;
  const progressText = document.getElementById('exam-progress-text');
  if (progressText) {
    progressText.textContent = `Terjawab: ${answeredCount} / ${appState.examQuestions.length}`;
  }
}

function saveExamStateToStorage() {
  try {
    localStorage.setItem('arab3_exam_state', JSON.stringify({
      questions: appState.examQuestions,
      answers: appState.examAnswers,
      secondsRemaining: appState.examSecondsRemaining,
      submitted: appState.examSubmitted
    }));
  } catch (e) {}
}

function startExamTimer() {
  if (appState.examTimerInterval) clearInterval(appState.examTimerInterval);

  const timerDisplay = document.getElementById('exam-timer-display');

  appState.examTimerInterval = setInterval(() => {
    if (appState.examSecondsRemaining <= 0) {
      clearInterval(appState.examTimerInterval);
      alert('Waktu ujian telah habis! Jawaban Anda akan otomatis dikumpulkan.');
      finishExamSimulation();
      return;
    }

    appState.examSecondsRemaining--;
    const mins = Math.floor(appState.examSecondsRemaining / 60);
    const secs = appState.examSecondsRemaining % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Simpan waktu ke storage setiap 10 detik
    if (appState.examSecondsRemaining % 10 === 0) {
      saveExamStateToStorage();
    }
  }, 1000);
}

// Modal Konfirmasi Ujian Kustom
function openExamConfirmModal() {
  const answeredCount = Object.keys(appState.examAnswers).length;
  const totalCount = appState.examQuestions.length || 15;
  const statusEl = document.getElementById('exam-confirm-status');
  const timeEl = document.getElementById('exam-confirm-time');
  const modal = document.getElementById('exam-confirm-modal');

  if (statusEl) {
    if (answeredCount === totalCount) {
      statusEl.innerHTML = `<span class="text-emerald-600 font-bold">Alhamdulillah! Semua ${totalCount} soal sudah terjawab.</span> Siap untuk dikumpulkan?`;
    } else {
      const remaining = totalCount - answeredCount;
      statusEl.innerHTML = `Kamu sudah menjawab <strong>${answeredCount} dari ${totalCount} soal</strong>.<br><span class="text-amber-600 font-bold">Masih ada ${remaining} soal yang belum dijawab!</span>`;
    }
  }

  const mins = Math.floor(appState.examSecondsRemaining / 60);
  const secs = appState.examSecondsRemaining % 60;
  if (timeEl) {
    timeEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeExamConfirmModal() {
  const modal = document.getElementById('exam-confirm-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmSubmitExam() {
  closeExamConfirmModal();
  finishExamSimulation();
}

function finishExamSimulation() {
  if (appState.examTimerInterval) clearInterval(appState.examTimerInterval);
  appState.examSubmitted = true;

  try {
    localStorage.removeItem('arab3_exam_state');
  } catch (e) {}

  let correctCount = 0;
  appState.examQuestions.forEach(q => {
    if (appState.examAnswers[q.id] === q.correct_answer) {
      correctCount++;
    }
  });

  const score = Math.round((correctCount / appState.examQuestions.length) * 100);

  document.getElementById('exam-active-box').classList.add('hidden');
  const resultBox = document.getElementById('exam-result-box');
  resultBox.classList.remove('hidden');

  let predikat = '';
  let predikatColor = '';
  if (score >= 90) {
    predikat = 'MUMTAZ (Istimewa / Sangat Baik)';
    predikatColor = 'text-emerald-700 bg-emerald-100';
  } else if (score >= 75) {
    predikat = 'JAYYID JIDDAN (Baik Sekali)';
    predikatColor = 'text-blue-700 bg-blue-100';
  } else if (score >= 60) {
    predikat = 'JAYYID (Baik - Perlu Sedikit Latihan Lagi)';
    predikatColor = 'text-amber-700 bg-amber-100';
  } else {
    predikat = 'MAQBUL (Perlu Mengulang Materi Kosakata & Menulis)';
    predikatColor = 'text-red-700 bg-red-100';
  }

  document.getElementById('exam-score-number').textContent = score;
  document.getElementById('exam-correct-count').textContent = `${correctCount} dari ${appState.examQuestions.length} Soal Benar`;
  const badge = document.getElementById('exam-predikat-badge');
  badge.textContent = predikat;
  badge.className = `inline-block px-4 py-1.5 rounded-full text-sm font-bold ${predikatColor}`;

  if (score >= 75 && window.confetti) {
    window.confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 }
    });
  }

  const reviewContainer = document.getElementById('exam-review-container');
  if (reviewContainer) {
    reviewContainer.innerHTML = appState.examQuestions.map((q, idx) => {
      const userAnswer = appState.examAnswers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      return `
        <div class="p-4 rounded-xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'} text-xs space-y-1">
          <div class="flex items-center justify-between font-bold">
            <span class="text-slate-700">No. ${idx + 1}: ${q.question}</span>
            <span class="${isCorrect ? 'text-emerald-700' : 'text-red-600'} font-bold">
              ${isCorrect ? '✓ Benar' : '✗ Salah'}
            </span>
          </div>
          <div class="text-slate-600">
            Jawaban Kamu: <strong>${userAnswer !== undefined ? q.options[userAnswer] : '(Tidak dijawab)'}</strong>
          </div>
          ${!isCorrect ? `
            <div class="text-emerald-800 font-semibold">
              Kunci Jawaban yang Benar: <strong>${q.options[q.correct_answer]}</strong>
            </div>
          ` : ''}
          <div class="text-slate-500 italic mt-1">${q.explanation}</div>
        </div>
      `;
    }).join('');
  }
}

// ==========================================
// MODAL RESET DATA & MULAI DARI AWAL
// ==========================================
function openResetModal() {
  const modal = document.getElementById('reset-confirm-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeResetModal() {
  const modal = document.getElementById('reset-confirm-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmResetAllData() {
  try {
    localStorage.removeItem('arab3_quiz_answers');
    localStorage.removeItem('arab3_exam_state');
    localStorage.removeItem('arab3_current_tab');
  } catch (e) {}

  appState.quizAnswers = {};
  appState.examAnswers = {};
  appState.examQuestions = [];
  appState.hasActiveExamSession = false;
  if (appState.examTimerInterval) clearInterval(appState.examTimerInterval);
  appState.examSubmitted = false;

  closeResetModal();

  const resumeBanner = document.getElementById('exam-resume-banner');
  if (resumeBanner) resumeBanner.remove();

  document.getElementById('exam-intro-box')?.classList.remove('hidden');
  document.getElementById('exam-active-box')?.classList.add('hidden');
  document.getElementById('exam-result-box')?.classList.add('hidden');

  renderQuizList();
  updateLiveScore();
  switchTab('materi');
}

// ==========================================
// MODUL 6: CETAK LEMBAR KERJA ASESMEN (PRINT PDF)
// ==========================================
function initCetakTab() {
  const printTriggerBtn = document.getElementById('btn-print-action');
  if (printTriggerBtn) {
    printTriggerBtn.addEventListener('click', () => {
      window.print();
    });
  }
  renderPrintSheet();
}

function renderPrintSheet() {
  const printArea = document.getElementById('print-area');
  if (!printArea) return;

  const school = ARABIC_DATA.school_info;
  const sections = ARABIC_DATA.worksheet_sections;

  printArea.innerHTML = `
    <div class="print-page max-w-4xl mx-auto bg-white p-6 md:p-10 text-black">
      <!-- Kop Resmi SDIT Tahfidz Bintangku -->
      <div class="border-b-4 border-double border-black pb-4 mb-6 text-center">
        <h1 class="text-xl md:text-2xl font-bold uppercase tracking-wide">${school.school}</h1>
        <h2 class="text-base md:text-lg font-semibold uppercase">${school.assessment_type} - ${school.academic_year}</h2>
        <div class="text-xs md:text-sm font-medium mt-1">
          Mata Pelajaran: <strong>${school.subject}</strong> | Kelas: <strong>${school.grade}</strong> | Fokus: <strong>${school.focus}</strong>
        </div>
      </div>

      <!-- Kotak Identitas Siswa -->
      <div class="grid grid-cols-2 gap-4 border border-black p-3 mb-6 text-xs md:text-sm">
        <div class="space-y-1.5">
          <div class="flex"><span class="w-24">Nama Siswa</span>: ....................................................</div>
          <div class="flex"><span class="w-24">Nomor Absen</span>: ....................................................</div>
          <div class="flex"><span class="w-24">Hari, Tanggal</span>: ....................................................</div>
        </div>
        <div class="flex items-center justify-end gap-6 text-center">
          <div class="border border-black w-24 h-16 flex flex-col justify-between p-1">
            <span class="text-[10px] uppercase font-bold border-b border-black">Nilai</span>
            <span class="text-xl font-bold"></span>
          </div>
          <div class="border border-black w-24 h-16 flex flex-col justify-between p-1">
            <span class="text-[10px] uppercase font-bold border-b border-black">Paraf Guru</span>
            <span class="text-xs"></span>
          </div>
        </div>
      </div>

      <!-- Bagian 1: Fahmul Maqru (Teks Cerita Asesmen) -->
      <div class="mb-6">
        <h3 class="font-bold text-sm uppercase bg-slate-100 p-1.5 border border-black mb-3">
          ${sections[0].part}
        </h3>
        <p class="text-xs italic mb-2">${sections[0].instruction}</p>

        <!-- Teks Cerita Dalam Kotak -->
        <div class="border-2 border-black p-4 mb-4 text-center bg-slate-50">
          <div class="font-arabic text-2xl md:text-3xl leading-loose font-bold mb-2" dir="rtl">
            فِي فَصْلِيْ<br>
            هٰذَا فَصْلِيْ. فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ.<br>
            عَلَى الْجِدَارِ سَاعَةٌ وَمِصْبَاحٌ.<br>
            فِيْ حَقِيْبَتِيْ دَفْتَرٌ وَقَلَمٌ وَقَلَمُ الرَّصَاصِ وَمِسْطَرَةٌ.
          </div>
        </div>

        <!-- Pertanyaan Teks Cerita -->
        <div class="space-y-4 text-xs md:text-sm">
          ${sections[0].questions.map(q => `
            <div>
              <div class="font-semibold">${q.num}. ${q.prompt.replace('\n', '<br>')}</div>
              <div class="mt-2 space-y-2">
                ${Array(q.lines).fill(0).map(() => '<div class="border-b border-dotted border-slate-500 h-6"></div>').join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bagian 2: Maharatul Kitabah (Menyambung Huruf) -->
      <div class="mb-6 page-break-inside-avoid">
        <h3 class="font-bold text-sm uppercase bg-slate-100 p-1.5 border border-black mb-3">
          ${sections[1].part}
        </h3>
        <p class="text-xs italic mb-3">${sections[1].instruction}</p>

        <table class="w-full border-collapse border border-black text-xs md:text-sm text-center">
          <thead>
            <tr class="bg-slate-200">
              <th class="border border-black p-2 w-10">No</th>
              <th class="border border-black p-2 font-arabic text-base">Huruf Terpisah</th>
              <th class="border border-black p-2">Arti Kata</th>
              <th class="border border-black p-2 w-48 font-arabic text-base">Tulisan Bersambung (Jawaban Siswa)</th>
            </tr>
          </thead>
          <tbody>
            ${sections[1].items.map(item => `
              <tr>
                <td class="border border-black p-2">${item.num}</td>
                <td class="border border-black p-2 font-arabic text-xl font-bold" dir="rtl">${item.separated}</td>
                <td class="border border-black p-2">${item.meaning}</td>
                <td class="border border-black p-2 h-12"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Bagian 3: Klasifikasi Benda -->
      <div class="mb-6 page-break-inside-avoid">
        <h3 class="font-bold text-sm uppercase bg-slate-100 p-1.5 border border-black mb-3">
          ${sections[2].part}
        </h3>
        <p class="text-xs italic mb-2">${sections[2].instruction}</p>

        <div class="border border-black p-2 mb-3 text-center font-arabic text-base font-bold bg-slate-50 flex flex-wrap justify-center gap-3" dir="rtl">
          ${sections[2].bank_items.map(b => `<span class="px-2 py-0.5 border border-slate-400 rounded">${b}</span>`).join('')}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="border border-black p-2">
            <div class="font-bold text-center border-b border-black pb-1 mb-2">ALAT TULIS (الأَدَوَاتُ الْمَكْتَبِيَّةُ)</div>
            <div class="space-y-3 pt-2">
              <div class="border-b border-dotted border-slate-500 h-6">1. </div>
              <div class="border-b border-dotted border-slate-500 h-6">2. </div>
              <div class="border-b border-dotted border-slate-500 h-6">3. </div>
              <div class="border-b border-dotted border-slate-500 h-6">4. </div>
            </div>
          </div>

          <div class="border border-black p-2">
            <div class="font-bold text-center border-b border-black pb-1 mb-2">BENDA DI KELAS (فِي الْفَصْلِ)</div>
            <div class="space-y-3 pt-2">
              <div class="border-b border-dotted border-slate-500 h-6">1. </div>
              <div class="border-b border-dotted border-slate-500 h-6">2. </div>
              <div class="border-b border-dotted border-slate-500 h-6">3. </div>
              <div class="border-b border-dotted border-slate-500 h-6">4. </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Lembar Soal -->
      <div class="mt-8 text-center text-[10px] text-slate-500 border-t border-slate-300 pt-3">
        Asesmen Tengah Semester Ganjil TA 2026/2027 • SDIT Tahfidz Bintangku Kota Probolinggo • Selamat Mengerjakan dengan Teliti & Jujur
      </div>
    </div>
  `;
}
