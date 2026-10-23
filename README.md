# Letters for Later

Production website for https://lettersforlater.co.

This is a static HTML, CSS, and JavaScript site. The deployable files are at the repository root; no installation or build command is required. The existing Vercel project deploys the `main` branch.

- `index.html`: homepage
- `confirmed.html`: Kit subscription confirmation destination
- `assets/`: illustrations, fonts, photographs, and sharing preview GIF
- `kit-signup.js` / `kit-signup.css`: hero and modal signup presentation and validation

Email signup uses the existing Kit form (47d6fa554a). Configure its incentive-email confirmation redirect to https://lettersforlater.co/confirmed.html in Kit. The site never stores subscribers locally.

To preview locally, run `python3 -m http.server 8000` from this directory, then open http://localhost:8000.

For Vercel: use the Other framework preset, repository root as the root directory, and no build step. Keep the existing domain configuration. Future pushes to `main` deploy through the existing GitHub integration.
