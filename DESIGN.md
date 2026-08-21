# Design System Document: Jürgen Jacobsen Portfolio Website

## 1. Overview

The design system for **Jürgen Jacobsen** (`jurgen.fyi`) is anchored in high-contrast minimalism, functional clarity, and modern digital craftsmanship. It pairs structured surface cards with crisp typography, subtle micro-interactions, and balanced whitespace. The visual aesthetic reflects precision—drawing subtle inspiration from aviation instrumentation and technical architecture—while maintaining clean, highly readable web UX.

---

## 2. Colors

Our palette uses high-contrast neutral tones with exact CSS custom variables for light and dark modes.

### Palette Strategy

- **Primary Base Background (`#f4f4f4` / `oklch(0.145 0 0)`):** Soft off-white for light mode, deep slate charcoal for dark mode.
- **Container / Card Surface (`#ffffff` / `oklch(0.205 0 0)`):** Pure white container surfaces that elevate content off the primary base.
- **Border (`#e5e7eb` / `oklch(1 0 0 / 10%)`):** Delicate neutral light grey border for clean container boundaries.
- **Primary Text / Foreground (`#242424` / `oklch(0.985 0 0)`):** Deep charcoal for crisp contrast legibility.
- **Secondary Text / Muted Foreground (`#898989` / `oklch(0.708 0 0)`):** Medium neutral grey for captions, subtitles, and secondary info.
- **Primary Accent / Pill Background (`bg-primary/5` / `border-primary/25`):** Subtle alpha tints of the primary brand color for pill tags and active highlights.
- **Destructive Accent (`oklch(0.577 0.245 27.325)`):** Used sparingly for error states and destructive actions.

### Surface Hierarchy & Nesting

1. **Level 0 (Viewport Background):** `--background` (`#f4f4f4`)
2. **Level 1 (Section Cards & Header / Footer):** `--card` (`#ffffff`) with `1px` `--border` (`#e5e7eb`) and `rounded-xl`
3. **Level 2 (Badges, Inputs & Inner Items):** `--muted` (`#f4f4f4` / `bg-muted/25`) with `rounded-xl` or `rounded-full`

### Border Strategy

- **Width:** `1px` for all container borders (`border border-border`), ensuring refined, crisp edges.
- **Color:** `--border` (`#e5e7eb`) with subtle opacity modifiers (`border-border/50` for nested elements).
- **Radius:** 
  - Section Containers: `rounded-xl` (`0.75rem`)
  - Badges / Pill Tags: `rounded-full` (`9999px`)
  - Buttons / Inputs: `rounded-4xl` / `rounded-3xl` / `rounded-xl`

### Shadows & Overlays

- **Shadow Strategy:** Heavy drop-shadows are avoided. Instead, elevation relies on container surfaces (`#ffffff` over `#f4f4f4`) combined with subtle, clean shadows (`shadow-md`, `shadow-xs`, `shadow-xl` for media previews).
- **Overlays & Backdrops:** Backdrop blur (`backdrop-blur-md`) for mobile menu dropdowns with high z-index (`z-50`).

---

## 3. Typography

Powered by **Inter Variable** (`@fontsource-variable/inter`) combined with font feature settings for tracking and serif/italic highlights.

- **Primary Font Family:** `Inter Variable`, sans-serif (`var(--font-sans)`)
- **Headings (`h1`, `h2`, `h3`):** Extra-bold to black weights (`font-bold`, `font-black`), tracking-tighter, uppercase font settings (`text-4xl md:text-7xl font-black tracking-tighter uppercase`).
- **Serif Accents:** `font-serif italic text-primary` applied to keyword accents in hero headers.
- **Subtitles & Badges:** `text-[10px] md:text-xs uppercase tracking-wider font-bold` for section badges and tags.
- **Body Text:** `text-base md:text-lg text-muted-foreground font-medium leading-relaxed`.

---

## 4. Components

### Section Cards (`<SectionCard />`)
- Base container for main page sections (`bg-card rounded-xl border border-border p-4 md:p-8 mt-6 shadow-md`).

### Buttons (`<Button />`)
- **Default Variant:** `bg-primary text-primary-foreground hover:bg-primary/80`
- **Outline Variant:** `border-border bg-background hover:bg-muted hover:text-foreground`
- **Ghost Variant:** `hover:bg-muted hover:text-foreground`
- **Shape & Radii:** `rounded-4xl` or `rounded-xl`, inline-flex, centered icons with size transitions.

### Navigation (`<Navbar />`)
- Floating header container (`bg-card py-2 px-4 md:px-8 shadow-md border border-border rounded-xl`).
- Navigation buttons with active state highlighting (`bg-primary/5 border-primary/25 text-primary`).

### Input Fields & Select Controls (`<Input />`, `<Select />`)
- Input height `h-9`, `rounded-3xl`, transparent border with `bg-input/50`, smooth focus ring (`focus-visible:ring-3 focus-visible:ring-ring/30`).

---

## 5. Do's and Don'ts

### Do:
- **Do** maintain strict surface hierarchy (`#ffffff` card on `#f4f4f4` base).
- **Do** use `1px` borders (`border-border`) with subtle radii (`rounded-xl` for cards, `rounded-full` for pill badges).
- **Do** use `Inter Variable` with uppercase wide tracking for badges (`tracking-wider`, `tracking-[0.2em]`).
- **Do** provide smooth transition effects (`transition-all duration-300`) on hover states.
- **Do** ensure responsive layout scaling (`p-4 md:p-8`, `text-4xl md:text-7xl`).

### Don't:
- **Don't** use heavy, muddy drop shadows or multi-colored glow outlines.
- **Don't** mix arbitrary font families outside of `Inter Variable` and the designated `font-serif` accent.
- **Don't** hardcode raw hex values directly in component files; always consume design tokens (`bg-card`, `bg-muted`, `border-border`, `text-primary`, `text-muted-foreground`).
- **Don't** remove the `1px` border separation between surfaces.
