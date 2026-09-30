# Design Guidelines - Jürgen Jacobsen 
Design guidelines (DESIGN.md) for Jürgen Jacobsen's portfolio website (jurgen.fyi).

## 1. Overview

The design system for **Jürgen Jacobsen** (`jurgen.fyi`) is an anchored in high-contrast minimalism, functional clarity, and modern digital craftmanship. It pairs structured surface cards with crisp typography and balanced whitespace. The visual aesthetic reflects clean, highly readable web UX with subtle details.

Consider some mentioned tags and codes as TailwindCSS.

## 2. Colors
Our palette uses high-contrast neutral tones, only available in light mode theme.

### Palette Strategy

- **Primary Base Background (`#f4f4f4`):** Soft off-white.

- **Container, Block & Card Surface (`#ffffff`):** Pure white container surfaces that elevate content off the primary base.

- **Border (`#e5e7eb`):** Delicate neutral light grey border for clean container boundaries.

- **Primary Text / Foreground (`#242424`):** Deep charcoal for crisp contrast legibility.

- **Secondary Text / Muted Foreground (`#898989`):** Medium neutral grey for captions, subtitles, and secondary info.

- **Pill / Label Background (`bg-primary/5`):** Subtle alpha tints of the primary brand color for pill tags and labels.

### Surface Hierarchy & Nesting

1. **Level 0 (Viewport Background):** `--background` (`#f4f4f4`).
2. **Level 1 (Section cards, blocks, Header & Footer):** `--card` (`#ffffff`) with `border-1` (default Tailwind border width) `--border` (`#e5e7eb`) and `rounded-xl`.
3. **Level 2 (Buttons, Inputs, Select, Checkboxes & Inner Items):** `--muted` (`#f4f4f4`) with `rounded-lg`.
4. **Level 3: (Badges / Labels):** `--muted` (`#f4f4f4` / `bg-muted/25`) with `rounded-full`.

### Border Strategy

- **Width:** `1` for all container borders (`border border-border`), ensuring refined, crisp edges.
- **Color:** `--border` (`#e5e7eb`) with subtle opacity modifiers (`border-border/50` for nested elements).
- **Radius:** 
  - Section Containers: `rounded-xl`
  - Badges / Pill Tags / Labels: `rounded-full`
  - Buttons, Inputs, Select, Checkboxes & Inner Items: `rounded-lg`

### Shadows & Overlays

- **Shadow Strategy:** Heavy drop-shadows are avoided. Instead, elevation relies on container surfaces (`#ffffff` over `#f4f4f4`) combined with subtle, clean shadows (`shadow-sm` for media previews).
- **Overlays & Backdrops:** Backdrop blur (`backdrop-blur-sm`) for mobile menu dropdowns with high z-index (`z-50`).

## 3. Typography

Powered by **Inter Variable** (`@fontsource-variable/inter`) combined with font feature settings for tracking and serif/italic highlights.

- **Primary Font Family:** `Inter Variable`, sans-serif (`var(--font-sans)`)
- **Headings (`h1`, `h2`, `h3`):** Extra-bold to black weights (`font-bold`, `font-black`), tracking-tighter (`tracking-tighter`), for example `h1` should have the size: `text-4xl md:text-7xl`.
- **Serif Accents:** `font-serif italic text-primary` applied to keyword accents in needed headers.
- **Labels & Badges:** `text-xs uppercase tracking-wider font-bold` for labels and tags.
- **Body Text:** `text-base text-muted-foreground font-medium leading-relaxed`.


## 4. Layout

### Spacing
The spacing between main section components such as `<SectionCard />` should be at `6` (for example: `gap-6`, `my-6`) or in tight spaces or mobile view it could be decreased to `4` (`4` and `6` are TailwindCSS values).

### Margins
The margins within components or paddings should be `m-6` or `m-4`, or `p-6` or `p-4`.

## 5. Components

### Section Cards (`<SectionCard />`)
- Base container for main page sections (`bg-card rounded-xl border border-border p-4 md:p-8 shadow-sm`).

### Buttons (`<Button />`)
- **Default Variant:** `bg-primary text-primary-foreground hover:bg-primary/75`
- **Outline Variant:** `border-border bg-background hover:bg-muted hover:text-foreground`
- **Ghost Variant:** `hover:bg-muted hover:text-foreground`
- **Shape & Radii:** `rounded-4xl` or `rounded-xl`, inline-flex, centered icons with size transitions.

### Navigation (`<Navbar />`)
- Floating header container (`bg-card py-2 px-4 md:px-8 shadow-sm border border-border rounded-xl`).
- Navigation buttons with active state highlighting (`bg-primary/5 border-primary/25 text-primary`).

### Input Fields & Select Controls (`<Input />`, `<Select />`)
- min-Input height `h-8`, `rounded-lg`, transparent border with `border-border`, smooth focus ring (`focus-visible:ring-2 focus-visible:ring-border/25`).

## 6. Do's and Don'ts

### Do:
- **Do** maintain strict surface hierarchy (`#ffffff` card on `#f4f4f4` base).
- **Do** use `1px` borders (`border-border`) with the radius cited in the guidelines
- **Do** provide smooth transition effects (`transition-all duration-300 or duration-150`) on hover states.
- **Do** ensure responsive layout scaling.
- **Do** minimize the use of monospace fonts.

### Don't:
- **Don't** use heavy, muddy drop shadows or multi-colored glow outlines.
- **Don't** mix arbitrary font families outside of `Inter Variable` and the designated `font-serif` accent.
- **Don't** hardcode raw hex values directly in component files; always consume design tokens (`bg-card`, `bg-muted`, `border-border`, `text-primary`, `text-muted-foreground`).
- **Don't** remove the `1px` border separation between surfaces.
