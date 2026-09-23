// Logika Utama Aplikasi Pembelajaran & Bank Soal Bahasa Arab Kelas 3 SD / MI
// Modul Mandiri & Bank Soal Interaktif

const EXAM_CONFIG = Object.freeze({
  questionCount: 15,
  durationMinutes: 30,
  composition: Object.freeze({
    teks_cerita: 2,
    sambung_huruf: 3,
    ikmal_huruf: 2,
    pilihan_ganda: 5,
    terjemah_tulis: 3
  })
});
const EXAM_STORAGE_KEY = 'arab3_exam_state';
const QUIZ_FILTER_STORAGE_KEY = 'arab3_quiz_filter';
const QUIZ_PROGRESS_STORAGE_KEY = 'arab3_quiz_progress';
const ACTIVE_TAB_STORAGE_KEY = 'arab3_active_tab';
const LEGACY_ACTIVE_TAB_STORAGE_KEY = 'arab3_current_tab';
const LEGACY_QUIZ_ANSWERS_STORAGE_KEY = 'arab3_quiz_answers';
const QUESTION_TYPE_META = Object.freeze({
  teks_cerita: Object.freeze({
    filterLabel: '📖 Soal Cerita',
    badgeLabel: '📖 Pemahaman Teks Cerita',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
  }),
  sambung_huruf: Object.freeze({
    filterLabel: '✍️ Sambung Huruf',
    badgeLabel: '✍️ Maharatul Kitabah',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  }),
  ikmal_huruf: Object.freeze({
    filterLabel: '🔤 Lengkapi Huruf',
    badgeLabel: '🔤 Lengkapi Huruf',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
  }),
  pilihan_ganda: Object.freeze({
    filterLabel: '🎯 Pilihan Ganda',
    badgeLabel: '🎯 Pilihan Ganda',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }),
  terjemah_tulis: Object.freeze({
    filterLabel: '📝 Penulisan Arab',
    badgeLabel: '📝 Penulisan / Kitabah',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  })
});

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function safeStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    // Penyimpanan tidak tersedia pada sebagian mode privat; aplikasi tetap dapat digunakan.
  }
}

let appState = {
  currentTab: 'materi',
  selectedCategory: 'all',
  searchQuery: '',
  flashcardIndex: 0,
  flashcardFlipped: false,

  // Quiz State
  quizAnswers: {},
  quizFilterType: 'all',
  quizQuestions: [],
  quizProgress: {},

  // Assessment Exam State
  examQuestions: [],
  examAnswers: {},
  examSubmitted: false,
  examTimerInterval: null,
  examStartedAt: null,
  examEndsAt: null,

  // Kitabah Pad Instance
  pad: null
};

// ==========================================
// INISIALISASI APLIKASI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMateriTab();
  initCeritaTab();
  initKitabahTab();
  initKuisTab();
  const activeExamRestored = initAsesmenTab();
  initCetakTab();
  initSpeechSynthesis();
  initResetDataControls();
  renderStudyCounts();
  restoreActiveTab(activeExamRestored);

  refreshIcons();
});

function initResetDataControls() {
  const trigger = document.getElementById('reset-data-btn');
  const dialog = document.getElementById('reset-data-modal');
  trigger?.addEventListener('click', () => openAppDialog(dialog, trigger));
  document.getElementById('cancel-reset-data-btn')?.addEventListener('click', () => dialog?.close());
  document.getElementById('confirm-reset-data-btn')?.addEventListener('click', () => {
    [
      'arab3-theme',
      ACTIVE_TAB_STORAGE_KEY,
      LEGACY_ACTIVE_TAB_STORAGE_KEY,
      QUIZ_FILTER_STORAGE_KEY,
      QUIZ_PROGRESS_STORAGE_KEY,
      LEGACY_QUIZ_ANSWERS_STORAGE_KEY,
      EXAM_STORAGE_KEY
    ].forEach(safeStorageRemove);
    window.location.reload();
  });
}

// ==========================================
// SISTEM NAVIGASI TAB
// ==========================================
function initNavigation() {
  const navButtons = document.querySelectorAll('[data-tab-target]');
  const header = document.querySelector('.app-header');
  const updateHeaderOffset = () => {
    if (header) document.documentElement.style.setProperty('--app-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
  };
  updateHeaderOffset();
  if (header && 'ResizeObserver' in window) {
    const headerObserver = new ResizeObserver(updateHeaderOffset);
    headerObserver.observe(header);
  } else {
    window.addEventListener('resize', updateHeaderOffset);
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab-target');
      switchTab(targetTab);
    });
    btn.addEventListener('keydown', event => {
      const tabs = [...navButtons];
      const currentIndex = tabs.indexOf(btn);
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[nextIndex].focus();
      switchTab(tabs[nextIndex].getAttribute('data-tab-target'));
    });
  });

  document.getElementById('header-print-btn')?.addEventListener('click', () => switchTab('cetak'));
  document.getElementById('header-exam-btn')?.addEventListener('click', () => switchTab('asesmen'));

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
  if (!document.getElementById(`tab-${tabId}`)) return;
  appState.currentTab = tabId;
  safeStorageSet(ACTIVE_TAB_STORAGE_KEY, tabId);

  // Sembunyikan semua tab section
  document.querySelectorAll('.tab-section').forEach(sec => {
    sec.classList.add('hidden');
    sec.setAttribute('aria-hidden', 'true');
  });

  // Tampilkan tab yang dipilih
  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    targetSection.setAttribute('aria-hidden', 'false');
  }

  // Update styling button aktif di header
  document.querySelectorAll('[data-tab-target]').forEach(btn => {
    const isCurrent = btn.getAttribute('data-tab-target') === tabId;
    btn.setAttribute('aria-selected', String(isCurrent));
    btn.tabIndex = isCurrent ? 0 : -1;
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

  // Khusus tab kitabah: resize canvas agar pas dengan kontainer
  if (tabId === 'kitabah') {
    setTimeout(() => {
      if (!appState.pad) {
        appState.pad = new window.KitabahPad('kitabah-canvas');
      } else {
        appState.pad.resizeCanvas();
      }
    }, 150);
  }

  // Khusus tab kuis / asesmen
  if (tabId === 'kuis' && appState.quizQuestions.length === 0) {
    loadQuizQuestions(appState.quizFilterType);
  }

  // Scroll to top jika diminta
  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  refreshIcons();
}

function restoreActiveTab(activeExamRestored = false) {
  const tabIds = ['materi', 'cerita', 'kitabah', 'kuis', 'asesmen', 'cetak'];
  const savedTab = safeStorageGet(ACTIVE_TAB_STORAGE_KEY) || safeStorageGet(LEGACY_ACTIVE_TAB_STORAGE_KEY);
  switchTab(activeExamRestored ? 'asesmen' : tabIds.includes(savedTab) ? savedTab : 'materi');
}

// ==========================================
// AUDIO & SPEECH SYNTHESIS (Pengucapan Arab)
// ==========================================
let arabicVoice = null;

function initSpeechSynthesis() {
  const updateVoices = () => {
    try {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      arabicVoice = voices.find(voice => voice.lang?.startsWith('ar')) || null;
    } catch (error) {
      arabicVoice = null;
    }
  };
  updateVoices();
  if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = updateVoices;
}

function playArabicSpeech(text) {
  try {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') return false;
    window.speechSynthesis.cancel();
    const cleanText = String(text || '').replace(/[0-9.]/g, '').trim();
    if (!cleanText) return false;
    const utterance = new window.SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    if (arabicVoice) utterance.voice = arabicVoice;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    return false;
  }
}

function refreshIcons() {
  try {
    window.lucide?.createIcons?.();
  } catch (error) {
    // Ikon dekoratif tidak boleh menghentikan materi utama.
  }
}

function playConfetti(options) {
  try {
    if (typeof window.confetti === 'function') window.confetti(options);
  } catch (error) {
    // Confetti hanya dekorasi; kegagalan tidak mengubah nilai latihan.
  }
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
  container?.addEventListener('click', event => {
    const button = event.target.closest('[data-vocab-action]');
    if (!button) return;
    const vocabulary = ARABIC_DATA.vocabularies.find(item => item.id === button.getAttribute('data-vocab-id'));
    if (!vocabulary) return;
    if (button.getAttribute('data-vocab-action') === 'trace') openWordInTracingPad(vocabulary.arabic);
    else playArabicSpeech(vocabulary.audio_text || vocabulary.arabic);
  });

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
        b.setAttribute('aria-pressed', String(b === btn));
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
      switchFlashcardBtn.setAttribute('aria-pressed', 'true');
      switchGridBtn.setAttribute('aria-pressed', 'false');
      switchFlashcardBtn.classList.add('bg-emerald-600', 'text-white');
      switchFlashcardBtn.classList.remove('bg-slate-100', 'text-slate-700');
      switchGridBtn.classList.remove('bg-emerald-600', 'text-white');
      switchGridBtn.classList.add('bg-slate-100', 'text-slate-700');

      gridView.classList.add('hidden');
      flashcardView.classList.remove('hidden');
      updateFlashcardDisplay();
    });

    switchGridBtn.addEventListener('click', () => {
      switchGridBtn.setAttribute('aria-pressed', 'true');
      switchFlashcardBtn.setAttribute('aria-pressed', 'false');
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
  updateFlashcardDisplay();
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
          <button type="button" data-vocab-action="listen" data-vocab-id="${item.id}"
            title="Dengarkan Pelafalan"
            aria-label="Dengarkan pelafalan ${item.meaning}"
            class="student-action-button absolute top-2 right-2 rounded-lg bg-white/80 hover:bg-emerald-600 hover:text-white text-emerald-600 border border-slate-200 shadow-sm transition-all">
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
          <button type="button" data-vocab-action="trace" data-vocab-id="${item.id}"
            class="student-action-button text-emerald-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            <span>Latihan Tulis</span>
          </button>
          <button type="button" data-vocab-action="listen" data-vocab-id="${item.id}"
            class="student-action-button text-slate-500 hover:text-slate-700 inline-flex items-center gap-1">
            <i data-lucide="volume-1" class="w-3.5 h-3.5"></i>
            <span>Lafalkan</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
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
  const extraStory = ARABIC_DATA.reading_materials[1];

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
            <button type="button" data-story-action="full-audio"
              class="student-action-button px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2">
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
        <strong class="font-semibold">Petunjuk Belajar Siswa:</strong>
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
    const wordSpans = p.words.map((w, wordIndex) => {
      const isClassItem = w.type === 'benda_kelas';
      const isBagItem = w.type === 'alat_tulis';
      let typeBadge = '';
      if (isClassItem) typeBadge = 'border-b-2 border-emerald-500 font-bold text-emerald-900';
      else if (isBagItem) typeBadge = 'border-b-2 border-amber-500 font-bold text-amber-900';

      return `
        <button type="button"
          class="story-word ${typeBadge}"
          data-story-paragraph="${idx}" data-story-word="${wordIndex}"
          aria-label="${w.ar}, arti: ${w.id}. Buka penjelasan kata."
          title="Buka arti ${w.id}">
          ${w.ar}
        </button>
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
          <button type="button" data-story-audio="${idx}"
            class="student-action-button text-sm text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors">
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

    <!-- Teks Latihan Tambahan -->
    <div class="mt-12 pt-8 border-t-2 border-slate-200">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-lg text-slate-800">📖 ${extraStory.title_id}: ${extraStory.title_ar}</h3>
          <p class="text-sm text-slate-600">${extraStory.subtitle}</p>
        </div>
        <button type="button" data-story-action="extra-audio"
          class="student-action-button px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-1">
          <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
          <span>Dengarkan cerita</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        ${extraStory.paragraphs.map(paragraph => `
          <div>
            <div class="font-arabic text-2xl text-slate-800 text-right leading-loose" dir="rtl">${renderHighlightedStorySentence(paragraph)}</div>
            <p class="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">${paragraph.meaning}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  storyContainer.innerHTML = html;
  storyContainer.addEventListener('click', event => {
    const wordButton = event.target.closest('[data-story-word]');
    if (wordButton) {
      const paragraph = mainStory.paragraphs[Number(wordButton.getAttribute('data-story-paragraph'))];
      const word = paragraph?.words[Number(wordButton.getAttribute('data-story-word'))];
      if (word) showWordDetail(word.ar, word.id, word.type || '', wordButton);
      return;
    }

    const audioButton = event.target.closest('[data-story-audio]');
    if (audioButton) {
      const paragraph = mainStory.paragraphs[Number(audioButton.getAttribute('data-story-audio'))];
      if (paragraph?.sentence_ar) playArabicSpeech(paragraph.sentence_ar);
      return;
    }

    const actionButton = event.target.closest('[data-story-action]');
    if (actionButton?.getAttribute('data-story-action') === 'full-audio') playFullStoryAudio();
    if (actionButton?.getAttribute('data-story-action') === 'extra-audio') playArabicSpeech(getStoryAudioText(extraStory));
  });
}

function renderHighlightedStorySentence(paragraph) {
  let sentence = paragraph.sentence_ar;
  paragraph.words.filter(word => word.type).forEach(word => {
    const colorClass = word.type === 'alat_tulis' ? 'text-amber-700' : 'text-emerald-700';
    sentence = sentence.split(word.ar).join(`<span class="${colorClass} font-bold">${word.ar}</span>`);
  });
  return sentence;
}

function showWordDetail(arabic, translation, type, trigger = document.activeElement) {
  playArabicSpeech(arabic);

  const typeDesc = type === 'alat_tulis'
    ? '✏️ Termasuk kategori: Alat Tulis & Peralatan Sekolah'
    : (type === 'benda_kelas' ? '🏫 Termasuk kategori: Benda di Dalam Kelas' : 'Kata penghubung / keterangan');

  const popup = document.getElementById('word-detail-modal');
  if (popup) {
    document.getElementById('modal-word-arabic').textContent = arabic;
    document.getElementById('modal-word-trans').textContent = translation;
    document.getElementById('modal-word-type').textContent = typeDesc;
    openAppDialog(popup, trigger);
  }
}

function closeWordModal() {
  const popup = document.getElementById('word-detail-modal');
  if (popup?.open) popup.close();
}

const dialogReturnFocus = new WeakMap();

function openAppDialog(dialog, returnFocus = document.activeElement) {
  if (!dialog || dialog.open || typeof dialog.showModal !== 'function') return;
  dialogReturnFocus.set(dialog, returnFocus);
  dialog.addEventListener('close', () => {
    const target = dialogReturnFocus.get(dialog);
    const visible = target?.isConnected && !target.closest('.hidden,[hidden]');
    if (visible) target.focus();
  }, { once: true });
  dialog.showModal();
  (dialog.querySelector('[data-dialog-initial-focus]') || dialog.querySelector('button'))?.focus();
}

function playFullStoryAudio() {
  const fullStory = getStoryAudioText(ARABIC_DATA.reading_materials[0]);
  if (fullStory) playArabicSpeech(fullStory);
}

function getStoryAudioText(story) {
  return story.paragraphs
    .map(paragraph => paragraph.sentence_ar)
    .filter(Boolean)
    .join(' ');
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
  const toggleTracingBtn = document.getElementById('canvas-tracing-btn');
  const downloadBtn = document.getElementById('canvas-download-btn');

  // Populate the word selector from the vocabulary data source.
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
      colorButtons.forEach(b => {
        b.classList.remove('ring-4', 'ring-emerald-300');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('ring-4', 'ring-emerald-300');
      btn.setAttribute('aria-pressed', 'true');
      const color = btn.getAttribute('data-draw-color');
      if (appState.pad) appState.pad.setColor(color);
    });
  });

  // Size buttons
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('bg-emerald-600', 'text-white'));
      sizeButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.classList.add('bg-emerald-600', 'text-white');
      btn.setAttribute('aria-pressed', 'true');
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
      eraserBtn.setAttribute('aria-pressed', String(isNowEraser));
      if (isNowEraser) {
        eraserBtn.classList.add('bg-amber-600', 'text-white');
      } else {
        eraserBtn.classList.remove('bg-amber-600', 'text-white');
      }
    });
  }
  if (toggleGuideBtn) toggleGuideBtn.addEventListener('click', () => {
    if (!appState.pad) return;
    const visible = appState.pad.toggleGuideline();
    toggleGuideBtn.setAttribute('aria-pressed', String(visible));
  });
  if (toggleTracingBtn) toggleTracingBtn.addEventListener('click', () => {
    if (!appState.pad) return;
    const visible = appState.pad.toggleTracing();
    toggleTracingBtn.setAttribute('aria-pressed', String(visible));
  });
  if (downloadBtn) downloadBtn.addEventListener('click', () => appState.pad && appState.pad.downloadDrawing());

  // Inisialisasi puzzle sambung huruf
  initSambungHurufInteractive();
}

// Interaktif Puzzle Sambung Huruf di Tab Kitabah
let currentPuzzleIndex = 0;
const sambungItems = ARABIC_DATA.question_bank.filter(q => q.type === 'sambung_huruf');

function initSambungHurufInteractive() {
  renderSambungPuzzle();
  const puzzleContainer = document.getElementById('sambung-puzzle-content');
  puzzleContainer?.addEventListener('click', event => {
    const option = event.target.closest('[data-puzzle-option]');
    if (!option) return;
    const item = sambungItems[currentPuzzleIndex];
    checkSambungAnswer(Number(option.getAttribute('data-puzzle-option')), item.correct_answer, item.target_word);
  });

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
          <button type="button" data-puzzle-option="${idx}"
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
  const filters = document.getElementById('quiz-filter-buttons');
  const resetButton = document.getElementById('quiz-reset-btn');
  if (filters) {
    renderQuizFilters(filters);
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-quiz-filter]');
      if (button) loadQuizQuestions(button.getAttribute('data-quiz-filter'));
    });
  }
  document.getElementById('quiz-questions-list')?.addEventListener('click', event => {
    const button = event.target.closest('[data-quiz-question][data-quiz-option]');
    if (button) selectQuizAnswer(button.getAttribute('data-quiz-question'), Number(button.getAttribute('data-quiz-option')));
  });
  if (resetButton) {
    resetButton.addEventListener('click', resetCurrentQuizCategory);
  }

  appState.quizProgress = readQuizProgress();
  migrateLegacyQuizAnswers();
  const savedFilter = safeStorageGet(QUIZ_FILTER_STORAGE_KEY);
  appState.quizFilterType = savedFilter === 'all' || QUESTION_TYPE_META[savedFilter] ? savedFilter : 'all';
  loadQuizQuestions(appState.quizFilterType);
}

function renderQuizFilters(container) {
  const filters = [
    { type: 'all', label: 'Semua Soal', count: ARABIC_DATA.question_bank.length },
    ...Object.entries(QUESTION_TYPE_META).map(([type, meta]) => ({
      type,
      label: meta.filterLabel,
      count: ARABIC_DATA.question_bank.filter(question => question.type === type).length
    }))
  ];
  container.innerHTML = filters.map(filter => `
    <button type="button" data-quiz-filter="${filter.type}" aria-pressed="false" class="quiz-filter-button min-h-11 px-3 rounded-xl text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all">
      ${filter.label} <span class="font-medium">(${filter.count})</span>
    </button>
  `).join('');
}

function readQuizProgress() {
  const serialized = safeStorageGet(QUIZ_PROGRESS_STORAGE_KEY);
  if (!serialized) return {};
  try {
    const parsed = JSON.parse(serialized);
    if (parsed?.version === 1 && parsed.answersByFilter && typeof parsed.answersByFilter === 'object') {
      return parsed.answersByFilter;
    }
  } catch (error) {
    safeStorageRemove(QUIZ_PROGRESS_STORAGE_KEY);
  }
  return {};
}

function migrateLegacyQuizAnswers() {
  const serialized = safeStorageGet(LEGACY_QUIZ_ANSWERS_STORAGE_KEY);
  if (!serialized) return;
  try {
    const legacyAnswers = JSON.parse(serialized);
    if (!legacyAnswers || typeof legacyAnswers !== 'object' || Array.isArray(legacyAnswers)) return;
    const knownQuestions = new Map(ARABIC_DATA.question_bank.map(question => [question.id, question]));
    const validAnswers = {};
    Object.entries(legacyAnswers).forEach(([id, rawAnswer]) => {
      const question = knownQuestions.get(id);
      const answer = Number(rawAnswer);
      if (question && Number.isInteger(answer) && answer >= 0 && answer < question.options.length) {
        validAnswers[id] = answer;
      }
    });
    const currentAllAnswers = appState.quizProgress.all && typeof appState.quizProgress.all === 'object' && !Array.isArray(appState.quizProgress.all)
      ? appState.quizProgress.all
      : {};
    appState.quizProgress.all = { ...validAnswers, ...currentAllAnswers };
    if (safeStorageSet(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1, answersByFilter: appState.quizProgress }))) {
      safeStorageRemove(LEGACY_QUIZ_ANSWERS_STORAGE_KEY);
    }
  } catch (error) {
    // Data kuis lama yang rusak diabaikan; latihan baru tetap bisa dimulai.
  }
}

function saveQuizProgress() {
  appState.quizProgress[appState.quizFilterType] = { ...appState.quizAnswers };
  safeStorageSet(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify({
    version: 1,
    answersByFilter: appState.quizProgress
  }));
}

function getSavedQuizAnswers(filterType) {
  const saved = appState.quizProgress[filterType];
  if (!saved || typeof saved !== 'object') return {};
  const allowedQuestions = new Map(ARABIC_DATA.question_bank.map(question => [question.id, question]));
  const answers = {};
  Object.entries(saved).forEach(([id, rawAnswer]) => {
    const question = allowedQuestions.get(id);
    const answer = Number(rawAnswer);
    const matchesFilter = filterType === 'all' || question?.type === filterType;
    if (question && matchesFilter && Number.isInteger(answer) && answer >= 0 && answer < question.options.length) {
      answers[id] = answer;
    }
  });
  return answers;
}

function resetCurrentQuizCategory() {
  delete appState.quizProgress[appState.quizFilterType];
  safeStorageSet(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify({ version: 1, answersByFilter: appState.quizProgress }));
  loadQuizQuestions(appState.quizFilterType);
}

function loadQuizQuestions(filterType = 'all') {
  if (filterType !== 'all' && !QUESTION_TYPE_META[filterType]) filterType = 'all';
  appState.quizFilterType = filterType;
  appState.quizAnswers = {};
  safeStorageSet(QUIZ_FILTER_STORAGE_KEY, filterType);

  if (filterType === 'all') {
    appState.quizQuestions = [...ARABIC_DATA.question_bank];
  } else {
    appState.quizQuestions = ARABIC_DATA.question_bank.filter(q => q.type === filterType);
  }
  appState.quizAnswers = getSavedQuizAnswers(filterType);

  document.querySelectorAll('[data-quiz-filter]').forEach(button => {
    const selected = button.getAttribute('data-quiz-filter') === filterType;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('bg-emerald-600', selected);
    button.classList.toggle('text-white', selected);
    button.classList.toggle('shadow', selected);
    button.classList.toggle('bg-white', !selected);
    button.classList.toggle('text-slate-700', !selected);
  });
  const resetButton = document.getElementById('quiz-reset-btn');
  if (resetButton) resetButton.disabled = appState.quizQuestions.length === 0;
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
    const typeMeta = QUESTION_TYPE_META[q.type];
    const typeBadge = typeMeta
      ? `<span class="px-2.5 py-1 ${typeMeta.badgeClass} text-sm font-bold rounded-full border">${typeMeta.badgeLabel}</span>`
      : '<span class="px-2.5 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full border border-red-200">Tipe soal belum dikenali</span>';

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
          ${q.options.map((opt, optIdx) => `
            <button type="button" aria-pressed="false"
              id="opt-btn-${q.id}-${optIdx}"
              data-quiz-question="${q.id}" data-quiz-option="${optIdx}"
              class="quiz-option-btn text-left p-3.5 rounded-xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all font-medium text-slate-700 flex items-center gap-3">
              <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                ${['A', 'B', 'C', 'D'][optIdx]}
              </span>
              <span class="${opt.match(/[\u0600-\u06FF]/) ? 'font-arabic text-xl font-bold' : 'text-sm'}">${opt}</span>
            </button>
          `).join('')}
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

  questions.forEach(question => {
    const selectedAnswer = appState.quizAnswers[question.id];
    if (!Number.isInteger(selectedAnswer)) return;
    applyQuizAnswerFeedback(question, selectedAnswer);
    document.getElementById(`explanation-${question.id}`)?.classList.remove('hidden');
  });

  refreshIcons();
  updateLiveScore(false);
}

function selectQuizAnswer(questionId, selectedOptIdx) {
  const q = appState.quizQuestions.find(item => item.id === questionId);
  if (!q || !Number.isInteger(selectedOptIdx) || selectedOptIdx < 0 || selectedOptIdx >= q.options.length) return;

  if (appState.quizAnswers[questionId] !== undefined) return;

  appState.quizAnswers[questionId] = selectedOptIdx;
  saveQuizProgress();
  applyQuizAnswerFeedback(q, selectedOptIdx);
  playSoundEffect(selectedOptIdx === q.correct_answer ? 'correct' : 'wrong');
  document.getElementById(`explanation-${questionId}`)?.classList.remove('hidden');
  updateLiveScore(true);
}

function applyQuizAnswerFeedback(question, selectedOptIdx) {
  const isCorrect = selectedOptIdx === question.correct_answer;
  const chosenBtn = document.getElementById(`opt-btn-${question.id}-${selectedOptIdx}`);
  const correctBtn = document.getElementById(`opt-btn-${question.id}-${question.correct_answer}`);
  question.options.forEach((_, idx) => {
    const btn = document.getElementById(`opt-btn-${question.id}-${idx}`);
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-pressed', String(idx === selectedOptIdx));
    }
  });

  if (isCorrect) {
    if (chosenBtn) {
      chosenBtn.className = 'quiz-option-btn text-left p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-bold flex items-center gap-3';
      const badge = chosenBtn.querySelector('span');
      if (badge) badge.className = 'w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0';
    }
  } else {
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
}

function updateLiveScore(allowConfetti = false) {
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

  // Jika semua sudah terjawab, berikan konfeti
  if (allowConfetti && totalAnswered === appState.quizQuestions.length && totalAnswered > 0) {
    const percentage = Math.round((correctCount / totalAnswered) * 100);
    if (percentage >= 70) {
      playConfetti({
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
  const submitDialog = document.getElementById('exam-submit-modal');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => openAppDialog(submitDialog, submitBtn));
  }

  document.getElementById('cancel-exam-submit-btn')?.addEventListener('click', () => submitDialog?.close());
  document.getElementById('confirm-exam-submit-btn')?.addEventListener('click', () => {
    dialogReturnFocus.set(submitDialog, document.getElementById('exam-result-heading'));
    submitDialog?.close();
    finishExamSimulation();
  });
  document.getElementById('word-modal-speech-btn')?.addEventListener('click', () => {
    playArabicSpeech(document.getElementById('modal-word-arabic').textContent);
  });
  document.getElementById('word-modal-close-btn')?.addEventListener('click', closeWordModal);

  document.getElementById('finish-exam-btn')?.addEventListener('click', () => submitBtn?.click());
  document.getElementById('print-exam-btn')?.addEventListener('click', () => switchTab('cetak'));
  document.getElementById('exam-questions-container')?.addEventListener('change', event => {
    const answer = event.target.closest('input[data-exam-question]');
    if (answer) recordExamAnswer(answer.getAttribute('data-exam-question'), Number(answer.value));
  });
  document.getElementById('exam-config-count').textContent = `${EXAM_CONFIG.questionCount} Butir`;
  document.getElementById('exam-config-duration').textContent = `${EXAM_CONFIG.durationMinutes} Menit`;
  document.addEventListener('visibilitychange', updateExamTimer);

  const retryBtn = document.getElementById('retry-exam-btn');
  if (retryBtn) retryBtn.addEventListener('click', startExamSimulation);
  return restoreActiveExamSession();
}

function renderStudyCounts() {
  const vocabCount = ARABIC_DATA.vocabularies.length;
  const questionCount = ARABIC_DATA.question_bank.length;
  const writingCount = ARABIC_DATA.vocabularies.filter(item => item.category === 'alat_tulis').length;
  const classroomCount = ARABIC_DATA.vocabularies.filter(item => item.category === 'benda_kelas').length;
  const values = {
    'hero-vocab-count': vocabCount,
    'hero-vocab-copy-count': vocabCount,
    'hero-question-count': questionCount,
    'hero-exam-count': EXAM_CONFIG.questionCount,
    'hero-exam-duration': `${EXAM_CONFIG.durationMinutes} menit`,
    'hero-writing-vocab-count': `${writingCount} Alat Tulis & Sekolah`,
    'hero-class-vocab-count': `${classroomCount} Benda di Dalam Kelas`,
    'vocab-count-all': vocabCount,
    'vocab-count-writing': writingCount,
    'vocab-count-classroom': classroomCount
  };
  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

function startExamSimulation() {
  appState.examQuestions = createExamQuestionSet();
  appState.examAnswers = {};
  appState.examSubmitted = false;
  appState.examStartedAt = Date.now();
  appState.examEndsAt = appState.examStartedAt + EXAM_CONFIG.durationMinutes * 60 * 1000;
  saveActiveExamSession();

  showActiveExam();
  startExamTimer();
}

function createExamQuestionSet(random = Math.random) {
  const selected = [];
  Object.entries(EXAM_CONFIG.composition).forEach(([type, count]) => {
    const candidates = ARABIC_DATA.question_bank.filter(question => question.type === type);
    if (candidates.length < count) {
      throw new Error(`Bank soal ${type} hanya memiliki ${candidates.length} butir; dibutuhkan ${count}.`);
    }
    selected.push(...fisherYatesShuffle(candidates, random).slice(0, count));
  });
  if (selected.length !== EXAM_CONFIG.questionCount) {
    throw new Error(`Blueprint ujian menghasilkan ${selected.length} soal, bukan ${EXAM_CONFIG.questionCount}.`);
  }
  return fisherYatesShuffle(selected, random);
}

function fisherYatesShuffle(items, random = Math.random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function saveActiveExamSession() {
  if (!appState.examEndsAt || appState.examSubmitted || appState.examQuestions.length === 0) return;
  safeStorageSet(EXAM_STORAGE_KEY, JSON.stringify({
    version: 1,
    startedAt: appState.examStartedAt,
    endsAt: appState.examEndsAt,
    questionIds: appState.examQuestions.map(question => question.id),
    answers: appState.examAnswers
  }));
}

function normalizeSavedExamState(savedState) {
  if (!savedState || typeof savedState !== 'object' || savedState.submitted === true || savedState.examSubmitted === true) return null;
  const questionIds = Array.isArray(savedState.questionIds)
    ? savedState.questionIds
    : Array.isArray(savedState.examQuestions)
      ? savedState.examQuestions.map(question => typeof question === 'string' ? question : question?.id)
      : Array.isArray(savedState.questions)
        ? savedState.questions.map(question => typeof question === 'string' ? question : question?.id)
        : [];
  const knownQuestions = new Map(ARABIC_DATA.question_bank.map(question => [question.id, question]));
  if (questionIds.length !== EXAM_CONFIG.questionCount || new Set(questionIds).size !== questionIds.length) return null;
  if (questionIds.some(id => typeof id !== 'string' || !knownQuestions.has(id))) return null;

  const now = Date.now();
  let endsAt = savedState.endsAt === null || savedState.endsAt === '' ? NaN : Number(savedState.endsAt);
  const legacySecondsValue = savedState.secondsRemaining ?? savedState.examSecondsRemaining;
  const legacySeconds = legacySecondsValue === null || legacySecondsValue === '' ? NaN : Number(legacySecondsValue);
  if (!Number.isFinite(endsAt)) {
    if (Number.isFinite(legacySeconds) && legacySeconds >= 0) {
      endsAt = now + Math.ceil(legacySeconds) * 1000;
    } else if (savedState.startedAt !== null && savedState.startedAt !== '' && Number.isFinite(Number(savedState.startedAt))) {
      endsAt = Number(savedState.startedAt) + EXAM_CONFIG.durationMinutes * 60 * 1000;
    } else {
      return null;
    }
  }

  const sourceAnswers = savedState.answers && typeof savedState.answers === 'object'
    ? savedState.answers
    : savedState.examAnswers && typeof savedState.examAnswers === 'object'
      ? savedState.examAnswers
      : {};
  const answers = {};
  questionIds.forEach(id => {
    const rawValue = sourceAnswers[id];
    if (rawValue === null || rawValue === undefined || rawValue === '' || typeof rawValue === 'boolean') return;
    const value = Number(rawValue);
    if (Number.isInteger(value) && value >= 0 && value < knownQuestions.get(id).options.length) {
      answers[id] = value;
    }
  });

  const startedAt = savedState.startedAt !== null && savedState.startedAt !== '' && Number.isFinite(Number(savedState.startedAt))
    ? Number(savedState.startedAt)
    : endsAt - EXAM_CONFIG.durationMinutes * 60 * 1000;
  return {
    startedAt,
    endsAt,
    questions: questionIds.map(id => knownQuestions.get(id)),
    answers
  };
}

function restoreActiveExamSession() {
  const serialized = safeStorageGet(EXAM_STORAGE_KEY);
  if (!serialized) return false;

  let savedState;
  try {
    savedState = JSON.parse(serialized);
  } catch (error) {
    safeStorageRemove(EXAM_STORAGE_KEY);
    return false;
  }

  const restored = normalizeSavedExamState(savedState);
  if (!restored) {
    safeStorageRemove(EXAM_STORAGE_KEY);
    return false;
  }

  appState.examQuestions = restored.questions;
  appState.examAnswers = restored.answers;
  appState.examStartedAt = restored.startedAt;
  appState.examEndsAt = restored.endsAt;
  appState.examSubmitted = false;
  saveActiveExamSession();
  showActiveExam();
  startExamTimer();
  return true;
}

function showActiveExam() {
  document.getElementById('exam-intro-box')?.classList.add('hidden');
  document.getElementById('exam-active-box')?.classList.remove('hidden');
  document.getElementById('exam-result-box')?.classList.add('hidden');
  renderExamQuestions();
  updateExamProgress();
}

function renderExamQuestions() {
  const container = document.getElementById('exam-questions-container');
  if (!container) return;

  container.innerHTML = appState.examQuestions.map((q, idx) => `
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

      <fieldset class="space-y-2">
        <legend class="text-base font-bold text-slate-800 mb-4">${q.question}</legend>
        ${q.options.map((opt, optIdx) => `
          <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="exam-q-${q.id}"
              value="${optIdx}"
              data-exam-question="${q.id}"
              ${appState.examAnswers[q.id] === optIdx ? 'checked' : ''}
              class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300">
            <span class="${opt.match(/[\u0600-\u06FF]/) ? 'font-arabic text-xl font-bold' : 'text-sm font-medium text-slate-700'}">${opt}</span>
          </label>
        `).join('')}
      </fieldset>
    </div>
  `).join('');
}

function recordExamAnswer(questionId, optionIdx) {
  if (appState.examSubmitted) return;
  const question = appState.examQuestions.find(item => item.id === questionId);
  if (!question || !Number.isInteger(optionIdx) || optionIdx < 0 || optionIdx >= question.options.length) return;
  appState.examAnswers[questionId] = optionIdx;
  saveActiveExamSession();
  updateExamProgress();
}

function updateExamProgress() {
  const answeredCount = Object.keys(appState.examAnswers).length;
  const progressText = document.getElementById('exam-progress-text');
  if (progressText) {
    progressText.textContent = `Terjawab: ${answeredCount} / ${EXAM_CONFIG.questionCount}`;
  }
}

function startExamTimer() {
  if (appState.examTimerInterval) clearInterval(appState.examTimerInterval);
  updateExamTimer();
  if (!appState.examSubmitted && appState.examEndsAt > Date.now()) {
    appState.examTimerInterval = setInterval(updateExamTimer, 1000);
  }
}

function updateExamTimer() {
  if (appState.examSubmitted || !appState.examEndsAt) return 0;
  const secondsRemaining = Math.max(0, Math.ceil((appState.examEndsAt - Date.now()) / 1000));
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timerDisplay = document.getElementById('exam-timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  if (secondsRemaining === 0) finishExamSimulation({ timedOut: true });
  return secondsRemaining;
}

function finishExamSimulation({ timedOut = false } = {}) {
  if (appState.examSubmitted || appState.examQuestions.length === 0) return;
  const submitDialog = document.getElementById('exam-submit-modal');
  if (submitDialog?.open) {
    dialogReturnFocus.set(submitDialog, document.getElementById('exam-result-heading'));
    submitDialog.close();
  }
  if (appState.examTimerInterval) clearInterval(appState.examTimerInterval);
  appState.examTimerInterval = null;
  appState.examSubmitted = true;
  safeStorageRemove(EXAM_STORAGE_KEY);

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
  const resultMessage = document.getElementById('exam-result-message');
  if (resultMessage) {
    resultMessage.textContent = timedOut
      ? 'Waktu habis. Jawaban yang sudah dipilih telah dinilai.'
      : 'Hasil ini adalah simulasi latihan berdasarkan jawaban yang kamu pilih.';
  }
  const badge = document.getElementById('exam-predikat-badge');
  badge.textContent = predikat;
  badge.className = `inline-block px-4 py-1.5 rounded-full text-sm font-bold ${predikatColor}`;

  if (score >= 75) {
    playConfetti({
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
  document.getElementById('exam-result-heading')?.focus();
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
      <!-- Kop Lembar Asesmen -->
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
        Asesmen Tengah Semester Ganjil TA 2026/2027 • Bahasa Arab Kelas 3 SD / MI • Selamat Mengerjakan dengan Teliti & Jujur
      </div>
    </div>
  `;
}
