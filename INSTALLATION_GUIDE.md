# 🌿 TradioLife - Complete Installation & Setup Guide

This guide will walk you through setting up the **TradioLife** app from scratch, connecting it to your Supabase database, and getting all features running smoothly.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)
- **Supabase Account** (free tier works fine) - [Sign up](https://supabase.com/)

---

## 🚀 Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd TradioLife_-_Nature_AI
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React & React Router
- Supabase JS Client
- Mapbox GL JS
- Shadcn/ui components
- TailwindCSS
- And more...

---

## 🔑 Step 3: Configure Environment Variables

### 3.1 Create Environment File

Create a `.env.local` file in the root directory:

```bash
# On Windows (PowerShell)
New-Item .env.local

# On Mac/Linux
touch .env.local
```

### 3.2 Add Your Credentials

Open `.env.local` and add the following (replace with your actual values):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://otujqzorryqtszcqboih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWpxem9ycnlxdHN6Y3Fib2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5OTYsImV4cCI6MjA3NTc4Nzk5Nn0.g4lRJmthcZ0fSB0RAAFx_aApcun4At00H2jDzIUPWXo

# Optional: Mapbox Configuration (for map features)
# Get your free token at https://mapbox.com
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**Note:** The Supabase credentials provided above are already configured for your project.

---

## 🗄️ Step 4: Set Up Database

### 4.1 Apply Database Migrations

The app requires several database tables and configurations. Apply the migrations in order:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **SQL Editor**
4. Run the migration files in order:
   - `supabase/migrations/20251011225600_a104fb82-7771-4184-9c5f-b68f23177284.sql`
   - `supabase/migrations/20251011225919_8a8a002c-d522-4677-bb4a-1da8fd29c87a.sql`
   - `supabase/migrations/20251013020301_b94fcda1-6aa5-4b38-ab70-a48e2375957e.sql`
   - `supabase/migrations/20251024_fix_storage_bucket.sql`
   - `supabase/migrations/20251024_enhanced_features.sql`

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref otujqzorryqtszcqboih

# Push all migrations
supabase db push
```

### 4.2 Verify Tables Were Created

In your Supabase Dashboard, go to **Table Editor** and verify these tables exist:
- `species`
- `reports`
- `recipes`
- `achievements`
- `user_achievements`
- `user_stats`
- `plant_journal`
- `identification_history`
- `challenges`
- `user_challenge_progress`
- `seasonal_plants`
- `plant_care_guides`
- `user_activity_log`

---

## 🖼️ Step 5: Configure Storage Bucket

### 5.1 Verify Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Ensure `plant-images` bucket exists
3. If not, create it:
   - Click "New Bucket"
   - Name: `plant-images`
   - Public: Yes (checked)
   - Click "Create Bucket"

### 5.2 Set Storage Policies

The migration `20251024_fix_storage_bucket.sql` should have set this up, but verify:

1. Click on the `plant-images` bucket
2. Go to **Policies** tab
3. Ensure these policies exist:
   - "Authenticated users can upload plant images"
   - "Public read access for plant images"

---

## 🗺️ Step 6: (Optional) Configure Mapbox

The map feature requires a Mapbox token:

1. Go to [mapbox.com](https://www.mapbox.com/)
2. Sign up for a free account
3. Go to **Account → Tokens**
4. Copy your default public token
5. Add it to `.env.local`:
   ```env
   VITE_MAPBOX_TOKEN=pk.eyJ1...your_token_here
   ```

**Note:** The app will work without Mapbox but the map feature won't display.

---

## ⚡ Step 7: Deploy Edge Functions (Optional)

The plant classification function is already deployed, but if you need to update it:

### 7.1 Using Supabase CLI

```bash
# Deploy the classify-plant function
supabase functions deploy classify-plant

# Deploy the get-mapbox-token function (if using Mapbox via edge function)
supabase functions deploy get-mapbox-token
```

### 7.2 Set Function Secrets (if needed)

```bash
# Optional: Set API key for production AI classification
supabase secrets set LOVABLE_API_KEY=your_api_key_here

# Optional: Set Mapbox token for edge function
supabase secrets set MAPBOX_PUBLIC_TOKEN=your_mapbox_token_here
```

---

## 🎨 Step 8: Run the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173/`

---

## ✅ Step 9: Test the Application

### 9.1 Create an Account

1. Navigate to `http://localhost:5173/`
2. Click "Get Started"
3. Sign up with email and password
4. Verify your email (check your inbox)

### 9.2 Test Features

1. **Dashboard:** View your stats and overview
2. **Identify Plant:** Upload a plant image and get AI identification
3. **Plant Journal:** View your saved plant identifications
4. **Seasonal Finder:** Browse plants by season
5. **Challenges:** Complete challenges and earn points
6. **Recipes:** Explore wild plant recipes
7. **Care Guide:** Learn about plant care
8. **Map:** View invasive species reports (requires Mapbox)

---

## 🏗️ Step 10: Build for Production

When you're ready to deploy:

```bash
# Build the production version
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` directory.

---

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Option 2: Vercel

1. Connect your repository to Vercel
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables in Vercel dashboard

### Option 3: Traditional Hosting

Upload the contents of `dist/` folder to your web server.

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"

**Solution:** Double-check your `.env.local` file and ensure:
- Variables start with `VITE_`
- No extra spaces or quotes
- Values match your Supabase project settings

### Issue: "Storage upload failed"

**Solution:**
1. Verify storage bucket is created and public
2. Check storage policies are set correctly
3. Ensure you're logged in

### Issue: "Map not showing"

**Solution:**
1. Add `VITE_MAPBOX_TOKEN` to `.env.local`
2. Get a free token from [mapbox.com](https://mapbox.com)
3. Restart development server

### Issue: "Database errors"

**Solution:**
1. Ensure all migrations are applied in order
2. Check RLS policies are enabled
3. Verify user is authenticated

### Issue: "Plant identification not working"

**Solution:**
1. Check browser console for errors
2. Verify edge function is deployed
3. Ensure storage bucket is accessible

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 🎉 You're All Set!

Your TradioLife app should now be fully functional with:

✅ User authentication
✅ Plant identification with AI
✅ Plant journal/collection
✅ Seasonal plant finder
✅ Community challenges & leaderboard
✅ Recipe browser
✅ Plant care guides
✅ Interactive map (with Mapbox)
✅ Gamification system (points, levels, achievements)

---

## 💡 Pro Tips

1. **Regular Backups:** Back up your Supabase database regularly
2. **Monitor Usage:** Check Supabase dashboard for API usage
3. **Update Dependencies:** Keep packages up to date
4. **Security:** Never commit `.env.local` to version control
5. **Performance:** Use image optimization for uploaded photos

---

## 🤝 Need Help?

If you encounter any issues:

1. Check the console for error messages
2. Review the troubleshooting section above
3. Check Supabase logs in the dashboard
4. Verify all environment variables are set correctly

---

## 📄 License

MIT License © 2025 TradioLife Developers

---

Happy conserving! 🌱🌍

