import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, LogOut, User, BookOpen, Calendar, Trophy, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg group-hover:scale-110 transition-transform shadow-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">TradioLife</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {user ? (
              <>
                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Dashboard
                </Link>
                <Link to="/identify" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Identify
                </Link>
                <Link to="/journal" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Journal
                </Link>
                <Link to="/seasonal" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Seasonal
                </Link>
                <Link to="/challenges" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Challenges
                </Link>
                <Link to="/recipes" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Recipes
                </Link>
                <Link to="/map" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Map
                </Link>
                <div className="ml-2 flex items-center gap-2">
                  <ThemeToggle />
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="hover-lift">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="px-4 py-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  Features
                </Link>
                <ThemeToggle />
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-slide-up">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/identify"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Leaf className="h-5 w-5" />
                  Identify Plant
                </Link>
                <Link
                  to="/journal"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Plant Journal
                </Link>
                <Link
                  to="/seasonal"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  Seasonal Finder
                </Link>
                <Link
                  to="/challenges"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Trophy className="h-5 w-5" />
                  Challenges
                </Link>
                <Link
                  to="/recipes"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Recipes
                </Link>
                <Link
                  to="/care-guide"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  Care Guide
                </Link>
                <Link
                  to="/map"
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Menu className="h-5 w-5" />
                  Map
                </Link>
                <div className="pt-2 mt-2 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={handleLogout} 
                    className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
