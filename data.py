#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
Modern MBG Calculator — data.py
Data Analysis · Validation · Export Utilities

Gunakan file ini untuk:
1. Validasi angka-angka anggaran MBG
2. Melihat breakdown per waktu
3. Generate tabel perbandingan
4. Export ke JSON/CSV untuk kebutuhan update config
═══════════════════════════════════════════════════════════════
"""

import json
import csv
import math
import datetime
from pathlib import Path

# ── KONSTANTA ANGGARAN MBG ────────────────────────────────────
MBG = {
    "anggaran_per_hari_2026":    1_200_000_000_000,   # Rp 1,2 T
    "anggaran_per_tahun_2025":  71_000_000_000_000,   # Rp 71 T
    "anggaran_per_tahun_2026": 335_000_000_000_000,   # Rp 335 T
    "realisasi_2025":           51_500_000_000_000,   # Rp 51,5 T
    "harga_per_porsi":                     14_476,   # Rp 14.476
    "penerima_target_2026":             82_900_000,   # 82,9 juta
    "penerima_2025":                    56_130_000,   # 56,13 juta
    "sppg_aktif":                            7_475,
    "sppg_target":                          30_000,
    "hari_sekolah_pertahun":                   240,
    "mulai_program":              "2025-01-06",
}

# ── PEMBANDING ───────────────────────────────────────────────
COMPARISONS = [
    {"id": "gaji_umr",   "label": "Gaji UMR DKI 2025 (per bulan)",    "value": 5_067_381},
    {"id": "iphone",     "label": "iPhone 15 Pro",                      "value": 21_999_000},
    {"id": "avanza",     "label": "Toyota Avanza baru",                 "value": 230_000_000},
    {"id": "rumah",      "label": "Rumah subsidi (rata-rata)",          "value": 160_000_000},
    {"id": "ukt",        "label": "UKT PTN per semester",               "value": 5_000_000},
    {"id": "bos",        "label": "Dana BOS per siswa/tahun",           "value": 900_000},
    {"id": "netflix",    "label": "Netflix Premium 1 tahun",            "value": 1_908_000},
    {"id": "tiket_bali", "label": "Tiket Jakarta–Bali PP",              "value": 1_800_000},
    {"id": "listrik",    "label": "Tagihan listrik rata-rata/bulan",    "value": 500_000},
    {"id": "makan",      "label": "Makan restoran sekali",              "value": 75_000},
]

# ─────────────────────────────────────────────────────────────
# 1. FORMATTER
# ─────────────────────────────────────────────────────────────

def fmt_idr(n: float, short: bool = False) -> str:
    """Format angka ke format Rupiah Indonesia."""
    if n is None or math.isnan(n):
        return "—"
    abs_n = abs(n)
    if short:
        if abs_n >= 1e12: return f"Rp {n/1e12:.2f} T"
        if abs_n >= 1e9:  return f"Rp {n/1e9:.1f} M"
        if abs_n >= 1e6:  return f"Rp {n/1e6:.1f} jt"
        if abs_n >= 1e3:  return f"Rp {n/1e3:.0f} rb"
        return f"Rp {n:.0f}"
    return f"Rp {int(n):,}".replace(",", ".")


def fmt_duration(seconds: float) -> dict:
    """Konversi detik ke satuan waktu terbaik."""
    t = seconds
    if t < 60:       return {"num": f"{t:.4f}",            "unit": "detik",  "emoji": "⏱"}
    if t < 3600:     return {"num": f"{t/60:.4f}",         "unit": "menit",  "emoji": "🕐"}
    if t < 86400:    return {"num": f"{t/3600:.4f}",       "unit": "jam",    "emoji": "🕑"}
    if t < 604800:   return {"num": f"{t/86400:.6f}",      "unit": "hari",   "emoji": "📅"}
    if t < 2592000:  return {"num": f"{t/604800:.6f}",     "unit": "minggu", "emoji": "📆"}
    if t < 31536000: return {"num": f"{t/2592000:.8f}",    "unit": "bulan",  "emoji": "🗓"}
    return               {"num": f"{t/31536000:.10f}",     "unit": "tahun",  "emoji": "📰"}


# ─────────────────────────────────────────────────────────────
# 2. KALKULASI UTAMA
# ─────────────────────────────────────────────────────────────

def calculate(nominal: float) -> dict:
    """
    Hitung perbandingan nominal terhadap anggaran MBG per hari.

    Returns:
        dict dengan semua breakdown waktu dan perbandingan
    """
    per_hari = MBG["anggaran_per_hari_2026"]
    ratio    = nominal / per_hari
    detik    = ratio * 86400
    porsi    = nominal / MBG["harga_per_porsi"]

    dur = fmt_duration(detik)

    result = {
        "nominal":         nominal,
        "nominal_fmt":     fmt_idr(nominal),
        "ratio":           ratio,
        "ratio_pct":       f"{ratio*100:.8f}%",
        "main_result":     f"{dur['emoji']} {float(dur['num']):.4f} {dur['unit']}",
        "breakdown": {
            "detik":  f"{detik:.4f}",
            "menit":  f"{detik/60:.4f}",
            "jam":    f"{detik/3600:.6f}",
            "hari":   f"{detik/86400:.8f}",
            "minggu": f"{detik/604800:.10f}",
            "bulan":  f"{detik/2592000:.12f}",
            "tahun":  f"{detik/31536000:.14f}",
        },
        "porsi":           int(porsi),
        "timestamp":       datetime.datetime.now().isoformat(),
    }

    # Perbandingan
    result["comparisons"] = []
    for c in COMPARISONS:
        count = nominal / c["value"]
        result["comparisons"].append({
            "id":     c["id"],
            "label":  c["label"],
            "count":  round(count, 4),
            "count_fmt": f"{count:.2f}×" if count >= 1 else f"{count*100:.4f}%",
        })

    return result


# ─────────────────────────────────────────────────────────────
# 3. BREAKDOWN ANGGARAN
# ─────────────────────────────────────────────────────────────

def print_anggaran_breakdown():
    """Print tabel breakdown anggaran MBG per satuan waktu."""
    per_hari = MBG["anggaran_per_hari_2026"]

    rows = [
        ("Per detik",      per_hari / 86400),
        ("Per menit",      per_hari / 1440),
        ("Per jam",        per_hari / 24),
        ("Per hari",       per_hari),
        ("Per minggu",     per_hari * 5),        # 5 hari kerja
        ("Per bulan",      per_hari * 20),        # 20 hari sekolah
        ("Per tahun 2026", MBG["anggaran_per_tahun_2026"]),
    ]

    print("\n" + "═" * 60)
    print("  BREAKDOWN ANGGARAN MBG PER SATUAN WAKTU")
    print("═" * 60)
    for label, val in rows:
        print(f"  {label:<20}  {fmt_idr(val, short=True):>14}  ({fmt_idr(val)})")
    print("═" * 60)


# ─────────────────────────────────────────────────────────────
# 4. VALIDASI DATA
# ─────────────────────────────────────────────────────────────

def validate_data() -> list[dict]:
    """Validasi konsistensi data MBG. Returns list of issues."""
    issues = []

    per_hari  = MBG["anggaran_per_hari_2026"]
    per_tahun = MBG["anggaran_per_tahun_2026"]

    # Cek: per_hari × 240 hari ≈ per_tahun (rough check)
    expected_year = per_hari * 240
    diff_pct = abs(expected_year - per_tahun) / per_tahun * 100
    if diff_pct > 50:
        issues.append({
            "severity": "WARNING",
            "field":    "anggaran_per_hari vs per_tahun",
            "msg":      f"Selisih {diff_pct:.1f}% — periksa kembali asumsi hari sekolah",
        })

    # Cek: realisasi <= anggaran
    if MBG["realisasi_2025"] > MBG["anggaran_per_tahun_2025"]:
        issues.append({
            "severity": "ERROR",
            "field":    "realisasi_2025",
            "msg":      "Realisasi melebihi anggaran 2025 — data mungkin salah",
        })

    # Cek: harga per porsi masuk akal (Rp 5000 – Rp 50000)
    if not (5_000 <= MBG["harga_per_porsi"] <= 50_000):
        issues.append({
            "severity": "WARNING",
            "field":    "harga_per_porsi",
            "msg":      f"Harga porsi Rp {MBG['harga_per_porsi']:,} di luar rentang normal (5rb–50rb)",
        })

    # Cek: penerima masuk akal
    if MBG["penerima_target_2026"] < MBG["penerima_2025"]:
        issues.append({
            "severity": "ERROR",
            "field":    "penerima_target_2026",
            "msg":      "Target 2026 lebih kecil dari realisasi 2025",
        })

    return issues


def run_validation():
    """Jalankan validasi dan print hasilnya."""
    print("\n" + "═" * 60)
    print("  VALIDASI DATA MBG")
    print("═" * 60)
    issues = validate_data()
    if not issues:
        print("  ✓ Semua data valid — tidak ada masalah ditemukan")
    else:
        for issue in issues:
            icon = "❌" if issue["severity"] == "ERROR" else "⚠️"
            print(f"  {icon} [{issue['severity']}] {issue['field']}")
            print(f"     → {issue['msg']}")
    print("═" * 60)


# ─────────────────────────────────────────────────────────────
# 5. EXPORT UTILITIES
# ─────────────────────────────────────────────────────────────

def export_config_json(output_path: str = "config_generated.json"):
    """Generate/update config.json dengan data terbaru."""
    config = {
        "app": {
            "name":             "Modern MBG Calculator",
            "version":          "1.0.0",
            "watermark":        "Modern MBG Calculator",
            "defaultLang":      "id",
            "historyLimit":     50,
            "introDurationMs":  4500,
            "calcDelayMs":      10000,
        },
        "mbg": {k: v for k, v in MBG.items()},
        "comparisons": COMPARISONS,
        "generated_at": datetime.datetime.now().isoformat(),
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

    print(f"\n  ✓ Config JSON diekspor ke: {output_path}")
    return output_path


def export_comparisons_csv(output_path: str = "comparisons.csv"):
    """Export tabel perbandingan ke CSV."""
    per_hari = MBG["anggaran_per_hari_2026"]

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["ID", "Label", "Nilai (Rp)", "Setara dari 1 Hari MBG", "Catatan"])
        for c in COMPARISONS:
            setara = per_hari / c["value"]
            writer.writerow([
                c["id"],
                c["label"],
                c["value"],
                f"{setara:.2f}×",
                f"1 hari MBG = {setara:.2f} {c['label'].lower()}",
            ])

    print(f"  ✓ Comparisons CSV diekspor ke: {output_path}")
    return output_path


def export_sample_calculations(output_path: str = "sample_calculations.json"):
    """Generate sample calculations untuk testing."""
    test_values = [
        50_000,
        500_000,
        5_000_000,
        100_000_000,
        1_000_000_000,
        10_000_000_000,
        100_000_000_000,
        1_200_000_000_000,    # = 1 hari MBG
        2_400_000_000_000,    # = 2 hari MBG
        335_000_000_000_000,  # = 1 tahun MBG 2026
    ]

    samples = []
    for val in test_values:
        result = calculate(val)
        samples.append({
            "nominal":     val,
            "nominal_fmt": fmt_idr(val),
            "main_result": result["main_result"],
            "ratio_pct":   result["ratio_pct"],
            "porsi":       result["porsi"],
        })

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(samples, f, indent=2, ensure_ascii=False)

    print(f"  ✓ Sample calculations diekspor ke: {output_path}")
    return output_path


# ─────────────────────────────────────────────────────────────
# 6. DEMO / QUICK CALC
# ─────────────────────────────────────────────────────────────

def demo_calculations():
    """Print hasil kalkulator untuk beberapa nilai nominal."""
    test_cases = [
        50_000,
        500_000,
        5_000_000,
        1_200_000_000_000,
    ]

    print("\n" + "═" * 60)
    print("  DEMO PERHITUNGAN")
    print("═" * 60)
    for nominal in test_cases:
        r = calculate(nominal)
        print(f"\n  Nominal : {r['nominal_fmt']}")
        print(f"  Hasil   : {r['main_result']}")
        print(f"  Rasio   : {r['ratio_pct']} dari 1 hari MBG")
        print(f"  Porsi   : {r['porsi']:,} porsi makan")
        top3 = sorted(r["comparisons"], key=lambda x: abs(math.log10(max(x["count"], 1e-9))))[:3]
        for c in top3:
            print(f"           ≈ {c['count_fmt']} {c['label']}")
    print("\n" + "═" * 60)


# ─────────────────────────────────────────────────────────────
# 7. MAIN
# ─────────────────────────────────────────────────────────────

def main():
    print("\n" + "╔" + "═"*58 + "╗")
    print("║" + "  Modern MBG Calculator — data.py".center(58) + "║")
    print("║" + f"  {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}".center(58) + "║")
    print("╚" + "═"*58 + "╝")

    # 1. Validasi
    run_validation()

    # 2. Breakdown anggaran
    print_anggaran_breakdown()

    # 3. Demo kalkulasi
    demo_calculations()

    # 4. Export files
    print("\n" + "═" * 60)
    print("  EXPORT FILES")
    print("═" * 60)
    export_config_json()
    export_comparisons_csv()
    export_sample_calculations()

    print("\n  Selesai! ✓\n")


if __name__ == "__main__":
    main()
