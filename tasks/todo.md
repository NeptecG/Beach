# Beach Bar Template - Preveza (48100)

Reference: mojito-beachbar.gr (structure only, no brand assets, no logo)
Excluded per spec: Accommodation, Ceremonies

## Update 2026-06-12 (round 4 - cobalt palette)

- [x] User rejected teal; chose Cobalt from presented options. New "sea" family: deep #16225c, main #2541b2, gradient-light #4f6fdc, aqua #8fa7e8. Sand/coral/gold unchanged.
- [x] Replaced across styles.css (vars, hero + error-hero gradients, mc-1 card, rgba borders/focus rings) and all 9 HTML files (theme-color, favicon wave, 404 buoy center).
- [x] Verified in browser: home hero + 404 render cobalt. Note: python http.server lets browsers cache styles.css aggressively; hard-refresh (Ctrl+F5) needed after CSS edits.

## Update 2026-06-12 (round 3 - bilingual)

- [x] Greek is now the MAIN site (root: index/menu/gallery/contact.html, lang="el"); English moved to /en/
- [x] Greek typography rule: ALL-CAPS text written without accents (ΑΡΧΙΚΗ, ΜΕΝΟΥ, ΕΠΙΚΟΙΝΩΝΙΑ, ΦΩΤΟΓΡΑΦΙΑ...; diaeresis kept: ΚΟΚΤΕΪΛ), lowercase fully accented; capitalized words keep initial accent (Ήλιος)
- [x] ΕΛ/EN switch in header, page-to-page mapping (menu <-> en/menu etc.), works both directions
- [x] Fonts unified both languages: Alegreya (display+script italic) + Alegreya Sans (body) - full Greek glyph support; Fraunces/Caveat dropped (no Greek)
- [x] Euro sign: .menu-item-price gets explicit Alegreya Sans stack so € always renders
- [x] Cookie banner translated (Greek on el pages, English on en pages) via <html lang>; form success note too
- [x] Marquee removed entirely (HTML + CSS)
- [x] Playful 404.html: spinning lifebuoy as the zero, "Αυτή η σελίδα πήγε για μπάνιο" + EN line, CTAs home/menu, noindex
- [x] SEO: hreflang el/en/x-default on all 8 pages, og:locale per language, Greek JSON-LD on root home, sitemap with xhtml:link alternates
- [x] Verified (Playwright): GR home/menu render, € visible, ΕΛ/EN round-trip, GR+EN cookie banners, 404, 375px mobile, zero console errors

## Update 2026-06-12 (round 2)

- [x] Cookie consent banner (bottom-left, like reference): "We value your privacy", Customise / Reject All / Accept All, Customise opens Necessary/Analytics/Marketing toggles, choice stored in localStorage key "beachbar-cookie-consent", script hook left for loading analytics/marketing scripts after consent
- [x] SEO: per-page canonical + robots + theme-color, Open Graph + Twitter cards, SVG favicon, JSON-LD BarOrPub schema on home (address Preveza 48100, phone, hours, geo placeholder), robots.txt, sitemap.xml. Placeholder domain yourbeachbar.gr - replace when real domain exists; og-image.jpg referenced but not created
- [x] Verified: banner renders + Customise flow + persistence across pages (via Playwright; note - Claude Preview screenshot tool auto-clicks Accept All on cookie banners, not a site bug), zero console errors

## Plan

- [x] Project scaffold: static HTML/CSS/JS (no build step, easy template reuse)
- [x] styles.css - design system (sand/teal/coral, Fraunces + Alegreya Sans + Caveat, grain + wave dividers)
- [x] index.html - topbar, nav, hero, beach bar intro, why-us (4 features), menu preview, weekly program, gallery strip, reviews, contact strip, footer
- [x] menu.html - full catalogue from reference price list: Coffees, Refreshments, Fresh Juices, Breakfast, Draught/Bottle Beers, Ciders, Drinks, Bottles, White/Rose/Red/Sparkling Wines, Tiki Cocktails, Classic Cocktails, Snacks, Starters, Salads, Spaghetti, The Grill, Ice Cream, Pancakes (bilingual GR|EN, blank dotted price leaders - template)
- [x] gallery.html - placeholder image grid (template, no copyrighted photos)
- [x] contact.html - address Preveza 48100, tel +30 26820 00000, mobile +30 695 000 0000, hours, form, map placeholder
- [x] script.js - mobile nav, scroll reveal, sticky menu chips
- [x] Brand-specific renames: Mojito Salad -> House Salad, Mojito Burger -> House Burger, Mojito Club -> House Club, Lost in Rhodes -> Lost in Preveza, Mojito Feast -> House Feast
- [x] Verify: render in browser, screenshot desktop + 375px mobile, check console errors

## Review

- Verified in live preview (python http.server, port 8765): home, menu, contact, gallery all render; zero console errors/warnings.
- Mobile (375px): hamburger nav opens/closes, hero readable. Fixed sun overlapping the gold kicker text by repositioning the sun on small screens.
- Menu page: sticky category chips with scrollspy highlight work; Greek text renders correctly (Alegreya Sans has Greek glyphs).
- Fixed menu hero kicker color from coral to gold for contrast on the teal gradient.
- Generic wordmark only ("BEACH BAR / Preveza, Greece" text), no logo, per template requirement.
- Accommodation and Ceremonies intentionally excluded from nav and pages.
- Reference price list kept at ../mojito-pricelist.pdf for comparison; delete when no longer needed.
- To launch preview later: server name "beach-bar-template" in ~/.claude/launch.json (python -m http.server 8765).
