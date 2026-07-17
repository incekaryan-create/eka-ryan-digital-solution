# Deployment Guide

## Overview
Panduan deployment untuk berbagai platform.

## Cloudflare Workers

### Setup
```bash
npm install -g wrangler
wrangler login
```

### Deploy
```bash
wrangler deploy
```

### Environment Variables
```bash
wrangler secret put MY_SECRET
```

## Firebase Hosting

### Setup
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### Deploy
```bash
firebase deploy
```

## GitHub Pages

### Setup
1. Create repo named `username.github.io`
2. Push code to repo
3. Enable GitHub Pages in Settings

### Deploy with Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Vercel

### Setup
```bash
npm i -g vercel
vercel login
```

### Deploy
```bash
vercel
vercel --prod
```

## Netlify

### Setup
```bash
npm i -g netlify-cli
netlify login
```

### Deploy
```bash
netlify deploy --prod
```

## Best Practices

1. **CI/CD**: Gunakan GitHub Actions/GitLab CI
2. **Secrets**: Jangan commit secrets ke repo
3. **Testing**: Test sebelum deploy
4. **Rollback**: Siapkan plan rollback
5. **Monitoring**: Monitor setelah deploy

## Checklist

- [ ] Code tested locally
- [ ] Environment variables set
- [ ] Build successful
- [ ] Security review done
- [ ] Deploy to staging first
- [ ] Verify in production
