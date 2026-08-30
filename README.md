# Imagine Studio — Films & Photography

A dark, cinematic portfolio website for a photo & video production studio covering **weddings, commercial, automotive and real estate** work. Static HTML/CSS/JS — no build step, no framework, deployable anywhere.

## Pages

| Page | File | What's on it |
|---|---|---|
| Home | `index.html` | Full-bleed video hero, studio statement, 5 featured projects, services, showreel, stats, testimonials |
| Work | `work.html` | Filterable gallery (Weddings / Commercial / Automotive / Real estate / BTS), 34 items, lightbox, hover-play film cards |
| Films | `films.html` | 9 click-to-play film blocks incl. the showreel |
| Packages | `packages.html` | 3 pricing tiers per service + add-ons, process, FAQ |
| About | `about.html` | Story, principles, BTS gallery |
| Contact | `contact.html` | Enquiry form + contact details |

## View it locally

Double-click `index.html`, or serve it (nicer, avoids any browser file:// quirks):

```
cd EddieWebsite
python -m http.server 8000     # then open http://localhost:8000
```

## ⚠️ Before launch — replace the placeholders

All photos/videos are **free-license stock** (Unsplash / Pexels — free for commercial use, no attribution required) standing in for Eddie's real work. Everything lives in two folders; **keep the filenames** and nothing else needs to change:

- `assets/img/` — `wed-01..08` weddings · `com-01..08` commercial/product · `car-01..08` automotive · `re-01..06` real estate · `bts-01..04` behind-the-scenes · `hero-poster` hero fallback image · `about-portrait` **replace with a real photo of Eddie** · `about-side`
- `assets/video/` — `hero-loop.mp4` (short, muted background loop ~10s, keep it under ~5MB) · `showreel.mp4` · `film-wed-01/02`, `film-couple`, `film-car-01/02`, `film-com-01`, `film-re-01`, `film-bts-01`

Also replace, searching across the `.html` files:

1. **Email** — `hello@imaginestudio.com` (footer of every page + contact page + the form's `data-mailto`).
2. **Contact form** — create a free form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in `contact.html`. Until then the form gracefully falls back to opening the visitor's email app.
3. **City/phone** — the contact page currently says "Working worldwide"; add Eddie's city and phone/WhatsApp if wanted.
4. **Prices** — `packages.html` uses `$` placeholder prices. Adjust amounts/currency to Eddie's real rates (they're plain text, easy to find).
5. **Names & numbers** — film titles, couple names, testimonial quotes and the stats (250+ projects etc.) are invented placeholders. Make them true.
   Note: some stock photos show recognizable branded products (a Chanel bottle, Nike shoes, branded cars). Fine for a local preview, but don't launch commercial-portfolio pages with them — they could read as implied client work. Eddie's real shoots replace them anyway.
6. **About page** — fill in Eddie's real surname/story if he wants it public.

## Brand

Built as **Imagine Studio** — an evolution of his Instagram handle `@imagineshortfilms` (kept everywhere as the social link, so followers still find him). Alternate directions if he prefers: *Imagine Visuals*, *Imagine Films & Photo*, *Imagine Weddings & Films*. The wordmark is plain text in the `.logo` element — a one-line change in each page's header/footer.

## Tech notes

- Animations: GSAP + ScrollTrigger (reveals, parallax, counters), Lenis (smooth scroll), SplitType (headline reveals) — all vendored locally in `js/vendor/`, so the site works offline. Google Fonts (Fraunces + Manrope) is the only external dependency.
- Respects `prefers-reduced-motion` (animations disabled, everything visible) and degrades cleanly with JavaScript off.
- If the hero video ever fails to load, the hero falls back to a slow Ken-Burns still automatically.

## Deploy (free options)

- **Netlify**: drag the folder onto app.netlify.com/drop — done.
- **GitHub Pages**: push the repo, enable Pages on the repo settings.
- **Vercel**: `vercel` in this folder.

Delete the `example/` folder before deploying — it's the reference site used for inspiration, not part of this website.
