# SEO & Google Search Improvement TODO List

Comprehensive audit and actionable roadmap to optimize **[jurgen.fyi](https://jurgen.fyi)** for Google Search, crawler indexing, social previews, and search engine performance.

---

## 📋 Table of Contents
1. [🚨 Critical Fixes & Quick Wins](#1--critical-fixes--quick-wins)
2. [🗺️ Sitemap, Robots.txt & Indexing Pipeline](#2-️-sitemap-robotstxt--indexing-pipeline)
3. [🏷️ Meta Tags, Head Management & Social Previews](#3-️-meta-tags-head-management--social-previews)
4. [🧩 Structured Data (Schema.org / JSON-LD)](#4--structured-data-schemaorg--json-ld)
5. [🔗 Internal Routing & URL Canonicalization](#5--internal-routing--url-canonicalization)
6. [🏗️ Semantic HTML & Accessibility SEO](#6-️-semantic-html--accessibility-seo)
7. [⚡ Core Web Vitals & Technical Performance](#7-️-core-web-vitals--technical-performance)
8. [✍️ Content Strategy & E-E-A-T Authority](#8-️-content-strategy--e-e-a-t-authority)
9. [🔍 Google Search Console & Tooling Setup](#9--google-search-console--tooling-setup)

---

## 1. 🚨 Critical Fixes & Quick Wins

- [ ] **Fix Build Overwrite Bug in Sitemap Generation**
  - **Issue:** In `package.json`, the build script runs `sitemap:update && ... && vite build`. `scripts/sitemap.js` writes to `dist/sitemap.xml`, but Vite wipes the `dist/` directory and copies `public/sitemap.xml` over it during build.
  - **Fix:** Update `scripts/sitemap.js` to write directly to `public/sitemap.xml` before `vite build`, or run the sitemap generator as a post-build step.
- [x] **Fix Routing Inconsistencies (`/code` vs `/projects`)**
  - **Status:** Resolved ✅ — Standardized on `/code` and `/code/:slug` across all components, navigation items, previews, fallback redirects, RSS generator, sitemap, and added permanent redirects in `vercel.json` and `App.tsx`.
- [x] **Fix Invalid `rel` Attribute in Footer Links**
  - **Issue:** In `src/components/layout/Footer.tsx` line 17, `SocialMediaLink` sets `rel="https://jurgen.fyi"`.
  - **Fix:** Change to `rel="noopener noreferrer"`.
- [x] **Remove `<h1>` from Global Navbar**
  - **Issue:** `src/components/layout/Navbar.tsx` contains `<h1 className="font-bold text-lg">Jürgen</h1>`. Having an `<h1>` inside the global navigation produces multiple `<h1>` elements on every page and weakens page-specific keyword targeting.
  - **Fix:** Change the navbar brand to a `<span>` or `<div>`.
- [x] **Fix Absolute URL for OpenGraph and Twitter Image**
  - **Issue:** `index.html` has `<meta property="og:image" content="/img/preview.png" />`. Social platforms and search crawlers require fully-qualified absolute URLs (e.g. `https://jurgen.fyi/img/preview.png`).

---

## 2. 🗺️ Sitemap, Robots.txt & Indexing Pipeline

- [ ] **Upgrade `scripts/sitemap.js` to Include All Routes and Project Markdown Pages**
  - Make `sitemap.js` scan `public/projects/*.md` dynamically and add all project URLs (`https://jurgen.fyi/code/[slug]`).
  - Read each project markdown's `updatedAt` / `createdAt` date for the `<lastmod>` timestamp.
  - Include all static routes: `/`, `/code`, `/aviation`, `/charts`, `/cv`, `/contact`, `/socials`.
  - Remove dead routes like `/about` from `public/sitemap.xml`.
- [ ] **Add `<changefreq>` and `<lastmod>` to Sitemap Entries**
  - Example format:
    ```xml
    <url>
      <loc>https://jurgen.fyi/code/tld-helper</loc>
      <lastmod>2025-01-15T00:00:00Z</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    ```
- [x] **Ensure `robots.txt` is Crawl-Friendly**
  - Verify `public/robots.txt` points to the canonical sitemap URL:
    ```txt
    User-agent: *
    Allow: /

    Sitemap: https://jurgen.fyi/sitemap.xml
    ```

---

## 3. 🏷️ Meta Tags, Head Management & Social Previews

- [x] **Implement Dynamic Document Titles & Meta Tags per Route**
  - Currently, `index.html` serves static metadata for all routes.
  - Install a head manager (e.g. `@unhead/react` or `react-helmet-async`) to manage `<title>`, `<meta name="description">`, and canonical URLs dynamically:
    - **Home (`/`):** `Jürgen Jacobsen | Commercial Pilot & Software Engineer`
    - **Code (`/code`):** `Software Projects & Open Source | Jürgen Jacobsen`
    - **Project Detail (`/code/:slug`):** `[Project Title] - [Short Tech Summary] | Jürgen Jacobsen`
    - **Aviation (`/aviation`):** `Commercial Aviation & Flight Experience | Jürgen Jacobsen`
    - **Aeronautical Charts (`/charts`):** `Aeronautical Cartography & Procedure Design | Jürgen Jacobsen`
    - **CV (`/cv`):** `Curriculum Vitae & Career Timeline | Jürgen Jacobsen`
    - **Contact (`/contact`):** `Contact & Inquiries | Jürgen Jacobsen`

- [x] **Add Canonical Tag `<link rel="canonical" href="..." />`**
  - Add self-referencing canonical URLs to prevent duplicate content indexing (e.g., preventing trailing slash issues or query parameter duplicates).
- [x] **Add Robots Index Directives to `index.html`**
  ```html
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  ```

- [x] **Add Complete Open Graph & Twitter Card Meta Tags**
  - Ensure image dimensions and alt text are declared:
    ```html
    <meta property="og:image" content="https://jurgen.fyi/img/preview.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Jürgen Jacobsen - Portfolio Preview" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="https://jurgen.fyi/img/preview.png" />
    ```
- [x] **Add Theme Color & Author Meta Tags**
  ```html
  <meta name="author" content="Jürgen Jacobsen" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#171717" media="(prefers-color-scheme: dark)" />
  ```

---

## 4. 🧩 Structured Data (Schema.org / JSON-LD)

Adding schema markup gives Google rich context about who you are, what projects you build, and allows rich snippet display in search results.

- [x] **Add `Person` & `WebSite` Schema on Homepage (`/`)**
  ```html

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://jurgen.fyi/#website",
        "url": "https://jurgen.fyi/",
        "name": "Jürgen Jacobsen",
        "description": "Portfolio of Jürgen Jacobsen, Commercial Pilot and Software Engineer.",
        "inLanguage": "en-GB"
      },
      {
        "@type": "Person",
        "@id": "https://jurgen.fyi/#person",
        "name": "Jürgen Jacobsen",
        "url": "https://jurgen.fyi/",
        "image": "https://jurgen.fyi/img/profile.jpg",
        "jobTitle": ["Commercial Pilot", "Software Engineer"],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Porto",
          "addressCountry": "PT"
        },
        "sameAs": [
          "https://github.com/jurgenjacobsen",
          "https://linkedin.com/in/jurgenjacobsen",
          "https://instagram.com/jurgen.jacobsen"
        ],
        "knowsAbout": [
          "Commercial Aviation",
          "Aeronautical Cartography",
          "Software Engineering",
          "React",
          "TypeScript",
          "Tailwind CSS"
        ]
      }
    ]
  }
  </script>
  ```

- [x] **Add `SoftwareSourceCode` / `CreativeWork` Schema for Project Pages (`/code/:slug`)**
  - **Status:** Resolved ✅ — Added dynamic Schema.org `SoftwareSourceCode` / `CreativeWork` JSON-LD generation in `CodeView.tsx` with repository, description, programming language, timestamps, and author metadata.

- [x] **Add `BreadcrumbList` Schema**
  - **Status:** Resolved ✅ — Extended `SEO.tsx` with a `breadcrumbs` prop to dynamically generate Schema.org `BreadcrumbList` JSON-LD data across all top-level sections (`/code`, `/aviation`, `/charts`, `/cv`, `/contact`, `/socials`) and hierarchical 3-level breadcrumb trails for project detail pages (`/code/:slug`).

---

## 5. 🔗 Internal Routing & URL Canonicalization

- [ ] **Consider Pre-Rendering / SSG (Static Site Generation)**
  - **Context:** As a pure Client-Side Rendered (CSR) Vite app, search engines that delay or limit JavaScript execution (and social bots like Discord, Telegram, Slack, Twitter) receive an empty `<div id="root"></div>`.
  - **Options:**
    - Option A: Use a pre-render plugin like `vite-plugin-prerender` to emit static HTML for all main routes and markdown project pages during build.
    - Option B: Use Vite SSG (`vite-ssg`) or custom build script to render React components to static `.html` files in `dist/`.
- [x] **Eliminate Soft 404s in Vercel Rewrites**
  - **Status:** Resolved ✅
    - Configured client-side `NotFound.tsx` to set `robots="noindex, nofollow"` and updated `SEO.tsx` to omit canonical URL tags and strip stale canonical links on 404 pages.
    - Updated `src/pages/subpages/CodeView.tsx` to render `<NotFound />` on non-existent or invalid project slugs instead of redirecting to `/code`.
- [x] **Fix Footer Navigation Links**
  - In `src/components/layout/Footer.tsx`:
    - "Aviation Charts" and "Photo & Design" both point to `/charts`. Point "Photo & Design" to its dedicated section or correct URL.
    - Change `/rss.xml` to a standard `<a href="/rss.xml">` link instead of React Router's `<Link>` to prevent client router hijacking.

---

## 6. 🏗️ Semantic HTML & Accessibility SEO

- [ ] **Strict Heading Hierarchy (`h1` -> `h2` -> `h3`)**
  - Verify every page has exactly one `<h1>` containing primary search keywords.
  - Avoid skipping heading levels (e.g. `<h1>` directly to `<h4>`).
- [ ] **Image Optimization & Explicit Dimensions**
  - Add explicit `width` and `height` (or aspect-ratio styles) to all `<img>` tags (`/img/profile.jpg`, preview images) to prevent Cumulative Layout Shift (CLS).
  - Ensure descriptive, keyword-rich `alt` attributes on all project preview images (avoid generic `alt="image"` or empty strings on content images).
- [ ] **Descriptive Anchor Text**
  - In `Hero.tsx` and across pages, replace generic button text where applicable or add `aria-label` / title attributes for screen readers and crawlers (e.g., change `View Projects` to `Explore Software Projects`).

---

## 7. ⚡ Core Web Vitals & Technical Performance

Google uses Core Web Vitals (LCP, INP, CLS) as a ranking signal.

- [x] **Add Static Asset Caching Headers in `vercel.json`**
  - Cache immutable static assets (images, fonts, PDFs) with long TTL:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
      "headers": [
        {
          "source": "/img/(.*)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "/(favicon|apple-touch-icon|site\\.webmanifest|.*\\.png|.*\\.ico|.*\\.svg)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=86400, stale-while-revalidate=604800"
            }
          ]
        }
      ]
    }
    ```
- [x] **Preload Critical Hero Image / Fonts**
  - In `index.html`, add `<link rel="preload" as="image" href="/img/profile.jpg" fetchpriority="high" />` for faster Largest Contentful Paint (LCP).
- [x] **Security Headers**
  - Add standard security headers in `vercel.json` (`X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`).


---

## 8. ✍️ Content Strategy & E-E-A-T Authority

Google prioritizes **Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T)**.
- [ ] **Deepen Project Case Studies in Markdown**
  - In `public/projects/*.md`, expand case studies to include:
    - Problem statement & technical architecture.
    - Key challenges overcome & engineering decisions.
    - Measurable outcomes (performance gains, stars, downloads).
    - Code snippets and interactive demo links.
- [ ] **Ensure Cross-Linking Between Pages**
  - Link from project markdown files back to related projects, CV, and aviation competencies to build strong internal page authority flows.

---

## 9. 🔍 Google Search Console & Tooling Setup

- [ ] **Verify Site Ownership in Google Search Console (GSC)**
  - Add GSC verification meta tag in `index.html` or configure DNS TXT record via your domain registrar for `jurgen.fyi`.
- [ ] **Submit Sitemap to GSC and Bing Webmaster Tools**
  - Submit `https://jurgen.fyi/sitemap.xml` in Google Search Console.
- [ ] **Validate Structured Data**
  - Run pages through [Google's Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/).
- [ ] **Run Google PageSpeed Insights & Lighthouse Audit**
  - Benchmark performance, accessibility, best practices, and SEO scores (aim for all green 95+).
- [ ] **Request Initial Indexing**
  - Use URL Inspection tool in GSC to request indexing for `https://jurgen.fyi/` and key subpages once updates are deployed.

---

*Generated for Jürgen Jacobsen (`jurgen.fyi`) — Last updated: August 2026*
