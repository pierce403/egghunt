# Bunny Egg Hunt

A small React game: move the bunny with the arrow keys or the on-screen pad and collect five eggs.

## Development

Use Node.js `^20.19.0 || >=22.12.0` (20.19+ on the 20.x line, or 22.12+).

```sh
npm ci
npm start
```

The development server runs on localhost. The production build uses the `browserslist.production` policy in `package.json` through Vite's legacy plugin, generating compatibility code for browsers outside Vite's modern baseline. It uses relative asset paths so it works at the `egghunt.pro` custom-domain root and the GitHub Pages project path. It writes to `build/`:

```sh
npm test
npm run build
npm run preview
```

The main-branch workflow publishes `build/` to GitHub Pages. Pull requests run install, tests, build, and an npm audit without publishing.

## Cloudflare publishing

Native Cloudflare Git builds publish `main`; credentials stay in Cloudflare and
previews are disabled. The existing Vite generator supplies `build`, with
a no-store revision marker and terminal404 handling. Validate with `npm ci`,
the existing tests, and `npm run check:deploy`. `npm run deploy` is the native
deploy command. GitHub Pages and source history remain recovery sources.
