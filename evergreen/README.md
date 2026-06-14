# Evergreen

A complete, build-free, dependency-free website that runs straight from static
files. No bundler, no `node_modules`, no compile step — just web platform
features that are Baseline in current Firefox, Safari, and Chrome.

What it demonstrates:

- **Native ES modules** — one `<script type="module">` boots the whole app.
- **JSON modules** — the blog loads from a single `data/posts.json` via
  `import posts from "./posts.json" with { type: "json" }`.
- **Hash routing** — works on any static host because routes live after the `#`,
  which the server never sees.
- **View Transitions** — pages animate via `document.startViewTransition()`, and
  a blog card's title morphs into the article title.
- **Custom Elements** — `<html-include>` composes shared HTML fragments; the blog
  is two small elements.
- **Cascade layers** — one stylesheet composes the rest with `@layer`, so file
  order never fights specificity.

## Run it locally

ES modules, `fetch`, and JSON imports all require HTTP — opening `index.html`
from `file://` will **not** work. Serve the folder with any static server:

```sh
# Python (built in on macOS / most Linux)
python3 -m http.server 8000

# or Node, no install:
npx serve
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages → Build and deployment**, set **Source** to
   *Deploy from a branch*, choose your branch, and set the folder to `/ (root)`.
3. Wait for the build, then open the published URL.

Notes:

- All asset paths are **relative**, and runtime fetches resolve against
  `document.baseURI`, so the site works whether it's served from a domain root
  or a project subpath like `https://user.github.io/repo/` — no config needed.
- `.nojekyll` is included so GitHub Pages serves every file as-is.
- `404.html` is a safety net for hand-typed deep paths. If you deploy to a
  **user/org page** or a **custom domain at the root** (not a project subpath),
  open `404.html` and set `PATH_SEGMENTS = 0`.

## Project layout

```
evergreen/
├─ index.html          # the single shell + one module import
├─ 404.html            # static-host fallback for deep links
├─ data/
│  └─ posts.json       # the entire blog, as data
├─ styles/
│  ├─ index.css        # @layer + @import composition root
│  ├─ reset.css  tokens.css  base.css
│  ├─ layout.css  components.css  transitions.css
├─ js/
│  ├─ main.js          # the one import: registers components, starts router
│  ├─ router.js        # hash router + view transitions
│  ├─ routes.js        # the route table
│  └─ dom.js           # tiny shared helpers
├─ components/
│  ├─ html-include.js  # <html-include src="…">
│  ├─ theme-toggle.js  # dark/light, persisted
│  ├─ blog-list.js     # post cards from JSON
│  └─ blog-post.js     # single post from JSON
├─ partials/
│  ├─ header.html      # shared, included once
│  └─ footer.html
└─ pages/
   ├─ home.html  about.html  blog.html
   ├─ contact.html  not-found.html
```

## Extend it

- **Add a page:** create `pages/your-page.html`, add a line to `js/routes.js`,
  and link to it with `<a href="#/your-page">`.
- **Add a blog post:** add an object to `data/posts.json`
  (`slug`, `title`, `date`, `tags`, `excerpt`, `content`). The `content` is an
  HTML string. Newest posts sort first automatically.
- **Restyle:** every colour, font, and size comes from `styles/tokens.css`.

## Browser support

Targets current evergreen browsers. The newest feature used —
**same-document view transitions** — is Baseline as of Chrome 111, Safari 18,
and Firefox 144. Where transitions aren't supported, navigation still works; it
just doesn't animate.
