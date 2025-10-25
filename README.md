# 🌿 TradioLife - AI-Powered Nature Conservation Platform

![TradioLife](https://img.shields.io/badge/Built%20by-damistackcode-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square)

## 🎯 Overview

TradioLife is a stunning, nature-inspired web application that helps users identify plants, track invasive species, and discover edible native plants using AI-powered technology. Built with a focus on conservation and environmental protection.

## ✨ Key Features

### 🤖 AI Plant Identification
- Upload or capture plant photos for instant AI-powered identification
- Detailed species information with confidence scores
- Safety notes and edibility information
- Fallback mock classification for offline/demo use

### 🗺️ Interactive Mapping
- Mapbox GL JS integration for real-time species tracking
- Report invasive species sightings with GPS coordinates
- Visualize biodiversity hotspots
- Community-driven data collection

### 📚 Plant Journal
- Save identified plants to your personal collection
- Track your discoveries over time
- Add notes and observations
- Photo gallery of your findings

### 🏆 Gamification
- Earn points for identifications and reports
- Level progression system
- Achievement badges
- Streak tracking
- Community leaderboard

### 🍽️ Recipe Database
- Chef-curated recipes using edible native plants
- Seasonal recommendations
- Nutritional information
- Step-by-step cooking guides

### 🌸 Seasonal Plant Finder
- Discover what's in season near you
- Location-based plant recommendations
- Calendar view of plant availability

### 💚 Community Challenges
- Weekly and monthly conservation challenges
- Team-based competitions
- Progress tracking
- Rewards and recognition

## 🎨 Design Highlights

### Nature-Inspired Color Palette
- **Emerald**: Deep forest greens (#064e3b)
- **Green**: Rich moss tones (#166534)
- **Teal**: Ocean depths (#134e4a)
- **Lime**: Fresh highlights (#bef264)

### Modern UI/UX
- ✅ Framer Motion animations throughout
- ✅ Glassmorphic design elements
- ✅ Floating leaf particle effects
- ✅ Scroll-triggered animations
- ✅ Interactive hover states
- ✅ Responsive mobile-first design
- ✅ Full dark mode support with optimized contrast
- ✅ Accessible focus states

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Professional animations
- **Shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible primitives

### Backend & Database
- **Supabase** - Backend as a service
  - PostgreSQL database
  - Authentication
  - Storage for plant images
  - Edge Functions for AI classification
  - Row Level Security (RLS)

### Maps & Geolocation
- **Mapbox GL JS** - Interactive mapping
- **Geolocation API** - Device location tracking

### State Management
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Real-time Ready
- **Socket.IO Client** - Ready for live updates (future feature)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or bun
- Supabase account

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/Damian-Sonwa/TradioLife_-_Nature_AI.git
cd TradioLife_-_Nature_AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

4. **Run database migrations**
- Go to your Supabase dashboard
- Navigate to the SQL Editor
- Run migrations in order from `supabase/migrations/`

5. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🗄️ Database Schema

### Core Tables
- **profiles** - User information
- **species** - Plant species database
- **reports** - Invasive species sightings
- **recipes** - Edible plant recipes
- **achievements** - Gamification badges
- **user_stats** - Points, levels, streaks
- **user_achievements** - Unlocked achievements
- **plant_journal** - User's plant collection
- **identification_history** - AI identification logs
- **seasonal_plants** - Season-based plant data
- **challenges** - Community challenges
- **user_challenge_progress** - Challenge tracking

### Storage Buckets
- **plant-images** - User-uploaded plant photos

### Edge Functions
- **classify-plant** - AI plant identification
- **get-mapbox-token** - Secure token delivery

## 🎬 Animations

### Hero Section
- Animated falling leaves (6 particles)
- Pulsing gradient blobs (3 independent movements)
- Staggered text fade-ins
- Interactive button hover effects
- Wiggling tree icon
- Scroll indicator with bounce

### Plant Gallery
- Scroll-triggered card animations
- Hover lift effects
- Image zoom on hover
- Staggered entrance timing

### Features Cards
- Icon rotation on hover
- Card lift animation
- Glassmorphic blur effects

## 🌓 Dark Mode

Full dark mode support with:
- Optimized color contrast for readability
- Nature-inspired dark backgrounds
- Smooth theme transitions
- Persistent theme preference
- Manual theme toggle in navbar

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Touch-optimized controls
- Adaptive layouts
- Optimized images for different screens

## 🔒 Security

- Row Level Security (RLS) on all tables
- Secure authentication with Supabase
- API key protection
- CORS configuration
- SQL injection prevention

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Built with ❤️ by damistackcode**

- GitHub: [@Damian-Sonwa](https://github.com/Damian-Sonwa)
- Repository: [TradioLife_-_Nature_AI](https://github.com/Damian-Sonwa/TradioLife_-_Nature_AI)

## 🙏 Acknowledgments

- Plant identification powered by AI
- Maps by Mapbox
- Icons by Lucide React
- UI components by Shadcn/ui
- Database by Supabase

## 🌍 Mission

TradioLife is dedicated to protecting native ecosystems through technology. By making plant identification accessible to everyone, we empower communities to:
- Identify and report invasive species
- Discover safe, edible native plants
- Contribute to biodiversity research
- Make informed conservation decisions

---

**Join us in protecting our planet's incredible biodiversity! 🌿**
