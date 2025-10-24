# ✅ Quick Start Checklist

Follow this checklist to get TradioLife up and running.

---

## Step 1: Install Dependencies ⏱️ ~2 minutes

```bash
npm install
```

- [ ] Dependencies installed successfully
- [ ] No errors in terminal

---

## Step 2: Get Supabase Credentials ⏱️ ~3 minutes

### If you already have a Supabase project:

1. Go to https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### If you DON'T have a Supabase project yet:

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Name: `tradiolife` (or any name you want)
   - Database Password: (create a strong password - save it!)
   - Region: Choose closest to you
4. Click **"Create new project"** (takes ~2 minutes)
5. Once ready, go to **Settings** → **API** and copy:
   - **Project URL**
   - **anon/public key**

**Checklist:**
- [ ] I have my Supabase Project URL
- [ ] I have my Supabase anon key

---

## Step 3: Configure Environment Variables ⏱️ ~1 minute

1. Open the `.env.local` file in your editor
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

**Checklist:**
- [ ] `.env.local` file updated with my Supabase credentials
- [ ] No spaces before/after the `=` sign
- [ ] No quotes around the values

---

## Step 4: Apply Database Migrations ⏱️ ~2 minutes

### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if you don't have it
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project-ref from dashboard URL)
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

### Option B: Manual (Using Dashboard)

1. Go to your Supabase dashboard
2. Click **SQL Editor** in sidebar
3. Click **"New query"**
4. Open each migration file and run them in order:
   - `supabase/migrations/20251011225600_a104fb82-7771-4184-9c5f-b68f23177284.sql`
   - `supabase/migrations/20251011225919_8a8a002c-d522-4677-bb4a-1da8fd29c87a.sql`
   - `supabase/migrations/20251013020301_b94fcda1-6aa5-4b38-ab70-a48e2375957e.sql`
   - ⭐ `supabase/migrations/20251024_fix_storage_bucket.sql` (IMPORTANT!)
5. Click **"Run"** for each one

**Checklist:**
- [ ] All 4 migrations ran successfully
- [ ] No errors shown
- [ ] Storage bucket `plant-images` exists (check in **Storage** tab)

---

## Step 5: Start the Application ⏱️ ~1 minute

```bash
npm run dev
```

**Checklist:**
- [ ] App started without errors
- [ ] Can open http://localhost:5173
- [ ] See the login/signup page

---

## Step 6: Test Basic Functionality ⏱️ ~3 minutes

### 6.1 Test Authentication
1. Click **"Sign Up"**
2. Enter email and password
3. Should see dashboard

**Checklist:**
- [ ] Can sign up successfully
- [ ] Can see dashboard after signup

### 6.2 Test Plant Identification
1. Go to **"Identify"** page
2. Upload any plant image (any image works for testing)
3. Click **"Identify Plant"**
4. Should see result (mock data: Purslane, Dandelion, etc.)

**Checklist:**
- [ ] Can upload image
- [ ] Identification returns a result
- [ ] No errors in console (press F12)

### 6.3 Test Map (if you want map functionality)
1. Go to **"Map"** page

**If you see an error message:** Map needs Mapbox token (see Step 7 - Optional)

**Checklist:**
- [ ] Map page loads without crashing
- [ ] Either see map OR see helpful message about token

---

## Step 7: Enable Map (Optional) ⏱️ ~3 minutes

### Get Mapbox Token (Free)
1. Go to https://account.mapbox.com/
2. Sign up / Login (it's free!)
3. Go to **Access Tokens**
4. Copy your **Default public token** (or create new one)

### Add to Environment
1. Open `.env.local`
2. Add line:
```env
VITE_MAPBOX_TOKEN=pk.eyJ1...your-token-here
```
3. **Restart the app** (Ctrl+C and `npm run dev`)
4. Go to Map page - should now show interactive map!

**Checklist:**
- [ ] Created Mapbox account
- [ ] Added token to `.env.local`
- [ ] Restarted app
- [ ] Map now visible

---

## 🎉 You're Done!

### ✅ What You Should Have Now:
- ✅ App running on http://localhost:5173
- ✅ Can sign up / login
- ✅ Can identify plants (mock AI)
- ✅ Can view recipes
- ✅ Can see dashboard
- ✅ Map visible (if you added Mapbox token)

---

## 🚨 Troubleshooting

### Problem: "Missing required Supabase configuration"
**Solution:** Check `.env.local` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Problem: Plant identification fails with "upload error"
**Solution:** 
1. Check you ran ALL 4 database migrations
2. Especially the storage bucket migration: `20251024_fix_storage_bucket.sql`
3. In Supabase dashboard → Storage, check `plant-images` bucket exists

### Problem: Map shows blank or input field
**Solution:** Add `VITE_MAPBOX_TOKEN` to `.env.local` (see Step 7)

### Problem: Can't sign up / login
**Solution:**
1. Check Supabase credentials in `.env.local`
2. Check Supabase dashboard → Authentication is enabled
3. Check browser console (F12) for errors

---

## 📚 Need More Help?

- **Detailed Setup:** See [SETUP.md](./SETUP.md)
- **What Was Fixed:** See [FIXES_SUMMARY.md](./FIXES_SUMMARY.md)
- **Project Overview:** See [README.md](./README.md)

---

**Total setup time: ~10-15 minutes** ⏱️

Good luck! 🌿🚀


