from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import unittest
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
DECK = "/talks/ai-agents-incident-response/"


class PageLinks(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.urls = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag in {"a", "link"} and "href" in attributes:
            self.urls.append(attributes["href"])
        if tag in {"img", "script"} and "src" in attributes:
            self.urls.append(attributes["src"])


class PresentationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(
            ("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)),
        )
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.origin = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def test_library_links_and_resources_resolve(self):
        with urlopen(self.origin + "/talks/") as response:
            self.assertEqual(response.status, 200)
            source = response.read().decode("utf-8")
        urls = PageLinks(source).urls
        self.assertIn(DECK, urls)
        self.assertIn(DECK + "slides.pdf", urls)
        for url in set(urls):
            if urlsplit(url).netloc:
                continue
            with self.subTest(url=url), urlopen(urljoin(self.origin + "/talks/", url)) as response:
                self.assertEqual(response.status, 200)
                response.read()

    def test_shared_deck_and_pdf_remain_directly_accessible(self):
        for path in (DECK, DECK + "?theme=dark", DECK + "index.html"):
            with self.subTest(path=path), urlopen(self.origin + path) as response:
                source = response.read().decode("utf-8")
                self.assertIn('id="slide-1"', source)
                self.assertNotIn("<h1>Presentations</h1>", source)
                self.assertEqual(response.geturl(), self.origin + path)
        with urlopen(self.origin + DECK + "slides.pdf") as response:
            self.assertEqual(response.headers.get_content_type(), "application/pdf")
            self.assertTrue(response.read().startswith(b"%PDF-"))

    def test_library_and_original_deck_are_in_sitemap(self):
        root = ET.parse(ROOT / "sitemap.xml").getroot()
        locations = [
            node.text for node in root.findall("{*}url/{*}loc")
        ]
        for path in ("/talks/", DECK):
            self.assertIn("https://blog.arunmalik.dev" + path, locations)


if __name__ == "__main__":
    unittest.main()
