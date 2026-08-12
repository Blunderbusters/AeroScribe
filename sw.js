/* AeroScribe — offline shell.
   CACHE_VERSION must match "version" in version.json. */
const CACHE_VERSION = "3.97.1";
const CACHE = "insp-" + CACHE_VERSION;
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-1024.png", "./apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL).catch(() => c.add("./index.html")))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((k) => k !== CACHE && k !== "insp-ocr")
        .map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

function isHTML(req) {
  return req.mode === "navigate" ||
    (req.headers.get("accept") || "").indexOf("text/html") >= 0 ||
    /\.html(\?|$)/.test(new URL(req.url).pathname);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* the OCR engine is fetched from a CDN the first time; cache it so screenshots
     can be read with no signal afterwards */
  /* Google auth and Drive must always hit the network */
  if (url.hostname === "accounts.google.com" || url.hostname.endsWith("googleapis.com")) return;

  const OCR_HOSTS = ["cdn.jsdelivr.net", "tessdata.projectnaptha.com"];
  if (OCR_HOSTS.indexOf(url.hostname) >= 0) {
    e.respondWith(
      caches.open("insp-ocr").then((c) =>
        c.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  /* the update check must always see the network */
  if (url.pathname.endsWith("/version.json")) {
    e.respondWith(fetch(req, { cache: "no-store" }).catch(() => new Response("{}", {
      headers: { "Content-Type": "application/json" }
    })));
    return;
  }

  /* the app itself: network first, so a new upload lands on the next launch */
  if (isHTML(req)) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true })
        .then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  /* everything else: cache first, refresh behind the scenes */
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) {
        fetch(req).then((res) => {
          if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        }).catch(() => {});
        return hit;
      }
      return fetch(req).then((res) => {
        if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
