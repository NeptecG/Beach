# How to edit this site

No coding needed for the everyday stuff. This is a plain HTML site — open the
files in any text editor (even Notepad), change the text, save. Below is where
everything lives.

The site is bilingual. Greek pages are in the main folder; the English copies
are in the `en/` folder. When you change something, change it in **both** the
Greek file and its English twin.

---

## 1. Photos

### The big homepage banner (hero)
Replace `assets/hero.jpg` with your own photo (keep the same name). Landscape /
wide works best. Done — it shows on both languages.

For the fastest possible loading, the template also ships smaller/modern copies
of the hero: `hero.webp`, `hero-mobile.jpg`, `hero-mobile.webp`. If you want that
speed boost with your own photo, export those sizes too (1600px wide for the
desktop ones, 1024px for the `-mobile` ones) using a free tool like squoosh.app.
If you only replace `hero.jpg`, the site still works — to avoid the browser
looking for the missing WebP, delete the two `image-set(...)` lines under
`.hero-photo` in `styles.css`.

### The gallery photos
Drop your photos into the `assets/gallery/` folder, named exactly:

```
01.jpg  02.jpg  03.jpg  04.jpg  05.jpg  06.jpg  07.jpg  08.jpg  09.jpg
```

They appear automatically on the Gallery page **and** the homepage strip.
No code editing. A slot with no file just shows a grey placeholder.
Keep each photo under ~500 KB so the site stays fast (use any free image
compressor, e.g. squoosh.app).

### The social-share image
`og-image.jpg` (in the main folder) is the picture shown when someone shares a
link on Facebook/Instagram/WhatsApp. Replace it with a nice 1200×630 photo.

---

## 2. Phone, email, address

These appear in the top bar and footer of every page. Use your editor's
"Find in all files" (or Find & Replace) to change them everywhere at once:

- Phone: `+30 26820 00000`
- Mobile: `+30 695 000 0000`
- Email: `info@yourbeachbar.gr`
- Address / postcode: `Πρέβεζα` / `Preveza`, `48100`

Tip: the phone also appears as a clickable link like `tel:+302682000000` — update
those too (no spaces in that form).

## 3. Menu items and prices

Open `menu.html` (Greek) and `en/menu.html` (English). Each item looks like:

```html
<span class="menu-item-name">Nescafe Frappe</span> ... <span class="menu-item-price">€</span>
```

Type your price right after the `€`, e.g. `€3.50`. Change the name text to
rename a dish.

**Printed / PDF menu:** the menu page has a "Print / Save as PDF" button. It
opens the browser's print dialog, which prints a clean version (no menu bar,
no footer) — or "Save as PDF" there to hand guests a file. Nothing to maintain.

## 4. Opening hours, weekly program, reviews

Plain text inside `index.html` / `en/index.html` — search for the line you see
on the site and edit it.

## 4b. Map, privacy policy, favicon

- **Map:** the Contact page has a live Google map + "Get directions" button set to
  the town. To pin your exact spot, open `contact.html` (and `en/contact.html`),
  find the `q=` value in the two map URLs and replace `Preveza 48100 Greece` with
  your place name on Google Maps (or `lat,long`).
- **Privacy / cookie policy:** `privacy.html` + `en/privacy.html` are ready —
  fill every `[bracketed]` item (business legal name, email service, date) with
  your real details. Linked from the footer and the cookie banner.
- **Favicon / phone-icon:** `favicon-*.png`, `apple-touch-icon.png`,
  `favicon.ico` and `site.webmanifest` are generated from the sun-and-wave icon.
  Replace these files if you rebrand.

## 5. Before going live (one-time setup)

- **Your web address:** search every file for `yourbeachbar.gr` and replace it
  with your real domain. It appears in the SEO tags, `sitemap.xml` and
  `robots.txt`.
- **Contact form:** right now the form just shows a "demo" message. To receive
  real emails, connect it to a free service like Formspree or Web3Forms
  (paste their form action into the `<form>` tag in `contact.html`), or ask a
  developer for 10 minutes of work.
- **Sales supervisor name:** the menu footer has a placeholder
  "Αγορανομικός υπεύθυνος" — add the responsible person's name.

## 6. Editing the menu bar, footer, phone — note

To keep the site fast and simple there is no "master template" file — each page
has its own copy of the top bar, navigation and footer. So if you change a nav
link, the footer text, or the phone number, make the change on **every** page
(the 5 Greek files in the main folder and the 4 English files in `en/`). The
easiest way is your editor's **Find in all files / Replace in all files**: search
the old text once, replace everywhere. (This is normal for a plain HTML site; the
trade-off buys you speed and zero dependencies.)

## 7. Want an admin dashboard instead of editing files?

If you'd rather log in and upload photos/edit text from a panel (no files),
this site can be connected to a free git-based CMS like **Decap CMS**
(decapcms.org). That's a one-time developer setup; after that the owner manages
everything from a web login.

---

Questions a developer can answer fast — but for adding photos and changing text,
the steps above are all you need.
