// Data Pembelajaran & Bank Soal Bahasa Arab Kelas 3 SD / MI
// Tema: Alat Tulis & Peralatan Sekolah (الأدوات المكتبية والمدرسية) & Di Dalam Kelas (في الفصل)
// Fokus: Maharatul Kitabah & Pemahaman Teks Cerita

const ARABIC_DATA = {
  school_info: {
    school: "MODUL PEMBELAJARAN BAHASA ARAB",
    academic_year: "TAHUN AJARAN 2026/2027",
    subject: "Bahasa Arab",
    grade: "Kelas 3 (Tiga)",
    assessment_type: "Asesmen Tengah Semester Ganjil (ATS)",
    focus: "Maharatul Kitabah (Keterampilan Menulis) & Fahmul Maqru' (Pemahaman Teks)",
    theme: "Alat Tulis & Benda-benda di Dalam Kelas"
  },

  categories: [
    {
      id: "alat_tulis",
      name: "Alat Tulis & Peralatan Sekolah",
      arabic_name: "الأَدَوَاتُ الْمَكْتَبِيَّةُ وَالْمَدْرَسِيَّةُ",
      icon: "✏️",
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "benda_kelas",
      name: "Benda di Dalam Kelas",
      arabic_name: "فِي الْفَصْلِ",
      icon: "🏫",
      color: "from-emerald-500 to-teal-600"
    }
  ],

  vocabularies: [
    // 1. Alat Tulis & Peralatan Sekolah (7 kosakata)
    {
      id: "at_1",
      arabic: "دَفْتَرٌ",
      latin: "Daftarun",
      meaning: "Buku Tulis",
      category: "alat_tulis",
      emoji: "📓",
      letters: ["دَ", "فْ", "تَ", "رٌ"],
      example: "فِي حَقِيبَتِي دَفْتَرٌ",
      example_trans: "Di dalam tas saya ada buku tulis.",
      audio_text: "دَفْتَرٌ"
    },
    {
      id: "at_2",
      arabic: "قَلَمٌ",
      latin: "Qalamun",
      meaning: "Pena / Pulpen",
      category: "alat_tulis",
      emoji: "🖊️",
      letters: ["قَ", "لَ", "مٌ"],
      example: "هٰذَا قَلَمٌ جَدِيدٌ",
      example_trans: "Ini pulpen baru.",
      audio_text: "قَلَمٌ"
    },
    {
      id: "at_3",
      arabic: "قَلَمُ الرَّصَاصِ",
      latin: "Qalamu Rasaasin",
      meaning: "Pensil",
      category: "alat_tulis",
      emoji: "✏️",
      letters: ["قَ", "لَ", "مُ", "ا", "ل", "رَّ", "صَ", "ا", "صِ"],
      example: "أَكْتُبُ بِقَلَمِ الرَّصَاصِ",
      example_trans: "Saya menulis dengan pensil.",
      audio_text: "قَلَمُ الرَّصَاصِ"
    },
    {
      id: "at_4",
      arabic: "مِسْطَرَةٌ",
      latin: "Mistaratuun",
      meaning: "Penggaris",
      category: "alat_tulis",
      emoji: "📏",
      letters: ["مِ", "سْ", "طَ", "رَ", "ةٌ"],
      example: "الْمِسْطَرَةُ طَوِيلَةٌ",
      example_trans: "Penggaris itu panjang.",
      audio_text: "مِسْطَرَةٌ"
    },
    {
      id: "at_5",
      arabic: "مِمْحَاةٌ",
      latin: "Mimhaatun",
      meaning: "Penghapus",
      category: "alat_tulis",
      emoji: "🧹",
      letters: ["مِ", "مْ", "حَ", "ا", "ةٌ"],
      example: "هٰذِهِ مِمْحَاةٌ بَيْضَاءُ",
      example_trans: "Ini penghapus putih.",
      audio_text: "مِمْحَاةٌ"
    },
    {
      id: "at_6",
      arabic: "مِقَصٌّ",
      latin: "Miqassun",
      meaning: "Gunting",
      category: "alat_tulis",
      emoji: "✂️",
      letters: ["مِ", "قَ", "صٌّ"],
      example: "هٰذَا مِقَصٌّ حَادٌّ",
      example_trans: "Ini gunting yang tajam.",
      audio_text: "مِقَصٌّ"
    },
    {
      id: "at_7",
      arabic: "حَقِيبَةٌ",
      latin: "Haqiibatun",
      meaning: "Tas",
      category: "alat_tulis",
      emoji: "🎒",
      letters: ["حَ", "قِ", "ي", "بَ", "ةٌ"],
      example: "حَقِيبَتِي جَمِيلَةٌ",
      example_trans: "Tas saya bagus/indah.",
      audio_text: "حَقِيبَةٌ"
    },

    // 2. Di Dalam Kelas (15 kosakata)
    {
      id: "bk_1",
      arabic: "سَاعَةٌ",
      latin: "Saa'atun",
      meaning: "Jam",
      category: "benda_kelas",
      emoji: "⏰",
      letters: ["سَ", "ا", "عَ", "ةٌ"],
      example: "عَلَى الْجِدَارِ سَاعَةٌ",
      example_trans: "Di dinding ada jam.",
      audio_text: "سَاعَةٌ"
    },
    {
      id: "bk_2",
      arabic: "مِرْوَحَةٌ",
      latin: "Mirwahatun",
      meaning: "Kipas Angin",
      category: "benda_kelas",
      emoji: "🌀",
      letters: ["مِ", "رْ", "وَ", "حَ", "ةٌ"],
      example: "فِي الْفَصْلِ مِرْوَحَةٌ",
      example_trans: "Di dalam kelas ada kipas angin.",
      audio_text: "مِرْوَحَةٌ"
    },
    {
      id: "bk_3",
      arabic: "بَابٌ",
      latin: "Baabun",
      meaning: "Pintu",
      category: "benda_kelas",
      emoji: "🚪",
      letters: ["بَ", "ا", "بٌ"],
      example: "هٰذَا بَابُ الْفَصْلِ",
      example_trans: "Ini pintu kelas.",
      audio_text: "بَابٌ"
    },
    {
      id: "bk_4",
      arabic: "سَبُّوْرَةٌ",
      latin: "Sabbuuratun",
      meaning: "Papan Tulis",
      category: "benda_kelas",
      emoji: "📋",
      letters: ["سَ", "بُّ", "و", "رَ", "ةٌ"],
      example: "السَّبُّورَةُ أَمَامَ التَّلَامِيذِ",
      example_trans: "Papan tulis ada di depan murid-murid.",
      audio_text: "سَبُّوْرَةٌ"
    },
    {
      id: "bk_5",
      arabic: "خِزَانَةٌ",
      latin: "Khizaanatun",
      meaning: "Lemari",
      category: "benda_kelas",
      emoji: "🗄️",
      letters: ["خِ", "زَ", "ا", "نَ", "ةٌ"],
      example: "هٰذِهِ خِزَانَةُ الْكُتُبِ",
      example_trans: "Ini lemari buku.",
      audio_text: "خِزَانَةٌ"
    },
    {
      id: "bk_6",
      arabic: "مَكْتَبٌ",
      latin: "Maktabun",
      meaning: "Meja",
      category: "benda_kelas",
      emoji: "🪑",
      letters: ["مَ", "كْ", "تَ", "بٌ"],
      example: "عَلَى الْمَكْتَبِ كِتَابٌ",
      example_trans: "Di atas meja ada buku.",
      audio_text: "مَكْتَبٌ"
    },
    {
      id: "bk_7",
      arabic: "كُرْسِيٌّ",
      latin: "Kursiyyun",
      meaning: "Kursi",
      category: "benda_kelas",
      emoji: "🪑",
      letters: ["كُ", "رْ", "سِ", "يٌّ"],
      example: "أَجْلِسُ عَلَى الْكُرْسِيِّ",
      example_trans: "Saya duduk di atas kursi.",
      audio_text: "كُرْسِيٌّ"
    },
    {
      id: "bk_8",
      arabic: "نَافِذَةٌ",
      latin: "Naafizatun",
      meaning: "Jendela",
      category: "benda_kelas",
      emoji: "🪟",
      letters: ["نَ", "ا", "فِ", "ذَ", "ةٌ"],
      example: "النَّافِذَةُ مَفْتُوحَةٌ",
      example_trans: "Jendela itu terbuka.",
      audio_text: "نَافِذَةٌ"
    },
    {
      id: "bk_9",
      arabic: "مِصْبَاحٌ",
      latin: "Misbaahun",
      meaning: "Lampu",
      category: "benda_kelas",
      emoji: "💡",
      letters: ["مِ", "صْ", "بَ", "ا", "حٌ"],
      example: "الْمِصْبَاحُ مُنِيرٌ",
      example_trans: "Lampu itu menyala terang.",
      audio_text: "مِصْبَاحٌ"
    },
    {
      id: "bk_10",
      arabic: "جِدَارٌ",
      latin: "Jidaarun",
      meaning: "Tembok / Dinding",
      category: "benda_kelas",
      emoji: "🧱",
      letters: ["جِ", "دَ", "ا", "رٌ"],
      example: "عَلَى الْجِدَارِ سَاعَةٌ",
      example_trans: "Di tembok ada jam.",
      audio_text: "جِدَارٌ"
    },
    {
      id: "bk_11",
      arabic: "بِلَاطٌ",
      latin: "Bilaatun",
      meaning: "Lantai",
      category: "benda_kelas",
      emoji: "⬜",
      letters: ["بِ", "لَ", "ا", "طٌ"],
      example: "الْبِلَاطُ نَظِيفٌ",
      example_trans: "Lantai itu bersih.",
      audio_text: "بِلَاطٌ"
    },
    {
      id: "bk_12",
      arabic: "زُجَاجٌ",
      latin: "Zujaajun",
      meaning: "Kaca",
      category: "benda_kelas",
      emoji: "🪞",
      letters: ["زُ", "جَ", "ا", "جٌ"],
      example: "زُجَاجُ النَّافِذَةِ نَظِيفٌ",
      example_trans: "Kaca jendela itu bersih.",
      audio_text: "زُجَاجٌ"
    },
    {
      id: "bk_13",
      arabic: "رَفٌّ",
      latin: "Raffun",
      meaning: "Rak",
      category: "benda_kelas",
      emoji: "📚",
      letters: ["رَ", "فٌّ"],
      example: "الْكُتُبُ عَلَى الرَّفِّ",
      example_trans: "Buku-buku ada di atas rak.",
      audio_text: "رَفٌّ"
    },
    {
      id: "bk_14",
      arabic: "مِكْنَسَةٌ",
      latin: "Miknasatun",
      meaning: "Sapu",
      category: "benda_kelas",
      emoji: "🧹",
      letters: ["مِ", "كْ", "نَ", "سَ", "ةٌ"],
      example: "الْمِكْنَسَةُ وَرَاءَ الْبَابِ",
      example_trans: "Sapu ada di belakang pintu.",
      audio_text: "مِكْنَسَةٌ"
    },
    {
      id: "bk_15",
      arabic: "مَزْبَلَةٌ",
      latin: "Mazbalatun",
      meaning: "Tempat Sampah",
      category: "benda_kelas",
      emoji: "🗑️",
      letters: ["مَ", "زْ", "بَ", "لَ", "ةٌ"],
      example: "الْمَزْبَلَةُ فِي جَانِبِ الْفَصْلِ",
      example_trans: "Tempat sampah ada di samping kelas.",
      audio_text: "مَزْبَلَةٌ"
    }
  ],

  // Teks Cerita Sesuai Bahan Bacaan & Kisi-Kisi
  reading_materials: [
    {
      id: "story_1",
      title_ar: "فِي فَصْلِيْ",
      title_id: "Di Kelas Saya",
      subtitle: "Bahan Bacaan Utama Asesmen Tengah Semester",
      paragraphs: [
        {
          sentence_ar: "هٰذَا فَصْلِيْ. فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ.",
          transliteration: "Haadzaa faslii. Fil-fasli maktabun wa kursiyyun wa sabbuuratun.",
          meaning: "Ini kelas saya. Di dalam kelas ada meja, kursi, dan papan tulis.",
          words: [
            { ar: "هٰذَا", id: "Ini (mudzakkar)" },
            { ar: "فَصْلِيْ", id: "Kelas saya" },
            { ar: "فِي", id: "Di dalam" },
            { ar: "الْفَصْلِ", id: "Kelas" },
            { ar: "مَكْتَبٌ", id: "Meja", type: "benda_kelas" },
            { ar: "وَ", id: "dan" },
            { ar: "كُرْسِيٌّ", id: "Kursi", type: "benda_kelas" },
            { ar: "وَ", id: "dan" },
            { ar: "سَبُّوْرَةٌ", id: "Papan tulis", type: "benda_kelas" }
          ],
          items_found: ["Meja (مَكْتَبٌ)", "Kursi (كُرْسِيٌّ)", "Papan Tulis (سَبُّوْرَةٌ)"]
        },
        {
          sentence_ar: "عَلَى الْجِدَارِ سَاعَةٌ وَمِصْبَاحٌ.",
          transliteration: "'Alal-jidaari saa'atun wa misbaahun.",
          meaning: "Di dinding ada jam dan lampu.",
          words: [
            { ar: "عَلَى", id: "Di atas / pada" },
            { ar: "الْجِدَارِ", id: "Dinding / tembok", type: "benda_kelas" },
            { ar: "سَاعَةٌ", id: "Jam", type: "benda_kelas" },
            { ar: "وَ", id: "dan" },
            { ar: "مِصْبَاحٌ", id: "Lampu", type: "benda_kelas" }
          ],
          items_found: ["Jam (سَاعَةٌ)", "Lampu (مِصْبَاحٌ)", "Dinding (جِدَارٌ)"]
        },
        {
          sentence_ar: "فِيْ حَقِيْبَتِيْ دَفْتَرٌ وَقَلَمٌ وَقَلَمُ الرَّصَاصِ وَمِسْطَرَةٌ.",
          transliteration: "Fii haqiibatii daftarun wa qalamun wa qalamu rasaasin wa mistaratun.",
          meaning: "Di dalam tas saya ada buku tulis, pulpen, pensil, dan penggaris.",
          words: [
            { ar: "فِيْ", id: "Di dalam" },
            { ar: "حَقِيْبَتِيْ", id: "Tas saya", type: "alat_tulis" },
            { ar: "دَفْتَرٌ", id: "Buku tulis", type: "alat_tulis" },
            { ar: "وَ", id: "dan" },
            { ar: "قَلَمٌ", id: "Pena / pulpen", type: "alat_tulis" },
            { ar: "وَ", id: "dan" },
            { ar: "قَلَمُ الرَّصَاصِ", id: "Pensil", type: "alat_tulis" },
            { ar: "وَ", id: "dan" },
            { ar: "مِسْطَرَةٌ", id: "Penggaris", type: "alat_tulis" }
          ],
          items_found: ["Buku Tulis (دَفْتَرٌ)", "Pulpen (قَلَمٌ)", "Pensil (قَلَمُ الرَّصَاصِ)", "Penggaris (مِسْطَرَةٌ)", "Tas (حَقِيبَةٌ)"]
        }
      ]
    },
    {
      id: "story_2",
      title_ar: "فِي يَوْمِ النَّظَافَةِ",
      title_id: "Pada Hari Kebersihan Kelas (Latihan Cerita Tambahan)",
      subtitle: "Melatih kepekaan membaca benda-benda kebersihan di kelas",
      paragraphs: [
        {
          sentence_ar: "الْفَصْلُ نَظِيفٌ جِدًّا. فِي الْفَصْلِ مِكْنَسَةٌ وَمَزْبَلَةٌ.",
          transliteration: "Al-faslu nadhiifun jiddan. Fil-fasli miknasatun wa mazbalatun.",
          meaning: "Kelas sangat bersih. Di dalam kelas ada sapu dan tempat sampah.",
          words: [
            { ar: "الْفَصْلُ", id: "Kelas" },
            { ar: "نَظِيفٌ", id: "Bersih" },
            { ar: "مِكْنَسَةٌ", id: "Sapu", type: "benda_kelas" },
            { ar: "مَزْبَلَةٌ", id: "Tempat sampah", type: "benda_kelas" }
          ],
          items_found: ["Sapu (مِكْنَسَةٌ)", "Tempat Sampah (مَزْبَلَةٌ)"]
        },
        {
          sentence_ar: "عَلَى الرَّفِّ كُتُبٌ، وَالزُّجَاجُ صَافٍ.",
          transliteration: "'Alar-raffi kutubun, waz-zujaaju saafin.",
          meaning: "Di atas rak ada buku-buku, dan kaca jendela tampak bening.",
          words: [
            { ar: "عَلَى", id: "Di atas" },
            { ar: "الرَّفِّ", id: "Rak", type: "benda_kelas" },
            { ar: "الزُّجَاجُ", id: "Kaca", type: "benda_kelas" }
          ],
          items_found: ["Rak (رَفٌّ)", "Kaca (زُجَاجٌ)"]
        }
      ]
    }
  ],

  // Bank Soal Komprehensif (37 Butir Soal)
  question_bank: [
    // --- KELOMPOK 1: SOAL PEMAHAMAN TEKS CERITA (Sesuai Kisi-Kisi Asesmen SD / MI) ---
    {
      id: "tc_1",
      type: "teks_cerita",
      category: "Pemahaman Teks Cerita",
      story_ref: "story_1",
      story_snippet: "هٰذَا فَصْلِيْ. فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ.",
      question: "Berdasarkan kutipan teks di atas, benda apa sajakah yang ada di dalam kelas?",
      options: [
        "Meja, kursi, dan papan tulis",
        "Jam, lampu, dan dinding",
        "Buku tulis, pulpen, dan penggaris",
        "Sapu, kaca, dan tempat sampah"
      ],
      correct_answer: 0,
      arabic_answer: "مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ",
      explanation: "Pada teks tertulis: فِي الْفَصْلِ مَكْتَبٌ (meja) وَكُرْسِيٌّ (kursi) وَسَبُّوْرَةٌ (papan tulis)."
    },
    {
      id: "tc_2",
      type: "teks_cerita",
      category: "Pemahaman Teks Cerita",
      story_ref: "story_1",
      story_snippet: "عَلَى الْجِدَارِ سَاعَةٌ وَمِصْبَاحٌ.",
      question: "Benda apa yang menempel atau berada di atas dinding (عَلَى الْجِدَارِ) menurut teks?",
      options: [
        "Papan tulis dan kipas angin",
        "Jam dan lampu",
        "Rak buku dan jendela",
        "Penggaris dan penghapus"
      ],
      correct_answer: 1,
      arabic_answer: "سَاعَةٌ وَمِصْبَاحٌ",
      explanation: "Teks menyebutkan 'عَلَى الْجِدَارِ سَاعَةٌ (jam) وَمِصْبَاحٌ (lampu)'."
    },
    {
      id: "tc_3",
      type: "teks_cerita",
      category: "Pemahaman Teks Cerita",
      story_ref: "story_1",
      story_snippet: "فِيْ حَقِيْبَتِيْ دَفْتَرٌ وَقَلَمٌ وَقَلَمُ الرَّصَاصِ وَمِسْطَرَةٌ.",
      question: "Sebutkan 4 alat tulis yang ada di dalam tas (حَقِيْبَتِيْ) pada teks tersebut!",
      options: [
        "Meja, kursi, papan tulis, jam",
        "Gunting, penghapus, lemari, sapu",
        "Buku tulis, pulpen, pensil, dan penggaris",
        "Buku tulis, jangka, lem, peraut"
      ],
      correct_answer: 2,
      arabic_answer: "دَفْتَرٌ وَقَلَمٌ وَقَلَمُ الرَّصَاصِ وَمِسْطَرَةٌ",
      explanation: "Di dalam tas ada: دَفْتَرٌ (buku tulis), قَلَمٌ (pulpen), قَلَمُ الرَّصَاصِ (pensil), dan مِسْطَرَةٌ (penggaris)."
    },
    {
      id: "tc_4",
      type: "teks_cerita",
      category: "Pemahaman Teks Cerita",
      story_ref: "story_1",
      story_snippet: "فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ.",
      question: "Apakah 'قَلَمٌ' (pulpen) ada di dalam teks kalimat pertama tentang isi kelas?",
      options: [
        "Benar, ada di kalimat pertama",
        "Salah, pulpen ada di dalam tas (حَقِيْبَتِيْ)",
        "Salah, pulpen ada di atas meja",
        "Benar, bersama papan tulis"
      ],
      correct_answer: 1,
      arabic_answer: "الْقَلَمُ فِي الْحَقِيبَةِ",
      explanation: "Pulpen (قَلَمٌ) disebutkan ada di dalam tas (فِيْ حَقِيْبَتِيْ), bukan di deskripsi umum ruangan kelas."
    },
    {
      id: "tc_5",
      type: "teks_cerita",
      category: "Pemahaman Teks Cerita",
      story_ref: "story_1",
      story_snippet: "هٰذَا فَصْلِيْ. فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ.",
      question: "Apa arti dari kalimat 'هٰذَا فَصْلِيْ'?",
      options: [
        "Ini sekolah saya",
        "Ini tas saya",
        "Ini kelas saya",
        "Ini rumah saya"
      ],
      correct_answer: 2,
      arabic_answer: "Ini kelas saya",
      explanation: "هٰذَا (Ini) فَصْلِيْ (kelas saya, dari kata faslun + ya' mutakallim)."
    },

    // --- KELOMPOK 2: MAHARATUL KITABAH (MENYAMBUNG HURUF HIJAIYAH) ---
    {
      id: "mk_1",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut menjadi kata yang benar: دَ - فْ - تَ - رٌ",
      options: ["دَفْتَرٌ", "فَدْتَرٌ", "دَفْتَارٌ", "دَفْرَتٌ"],
      correct_answer: 0,
      target_word: "دَفْتَرٌ",
      letters: ["دَ", "فْ", "تَ", "رٌ"],
      meaning: "Buku Tulis",
      explanation: "Huruf د tidak bisa disambung ke depan dengan ف, sedangkan ف bersambung ke ت lalu ke ر menjadi دَفْتَرٌ (Buku Tulis)."
    },
    {
      id: "mk_2",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut menjadi kata yang benar: قَ - لَ - مٌ",
      options: ["قَلِمٌ", "قَلَمٌ", "لَقَمٌ", "قَمَلٌ"],
      correct_answer: 1,
      target_word: "قَلَمٌ",
      letters: ["قَ", "لَ", "مٌ"],
      meaning: "Pena / Pulpen",
      explanation: "Huruf ق, ل, dan م bersambung secara berurutan menjadi قَلَمٌ (Pena / Pulpen)."
    },
    {
      id: "mk_3",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut: مِ - سْ - طَ - رَ - ةٌ",
      options: ["مِسْطَارَةٌ", "مَسْطَرَةٌ", "مِسْطَرَةٌ", "مِسْتَرَةٌ"],
      correct_answer: 2,
      target_word: "مِسْطَرَةٌ",
      letters: ["مِ", "سْ", "طَ", "رَ", "ةٌ"],
      meaning: "Penggaris",
      explanation: "Huruf م, س, ط bersambung, lalu ر (tidak bisa menyambung ke ة) sehingga ta' marbuthah berdiri sendiri: مِسْطَرَةٌ."
    },
    {
      id: "mk_4",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut: حَ - قِ - ي - بَ - ةٌ",
      options: ["حَقِبَةٌ", "حَقِيبَةٌ", "حَكِيبَةٌ", "حَقِيبَاتٌ"],
      correct_answer: 1,
      target_word: "حَقِيبَةٌ",
      letters: ["حَ", "قِ", "ي", "بَ", "ةٌ"],
      meaning: "Tas",
      explanation: "Semua huruf ح, ق, ي, ب, dan ة dapat saling bersambung secara teratur membentuk kata حَقِيبَةٌ (Tas)."
    },
    {
      id: "mk_5",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut: مَ - كْ - تَ - بٌ",
      options: ["مَكْتَابٌ", "مَكْبَتٌ", "مَتْكَبٌ", "مَكْتَبٌ"],
      correct_answer: 3,
      target_word: "مَكْتَبٌ",
      letters: ["مَ", "كْ", "تَ", "بٌ"],
      meaning: "Meja",
      explanation: "Huruf م, ك, ت, dan ب bersambung menjadi مَكْتَبٌ (Meja)."
    },
    {
      id: "mk_6",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut: كُ - رْ - سِ - يٌّ",
      options: ["كُرْسِي", "كُرِسِيٌّ", "كُرْسِيٌّ", "كَرْسِيٌّ"],
      correct_answer: 2,
      target_word: "كُرْسِيٌّ",
      letters: ["كُ", "رْ", "سِ", "يٌّ"],
      meaning: "Kursi",
      explanation: "Huruf ك bersambung ke ر, huruf ر tidak bersambung ke س, lalu س bersambung ke يّ bertasydid menjadi كُرْسِيٌّ."
    },
    {
      id: "mk_7",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut: سَ - بّ - و - رَ - ةٌ",
      options: ["سَبُوْرَةٌ", "سَبُّوْرَةٌ", "سَبُوْرَاتٌ", "صَبُّوْرَةٌ"],
      correct_answer: 1,
      target_word: "سَبُّوْرَةٌ",
      letters: ["سَ", "بّ", "و", "رَ", "ةٌ"],
      meaning: "Papan Tulis",
      explanation: "س disambung ke ب bertasydid, lalu و, kemudian ر dan ة membentuk سَبُّوْرَةٌ."
    },
    {
      id: "mk_8",
      type: "sambung_huruf",
      category: "Maharatul Kitabah (Menyambung Huruf)",
      question: "Sambunglah huruf-huruf hijaiyah berikut: مِ - صْ - بَ - ا - حٌ",
      options: ["مِسْبَاحٌ", "مَصْبَاحٌ", "مِصْبَحٌ", "مِصْبَاحٌ"],
      correct_answer: 3,
      target_word: "مِصْبَاحٌ",
      letters: ["مِ", "صْ", "بَ", "ا", "حٌ"],
      meaning: "Lampu",
      explanation: "م bersambung ke ص lalu ke ب dan mad alif ا, huruf ح ditulis terpisah di akhir: مِصْبَاحٌ."
    },

    // --- KELOMPOK 3: IKMALUL HURUF (MELENGKAPI HURUF RUMPANG) ---
    {
      id: "ih_1",
      type: "ikmal_huruf",
      category: "Maharatul Kitabah (Lengkapi Huruf)",
      question: "Lengkapilah huruf yang hilang pada kata 'Penghapus': مِـ [...] ـحَاةٌ",
      options: ["مْ", "سْ", "كْ", "نْ"],
      correct_answer: 0,
      full_word: "مِمْحَاةٌ",
      meaning: "Penghapus",
      explanation: "Penghapus dalam bahasa Arab adalah مِمْحَاةٌ (Mimhaatun), huruf yang hilang adalah مْ (mim sukun)."
    },
    {
      id: "ih_2",
      type: "ikmal_huruf",
      category: "Maharatul Kitabah (Lengkapi Huruf)",
      question: "Lengkapilah huruf yang hilang pada kata 'Gunting': مِـ [...] ـصٌّ",
      options: ["كُ", "قَ", "جَ", "فَ"],
      correct_answer: 1,
      full_word: "مِقَصٌّ",
      meaning: "Gunting",
      explanation: "Gunting adalah مِقَصٌّ (Miqassun), huruf yang hilang adalah قَ (qaf fathah)."
    },
    {
      id: "ih_3",
      type: "ikmal_huruf",
      category: "Maharatul Kitabah (Lengkapi Huruf)",
      question: "Lengkapilah huruf yang hilang pada kata 'Kipas Angin': مِـ [...] ـوَحَةٌ",
      options: ["لْ", "نْ", "رْ", "دْ"],
      correct_answer: 2,
      full_word: "مِرْوَحَةٌ",
      meaning: "Kipas Angin",
      explanation: "Kipas angin adalah مِرْوَحَةٌ (Mirwahatun), huruf yang hilang adalah رْ (ra' sukun)."
    },
    {
      id: "ih_4",
      type: "ikmal_huruf",
      category: "Maharatul Kitabah (Lengkapi Huruf)",
      question: "Lengkapilah huruf yang hilang pada kata 'Pintu': بَـ [...] ـبٌ",
      options: ["و", "ي", "ن", "ا"],
      correct_answer: 3,
      full_word: "بَابٌ",
      meaning: "Pintu",
      explanation: "Pintu adalah بَابٌ (Baabun), huruf mad yang hilang adalah ا (alif)."
    },
    {
      id: "ih_5",
      type: "ikmal_huruf",
      category: "Maharatul Kitabah (Lengkapi Huruf)",
      question: "Lengkapilah huruf yang hilang pada kata 'Sapu': مِـ [...] ـنَسَةٌ",
      options: ["قْ", "كْ", "سْ", "لْ"],
      correct_answer: 1,
      full_word: "مِكْنَسَةٌ",
      meaning: "Sapu",
      explanation: "Sapu dalam bahasa Arab adalah مِكْنَسَةٌ (Miknasatun), huruf yang hilang adalah كْ (kaf sukun)."
    },
    {
      id: "ih_6",
      type: "ikmal_huruf",
      category: "Maharatul Kitabah (Lengkapi Huruf)",
      question: "Lengkapilah huruf yang hilang pada kata 'Lemari': خِـ [...] ـانَةٌ",
      options: ["جَ", "رَ", "زَ", "دَ"],
      correct_answer: 2,
      full_word: "خِزَانَةٌ",
      meaning: "Lemari",
      explanation: "Lemari adalah خِزَانَةٌ (Khizaanatun), huruf yang hilang adalah زَ (zai fathah)."
    },

    // --- KELOMPOK 4: PILIHAN GANDA KOSAKATA & TEBAK ARTI ---
    {
      id: "pg_1",
      type: "pilihan_ganda",
      category: "Kosakata Alat Tulis",
      question: "Apakah arti dari kata 'قَلَمُ الرَّصَاصِ' (Qalamu Rasaasin)?",
      options: ["Pulpen tinta", "Pensil", "Penghapus", "Penggaris"],
      correct_answer: 1,
      arabic_word: "قَلَمُ الرَّصَاصِ",
      explanation: "قَلَمُ الرَّصَاصِ artinya adalah Pensil. Sedangkan pulpen adalah قَلَمٌ."
    },
    {
      id: "pg_2",
      type: "pilihan_ganda",
      category: "Kosakata Alat Tulis",
      question: "Bahasa Arab dari 'Buku Tulis' adalah...",
      options: ["دَفْتَرٌ", "كِتَابٌ", "مِسْطَرَةٌ", "مِمْحَاةٌ"],
      correct_answer: 0,
      arabic_word: "دَفْتَرٌ",
      explanation: "Buku tulis adalah دَفْتَرٌ (Daftarun)."
    },
    {
      id: "pg_3",
      type: "pilihan_ganda",
      category: "Kosakata Alat Tulis",
      question: "Benda apakah yang ditunjukkan dengan kata 'مِمْحَاةٌ'?",
      options: ["Penggaris", "Gunting", "Penghapus", "Kotak Pensil"],
      correct_answer: 2,
      arabic_word: "مِمْحَاةٌ",
      explanation: "مِمْحَاةٌ (Mimhaatun) artinya adalah Penghapus."
    },
    {
      id: "pg_4",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Apakah arti dari kata 'سَاعَةٌ' (Saa'atun)?",
      options: ["Lonceng", "Jam", "Lampu", "Kaca"],
      correct_answer: 1,
      arabic_word: "سَاعَةٌ",
      explanation: "سَاعَةٌ artinya adalah Jam."
    },
    {
      id: "pg_5",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Bahasa Arab dari 'Kipas Angin' adalah...",
      options: ["مِكْنَسَةٌ", "مِرْوَحَةٌ", "مِصْبَاحٌ", "نَافِذَةٌ"],
      correct_answer: 1,
      arabic_word: "مِرْوَحَةٌ",
      explanation: "Kipas angin adalah مِرْوَحَةٌ (Mirwahatun)."
    },
    {
      id: "pg_6",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Apakah arti dari kata 'نَافِذَةٌ' (Naafizatun)?",
      options: ["Pintu", "Jendela", "Dinding", "Lantai"],
      correct_answer: 1,
      arabic_word: "نَافِذَةٌ",
      explanation: "نَافِذَةٌ artinya adalah Jendela. Pintu adalah بَابٌ."
    },
    {
      id: "pg_7",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Kata 'جِدَارٌ' (Jidaarun) memiliki arti...",
      options: ["Lantai", "Tembok / Dinding", "Atap", "Pintu"],
      correct_answer: 1,
      arabic_word: "جِدَارٌ",
      explanation: "جِدَارٌ (Jidaarun) artinya Tembok atau Dinding."
    },
    {
      id: "pg_8",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Bahasa Arab dari 'Lantai' adalah...",
      options: ["بِلَاطٌ", "جِدَارٌ", "زُجَاجٌ", "رَفٌّ"],
      correct_answer: 0,
      arabic_word: "بِلَاطٌ",
      explanation: "Lantai adalah بِلَاطٌ (Bilaatun)."
    },
    {
      id: "pg_9",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Benda di kelas yang digunakan untuk membuang kotoran adalah 'مَزْبَلَةٌ', apa artinya?",
      options: ["Sapu", "Tempat Sampah", "Kain Pel", "Ember"],
      correct_answer: 1,
      arabic_word: "مَزْبَلَةٌ",
      explanation: "مَزْبَلَةٌ (Mazbalatun) artinya adalah Tempat Sampah."
    },
    {
      id: "pg_10",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Kata 'زُجَاجٌ' (Zujaajun) artinya adalah...",
      options: ["Kaca", "Papan", "Batu", "Besi"],
      correct_answer: 0,
      arabic_word: "زُجَاجٌ",
      explanation: "زُجَاجٌ (Zujaajun) artinya Kaca."
    },
    {
      id: "pg_11",
      type: "pilihan_ganda",
      category: "Kosakata Benda Kelas",
      question: "Tempat meletakkan buku-buku di dinding atau pojok kelas bernama 'رَفٌّ', apa artinya?",
      options: ["Meja", "Rak", "Lemari", "Laci"],
      correct_answer: 1,
      arabic_word: "رَفٌّ",
      explanation: "رَفٌّ (Raffun) artinya Rak."
    },
    {
      id: "pg_12",
      type: "pilihan_ganda",
      category: "Klasifikasi Kosakata",
      question: "Di bawah ini manakah yang termasuk kelompok ALAT TULIS (الأَدَوَاتُ الْمَكْتَبِيَّةُ)?",
      options: ["مَكْتَبٌ", "سَبُّوْرَةٌ", "مِسْطَرَةٌ", "بَابٌ"],
      correct_answer: 2,
      arabic_word: "مِسْطَرَةٌ",
      explanation: "مِسْطَرَةٌ (penggaris) adalah alat tulis, sedangkan meja, papan tulis, dan pintu adalah perabot/benda kelas."
    },
    {
      id: "pg_13",
      type: "pilihan_ganda",
      category: "Klasifikasi Kosakata",
      question: "Di bawah ini manakah yang termasuk BENDA DI KELAS (فِي الْفَصْلِ)?",
      options: ["دَفْتَرٌ", "قَلَمُ الرَّصَاصِ", "مِمْحَاةٌ", "خِزَانَةٌ"],
      correct_answer: 3,
      arabic_word: "خِزَانَةٌ",
      explanation: "خِزَانَةٌ (lemari) adalah benda kelas, sedangkan buku tulis, pensil, dan penghapus adalah alat tulis."
    },
    {
      id: "pg_14",
      type: "pilihan_ganda",
      category: "Kosakata Alat Tulis",
      question: "Peralatan yang digunakan untuk memotong kertas adalah 'مِقَصٌّ', apa artinya?",
      options: ["Gunting", "Pisau", "Pena", "Penggaris"],
      correct_answer: 0,
      arabic_word: "مِقَصٌّ",
      explanation: "مِقَصٌّ (Miqassun) artinya Gunting."
    },
    {
      id: "pg_15",
      type: "pilihan_ganda",
      category: "Kosakata Alat Tulis",
      question: "Wadah untuk membawa buku dan peralatan sekolah adalah 'حَقِيبَةٌ', apa artinya?",
      options: ["Kotak pensil", "Tas", "Saku", "Sepatu"],
      correct_answer: 1,
      arabic_word: "حَقِيبَةٌ",
      explanation: "حَقِيبَةٌ (Haqiibatun) artinya Tas."
    },

    // --- KELOMPOK 5: MENULIS / MAHARATUL KITABAH (PILIH TULISAN ARAB YANG TEPAT) ---
    {
      id: "tw_1",
      type: "terjemah_tulis",
      category: "Maharatul Kitabah (Penulisan)",
      question: "Bagaimanakah penulisan bahasa Arab yang berharakat tepat untuk kata 'Papan Tulis'?",
      options: ["سَبُّوْرَةٌ", "صَبُّوْرَةٌ", "سَبُوْرَةٌ", "سَبُّوْرَةٍ"],
      correct_answer: 0,
      explanation: "Penulisan yang benar adalah سَبُّوْرَةٌ (Sabbuuratun) dengan sin fathah, ba' dhommah bertasydid, wawu sukun, ra' fathah, dan ta' marbuthah tanwin dhommah."
    },
    {
      id: "tw_2",
      type: "terjemah_tulis",
      category: "Maharatul Kitabah (Penulisan)",
      question: "Bagaimanakah penulisan bahasa Arab yang benar untuk kata 'Lampu'?",
      options: ["مِسْبَاحٌ", "مِصْبَاحٌ", "مِصْبَحٌ", "مُصْبَاحٌ"],
      correct_answer: 1,
      explanation: "Penulisan yang benar adalah مِصْبَاحٌ (Misbaahun) menggunakan huruf shod (ص) bukan sin (س)."
    },
    {
      id: "tw_3",
      type: "terjemah_tulis",
      category: "Maharatul Kitabah (Penulisan)",
      question: "Bagaimanakah penulisan bahasa Arab yang benar untuk kata 'Meja'?",
      options: ["مَكْتَابٌ", "مَقْتَبٌ", "مَكْتَبٌ", "مَكْتِبٌ"],
      correct_answer: 2,
      explanation: "Penulisan yang benar adalah مَكْتَبٌ (Maktabun)."
    }
  ],

  // Soal Format Lembar Asesmen Resmi (Worksheet PDF Cetak)
  worksheet_sections: [
    {
      part: "Bagian I: Fahmul Maqru' (Membaca Teks Cerita)",
      instruction: "Bacalah teks cerita di bawah ini dengan seksama, kemudian jawablah pertanyaan-pertanyaan berikut dengan tepat!",
      story: `هٰذَا فَصْلِيْ. فِي الْفَصْلِ مَكْتَبٌ وَكُرْسِيٌّ وَسَبُّوْرَةٌ.
عَلَى الْجِدَارِ سَاعَةٌ وَمِصْبَاحٌ.
فِيْ حَقِيْبَتِيْ دَفْتَرٌ وَقَلَمٌ وَقَلَمُ الرَّصَاصِ وَمِسْطَرَةٌ.`,
      story_trans: `(Ini kelas saya. Di dalam kelas ada meja, kursi, dan papan tulis.
Di dinding ada jam dan lampu.
Di dalam tas saya ada buku tulis, pulpen, pensil, dan penggaris.)`,
      questions: [
        {
          num: 1,
          prompt: "Sebutkan 3 benda yang ada di dalam kelas sesuai dengan kalimat pertama teks di atas!",
          answer_guide: "مَكْتَبٌ (Meja), كُرْسِيٌّ (Kursi), dan سَبُّوْرَةٌ (Papan Tulis)",
          lines: 2
        },
        {
          num: 2,
          prompt: "Benda apa sajakah yang berada di atas dinding (عَلَى الْجِدَارِ)?",
          answer_guide: "سَاعَةٌ (Jam) dan مِصْبَاحٌ (Lampu)",
          lines: 2
        },
        {
          num: 3,
          prompt: "Sebutkan 4 alat tulis yang terdapat di dalam tas siswa (فِيْ حَقِيْبَتِيْ)!",
          answer_guide: "دَفْتَرٌ (Buku tulis), قَلَمٌ (Pulpen), قَلَمُ الرَّصَاصِ (Pensil), dan مِسْطَرَةٌ (Penggaris)",
          lines: 3
        },
        {
          num: 4,
          prompt: "Salinlah kalimat berikut dengan tulisan Arab yang rapi dan lengkap dengan harakatnya:\n«هٰذَا فَصْلِيْ»",
          answer_guide: "هٰذَا فَصْلِيْ",
          lines: 2
        }
      ]
    },
    {
      part: "Bagian II: Maharatul Kitabah (Menyambung Huruf)",
      instruction: "Sambunglah huruf-huruf hijaiyah berikut menjadi kata yang utuh dan benar!",
      items: [
        { num: 1, separated: "دَ - فْ - تَ - رٌ", word: "دَفْتَرٌ", meaning: "Buku Tulis" },
        { num: 2, separated: "قَ - لَ - مٌ", word: "قَلَمٌ", meaning: "Pena / Pulpen" },
        { num: 3, separated: "مِ - سْ - طَ - رَ - ةٌ", word: "مِسْطَرَةٌ", meaning: "Penggaris" },
        { num: 4, separated: "مَ - كْ - تَ - بٌ", word: "مَكْتَبٌ", meaning: "Meja" },
        { num: 5, separated: "كُ - رْ - سِ - يٌّ", word: "كُرْسِيٌّ", meaning: "Kursi" }
      ]
    },
    {
      part: "Bagian III: Klasifikasi Benda (Alat Tulis vs Benda di Kelas)",
      instruction: "Kelompokkan kosakata berikut ke dalam kolom yang sesuai (Alat Tulis atau Benda di Kelas)!",
      bank_items: ["سَبُّوْرَةٌ", "قَلَمُ الرَّصَاصِ", "مِمْحَاةٌ", "مِرْوَحَةٌ", "حَقِيبَةٌ", "خِزَانَةٌ", "مِقَصٌّ", "مِصْبَاحٌ"],
      answer_key: {
        alat_tulis: ["قَلَمُ الرَّصَاصِ", "مِمْحَاةٌ", "حَقِيبَةٌ", "مِقَصٌّ"],
        benda_kelas: ["سَبُّوْرَةٌ", "مِرْوَحَةٌ", "خِزَانَةٌ", "مِصْبَاحٌ"]
      }
    }
  ]
};

// Export ke global window dan module
if (typeof window !== "undefined") {
  window.ARABIC_DATA = ARABIC_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = ARABIC_DATA;
}
