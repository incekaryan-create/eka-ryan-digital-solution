# Eka Ryan Portfolio - Cloudflare Pages

Portfolio website for Eka Ryan Digital Solution, deployed on Cloudflare Pages with D1 database and R2 storage.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Storage**: Cloudflare R2 (object storage)
- **Hosting**: Cloudflare Pages
- **API**: Cloudflare Pages Functions

## Features

- Responsive portfolio website
- Admin panel for content management
- Contact form with message storage
- File upload to R2 storage
- SEO optimized
- Fast global CDN delivery

## Project Structure

```
eka-ryan-portfolio/
├── public/                 # Static files (deployed to Pages)
│   ├── index.html         # Main portfolio page
│   ├── admin.html         # Admin panel
│   ├── db.js              # Database client
│   └── src/               # Assets
├── functions/             # Pages Functions (API)
│   └── api/
│       └── [[route]].js   # API handler
├── schema.sql             # D1 database schema
├── seed.sql               # Seed data (fictional)
├── wrangler.toml          # Cloudflare configuration
├── deploy.sh              # Deployment script
└── package.json           # Dependencies
```

## Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Deploy Everything

```bash
./deploy.sh
```

This will:
1. Create R2 bucket
2. Create D1 database
3. Initialize database schema
4. Seed with fictional data
5. Deploy to Cloudflare Pages

### 4. Access Your Website

- **Website**: https://ekaryandigitalsolution.pages.dev
- **Admin Panel**: https://ekaryandigitalsolution.pages.dev/admin.html

## Manual Setup

### Create R2 Bucket

```bash
wrangler r2 bucket create portfolio-assets
```

### Create D1 Database

```bash
wrangler d1 create portfolio-db
```

Update `wrangler.toml` with the database ID.

### Initialize Database

```bash
# Create tables
wrangler d1 execute portfolio-db --remote --file=./schema.sql

# Seed data
wrangler d1 execute portfolio-db --remote --file=./seed.sql
```

### Deploy to Pages

```bash
wrangler pages deploy ./public --project-name ekaryandigitalsolution
```

## Local Development

```bash
npm run dev
```

This starts a local development server with D1 and R2 emulated locally.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/config` | Get site configuration |
| PUT | `/api/config` | Update site configuration |
| GET | `/api/services` | List all services |
| GET | `/api/services/:id` | Get service details |
| POST | `/api/services` | Create new service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |
| GET | `/api/workflow` | List workflow steps |
| POST | `/api/workflow` | Create workflow step |
| GET | `/api/skills` | List all skills |
| POST | `/api/skills` | Create new skill |
| GET | `/api/messages` | List all messages |
| POST | `/api/messages` | Submit contact form |
| PUT | `/api/messages/:id/read` | Mark message as read |
| POST | `/api/upload` | Upload file to R2 |

## Database Tables

- **config**: Site-wide configuration
- **services**: Service offerings
- **service_details**: Service detail items
- **service_tags**: Service tags
- **workflow**: Workflow steps
- **skills**: Technical skills
- **messages**: Contact form submissions

## Admin Panel

Default credentials:
- Username: `admin`
- Password: `admin123`

## Environment Variables

Set in `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
ADMIN_PASSWORD = "admin123"
JWT_SECRET = "your-secret-key"
```

## License

MIT
