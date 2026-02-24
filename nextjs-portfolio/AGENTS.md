# Agent Instructions

Personal founder site for Tun Keltesch, an entrepreneur-focused AI engineer. Built to show who he is and what he's building, not where he works.

## Stack

- Next.js 15 (App Router) with Turbopack
- React 19, TypeScript (strict mode)
- Tailwind CSS 4 + CSS variables in `globals.css` for theming
- CSS transitions + IntersectionObserver for scroll animations
- Wave animation for dark/light mode toggle (CSS clip-path)

## Project Structure

```
src/
  app/
    layout.tsx       # Root layout, fonts (Inter + Space Grotesk), metadata, GA
    page.tsx         # Single-page site: Hero → About → TK MEDIA → Products → Experiments → Now & Next → Contact
    globals.css      # Full design system (CSS variables, dark/light themes, all component styles)
  components/
    Hero.tsx             # Name + tagline
    About.tsx            # Founder story + background paragraph
    TkMedia.tsx          # Software studio section
    ProductCard.tsx      # Product card (ExpenseMate, NegotiationEdge)
    ExperimentSection.tsx # Experiment detail (Text2UML, Tennis Coach AI)
    NowAndNext.tsx       # Current directions
    Contact.tsx          # Social links
    Footer.tsx           # Copyright
    WaveToggle.tsx       # Dark/light mode toggle with wave animation
  data/data.json   # All site content. Update this file to change content
public/
  assets/          # Project media
  icons/           # SVG social icons
```

## Key Conventions

- All source files are TypeScript (`.tsx` / `.ts`)
- Import paths use the `@/*` alias (maps to `src/*`)
- Single-page site with no routing beyond the home page
- Content is driven by `src/data/data.json`. Update this file to change content, not the components
- Styling: CSS variables in `globals.css` define the full design system. Dark mode is default, light mode via `.light-mode` class on body.
- Fonts: Space Grotesk for headings, Inter for body (loaded via `next/font/google`)
- Minimal animations: scroll fade-in via IntersectionObserver, wave toggle via CSS clip-path

## Commands

```
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Testing

There is no automated test suite. The human always tests changes manually before merging. Do not add tests unless explicitly asked.
