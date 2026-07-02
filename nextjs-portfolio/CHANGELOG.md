# Changelog

## 2026-07-03

- Founta section now links to the live site: `link: "https://founta.de/"` with `linkText: "Visit Founta"` in `data.json`, replacing the "Website coming soon" placeholder.
- Fix: `page.tsx` was not passing `link` into `<Founta>`, so "Visit Founta" rendered as muted `founta-soon` text instead of a clickable link. Now passed through, so the section renders the standard arrow-link (matching TK MEDIA).
- Point the AI Beavers proof link to the hackathon repo (`github.com/SM1LE21/AI-Beavers-Hackathon-Elevenlabs`) instead of the ai-beavers.com event page.

## 2026-06-10

- Date the experiments: new `year` field in `data.json` rendered as a muted tag in the experiment header (Text2UML: 2023, Tennis Coach AI: 2025).
- Remove "The prototype that started the thinking behind Founta." from the Tennis Coach AI description. It is related to Founta but did not start it.
- Mark `tun-keltesch-redesign-brief.md` as a historical artifact: the Founta stealth rule no longer applies.
- Sync `AGENTS.md` project structure with the code: add `Founta.tsx` and the `/text2uml` route, note that Products and Now & Next are commented out.

## 2026-05-25

- Hide the Products section on the portfolio homepage. Products remain visible on the TK MEDIA website, so duplicating them here added noise without value. The section and its `ProductCard` import in `src/app/page.tsx` are commented out (not deleted) so they can be restored quickly if needed. Component, data, and CSS are untouched.
