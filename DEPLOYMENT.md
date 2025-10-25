# 🚀 Deployment Guide for TradioLife

## ⚠️ Important: Environment Variables Required

Your app will show a blank screen or error if environment variables aren't configured in your deployment platform.

---

## 📋 Required Environment Variables

You need to set these in your deployment platform:

```bash
VITE_SUPABASE_URL=https://otujqzorryqtszcqboih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWpxem9ycnlxdHN6Y3Fib2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5OTYsImV4cCI6MjA3NTc4Nzk5Nn0.g4lRJmthcZ0fSB0RAAFx_aApcun4At00H2jDzIUPWXo
VITE_MAPBOX_TOKEN=pk.eyJ1IjoiZGFtaWFuLTI1IiwiYSI6ImNtZ25mMXJ4YTByZHQya3Nhc3BoNzYyMmcifQ.ypTTaQ1x-XX9oUFhaK4XXQ
```

---

## 🟢 Netlify Deployment

### Option 1: Via Netlify Dashboard (Recommended)

1. **Go to your site's dashboard**
   - Visit: https://app.netlify.com/sites/tradiolife-regen/settings/deploys

2. **Navigate to Environment Variables**
   - Go to: Site Settings → Build & Deploy → Environment Variables
   - Or directly: https://app.netlify.com/sites/tradiolife-regen/settings/env

3. **Add each variable**
   Click "Add a variable" and add:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://otujqzorryqtszcqboih.supabase.co`
   - Scopes: ✅ All (production, deploy previews, branch deploys)

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWpxem9ycnlxdHN6Y3Fib2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5OTYsImV4cCI6MjA3NTc4Nzk5Nn0.g4lRJmthcZ0fSB0RAAFx_aApcun4At00H2jDzIUPWXo`
   - Scopes: ✅ All

   **Variable 3:**
   - Key: `VITE_MAPBOX_TOKEN`
   - Value: `pk.eyJ1IjoiZGFtaWFuLTI1IiwiYSI6ImNtZ25mMXJ4YTByZHQya3Nhc3BoNzYyMmcifQ.ypTTaQ1x-XX9oUFhaK4XXQ`
   - Scopes: ✅ All

4. **Trigger a new deploy**
   - Go to: Deploys → Trigger deploy → Deploy site
   - Or push a new commit to trigger automatic deployment

### Option 2: Via Netlify CLI

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your project
netlify link

# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://otujqzorryqtszcqboih.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWpxem9ycnlxdHN6Y3Fib2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5OTYsImV4cCI6MjA3NTc4Nzk5Nn0.g4lRJmthcZ0fSB0RAAFx_aApcun4At00H2jDzIUPWXo"
netlify env:set VITE_MAPBOX_TOKEN "pk.eyJ1IjoiZGFtaWFuLTI1IiwiYSI6ImNtZ25mMXJ4YTByZHQya3Nhc3BoNzYyMmcifQ.ypTTaQ1x-XX9oUFhaK4XXQ"

# Deploy
netlify deploy --prod
```

---

## ▲ Vercel Deployment

### Option 1: Via Vercel Dashboard

1. **Go to your project settings**
   - Visit: https://vercel.com/your-username/tradiolife/settings/environment-variables

2. **Add environment variables**
   Click "Add" for each:

   - Name: `VITE_SUPABASE_URL`
     Value: `https://otujqzorryqtszcqboih.supabase.co`
     Environments: ✅ Production ✅ Preview ✅ Development

   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWpxem9ycnlxdHN6Y3Fib2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5OTYsImV4cCI6MjA3NTc4Nzk5Nn0.g4lRJmthcZ0fSB0RAAFx_aApcun4At00H2jDzIUPWXo`
     Environments: ✅ Production ✅ Preview ✅ Development

   - Name: `VITE_MAPBOX_TOKEN`
     Value: `pk.eyJ1IjoiZGFtaWFuLTI1IiwiYSI6ImNtZ25mMXJ4YTByZHQya3Nhc3BoNzYyMmcifQ.ypTTaQ1x-XX9oUFhaK4XXQ`
     Environments: ✅ Production ✅ Preview ✅ Development

3. **Redeploy**
   - Trigger a new deployment from the Deployments tab

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Set environment variables
vercel env add VITE_SUPABASE_URL production
# Paste: https://otujqzorryqtszcqboih.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste the anon key

vercel env add VITE_MAPBOX_TOKEN production
# Paste the mapbox token

# Deploy
vercel --prod
```

---

## 🐙 GitHub Pages Deployment

**Note:** GitHub Pages doesn't support environment variables directly. Use Netlify or Vercel instead.

---

## ✅ Verification Steps

After setting environment variables and deploying:

1. **Visit your deployed site**
   - https://tradiolife-regen.netlify.app/

2. **Check the browser console (F12)**
   - Should see: "✅ Supabase client initialized"
   - Should NOT see: "❌ Missing Supabase configuration!"

3. **Test functionality**
   - Sign up / Login should work
   - Plant identification should work
   - Map should load (if Mapbox token is set)

---

## 🔍 Troubleshooting

### Issue: Blank screen on deployment

**Solution:**
1. Check environment variables are set in deployment platform
2. Ensure variable names start with `VITE_` (required for Vite)
3. Trigger a new deployment after adding variables
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: "supabaseUrl is required" error

**Solution:**
- Environment variables aren't set or have wrong names
- Go to deployment platform and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy after adding

### Issue: App works locally but not in production

**Solution:**
- `.env.local` file only works locally
- Must set environment variables in deployment platform
- Follow steps above for your platform

### Issue: Map not loading

**Solution:**
- Check if `VITE_MAPBOX_TOKEN` is set in deployment platform
- Verify token is valid at https://account.mapbox.com/

---

## 📝 Quick Reference

| Platform | Environment Variables Location |
|----------|-------------------------------|
| **Netlify** | Site Settings → Environment Variables |
| **Vercel** | Project Settings → Environment Variables |
| **Railway** | Project → Variables |
| **Render** | Environment → Environment Variables |

---

## 🚨 Security Notes

- ✅ Anon key is safe to expose (client-side)
- ✅ Row Level Security (RLS) protects your data
- ❌ NEVER commit `.env.local` to git
- ❌ NEVER expose service role key (if you have one)

---

## 🎉 Success!

Once environment variables are set and deployed:
- Your app will load properly
- Users can sign up/login
- Plant identification will work
- All features will be functional

**Your site:** https://tradiolife-regen.netlify.app/

Built with ❤️ by damistackcode

