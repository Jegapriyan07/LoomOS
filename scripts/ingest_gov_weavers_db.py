#!/usr/bin/env python3
"""
Ingest DC (Handlooms) Weavers Database PDFs into LoomOS seed JSON.

- Downloads public campaign PDFs from handlooms.nic.in
- Writes data/gov-state-rollups.json (summary table)
- Enriches data/gov-weavers-clusters.json with campaign-derived
  weaverCount, densityWeight, categoryHints, products, weaves, GI, societies

Privacy: never writes phone, email, or street address into output JSON.
Not a census — National Handloom Day social-media campaign listings only.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from collections import defaultdict
from pathlib import Path

try:
    import fitz  # pymupdf
except ImportError:
    print("pymupdf required: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
CACHE = ROOT / ".cache" / "gov-weavers-db"
SEED_PATH = DATA / "gov-weavers-clusters.json"
ROLLUPS_PATH = DATA / "gov-state-rollups.json"

BASE = "https://handlooms.nic.in/assets/img/Weavers%20Database/"
INDEX_URL = "https://handlooms.nic.in/weavers_database.php"
AS_OF = "2026-07-31"

# PDF key → (loomos state name, filename)
STATE_PDFS: dict[str, tuple[str, str]] = {
    "andhra-pradesh": ("Andhra Pradesh", "AndhraPradesh637322639016656206.pdf"),
    "arunachal-pradesh": (
        "Arunachal Pradesh",
        "Arunachal%20Pradesh637322639707423425.pdf",
    ),
    "assam": ("Assam", "Assam637322640163599080.pdf"),
    "bihar": ("Bihar", "Bihar637322641206682015.pdf"),
    "chhattisgarh": ("Chhattisgarh", "Chhattisgarh637322642752617722.pdf"),
    "delhi": ("Delhi", "Delhi637322643521767505.pdf"),
    "gujarat": ("Gujarat", "Gujarat637322644330760333.pdf"),
    "haryana": ("Haryana", "Haryana637322646666149322.pdf"),
    "himachal-pradesh": ("Himachal Pradesh", "HP637322648180250133.pdf"),
    "jammu-and-kashmir": ("Jammu and Kashmir", "J_K637322649046141402.pdf"),
    "jharkhand": ("Jharkhand", "Jharkhand637322650354857310.pdf"),
    "karnataka": ("Karnataka", "Karnataka637322651098314398.pdf"),
    "kerala": ("Kerala", "Kerala637322651647111179.pdf"),
    "madhya-pradesh": ("Madhya Pradesh", "MP637322653330389383.pdf"),
    "maharashtra-mumbai": ("Maharashtra", "Mumbai637322654371998399.pdf"),
    "maharashtra-nagpur": ("Maharashtra", "Nagpur637322654970125868.pdf"),
    "manipur": ("Manipur", "Manipur637322655776576554.pdf"),
    "meghalaya": ("Meghalaya", "Meghalaya637322656673759958.pdf"),
    "mizoram": ("Mizoram", "Mizoram637322657174401344.pdf"),
    "nagaland": ("Nagaland", "Nagaland637322657993340586.pdf"),
    "odisha": ("Odisha", "Odisha637322660372253324.pdf"),
    "punjab": ("Punjab", "Punjab637322661648519404.pdf"),
    "rajasthan": ("Rajasthan", "Rajasthan637322663642953682.pdf"),
    "sikkim": ("Sikkim", "Sikkim637322664326866554.pdf"),
    "tamil-nadu": ("Tamil Nadu", "Tamil%20Nadu637322662691473123.pdf"),
    "telangana": ("Telangana", "Telangana637322665203113733.pdf"),
    "tripura": ("Tripura", "Tripura637322665779537071.pdf"),
    "uttar-pradesh": ("Uttar Pradesh", "UP637322666574917584.pdf"),
    "uttarakhand": ("Uttarakhand", "Uttrakhand637322667317207246.pdf"),
    "west-bengal": ("West Bengal", "WestBengal637322668102237689.pdf"),
}

COMPLETE_PDF = "Complete%20list%20district.pdf"

# Summary-table state labels → LoomOS state
SUMMARY_STATE_MAP = {
    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "delhi": "Delhi",
    "gujarat": "Gujarat",
    "h.p.": "Himachal Pradesh",
    "hp": "Himachal Pradesh",
    "himachal pradesh": "Himachal Pradesh",
    "haryana": "Haryana",
    "j&k": "Jammu and Kashmir",
    "j & k": "Jammu and Kashmir",
    "jammu and kashmir": "Jammu and Kashmir",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "m.p.": "Madhya Pradesh",
    "mp": "Madhya Pradesh",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra (mumbai)": "Maharashtra",
    "maharashtra (nagpur)": "Maharashtra",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "u.p.": "Uttar Pradesh",
    "up": "Uttar Pradesh",
    "uttar pradesh": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "west bengal": "West Bengal",
}

DISTRICT_ALIASES = {
    "kancheepuram": "kanchipuram",
    "kanchipuram": "kanchipuram",
    "thiruvannamalai": "thiruvannamalai",
    "tiruvannamalai": "thiruvannamalai",
    "ramanathapuram": "paramakudi",
    "sivagangai": "karaikudi",
    "sivaganga": "karaikudi",
    "namakkal": "salem",
    "tiruppur": "coimbatore",
    "tirupur": "coimbatore",
    "pondicherry": "puducherry",
    "puducherry": "puducherry",
    "kanyakumari": "tirunelveli",
    "kanniyakumari": "tirunelveli",
    "chennai": "chennai",
    "thanjavur": "thanjavur",
    "tanjore": "thanjavur",
    "tiruchirappalli": "trichy",
    "trichy": "trichy",
    "tirunelveli": "tirunelveli",
    "nellore": "nellore",
    "chittoor": "chittoor",
    "chittore": "chittoor",
    "venkatagiri": "venkatagiri",
    "ludhiana": "ludhiana",
    "gangtok": "gangtok",
    "east sikkim": "gangtok",
    "shahdara": "shahdara",
    "varanasi": "varanasi",
    "banaras": "varanasi",
    "benaras": "varanasi",
    "sualkuchi": "sualkuchi",
    "kamrup": "sualkuchi",
    "bhagalpur": "bhagalpur",
    "patan": "patan",
    "surendranagar": "surendranagar",
    "jamnagar": "jamnagar",
    "kutch": "kutch",
    "ahmedabad": "ahmedabad",
    "kota": "kota",
    "bagru": "bagru",
    "jaipur": "jaipur",
    "barmer": "barmer",
    "jodhpur": "jodhpur",
    "paithan": "paithan",
    "solapur": "solapur",
    "nagpur": "nagpur",
    "yeola": "yeola",
    "aurangabad": "aurangabad",
    "patiala": "patiala",
    "amritsar": "amritsar",
    "panipat": "panipat",
    "kullu": "kullu",
    "srinagar": "srinagar",
    "baramulla": "baramulla",
    "almora": "almora",
    "bastar": "bastar",
    "raigarh": "raigarh",
    "ranchi": "ranchi",
    "dumka": "dumka",
    "agartala": "agartala",
    "imphal": "imphal",
    "aizawl": "aizawl",
    "kohima": "kohima",
    "itanagar": "itanagar",
    "shillong": "shillong",
    "pochampally": "pochampally",
    "gadwal": "gadwal",
    "narayanpet": "narayanpet",
    "siddipet": "siddipet",
    "karimnagar": "karimnagar",
    "warangal": "warangal",
    "nalgonda": "nalgonda",
    "mangalagiri": "mangalagiri",
    "uppada": "uppada",
    "dharmavaram": "dharmavaram",
    "chirala": "chirala",
    "srikakulam": "srikakulam",
    "vizianagaram": "vizianagaram",
    "ilkal": "ilkal",
    "molakalmuru": "molakalmuru",
    "mysuru": "mysuru",
    "mysore": "mysuru",
    "bengaluru": "bengaluru rural",
    "bangalore": "bengaluru rural",
    "hubballi": "hubballi",
    "hubli": "hubballi",
    "dharwad": "dharwad",
    "belagavi": "belagavi",
    "belgaum": "belagavi",
    "balaramapuram": "balaramapuram",
    "kannur": "kannur",
    "chendamangalam": "chendamangalam",
    "kasaragod": "kasaragod",
    "kuthampully": "kuthampully",
    "sambalpur": "sambalpur",
    "nuapatna": "nuapatna",
    "berhampur": "berhampur",
    "sonepur": "sonepur",
    "bargarh": "bargarh",
    "cuttack": "cuttack",
    "shantipur": "shantipur",
    "phulia": "phulia",
    "bishnupur": "bishnupur",
    "murshidabad": "murshidabad",
    "baluchari": "baluchari",
    "nadia": "nadia",
    "hooghly": "hooghly",
    "barpeta": "barpeta",
    "nagaon": "nagaon",
    "jorhat": "jorhat",
    "dhemaji": "dhemaji",
    "madhubani": "madhubani",
    "gaya": "gaya",
    "nalanda": "nalanda",
    "mau": "mau",
    "tanda": "tanda",
    "mubarakpur": "mubarakpur",
    "meerut": "meerut",
    "barabanki": "barabanki",
    "chanderi": "chanderi",
    "maheshwar": "maheshwar",
    "bhopal": "bhopal",
    "gwalior": "gwalior",
    "salem": "salem",
    "erode": "erode",
    "coimbatore": "coimbatore",
    "madurai": "madurai",
    "chennimalai": "chennimalai",
    "paramakudi": "paramakudi",
    "arani": "arani",
    "kumbakonam": "kumbakonam",
    "karaikudi": "karaikudi",
    "nagapattinam": "nagapattinam",
    "virudhunagar": "virudhunagar",
    "dindigul": "dindigul",
    "karur": "karur",
    "tirubhuvanam": "tirubhuvanam",
    "south delhi": "south delhi",
    "east delhi": "east delhi",
    "west delhi": "west delhi",
    "north delhi": "north delhi",
    "new delhi": "new delhi",
    "central delhi": "central delhi",
    "delhi": "delhi",
}

SOCIETY_RE = re.compile(
    r"\b(society|co-?op|cooperative|producer\s*company|\bpc\b|corporation|shg|sangh)\b",
    re.I,
)
AWARD_RE = re.compile(
    r"(national\s*award|sant\s*kabir|merit\s*certificate|padma)",
    re.I,
)
GI_YES_RE = re.compile(r"\b(yes|gi\s*product|g\.?i\.?)\b", re.I)
GI_NO_RE = re.compile(r"^[-–—_]+$|^(no|nil|n/?a|--)$", re.I)
PHONE_RE = re.compile(
    r"(?:mob(?:ile)?\.?\s*(?:no\.?)?\s*:?\s*|tel\s*:?\s*|contact\s*no\s*:?\s*\+?91[- ]*)?"
    r"[6-9]\d{9}",
    re.I,
)
EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)

PRODUCT_CATEGORY_RULES: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"silk\s*saree|kanchipuram\s*silk|banarasi|zari\s*saree|jamdani", re.I), "silk-saree"),
    (re.compile(r"cotton\s*saree|venkatagiri|mangalagiri|uppada|ilkal|pochampally|gadwal|chanderi|maheshwar|kota\s*doria", re.I), "cotton-saree"),
    (re.compile(r"\bsaree\b|\bsari\b", re.I), "cotton-saree"),
    (re.compile(r"stole|dupatta|shawl|scarf|odhani|chunri", re.I), "stole-dupatta"),
    (re.compile(r"dhoti|angavastram|veshti|mundu|lungi", re.I), "dhoti-angavastram"),
]


def norm_space(s: str | None) -> str:
    if not s:
        return ""
    return re.sub(r"\s+", " ", s.replace("\n", " ")).strip()


def norm_key(s: str) -> str:
    """Normalize district/cluster labels; PDF tables often split words ('Kanche epuram')."""
    s = norm_space(s).lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    # Prefer spaced alias, then compacted (handles mid-word line breaks in PDFs)
    if s in DISTRICT_ALIASES:
        return DISTRICT_ALIASES[s]
    compact = s.replace(" ", "")
    if compact in DISTRICT_ALIASES:
        return DISTRICT_ALIASES[compact]
    # Also try alias keys compacted
    for alias, canon in DISTRICT_ALIASES.items():
        if alias.replace(" ", "") == compact:
            return canon
    return compact or s


def strip_pii(s: str) -> str:
    s = PHONE_RE.sub("", s)
    s = EMAIL_RE.sub("", s)
    # Drop common address-ish trailing pin codes after stripping contacts
    s = re.sub(r"\b\d{6}\b", "", s)
    return norm_space(s)


_TIDY_STOP = {
    "silk",
    "saree",
    "sari",
    "cotton",
    "plain",
    "twill",
    "weave",
    "and",
    "the",
    "with",
    "for",
    "bed",
    "cover",
    "wool",
    "yarn",
    "hand",
    "loom",
    "adai",
}


def tidy_wrapped(s: str) -> str:
    """Collapse PDF mid-word line breaks: 'Kancheep uram' → 'Kancheepuram'."""
    if not s:
        return s

    def repl(m: re.Match[str]) -> str:
        frag = m.group(1)
        if frag.lower() in _TIDY_STOP:
            return m.group(0)
        return frag

    prev = None
    while prev != s:
        prev = s
        # Join 1–4 letter fragments unless they are real product words
        s = re.sub(r"(?<=[A-Za-z]) ([A-Za-z]{1,4})\b", repl, s)
    return norm_space(s)


def download(url: str, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 1000:
        return dest
    print(f"  download {dest.name} …")
    req = urllib.request.Request(url, headers={"User-Agent": "LoomOS-ingest/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp, open(dest, "wb") as f:
        f.write(resp.read())
    return dest


def parse_complete_list(pdf_path: Path) -> dict:
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text("text") for page in doc)
    # Lines like: "1. Andhra Pradesh 14 31 - 32"
    states: list[dict] = []
    # Rebuild from spaced tokens — table is column-broken in text
    # Prefer table extraction
    for page in doc:
        tabs = page.find_tables()
        if not tabs:
            continue
        for table in tabs.tables:
            for row in table.extract():
                if not row or not row[0]:
                    continue
                sn = norm_space(str(row[0]))
                if not re.match(r"^\d+\.?$", sn):
                    continue
                raw_state = norm_space(str(row[1] or ""))
                key = raw_state.lower()
                loom_state = SUMMARY_STATE_MAP.get(key)
                if not loom_state:
                    # merge mumbai/nagpur already mapped; try partial
                    for k, v in SUMMARY_STATE_MAP.items():
                        if k in key or key in k:
                            loom_state = v
                            break
                if not loom_state:
                    continue

                def num(cell: str | None) -> int:
                    t = norm_space(cell or "").replace("-", "").replace("–", "")
                    if not t or t in {"", "—"}:
                        return 0
                    m = re.search(r"\d+", t)
                    return int(m.group()) if m else 0

                districts = num(row[2] if len(row) > 2 else None)
                weavers = num(row[3] if len(row) > 3 else None)
                agencies = num(row[4] if len(row) > 4 else None)
                total = num(row[5] if len(row) > 5 else None) or (weavers + agencies)
                states.append(
                    {
                        "state": loom_state,
                        "sourceLabel": raw_state,
                        "districtsCovered": districts,
                        "weaversCovered": weavers,
                        "agenciesCovered": agencies,
                        "totalListed": total,
                    }
                )

    # Merge Maharashtra Mumbai + Nagpur rows
    merged: dict[str, dict] = {}
    for s in states:
        st = s["state"]
        if st not in merged:
            merged[st] = {
                "state": st,
                "sourceLabels": [s["sourceLabel"]],
                "districtsCovered": s["districtsCovered"],
                "weaversCovered": s["weaversCovered"],
                "agenciesCovered": s["agenciesCovered"],
                "totalListed": s["totalListed"],
            }
        else:
            m = merged[st]
            m["sourceLabels"].append(s["sourceLabel"])
            m["districtsCovered"] += s["districtsCovered"]
            m["weaversCovered"] += s["weaversCovered"]
            m["agenciesCovered"] += s["agenciesCovered"]
            m["totalListed"] += s["totalListed"]

    rollups = list(merged.values())
    return {
        "meta": {
            "title": "DC (Handlooms) Weavers Database — state campaign rollups",
            "sourceUrl": INDEX_URL,
            "sourcePdf": BASE + COMPLETE_PDF,
            "sourceLabel": "State-wise districts / weavers / agencies for National Handloom Day",
            "sourceNote": (
                "Parsed from Complete list district.pdf. Campaign coverage counts "
                "for social media — not Fourth Handloom Census headcounts."
            ),
            "asOf": AS_OF,
            "disclaimer": "Campaign listing totals — not census population.",
        },
        "states": sorted(rollups, key=lambda x: x["state"]),
        "national": {
            "districtsCovered": sum(s["districtsCovered"] for s in rollups),
            "weaversCovered": sum(s["weaversCovered"] for s in rollups),
            "agenciesCovered": sum(s["agenciesCovered"] for s in rollups),
            "totalListed": sum(s["totalListed"] for s in rollups),
        },
    }


def products_to_categories(products: list[str]) -> list[str]:
    found: list[str] = []
    blob = " | ".join(products)
    for pattern, cat in PRODUCT_CATEGORY_RULES:
        if pattern.search(blob) and cat not in found:
            found.append(cat)
    return found[:4]


def is_gi(cell: str) -> bool:
    t = norm_space(cell)
    if not t or GI_NO_RE.match(t):
        return False
    return bool(GI_YES_RE.search(t))


def is_agency_name(name: str) -> bool:
    return bool(SOCIETY_RE.search(name))


def extract_rows_from_pdf(pdf_path: Path, loom_state: str) -> list[dict]:
    doc = fitz.open(pdf_path)
    rows: list[dict] = []
    for page in doc:
        tabs = page.find_tables()
        if not tabs:
            continue
        for table in tabs.tables:
            for raw in table.extract():
                if not raw or not raw[0]:
                    continue
                sn = norm_space(str(raw[0])).rstrip(".")
                if not sn.isdigit():
                    continue
                name = strip_pii(norm_space(raw[1] if len(raw) > 1 else ""))
                # Never keep address column (index 2)
                district = norm_space(raw[3] if len(raw) > 3 else "")
                award = norm_space(raw[5] if len(raw) > 5 else "")
                product = norm_space(raw[6] if len(raw) > 6 else "")
                gi_cell = norm_space(raw[7] if len(raw) > 7 else "")
                weave = norm_space(raw[8] if len(raw) > 8 else "")
                technique = norm_space(raw[9] if len(raw) > 9 else "")

                if not name and not district and not product:
                    continue

                # Drop leftover phone fragments in name
                name = strip_pii(name)
                if name.lower() in {"", "do", "---do---", "–do–", "----do----"}:
                    # ditto row — inherit from previous if possible
                    if rows:
                        prev = rows[-1]
                        name = prev["name"]
                        if not district:
                            district = prev["districtRaw"]
                    else:
                        continue

                rows.append(
                    {
                        "state": loom_state,
                        "name": tidy_wrapped(name)[:160],
                        "districtRaw": district,
                        "districtKey": norm_key(district.split(",")[0]),
                        "product": tidy_wrapped(product)[:120]
                        if product and product not in {"-", "_", "--"}
                        else "",
                        "gi": is_gi(gi_cell),
                        "weave": tidy_wrapped(weave)[:80]
                        if weave and weave not in {"-", "_", "--"}
                        else "",
                        "technique": tidy_wrapped(technique)[:80]
                        if technique and technique not in {"-", "_", "--"}
                        else "",
                        "hasAward": bool(
                            award
                            and not GI_NO_RE.match(award)
                            and AWARD_RE.search(award)
                        ),
                        "isAgency": is_agency_name(name),
                    }
                )
    return rows


def match_hub(entry: dict, district_key: str, product: str) -> bool:
    targets = {
        norm_key(entry.get("loomOsCluster") or ""),
        norm_key(entry.get("district") or ""),
        norm_key(entry.get("societyName") or ""),
    }
    targets.discard("")
    dk = norm_key(district_key)
    if dk and dk in targets:
        return True
    # Delhi NCT: generic "delhi" → New Delhi hub; named districts → matching hubs
    if entry.get("state") == "Delhi":
        cluster = norm_key(entry.get("loomOsCluster") or "")
        if dk in {"delhi", "newdelhi"} and cluster == "newdelhi":
            return True
        if dk == "shahdara" and cluster == "shahdara":
            return True
        if dk in {"eastdelhi", "eastgamdi", "east"} and cluster == "eastdelhi":
            return True
        if dk and cluster and dk == cluster:
            return True
    # Product often names the cluster (Venkatagiri Saree → Venkatagiri hub)
    pk = norm_key(product)
    prod_compact = re.sub(r"[^a-z0-9]", "", (product or "").lower())
    for t in targets:
        if t and pk and (t in pk or pk.startswith(t)):
            return True
        if t and len(t) >= 5 and t in prod_compact:
            return True
    # Soft: compacted substring either way (min length 5 to avoid noise).
    # Skip pitch-only hubs (e.g. "iitdelhi") so generic "delhi" rows don't attach.
    if any(t.startswith("iit") for t in targets):
        return False
    for t in targets:
        if t and dk and len(t) >= 5 and len(dk) >= 5 and (t in dk or dk in t):
            return True
    return False


def aggregate_for_hub(entry: dict, rows: list[dict]) -> dict:
    matched = [
        r
        for r in rows
        if r["state"] == entry["state"]
        and match_hub(entry, r["districtKey"], r["product"])
    ]
    products: list[str] = []
    weaves: list[str] = []
    techniques: list[str] = []
    societies: list[str] = []
    gi_count = 0
    award_count = 0
    agency_rows = 0
    for r in matched:
        if r["product"] and r["product"] not in products:
            products.append(r["product"])
        if r["weave"] and r["weave"] not in weaves:
            weaves.append(r["weave"])
        if r["technique"] and r["technique"] not in techniques:
            techniques.append(r["technique"])
        if r["gi"]:
            gi_count += 1
        if r["hasAward"]:
            award_count += 1
        if r["isAgency"]:
            agency_rows += 1
            clean_name = r["name"]
            if clean_name and clean_name not in societies and len(societies) < 8:
                societies.append(clean_name)

    return {
        "listedRows": len(matched),
        "listedAgencyRows": agency_rows,
        "products": products[:12],
        "weaves": weaves[:8],
        "techniques": techniques[:8],
        "giProductCount": gi_count,
        "awardCount": award_count,
        "societyNames": societies,
    }


def density_from_counts(counts: list[int]) -> dict[int, int]:
    """Map listedRows → densityWeight 0–100 within a state (percentile-ish)."""
    if not counts:
        return {}
    mx = max(counts) or 1
    # Distinct ranks
    unique = sorted(set(counts))
    rank_map = {c: int(round(100 * (i + 1) / len(unique))) for i, c in enumerate(unique)}
    # Also scale by share of max so zeros stay low
    out = {}
    for c in set(counts):
        share = int(round(100 * c / mx)) if mx else 0
        out[c] = max(share, rank_map.get(c, 0) if c > 0 else 0)
        if c > 0:
            out[c] = max(28, min(100, out[c]))
    return out


def main() -> int:
    print("LoomOS — ingest DC(HL) Weavers Database")
    CACHE.mkdir(parents=True, exist_ok=True)

    complete_path = download(BASE + COMPLETE_PDF, CACHE / "complete-list-district.pdf")
    rollups = parse_complete_list(complete_path)
    ROLLUPS_PATH.write_text(json.dumps(rollups, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {ROLLUPS_PATH} ({len(rollups['states'])} states)")

    seed = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    all_rows: list[dict] = []
    state_pdf_urls: dict[str, str] = {}

    for key, (loom_state, filename) in STATE_PDFS.items():
        url = BASE + filename
        local = CACHE / f"{key}.pdf"
        try:
            download(url, local)
        except Exception as e:
            print(f"  WARN skip {key}: {e}")
            continue
        rows = extract_rows_from_pdf(local, loom_state)
        print(f"  {loom_state} ({key}): {len(rows)} rows")
        all_rows.extend(rows)
        # Keep percent-encoded URL; first PDF wins per state (MH Mumbai before Nagpur)
        if loom_state not in state_pdf_urls:
            state_pdf_urls[loom_state] = url

    # Per-state row lists for density
    by_state: dict[str, list[dict]] = defaultdict(list)
    for r in all_rows:
        by_state[r["state"]].append(r)

    # State rollup lookup
    state_totals = {s["state"]: s for s in rollups["states"]}

    enriched = []
    state_hub_counts: dict[str, list[int]] = defaultdict(list)
    hub_aggs: dict[str, dict] = {}

    for entry in seed["entries"]:
        agg = aggregate_for_hub(entry, by_state.get(entry["state"], []))
        hub_aggs[entry["id"]] = agg
        state_hub_counts[entry["state"]].append(agg["listedRows"])

    density_maps = {
        st: density_from_counts(counts) for st, counts in state_hub_counts.items()
    }

    mapped_with_rows = 0
    for entry in seed["entries"]:
        agg = hub_aggs[entry["id"]]
        listed = agg["listedRows"]
        if listed > 0:
            mapped_with_rows += 1

        cats = products_to_categories(agg["products"])
        if not cats:
            cats = list(entry.get("categoryHints") or [])

        dmap = density_maps.get(entry["state"], {})
        if listed > 0:
            density = dmap.get(listed, 40)
        else:
            # Unmapped hub: soft floor from state campaign presence
            st = state_totals.get(entry["state"])
            density = 22 if st and st["totalListed"] > 0 else 12

        society_names = agg["societyNames"]
        society_name = entry["societyName"]
        society_type = entry["societyType"]
        if society_names:
            society_name = society_names[0]
            society_type = "cooperative"
        elif listed > 0 and agg["listedAgencyRows"] == 0:
            society_type = "individual_aggregate"
            society_name = entry.get("loomOsCluster") or entry["district"]

        pdf_url = state_pdf_urls.get(entry["state"], INDEX_URL)

        new_entry = {
            "id": entry["id"],
            "state": entry["state"],
            "district": entry["district"],
            "societyName": society_name,
            "societyType": society_type,
            "loomOsCluster": entry["loomOsCluster"],
            "weaverCount": listed if listed > 0 else None,
            "densityWeight": int(density),
            "categoryHints": cats,
            "products": agg["products"],
            "weaves": agg["weaves"],
            "techniques": agg["techniques"],
            "giProductCount": agg["giProductCount"],
            "awardCount": agg["awardCount"],
            "societyNames": society_names,
            "listedAgencyRows": agg["listedAgencyRows"],
            "sourceUrl": pdf_url,
            "sourceNote": (
                f"Aggregated from DC(HL) Weavers Database campaign PDF for {entry['state']} "
                f"({listed} district-matched listing rows; no personal contacts stored). "
                "Not a census headcount."
            ),
            "asOf": AS_OF,
        }
        enriched.append(new_entry)

    seed["meta"] = {
        "title": "DC (Handlooms) Weavers Database — campaign-enriched cluster seed",
        "sourceUrl": INDEX_URL,
        "sourceLabel": "Development Commissioner (Handlooms) Weavers Database",
        "sourceNote": (
            "Hub seed enriched from public National Handloom Day campaign PDFs "
            "(state lists + Complete list district.pdf). weaverCount = district-matched "
            "listing rows; densityWeight = within-state campaign density rank. "
            "Products / weaves / GI / society names ingested; phones, emails, and "
            "street addresses are never stored. Not a live API; not Fourth Handloom Census."
        ),
        "asOf": AS_OF,
        "disclaimer": (
            "Campaign listing seed — density and counts reflect showcase PDF rows, "
            "not census population."
        ),
        "coverage": {
            "states": len({e["state"] for e in enriched}),
            "hubs": len(enriched),
            "hubsWithListingRows": mapped_with_rows,
            "campaignRowsParsed": len(all_rows),
            "nationalListed": rollups["national"]["totalListed"],
            "note": (
                "Major hubs mapped to PDF districts/products; unmapped hubs keep "
                "soft state-level density floor."
            ),
        },
    }
    seed["entries"] = enriched

    SEED_PATH.write_text(json.dumps(seed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"Wrote {SEED_PATH}: {len(enriched)} hubs, "
        f"{mapped_with_rows} with listing rows, {len(all_rows)} PDF rows parsed"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
