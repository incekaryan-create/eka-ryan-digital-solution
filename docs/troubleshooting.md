# Troubleshooting Guide

## Common Issues

### Cloudflare Workers

#### Issue: Worker not deploying
```bash
# Check wrangler config
wrangler whoami
wrangler deploy --dry-run
```

#### Issue: KV namespace not found
```bash
# List namespaces
wrangler kv:namespace list

# Create namespace
wrangler kv:namespace create "MY_KV"
```

#### Issue: D1 database error
```bash
# List databases
wrangler d1 list

# Create database
wrangler d1 create "my-db"
```

### Firebase

#### Issue: Permission denied
```javascript
// Check security rules
// Firebase Console > Firestore > Rules
```

#### Issue: App not initialized
```javascript
// Check firebase config
import { initializeApp } from 'firebase/app';
const app = initializeApp(config);
```

### Git

#### Issue: Merge conflict
```bash
# Abort merge
git merge --abort

# Resolve manually
# Edit conflicted files
git add .
git commit
```

#### Issue: Push rejected
```bash
# Force push (use with caution)
git push --force-with-lease

# Or pull and merge
git pull --rebase origin main
git push
```

### Node.js

#### Issue: Module not found
```bash
# Clear cache
rm -rf node_modules
npm install
```

#### Issue: Port already in use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Debug Tips

### Console Logging
```javascript
console.log('Debug:', variable);
console.error('Error:', error);
console.warn('Warning:', message);
```

### Network Debug
```bash
# Check connectivity
curl -v https://api.example.com

# Check DNS
nslookup example.com
```

### Performance
```bash
# Profile Node.js
node --prof app.js
node --prof-process isolate-*.log > processed.txt
```

## Getting Help

### Resources
- [Stack Overflow](https://stackoverflow.com)
- [GitHub Issues](https://github.com/issues)
- [Documentation](./README.md)

### Contact
- Email: support@example.com
- Discord: Join our server
