# Kuan Huang — academic homepage

A lightweight, static, single-page academic website. There is no build step: `index.html`
loads `contents/config.yml` and the Markdown files in `contents/` in the browser and assembles
the page. Editing the site means editing text files and refreshing.

---

## Acknowledgment

This site is based on the
[academic-homepage-template](https://github.com/senli1073/academic-homepage-template) by
**Sen Li**, used under the MIT License. The original `LICENSE` file and copyright notice are
preserved in this repository. The template's loading model (`config.yml` + Markdown sections)
is retained; the visual design, stylesheet, page markup, and all content are original to this
site.

---

## Structure

```
.
├── .nojekyll               # tells GitHub Pages to serve the files as-is (no Jekyll)
├── LICENSE                 # MIT License, Sen Li (template)
├── README.md
├── CLAUDE.md               # notes for AI coding assistants
├── CONTENT_REVIEW.md       # migration audit; NOT published on the site
├── index.html              # page shell: head, title area, navigation, footer
├── contents/
│   ├── config.yml          # site metadata, navigation, section list
│   ├── home.md             # biography, links, recent news
│   ├── research.md         # research themes, projects, funding
│   ├── publications.md     # publications by year + archive
│   ├── lab.md              # research group, students, collaborators
│   ├── teaching.md         # courses
│   ├── gallery.md          # photographs
│   └── cv.md               # CV description and link
└── static/
    ├── assets/
    │   ├── favicon.svg, favicon.png
    │   ├── img/            # portrait; gallery/ for gallery photographs
    │   └── pdf/            # CV and paper PDFs
    ├── css/main.css        # the entire stylesheet
    └── js/
        ├── marked.min.js   # Markdown parser (local copy)
        ├── js-yaml.min.js  # YAML parser (local copy)
        └── scripts.js      # loads config + Markdown, navigation behaviour
```

Everything is referenced with **relative paths**, so the site works both from a local server
and from `https://kuanhuang0624.github.io/`.

---

## How to edit

### Site metadata

`contents/config.yml`. Every key except `sections` is written into the element in `index.html`
that has the same `id`:

| Key | What it sets |
| --- | --- |
| `title` | Browser tab / page title |
| `masthead-eyebrow` | Small label above the name |
| `masthead-name` | Name in the title area |
| `masthead-role` | Position |
| `masthead-affiliation` | Department and university |
| `page-top-title` | Name in the sticky navigation bar |
| `copyright-text` | Footer copyright line |
| `footer-email-link` | Footer email link (`text` + `href`) |
| `footer-cv-link` | Footer CV link (`text` + `href`) |

The `<meta name="description">`, Open Graph tags, and canonical URL live in the `<head>` of
`index.html` and should be updated there if the title or affiliation changes.

### The biography

`contents/home.md`. The first block is a two-column layout:

```html
<div class="home-lead">
<div class="home-bio">

...biography paragraphs, written as ordinary Markdown...

</div>
<figure class="home-figure">
<img src="static/assets/img/kuan-huang-profile.jpg" width="800" height="784" alt="Portrait of Kuan Huang">
</figure>
</div>
```

Keep the blank lines around the Markdown — they are what let the Markdown inside the `<div>`
be parsed. On phones the layout collapses to one column with the biography first.

To change the portrait, drop the new file into `static/assets/img/`, update the `src`, and set
`width`/`height` to the image's real pixel dimensions (this prevents the page from jumping as
it loads).

The photograph behind the title area is set in `static/css/main.css` on `.masthead`
(`background-image`, with `background-position` chosen so the building and the Kean signage stay
in frame). The flat scrim on `.masthead::before` is what keeps the white title text readable;
raise or lower `--masthead-scrim` if the photograph is replaced.

### A news item

In `contents/home.md`, under `### Recent News`, add one line at the top of the `<ul class="news">`
list. Newest first:

```html
<li><span class="date">Mar 4, 2026</span><span>What happened. Links are written as &lt;a href="..."&gt;text&lt;/a&gt;.</span></li>
```

Always include a real date — the list is presented as recent news, so an undated or stale item
is misleading.

### A research project

In `contents/research.md`, under `### Research Projects`, add a numbered entry:

```markdown
3. **Project name** (2026 – present). One or two sentences on what the project does.
```

Funded awards go in the `### Funded Research` list below it, with the funder, year, role, and
award title. Only list what has actually been awarded.

### A publication

In `contents/publications.md`, add an entry under the right `#### <year>` heading (create the
heading if the year is new, and keep years in reverse chronological order). One entry is a
single Markdown list item; the indented continuation lines are joined into one paragraph:

```markdown
- Title of the paper, in sentence case.
  A. Author, **K. Huang**\*, B. Author.
  *Journal or conference name*, 2026.
  [Paper](https://doi.org/...) ·
  [PDF](static/assets/pdf/filename.pdf)
```

- `**K. Huang**` is what subtly highlights the name — keep the bold markers.
- `\*` after the name marks corresponding authorship.
- Add `*(student mentoring)*` on its own line for student-led papers.
- Links are optional; omit the line rather than guessing a URL.

Papers from 2021 and earlier sit inside the `<details class="archive">` block at the bottom.
When the visible list gets too long, move the oldest year heading and its entries inside that
block.

### A lab member

In `contents/lab.md`, under `### Student Researchers`, add the name to the list for the right
year. Do not label anyone "current" or "former" unless that is actually known.

### A course

In `contents/teaching.md`. Courses for the term being taught now go under
`### Current and Upcoming Courses`, replacing the *To be updated* line; everything else goes
under `### Previous Courses`. Use the format:

```markdown
- **CPS 4801 — Artificial Intelligence.** Spring 2026.
```

Move a course to *Previous Courses* once the semester ends. Do not publish room numbers or
meeting times unless they are current.

### A gallery image

1. Put the image in `static/assets/img/gallery/`.
2. In `contents/gallery.md`, add one entry to the `<ul class="gallery">` list:

```html
<li><figure>
  <img src="static/assets/img/gallery/photo-name.jpg" alt="Describe what the photograph shows" loading="lazy" decoding="async" width="1600" height="1067">
  <figcaption>Short caption, including the year.</figcaption>
</figure></li>
```

`width`/`height` should be the real pixel dimensions; the grid preserves the aspect ratio and
never crops. `loading="lazy"` keeps images off the critical path. The `alt` text should
describe the photograph, not repeat the caption.

The file currently contains a commented-out example and a placeholder paragraph — delete both
once real photographs are added.

### The CV

1. Replace `static/assets/pdf/Kuan_Huang_CV_2026.pdf` with the new PDF, keeping the same filename
   (that way no links need to change).
2. Update the *Last updated* line in `contents/cv.md`.

The CV is also linked from the home section, the footer, and the `<noscript>` block in
`index.html`.

---

## Preview locally

The page fetches `config.yml` and the Markdown files with `fetch()`, which browsers block for
`file://` URLs. Opening `index.html` by double-clicking will show an empty page — use a local
server instead:

```sh
cd /path/to/this/folder
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Stop the server with `Ctrl+C`.

After a change, check the page at desktop, tablet, and phone widths (the browser's device
toolbar is enough), and confirm the browser console is free of errors.

---

## Publishing through GitHub Pages

Not yet configured. When the site is ready to go live:

1. Copy the contents of this folder into the `kuanhuang0624.github.io` repository, replacing
   what is there. Keep `.nojekyll` — without it GitHub Pages runs Jekyll over the files.
2. Commit and push to the default branch.
3. In the repository, go to **Settings → Pages**, and under **Build and deployment → Source**
   choose **Deploy from a branch**, with the default branch and the `/ (root)` folder.
4. The site appears at <https://kuanhuang0624.github.io/>. Publishing a change can take a few
   minutes.

`CONTENT_REVIEW.md` and `CLAUDE.md` are working documents. They can stay in the repository —
they are never rendered on the site — or be removed before publishing.

---

## License

The template this site is built on is © Sen Li, 2023–2026, MIT License; see `LICENSE`.
Site content, text, images, and PDFs are © Kuan Huang.
