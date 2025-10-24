# 🗄️ Database Migration Order

## ⚠️ IMPORTANT: Apply migrations in this exact order!

Go to your [Supabase Dashboard](https://app.supabase.com/project/otujqzorryqtszcqboih) → SQL Editor

---

## Migration Files to Run (In Order):

### 1️⃣ **Initial Schema** (FIXED VERSION)
**File:** `supabase/migrations/20251011225600_fixed_initial_schema.sql`

This creates:
- ✅ `species` table
- ✅ `reports` table  
- ✅ `recipes` table
- ✅ `profiles` table
- ✅ Sample data (5 species, 3 recipes)
- ✅ RLS policies
- ✅ Triggers for user profiles

**Status:** ⭐ USE THIS FIXED VERSION (handles existing tables gracefully)

---

### 2️⃣ **Storage Bucket**
**File:** `supabase/migrations/20251011225919_8a8a002c-d522-4677-bb4a-1da8fd29c87a.sql`

This creates:
- ✅ `plant-images` storage bucket
- ✅ Storage policies

**Note:** If bucket already exists, skip the INSERT line and just run the policies.

---

### 3️⃣ **Achievements & Stats**
**File:** `supabase/migrations/20251013020301_b94fcda1-6aa5-4b38-ab70-a48e2375957e.sql`

This creates:
- ✅ `achievements` table
- ✅ `user_achievements` table
- ✅ `user_stats` table
- ✅ 7 pre-populated achievements

---

### 4️⃣ **Storage Bucket Fix**
**File:** `supabase/migrations/20251024_fix_storage_bucket.sql`

This fixes:
- ✅ Makes bucket public
- ✅ Updates storage policies

---

### 5️⃣ **Enhanced Features** ⭐ NEW
**File:** `supabase/migrations/20251024_enhanced_features.sql`

This creates:
- ✅ `plant_journal` table
- ✅ `identification_history` table
- ✅ `challenges` table (with 5 challenges)
- ✅ `user_challenge_progress` table
- ✅ `seasonal_plants` table (with 10 plants)
- ✅ `plant_care_guides` table (with 4 guides)
- ✅ `user_activity_log` table
- ✅ `leaderboard` view
- ✅ `log_user_activity()` function

---

## Quick Copy-Paste Instructions:

### If Starting Fresh:
```sql
-- Run each file in order 1-5 above
```

### If Tables Already Exist:
Use the FIXED version of migration #1: `20251011225600_fixed_initial_schema.sql`

This version uses:
- `CREATE TABLE IF NOT EXISTS` (won't fail if table exists)
- `ON CONFLICT DO NOTHING` (won't duplicate data)
- `DROP POLICY IF EXISTS` (updates policies safely)

---

## Verification After Migrations:

### Check Tables Exist:
Go to Supabase Dashboard → Table Editor

You should see **13 tables**:
1. ✅ species
2. ✅ reports
3. ✅ recipes
4. ✅ profiles
5. ✅ achievements
6. ✅ user_achievements
7. ✅ user_stats
8. ✅ plant_journal
9. ✅ identification_history
10. ✅ challenges
11. ✅ user_challenge_progress
12. ✅ seasonal_plants
13. ✅ plant_care_guides
14. ✅ user_activity_log

### Check Storage Bucket:
Go to Supabase Dashboard → Storage

You should see:
- ✅ `plant-images` bucket (public)

### Check Sample Data:
Run this query:
```sql
SELECT COUNT(*) FROM species; -- Should be 5+
SELECT COUNT(*) FROM recipes; -- Should be 3+
SELECT COUNT(*) FROM achievements; -- Should be 7
SELECT COUNT(*) FROM challenges; -- Should be 5
SELECT COUNT(*) FROM seasonal_plants; -- Should be 10
SELECT COUNT(*) FROM plant_care_guides; -- Should be 4
```

---

## Troubleshooting:

### Error: "relation already exists"
**Solution:** Use the FIXED migration file (`20251011225600_fixed_initial_schema.sql`)

### Error: "type already exists"
**Solution:** The fixed migration handles this with `DO $$ BEGIN ... EXCEPTION` block

### Error: "duplicate key value"
**Solution:** The fixed migration uses `ON CONFLICT DO NOTHING`

### Error: "policy already exists"
**Solution:** The fixed migration drops policies before creating them

---

## After All Migrations Complete:

1. ✅ Verify all 13+ tables exist
2. ✅ Verify storage bucket is created
3. ✅ Verify sample data is inserted
4. ✅ Create `.env.local` file (see CREATE_ENV_FILE.txt)
5. ✅ Run `npm run dev`
6. ✅ Test the app!

---

Need help? Check the INSTALLATION_GUIDE.md for detailed troubleshooting.

