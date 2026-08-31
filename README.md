# Imagine — Films & Photography

A dark, cinematic portfolio website for a **one-person** photo & video business covering **weddings, events, food, automotive and real estate**. The voice is deliberately honest and first-person — it's one photographer (Eddie), not an agency, and the copy never pretends otherwise. Static HTML/CSS/JS — no build step, no framework, deployable anywhere.

## Pages

| Page | File | What's on it |
|---|---|---|
| Home | `index.html` | Full-bleed video hero, personal intro, 5 featured projects, five service cards, showreel, testimonials |
| Work | `work.html` | Filterable gallery (Weddings / Events / Food / Automotive / Real estate / BTS), 38 items, lightbox, hover-play film cards |
| Films | `films.html` | 10 click-to-play film blocks incl. the showreel |
| Packages | `packages.html` | 3 tiers per service, **no prices** — every card leads to "Get a quote"; add-ons, process, FAQ |
| About | `about.html` | Eddie's story, principles, BTS gallery |
| Contact | `contact.html` | Enquiry form + contact details |

There are intentionally **no prices** on the site (quotes only), no invented stats, and modest, solo-realistic package deliverables. Keep it that way unless Eddie decides otherwise.

## View it locally

Double-click `index.html`, or serve it (nicer):

```
cd EddieWebsite
python -m http.server 8000     # then open http://localhost:8000
```

## ⚠️ Before launch — replace the placeholders

All photos/videos are **free-license stock** (Unsplash / Pexels — free for commercial use, no attribution required) standing in for Eddie's real work. Everything lives in two folders; **keep the filenames** and nothing else needs to change:

- `assets/img/` — `wed-01..08` weddings · `ev-01..06` events · `fd-01..06` food · `car-01..09` automotive · `re-01..06` real estate · `bts-01..04` behind-the-scenes · `hero-poster` hero fallback · `about-portrait` **replace with a real photo of Eddie** · `about-side`
- `assets/video/` — `hero-loop.mp4` (short, muted background loop ~10s, keep it under ~5MB) · `showreel.mp4` · `film-wed-01/02`, `film-couple`, `film-event-01`, `film-food-01`, `film-car-01/02`, `film-re-01`, `film-bts-01`

Also replace, searching across the `.html` files:

1. **Email** — `hello@imaginefilms.com` (footer of every page + contact page + the form's `data-mailto`).
2. **Contact form** — create a free form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in `contact.html`. Until then the form falls back to opening the visitor's email app.
3. **City/phone** — add Eddie's city and phone/WhatsApp on the contact page if wanted.
4. **Names** — film titles, couple names and testimonial quotes are invented placeholders. Swap in real projects and real quotes.
5. **Package deliverables** — photo counts and delivery windows are sensible solo-shooter estimates; have Eddie confirm they match how he actually works.
6. **About page** — fill in Eddie's real surname/story if he wants it public.
   Note: a few stock photos show recognizable branded cars — fine for automotive portfolios, but swap in his real shoots before launch anyway.

## Brand

Built as **Imagine — Films & Photography** (the header wordmark shortens it to "Imagine · Films & Photo"), an evolution of the Instagram handle `@imagineshortfilms` — kept everywhere as the social link, so followers still find him. The wordmark is plain text in the `.logo` element — a one-line change in each page's header/footer.

## Tech notes

- Animations: GSAP + ScrollTrigger (reveals, parallax), Lenis (smooth scroll, time-based easing; set `SMOOTH_SCROLL = false` in `js/main.js` to disable), SplitType (headline reveals) — all vendored locally in `js/vendor/`, so the site works offline. Google Fonts (Fraunces + Manrope) is the only external dependency.
- Respects `prefers-reduced-motion` and degrades cleanly with JavaScript off.
- If the hero video fails to load, the hero falls back to a slow Ken-Burns still automatically.

## Deploy (free options)

- **Netlify**: drag the folder onto app.netlify.com/drop — done.
- **GitHub Pages**: repo Settings → Pages → deploy from `main` / root.
- **Vercel**: `vercel` in this folder.

The `example/` folder (the reference site used for inspiration) is git-ignored on purpose — it's someone else's copyrighted website and must not be published.
