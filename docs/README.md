# LusoNetworks — website

Smart home, Wi-Fi, cameras & sensors set up across Greater Lisbon.
A fast, static, multi-page site (no build step, no dependencies) with a
dark/light theme, EN/PT language toggle, and a WhatsApp quote builder.

## Files

| File | What it is |
|---|---|
| `index.html` | Home |
| `services.html` | Packages, full à-la-carte price list, care plans, how it works |
| `quote.html` | Interactive quote builder (sends a prefilled WhatsApp message) |
| `about.html` | About + FAQ |
| `contact.html` | WhatsApp / email / coverage |
| `404.html` | Friendly not-found page |
| `assets/style.css` | All styling (dark-first theme, light toggle) |
| `assets/app.js` | All logic + EN/PT translations + the price catalog |
| `assets/favicon.svg` | Site icon (cyan network mark) |
| `assets/og-image.png` | Social-share preview image |
| `assets/site.webmanifest` | PWA / home-screen metadata |
| `robots.txt`, `sitemap.xml`, `.nojekyll` | Search-engine & GitHub Pages helpers |

## Before you publish — 2 edits

**1. Your contact details.** Open `assets/app.js` and edit the two lines marked
`EDIT-ME` near the top:

```js
const WA_NUMBER    = '351900000000';          // your WhatsApp, digits only, e.g. 351912345678
const CONTACT_EMAIL= 'hello@lusonetworks.pt'; // your email
```

Every WhatsApp button and the quote-sender wire up from those automatically.

**2. Your site URL.** The SEO tags use a placeholder host, `USERNAME.github.io`.
Find-and-replace `USERNAME.github.io` with your real GitHub Pages host across
these files: every `.html`, `robots.txt`, `sitemap.xml`. (If you set up a custom
domain later, use that instead, e.g. `lusonetworks.pt`, and add a `CNAME` file.)

## Deploy (free, GitHub Pages)

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch.**
3. Pick your branch (`main`) and set the folder to **`/docs`**, then Save.
4. Wait ~1 minute. Your site is live at `https://USERNAME.github.io/`.

All paths are relative, so you can also just open `index.html` locally to preview.

## Editing prices / services

Everything lives in **one place**: the `CATALOG` array at the top of
`assets/app.js`. Each item has a `price`, an optional `to` (upper end of a
range), an optional `unit`, and English + Portuguese name/description. The price
list **and** the quote builder both render from it, so you only change a price
once.

## Theme & language

Dark is the default. The sun/moon button switches to light; the EN/PT button
switches language. Both are remembered in the visitor's browser.
