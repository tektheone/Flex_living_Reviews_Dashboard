#!/bin/bash
# Automated Vercel deployment script with environment variables

echo "🚀 Flex Living Reviews Dashboard - Vercel Deployment"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Login to Vercel
echo "🔐 Please login to Vercel..."
vercel login

echo ""
echo "🔗 Linking project..."
vercel link

echo ""
echo "📝 Adding environment variables..."

# Add HOSTAWAY_ACCOUNT_ID
echo "61148" | vercel env add HOSTAWAY_ACCOUNT_ID production
echo "61148" | vercel env add HOSTAWAY_ACCOUNT_ID preview
echo "61148" | vercel env add HOSTAWAY_ACCOUNT_ID development

# Add HOSTAWAY_API_KEY
echo "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152" | vercel env add HOSTAWAY_API_KEY production
echo "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152" | vercel env add HOSTAWAY_API_KEY preview
echo "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152" | vercel env add HOSTAWAY_API_KEY development

echo ""
echo "✅ Environment variables added!"
echo ""

# Deploy
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app is now live with Hostaway credentials!"

