#!/bin/bash

# ============================================
# Cloudflare Pages Deployment Script
# Portfolio Website - Eka Ryan Digital Solution
# ============================================

set -e

echo "🚀 Eka Ryan Portfolio - Cloudflare Deployment"
echo "=============================================="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "📝 Please log in to Cloudflare..."
    wrangler login
fi

echo "✅ Authenticated with Cloudflare"
echo ""

# Step 1: Create R2 Bucket
echo "📦 Step 1: Creating R2 bucket..."
wrangler r2 bucket create portfolio-assets 2>/dev/null || echo "   ℹ️  R2 bucket already exists"
echo ""

# Step 2: Create D1 Database
echo "🗄️  Step 2: Creating D1 database..."
DB_OUTPUT=$(wrangler d1 create portfolio-db 2>&1) || true
echo "$DB_OUTPUT"

# Extract database ID from output
DB_ID=$(echo "$DB_OUTPUT" | grep -o '"database_id": "[^"]*"' | cut -d'"' -f4)

if [ -n "$DB_ID" ]; then
    echo "   📝 Database ID: $DB_ID"
    echo "   ⚠️  Update wrangler.toml with this database_id!"
    
    # Update wrangler.toml with the actual database ID
    sed -i '' "s/YOUR_D1_DATABASE_ID/$DB_ID/g" wrangler.toml
    echo "   ✅ wrangler.toml updated with database ID"
fi
echo ""

# Step 3: Initialize Database Schema
echo "📋 Step 3: Initializing database schema..."
wrangler d1 execute portfolio-db --remote --file=./schema.sql
echo ""

# Step 4: Seed Database with Fictional Data
echo "🌱 Step 4: Seeding database with fictional data..."
wrangler d1 execute portfolio-db --remote --file=./seed.sql
echo ""

# Step 5: Deploy to Cloudflare Pages
echo "🌐 Step 5: Deploying to Cloudflare Pages..."
wrangler pages deploy ./public --project-name ekaryandigitalsolution
echo ""

echo "=============================================="
echo "✅ Deployment Complete!"
echo ""
echo "🔗 Your website is live at:"
echo "   https://ekaryandigitalsolution.pages.dev"
echo ""
echo "📊 Database (D1):"
echo "   - Name: portfolio-db"
echo "   - Tables: config, services, service_details, service_tags, workflow, skills, messages"
echo ""
echo "📦 Storage (R2):"
echo "   - Bucket: portfolio-assets"
echo "   - Used for: Image uploads, assets"
echo ""
echo "🔑 Admin Panel:"
echo "   - URL: https://ekaryandigitalsolution.pages.dev/admin.html"
echo "   - Username: admin"
echo "   - Password: admin123"
echo ""
echo "📝 API Endpoints:"
echo "   - GET /api/config - Site configuration"
echo "   - GET /api/services - All services"
echo "   - GET /api/workflow - Workflow steps"
echo "   - GET /api/skills - Technical skills"
echo "   - GET /api/messages - Contact messages"
echo "   - POST /api/messages - Submit contact form"
echo "   - POST /api/upload - Upload file to R2"
echo "=============================================="
