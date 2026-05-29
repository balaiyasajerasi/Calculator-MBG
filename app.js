/* ═══════════════════════════════════════════════════════════════
   MODERN MBG CALCULATOR — app.js
   Core Engine · Calculator · History · i18n · Device Detection
   Particles · Realtime Counter · All UI Logic
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════════════════════════
   0. CONSTANTS & CONFIG
   ════════════════════════════════════════════════════════════════ */
const CFG = {
  MBG_PER_HARI:    1_200_000_000_000,
  HISTORY_LIMIT:   50,
  INTRO_MS:        4500,
  CALC_DELAY_MS:   10000,
  LS_HISTORY:      'mbg_history_v1',
  LS_LANG:         'mbg_lang',
  WATERMARK:       'Modern MBG Calculator',
};

const SECONDS_PER = {
  menit:  60,
  jam:    3600,
  hari:   86400,
  minggu: 604800,
  bulan:  2592000,   // ~30 hari
  tahun:  31536000,  // 365 hari
};

/* ════════════════════════════════════════════════════════════════
   1. i18n STRINGS
   ════════════════════════════════════════════════════════════════ */
const I18N = {
  id: {
    /* meta */
    device_warning_title: 'Perangkat Tidak Didukung',
    device_warning_body:  'Layar perangkat kamu terlalu kecil. Gunakan HP, tablet, laptop, atau PC untuk tampilan terbaik.',
    intro_sub:   'Seberapa besar nominalmu dibanding anggaran MBG?',
    intro_skip:  'Lewati intro',
    /* header */
    brand_sub:     'Kalkulator Makan Bergizi Gratis',
    nav_history:   'Riwayat',
    /* calc */
    calc_title_1:  'Bandingkan Nominalmu',
    calc_title_2:  'dengan Program MBG',
    calc_subtitle_1: '1 hari MBG =',
    calc_subtitle_2: '(1,2 Triliun)',
    input_label:   'Masukkan Nominal (Rupiah)',
    btn_hitung:    'Hitung Sekarang',
    calculating:   'Menghitung...',
    calc_status_1: 'Menganalisis nominal...',
    calc_status_2: 'Menghitung perbandingan...',
    calc_status_3: 'Memformat hasil...',
    calc_status_4: 'Hampir selesai...',
    /* result */
    result_equals:      'Nominalmu setara dengan',
    comparison_title:   'Setara dengan',
    btn_save:     'Simpan ke Riwayat',
    btn_export:   'Ekspor Hasil',
    btn_reset:    'Hitung Lagi',
    /* info panel */
    ip_about_title:   'Tentang MBG',
    ip_history_title: 'Riwayat Terakhir',
    ips_daily:        'Anggaran per Hari',
    ips_yearly:       'Anggaran 2026',
    ips_recipients:   'Target Penerima',
    ips_portion:      'Harga per Porsi',
    ipr_today:        'Terpakai hari ini (est.)',
    history_empty:    'Belum ada perhitungan',
    /* export modal */
    export_title:  'Ekspor Hasil',
    etab_png:      '📷 PNG / File',
    etab_print:    '🖨️ Print',
    etab_social:   '📲 Social Media',
    png_desc:      'Pilih resolusi. Resolusi lebih tinggi membutuhkan waktu render lebih lama.',
    btn_download:  'Download PNG',
    print_desc:    'Pastikan semua syarat berikut terpenuhi sebelum mencetak:',
    print_ready:   'Semua syarat terpenuhi. Siap mencetak!',
    btn_print_now: 'Cetak Sekarang',
    social_desc:   'Pilih platform. Pastikan syarat terpenuhi terlebih dahulu.',
    sc_image:      'Gambar hasil sudah digenerate',
    sc_understand: 'Saya mengerti ini bukan uang saya, hanya perbandingan fun',
    sc_share:      'Saya siap berbagi hasil ini',
    sp_title:      'Pilih platform:',
    wa_note:       'WhatsApp: gambar akan didownload, lalu share manual via WA.',
    coming_soon:   'Soon',
    /* history modal */
    history_title:       'Riwayat Perhitungan',
    btn_export_history:  'Ekspor JSON',
    btn_clear_history:   'Hapus Semua',
    /* footer */
    footer_note: 'Fun calculator · Bukan afiliasi pemerintah · Data: BGN, Kemenkeu RI',
    footer_src:  'Sumber: Badan Gizi Nasional · APBN 2025–2026',
    /* toasts */
    toast_saved:       'Tersimpan ke riwayat ✓',
    toast_save_fail:   'Gagal menyimpan',
    toast_cleared:     'Riwayat dihapus',
    toast_copied:      'Disalin ke clipboard',
    toast_max_history: 'Riwayat penuh (maks. 50). Hapus beberapa entri dulu.',
    toast_no_result:   'Hitung dulu sebelum menyimpan',
    toast_export_done: 'Download dimulai!',
    toast_export_err:  'Gagal export. Coba lagi.',
    toast_print_done:  'Dialog print dibuka',
    toast_wa_done:     'File didownload. Share manual via WA!',
    /* result units */
    rbu_detik:   'detik MBG',
    rbu_menit:   'menit MBG',
    rbu_jam:     'jam MBG',
    rbu_hari:    'hari MBG',
    rbu_minggu:  'minggu MBG',
    rbu_bulan:   'bulan MBG',
    rbu_tahun:   'tahun MBG',
    rbu_porsi:   'porsi makan',
    /* compare label */
    cmp_prefix: 'Setara',
    cmp_unit_x: '×',
  },
  en: {
    device_warning_title: 'Device Not Supported',
    device_warning_body:  'Your screen is too small. Use a phone, tablet, laptop, or PC for the best experience.',
    intro_sub:   'How does your amount compare to the MBG daily budget?',
    intro_skip:  'Skip intro',
    brand_sub:     'Free Nutritious Meals Calculator',
    nav_history:   'History',
    calc_title_1:  'Compare Your Amount',
    calc_title_2:  'with the MBG Program',
    calc_subtitle_1: '1 day of MBG =',
    calc_subtitle_2: '(1.2 Trillion IDR)',
    input_label:   'Enter Nominal (Rupiah)',
    btn_hitung:    'Calculate Now',
    calculating:   'Calculating...',
    calc_status_1: 'Analyzing nominal...',
    calc_status_2: 'Computing comparisons...',
    calc_status_3: 'Formatting results...',
    calc_status_4: 'Almost done...',
    result_equals:      'Your amount equals',
    comparison_title:   'Equivalent to',
    btn_save:     'Save to History',
    btn_export:   'Export Result',
    btn_reset:    'Calculate Again',
    ip_about_title:   'About MBG',
    ip_history_title: 'Recent History',
    ips_daily:        'Daily Budget',
    ips_yearly:       '2026 Budget',
    ips_recipients:   'Target Recipients',
    ips_portion:      'Price per Serving',
    ipr_today:        'Used today (est.)',
    history_empty:    'No calculations yet',
    export_title:  'Export Result',
    etab_png:      '📷 PNG / File',
    etab_print:    '🖨️ Print',
    etab_social:   '📲 Social Media',
    png_desc:      'Choose resolution. Higher resolution takes longer to render.',
    btn_download:  'Download PNG',
    print_desc:    'Ensure all requirements below are met before printing:',
    print_ready:   'All requirements met. Ready to print!',
    btn_print_now: 'Print Now',
    social_desc:   'Choose a platform. Ensure requirements are met first.',
    sc_image:      'Result image has been generated',
    sc_understand: 'I understand this is not my money, just a fun comparison',
    sc_share:      'I am ready to share this result',
    sp_title:      'Select platform:',
    wa_note:       'WhatsApp: image will be downloaded, then share manually via WA.',
    coming_soon:   'Soon',
    history_title:       'Calculation History',
    btn_export_history:  'Export JSON',
    btn_clear_history:   'Clear All',
    footer_note: 'Fun calculator · Not affiliated with government · Data: BGN, Ministry of Finance',
    footer_src:  'Source: National Nutrition Agency · State Budget 2025–2026',
    toast_saved:       'Saved to history ✓',
    toast_save_fail:   'Failed to save',
    toast_cleared:     'History cleared',
    toast_copied:      'Copied to clipboard',
    toast_max_history: 'History full (max 50). Delete some entries first.',
    toast_no_result:   'Calculate first before saving',
    toast_export_done: 'Download started!',
    toast_export_err:  'Export failed. Try again.',
    toast_print_done:  'Print dialog opened',
    toast_wa_done:     'File downloaded. Share manually via WA!',
    rbu_detik:   'seconds of MBG',
    rbu_menit:   'minutes of MBG',
    rbu_jam:     'hours of MBG',
    rbu_hari:    'days of MBG',
    rbu_minggu:  'weeks of MBG',
    rbu_bulan:   'months of MBG',
    rbu_tahun:   'years of MBG',
    rbu_porsi:   'meal servings',
    cmp_prefix:  'Equals',
    cmp_unit_x:  '×',
  },
};

const COMPARISONS = [
  { id:'gaji_umr',   icon:'💼', id_label:'Gaji UMR DKI 2025',     en_label:'DKI Min. Wage 2025',       value:5_067_381 },
  { id:'iphone',     icon:'📱', id_label:'iPhone 15 Pro',          en_label:'iPhone 15 Pro',            value:21_999_000 },
  { id:'avanza',     icon:'🚗', id_label:'Toyota Avanza baru',     en_label:'New Toyota Avanza',        value:230_000_000 },
  { id:'rumah',      icon:'🏠', id_label:'Rumah subsidi (avg.)',   en_label:'Subsidized house (avg.)',  value:160_000_000 },
  { id:'ukt',        icon:'🎓', id_label:'UKT PTN per semester',   en_label:'State uni. tuition/sem',   value:5_000_000 },
  { id:'bos',        icon:'🏫', id_label:'Dana BOS per siswa/thn', en_label:'BOS grant per student/yr', value:900_000 },
  { id:'netflix',    icon:'🎬', id_label:'Netflix Premium 1 thn',  en_label:'Netflix Premium 1 year',   value:1_908_000 },
  { id:'tiket_bali', icon:'✈️', id_label:'Tiket Jkt–Bali PP',      en_label:'Jakarta–Bali round-trip',  value:1_800_000 },
  { id:'listrik',    icon:'💡', id_label:'Tagihan listrik/bulan',  en_label:'Electricity bill/month',   value:500_000 },
  { id:'makan',      icon:'🍽️', id_label:'Makan restoran',        en_label:'Restaurant meal',          value:75_000 },
];

const PRINT_REQS = [
  { id:'ink',     id_text:'Tinta printer penuh atau cukup',      en_text:'Printer ink is sufficient' },
  { id:'color',   id_text:'Printer mendukung cetak berwarna',    en_text:'Printer supports color printing' },
  { id:'paper',   id_text:'Kertas tersedia minimal A4',          en_text:'Paper available (min. A4)' },
  { id:'online',  id_text:'Printer sudah menyala dan terhubung', en_text:'Printer is on and connected' },
  { id:'driver',  id_text:'Driver printer sudah terinstall',     en_text:'Printer driver is installed' },
  { id:'confirm', id_text:'Saya yakin dan siap mencetak',        en_text:'I confirm I am ready to print' },
];

const EXPORT_RESOLUTIONS = [
  { id:'1080p', label:'Full HD 1080p', w:1920, h:1080, scale:2, delayMs:0 },
  { id:'1440p', label:'QHD 1440p',     w:2560, h:1440, scale:3, delayMs:5000 },
  { id:'4k',    label:'4K Ultra HD',   w:3840, h:2160, scale:4, delayMs:10000 },
];

/* ════════════════════════════════════════════════════════════════
   2. STATE
   ════════════════════════════════════════════════════════════════ */
const STATE = {
  lang:          localStorage.getItem(CFG.LS_LANG) || 'id',
  currentResult: null,
  isCalculating: false,
  calcTimer:     null,
  history:       [],
  selectedRes:   '1080p',
};

/* ════════════════════════════════════════════════════════════════
   3. DOM HELPERS
   ════════════════════════════════════════════════════════════════ */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function setText(id, text)  { const el=$(id); if(el) el.textContent = text; }
function setHTML(id, html)  { const el=$(id); if(el) el.innerHTML   = html;  }
function show(id)  { const el=$(id); if(el) el.classList.remove('hidden'); }
function hide(id)  { const el=$(id); if(el) el.classList.add('hidden'); }
function toggle(id, cond) { const el=$(id); if(!el) return; cond ? show(id) : hide(id); }

/* ════════════════════════════════════════════════════════════════
   4. FORMATTERS
   ════════════════════════════════════════════════════════════════ */
function fmtRupiah(n, short = false) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (short) {
    if (abs >= 1e12) return 'Rp ' + (n/1e12).toFixed(2).replace(/\.?0+$/,'') + ' T';
    if (abs >= 1e9)  return 'Rp ' + (n/1e9).toFixed(1).replace(/\.0$/,'')   + ' M';
    if (abs >= 1e6)  return 'Rp ' + (n/1e6).toFixed(1).replace(/\.0$/,'')   + ' jt';
    if (abs >= 1e3)  return 'Rp ' + (n/1e3).toFixed(0) + ' rb';
    return 'Rp ' + n.toFixed(0);
  }
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function fmtDuration(seconds, lang) {
  /* returns best human-readable duration string */
  const t   = seconds;
  const s   = STATE.lang === 'id' ? I18N.id : I18N.en;
  if (t < 60)       return { num: t.toFixed(2),  unit: s.rbu_detik,  emoji:'⏱' };
  if (t < 3600)     return { num: (t/60).toFixed(2),   unit: s.rbu_menit,  emoji:'🕐' };
  if (t < 86400)    return { num: (t/3600).toFixed(2), unit: s.rbu_jam,    emoji:'🕑' };
  if (t < 604800)   return { num: (t/86400).toFixed(3), unit: s.rbu_hari,  emoji:'📅' };
  if (t < 2592000)  return { num: (t/604800).toFixed(3), unit: s.rbu_minggu, emoji:'📆' };
  if (t < 31536000) return { num: (t/2592000).toFixed(4), unit: s.rbu_bulan, emoji:'🗓' };
  return { num: (t/31536000).toFixed(6), unit: s.rbu_tahun, emoji:'📰' };
}

function parseInput(raw) {
  /* strips non-numeric except decimal */
  const clean = raw.replace(/[^\d]/g, '');
  return clean === '' ? null : parseInt(clean, 10);
}

function formatInputDisplay(raw) {
  const n = parseInput(raw);
  if (n === null || n === 0) return '';
  return n.toLocaleString('id-ID');
}

/* ════════════════════════════════════════════════════════════════
   5. i18n
   ════════════════════════════════════════════════════════════════ */
function t(key) {
  return (STATE.lang === 'en' ? I18N.en : I18N.id)[key] || key;
}

function applyI18n() {
  $$('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  setText('lang-label', STATE.lang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN');
}

/* ════════════════════════════════════════════════════════════════
   6. DEVICE DETECTION
   ════════════════════════════════════════════════════════════════ */
function detectDevice() {
  const w = window.innerWidth;
  if (w < 280) {
    show('device-warning');
    hide('app');
    return false;
  }
  return true;
}

window.addEventListener('resize', () => {
  const ok = window.innerWidth >= 280;
  toggle('device-warning', !ok);
});

/* ════════════════════════════════════════════════════════════════
   7. PARTICLES — BG & INTRO
   ════════════════════════════════════════════════════════════════ */
function initIntroParticles() {
  const c  = $('intro-particles');
  if (!c) return;
  const cx = c.getContext('2d');
  let W, H;
  const pts = [];

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    pts.push({
      x:   Math.random() * 2000,
      y:   Math.random() * 1080,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4,
      r:   Math.random() * 1.5 + 0.3,
      a:   Math.random() * 0.5 + 0.1,
      col: ['#d4a017','#f0c040','#9a6f00','#fff3cc'][Math.floor(Math.random()*4)],
      pulse: Math.random() * Math.PI * 2,
    });
  }

  let running = true;
  function draw(ts) {
    if (!running) return;
    cx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      cx.globalAlpha = p.a * (0.5 + Math.sin(p.pulse) * 0.5);
      cx.fillStyle   = p.col;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI*2); cx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw(0);
  return () => { running = false; };
}

function initBgParticles() {
  const c  = $('bg-particles');
  if (!c) return;
  const cx = c.getContext('2d');
  let W, H;
  const pts = [];

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    pts.push({
      x:  Math.random() * 1920,
      y:  Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r:  Math.random() * 1.2 + 0.2,
      a:  Math.random() * 0.2 + 0.04,
      col:['#d4a017','#f0c040','#9a6f00'][Math.floor(Math.random()*3)],
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    cx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += 0.015;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      cx.globalAlpha = p.a * (0.4 + Math.sin(p.pulse) * 0.4);
      cx.fillStyle   = p.col;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI*2); cx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ════════════════════════════════════════════════════════════════
   8. INTRO SEQUENCE
   ════════════════════════════════════════════════════════════════ */
function runIntro() {
  const screen = $('intro-screen');
  if (!screen) { showApp(); return; }

  const stopPtcl = initIntroParticles();

  function doExit() {
    if (stopPtcl) stopPtcl();
    screen.classList.add('exit');
    setTimeout(showApp, 800);
    screen.addEventListener('animationend', () => screen.style.display = 'none', { once:true });
  }

  /* Skip button */
  const skipBtn = $('intro-skip');
  if (skipBtn) skipBtn.addEventListener('click', doExit);

  /* Auto exit after intro duration */
  setTimeout(doExit, CFG.INTRO_MS);
}

function showApp() {
  const app = $('app');
  if (!app) return;
  app.classList.remove('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => app.classList.add('visible'));
  });
  initBgParticles();
  startRealtimeCounter();
}

/* ════════════════════════════════════════════════════════════════
   9. REALTIME COUNTER
   ════════════════════════════════════════════════════════════════ */
function startRealtimeCounter() {
  const perDetik = CFG.MBG_PER_HARI / 86400;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  function update() {
    const elapsed = (Date.now() - startOfDay.getTime()) / 1000;
    const spent   = elapsed * perDetik;
    const el = $('realtime-val');
    if (el) el.textContent = fmtRupiah(spent);
  }

  update();
  setInterval(update, 500);
}

/* ════════════════════════════════════════════════════════════════
   10. CALCULATOR INPUT HANDLING
   ════════════════════════════════════════════════════════════════ */
function initInput() {
  const input     = $('nominal-input');
  const clearBtn  = $('input-clear');
  const formatted = $('input-formatted');
  const hitungBtn = $('btn-hitung');
  const inputWrap = $('input-wrap');

  if (!input) return;

  /* Format as user types */
  input.addEventListener('input', () => {
    const raw   = input.value.replace(/[^\d]/g, '');
    const n     = raw === '' ? null : parseInt(raw, 10);

    /* keep cursor position */
    const disp  = n ? n.toLocaleString('id-ID') : '';
    input.value = disp;

    /* formatted readout below */
    if (n && n > 0) {
      formatted.textContent = fmtRupiah(n, false);
      formatted.classList.add('visible');
      inputWrap.classList.add('has-value');
      clearBtn.classList.remove('hidden');
      hitungBtn.disabled = false;
    } else {
      formatted.textContent = '';
      formatted.classList.remove('visible');
      inputWrap.classList.remove('has-value');
      clearBtn.classList.add('hidden');
      hitungBtn.disabled = true;
    }

    /* hide old result if user edits */
    if (STATE.currentResult !== null) {
      hide('result-area');
      STATE.currentResult = null;
    }
  });

  /* Block space key from triggering page scroll while typing */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') startCalculation();
  });

  /* Clear button */
  clearBtn?.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.focus();
  });

  /* Presets */
  $$('.preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val, 10);
      input.value = val.toLocaleString('id-ID');
      input.dispatchEvent(new Event('input'));
      /* ripple effect */
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 300);
    });
  });

  /* Hitung button */
  hitungBtn?.addEventListener('click', startCalculation);
}

/* ════════════════════════════════════════════════════════════════
   11. CALCULATION ENGINE
   ════════════════════════════════════════════════════════════════ */
function getNominal() {
  const raw = ($('nominal-input')?.value || '').replace(/[^\d]/g, '');
  return raw === '' ? null : parseInt(raw, 10);
}

function startCalculation() {
  if (STATE.isCalculating) return;
  const nominal = getNominal();
  if (!nominal || nominal <= 0) {
    showToast(t('toast_no_result'), 'warning');
    return;
  }

  STATE.isCalculating = true;
  hide('result-area');
  hide('btn-hitung');
  show('calculating-state');

  const duration    = CFG.CALC_DELAY_MS;
  const startTime   = Date.now();
  const progressFill = $('calc-progress-fill');
  const countdownEl  = $('countdown-num');
  const statusEl     = $('calc-status-text');

  const statusKeys = ['calc_status_1','calc_status_2','calc_status_3','calc_status_4'];
  let lastStatus   = -1;

  function tick() {
    const elapsed  = Date.now() - startTime;
    const pct      = Math.min(elapsed / duration * 100, 100);
    const remSec   = Math.max(0, Math.ceil((duration - elapsed) / 1000));

    /* progress bar */
    if (progressFill) {
      progressFill.style.width = pct + '%';
      progressFill.classList.toggle('active', pct > 0);
    }

    /* countdown */
    if (countdownEl) countdownEl.textContent = remSec;

    /* status messages */
    const statusIdx = Math.floor(pct / 25);
    if (statusIdx !== lastStatus && statusIdx < statusKeys.length) {
      lastStatus = statusIdx;
      if (statusEl) {
        statusEl.style.opacity = '0';
        setTimeout(() => {
          if (statusEl) { statusEl.textContent = t(statusKeys[statusIdx]); statusEl.style.opacity = '1'; }
        }, 200);
      }
    }

    if (elapsed < duration) {
      STATE.calcTimer = requestAnimationFrame(tick);
    } else {
      finishCalculation(nominal);
    }
  }

  STATE.calcTimer = requestAnimationFrame(tick);
}

function finishCalculation(nominal) {
  STATE.isCalculating = false;
  hide('calculating-state');
  show('btn-hitung');

  /* Core math */
  const ratio        = nominal / CFG.MBG_PER_HARI;
  const detik        = ratio * 86400;
  const porsi        = nominal / 14476;

  const result = {
    nominal,
    ratio,
    detik,
    porsi,
    timestamp: new Date().toISOString(),
  };

  STATE.currentResult = result;
  renderResult(result);
  show('result-area');

  /* Scroll result into view */
  setTimeout(() => $('result-area')?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 100);
}

/* ════════════════════════════════════════════════════════════════
   12. RESULT RENDERING
   ════════════════════════════════════════════════════════════════ */
function renderResult(r) {
  const dur = fmtDuration(r.detik);

  /* Main headline */
  const mainEl = $('result-main-text');
  const subEl  = $('result-sub-text');

  if (mainEl) {
    mainEl.innerHTML =
      `<span style="font-size:0.6em;opacity:0.7">${dur.emoji} </span>` +
      `${parseFloat(dur.num).toLocaleString('id-ID')} ${dur.unit}`;
  }

  if (subEl) {
    const pctText = r.ratio < 1
      ? `${(r.ratio * 100).toFixed(6)}% dari 1 hari MBG`
      : `${r.ratio.toFixed(6)} hari MBG`;
    const porsiText = `≈ ${Math.round(r.porsi).toLocaleString('id-ID')} ${t('rbu_porsi')}`;
    subEl.textContent = `${pctText}  ·  ${porsiText}`;
  }

  /* Breakdown cards */
  renderBreakdown(r);

  /* Comparison */
  renderComparison(r);
}

function renderBreakdown(r) {
  const container = $('result-breakdown');
  if (!container) return;

  const cards = [
    { icon:'⏱', label:'Detik MBG',  val: r.detik,          unit:'detik',   fmt: n => n.toFixed(4) },
    { icon:'🕐', label:'Menit MBG',  val: r.detik/60,       unit:'menit',   fmt: n => n.toFixed(4) },
    { icon:'🕑', label:'Jam MBG',    val: r.detik/3600,     unit:'jam',     fmt: n => n.toFixed(6) },
    { icon:'📅', label:'Hari MBG',   val: r.detik/86400,    unit:'hari',    fmt: n => n < 1 ? n.toFixed(8) : n.toFixed(4) },
    { icon:'📆', label:'Minggu MBG', val: r.detik/604800,   unit:'minggu',  fmt: n => n.toFixed(8) },
    { icon:'🗓', label:'Bulan MBG',  val: r.detik/2592000,  unit:'bulan',   fmt: n => n.toFixed(10) },
    { icon:'📰', label:'Tahun MBG',  val: r.detik/31536000, unit:'tahun',   fmt: n => n.toFixed(12) },
    { icon:'🍱', label:t('rbu_porsi'),val:r.porsi,          unit:'porsi',   fmt: n => Math.round(n).toLocaleString('id-ID') },
  ];

  container.innerHTML = cards.map((c, i) => `
    <div class="rb-card" style="animation-delay:${i*0.06}s">
      <div class="rb-icon">${c.icon}</div>
      <div class="rb-label">${c.label}</div>
      <div class="rb-val">${c.fmt(c.val)}</div>
      <div class="rb-unit">${c.unit}</div>
    </div>
  `).join('');
}

function renderComparison(r) {
  const container = $('comparison-grid');
  if (!container) return;

  const lang = STATE.lang;
  /* Show top 5 most relevant comparisons */
  const sorted = [...COMPARISONS].map(c => ({
    ...c,
    count: r.nominal / c.value,
    label: lang === 'id' ? c.id_label : c.en_label,
  })).sort((a, b) => {
    /* prefer counts close to 1 */
    const da = Math.abs(Math.log10(Math.max(a.count, 0.001)));
    const db = Math.abs(Math.log10(Math.max(b.count, 0.001)));
    return da - db;
  }).slice(0, 5);

  container.innerHTML = sorted.map(c => {
    const countDisplay = c.count >= 1
      ? `${c.count.toLocaleString('id-ID', {maximumFractionDigits:2})} ${t('cmp_unit_x')}`
      : `${(c.count * 100).toFixed(4)}%`;
    return `
      <div class="cmp-item">
        <div class="cmp-icon">${c.icon}</div>
        <div class="cmp-label">${c.label}</div>
        <div class="cmp-count">${countDisplay}</div>
      </div>`;
  }).join('');
}

/* ════════════════════════════════════════════════════════════════
   13. HISTORY
   ════════════════════════════════════════════════════════════════ */
function loadHistory() {
  try {
    const raw = localStorage.getItem(CFG.LS_HISTORY);
    STATE.history = raw ? JSON.parse(raw) : [];
  } catch(e) {
    STATE.history = [];
  }
  renderHistoryPreview();
  renderHistoryFull();
  updateHistoryBadge();
}

function saveHistoryToLS() {
  try {
    localStorage.setItem(CFG.LS_HISTORY, JSON.stringify(STATE.history));
  } catch(e) {
    showToast(t('toast_save_fail'), 'error');
  }
}

function addToHistory(result) {
  if (STATE.history.length >= CFG.HISTORY_LIMIT) {
    showToast(t('toast_max_history'), 'warning');
    return false;
  }
  const dur = fmtDuration(result.detik);
  const entry = {
    id:        Date.now(),
    nominal:   result.nominal,
    ratio:     result.ratio,
    detik:     result.detik,
    porsi:     result.porsi,
    mainText:  `${parseFloat(dur.num).toLocaleString('id-ID')} ${dur.unit}`,
    timestamp: result.timestamp,
  };
  STATE.history.unshift(entry);
  saveHistoryToLS();
  renderHistoryPreview();
  renderHistoryFull();
  updateHistoryBadge();
  return true;
}

function clearHistory() {
  if (!confirm(STATE.lang === 'id' ? 'Hapus semua riwayat?' : 'Clear all history?')) return;
  STATE.history = [];
  saveHistoryToLS();
  renderHistoryPreview();
  renderHistoryFull();
  updateHistoryBadge();
  showToast(t('toast_cleared'), 'info');
}

function exportHistoryJSON() {
  const data = JSON.stringify(STATE.history, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `mbg_history_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function updateHistoryBadge() {
  const badge = $('history-badge');
  if (!badge) return;
  const count = STATE.history.length;
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderHistoryPreview() {
  const list = $('history-preview-list');
  if (!list) return;
  if (STATE.history.length === 0) {
    list.innerHTML = `<div class="history-empty">${t('history_empty')}</div>`;
    return;
  }
  list.innerHTML = STATE.history.slice(0, 5).map(h => `
    <div class="hp-item" data-id="${h.id}">
      <div class="hp-icon">🧮</div>
      <div class="hp-body">
        <div class="hp-nominal">${fmtRupiah(h.nominal)}</div>
        <div class="hp-result">${h.mainText}</div>
      </div>
      <div class="hp-time">${relativeTime(h.timestamp)}</div>
    </div>
  `).join('');

  list.querySelectorAll('.hp-item').forEach(el => {
    el.addEventListener('click', () => {
      const entry = STATE.history.find(h => h.id == el.dataset.id);
      if (entry) loadFromHistory(entry);
    });
  });
}

function renderHistoryFull() {
  const list = $('history-full-list');
  if (!list) return;
  if (STATE.history.length === 0) {
    list.innerHTML = `<div class="history-empty">${t('history_empty')}</div>`;
    return;
  }
  list.innerHTML = STATE.history.map((h, i) => `
    <div class="hf-item" data-id="${h.id}">
      <div class="hf-num">${i+1}</div>
      <div class="hf-body">
        <div class="hf-nominal">${fmtRupiah(h.nominal)}</div>
        <div class="hf-result">${h.mainText}</div>
      </div>
      <div class="hf-time">${new Date(h.timestamp).toLocaleString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
    </div>
  `).join('');

  list.querySelectorAll('.hf-item').forEach(el => {
    el.addEventListener('click', () => {
      const entry = STATE.history.find(h => h.id == el.dataset.id);
      if (entry) { loadFromHistory(entry); closeHistoryModal(); }
    });
  });
}

function loadFromHistory(entry) {
  const input = $('nominal-input');
  if (input) {
    input.value = entry.nominal.toLocaleString('id-ID');
    input.dispatchEvent(new Event('input'));
  }
  STATE.currentResult = entry;
  renderResult(entry);
  show('result-area');
  $('calc-card')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return STATE.lang==='id' ? 'baru saja' : 'just now';
  if (m < 60)  return STATE.lang==='id' ? `${m} mnt lalu` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return STATE.lang==='id' ? `${h} jam lalu` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return STATE.lang==='id' ? `${d} hari lalu` : `${d}d ago`;
}

/* ════════════════════════════════════════════════════════════════
   14. MODALS
   ════════════════════════════════════════════════════════════════ */
function openExportModal() {
  if (!STATE.currentResult) { showToast(t('toast_no_result'), 'warning'); return; }
  show('export-modal-overlay');
  initExportModal();
}
function closeExportModal() { hide('export-modal-overlay'); }

function openHistoryModal() {
  renderHistoryFull();
  show('history-modal-overlay');
}
function closeHistoryModal() { hide('history-modal-overlay'); }

/* Click outside to close */
function initModalClose() {
  $('export-modal-overlay')?.addEventListener('click', e => {
    if (e.target === $('export-modal-overlay')) closeExportModal();
  });
  $('history-modal-overlay')?.addEventListener('click', e => {
    if (e.target === $('history-modal-overlay')) closeHistoryModal();
  });
  $('export-modal-close')?.addEventListener('click',  closeExportModal);
  $('history-modal-close')?.addEventListener('click', closeHistoryModal);
}

/* ════════════════════════════════════════════════════════════════
   15. EXPORT MODAL INIT
   ════════════════════════════════════════════════════════════════ */
function initExportModal() {
  /* Tabs */
  $$('.etab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.etab').forEach(t2 => t2.classList.remove('active'));
      $$('.etab-content').forEach(c => { c.classList.add('hidden'); c.classList.remove('active'); });
      tab.classList.add('active');
      const content = $('etab-' + tab.dataset.tab);
      if (content) { content.classList.remove('hidden'); content.classList.add('active'); }
    });
  });

  /* Resolution cards */
  buildResCards();

  /* Print checklist */
  buildPrintChecklist();

  /* Social checklist */
  buildSocialChecklist();

  /* Download button */
  $('btn-download-png')?.addEventListener('click', handleDownloadPNG);

  /* Print button */
  $('btn-do-print')?.addEventListener('click', () => {
    closeExportModal();
    triggerPrint();
  });

  /* WhatsApp */
  $('btn-share-wa')?.addEventListener('click', handleShareWA);
}

function buildResCards() {
  const grid = $('res-grid');
  if (!grid) return;
  grid.innerHTML = EXPORT_RESOLUTIONS.map(r => `
    <div class="res-card ${r.id === STATE.selectedRes ? 'selected':''}" data-res="${r.id}">
      <div class="res-id">${r.id.toUpperCase()}</div>
      <div class="res-label">${r.label}</div>
      <div class="res-delay ${r.delayMs>0?'has-delay':''}">
        ${r.delayMs > 0 ? `⏱ ${r.delayMs/1000}s render` : '⚡ Instant'}
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.res-card').forEach(card => {
    card.addEventListener('click', () => {
      STATE.selectedRes = card.dataset.res;
      grid.querySelectorAll('.res-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateDownloadButton();
    });
  });

  updateDownloadButton();
}

function updateDownloadButton() {
  const btn    = $('btn-download-png');
  const delay  = $('export-delay-indicator');
  const res    = EXPORT_RESOLUTIONS.find(r => r.id === STATE.selectedRes);
  if (!btn || !res) return;
  btn.disabled = false;
  if (delay) {
    if (res.delayMs > 0) {
      delay.textContent = `⏱ ${res.delayMs/1000}s`;
      delay.classList.remove('hidden');
    } else {
      delay.classList.add('hidden');
    }
  }
}

function buildPrintChecklist() {
  const container = $('print-checklist');
  if (!container) return;
  const lang = STATE.lang;
  container.innerHTML = PRINT_REQS.map(req => `
    <div class="pc-item" id="pc-wrap-${req.id}">
      <input type="checkbox" id="pc-${req.id}" data-req="${req.id}">
      <label for="pc-${req.id}">${lang==='id' ? req.id_text : req.en_text}</label>
    </div>
  `).join('');

  container.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', () => {
      const wrap = chk.closest('.pc-item');
      wrap?.classList.toggle('checked', chk.checked);
      checkPrintReady();
    });
  });
}

function checkPrintReady() {
  const all = $$('#print-checklist input[type="checkbox"]');
  const done = [...all].every(c => c.checked);
  const wrap = $('print-confirm-wrap');
  if (wrap) { done ? show('print-confirm-wrap') : hide('print-confirm-wrap'); }
}

function buildSocialChecklist() {
  const container = $('social-checklist');
  if (!container) return;
  container.querySelectorAll('.sc-chk').forEach(chk => {
    chk.addEventListener('change', checkSocialReady);
  });
}

function checkSocialReady() {
  const all  = $$('#social-checklist .sc-chk');
  const done = [...all].every(c => c.checked);
  if (done) show('social-platforms');
  else hide('social-platforms');
}

/* ════════════════════════════════════════════════════════════════
   16. EXPORT PNG HANDLER
   ════════════════════════════════════════════════════════════════ */
async function handleDownloadPNG() {
  if (!STATE.currentResult) { showToast(t('toast_no_result'), 'warning'); return; }
  const res    = EXPORT_RESOLUTIONS.find(r => r.id === STATE.selectedRes);
  if (!res) return;

  const btn = $('btn-download-png');
  if (btn) { btn.disabled = true; btn.querySelector('.bed-text').textContent = 'Rendering...'; }

  /* Delay for higher resolutions */
  if (res.delayMs > 0) {
    await countdown(res.delayMs, btn);
  }

  /* Export is handled by export.js — call its function */
  if (typeof window.MBGExport?.downloadPNG === 'function') {
    await window.MBGExport.downloadPNG(STATE.currentResult, res, STATE.lang);
    showToast(t('toast_export_done'), 'success');
  } else {
    /* Fallback: basic canvas export */
    showToast(t('toast_export_err'), 'error');
  }

  if (btn) { btn.disabled = false; btn.querySelector('.bed-text').textContent = t('btn_download'); }
}

async function countdown(ms, btn) {
  return new Promise(resolve => {
    const total  = ms;
    const start  = Date.now();
    const delay  = $('export-delay-indicator');
    function tick() {
      const rem = Math.max(0, Math.ceil((total - (Date.now()-start)) / 1000));
      if (delay) delay.textContent = `⏱ ${rem}s`;
      if (rem > 0) requestAnimationFrame(tick);
      else resolve();
    }
    tick();
  });
}

/* ════════════════════════════════════════════════════════════════
   17. PRINT HANDLER
   ════════════════════════════════════════════════════════════════ */
function triggerPrint() {
  /* Inject print-specific result div */
  const existing = document.getElementById('print-target');
  if (existing) existing.remove();

  const r   = STATE.currentResult;
  const dur = fmtDuration(r.detik);

  const div = document.createElement('div');
  div.id = 'print-target';
  div.style.cssText = 'display:none';
  div.innerHTML = `
    <style>
      @media print {
        body > *:not(#print-target) { display:none!important; }
        #print-target { display:block!important; font-family:Arial,sans-serif; padding:40px; color:#000; }
        .pt-title { font-size:28px; font-weight:900; margin-bottom:8px; }
        .pt-sub   { font-size:14px; color:#666; margin-bottom:24px; }
        .pt-main  { font-size:36px; font-weight:700; color:#9a6f00; margin:20px 0; }
        .pt-row   { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee; font-size:14px; }
        .pt-wm    { margin-top:32px; font-size:11px; color:#999; text-align:center; }
      }
    </style>
    <div class="pt-title">${CFG.WATERMARK}</div>
    <div class="pt-sub">${new Date().toLocaleString('id-ID')}</div>
    <div class="pt-row"><span>Nominal</span><strong>${fmtRupiah(r.nominal)}</strong></div>
    <div class="pt-main">${dur.emoji} ${parseFloat(dur.num).toLocaleString('id-ID')} ${dur.unit}</div>
    <div class="pt-row"><span>Detik MBG</span><strong>${r.detik.toFixed(4)}</strong></div>
    <div class="pt-row"><span>Hari MBG</span><strong>${(r.detik/86400).toFixed(8)}</strong></div>
    <div class="pt-row"><span>Porsi makan</span><strong>${Math.round(r.porsi).toLocaleString('id-ID')}</strong></div>
    <div class="pt-wm">${CFG.WATERMARK} · Fun calculator · Bukan afiliasi pemerintah</div>
  `;
  document.body.appendChild(div);
  window.print();
  showToast(t('toast_print_done'), 'info');
}

/* ════════════════════════════════════════════════════════════════
   18. WHATSAPP SHARE
   ════════════════════════════════════════════════════════════════ */
async function handleShareWA() {
  if (!STATE.currentResult) { showToast(t('toast_no_result'), 'warning'); return; }

  /* Download a PNG (1080p) then show toast */
  const res = EXPORT_RESOLUTIONS[0]; // 1080p
  if (typeof window.MBGExport?.downloadPNG === 'function') {
    await window.MBGExport.downloadPNG(STATE.currentResult, res, STATE.lang, 'mbg_whatsapp');
    showToast(t('toast_wa_done'), 'success');
  } else {
    showToast(t('toast_export_err'), 'error');
  }
}

/* ════════════════════════════════════════════════════════════════
   19. TOAST SYSTEM
   ════════════════════════════════════════════════════════════════ */
function showToast(message, type = 'info', duration = 3000) {
  const container = $('toast-container');
  if (!container) return;

  const icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]||'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);

  /* Auto dismiss */
  setTimeout(() => {
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove(), { once:true });
  }, duration);

  /* Click to dismiss */
  toast.addEventListener('click', () => {
    toast.classList.add('exit');
    toast.addEventListener('animationend', () => toast.remove(), { once:true });
  });
}

/* Expose globally so export.js can call it */
window.showToast = showToast;

/* ════════════════════════════════════════════════════════════════
   20. LANGUAGE TOGGLE
   ════════════════════════════════════════════════════════════════ */
function initLangToggle() {
  $('btn-lang')?.addEventListener('click', () => {
    STATE.lang = STATE.lang === 'id' ? 'en' : 'id';
    localStorage.setItem(CFG.LS_LANG, STATE.lang);
    applyI18n();
    /* Re-render result if exists */
    if (STATE.currentResult) renderResult(STATE.currentResult);
    renderHistoryPreview();
    renderHistoryFull();
    /* Rebuild print & social checklists with new lang */
    buildPrintChecklist();
  });
}

/* ════════════════════════════════════════════════════════════════
   21. SCROLL TO TOP
   ════════════════════════════════════════════════════════════════ */
function initScrollTop() {
  const btn = $('btn-scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0.3';
  });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ════════════════════════════════════════════════════════════════
   22. SAVE TO HISTORY BUTTON
   ════════════════════════════════════════════════════════════════ */
function initSaveHistory() {
  $('btn-save-history')?.addEventListener('click', () => {
    if (!STATE.currentResult) { showToast(t('toast_no_result'), 'warning'); return; }
    const ok = addToHistory(STATE.currentResult);
    if (ok) showToast(t('toast_saved'), 'success');
  });
}

/* ════════════════════════════════════════════════════════════════
   23. RESET
   ════════════════════════════════════════════════════════════════ */
function initReset() {
  $('btn-reset')?.addEventListener('click', () => {
    hide('result-area');
    STATE.currentResult = null;
    const input = $('nominal-input');
    if (input) { input.value = ''; input.dispatchEvent(new Event('input')); input.focus(); }
    $('calc-card')?.scrollIntoView({ behavior:'smooth', block:'start' });
  });
}

/* ════════════════════════════════════════════════════════════════
   24. EXPORT OPEN BUTTON
   ════════════════════════════════════════════════════════════════ */
function initExportOpen() {
  $('btn-export-open')?.addEventListener('click', openExportModal);
}

/* ════════════════════════════════════════════════════════════════
   25. HISTORY BUTTONS
   ════════════════════════════════════════════════════════════════ */
function initHistoryButtons() {
  $('btn-history')?.addEventListener('click', openHistoryModal);
  $('btn-clear-history')?.addEventListener('click', clearHistory);
  $('btn-export-history')?.addEventListener('click', exportHistoryJSON);
}

/* ════════════════════════════════════════════════════════════════
   26. KEYBOARD SHORTCUTS
   ════════════════════════════════════════════════════════════════ */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    /* ESC closes modals */
    if (e.key === 'Escape') {
      closeExportModal();
      closeHistoryModal();
    }
    /* Ctrl+H opens history */
    if (e.ctrlKey && e.key === 'h') { e.preventDefault(); openHistoryModal(); }
    /* Ctrl+E opens export */
    if (e.ctrlKey && e.key === 'e') { e.preventDefault(); openExportModal(); }
  });
}

/* ════════════════════════════════════════════════════════════════
   27. HOVER RIPPLE EFFECT
   ════════════════════════════════════════════════════════════════ */
function initRipples() {
  function addRipple(el) {
    el.addEventListener('click', function(e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:0; height:0;
        background:rgba(212,160,23,0.25);
        transform:translate(-50%,-50%);
        left:${x}px; top:${y}px;
        animation:rippleAnim 0.6s ease-out both;
        pointer-events:none; z-index:999;
      `;
      if (!document.getElementById('ripple-style')) {
        const s = document.createElement('style');
        s.id = 'ripple-style';
        s.textContent = `@keyframes rippleAnim{to{width:300px;height:300px;opacity:0;}}`;
        document.head.appendChild(s);
      }
      this.style.position = this.style.position || 'relative';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  $$('.btn-hitung, .btn-export-do, .action-btn, .preset-chip, .nav-btn').forEach(addRipple);
}

/* ════════════════════════════════════════════════════════════════
   28. EXPOSE STATE FOR EXPORT.JS
   ════════════════════════════════════════════════════════════════ */
window.MBGState = STATE;
window.MBGConfig = CFG;
window.MBGFmt = { fmtRupiah, fmtDuration, t: () => t };
window.MBGComparisons = COMPARISONS;

/* ════════════════════════════════════════════════════════════════
   29. BOOT
   ════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* Device check */
  if (!detectDevice()) return;

  /* i18n */
  applyI18n();

  /* Init all modules */
  initInput();
  initLangToggle();
  initScrollTop();
  initSaveHistory();
  initReset();
  initExportOpen();
  initHistoryButtons();
  initModalClose();
  initKeyboard();
  initRipples();

  /* Load history from localStorage */
  loadHistory();

  /* Start intro */
  runIntro();
});
