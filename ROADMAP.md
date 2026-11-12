# Roadmap — bahasa-arab-kelas3

SPA statis vanilla (HTML/CSS/JS + Tailwind CDN + Lucide + Canvas + LocalStorage, tanpa build). Data tunggal `js/data.js` (±37KB): 22 kosakata (Arab berharakat + transliterasi + arti + contoh), cerita, puzzle, 37 soal 5 kategori. Logika `js/app.js` (`EXAM_CONFIG`: ATS 15 soal/30 mnt, Fisher–Yates), `js/canvas.js` papan Kitabah, `js/trend.js` tema. Validasi `tests/validate-data.js` via node tanpa install. Kunci jawaban di JS (ATS = simulasi, bukan ujian resmi). Demo: bahasa-arab-kelas3.vercel.app. Belum ada ROADMAP.md.

## Fase 1 — Review bahasa & data
- [ ] Review guru Arab: harakat 22 kosakata, `Mistaratuun`/`mistaratun`, konsistensi transliterasi di `js/data.js`
- [ ] Kunci blueprint ATS di `EXAM_CONFIG` (2 cerita, 3 sambung huruf, 2 lengkapi huruf, 5 PG, 3 kitabah)
- [ ] `node tests/validate-data.js` hijau: ID unik, metadata, kunci, shuffle deterministik, migrasi timer lama
- [ ] Pisahkan dengan jelas materi vs kunci di README (ATS simulasi saja)

## Fase 2 — Kitabah & pelafalan
- [ ] `js/canvas.js`: tinta berlapis, garis panduan, undo/hapus/ekspor gambar di HP touch
- [ ] Uji TTS Arab per browser/voice (`Chrome/Edge` prioritas, catat batas Safari/Firefox)
- [ ] Cerita interaktif dari `js/data.js` + tombol dengar/berhenti
- [ ] Latihan 37 soal 5 kategori: progres per kategori + ulangi kategori aktif

## Fase 3 — Ketahanan sesi & offline
- [ ] Timer absolut `startedAt`/`endsAt` di `arab3_exam_state`; reload/hidden-tab hitung dari `endsAt`
- [ ] Normalisasi sesi lama (`secondsRemaining`) ke skema `{version: 1}` tanpa crash
- [ ] Defensif 5 key (`arab3-theme`, `arab3_active_tab`, `arab3_quiz_filter`, `arab3_quiz_progress`, `arab3_exam_state`); JSON rusak diabaikan
- [ ] Rencana lepas CDN (Tailwind/Lucide/font/konfeti lokal) atau nyatakan butuh internet

## Fase 4 — Mobile & rilis
- [ ] Header muat 360px, bottom-nav, LKS cetak dari browser
- [ ] Reset Data hapus hanya key `arab3_*` setelah konfirmasi
- [ ] Smoke Vercel: materi → latihan → ATS 30 mnt → LKS cetak
- [ ] Tag `v1.0` setelah review guru + validator hijau
