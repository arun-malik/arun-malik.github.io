import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "session_log.py"
SPEC = importlib.util.spec_from_file_location("session_log", SCRIPT)
session_log = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(session_log)


class SessionLogTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        root_patch = patch.object(session_log, "ROOT", self.root)
        root_patch.start()
        self.addCleanup(root_patch.stop)

    def test_post_and_nested_assets_share_one_folder(self):
        post = self.root / "posts" / "example"
        post.mkdir(parents=True)
        for path in (
            "posts/example/index.html",
            "posts/example/images/nested/chart.png",
            "posts/example/assets/css/style.css",
        ):
            with self.subTest(path=path):
                self.assertEqual(session_log.project_folder(path), post)
        self.assertEqual(session_log.project_folder("assets/images/logo.png"), self.root)
        self.assertEqual(session_log.project_folder("index.html"), self.root)

    def test_skips_logs_and_tooling(self):
        for path in (
            "posts/example/session.txt", ".worktrees/other/index.html",
            "node_modules/module/index.js", ".git/config",
            ".playwright-mcp/screenshot.png", "archive/old/index.html",
        ):
            with self.subTest(path=path):
                self.assertIsNone(session_log.project_folder(path))

    def test_deleted_folder_uses_surviving_parent(self):
        posts = self.root / "posts"
        posts.mkdir()
        self.assertEqual(session_log.project_folder("posts/deleted/index.html"), posts)
        self.assertFalse((posts / "deleted").exists())

    def test_outside_checkout_is_rejected(self):
        with self.assertRaises(ValueError):
            session_log.project_folder("../outside/index.html")

    def test_repeated_session_preserves_name_position_and_first_seen(self):
        session_log.record(self.root, "session-a", "First", "2026-11-18 09:00")
        session_log.record(self.root, "session-b", "Other", "2026-11-18 09:01")
        session_log.record(self.root, "session-a", "Renamed", "2026-11-18 09:02")
        rows = [
            [column.strip() for column in line.split("|")]
            for line in (self.root / "session.txt").read_text().splitlines()
            if not line.startswith("#")
        ]
        self.assertEqual(rows, [
            ["2026-11-18 09:00", "2026-11-18 09:02", "2", "session-a", "First"],
            ["2026-11-18 09:01", "2026-11-18 09:01", "1", "session-b", "Other"],
        ])

    def test_legacy_log_migrates_without_duplicate_sessions(self):
        path = self.root / "session.txt"
        path.write_text(
            "# first_seen | last_seen | session_id | session_name\n"
            "2026-11-18 09:00 | 2026-11-18 09:01 | session-a | Original\n"
            "2026-11-18 09:02 | 2026-11-18 09:02 | session-b | Other\n",
            encoding="utf-8",
        )
        session_log.record(self.root, "session-a", "Renamed", "2026-11-18 09:03")
        session_log.record(self.root, "session-c", "New", "2026-11-18 09:04")
        self.assertEqual(session_log.read_rows(path), [
            ["2026-11-18 09:00", "2026-11-18 09:03", 2, "session-a", "Original"],
            ["2026-11-18 09:02", "2026-11-18 09:02", 1, "session-b", "Other"],
            ["2026-11-18 09:04", "2026-11-18 09:04", 1, "session-c", "New"],
        ])
        self.assertIn("| updates |", path.read_text(encoding="utf-8"))

    def test_invalid_log_is_not_overwritten(self):
        path = self.root / "session.txt"
        for contents in (
            "unrecognized row\n",
            "first | last | invalid | session-a | Original\n",
            "first | last | 0 | session-a | Original\n",
        ):
            with self.subTest(contents=contents):
                path.write_text(contents, encoding="utf-8")
                with self.assertRaisesRegex(ValueError, "Invalid session log row"):
                    session_log.record(self.root, "session-a", "Name", "2026-11-18 09:03")
                self.assertEqual(path.read_text(encoding="utf-8"), contents)

    def test_git_status_handles_renames_spaces_and_unicode(self):
        status = (
            "R  posts/new name/index.html\0posts/old/index.html\0"
            "?? posts/caf\u00e9/index.html\0 M index.html\0"
        ).encode("utf-8")
        with patch.object(session_log, "git", return_value=status):
            self.assertEqual(session_log.changed_files(), [
                "posts/new name/index.html", "posts/caf\u00e9/index.html", "index.html",
            ])

    def test_cli_explicit_paths_and_staging(self):
        subprocess.run(["git", "init", "-q", str(self.root)], check=True)
        (self.root / "index.html").write_text("test")
        with patch("sys.argv", [
            str(SCRIPT), "--id", "test-session", "--name", "Test session",
            "--stage", str(self.root / "index.html"),
        ]):
            session_log.main()
        staged = session_log.git("diff", "--cached", "--name-only").decode().splitlines()
        self.assertEqual(staged, ["session.txt"])
        self.assertIn("test-session", (self.root / "session.txt").read_text())


if __name__ == "__main__":
    unittest.main()
