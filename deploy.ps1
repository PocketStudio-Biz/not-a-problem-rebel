# PowerShell deployment script for Netlify

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan

# Check if environment variables are set correctly
$envContent = Get-Content .env -Raw
if ($envContent -match "your-supabase-url|your-supabase-anon-key") {
    Write-Host "❌ Error: Please update your .env file with actual Supabase credentials." -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the application
Write-Host "🏗️ Building application..." -ForegroundColor Yellow
npm run build

# Check if Netlify CLI is installed
$netlifyInstalled = $null
try {
    $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if (-not $netlifyInstalled) {
    Write-Host "🔧 Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Deploy to Netlify
Write-Host "🚀 Deploying to Netlify..." -ForegroundColor Green
netlify deploy --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green 