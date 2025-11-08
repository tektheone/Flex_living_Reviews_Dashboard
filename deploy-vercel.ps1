# Automated Vercel deployment script with environment variables (PowerShell)

Write-Host "🚀 Flex Living Reviews Dashboard - Vercel Deployment" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelExists) {
    Write-Host "⚠️  Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI ready" -ForegroundColor Green
Write-Host ""

# Login to Vercel
Write-Host "🔐 Please login to Vercel..." -ForegroundColor Cyan
vercel login

Write-Host ""
Write-Host "🔗 Linking project..." -ForegroundColor Cyan
vercel link

Write-Host ""
Write-Host "📝 Adding environment variables..." -ForegroundColor Cyan

# Add HOSTAWAY_ACCOUNT_ID to all environments
Write-Host "Adding HOSTAWAY_ACCOUNT_ID..." -ForegroundColor Gray
echo "61148" | vercel env add HOSTAWAY_ACCOUNT_ID production
echo "61148" | vercel env add HOSTAWAY_ACCOUNT_ID preview
echo "61148" | vercel env add HOSTAWAY_ACCOUNT_ID development

# Add HOSTAWAY_API_KEY to all environments
Write-Host "Adding HOSTAWAY_API_KEY..." -ForegroundColor Gray
echo "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152" | vercel env add HOSTAWAY_API_KEY production
echo "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152" | vercel env add HOSTAWAY_API_KEY preview
echo "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152" | vercel env add HOSTAWAY_API_KEY development

Write-Host ""
Write-Host "✅ Environment variables added!" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "🚀 Deploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app is now live with Hostaway credentials!" -ForegroundColor Green

