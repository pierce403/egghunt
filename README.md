# Bunny Egg Hunt

A small React game: move the bunny with the arrow keys or the on-screen pad and collect five eggs.

## Development

Use Node.js 20.19 or newer.

```sh
npm ci
npm start
```

The development server runs on localhost. The production build uses relative asset paths so it works at the `egghunt.pro` custom-domain root and the GitHub Pages project path. It writes to `build/`:

```sh
npm test
npm run build
npm run preview
```

The main-branch workflow publishes `build/` to GitHub Pages. Pull requests run install, tests, build, and an npm audit without publishing.
