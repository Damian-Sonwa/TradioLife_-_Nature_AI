# 🔑 Credentials Setup Guide

## Important: Manual Environment File Setup Required

Since `.env.local` files are git-ignored (for security), you need to create it manually.

---

## Step 1: Create .env.local File

### On Windows (PowerShell):
```powershell
New-Item -Path ".env.local" -ItemType File
```

### On Mac/Linux:
```bash
touch .env.local
```

---

## Step 2: Add Your Credentials

Open the `.env.local` file in your text editor and paste the following:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://otujqzorryqtszcqboih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dWpxem9ycnlxdHN6Y3Fib2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTE5OTYsImV4cCI6MjA3NTc4Nzk5Nn0.g4lRJmthcZ0fSB0RAAFx_aApcun4At00H2jDzIUPWXo

# Optional: Mapbox Configuration
# Get your free token at https://mapbox.com
# VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## Step 3: Verify the File

Make sure:
- ✅ File is named exactly `.env.local` (with the dot)
- ✅ File is in the root directory (same level as `package.json`)
- ✅ No extra spaces before or after the `=` signs
- ✅ No quotes around the values

---

## Step 4: Restart Development Server

After creating the file:

```bash
# Stop the server if running (Ctrl+C)
# Then restart:
npm run dev
```

---

## Verify It's Working

1. Open the app in your browser
2. Open browser console (F12)
3. You should NOT see any "VITE_SUPABASE_URL is undefined" errors

---

## Troubleshooting

### Issue: "VITE_SUPABASE_URL is undefined"
**Solution:** 
- Check file name is `.env.local` (not `env.local` or `.env.local.txt`)
- Ensure file is in root directory
- Restart dev server

### Issue: "Invalid API Key"
**Solution:**
- Copy the entire key without line breaks
- Remove any extra spaces
- The key should start with `eyJh...`

### Issue: Variables not loading
**Solution:**
- Variables MUST start with `VITE_` in Vite
- Restart the development server
- Clear browser cache

---

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git
- Never share your anon key publicly
- The provided key is already configured for your project
- For production, use environment variables in your hosting platform

---

## Optional: Mapbox Token

To enable the interactive map feature:

1. Go to https://mapbox.com
2. Sign up for a free account
3. Go to Account → Access Tokens
4. Copy your default public token
5. Add to `.env.local`:
   ```env
   VITE_MAPBOX_TOKEN=pk.eyJ1...your_token_here
   ```

The app will work without Mapbox, but the map page won't display properly.

---

## Need Help?

If you're still having issues:
1. Check the file is in the correct location
2. Verify the file name (including the dot)
3. Make sure variables start with `VITE_`
4. Restart the development server
5. Check browser console for specific errors

---

Happy coding! 🚀

