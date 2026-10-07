# Jürgen Jacobsen — Portfolio & Engineering Showcase

[![Live Site](https://img.shields.io/badge/website-jurgen.fyi-2563eb?style=flat-square)](https://jurgen.fyi)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL_3.0-blue.svg?style=flat-square)](LICENSE)
[![WakaTime](https://wakatime.com/badge/user/010adc07-6382-419f-87bc-0b3f507ee495/project/40495962-a255-4ec9-bd9d-e568a325077e.svg?style=flat-square)](https://wakatime.com/badge/user/010adc07-6382-419f-87bc-0b3f507ee495/project/40495962-a255-4ec9-bd9d-e568a325077e)

Personal portfolio, software engineering project showcase, technical knowledge guides, photography gallery, and commercial aviation credentials of **Jürgen Jacobsen** — Commercial Pilot and Web Developer.

> Live at **[jurgen.fyi](https://jurgen.fyi)**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture & Project Structure](#architecture--project-structure)
- [Build Pipeline & Automation](#build-pipeline--automation)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [License](#license)
- [Author & Contact](#author--contact)

---

## Tech Stack

| Category               | Technology                                                           | Version    | Description                                                               |
| :--------------------- | :------------------------------------------------------------------- | :--------- | :------------------------------------------------------------------------ |
| **Core Framework**     | [React 19](https://react.dev/)                                       | `^19.2.4`  | Modern React with concurrent features and optimal state management        |
| **Routing**            | [React Router](https://reactrouter.com/)                             | `^7.14.2`  | Client-side routing, nested routes, route redirects, and search params    |
| **Build Tool**         | [Vite 8](https://vite.dev/)                                          | `^8.0.4`   | Fast ESM bundler with `@vitejs/plugin-react`                              |
| **Language**           | [TypeScript 6](https://www.typescriptlang.org/)                      | `~6.0.2`   | Strict static type checking across the entire application                 |
| **Styling**            | [Tailwind CSS v4](https://tailwindcss.com/)                          | `^4.2.2`   | CSS engine via `@tailwindcss/vite` and `@tailwindcss/typography`          |
| **Database & Auth**    | [Supabase](https://supabase.com/)                                    | `^2.116.0` | PostgreSQL database, Row Level Security, and authentication               |
| **Cartography & Maps** | [Mapbox GL](https://www.mapbox.com/)                                 | `^3.31.0`  | Vector tile engine for interactive flight paths and airport visualization |
| **Image Optimization** | [Sharp](https://sharp.pixelplumbing.com/)                            | `^0.35.4`  | High-performance image processing generating multi-size WebP assets       |
| **Animations**         | `tw-animate-css`                                                     | `^1.4.0`   | Smooth entrance animations and staggered transition delays                |
| **UI Primitives**      | [Radix UI](https://www.radix-ui.com/), [Lucide](https://lucide.dev/) | Latest     | Accessible headless components and iconography                            |
| **Cursor & FX**        | `cuelume`                                                            | `^0.2.4`   | Interactive micro-navigation cues and cursor feedback                     |
| **Content Processing** | `react-markdown`, `remark-gfm`                                       | Latest     | Markdown parser with tables, task lists, and autolinks                    |
| **Analytics**          | `@vercel/analytics`                                                  | `^2.0.1`   | Lightweight, privacy-first performance and visitor telemetry              |
| **Code Quality**       | ESLint 9, Prettier 3, TypeScript-ESLint                              | Latest     | Automated linting, import sorting, and code formatting                    |

---

## Architecture & Project Structure

```text
portfolio/
├── public/                       # Static public assets served directly
│   ├── blueprint/                # Config files and PowerShell installer
│   ├── cache/                    # Build-time JSON indexes (projects.json, guides.json)
│   ├── cv/                       # PDF resumes (aviation_CV.pdf, general_CV.pdf)
│   ├── gallery/                  # Responsive WebP photography generated by Sharp
│   │   └── raw-photos/           # Source high-resolution photography
│   ├── img/                      # Portfolio screenshots, logos, and UI assets
│   ├── robots.txt                # Search engine crawler directives
│   ├── rss.xml                   # Auto-generated RSS 2.0 feed
│   ├── sitemap.xml               # Auto-generated XML sitemap
│   └── site.webmanifest          # PWA web application manifest
├── scripts/                      # Build-time automation and indexing scripts
│   ├── generate-rss.js           # Generates public/rss.xml from latest projects and guides
│   ├── guide-index.js            # Syncs Supabase guides to public/cache/guides.json
│   ├── optimize-photos.js        # Converts raw images to multi-size WebP formats via Sharp
│   ├── prerender.js              # Generates pre-rendered static HTML files for SEO
│   ├── project-index.js          # Syncs Supabase projects to public/cache/projects.json
│   └── sitemap.js                # Crawls routes & generates public/sitemap.xml
├── src/
│   ├── components/
│   │   ├── admin/                # Admin panels (Projects, Guides, Aviation, Modals)
│   │   ├── features/             # Feature-specific components
│   │   │   ├── aviation/         # HeroMap, FlightLogsTable, StatsCards
│   │   │   ├── blueprint/        # Blueprint installer and files list
│   │   │   ├── contact/          # Contact details and hero
│   │   │   ├── guides/           # Guide cards, categories, and reader
│   │   │   ├── home/             # Home hero, highlights, and profile cards
│   │   │   ├── photos/           # Photo banners and responsive cards
│   │   │   └── projects/         # Project list, animated filters, header, and cards
│   │   ├── layout/               # Global layout (Navbar, Footer, SectionCard)
│   │   ├── shared/               # Shared utilities (SEO, Icon, ScrollToTop)
│   │   └── ui/                   # Reusable UI primitives (Select, Button, Input, Skeleton)
│   ├── lib/                      # Utilities, Supabase client, Mapbox airport data, parsers
│   ├── pages/                    # Route pages
│   │   ├── admin/                # AdminLogin.tsx, AdminDashboard.tsx
│   │   ├── code/                 # Code.tsx, CodeView.tsx
│   │   ├── photos/               # Gallery.tsx
│   │   ├── Aviation.tsx          # Aviation credentials and logbook
│   │   ├── Blueprint.tsx         # Developer boilerplate directory
│   │   ├── Contact.tsx           # Contact details
│   │   ├── CV.tsx                # Resume viewer
│   │   ├── Guides.tsx            # Technical articles reader
│   │   ├── Home.tsx              # Landing page
│   │   ├── NotFound.tsx          # 404 handler
│   │   └── Socials.tsx           # Social directory
│   ├── App.tsx                   # Main route configuration and layout shell
│   ├── index.css                 # Tailwind v4 theme, fonts, and global style directives
│   └── main.tsx                  # Application entry point
├── package.json                  # Dependencies, scripts, and project metadata
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite bundler configuration and path aliases
```

---


---

## Build Pipeline & Automation

The production build runs a fully orchestrated pre-build, compile, and post-render pipeline:

```mermaid
flowchart LR
    A["npm run build"] --> B["optimize:photos"]
    B --> C["projects:update"]
    C --> D["guides:update"]
    D --> E["sitemap:update"]
    E --> F["rss:update"]
    F --> G["tsc -b (Type-Check)"]
    G --> H["vite build (Bundle)"]
    H --> I["prerender (Static HTML)"]
```

1. **`optimize:photos`**: Converts raw photography into optimized, responsive WebP image sets with Sharp.
2. **`projects:update`**: Syncs projects from Supabase and outputs `public/cache/projects.json`.
3. **`guides:update`**: Syncs guides from Supabase, extracts reading times/taxonomies, and generates `public/cache/guides.json`.
4. **`sitemap:update`**: Crawls dynamic project/guide slugs and static routes to build an up-to-date `public/sitemap.xml`.
5. **`rss:update`**: Builds an RSS 2.0 specification feed (`public/rss.xml`) from the latest projects and articles.
6. **`tsc -b`**: Runs strict TypeScript compilation checking across the codebase.
7. **`vite build`**: Compiles and optimizes client bundles and styles via Vite 8 and Tailwind CSS v4.
8. **`prerender`**: Generates pre-rendered HTML files for critical routes to ensure maximum SEO indexability and sub-second initial paint times.

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`

### Environment Configuration

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Configure your environment keys:

```ini
# Supabase credentials (Client anon key for browser requests)
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Build-time service role key for prerendering & index scripts
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Mapbox GL Access Token for interactive aviation cartography
VITE_MAPBOX_ACCESS_TOKEN=pk.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Admin authentication and GitHub tokens
VITE_ADMIN_EMAIL=your-email@example.com
GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_HOSTNAME=jurgen.fyi
```

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jurgenjacobsen/portfolio.git
    cd portfolio
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Generate static cache files and optimize media:

    ```bash
    npm run optimize:photos
    npm run projects:update
    npm run guides:update
    ```

4. Start the local development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command                   | Description                                                                                                                 |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Launches the local Vite development server with hot module replacement (`vite --host`)                                      |
| `npm run build`           | Executes the complete pipeline: photo optimization, index generation, sitemap, RSS, typecheck, Vite build, and prerendering |
| `npm run optimize:photos` | Processes raw photography into multi-resolution WebP images using Sharp                                                     |
| `npm run projects:update` | Syncs projects from Supabase and outputs `public/cache/projects.json`                                                       |
| `npm run guides:update`   | Syncs guides from Supabase and writes `public/cache/guides.json` with reading time estimates                                |
| `npm run sitemap:update`  | Updates `public/sitemap.xml` with all core, project, and guide routes                                                       |
| `npm run rss:update`      | Builds the RSS 2.0 feed at `public/rss.xml`                                                                                 |
| `npm run prerender`       | Pre-renders static HTML pages into `dist/` for SEO                                                                          |
| `npm run lint`            | Runs ESLint to check for code quality and syntax errors                                                                     |
| `npm run prettier`        | Formats all source files with Prettier                                                                                      |

---

## License

This project is licensed under the **GNU Affero General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

## Author & Contact

**Jürgen Jacobsen**

- Website: [jurgen.fyi](https://jurgen.fyi)
- GitHub: [@jurgenjacobsen](https://github.com/jurgenjacobsen)
- Email: [jurgenjacobsen@outlook.com](mailto:jurgenjacobsen@outlook.com)
