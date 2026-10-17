"""Rebuild the initial batch from downloaded official-page extracts (not a scraper).
Raw pages are scratch inputs, excluded from git. The resulting JSON is the reviewed source of truth.
"""
import json
import re
from pathlib import Path
import unicodedata

ROOT = Path(__file__).parent
RAW = ROOT / "raw"
DATE = "2026-10-17"

def norm(s):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFKC", s).lower()).strip()

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()).strip("-")

# Explicitly reviewed identity variants; no fuzzy punctuation/sub-brand merge.
canonical = {
    "mac cosmetics": ("mac", "M·A·C", ["MAC", "MAC Cosmetics"]),
    "rare beauty": ("rare-beauty", "Rare Beauty by Selena Gomez", ["Rare Beauty"]),
    "clinique": ("clinique", "CLINIQUE", []),
    "mac": ("mac", "M·A·C", ["MAC", "MAC Cosmetics"]),
    "m·a·c": ("mac", "M·A·C", ["MAC", "MAC Cosmetics"]),
    "m∙a∙c": ("mac", "M·A·C", ["MAC", "MAC Cosmetics"]),
    "e.l.f. cosmetics": ("elf-cosmetics", "e.l.f. Cosmetics", ["elf cosmetics"]),
    "nyx professional makeup": ("nyx-professional-makeup", "NYX Professional Makeup", ["NYX"]),
    "rare beauty by selena gomez": ("rare-beauty", "Rare Beauty by Selena Gomez", ["Rare Beauty"]),
    "fenty beauty by rihanna": ("fenty-beauty", "Fenty Beauty by Rihanna", ["Fenty Beauty"]),
    "fenty beauty": ("fenty-beauty", "Fenty Beauty by Rihanna", ["Fenty Beauty"]),
    "l’oréal": ("loreal", "L'Oréal Paris", ["L'Oréal", "L’Oréal", "L'Oreal Paris"]),
    "l'oréal": ("loreal", "L'Oréal Paris", ["L'Oréal", "L’Oréal", "L'Oreal Paris"]),
    "l'oréal paris": ("loreal", "L'Oréal Paris", ["L'Oréal", "L’Oréal", "L'Oreal Paris"]),
}
brands, listings, byurl = {}, {}, {}
for retailer, filename in [("sephora", "www.sephora.com.md"), ("ulta", "www.ulta.com.md")]:
    text = (RAW / filename).read_text()
    if retailer == "ulta":
        text += "\n" + (RAW / "ulta-directory-tail.md").read_text()
    # Plain directory rows only, not promotional/logo or navigation links.
    for name, url in re.findall(r"^- \[([^\[\]\n]+)\]\((https://www\." + retailer + r"\.com/brand/[^)#?]+)\)", text, re.M):
        name = re.sub(r"[\u200b-\u200d\ufeff]", "", re.sub(r"NEW$", "", name)).strip()
        key, display, aliases = canonical.get(norm(name), (slug(name), name, []))
        if key in brands and norm(brands[key]["name"]) != norm(display):
            raise ValueError(f"Review identity collision: {name}, {brands[key]}")
        brands.setdefault(key, {"id": key, "name": display, "aliases": aliases[:]})
        if name != display and name not in brands[key]["aliases"]:
            brands[key]["aliases"].append(name)
        listings[(key, retailer)] = {"brandId": key, "retailerId": retailer, "sourceUrl": url, "checkedOn": DATE}
        byurl[url] = key

# Exact product title terms only. Brushes, tools, sets, body/hair and removal products are excluded.
patterns = {
    "foundation": r"\bfoundation\b",
    "concealer": r"\bconcealer\b",
    "color-corrector": r"\bcolou?r correct(?:or|ing)\b",
    "skin-tint": r"\bskin tint\b",
    "setting-powder": r"\b(?:setting|finishing) powder\b",
    "primer": r"\bprimer\b",
    "blush": r"\bblush\b",
    "bronzer": r"\bbronzer\b",
    "contour": r"\bcontour\b",
    "highlighter": r"\bhighlighter\b",
    "eyeshadow": r"\beye ?shadow\b",
    "eyeliner": r"\beye ?liner\b",
    "mascara": r"\bmascara\b",
    "brow-pencil": r"\b(?:brow|eyebrow) pencil\b",
    "brow-gel": r"\b(?:brow|eyebrow) gel\b",
    "lipstick": r"\blipstick\b",
    "lip-liner": r"\blip liner\b",
    "lip-gloss": r"\blip gloss\b",
    "lip-balm": r"\blip balm\b",
    "moisturizer": r"\bmoisturi[sz](?:er|ing cream)\b",
    "sunscreen": r"\bsunscreen\b",
    "setting-spray": r"\bsetting (?:spray|mist)\b",
}
evidence, log = {}, []
for fetch in json.loads((ROOT / "fetch-log.json").read_text()):
    retailer, page = fetch["retailer"], fetch["url"]
    key = byurl.get(page)
    if not key:
        log.append({"url": page, "gap": "URL not matched to a directory entry; no inferred identity"})
        continue
    text = (RAW / f'{retailer}-{fetch["slug"]}.md').read_text()
    if retailer == "sephora":
        products = re.findall(r"\[!\[([^\]]+)\]\([^\n]+\).*?\]\((https://www.sephora.com/product/[^)]+)\)", text, re.S)
    else:
        products = re.findall(r"\[([^\[\]\n]+)\]\((https://www.ulta.com/p/[^)]+)\)", text)
    brandname = brands[key]["name"]
    found = []
    for title, url in products:
        if re.search(r"\b(brush|sponge|applicator|remover|removing|body|hair|shampoo|duo|trio|set|kit)\b", title, re.I):
            continue
        # Retailer cards explicitly name the brand. Ignore recommendations for other brands.
        accepted_names = [brandname] + brands[key]["aliases"]
        prefix = next((n for n in accepted_names if norm(title).startswith(norm(n))), None)
        if not prefix:
            continue
        product = title[len(prefix):].lstrip(" -")
        for category, pattern in patterns.items():
            if not re.search(pattern, product, re.I):
                continue
            # Lip/eye primers and contour/eyeshadow on brow products do not establish face offerings.
            if category == "primer" and re.search(r"\b(lash|eyelash|lip|eye|eyeshadow|undereye|mascara|brow)\b", product, re.I):
                continue
            if category == "primer" and product.startswith("Ultimate Ozone"):
                # Lip primer, despite the generic "multipurpose primer" product title.
                continue
            if category == "mascara" and re.search(r"\b(brow|eyebrow)\b", product, re.I):
                continue
            if category == "setting-powder" and re.search(r"\bspray\b", product, re.I):
                continue
            if category in ("foundation", "eyeshadow", "mascara") and re.search(r"\bprimer\b", product, re.I):
                continue
            if category == "contour" and re.search(r"\b(lip|eye|brow)\b", product, re.I):
                continue
            obs = (key, retailer, category)
            if obs not in evidence:
                evidence[obs] = {"brandId": key, "retailerId": retailer, "categoryId": category, "status": "verified",
                    "sourceUrl": page, "checkedOn": DATE, "productName": product,
                    "productUrl": url.split("?")[0],
                    "note": "Named product card on official US retailer brand page; category stated in product title. Not a stock or suitability claim."}
                found.append(category)
    log.append({"url": page, "verifiedCategories": found, "truncated": fetch.get("truncated", False),
                "gap": "Only returned product cards reviewed, not all product pages or pagination"})

# One directly fetched Target product provided usable named product evidence despite directory limitations.
target_url = "https://www.target.com/p/e-l-f-power-grip-primer-clear-0-811-fl-oz/-/A-83714968"
target_text = (RAW / "target-primer.md").read_text()
assert re.search(r"Power Grip Primer", target_text, re.I)
listings[("elf-cosmetics", "target")] = {"brandId": "elf-cosmetics", "retailerId": "target", "sourceUrl": target_url, "checkedOn": DATE}
evidence[("elf-cosmetics", "target", "primer")] = {
    "brandId": "elf-cosmetics", "retailerId": "target", "categoryId": "primer", "status": "verified",
    "sourceUrl": target_url, "checkedOn": DATE, "productName": "Power Grip Primer", "productUrl": target_url,
    "note": "Official Target product page names e.l.f. Power Grip Primer. This does not establish directory-wide Target coverage or stock."}
mascara_url = "https://www.target.com/p/e-l-f-big-mood-mega-volume-38-lifting-waterproof-mascara-0-36oz/-/A-83714960"
assert "# e.l.f. Big Mood" in (RAW / "target-mascara.md").read_text()
evidence[("elf-cosmetics", "target", "mascara")] = {
    "brandId": "elf-cosmetics", "retailerId": "target", "categoryId": "mascara", "status": "verified",
    "sourceUrl": mascara_url, "checkedOn": DATE, "productName": "Big Mood Mega Volume & Lifting Waterproof Mascara",
    "productUrl": mascara_url, "note": "Official Target product heading and description confirm brand and mascara. Category is based on page contents, not URL slug."}

rules = "US retailer availability, not brand ownership. Directory names are unreviewed candidates until a named product evidences one of Neu's 22 categories. Exclude hair, fragrance, tools, body-only and supplements from relevant counts. No suitability inference."
batch = {"version": 1, "id": "us-retailers-2026-10-17",
 "retailers": [{"id": "sephora", "name": "Sephora US", "country": "US"}, {"id": "ulta", "name": "Ulta Beauty", "country": "US"}, {"id": "target", "name": "Target", "country": "US"}],
 "coverage": [
  {"retailerId": "sephora", "sourceUrl": "https://www.sephora.com/brands-list", "checkedOn": DATE, "status": "partial", "inclusionRules": rules,
   "gaps": ["A-Z names extracted from accessible directory; relevance review limited to selected brand pages in research-log.json.",
            "Not every brand, category, product or pagination reviewed. Unreviewed fragrance/hair-only candidates excluded from relevant counts; their relevance remains unknown.",
            "Some requested brand URLs did not match directory URLs. A returned page is not proof of exhaustive coverage."]},
  {"retailerId": "ulta", "sourceUrl": "https://www.ulta.com/brand/all", "checkedOn": DATE, "status": "partial", "inclusionRules": rules,
   "gaps": ["Directory extracted using two text chunks; all plain brand links retained as candidates, not verified relevant brands.",
            "Only selected brand pages and returned product cards reviewed. Several brand extracts truncated at 50,000 characters; remaining products/pagination unreviewed.",
            "No inference from missing cards. Full category coverage of directory candidates remains unreviewed."]},
  {"retailerId": "target", "sourceUrl": "https://www.target.com/c/beauty/-/N-55r1x", "checkedOn": DATE, "status": "partial", "inclusionRules": rules,
   "gaps": ["Beauty hub and makeup pages returned navigation/sponsored shells, not a usable brand directory. Directory coverage blocked/incomplete.",
            "Beauty-brand routes /c/beauty-brands/-/N-4y75r and /b/beauty-brands/-/N-4y75r returned page unavailable; route validity unconfirmed.",
            "Skin-care page returned partial navigation. Only two directly fetched e.l.f. products verified; not representative of Target's assortment.",
            "No access restrictions bypassed; Target total is an observed minimum, never zero brands or a census."]}],
 "brands": sorted(brands.values(), key=lambda b: b["id"]),
 "listings": sorted(listings.values(), key=lambda l: (l["brandId"], l["retailerId"])),
 "evidence": sorted(evidence.values(), key=lambda e: (e["brandId"], e["retailerId"], e["categoryId"]))}
(ROOT / "initial.json").write_text(json.dumps(batch, ensure_ascii=False, indent=2) + "\n")
(ROOT / "research-log.json").write_text(json.dumps(log, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"brands": len(brands), "listings": len(listings), "offeringEvidence": len(evidence),
                  "verifiedBrands": len({e["brandId"] for e in evidence.values()}),
                  "categories": sorted({e["categoryId"] for e in evidence.values()})}, indent=2))
