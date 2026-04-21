# lukeberetta.com (v2) — Project Guide

## Stack
- **Vanilla HTML/CSS/JS** — no framework, no bundler
- **GSAP 3** (CDN) for all animations
- **Custom dev server**: `node dev.js` — hot-reloads via SSE on file change
- **Single-page app**: everything lives in `index.html`

## Running locally
```
node dev.js
```
Open the URL printed in the terminal (default `http://localhost:3000`).

## Copy source of truth
Case study copy lives in `case-studies.md`. Always keep it in sync with `index.html` — update both whenever copy changes.

## Architecture

### Views
All views are `<div>` siblings in `index.html`. Only one is visible at a time.

| View key   | CSS selector    | File       |
|------------|-----------------|------------|
| `home`     | `.bio`          | index.html |
| `works`    | `.works`        | index.html |
| `apps`     | `.apps`         | index.html |
| `contact`  | `.contact`      | index.html |
| `journey`  | `.journey`      | index.html |
| `spritz`   | `.spritz`       | index.html |
| `kurtosys` | `.kurtosys`     | index.html |

Views are registered in `js/app.js` in the `views` object. Each entry needs `el`, `inners`, `extras` (carousel wraps), and `originals` (captured before masking).

### Animation system
Every text line or content block is wrapped in `.line-mask > .line-inner`. GSAP animates `y` between `110%` (hidden below clip) and `0%` (visible).

- `maskContent(selector)` — wraps each matched element as animation units; `<p>` elements are split line-by-line, all other elements are wrapped as a single block
- `maskNavLinks()` — wraps `.nav a` elements
- `captureOriginals(selector)` — saves original innerHTML before masking so splits can be recalculated on resize
- Case study content uses the selector `:is(p, h2)` (the `CASE_CONTENT` constant)

### Navigation
- Nav links use `data-to="viewName"` → calls `transitionTo(viewName)`
- Works list items use `data-to="viewName"` on the `.works-item` div to navigate to case studies
- Case study views show a "Back" link in the nav (`.nav a[data-back]`), hidden by default via `.back-mask` class. Regular nav links slide out, back link slides in — and vice versa on return.

## CSS conventions
- All tokens in `:root` — `--color-*`, `--font-*`, `--space-*`
- Key colors: `--color-accent` (`#FFA303` orange), `--color-bg` (`#101010`), `--color-text-muted` (`rgba(255,255,255,0.5)`)
- Font: `Rams` (local TTF at `fonts/Rams-569.ttf`) — loaded via `@font-face`
- Single breakpoint at `max-width: 600px` (padding only)

### Type scale
Three sizes, each with its own `font-size`, `line-height`, and `letter-spacing` tokens:

| Size | Token prefix | Font size | Line height | Letter spacing |
|------|-------------|-----------|-------------|----------------|
| Large | `--font-size-lg` etc. | `clamp(1.4rem, 0.3rem + 2vw, 2.5rem)` | `1` | `-0.02em` |
| Medium | `--font-size-md` etc. | `clamp(1.1rem, 0.4rem + 1.4vw, 1.8rem)` | `1.3` | `-0.01em` |
| Small | `--font-size-sm` etc. | `clamp(1rem, 0.3rem + 1vw, 1.25rem)` | `1.1` | `0em` |

Apply via utility classes `.text-lg`, `.text-md`, `.text-sm`. `body` defaults to large. Use medium for longform/body copy inside case studies, small for captions.

## Case study structure
Each case study follows this content formula:

```html
<div class="case-study-name case-study container">

  <!-- Intro: always first section, no carousel. Heading is the company/project name. -->
  <section class="case-section">
    <h2 class="heading">Company Name</h2>
    <p class="text-md">Intro paragraph.</p>
    <p class="text-md">Role: <span class="muted">...</span></p>
    <p class="text-md tight">Timeline: <span class="muted">...</span></p>
    <p class="text-md tight">Teams: <span class="muted">...</span></p>
  </section>

  <!-- Body sections: heading + body + optional carousel at the bottom -->
  <section class="case-section">
    <h2 class="heading">Section Title</h2>
    <p class="text-md">...</p>
    <div class="case-carousel-wrap">
      <div class="case-carousel">
        <div class="carousel-item">
          <div class="carousel-slide"><img src="img/..." alt="..." class="fill"></div>
          <p class="carousel-caption"><span>Label.</span> <span class="muted">Description.</span></p>
        </div>
      </div>
    </div>
  </section>

  <!-- Outro: always last section, no carousel -->
  <section class="case-section outro">
    <h2 class="heading">Outcome</h2>
    <p class="text-md">...</p>
  </section>

</div>
```

Rules:
- Carousels always sit at the bottom of a section — never between text blocks
- Headings with no body text below them should be removed
- `.case-carousel-wrap` default background is set in CSS — don't inline `style="background:"`
- Carousel captions: `<span>Label.</span> <span class="muted">Description.</span>`
- `.tight` class on `p.text-md` removes top margin — use on timeline/teams lines in the intro

## Adding a new case study
1. Add the HTML using the structure above in `index.html` (before `<nav>`)
2. Add the works item with `data-to="case-study-name"` on the `.works-item` div
3. Add CSS: `.case-study-name { display: none; }` (`.container` handles max-width)
4. In `app.js`, before the views object, add the init block:
   ```js
   const nameEl = document.querySelector('.case-study-name');
   nameEl.style.cssText = 'display:block;visibility:hidden';
   const nameOriginals = captureOriginals('.case-study-name :is(p, h2)');
   const nameInners = maskContent('.case-study-name :is(p, h2)');
   const nameCarouselWraps = Array.from(document.querySelectorAll('.case-study-name .case-carousel-wrap'));
   nameEl.style.cssText = '';
   ```
5. Register in the `views` object:
   ```js
   name: { el: '.case-study-name', inners: nameInners, extras: nameCarouselWraps, originals: nameOriginals }
   ```

## Assets
- Images: `img/` directory
- Favicons: `img/favicon*.png`, `img/apple-touch-icon.png`, `img/site.webmanifest`
- OG image: `img/og-image.png`
- Always compress image assets before adding them to the project
