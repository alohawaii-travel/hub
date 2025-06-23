#!/bin/bash

echo "🏢 AlohaWaii Staff Hub Setup"
echo "============================"

# Check if we're in the hub directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the hub directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local from example..."
    cp .env.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure the following in .env.local:"
    echo "   - Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)"
    echo "   - Allowed email domains (ALLOWED_DOMAINS)"
    echo "   - API URL if different from default"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check environment configuration
echo "🔍 Checking environment configuration..."

# Check for required env vars
MISSING_VARS=()

if ! grep -q "GOOGLE_CLIENT_ID=" .env.local || grep -q "GOOGLE_CLIENT_ID=your-google-client-id" .env.local; then
    MISSING_VARS+=("GOOGLE_CLIENT_ID")
fi

if ! grep -q "GOOGLE_CLIENT_SECRET=" .env.local || grep -q "GOOGLE_CLIENT_SECRET=your-google-client-secret" .env.local; then
    MISSING_VARS+=("GOOGLE_CLIENT_SECRET")
fi

if ! grep -q "ALLOWED_DOMAINS=" .env.local || grep -q "ALLOWED_DOMAINS=yourdomain.com" .env.local; then
    MISSING_VARS+=("ALLOWED_DOMAINS")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Missing configuration for: ${MISSING_VARS[*]}"
    echo ""
    echo "🔧 Setup Steps:"
    echo "1. Go to Google Cloud Console: https://console.cloud.google.com"
    echo "2. Create OAuth 2.0 credentials"
    echo "3. Add redirect URI: http://localhost:3000/api/auth/callback/google"
    echo "4. Update .env.local with your credentials"
    echo "5. Set ALLOWED_DOMAINS to your organization's email domains"
    echo ""
    echo "Then run: npm run dev"
else
    echo "✅ Environment configuration looks good"
    echo ""
    echo "🚀 Ready to start! Run: npm run dev"
    echo "📱 Then visit: http://localhost:3000"
fi

echo ""
echo "📚 For more information, see README.md"
