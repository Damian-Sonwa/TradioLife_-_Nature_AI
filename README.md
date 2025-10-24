# 🌿 TradioLife: AI-Powered Invasive Species & Edible Plant Detector

TradioLife is an **AI-driven environmental app** designed to identify plants from photos, detect **invasive species**, and suggest **sustainable recipes** using native edible plants.

It combines **AI classification**, **geolocation reporting**, **recipe exploration**, and **data visualization** — all wrapped in a beautiful, nature-inspired design.

---

## 🖼️ App Preview

- Animated **flipping background** on the login and signup pages 🌄  
- Upload a photo → Get instant species identification  
- View invasive species reports on an interactive map 🗺️  
- Discover chef-curated recipes for edible native plants 🥗  
- Track biodiversity trends via a visual dashboard 📊  

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript + Vite + TailwindCSS |
| **UI Components** | Shadcn/ui + Radix UI |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Database** | Supabase PostgreSQL with Row Level Security |
| **Storage** | Supabase Storage for plant images |
| **AI Classification** | Supabase Edge Functions (Deno) |
| **Map Integration** | Mapbox GL JS |
| **Authentication** | Supabase Auth (JWT-based) |
| **Deployment** | Netlify (Frontend) + Supabase (Backend) |

---

## 🚀 Features

### 🧠 AI Plant Classifier
- Upload or capture plant images.  
- Identifies species using an AI model.  
- Displays:
  - Name
  - Classification (Invasive / Edible / Unknown)
  - Confidence score
  - Description  

### 🌍 Invasive Species Reporting
- Report invasive plant sightings.  
- Auto-detects location via GPS.  
- Stores in backend with coordinates & timestamp.  
- View sightings on **interactive map with clustering & heatmap overlays**.

### 🥬 Edible Plant Recipes
- Suggests safe, eco-friendly dishes made from edible native plants.  
- Displays recipe name, image, ingredients, steps, and tips.  

### 🧭 Dashboard & Analytics
- Map of reported invasive species.  
- Time-series chart showing reporting activity.  
- Table of species name, date, and location.  

### 💫 Authentication (with Animation)
- Secure login/signup with JWT.  
- **Flipping background image animation** with smooth transitions.  
- Fully responsive and mobile-ready.

---

## ⚡ Setup Instructions

### 🚨 IMPORTANT: Issues Fixed!
This project had several critical issues that have been **fixed**:
- ✅ Missing environment configuration
- ✅ Storage bucket permissions 
- ✅ Map not visible
- ✅ AI plant identification errors

**📖 See [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) for details on what was fixed.**

**📘 See [SETUP.md](./SETUP.md) for complete setup instructions.**

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
```bash
# Edit .env.local with your credentials (file already created)
# Required:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for map):
VITE_MAPBOX_TOKEN=your_mapbox_token
```

3. **Apply Database Migrations**
```bash
# Using Supabase CLI
supabase db push

# OR manually run SQL files in supabase/migrations/ in your Supabase dashboard
```

4. **Run the App**
```bash
npm run dev
```

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

---

## 🧪 Testing the App

1. Sign up or log in.  
2. Upload a plant image.  
3. Get identification result.  
4. Report if invasive / view on map.  
5. Explore edible plant recipes.  

---

## 🐞 Troubleshooting

- **Missing Supabase Config:** Edit `.env.local` with your Supabase credentials
- **Map Not Showing:** Add `VITE_MAPBOX_TOKEN` to `.env.local`
- **Image Upload Fails:** Run storage bucket migration in `supabase/migrations/20251024_fix_storage_bucket.sql`
- **Authentication Issues:** Check Supabase project status and credentials

**See [SETUP.md](./SETUP.md#-troubleshooting) for detailed troubleshooting guide.**  

---

## 🌍 Future Enhancements
- Integrate live satellite vegetation data.  
- Add multilingual support.  
- Enable offline mode.  
- Add community leaderboard.  

---

## 👩🏾‍💻 Credits
**Team:** Madu Damian & AI Assistants  
**Built with:** MGX + FastAPI + React  
**Inspiration:** Google Lens × PlantNet × Calm App  

---

## 🪴 License
MIT License © 2025 TradioLife Developers
APP URL: https://tradiolife-regen.netlify.app/
