# BenefitBridge — prototype

Independent EPFO death-benefit claim prototype. Vanilla HTML/CSS/JS, no
build step, no server. This folder is the entire deployable app — its
contents become the root of the GitHub Pages site.

## Run locally

Serve this folder over HTTP (double-clicking `index.html` will not work
because ES modules and `fetch()` need HTTP):

```bash
python3 -m http.server 8080
# open http://localhost:8080/
```

## Deploy on GitHub Pages

See [DEPLOY.md](DEPLOY.md) for the full walkthrough. Short version:

1. Push the contents of this folder to a GitHub repo.
2. **Settings → Pages** → *Deploy from a branch* → branch = default,
   folder = `/ (root)`.
3. Wait for the first deployment. The prototype opens at
   `https://<user>.github.io/<repo>/`.

## What is real vs mocked

- Everything runs entirely in the browser.
- `localStorage` is the only persistence.
- OTPs are visible on screen. No SMS is sent.
- No network calls to any government service.
- Labelled "DEMO PROTOTYPE" on every screen.
