# Notes for future Claude Code sessions

This repository is Kuan Huang's academic homepage. Read this before changing anything.

## Architecture — do not replace it

- **Preserve the simple one-page design.** One `index.html`, one stylesheet, seven sections
  rendered from Markdown. The seven sections are anchors on that single page, not separate
  pages. Two exceptions serve their own URLs from the same Markdown pipeline:
  `projects/index.html` (`/projects/`, `contents/projects.md`, linked from the Research Lab
  section) and `gallery/index.html` (`/gallery/`, `contents/gallery.md`, reached from the
  GALLERY navigation item). Do not add further sub-pages without being asked.
- **Do not replace the template architecture.** `contents/config.yml` defines the site
  metadata, the navigation, and the section list; `contents/<id>.md` supplies each section's
  body; `static/js/scripts.js` fetches, parses, sanitises, and injects them. A page that
  carries `data-markdown="<name>"` on a container renders that one Markdown file instead of
  the configured section list; that is how `/projects/` and `/gallery/` work. A `sections`
  entry marked `page: true` keeps its navigation item but is not rendered on the front page.
- **Do not introduce a framework or build system.** No Jekyll, React, Vue, Astro, Next.js,
  npm, Node tooling, Ruby, bundlers, server-side code, databases, or a CMS. No al-folio, no
  Academic Pages, no other academic theme. The site must stay publishable as plain static
  files from the repository root.
- Third-party JavaScript stays **local** (`marked.min.js`, `js-yaml.min.js`). Do not add CDN
  scripts or stylesheets, and never reintroduce `polyfill.io`.
- No analytics, trackers, ad scripts, cookies, or external form embeds.
- Fonts are the system stack. Do not add Google Fonts or icon fonts.
- There is no dark mode and no theme switcher; do not add one.

## Content

- **Store content in `contents/*.md`.** Do not move prose into `index.html` or `scripts.js`.
- **Store main settings in `contents/config.yml`.** Each key there maps to an element `id` in
  `index.html`; adding a key without a matching element logs a console warning.
- **Do not invent professional information.** Never add publications, grants, awards, students,
  collaborators, courses, titles, dates, or affiliations that are not verifiable from material
  already in this repository or supplied directly by Kuan Huang. If something is missing or
  looks stale, record it in `CONTENT_REVIEW.md` and ask — do not fill the gap from Google
  Scholar, a university directory, or any other outside source.
- Do not describe a course as current, or a person as a current group member, unless the
  semester or status is explicitly confirmed.
- Recent News entries must carry a real date.
- `CONTENT_REVIEW.md` is a working document. It must never be linked or rendered on the site.

## Design intent

The design is deliberately restrained: warm white background, dark charcoal text, one muted
blue-gray accent, thin rules, a system font stack, ~1000px content width, no cards, no heavy
shadows, no pill buttons, no gradients, no decorative background text, no image slideshow, and
no animation beyond navigation behaviour. Keep it that way. Everything lives in
`static/css/main.css`; the publications and gallery styles are scoped by section id so that
the Markdown files stay clean.

## After changes

- **Check the mobile layout.** Verify roughly 1440px, 1024px, and 390px widths, and confirm
  there is no horizontal overflow at 390px.
- Preview through a local HTTP server (`python3 -m http.server 8000`) — `file://` breaks the
  `fetch()` calls that load the content. Stop the server when done.
- Confirm the browser console is clean and that no request 404s.
- Keep it accessible: skip link, visible focus rings, correct heading order (one `h1` in the
  title area, `h2` per section, `h3`/`h4` inside), descriptive `alt` text, working keyboard
  navigation, `prefers-reduced-motion` support, and the `<noscript>` fallback with contact
  details.

## License and deployment

- **Preserve the MIT license.** `LICENSE` (© Sen Li, 2023–2026) covers the
  [academic-homepage-template](https://github.com/senli1073/academic-homepage-template) this
  site is based on. Do not delete or rewrite it, and keep the acknowledgment in `README.md`.
- **Never push or deploy without explicit instruction.** Do not add a git remote, push a
  branch, enable GitHub Pages, or modify the live `kuanhuang0624.github.io` repository unless
  Kuan Huang asks for it in that session.
