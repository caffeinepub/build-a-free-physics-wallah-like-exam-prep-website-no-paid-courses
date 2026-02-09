# Specification

## Summary
**Goal:** Build a Physics Wallah-like exam-prep website experience where all course content is free to access (no pricing, checkout, subscriptions, or paywalls).

**Planned changes:**
- Implement frontend pages and navigation for Home, Courses, Course Detail, Subject/Chapter listing, Lesson/Content Viewer, and Global Search.
- Build a single Motoko-actor backend data model for Course, Subject, Chapter, Lesson, and lesson resource links; add query methods for listing, fetching details, and keyword search.
- Seed the backend with a starter NEET/JEE-style catalog covering Physics, Chemistry, Maths, and Biology (at least 4 courses, 8 chapters, 16 lessons) with mixed video links and resources.
- Create a Lesson/Content Viewer that supports embedded video by URL, structured notes rendering, and downloadable PDF resources served from frontend public assets.
- Add anonymous local-only progress tracking (mark lessons complete; show completion counts at chapter and course level) persisted in browser storage.
- Use React Query for all backend reads with consistent loading, empty, and error states across pages.
- Apply a modern, cohesive exam-prep visual theme across the app (responsive; avoid blue/purple as primary colors).
- Add a site-wide footer with English-only text including an “All courses are free” notice, a basic disclaimer, and contact placeholder info.
- Add static example PDF assets to the frontend and link them from at least 4 seeded lessons as downloadable resources.

**User-visible outcome:** Users can browse and search free exam-prep courses, drill down into subjects/chapters/lessons, watch embedded videos, read lesson notes, download attached PDFs, and track completion progress locally—without encountering any payment or subscription UI.
