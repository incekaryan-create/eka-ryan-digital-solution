# Cloudflare Workers Guide

## Overview
Cloudflare Workers adalah platform serverless yang menjalankan kode di edge network Cloudflare.

## Key Concepts

### Worker Script
```javascript
export default {
  async fetch(request, env) {
    return new Response('Hello World!');
  }
}
```

### Wrangler Configuration
```toml
name = "my-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
name = "my-worker-prod"
```

## Common Commands

| Command | Description |
|---------|-------------|
| `wrangler dev` | Start local dev server |
| `wrangler deploy` | Deploy to Cloudflare |
| `wrangler tail` | Stream live logs |
| `wrangler kv:namespace create` | Create KV namespace |

## Bindings

### KV Namespace
```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "xxxxxxxxxxxx"
```

### D1 Database
```toml
[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "xxxxxxxxxxxx"
```

### R2 Bucket
```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"
```

## Best Practices

1. **Edge-first**: Put logic close to users
2. **Stateless**: Use KV/D1 for state
3. **Error handling**: Always wrap in try/catch
4. **Secrets**: Use `wrangler secret put` for env vars

## References
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
