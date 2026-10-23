#!/usr/bin/env python3
"""Local dev server for the Griffins site.

Resolves clean URLs the way GitHub Pages does, so local preview matches
production:  /roster -> roster.html,  /rugby -> rugby.html,  etc.

Plain `python -m http.server` cannot do this: it 404s extensionless URLs
(and on Windows /roster even collides with the gitignored Roster/ folder),
which is why every page except the home page looked like broken plain text.

Also sends Cache-Control: no-store so you always see the latest edits
without cache-busting query strings.

Run:  python _serve.py           (defaults to port 8000)
      python _serve.py 8001      (custom port)
Stop: Ctrl+C

Tracked in git (whitelisted in .gitignore) so every editor can preview locally.
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class CleanURLHandler(SimpleHTTPRequestHandler):
    def _resolve_clean_url(self):
        """Map an extensionless clean URL to its .html file.

        Returns one of:
          ("rewrite", newpath)   serve that .html inline (URL stays clean)
          ("redirect", location) send a 302 to the explicit .html
          None                   leave the request untouched

        A trailing slash (e.g. a browser-cached `301 /roster -> /roster/`
        from the old server, colliding with the gitignored Roster/ folder)
        must NOT be served inline: at /roster/ the browser resolves relative
        assets as /roster/style.css and /roster/data/*.json, which 404, so
        the page renders unstyled with no data. Bouncing to /roster.html
        resets the base path so every relative asset resolves correctly."""
        path = urlparse(self.path).path
        if path == "/":
            return None
        rel = unquote(path).strip("/")  # strip leading AND trailing slash
        if "." in os.path.basename(rel):
            return None
        candidate = rel + ".html"
        if not os.path.isfile(candidate):
            return None
        query = self.path[len(path):]  # preserve ?query#frag
        target = "/" + candidate + query
        return ("redirect", target) if path.endswith("/") else ("rewrite", target)

    def _handle_clean_url(self):
        resolved = self._resolve_clean_url()
        if resolved is None:
            return False
        kind, target = resolved
        if kind == "redirect":
            self.send_response(302)  # 302, not 301: never gets cached hard
            self.send_header("Location", target)
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            return True
        self.path = target
        return False

    def do_GET(self):
        if self._handle_clean_url():
            return
        super().do_GET()

    def do_HEAD(self):
        if self._handle_clean_url():
            return
        super().do_HEAD()

    def end_headers(self):
        # No caching during local dev; matches nothing GitHub Pages does but
        # keeps the browser from serving stale HTML/CSS while iterating.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), CleanURLHandler)
    print(f"Griffins dev server (clean URLs) -> http://localhost:{PORT}")
    print("Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
