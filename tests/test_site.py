"""Dependency-free static-site checks for the public Athena/Aegis website."""
import re
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted(ROOT.glob("*.html"))
PUBLIC = {p.name for p in PAGES if p.name != "404.html"}


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.refs = []
        self.tags = []
        self.images = []
        self.meta = {}
        self.titles = []
        self.h1_count = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        self.tags.append(tag)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag == "h1":
            self.h1_count += 1
        if tag == "meta":
            key = values.get("name") or values.get("property")
            if key:
                self.meta[key] = values.get("content", "")
        if tag in ("a", "link") and values.get("href"):
            self.refs.append(values["href"])
        if tag in ("img", "script", "source") and values.get("src"):
            self.refs.append(values["src"])
        if tag == "source" and values.get("srcset"):
            for item in values["srcset"].split(","):
                self.refs.append(item.strip().split(" ")[0])
        if tag == "img":
            self.images.append(values)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def load_pages():
    data = {}
    for page in PAGES:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        parser.close()
        data[page.name] = parser
    return data


class SiteIntegrity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = load_pages()

    def test_has_expected_pages(self):
        self.assertGreaterEqual(len(PUBLIC), 7)
        for name in ("index.html", "athena.html", "aegis.html", "experience.html",
                     "editions.html", "integration.html", "legal.html", "404.html"):
            self.assertTrue((ROOT / name).is_file(), name)

    def test_semantics_and_unique_ids(self):
        for name, parser in self.pages.items():
            with self.subTest(page=name):
                self.assertEqual(1, parser.h1_count, "exactly one H1")
                self.assertIn("main", parser.tags)
                self.assertEqual(len(parser.ids), len(set(parser.ids)), "duplicate id")
                for img in parser.images:
                    self.assertIn("alt", img, "image needs alt text, possibly empty if decorative")

    def test_internal_urls_and_anchors(self):
        for name, parser in self.pages.items():
            for ref in parser.refs:
                with self.subTest(source=name, href=ref):
                    url = urlsplit(ref)
                    if url.scheme or url.netloc or ref.startswith("//"):
                        continue
                    relative = unquote(url.path or name).replace("\\", "/")
                    # Local links use "./", except same-page fragments.
                    target = (ROOT / relative).resolve()
                    self.assertTrue(target.is_relative_to(ROOT), "link escapes site root")
                    self.assertTrue(target.exists(), "missing local link or asset")
                    if url.fragment and target.suffix.lower() == ".html":
                        other = self.pages.get(target.name)
                        self.assertIsNotNone(other, "target page not parsed")
                        if other:
                            self.assertIn(unquote(url.fragment), other.ids, "missing anchor")

    def test_stylesheet_assets(self):
        for path in ROOT.glob("*.css"):
            content = path.read_text(encoding="utf-8")
            for raw in re.findall(r"url\(\s*([^)]*?)\s*\)", content):
                ref = raw.strip(" \t\r\n\"'")
                if not ref or ref.startswith(("data:", "http:", "https:", "#")):
                    continue
                with self.subTest(stylesheet=path.name, url=ref):
                    asset = unquote(ref).split("?")[0].split("#")[0]
                    self.assertTrue((path.parent / asset).exists())

    def test_sharing_metadata(self):
        for name in PUBLIC:
            with self.subTest(page=name):
                content = (ROOT / name).read_text(encoding="utf-8")
                self.assertIn('<link rel="canonical"', content)
                self.assertIn('name="twitter:card"', content)
                self.assertIn('property="og:image"', content)
                self.assertIn('property="og:url"', content)
                self.assertIn("<title>", content)

    def test_paired_art_and_release_clarity(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        editions = (ROOT / "editions.html").read_text(encoding="utf-8")
        scenery = (ROOT / "living-realms.css").read_text(encoding="utf-8")
        self.assertIn("athena-cybernetic.svg", home)
        self.assertIn("aegis-cybernetic.svg", home)
        self.assertIn("aegis-spartan-patrol.jpg", home)
        self.assertIn("athena-goddess.webp", home)
        self.assertIn("athena-water.webp", scenery)
        self.assertIn("aegis-fire.webp", scenery)
        self.assertIn("Qwen3.8-27B", editions)
        self.assertIn("Qwen3.5-4B", editions)
        self.assertNotIn("Google Play release planned", editions)
        self.assertIn("not yet available", editions)

    def test_sitemap_and_vector_art(self):
        ET.parse(ROOT / "sitemap.xml")
        for image in (ROOT / "assets").glob("*.svg"):
            with self.subTest(svg=image.name):
                ET.parse(image)
        content = (ROOT / "CNAME").read_text(encoding="utf-8").strip()
        self.assertEqual("athenaaegissystems.com", content)


if __name__ == "__main__":
    unittest.main()
