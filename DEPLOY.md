# Publish (Recommended: GitHub Pages)

This portfolio is a static site. The most professional, simplest option is GitHub Pages.

## Option A: Your Personal Domain (Best)

Target: `https://www.ramkumarg.com` (or any domain you own).

1. Buy the domain from any registrar.
2. Create a GitHub repo named `Ramgogu.github.io` (must match your username exactly).
3. Put all files from this folder into the repo root:
   - `index.html`, `styles.css`, `app.js`, `content.json`, `assets/`, `.nojekyll`, `404.html`
4. Commit and push to `main` (or `master`).
5. In GitHub repo settings: enable GitHub Pages for the default branch.
6. Add a custom domain in GitHub Pages settings (for example `www.ramkumarg.com`).
7. In your domain DNS:
   - Add a `CNAME` record for `www` pointing to `ramgogu.github.io`.
   - If you want the apex (`ramkumarg.com`) too, add the recommended GitHub Pages apex records from GitHub’s documentation.
8. Wait for HTTPS to be issued, then you can publish the `https://...` link on LinkedIn.

## Option B: Free URL (Fastest)

Target: `https://ramgogu.github.io/`

Same steps as above, but skip the custom domain and DNS steps. Just push to the `Ramgogu.github.io` repo and GitHub will host it.

## Notes

- Do not share `file:///...` links on LinkedIn. Only `https://...` links work for everyone.
- Do not rely on a local network URL (`http://192.168...`) for a public portfolio. It only works while your laptop is on and reachable.

