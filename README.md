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
| **Frontend** | React.js (Vite / Next.js) + TailwindCSS + Axios |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL / SQLite |
| **AI Model (Mock)** | EfficientNet / ResNet (PyTorch / TensorFlow-ready) |
| **Map Integration** | Leaflet.js / Mapbox |
| **Authentication** | JWT-based Auth |
| **Deployment** | Docker + Heroku / GCP (Free Tier) |

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

### 1. Clone the Repository
```bash
(https://github.com/Damian-Sonwa/flora-guard-gather.git)
cd tradiolife
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

### 4. Environment Variables

**Backend `.env`:**
```
DATABASE_URL=sqlite:///./tradiolife.db
SECRET_KEY=your_jwt_secret
```

**Frontend `.env`:**
```
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🧪 Testing the App

1. Sign up or log in.  
2. Upload a plant image.  
3. Get identification result.  
4. Report if invasive / view on map.  
5. Explore edible plant recipes.  

---

## 🐞 Troubleshooting

- **CORS Error:** Add CORS middleware in FastAPI.  
- **Image Upload Fails:** Ensure `/uploads` exists.  
- **Blank Map:** Check Mapbox token and console logs.  

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
