/* ═══════════════════════════════════════════════════════════════
   MODERN MBG CALCULATOR — i18n.js
   Internationalisation Utility · ID / EN
   Loaded before app.js — safe to reference window.I18N
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Public namespace ── */
window.I18N_UTIL = (function () {

  /* All translatable strings live in app.js I18N const.
     This module provides helpers that can be called before app.js
     fully initialises (e.g. for any early-boot elements). */

  const SUPPORTED = ['id', 'en'];
  const LS_KEY    = 'mbg_lang';

  function getLang() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    /* Browser language detection */
    const browser = (navigator.language || 'id').split('-')[0].toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'id';
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(LS_KEY, lang);
    document.documentElement.lang = lang;
  }

  /* ── Number & currency formatters ── */
  function formatIDR(n, opts = {}) {
    const { short = false, noSymbol = false } = opts;
    if (n === null || n === undefined || isNaN(n)) return '—';
    const abs    = Math.abs(n);
    const prefix = noSymbol ? '' : 'Rp ';
    if (short) {
      if (abs >= 1e12) return prefix + (n / 1e12).toFixed(2).replace(/\.?0+$/, '') + ' T';
      if (abs >= 1e9)  return prefix + (n / 1e9).toFixed(1).replace(/\.0$/, '')   + ' M';
      if (abs >= 1e6)  return prefix + (n / 1e6).toFixed(1).replace(/\.0$/, '')   + ' jt';
      if (abs >= 1e3)  return prefix + (n / 1e3).toFixed(0) + ' rb';
      return prefix + n.toFixed(0);
    }
    return prefix + Math.round(n).toLocaleString('id-ID');
  }

  function formatNumber(n, decimals = 0) {
    if (isNaN(n)) return '—';
    return Number(n).toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /* ── Duration formatter ── */
  function formatDuration(seconds, lang) {
    const lg = lang || getLang();
    const labels = {
      id: { detik:'detik', menit:'menit', jam:'jam', hari:'hari',
            minggu:'minggu', bulan:'bulan', tahun:'tahun' },
      en: { detik:'seconds', menit:'minutes', jam:'hours', hari:'days',
            minggu:'weeks', bulan:'months', tahun:'years' },
    };
    const L = labels[lg] || labels.id;
    const t = seconds;
    if (t < 60)       return { num: t.toFixed(4),          unit: L.detik,  emoji:'⏱' };
    if (t < 3600)     return { num: (t/60).toFixed(4),     unit: L.menit,  emoji:'🕐' };
    if (t < 86400)    return { num: (t/3600).toFixed(4),   unit: L.jam,    emoji:'🕑' };
    if (t < 604800)   return { num: (t/86400).toFixed(6),  unit: L.hari,   emoji:'📅' };
    if (t < 2592000)  return { num: (t/604800).toFixed(6), unit: L.minggu, emoji:'📆' };
    if (t < 31536000) return { num: (t/2592000).toFixed(8),unit: L.bulan,  emoji:'🗓' };
    return               { num: (t/31536000).toFixed(10),  unit: L.tahun,  emoji:'📰' };
  }

  /* ── Relative time ── */
  function relativeTime(iso, lang) {
    const lg   = lang || getLang();
    const diff = Date.now() - new Date(iso).getTime();
    const m    = Math.floor(diff / 60000);
    const h    = Math.floor(m / 60);
    const d    = Math.floor(h / 24);
    if (lg === 'id') {
      if (m < 1)   return 'baru saja';
      if (m < 60)  return `${m} mnt lalu`;
      if (h < 24)  return `${h} jam lalu`;
      return `${d} hari lalu`;
    } else {
      if (m < 1)   return 'just now';
      if (m < 60)  return `${m}m ago`;
      if (h < 24)  return `${h}h ago`;
      return `${d}d ago`;
    }
  }

  /* ── Date formatter ── */
  function formatDate(iso, lang) {
    const lg   = lang || getLang();
    const date = new Date(iso);
    const locale = lg === 'id' ? 'id-ID' : 'en-GB';
    return date.toLocaleString(locale, {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });
  }

  /* ── Apply data-i18n attributes to DOM ── */
  function applyDOM(strings, lang) {
    if (!strings || !strings[lang]) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = strings[lang][key];
      if (val !== undefined) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      const val = strings[lang][key];
      if (val !== undefined) el.placeholder = val;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = strings[lang][key];
      if (val !== undefined) el.title = val;
    });
  }

  /* ── Pluralise (simple ID/EN) ── */
  function plural(n, singular, plural, lang) {
    const lg = lang || getLang();
    if (lg === 'id') return `${n} ${singular}`; /* ID has no plural form */
    return `${n} ${n === 1 ? singular : plural}`;
  }

  /* ── Expose ── */
  return {
    getLang,
    setLang,
    formatIDR,
    formatNumber,
    formatDuration,
    relativeTime,
    formatDate,
    applyDOM,
    plural,
    SUPPORTED,
  };

})();
