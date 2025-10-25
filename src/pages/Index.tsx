import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Map, BookOpen, Shield, Sparkles, Leaf, Trees, Flower2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-forest.jpg";
import plantVariety1 from "@/assets/plant-variety-1.jpg";
import plantVariety2 from "@/assets/plant-variety-2.jpg";
import plantVariety3 from "@/assets/plant-variety-3.jpg";
import plantVariety4 from "@/assets/plant-variety-4.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Nature Inspired with Animations */}
      <section className="relative pt-32 pb-24 overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950">
        {/* Animated background image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Nature gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-teal-900/90" />
        
        {/* Animated floating nature elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-400/10 rounded-full blur-2xl"
          />
          
          {/* Floating leaf particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth }}
              animate={{
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth,
                rotate: [0, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
              className="absolute"
            >
              <Leaf className="w-8 h-8 text-green-300/30" />
            </motion.div>
          ))}
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-green-400/30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 bg-green-400 rounded-full"
              />
              <Sparkles className="w-4 h-4 text-green-300" />
              <span className="text-sm font-semibold text-green-100">AI-Powered Nature Conservation</span>
              <Leaf className="w-4 h-4 text-green-300" />
            </motion.div>

            {/* Main heading with staggered animation */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight"
              >
                Protect Our
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="relative inline-block"
              >
                <h1 className="text-6xl md:text-7xl lg:text-9xl font-black leading-tight tracking-tight bg-gradient-to-r from-lime-300 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Ecosystems
                </h1>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8"
                >
                  <Trees className="w-16 h-16 text-green-300/50" />
                </motion.div>
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-xl md:text-2xl lg:text-3xl text-green-50/90 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Harness the power of <span className="font-semibold text-green-300">AI</span> to identify plants, track invasive species, and discover edible native treasures. 
              <span className="block mt-2 text-green-200">Join thousands of conservation heroes making a difference! 🌿</span>
            </motion.p>
            
            {/* CTA Buttons with hover animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-2xl shadow-green-900/50 border-2 border-green-400/30">
                  <Link to="/auth">
                    <Camera className="mr-2 h-6 w-6" />
                    Start Identifying Now
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-green-300/40 text-green-100 hover:bg-green-800/30 backdrop-blur-sm font-semibold">
                  <Link to="/auth">
                    <Shield className="mr-2 h-6 w-6" />
                    Explore Features
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="grid grid-cols-3 gap-6 md:gap-8 pt-16 max-w-3xl mx-auto"
            >
              {[
                { icon: Leaf, value: "12+", label: "Plant Species", delay: 0 },
                { icon: Sparkles, value: "AI", label: "Powered", delay: 0.1 },
                { icon: Flower2, value: "100%", label: "Free", delay: 0.2 }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="glass-card p-6 rounded-2xl border border-green-400/20 bg-green-900/30 backdrop-blur-xl"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-green-300" />
                  <div className="text-4xl font-black text-green-100">{stat.value}</div>
                  <div className="text-sm text-green-300 font-medium mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Built by attribution */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="pt-12"
            >
              <p className="text-sm text-green-300/60 font-medium">
                🌟 Built with ❤️ by{" "}
                <motion.a
                  href="https://github.com/Damian-Sonwa"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="text-green-300 font-bold hover:text-green-200 transition-colors"
                >
                  damistackcode
                </motion.a>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-8 h-12 rounded-full border-2 border-green-300/40 flex items-start justify-center p-2 backdrop-blur-sm bg-green-900/20">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-3 bg-green-300 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Plant Gallery Section - Enhanced with Animations */}
      <section className="py-24 bg-gradient-to-b from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/30 dark:to-teal-950/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Discover Plant <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Varieties</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              From vibrant wildflowers to edible native plants, explore the incredible biodiversity around you 🌸
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={plantVariety1} 
                alt="Wild purple flowers in natural habitat" 
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="overlay" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-flex px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white mb-2">
                    Wild & Free
                  </div>
                  <p className="text-white text-xl font-bold">Wildflower Meadow</p>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Beautiful native species
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={plantVariety2} 
                alt="Green leafy native plants" 
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="overlay" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-flex px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-xs text-white mb-2 font-semibold">
                    🥗 Edible
                  </div>
                  <p className="text-white text-xl font-bold">Edible Greens</p>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Nutritious & delicious
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={plantVariety3} 
                alt="Diverse forest undergrowth plants" 
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="overlay" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-flex px-3 py-1 bg-emerald-500/30 backdrop-blur-sm rounded-full text-xs text-white mb-2 font-semibold">
                    🌲 Forest
                  </div>
                  <p className="text-white text-xl font-bold">Forest Flora</p>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Diverse ecosystem
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={plantVariety4} 
                alt="Native herbs and medicinal plants" 
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="overlay" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-flex px-3 py-1 bg-purple-500/30 backdrop-blur-sm rounded-full text-xs text-white mb-2 font-semibold">
                    💊 Medicinal
                  </div>
                  <p className="text-white text-xl font-bold">Medicinal Herbs</p>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Natural healing power
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-gray-950">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Powerful <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to identify, track, and learn about plants
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group relative overflow-hidden border-2 hover-lift glass-card animate-scale-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">AI Identification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload or capture photos to instantly identify plants with advanced AI technology
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 hover-lift glass-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-2xl group-hover:bg-destructive/20 transition-all duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-destructive to-red-400 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Report Invasives</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Help track invasive species with GPS-enabled sighting reports
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 hover-lift glass-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Wild Recipes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover chef-curated recipes for delicious edible native plants
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 hover-lift glass-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
              <CardContent className="relative pt-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Map className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Interactive Map</h3>
                <p className="text-muted-foreground leading-relaxed">
                  View invasive species sightings on a live interactive map
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of environmental stewards using AI to protect native ecosystems
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
            <Link to="/auth">Start Identifying Plants</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">TradioLife - Protecting Ecosystems Through Technology</p>
            <p className="text-sm text-gray-400">Built with ❤️ by <a href="https://github.com/Damian-Sonwa" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">damistackcode</a></p>
            <p className="text-sm text-gray-500">&copy; 2025 TradioLife. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
