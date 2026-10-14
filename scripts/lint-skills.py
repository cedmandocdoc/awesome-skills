#!/usr/bin/env python3
"""Check skills/ against the mechanical rules of managing-skills/references/skill-contract.md.

Usage: python3 scripts/lint-skills.py [skill-name ...]
Exits 1 when any error is found.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS = ROOT / "skills"

KEBAB = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
UUID4 = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
SEMVER = re.compile(r"^\d+\.\d+\.\d+$")
LINK = re.compile(r"\[[^\]]*\]\(([^)\s]+)\)")
INLINE_CODE = re.compile(r"`[^`]*`")
SKILL_SECTIONS = ["Setup", "Workflow", "Recipes"]
REFERENCE_SECTIONS = ["Overview", "Prerequisites", "Guidelines", "Setup", "Examples", "Related", "References"]

errors = []


def error(path, msg):
    errors.append(f"{path.relative_to(ROOT)}: {msg}")


def frontmatter(text):
    """Top-level scalar keys of the YAML frontmatter; folded values count as present."""
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return None, text
    fields = {}
    for line in text[4:end].splitlines():
        m = re.match(r"^([A-Za-z][\w-]*):\s*(.*)$", line)
        if m:
            fields[m.group(1)] = m.group(2).strip().strip("'\"")
    return fields, text[end + 5:]


def prose_lines(text):
    """Lines outside fenced code blocks, with their 1-based line numbers."""
    fenced = False
    for n, line in enumerate(text.splitlines(), 1):
        if line.lstrip().startswith("```"):
            fenced = not fenced
            continue
        if not fenced:
            yield n, line


def headings(text, level):
    marker = "#" * level + " "
    return [line[len(marker):].strip() for _, line in prose_lines(text) if line.startswith(marker)]


def links(text):
    for n, line in prose_lines(text):
        for target in LINK.findall(INLINE_CODE.sub("", line)):
            yield n, target


def check_skill_md(skill):
    path = skill / "SKILL.md"
    if not path.is_file():
        error(skill, "missing SKILL.md")
        return
    text = path.read_text()
    fields, body = frontmatter(text)
    if fields is None:
        error(path, "missing frontmatter")
        return

    name = fields.get("name", "")
    if name != skill.name:
        error(path, f"name '{name}' does not match folder '{skill.name}'")
    if not KEBAB.match(name) or len(name) > 64:
        error(path, f"name '{name}' must be kebab-case, max 64 characters")
    if not UUID4.match(fields.get("id", "")):
        error(path, "id must be a lowercase UUID v4")
    if not fields.get("description"):
        error(path, "description is empty")
    if "version" in fields and not SEMVER.match(fields["version"]):
        error(path, f"version '{fields['version']}' is not semver")

    titles = headings(body, 1)
    if len(titles) != 1:
        error(path, f"expected one '# ' title, found {len(titles)}")
    sections = headings(body, 2)
    if sections != SKILL_SECTIONS:
        error(path, f"sections {sections} must be exactly {SKILL_SECTIONS}")
    if headings(body, 3):
        error(path, "subsections are not allowed")
    if text.count("\n") > 500:
        error(path, "over 500 lines; move detail to references/")
    return fields


def check_openai_yaml(skill, name):
    path = skill / "agents" / "openai.yaml"
    if not path.is_file():
        error(skill, "missing agents/openai.yaml")
        return
    text = path.read_text()
    for field in ("display_name", "short_description", "default_prompt"):
        if not re.search(rf"^\s+{field}:\s*\S", text, re.M):
            error(path, f"missing {field}")
    m = re.search(r"^\s+default_prompt:\s*(.*)$", text, re.M)
    if m and f"${name}" not in m.group(1):
        error(path, f"default_prompt does not use ${name}")


def check_references(skill):
    refs = skill / "references"
    if not refs.is_dir():
        return
    for path in sorted(refs.glob("*")):
        if path.suffix != ".md" or not KEBAB.match(path.stem):
            error(path, "reference filenames are kebab-case .md")
            continue
        if not (path.stem.endswith("-contract") or path.stem.split("-")[0].endswith("ing")):
            error(path, "reference filename needs a verb-ing prefix or -contract suffix")
        text = path.read_text()
        if len(headings(text, 1)) != 1:
            error(path, "expected one '# ' title")
        sections = headings(text, 2)
        unknown = [s for s in sections if s not in REFERENCE_SECTIONS]
        if unknown:
            error(path, f"sections not in the contract: {unknown}")
        known = [s for s in sections if s in REFERENCE_SECTIONS]
        if known != sorted(known, key=REFERENCE_SECTIONS.index):
            error(path, f"sections out of order: {known}")
        for required in ("Overview", "Guidelines"):
            if required not in sections:
                error(path, f"missing ## {required}")


def check_links(skill):
    """Relative links resolve, stay inside the skill, and every reference is reachable.

    assets/ holds templates whose links resolve from where they are copied, so only
    absolute links are checked there.
    """
    linked = {}
    for path in sorted(skill.rglob("*.md")):
        is_asset = skill / "assets" in path.parents
        for n, target in links(path.read_text()):
            if re.match(r"^[a-z][a-z0-9+.-]*:", target) or target.startswith("#"):
                continue
            if "<" in target or "…" in target:
                continue
            if target.startswith(("/", "~")):
                error(path, f"line {n}: absolute link '{target}'")
                continue
            if is_asset:
                continue
            resolved = (path.parent / target.split("#")[0]).resolve()
            if skill.resolve() not in resolved.parents and resolved != skill.resolve():
                error(path, f"line {n}: link '{target}' leaves the skill; use a GitHub URL")
            elif not resolved.exists():
                error(path, f"line {n}: broken link '{target}'")
            else:
                linked.setdefault(path.resolve(), set()).add(resolved)

    reached, queue = set(), [(skill / "SKILL.md").resolve()]
    while queue:
        current = queue.pop()
        if current in reached:
            continue
        reached.add(current)
        queue.extend(linked.get(current, ()))
    for path in sorted((skill / "references").glob("*.md")):
        if path.resolve() not in reached:
            error(path, "not reachable from SKILL.md")


def main(names):
    skills = [SKILLS / n for n in names] if names else sorted(p for p in SKILLS.iterdir() if p.is_dir())
    ids = {}
    for skill in skills:
        if not skill.is_dir():
            error(skill, "no such skill")
            continue
        fields = check_skill_md(skill)
        if fields:
            check_openai_yaml(skill, fields.get("name", ""))
            ids.setdefault(fields.get("id"), []).append(skill.name)
        check_references(skill)
        check_links(skill)
    for skill_id, owners in ids.items():
        if skill_id and len(owners) > 1:
            errors.append(f"duplicate id {skill_id}: {', '.join(owners)}")

    for line in errors:
        print(line)
    print(f"{len(skills)} skills checked, {len(errors)} errors")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
