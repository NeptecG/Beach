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
Replace the file `assets/hero.jpg` with your own photo (keep the same name).
Landscape/wide photo works best. Done — it shows on both languages.

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

## 4. Opening hours, weekly program, reviews

Plain text inside `index.html` / `en/index.html` — search for the line you see
on the site and edit it.

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

## 6. Want an admin dashboard instead of editing files?

If you'd rather log in and upload photos/edit text from a panel (no files),
this site can be connected to a free git-based CMS like **Decap CMS**
(decapcms.org). That's a one-time developer setup; after that the owner manages
everything from a web login.

---

Questions a developer can answer fast — but for adding photos and changing text,
the steps above are all you need.
