/* ═══════════════════════════════════════════════════════════════
   MODERN MBG CALCULATOR — export.js
   Canvas Export Engine · PNG · Preview · Watermark
   ═══════════════════════════════════════════════════════════════ */

'use strict';

window.MBGExport = (function () {

  const WATERMARK = 'Modern MBG Calculator';

  /* ── palette mirrors style.css tokens ── */
  const THEME = {
    bg0:        '#050400',
    bg1:        '#0a0800',
    bg2:        '#141000',
    gold:       '#d4a017',
    goldBright: '#f0c040',
    goldDim:    '#9a6f00',
    text:       '#f5f0e0',
    text2:      '#c8b888',
    text3:      '#8a7a50',
    border:     'rgba(212,160,23,0.25)',
  };

  /* ════════════════════════════════════════════════════════════
     CORE: draw the result card onto a canvas
     ════════════════════════════════════════════════════════════ */
  function drawCard(canvas, result, lang, opts = {}) {
    const W   = canvas.width;
    const H   = canvas.height;
    const cx  = canvas.getContext('2d');
    const sc  = opts.scale || 1;          /* pixel density */
    const pad = Math.round(60 * (W / 1920));

    /* ── background ── */
    const bgGrad = cx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0,   '#050400');
    bgGrad.addColorStop(0.5, '#0a0800');
    bgGrad.addColorStop(1,   '#050400');
    cx.fillStyle = bgGrad;
    cx.fillRect(0, 0, W, H);

    /* subtle grid */
    cx.save();
    cx.strokeStyle = 'rgba(212,160,23,0.04)';
    cx.lineWidth   = 1;
    const gridStep = Math.round(60 * (W / 1920));
    for (let x = 0; x < W; x += gridStep) { cx.beginPath(); cx.moveTo(x,0); cx.lineTo(x,H); cx.stroke(); }
    for (let y = 0; y < H; y += gridStep) { cx.beginPath(); cx.moveTo(0,y); cx.lineTo(W,y); cx.stroke(); }
    cx.restore();

    /* ambient glow top-left */
    const glowL = cx.createRadialGradient(0, 0, 0, 0, 0, W * 0.6);
    glowL.addColorStop(0,   'rgba(212,160,23,0.12)');
    glowL.addColorStop(1,   'rgba(0,0,0,0)');
    cx.fillStyle = glowL; cx.fillRect(0, 0, W, H);

    /* ambient glow bottom-right */
    const glowR = cx.createRadialGradient(W, H, 0, W, H, W * 0.5);
    glowR.addColorStop(0,   'rgba(160,100,0,0.1)');
    glowR.addColorStop(1,   'rgba(0,0,0,0)');
    cx.fillStyle = glowR; cx.fillRect(0, 0, W, H);

    /* ── glass card ── */
    const cX    = pad;
    const cY    = pad;
    const cW    = W - pad * 2;
    const cH    = H - pad * 2;
    const cR    = Math.round(24 * (W / 1920));

    cx.save();
    cx.beginPath();
    roundRect(cx, cX, cY, cW, cH, cR);
    cx.fillStyle = 'rgba(15,12,0,0.72)';
    cx.fill();
    cx.strokeStyle = 'rgba(212,160,23,0.22)';
    cx.lineWidth   = Math.max(1, Math.round(2 * (W / 1920)));
    cx.stroke();
    cx.restore();

    /* glass top shimmer line */
    cx.save();
    const shimmer = cx.createLinearGradient(cX, cY, cX + cW, cY);
    shimmer.addColorStop(0,   'rgba(212,160,23,0)');
    shimmer.addColorStop(0.5, 'rgba(212,160,23,0.4)');
    shimmer.addColorStop(1,   'rgba(212,160,23,0)');
    cx.strokeStyle = shimmer;
    cx.lineWidth   = Math.max(1, Math.round(1 * (W / 1920)));
    cx.beginPath();
    cx.moveTo(cX + cR, cY);
    cx.lineTo(cX + cW - cR, cY);
    cx.stroke();
    cx.restore();

    /* ── header: logos ── */
    const fBase = Math.round(16 * (W / 1920));
    const inner = pad * 1.6;

    cx.save();
    cx.font         = `700 ${fBase}px Inter, sans-serif`;
    cx.fillStyle    = THEME.gold;
    cx.textBaseline = 'middle';
    const bgnPill = drawPill(cx, inner, inner, 'BGN', fBase, THEME.gold, 'rgba(212,160,23,0.15)');
    const mbgPill = drawPill(cx, inner + bgnPill + Math.round(10*(W/1920)), inner, 'MBG', fBase, THEME.goldBright, 'rgba(255,215,0,0.12)');
    cx.restore();

    /* brand name */
    cx.save();
    const brandF = Math.round(22 * (W / 1920));
    cx.font         = `700 ${brandF}px Syne, sans-serif`;
    cx.fillStyle    = THEME.text;
    cx.textBaseline = 'middle';
    cx.fillText('Modern MBG Calculator', inner + bgnPill + mbgPill + Math.round(20*(W/1920)), inner + fBase * 0.5);
    cx.restore();

    /* ── divider ── */
    const divY = inner + fBase * 2.2;
    cx.save();
    const divGrad = cx.createLinearGradient(inner, divY, inner + cW - pad*2, divY);
    divGrad.addColorStop(0,   'rgba(212,160,23,0)');
    divGrad.addColorStop(0.5, 'rgba(212,160,23,0.3)');
    divGrad.addColorStop(1,   'rgba(212,160,23,0)');
    cx.strokeStyle = divGrad;
    cx.lineWidth   = 1;
    cx.beginPath(); cx.moveTo(inner, divY); cx.lineTo(inner + cW - pad*1.2, divY); cx.stroke();
    cx.restore();

    /* ── nominal label ── */
    const lblY  = divY + Math.round(40 * (H / 1080));
    const lblF  = Math.round(14 * (W / 1920));
    cx.save();
    cx.font         = `400 ${lblF}px Inter, sans-serif`;
    cx.fillStyle    = THEME.text3;
    cx.textBaseline = 'top';
    cx.fillText(lang === 'id' ? 'NOMINAL YANG DIMASUKKAN' : 'AMOUNT ENTERED', inner, lblY);
    cx.restore();

    /* ── nominal value ── */
    const nomY  = lblY + lblF * 1.8;
    const nomF  = Math.round(42 * (W / 1920));
    cx.save();
    cx.font         = `800 ${nomF}px Syne, sans-serif`;
    cx.fillStyle    = THEME.goldBright;
    cx.textBaseline = 'top';
    cx.shadowColor  = 'rgba(212,160,23,0.4)';
    cx.shadowBlur   = Math.round(20 * (W / 1920));
    cx.fillText(fmtRupiah(result.nominal), inner, nomY);
    cx.restore();

    /* ── equals label ── */
    const eqY  = nomY + nomF * 1.5;
    const eqF  = Math.round(13 * (W / 1920));
    cx.save();
    cx.font         = `400 ${eqF}px Inter, sans-serif`;
    cx.fillStyle    = THEME.text3;
    cx.textBaseline = 'top';
    cx.letterSpacing = '2px';
    cx.fillText(lang === 'id' ? 'SETARA DENGAN' : 'EQUALS', inner, eqY);
    cx.restore();

    /* ── main result ── */
    const dur    = window.I18N_UTIL?.formatDuration(result.detik, lang)
                 || fallbackDur(result.detik, lang);
    const mainY  = eqY + eqF * 2.0;
    const mainF  = Math.round(52 * (W / 1920));
    cx.save();
    cx.font         = `800 ${mainF}px Syne, sans-serif`;
    cx.fillStyle    = THEME.gold;
    cx.textBaseline = 'top';
    cx.shadowColor  = 'rgba(212,160,23,0.5)';
    cx.shadowBlur   = Math.round(30 * (W / 1920));
    cx.fillText(`${dur.emoji} ${parseFloat(dur.num).toLocaleString('id-ID')} ${dur.unit}`, inner, mainY);
    cx.restore();

    /* ── breakdown row ── */
    const brkY    = mainY + mainF * 1.8;
    const brkGap  = Math.round((cW - pad*1.2) / 4);
    const breakdowns = [
      { label: lang==='id' ? 'Detik MBG'  : 'MBG Seconds',  val: result.detik.toFixed(2) },
      { label: lang==='id' ? 'Jam MBG'    : 'MBG Hours',    val: (result.detik/3600).toFixed(4) },
      { label: lang==='id' ? 'Hari MBG'   : 'MBG Days',     val: (result.detik/86400).toFixed(6) },
      { label: lang==='id' ? 'Porsi Makan': 'Meal Servings', val: Math.round(result.porsi).toLocaleString('id-ID') },
    ];

    const brkF     = Math.round(11 * (W / 1920));
    const brkValF  = Math.round(18 * (W / 1920));
    const brkH     = Math.round(70 * (H / 1080));

    breakdowns.forEach((b, i) => {
      const bx = inner + i * brkGap;
      /* pill bg */
      cx.save();
      cx.beginPath();
      roundRect(cx, bx, brkY, brkGap - Math.round(12*(W/1920)), brkH, Math.round(10*(W/1920)));
      cx.fillStyle = 'rgba(212,160,23,0.07)';
      cx.fill();
      cx.strokeStyle = 'rgba(212,160,23,0.15)';
      cx.lineWidth   = 1;
      cx.stroke();
      cx.restore();
      /* label */
      cx.save();
      cx.font         = `400 ${brkF}px Inter, sans-serif`;
      cx.fillStyle    = THEME.text3;
      cx.textBaseline = 'top';
      cx.textAlign    = 'center';
      cx.fillText(b.label.toUpperCase(), bx + (brkGap - Math.round(12*(W/1920)))/2, brkY + Math.round(10*(H/1080)));
      cx.restore();
      /* value */
      cx.save();
      cx.font         = `700 ${brkValF}px Syne, sans-serif`;
      cx.fillStyle    = THEME.goldBright;
      cx.textBaseline = 'top';
      cx.textAlign    = 'center';
      const vY        = brkY + brkH / 2;
      cx.fillText(b.val, bx + (brkGap - Math.round(12*(W/1920)))/2, vY);
      cx.restore();
    });

    /* ── footer bar ── */
    const ftY  = H - pad * 0.9;
    const ftF  = Math.round(12 * (W / 1920));
    cx.save();
    cx.font         = `400 ${ftF}px Inter, sans-serif`;
    cx.fillStyle    = THEME.text3;
    cx.textBaseline = 'middle';
    /* left: watermark */
    cx.textAlign = 'left';
    cx.fillText(WATERMARK, inner, ftY);
    /* right: date */
    cx.textAlign = 'right';
    const dateStr = new Date().toLocaleString(lang==='id' ? 'id-ID' : 'en-GB', {
      day:'2-digit', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit',
    });
    cx.fillText(dateStr, inner + cW - pad*0.6, ftY);
    /* center: url hint */
    cx.textAlign    = 'center';
    cx.fillStyle    = THEME.goldDim;
    cx.fillText('Fun calculator · Bukan afiliasi pemerintah', W/2, ftY);
    cx.restore();

    return canvas;
  }

  /* ── rounded rect path helper (polyfill) ── */
  function roundRect(cx, x, y, w, h, r) {
    if (typeof cx.roundRect === 'function') {
      cx.roundRect(x, y, w, h, r);
    } else {
      cx.moveTo(x + r, y);
      cx.lineTo(x + w - r, y);
      cx.quadraticCurveTo(x + w, y, x + w, y + r);
      cx.lineTo(x + w, y + h - r);
      cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      cx.lineTo(x + r, y + h);
      cx.quadraticCurveTo(x, y + h, x, y + h - r);
      cx.lineTo(x, y + r);
      cx.quadraticCurveTo(x, y, x + r, y);
      cx.closePath();
    }
  }

  /* ── draw badge pill, returns width used ── */
  function drawPill(cx, x, y, text, fontSize, textColor, bgColor) {
    const pad    = fontSize * 0.7;
    const height = fontSize * 1.8;
    cx.save();
    cx.font         = `800 ${fontSize}px Inter, sans-serif`;
    const tw        = cx.measureText(text).width;
    const pw        = tw + pad * 2;
    cx.beginPath();
    roundRect(cx, x, y - height/2, pw, height, Math.round(fontSize * 0.3));
    cx.fillStyle    = bgColor;
    cx.fill();
    cx.strokeStyle  = textColor.replace(')', ',0.35)').replace('rgb','rgba').replace('#', 'rgba(');
    /* simpler border */
    cx.strokeStyle  = textColor;
    cx.globalAlpha  = 0.3;
    cx.lineWidth    = 1;
    cx.stroke();
    cx.globalAlpha  = 1;
    cx.fillStyle    = textColor;
    cx.textAlign    = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(text, x + pw/2, y);
    cx.restore();
    return pw + Math.round(fontSize * 0.5);
  }

  function fmtRupiah(n) {
    if (window.MBGFmt?.fmtRupiah) return window.MBGFmt.fmtRupiah(n);
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
  }

  function fallbackDur(seconds, lang) {
    const t = seconds;
    if (t < 60)    return { num: t.toFixed(4),        unit: lang==='id'?'detik':'seconds', emoji:'⏱' };
    if (t < 3600)  return { num: (t/60).toFixed(4),   unit: lang==='id'?'menit':'minutes', emoji:'🕐' };
    if (t < 86400) return { num: (t/3600).toFixed(4), unit: lang==='id'?'jam':'hours',     emoji:'🕑' };
    return           { num: (t/86400).toFixed(6),      unit: lang==='id'?'hari':'days',     emoji:'📅' };
  }

  /* ════════════════════════════════════════════════════════════
     DOWNLOAD PNG
     ════════════════════════════════════════════════════════════ */
  async function downloadPNG(result, resolution, lang, filenameBase) {
    const canvas  = document.getElementById('export-canvas');
    if (!canvas) throw new Error('export-canvas not found');

    canvas.width  = resolution.w;
    canvas.height = resolution.h;

    drawCard(canvas, result, lang || 'id', { scale: resolution.scale });

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('Canvas toBlob failed')); return; }
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        const name = filenameBase || 'mbg_result';
        a.download = `${name}_${resolution.id}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    });
  }

  /* ════════════════════════════════════════════════════════════
     RENDER PREVIEW (small, into #export-preview div)
     ════════════════════════════════════════════════════════════ */
  function renderPreview(result, lang) {
    const container = document.getElementById('export-preview');
    if (!container || !result) return;

    /* Create a small canvas */
    let previewCanvas = container.querySelector('canvas.preview-canvas');
    if (!previewCanvas) {
      previewCanvas = document.createElement('canvas');
      previewCanvas.className = 'preview-canvas';
      previewCanvas.style.cssText = 'width:100%;height:100%;display:block;';
      container.appendChild(previewCanvas);
    }

    const W = container.clientWidth  || 300;
    const H = container.clientHeight || 169;
    previewCanvas.width  = W * 2;  /* retina */
    previewCanvas.height = H * 2;

    drawCard(previewCanvas, result, lang || 'id', { scale: 2 });
  }

  /* ════════════════════════════════════════════════════════════
     AUTO-RENDER PREVIEW when export modal opens
     (called by app.js initExportModal via MutationObserver)
     ════════════════════════════════════════════════════════════ */
  function init() {
    /* Watch for export modal becoming visible */
    const overlay = document.getElementById('export-modal-overlay');
    if (!overlay) return;

    const observer = new MutationObserver(() => {
      if (!overlay.classList.contains('hidden')) {
        const state = window.MBGState;
        if (state?.currentResult) {
          renderPreview(state.currentResult, state.lang);
        }
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('DOMContentLoaded', init);

  /* ── public API ── */
  return { downloadPNG, renderPreview, drawCard };

})();
