#!/usr/bin/env python3

import argparse
import datetime as dt
import html
import json
import re
import subprocess
import unicodedata
import urllib.request
from pathlib import Path


DIRECTORY_URL = "https://bdl.bnf.fr/bases-de-donnees-par-titre"
ROOT = Path(__file__).resolve().parents[1]
RESOURCES_PATH = ROOT / "public" / "resources.json"
REPORT_PATH = ROOT / "docs" / "audits" / "bnf-directory-audit.md"


def main():
    parser = argparse.ArgumentParser(description="Audit BnF Access resources against the official BnF directory.")
    parser.add_argument("--write-report", action="store_true", help="Write docs/audits/bnf-directory-audit.md")
    args = parser.parse_args()

    resources_data = json.loads(RESOURCES_PATH.read_text(encoding="utf-8"))
    resources = resources_data if isinstance(resources_data, list) else resources_data.get("resources", [])
    directory_html = fetch_directory_html()
    directory_entries = extract_directory_entries(directory_html)
    audit = build_audit(resources, directory_entries)
    markdown = render_markdown(audit)

    if args.write_report:
        REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
        REPORT_PATH.write_text(markdown, encoding="utf-8")
        print(REPORT_PATH)
    else:
        print(markdown)


def fetch_directory_html():
    request = urllib.request.Request(DIRECTORY_URL, headers={"User-Agent": "BNF Access audit"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.read().decode("utf-8", errors="replace")
    except Exception:
        completed = subprocess.run(
            ["curl", "-L", "--fail", "--silent", "--show-error", DIRECTORY_URL],
            check=True,
            capture_output=True,
            text=True,
        )
        return completed.stdout


def extract_directory_entries(source):
    entries = []
    for index, match in enumerate(re.finditer(r'<li class="bdd">([\s\S]*?)</li>', source)):
        block = match.group(1)
        class_match = re.search(r"field-content\s+(acces-[a-z-]+)", block)
        link_match = re.search(
            r'<a[^>]+href="([^"]+)"[^>]*class="document"[^>]*>([\s\S]*?)</a>',
            block,
        )
        info_match = re.search(
            r'views-field-field-info-bdd[\s\S]*?<div class="field-content">([\s\S]*?)</div>',
            block,
        )
        description_match = re.search(
            r'views-field-field-presentation-bdd[\s\S]*?<div class="field-content">([\s\S]*?)(?:</div></div><div class="views-field views-field-field-alerte-bdd"|</div></div>\s*</div>)',
            block,
        )
        alert_match = re.search(
            r'views-field-field-alerte-bdd[\s\S]*?<div class="field-content">([\s\S]*?)</div>',
            block,
        )

        title = clean_text(link_match.group(2) if link_match else "")
        url = decode_entities(link_match.group(1) if link_match else "").strip()
        if not title or not url:
            continue

        entries.append(
            {
                "index": index,
                "title": title,
                "title_key": normalize_text(title),
                "url": url,
                "url_key": normalize_url(url),
                "access_class": class_match.group(1) if class_match else None,
                "access_note": clean_text(info_match.group(1) if info_match else ""),
                "description": clean_text(description_match.group(1) if description_match else ""),
                "alert": clean_text(alert_match.group(1) if alert_match else ""),
            }
        )
    return entries


def build_audit(resources, bnf_entries):
    bnf_by_title = {entry["title_key"]: entry for entry in bnf_entries}
    bnf_by_url = {entry["url_key"]: entry for entry in bnf_entries}
    matched = []
    unmatched = []

    for resource in resources:
        match = find_match(resource, bnf_by_title, bnf_by_url)
        if match:
            matched.append({"resource": resource, "match": match})
        else:
            unmatched.append(
                {
                    "id": resource.get("id"),
                    "name": resource.get("name"),
                    "url": resource.get("url"),
                    "candidates": find_candidates(resource, bnf_entries)[:4],
                }
            )

    matched_indexes = {item["match"]["entry"]["index"] for item in matched}
    bnf_only = [summarize_bnf_entry(entry) for entry in bnf_entries if entry["index"] not in matched_indexes]
    url_drift = []

    for item in matched:
        resource = item["resource"]
        entry = item["match"]["entry"]
        if normalize_url(resource.get("url")) == entry["url_key"]:
            continue
        url_drift.append(
            {
                "id": resource.get("id"),
                "name": resource.get("name"),
                "match_kind": item["match"]["kind"],
                "bnf_title": entry["title"],
                "local_url": resource.get("url"),
                "bnf_url": entry["url"],
                "access_class": entry["access_class"],
            }
        )

    return {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "directory_url": DIRECTORY_URL,
        "local_resource_count": len(resources),
        "bnf_entry_count": len(bnf_entries),
        "matched_count": len(matched),
        "unmatched_count": len(unmatched),
        "bnf_only_count": len(bnf_only),
        "url_drift_count": len(url_drift),
        "unmatched": unmatched,
        "bnf_only": bnf_only,
        "url_drift": url_drift,
    }


def find_match(resource, bnf_by_title, bnf_by_url):
    official_entries = resource.get("bnf_official", {}).get("entries", [])
    title_candidates = [resource.get("name"), *[entry.get("title") for entry in official_entries]]
    url_candidates = [resource.get("url"), *[entry.get("url") for entry in official_entries]]

    for title in filter(None, title_candidates):
        entry = bnf_by_title.get(normalize_text(title))
        if entry:
            return {"kind": "name" if title == resource.get("name") else "bnf_official.title", "entry": entry}

    for url in filter(None, url_candidates):
        entry = bnf_by_url.get(normalize_url(url))
        if entry:
            return {"kind": "url" if url == resource.get("url") else "bnf_official.url", "entry": entry}

    return None


def find_candidates(resource, bnf_entries):
    local_text = " ".join(
        [
            resource.get("name") or "",
            *(resource.get("tags") or []),
            resource.get("description") or "",
        ]
    )
    candidates = []
    for entry in bnf_entries:
        score = max(
            token_similarity(resource.get("name"), entry["title"]),
            token_similarity(local_text, f'{entry["title"]} {entry["description"]}'),
        )
        if score > 0.15:
            candidates.append(
                {
                    "title": entry["title"],
                    "url": entry["url"],
                    "access_class": entry["access_class"],
                    "score": round(score, 3),
                }
            )
    return sorted(candidates, key=lambda item: item["score"], reverse=True)


def summarize_bnf_entry(entry):
    return {
        "title": entry["title"],
        "url": entry["url"],
        "access_class": entry["access_class"],
    }


def render_markdown(audit):
    return "\n".join(
        [
            "# Audit annuaire BnF",
            "",
            f'Date : {audit["generated_at"]}',
            "",
            f'Source : {audit["directory_url"]}',
            "",
            "## Résumé",
            "",
            f'- Ressources locales : {audit["local_resource_count"]}',
            f'- Entrées BnF extraites : {audit["bnf_entry_count"]}',
            f'- Ressources rapprochées : {audit["matched_count"]}',
            f'- Ressources locales sans rapprochement automatique : {audit["unmatched_count"]}',
            f'- Entrées BnF non rapprochées automatiquement : {audit["bnf_only_count"]}',
            f'- Liens locaux différents du lien BnF : {audit["url_drift_count"]}',
            "",
            "## Ressources locales sans rapprochement automatique",
            "",
            render_unmatched(audit["unmatched"]),
            "",
            "## Entrées BnF non rapprochées automatiquement",
            "",
            render_bnf_only(audit["bnf_only"]),
            "",
            "## Liens locaux différents du lien BnF",
            "",
            render_url_drift(audit["url_drift"]),
            "",
        ]
    )


def render_unmatched(items):
    if not items:
        return "Aucune."
    blocks = []
    for item in items:
        candidates = item["candidates"]
        candidate_lines = (
            "\n".join(f'  - {candidate["title"]} ({candidate["score"]})' for candidate in candidates)
            if candidates
            else "  - Aucun candidat net."
        )
        blocks.append(f'- `{item["id"]}` — {item["name"]}\n{candidate_lines}')
    return "\n".join(blocks)


def render_bnf_only(items):
    if not items:
        return "Aucune."
    return "\n".join(
        f'- {item["title"]} — {item["access_class"] or "accès inconnu"} — {item["url"]}' for item in items
    )


def render_url_drift(items):
    if not items:
        return "Aucun."
    return "\n".join(
        [
            f'- `{item["id"]}` — {item["name"]}\n'
            f'  - BnF : {item["bnf_title"]} — {item["bnf_url"]}\n'
            f'  - Local : {item["local_url"]}'
            for item in items
        ]
    )


def clean_text(value):
    without_tags = re.sub(r"<br\s*/?\s*>", " ", str(value), flags=re.I)
    without_tags = re.sub(r"<[^>]+>", " ", without_tags)
    return re.sub(r"\s+", " ", decode_entities(without_tags)).strip()


def decode_entities(value):
    result = str(value)
    for _ in range(3):
        decoded = html.unescape(result)
        if decoded == result:
            return decoded
        result = decoded
    return result


def normalize_text(value):
    cleaned = clean_text(value).lower()
    cleaned = unicodedata.normalize("NFD", cleaned)
    cleaned = "".join(char for char in cleaned if unicodedata.category(char) != "Mn")
    cleaned = cleaned.replace("œ", "oe").replace("æ", "ae").replace("&", " et ")
    cleaned = re.sub(r"[^a-z0-9]+", " ", cleaned)
    cleaned = re.sub(
        r"\b(the|le|la|les|l|de|des|du|d|and|et|of|for|from|online|database|base|donnees)\b",
        " ",
        cleaned,
    )
    return re.sub(r"\s+", " ", cleaned).strip()


def normalize_url(value):
    url = decode_entities(value or "").strip()
    try:
        url = urllib.request.url2pathname(url)
    except Exception:
        pass
    return re.sub(r"\s+", "", url).rstrip("/").lower()


def token_similarity(first, second):
    first_tokens = token_set(first)
    second_tokens = token_set(second)
    if not first_tokens or not second_tokens:
        return 0
    intersection = len(first_tokens & second_tokens)
    return 2 * intersection / (len(first_tokens) + len(second_tokens))


def token_set(value):
    return set(token for token in normalize_text(value).split(" ") if token)


if __name__ == "__main__":
    main()
