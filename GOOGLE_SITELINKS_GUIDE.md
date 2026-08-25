# Google Sitelinks Optimization Guide for jurgen.fyi

Comprehensive guide on qualifying for and optimizing [Google Search Sitelinks](https://developers.google.com/search/docs/appearance/sitelinks) for **[jurgen.fyi](https://jurgen.fyi)**.

---

## 1. What Are Google Sitelinks?

Sitelinks are automated shortcuts and subpage links that Google displays beneath the main search result for branded queries (e.g. searching *"Jürgen Jacobsen"*, *"Jurgen Jacobsen"*, or *"jurgen.fyi"*).

Google’s algorithm automatically determines whether to display sitelinks based on:
1. Clear website hierarchy and site architecture.
2. Distinct, descriptive page titles (`<title>`) and primary headings (`<h1>`).
3. High internal link authority and crawlable anchor text.
4. Structured Data (Schema.org) connecting the brand name to the domain.

---

## 2. Optimization Pillars for jurgen.fyi

### 🏷️ Pillar 1: Distinct & Informative Titles and Headings
Google uses `<title>` tags and `<h1>` headings as the source for sitelink labels.

* **Target Page Titles & Labels:**
  * **Code (`/code`):** `Software Projects & Open Source | Jürgen Jacobsen` *(Candidate label: "Code" or "Software Projects")*
  * **CV (`/cv`):** `Curriculum Vitae & Career Timeline | Jürgen Jacobsen` *(Candidate label: "CV" or "Resume")*
  * **Aviation (`/aviation`):** `Commercial Aviation & Flight Experience | Jürgen Jacobsen` *(Candidate label: "Aviation")*
  * **Charts (`/charts`):** `Aeronautical Cartography & Procedure Design | Jürgen Jacobsen` *(Candidate label: "Aeronautical Charts")*
  * **Contact (`/contact`):** `Contact & Inquiries | Jürgen Jacobsen` *(Candidate label: "Contact")*

---

### 🔗 Pillar 2: Crawlable Internal Links vs. JavaScript Handlers
Google requires regular HTML links (`<a href="...">`) to crawl site structure and calculate internal PageRank flow.

* **Issue with `<button onClick={() => navigate("/code")}>`:**
  * Web crawlers do not execute arbitrary button click handlers to find links.
  * Users cannot middle-click or right-click to open in a new tab.
* **Solution with React Router `<Link to="/code">`:**
  * Renders a real `<a href="/code">` in the HTML DOM for Googlebot.
  * Intercepts clicks client-side for instant, zero-reload SPA navigation.

---

### 🗺️ Pillar 3: Consistent Global Navigation & Anchor Text
* Keep anchor texts consistent across the global navigation (`Navbar.tsx`), homepage (`Hero.tsx`, `QuickInfo.tsx`), and `Footer.tsx`.
* Use clear, descriptive anchor text (e.g., *"Explore Software Projects"* instead of generic *"Click Here"*).
* Ensure all links point to live canonical routes.

---

### 🧩 Pillar 4: Structured Data & Schema.org Alignment
* **`WebSite` Schema with `alternateName`:**
  Firmly links branded searches (*"Jurgen Jacobsen"*, *"jurgen.fyi"*) to the root domain.
  ```json
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jurgen.fyi/#website",
    "url": "https://jurgen.fyi/",
    "name": "Jürgen Jacobsen",
    "alternateName": ["Jurgen Jacobsen", "jurgen.fyi", "Jürgen Jacobsen Portfolio"],
    "description": "Portfolio of Jürgen Jacobsen, Commercial Pilot and Web Developer.",
    "inLanguage": "en-GB"
  }
  ```
* **`BreadcrumbList` Schema (Active):**
  Maps the hierarchical trail (`jurgen.fyi > code > [project]`), allowing Google to display rich breadcrumbs and structured paths in search listings.

---

### ✍️ Pillar 5: Substantive Content Depth
* Sitelinks are only awarded to pages with rich, unique, and useful content.
* Expanding sections with concrete data (flight hours, aircraft types, project case studies, and design methodology) increases the likelihood of those pages being chosen as sitelink targets.

---

## 3. Implementation Checklist

- [x] **Distinct & Informative `<title>` tags across all routes (Pillar 1)**
- [x] **Convert Hero, Highlight & Contact buttons to semantic `<Link>` / `<a>` components (Pillar 2)**
- [x] **Add `BreadcrumbList` Schema across all routes (Pillar 4)**
- [x] **Add `Person` & `WebSite` Schema with `alternateName` array on homepage (Pillar 4)**
- [x] **Add `SoftwareSourceCode` / `CreativeWork` Schema for project pages (Pillar 4)**
- [ ] **Expand content depth on Aviation and Charts pages (Pillar 5)**
- [ ] **Submit updated sitemap in Google Search Console**
