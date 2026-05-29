# Modern MBG Calculator — Developer Guide

> Panduan lengkap setup, development, testing, dan deployment.

---

## Daftar Isi

1. [Struktur Project](#struktur-project)
2. [Quick Start](#quick-start)
3. [Setup Repository](#setup-repository)
4. [Menjalankan Lokal](#menjalankan-lokal)
5. [Cara Testing](#cara-testing)
6. [Struktur Kode](#struktur-kode)
7. [Konfigurasi](#konfigurasi)
8. [Export System](#export-system)
9. [i18n / Bahasa](#i18n--bahasa)
10. [Deploy ke GitHub Pages](#deploy-ke-github-pages)
11. [Deploy ke Vercel / Netlify](#deploy-ke-vercel--netlify)
12. [Update Data MBG](#update-data-mbg)
13. [Troubleshooting](#troubleshooting)

---

## Struktur Project

```
mbg-calculator/
├── index.html       ← HTML utama, semua struktur DOM
├── style.css        ← Design system, glassmorphism, animasi
├── app.js           ← Core engine: kalkulator, history, i18n, UI logic
├── export.js        ← Canvas export engine (PNG, preview)
├── i18n.js          ← Utilitas bahasa (ID/EN), formatter
├── config.json      ← Semua konstanta, data, konfigurasi
├── data.py          ← Script Python: validasi data, export, analisis
├── guide.md         ← File ini
└── README.md        ← Dokumentasi publik
```

**Tidak ada build step, tidak ada bundler, tidak ada framework.**
Murni HTML + CSS + vanilla JS. Buka browser, langsung jalan.

---

## Quick Start

```bash
# Clone repo
git clone https://github.com/USERNAME/mbg-calculator.git
cd mbg-calculator

# Jalankan lokal (pilih salah satu)
python3 -m http.server 8080
# atau
npx serve .
# atau
php -S localhost:8080

# Buka di browser
open http://localhost:8080
```

---

## Setup Repository

### Buat Repository Baru

```bash
# Inisialisasi Git
git init
git add .
git commit -m "feat: initial commit - Modern MBG Calculator"

# Buat repo di GitHub (tanpa README, tanpa .gitignore)
# Kemudian:
git remote add origin https://github.com/USERNAME/mbg-calculator.git
git branch -M main
git push -u origin main
```

### .gitignore yang Disarankan

Buat file `.gitignore`:

```
# Python
__pycache__/
*.pyc
*.pyo
.env
venv/
*.egg-info/

# Generated files
config_generated.json
comparisons.csv
sample_calculations.json

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
```

### Branching Strategy

```
main          ← production, auto-deploy ke GitHub Pages
develop       ← development branch
feature/xxx   ← fitur baru
fix/xxx       ← bug fix
```

```bash
# Workflow
git checkout -b feature/tambah-fitur
# ... coding ...
git add .
git commit -m "feat: tambah fitur baru"
git push origin feature/tambah-fitur
# Buat Pull Request ke develop
# Setelah review, merge ke main untuk deploy
```

---

## Menjalankan Lokal

### Python (Paling Mudah)

```bash
python3 -m http.server 8080
```

Buka: `http://localhost:8080`

### Node.js

```bash
npx serve . -p 8080
# atau
npx http-server . -p 8080
```

### VS Code Live Server

Install extension **Live Server** → klik kanan `index.html` → **Open with Live Server**

### PHP

```bash
php -S localhost:8080
```

> ⚠️ **Jangan buka `index.html` langsung sebagai file** (`file:///...`).
> Beberapa fitur (canvas export, font loading) butuh HTTP server.

---

## Cara Testing

### Manual Testing Checklist

#### 1. Intro Screen
- [ ] Intro muncul saat pertama kali buka
- [ ] Animasi logo, judul, dan progress bar berjalan
- [ ] Tombol "Lewati intro" berfungsi
- [ ] Auto-skip setelah ~4.5 detik
- [ ] Setelah intro, app muncul dengan animasi fade-in

#### 2. Device Detection
- [ ] Di browser desktop: app muncul normal
- [ ] Di viewport < 280px (DevTools): peringatan perangkat muncul
- [ ] Resize window ke < 280px: peringatan muncul otomatis
- [ ] Resize balik ke > 280px: peringatan hilang

#### 3. Kalkulator
- [ ] Input angka bisa diketik
- [ ] Format angka otomatis (titik ribuan)
- [ ] Teks formatted muncul di bawah input
- [ ] Tombol preset berfungsi (Rp 50rb, Rp 500rb, dll)
- [ ] Tombol X clear input
- [ ] Tombol "Hitung Sekarang" disabled saat input kosong
- [ ] Tombol "Hitung Sekarang" enabled saat ada nilai

#### 4. Proses Kalkulasi (10 detik delay)
- [ ] Loading ring animasi berputar
- [ ] Countdown dari 10 ke 0
- [ ] Progress bar bergerak dari 0% ke 100%
- [ ] Status text berubah bertahap (4 fase)
- [ ] Setelah 10 detik: hasil muncul dengan animasi

#### 5. Hasil
- [ ] Headline hasil muncul (durasi MBG)
- [ ] 8 breakdown cards muncul dengan stagger animation
- [ ] 5 perbandingan muncul
- [ ] Tombol Simpan, Ekspor, Hitung Lagi ada

#### 6. History
- [ ] Klik "Simpan ke Riwayat" → toast sukses
- [ ] Badge angka di tombol Riwayat bertambah
- [ ] Preview 5 riwayat di sidebar kanan
- [ ] Klik tombol Riwayat → modal history terbuka
- [ ] List riwayat tampil dengan nomor urut dan waktu
- [ ] Klik item riwayat → isi input dan tampilkan hasil
- [ ] Tombol "Ekspor JSON" → download file JSON
- [ ] Tombol "Hapus Semua" → konfirmasi → history terhapus
- [ ] History tersimpan setelah refresh halaman (localStorage)
- [ ] Maks 50 item: item ke-51 dapat pesan error

#### 7. Export Modal
- [ ] Klik "Ekspor Hasil" → modal terbuka
- [ ] 3 tab: PNG, Print, Social Media
- [ ] Preview card muncul di tab PNG
- [ ] 3 resolusi bisa dipilih (1080p, 1440p, 4K)
- [ ] 1440p menampilkan "⏱ 5s render"
- [ ] 4K menampilkan "⏱ 10s render"
- [ ] Klik Download → countdown sesuai resolusi → file didownload
- [ ] File PNG bisa dibuka dan tampilannya bagus

#### 8. Print
- [ ] Semua 6 checkbox harus dicentang
- [ ] Sebelum semua dicentang: tombol Print tidak muncul
- [ ] Setelah semua dicentang: pesan "Siap mencetak" + tombol muncul
- [ ] Klik Print → browser print dialog terbuka

#### 9. Social Media
- [ ] 3 checkbox harus dicentang
- [ ] Platform grid muncul setelah semua dicentang
- [ ] WhatsApp button aktif → download PNG + toast info
- [ ] YouTube button disabled dengan badge "Soon"

#### 10. Bahasa
- [ ] Klik tombol ID/EN di header → bahasa berganti
- [ ] Semua teks berubah bahasa
- [ ] Setting bahasa tersimpan setelah refresh

#### 11. Keyboard Shortcuts
- [ ] ESC menutup modal yang terbuka
- [ ] Ctrl+H membuka history modal
- [ ] Ctrl+E membuka export modal
- [ ] Enter di input field memulai kalkulasi

### Testing dengan Python Script

```bash
# Jalankan data.py untuk validasi dan demo
python3 data.py

# Expected output:
# ✓ Semua data valid
# Tabel breakdown anggaran
# Demo perhitungan untuk beberapa nilai
# Export 3 file JSON/CSV
```

### Testing di Browser DevTools

```javascript
// Console test: kalkulasi manual
const MBG_PER_HARI = 1_200_000_000_000;
const nominal      = 50_000;
const ratio        = nominal / MBG_PER_HARI;
const detik        = ratio * 86400;
console.log(`Rp 50.000 = ${detik.toFixed(4)} detik MBG`);
// Expected: Rp 50.000 = 3.6000 detik MBG

// Test localStorage
localStorage.getItem('mbg_history_v1');
JSON.parse(localStorage.getItem('mbg_history_v1') || '[]').length;

// Test i18n
window.I18N_UTIL.getLang();
window.I18N_UTIL.formatIDR(1_200_000_000_000, { short: true });
// Expected: "Rp 1.2 T"

// Test state
window.MBGState.currentResult;
window.MBGState.lang;
window.MBGState.history.length;
```

### Responsive Testing

| Device          | Width    | Test method                              |
|-----------------|----------|------------------------------------------|
| Desktop 1920    | 1920px   | Full browser                             |
| Laptop 1280     | 1280px   | DevTools resize                          |
| iPad Pro        | 1024px   | DevTools → iPad Pro                      |
| iPad            | 768px    | DevTools → iPad                          |
| iPhone 14 Pro   | 430px    | DevTools → iPhone 14 Pro                |
| iPhone SE       | 375px    | DevTools → iPhone SE                    |
| HP Jadul        | 320px    | DevTools custom                          |
| Unsupported     | 260px    | DevTools custom — warning harus muncul  |

---

## Struktur Kode

### app.js — Module Map

```
app.js
├── 0. CONSTANTS & CONFIG       ← CFG, SECONDS_PER
├── 1. i18n STRINGS             ← I18N.id, I18N.en (semua teks UI)
├── 2. COMPARISONS              ← 10 item pembanding
├── 3. PRINT_REQS               ← 6 syarat print
├── 4. EXPORT_RESOLUTIONS       ← 3 resolusi export
├── 5. STATE                    ← State global app
├── 6. DOM HELPERS              ← $(), $$(), setText(), dll
├── 7. FORMATTERS               ← fmtRupiah(), fmtDuration(), dll
├── 8. i18n                     ← t(), applyI18n()
├── 9. DEVICE DETECTION         ← detectDevice()
├── 10. PARTICLES               ← initIntroParticles(), initBgParticles()
├── 11. INTRO SEQUENCE          ← runIntro(), showApp()
├── 12. REALTIME COUNTER        ← startRealtimeCounter()
├── 13. INPUT HANDLING          ← initInput()
├── 14. CALCULATION ENGINE      ← startCalculation(), finishCalculation()
├── 15. RESULT RENDERING        ← renderResult(), renderBreakdown(), renderComparison()
├── 16. HISTORY                 ← loadHistory(), addToHistory(), dll
├── 17. MODALS                  ← openExportModal(), openHistoryModal()
├── 18. EXPORT MODAL INIT       ← initExportModal(), buildResCards(), dll
├── 19. EXPORT PNG HANDLER      ← handleDownloadPNG()
├── 20. PRINT HANDLER           ← triggerPrint()
├── 21. WHATSAPP SHARE          ← handleShareWA()
├── 22. TOAST SYSTEM            ← showToast()
├── 23. LANGUAGE TOGGLE         ← initLangToggle()
├── 24. SCROLL TO TOP           ← initScrollTop()
├── 25. SAVE HISTORY BUTTON     ← initSaveHistory()
├── 26. RESET                   ← initReset()
├── 27. EXPORT OPEN BUTTON      ← initExportOpen()
├── 28. HISTORY BUTTONS         ← initHistoryButtons()
├── 29. KEYBOARD SHORTCUTS      ← initKeyboard()
├── 30. RIPPLE EFFECTS          ← initRipples()
├── 31. GLOBAL EXPOSE           ← window.MBGState, window.MBGExport, dll
└── 32. BOOT                    ← DOMContentLoaded → init semua
```

### export.js — Module Map

```
export.js (IIFE → window.MBGExport)
├── drawCard()       ← render hasil ke canvas (semua resolusi)
├── roundRect()      ← helper path canvas
├── drawPill()       ← helper badge BGN/MBG
├── downloadPNG()    ← download file PNG
├── renderPreview()  ← render preview kecil di modal
└── init()           ← MutationObserver → auto-render preview
```

### Alur Data

```
User input
    ↓
initInput() → parseInput() → validate
    ↓
startCalculation() → 10s delay + animation
    ↓
finishCalculation(nominal)
    ↓ calculate:
    ratio = nominal / 1_200_000_000_000
    detik = ratio × 86400
    porsi = nominal / 14476
    ↓
renderResult() → renderBreakdown() + renderComparison()
    ↓
User → "Simpan" → addToHistory() → localStorage
User → "Ekspor" → openExportModal() → downloadPNG()
User → "Print"  → triggerPrint() → window.print()
User → "WA"     → handleShareWA() → downloadPNG('mbg_whatsapp')
```

---

## Konfigurasi

Semua konstanta ada di `config.json` dan di-mirror di `app.js` (konstanta `CFG` dan `MBG`).

Untuk update data:

1. Edit `config.json` (manual)
2. **atau** jalankan `data.py` yang akan generate `config_generated.json`
3. Copy nilai yang diupdate ke `app.js` konstanta `CFG` / `COMPARISONS`

```bash
python3 data.py
# Buka config_generated.json, copy nilai yang diupdate
```

### Field Penting

| Field                    | Nilai Saat Ini    | Keterangan                         |
|--------------------------|-------------------|------------------------------------|
| `MBG_PER_HARI`           | 1,200,000,000,000 | Anggaran harian MBG 2026           |
| `CALC_DELAY_MS`          | 10000             | Delay kalkulasi (ms)               |
| `HISTORY_LIMIT`          | 50                | Maks entri history                 |
| `INTRO_MS`               | 4500              | Durasi intro (ms)                  |
| `harga_per_porsi`        | 14,476            | Harga 1 porsi MBG                  |

---

## Export System

### Cara Kerja

1. `export.js` draw seluruh result card ke `<canvas id="export-canvas">` (hidden, di luar viewport)
2. Canvas diset ke ukuran resolusi target (`1920×1080`, `2560×1440`, `3840×2160`)
3. `canvas.toBlob()` → Blob → object URL → anchor click → download

### Resolusi dan Delay

| Resolusi | Dimensi       | Delay  | Scale |
|----------|---------------|--------|-------|
| 1080p    | 1920 × 1080   | 0s     | 2×    |
| 1440p    | 2560 × 1440   | 5s     | 3×    |
| 4K       | 3840 × 2160   | 10s    | 4×    |

Delay ada karena browser butuh waktu untuk render canvas resolusi tinggi tanpa freeze.

### Watermark

Watermark `"Modern MBG Calculator"` selalu muncul di footer card export.
Untuk mengubah, edit konstanta `WATERMARK` di `export.js`.

---

## i18n / Bahasa

Dua bahasa didukung: **Bahasa Indonesia (id)** dan **English (en)**.

### Cara Menambah String Baru

1. Buka `app.js`
2. Cari konstanta `I18N`
3. Tambah key baru di **keduanya** (`id` dan `en`):

```javascript
const I18N = {
  id: {
    // ... existing ...
    key_baru: 'Teks bahasa Indonesia',
  },
  en: {
    // ... existing ...
    key_baru: 'English text',
  },
};
```

4. Di HTML, gunakan `data-i18n`:

```html
<span data-i18n="key_baru">Fallback text</span>
```

5. Atau di JS: `t('key_baru')`

### Mendeteksi Bahasa Browser

`i18n.js` otomatis deteksi bahasa dari `navigator.language`.
Jika browser user dalam bahasa Indonesia → default ID.
Semua yang lain → EN, kecuali user sudah pernah set manual.

---

## Deploy ke GitHub Pages

### Metode 1: Via Settings (paling mudah)

1. Push semua file ke branch `main`
2. Buka repo → **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / folder: `/ (root)`
5. Klik **Save**
6. Tunggu 1–2 menit
7. URL: `https://USERNAME.github.io/mbg-calculator/`

### Metode 2: GitHub Actions (otomatis deploy tiap push)

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
```

---

## Deploy ke Vercel / Netlify

### Vercel

```bash
npm i -g vercel
vercel
# Ikuti prompt — pilih "Static Site"
# Output directory: . (root)
```

Atau drag & drop folder ke [vercel.com/new](https://vercel.com/new).

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --dir . --prod
```

Atau drag & drop folder ke [app.netlify.com/drop](https://app.netlify.com/drop).

> Keduanya gratis untuk static site.

---

## Update Data MBG

Saat anggaran MBG berubah (tiap tahun anggaran):

### Langkah 1: Update `data.py`

```python
# Di data.py, ubah konstanta MBG:
MBG = {
    "anggaran_per_hari_2026":    1_200_000_000_000,   # ← Update ini
    "anggaran_per_tahun_2026": 335_000_000_000_000,   # ← Update ini
    # ...
}
```

### Langkah 2: Validasi

```bash
python3 data.py
# Cek output validasi — tidak ada ERROR
```

### Langkah 3: Update `app.js`

```javascript
// Di app.js, update CFG:
const CFG = {
  MBG_PER_HARI: 1_200_000_000_000,  // ← Update ini
  // ...
};
```

### Langkah 4: Update `config.json`

```json
{
  "mbg": {
    "anggaranPerHari": 1200000000000,
    ...
  }
}
```

### Langkah 5: Commit dan Deploy

```bash
git add .
git commit -m "data: update anggaran MBG 2027"
git push origin main
```

---

## Troubleshooting

### Canvas Export Gagal / Kosong

**Gejala:** Download PNG tapi file kosong atau error di console.

**Penyebab:** Browser kehabisan memori saat render 4K canvas.

**Solusi:**
- Gunakan resolusi 1080p dulu
- Tutup tab lain sebelum export 4K
- Tambahkan delay lebih panjang di `EXPORT_RESOLUTIONS` untuk 4K

---

### History Tidak Tersimpan

**Gejala:** Refresh halaman, history hilang.

**Penyebab:** Browser dalam mode private/incognito (localStorage diblokir).

**Solusi:** Gunakan mode normal (bukan incognito).

**Debug:**
```javascript
// Di console:
localStorage.setItem('test', '1');
localStorage.getItem('test'); // Harus return '1'
```

---

### Font Tidak Muncul (Export PNG)

**Gejala:** Export PNG menggunakan font fallback Arial, bukan Syne/Inter.

**Penyebab:** Font belum ter-load saat canvas di-render.

**Solusi:** Di `export.js`, pastikan font sudah loaded:

```javascript
await document.fonts.ready; // Tunggu semua font loaded
drawCard(canvas, result, lang, opts);
```

---

### Intro Tidak Muncul

**Gejala:** Langsung ke app tanpa intro.

**Penyebab:** `#intro-screen` hidden di CSS karena kondisi tertentu.

**Debug:**
```javascript
document.getElementById('intro-screen').style.display; // Harus 'flex'
```

---

### Pesan "Hitung dulu sebelum menyimpan" Padahal Sudah Dihitung

**Gejala:** Klik Simpan setelah hitung, tapi muncul toast error.

**Penyebab:** User mengedit input setelah hitung — ini reset `STATE.currentResult`.

**Solusi:** Jangan ubah input setelah hitung. Klik "Hitung Sekarang" lagi dulu.

---

### Social Media — YouTube Tidak Aktif

Ini by design. YouTube export membutuhkan MP4 generation yang belum diimplementasi.
Badge "Soon" akan tetap muncul sampai fitur diaktifkan di update berikutnya.

---

## Catatan Penting

- **Bukan afiliasi pemerintah.** Data dari sumber publik (BGN, Kemenkeu RI).
- **Fun calculator.** Tidak ada data pribadi yang dikumpulkan.
- **localStorage only.** Tidak ada backend, tidak ada server, tidak ada tracking.
- Semua kalkulasi dilakukan di browser user.

---

*Modern MBG Calculator · guide.md · Last updated: 2026*
