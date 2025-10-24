# TradioLife - Nature AI Setup Guide

## 🔧 Fixed Issues

This document describes the issues that were found and fixed in the codebase:

### Issue #1: Missing Environment Variables ✅ FIXED
**Problem:** The application required Supabase and Mapbox credentials but no `.env.local` file existed.

**Solution:** 
- Created `.env.example` template file
- Created `.env.local` file for local configuration
- Added environment variable validation in `src/integrations/supabase/client.ts`

### Issue #2: Storage Bucket Permissions ✅ FIXED
**Problem:** The `plant-images` storage bucket was private with insufficient read policies, preventing the AI classification function from accessing uploaded images.

**Solution:**
- Created migration `supabase/migrations/20251024_fix_storage_bucket.sql`
- Made bucket public
- Added policies for authenticated users and public read access
- Maintained secure upload policies (users can only upload to their own folders)

### Issue #3: Mapbox Token Handling ✅ FIXED
**Problem:** Map failed silently when Mapbox token wasn't configured, with no helpful error messages.

**Solution:**
- Updated `src/pages/Map.tsx` to check environment variable first
- Added fallback to Supabase edge function
- Added user-friendly error messages with clear instructions
- Map now shows helpful guidance when token is missing

### Issue #4: AI Classification Error Handling ✅ FIXED
**Problem:** AI plant identification had minimal error handling and logging.

**Solution:**
- Enhanced `supabase/functions/classify-plant/index.ts` with validation and logging
- Improved error messages in `src/pages/Identify.tsx`
- Added console logging for debugging
- Classification now works with mock data (no API key required for testing)

---

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Copy the example environment file and fill in your credentials:

\`\`\`bash
# The .env.local file has already been created
# Edit it with your actual credentials
\`\`\`

Edit `.env.local` with your credentials:

\`\`\`env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Mapbox Configuration (Optional)
# Get your token from: https://account.mapbox.com/access-tokens/
VITE_MAPBOX_TOKEN=pk.eyJ1...your-token-here
\`\`\`

### 3. Set Up Supabase

#### Option A: Using Supabase CLI (Recommended)

\`\`\`bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Deploy edge functions
supabase functions deploy classify-plant
supabase functions deploy get-mapbox-token

# Set edge function secrets (if using edge function for Mapbox)
supabase secrets set MAPBOX_PUBLIC_TOKEN=your_mapbox_token
\`\`\`

#### Option B: Manual Setup

1. Go to your Supabase project dashboard
2. Run the SQL migrations in order:
   - `20251011225600_a104fb82-7771-4184-9c5f-b68f23177284.sql` (main tables)
   - `20251011225919_8a8a002c-d522-4677-bb4a-1da8fd29c87a.sql` (storage bucket)
   - `20251013020301_b94fcda1-6aa5-4b38-ab70-a48e2375957e.sql` (achievements)
   - `20251024_fix_storage_bucket.sql` (storage fix) ⭐ NEW
3. Deploy edge functions manually through the dashboard

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

The application should now be running at `http://localhost:5173`

---

## 🗺️ Map Configuration

The map feature supports two methods for providing the Mapbox token:

### Method 1: Environment Variable (Recommended for Development)
Add to `.env.local`:
\`\`\`env
VITE_MAPBOX_TOKEN=pk.eyJ1...your-token-here
\`\`\`

### Method 2: Supabase Edge Function Secret (Recommended for Production)
\`\`\`bash
supabase secrets set MAPBOX_PUBLIC_TOKEN=your_mapbox_token
\`\`\`

The application will automatically try the environment variable first, then fall back to the edge function.

---

## 🤖 AI Plant Identification

The plant identification feature currently uses **mock classification** for demonstration purposes.

### Current Behavior
- Uploads images to Supabase storage ✅
- Returns randomized mock plant data ✅
- Works without any AI API keys ✅

### For Production AI Integration

To integrate a real AI model, update `supabase/functions/classify-plant/index.ts`:

1. Choose an AI service:
   - **Plant.id API** - Specialized plant identification
   - **OpenAI GPT-4 Vision** - General purpose vision API
   - **Google Cloud Vision** - Plant detection capabilities
   - **Custom TensorFlow model** - Self-hosted solution

2. Add your API key to Supabase secrets:
\`\`\`bash
supabase secrets set AI_API_KEY=your-api-key-here
\`\`\`

3. Replace the mock classification logic with real API calls

Example for Plant.id:
\`\`\`typescript
// Get the image URL from storage
const { data: { publicUrl } } = supabase.storage
  .from('plant-images')
  .getPublicUrl(imagePath);

// Call Plant.id API
const response = await fetch('https://api.plant.id/v2/identify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Api-Key': PLANT_ID_API_KEY,
  },
  body: JSON.stringify({
    images: [publicUrl],
    // ... other options
  }),
});
\`\`\`

---

## 🔍 Troubleshooting

### Map Not Showing
1. Check if `VITE_MAPBOX_TOKEN` is set in `.env.local`
2. Verify token is valid at https://account.mapbox.com/access-tokens/
3. Check browser console for error messages
4. The map will display a helpful message if token is missing

### Plant Identification Not Working
1. Check browser console for error messages
2. Verify Supabase credentials in `.env.local`
3. Ensure storage bucket migration ran successfully
4. Check Supabase dashboard > Storage > Policies
5. Verify edge function is deployed: `supabase functions list`

### Database Connection Issues
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
2. Check Supabase project status in dashboard
3. Ensure migrations have been applied
4. Check browser console for detailed error messages

### Authentication Issues
1. Clear browser localStorage and cookies
2. Check Supabase Auth settings in dashboard
3. Verify email confirmation is enabled/disabled as intended
4. Check Supabase logs for auth errors

---

## 📝 Database Schema

### Core Tables
- **species** - Plant species information (invasive/edible/unknown)
- **reports** - User-submitted invasive species sightings
- **recipes** - Recipes using edible wild plants
- **profiles** - User profile information
- **achievements** - Gamification achievements
- **user_achievements** - User achievement unlocks
- **user_stats** - User statistics and progress

### Storage Buckets
- **plant-images** - Uploaded plant photos (now public with proper policies)

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Storage bucket** is public for demo purposes - restrict in production
3. **RLS policies** are enabled on all tables for security
4. **Edge functions** have CORS enabled for development
5. **User uploads** are restricted to user-specific folders

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Mapbox Documentation](https://docs.mapbox.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Router Documentation](https://reactrouter.com/)

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Review this SETUP.md file
4. Check `.env.example` for required variables
5. Verify all migrations are applied

---

**Last Updated:** October 24, 2025
**Status:** ✅ All critical issues resolved


