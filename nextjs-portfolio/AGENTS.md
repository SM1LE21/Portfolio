# Agent Instructions

This is a Next.js portfolio site for Tun Keltesch.

## Stack

- Next.js 15 (App Router) with Turbopack
- React 19, TypeScript (strict mode)
- Tailwind CSS 4 + component-level CSS files
- GSAP for animations
- Axios for HTTP

## Project Structure

```
src/
  app/            # Pages and layouts (App Router)
  components/     # React components (feature folders with index.ts exports)
  data/data.json  # All portfolio content (experience, projects, certificates, etc.)
  utils/          # API helpers and utility functions
public/
  assets/         # Project media (images, videos)
  icons/          # SVG icons
```

## Key Conventions

- All source files are TypeScript (`.tsx` / `.ts`)
- Import paths use the `@/*` alias (maps to `src/*`)
- Complex components live in their own folder with a `.tsx`, `.css`, and `index.ts`
- Portfolio content is driven by `src/data/data.json` — update this file to change content, not the components
- Styling: Tailwind utilities for layout, component CSS files for feature-specific styles, CSS variables in `globals.css` for theming (dark/light mode)

## Commands

```
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

## Environment Variables

The project uses `.env.local` (gitignored). Required variables:

- `NEXT_PUBLIC_OPENAI_API_KEY` — OpenAI key (client-side, for CV generator)
- `OPENAI_API_KEY` — OpenAI key (server-side)

## Testing

There is no automated test suite. The human always tests changes manually before merging. Do not add tests unless explicitly asked.
