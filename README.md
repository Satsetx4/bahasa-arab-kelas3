# Bahasa Arab Kelas 3

**Web App Materi Interaktif & Bank Soal** · Tahun Ajaran 2026/2027

Fokus pembelajaran: Maharatul Kitabah (menulis) dan Fahmul Maqru' (memahami teks), dengan tema alat tulis dan benda di dalam kelas.

[Buka demo](https://bahasa-arab-kelas3.vercel.app/)

## Fitur

- 22 kosakata dengan tulisan Arab berharakat, transliterasi, arti, contoh kalimat, dan pelafalan browser.
- Cerita interaktif yang mengambil materi dari `js/data.js`.
- Papan tulis Kitabah dengan tinta berlapis, contoh kata, garis panduan, undo, hapus, dan ekspor gambar.
- 37 soal latihan pada lima kategori, dengan progres tersimpan per kategori dan tombol untuk mengulang kategori aktif.
- Simulasi ATS 15 soal selama 30 menit, dengan distribusi kompetensi yang tetap pada setiap sesi.
- Lembar kerja yang dapat dicetak dari browser.

## Arsitektur

Aplikasi ini adalah SPA statis menggunakan HTML, CSS, JavaScript vanilla, Tailwind CDN, Lucide, Canvas API, dan LocalStorage. Tidak ada server aplikasi, akun, database, atau proses build. `js/data.js` menjadi sumber data kosakata, cerita, puzzle, dan bank soal; `js/app.js` menangani tampilan, navigasi, latihan, dan simulasi; `js/canvas.js` mengelola papan tulis; `js/trend.js` mengelola tema.

Kunci jawaban berada di JavaScript yang dikirim ke browser. Karena itu, ATS adalah simulasi/latihan dan tidak cocok diperlakukan sebagai ujian resmi yang harus dijaga kerahasiaannya.

## Menjalankan secara lokal

Cara yang disarankan adalah menyajikan folder ini melalui server berkas statis:

```powershell
python -m http.server 8000
```

Buka `http://localhost:8000/`. Python tidak diperlukan saat aplikasi telah di-host sebagai situs statis. Membuka `index.html` langsung juga dapat bekerja pada browser tertentu, tetapi server lokal lebih konsisten untuk penyimpanan browser dan pemuatan aset.

### Koneksi internet

Koneksi internet diperlukan untuk Tailwind CSS, ikon Lucide, font eksternal, dan animasi konfeti dari CDN. Versinya dipatok pada URL di `index.html`; aplikasi tidak menjanjikan mode offline penuh. Konten yang sudah dimuat dapat tetap tersedia selama tab masih terbuka, tetapi jangan mengandalkan aplikasi saat offline.

## Deploy statis

Folder repository dapat di-host langsung pada GitHub Pages atau layanan static hosting lain. Tidak ada langkah build. Pastikan `index.html`, `css/`, dan `js/` tetap berada pada path relatif yang sama. URL demo saat ini: [bahasa-arab-kelas3.vercel.app](https://bahasa-arab-kelas3.vercel.app/).

## Penyimpanan browser

Semua penyimpanan menggunakan key lokal berikut. Nilai bukan data akun dan tidak dikirim ke server.

| Key | Isi |
| --- | --- |
| `arab3-theme` | Tema `dark` atau `light`; dibaca sebelum halaman dirender untuk menghindari kilatan tema. |
| `arab3_active_tab` | ID tab aplikasi yang terakhir dibuka. |
| `arab3_quiz_filter` | Kategori bank soal yang terakhir dipilih. |
| `arab3_quiz_progress` | Jawaban latihan berdasarkan filter, dalam schema `{version: 1, answersByFilter: ...}`. |
| `arab3_exam_state` | Sesi ATS yang belum dikumpulkan: `{version: 1, startedAt, endsAt, questionIds, answers}`. |

Operasi storage ditangani secara defensif. Jika LocalStorage tidak tersedia, aplikasi masih dapat digunakan, tetapi progres tidak bertahan setelah tab ditutup. Data JSON yang rusak atau tidak cocok dengan bank soal diabaikan agar tidak menghentikan aplikasi.

Tombol **Reset Data / Mulai saka Awal** di footer menghapus progres dan preferensi aplikasi yang terdaftar di atas setelah konfirmasi. Saat aplikasi dibuka kembali, tab `materi` dan filter `all` disimpan lagi sebagai nilai awal; key milik situs lain pada origin yang sama tidak disentuh.

## Simulasi ATS

Konfigurasi tunggal di `EXAM_CONFIG` dalam `js/app.js` mengatur 15 soal dan durasi 30 menit. Setiap simulasi mengambil 2 soal pemahaman cerita, 3 sambung huruf, 2 lengkapi huruf, 5 pilihan ganda, dan 3 penulisan/kitabah. Fisher–Yates mengacak pemilihan dan urutan tanpa mengubah bank soal.

Timer memakai `startedAt` dan `endsAt` sebagai timestamp absolut. Saat reload atau kembali dari tab tersembunyi, sisa waktu dihitung dari `endsAt`; timer yang sudah habis langsung masuk ke proses hasil. Sesi lama yang menyimpan daftar soal dan `secondsRemaining`/`examSecondsRemaining` dibaca sebagai fallback dan dinormalisasi ke schema baru saat sesi dilanjutkan.

## Pemeriksaan data

Node.js diperlukan hanya untuk menjalankan validator data, tanpa instalasi paket:

```powershell
node tests/validate-data.js
```

Validator memeriksa jumlah item, ID unik, kelengkapan metadata jenis soal, kunci jawaban, komposisi blueprint, shuffle deterministik, dan migrasi sisa waktu lama.

## Browser yang disarankan

Gunakan versi terbaru Chrome atau Microsoft Edge untuk pengalaman yang paling konsisten pada dialog, pointer/touch drawing, dan Canvas. QA perubahan ini dijalankan pada Chromium dengan viewport emulasi. Safari, Firefox, perangkat fisik, dan ketersediaan suara Arab bergantung pada browser, sistem operasi, serta voice yang terpasang.

## Review bahasa

Isi materi dan kunci jawaban dipertahankan selama perbaikan teknis. Perbedaan transliterasi seperti `Mistaratuun`/`mistaratun` serta konsistensi harakat perlu ditinjau guru Bahasa Arab; aplikasi tidak menormalkan ejaan atau arti secara otomatis.
