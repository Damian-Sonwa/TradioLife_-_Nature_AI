import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Leaf, Sun, Droplet, Lightbulb, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface SeasonalPlant {
  id: string;
  common_name: string;
  scientific_name: string | null;
  description: string | null;
  months_active: number[];
  plant_type: string | null;
  care_difficulty: string | null;
  fun_fact: string | null;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SEASONS = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  fall: [9, 10, 11],
  winter: [12, 1, 2]
};

const SeasonalFinder = () => {
  const [user, setUser] = useState<any>(null);
  const [plants, setPlants] = useState<SeasonalPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [selectedTab, setSelectedTab] = useState("current");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadSeasonalPlants();
    });
  }, [navigate]);

  const loadSeasonalPlants = async () => {
    try {
      const { data, error } = await supabase
        .from("seasonal_plants")
        .select("*")
        .order("common_name");

      if (error) throw error;
      setPlants(data || []);
    } catch (error) {
      console.error("Error loading seasonal plants:", error);
      toast.error("Failed to load seasonal plants");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSeasonPlants = () => {
    return plants.filter(plant => plant.months_active.includes(currentMonth));
  };

  const getSeasonPlants = (season: keyof typeof SEASONS) => {
    const seasonMonths = SEASONS[season];
    return plants.filter(plant => 
      plant.months_active.some(month => seasonMonths.includes(month))
    );
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "moderate": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "hard": return "bg-red-500/10 text-red-700 dark:text-red-400";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "edible": return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "invasive": return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "medicinal": return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "ornamental": return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      default: return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const PlantCard = ({ plant }: { plant: SeasonalPlant }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl">{plant.common_name}</CardTitle>
            {plant.scientific_name && (
              <CardDescription className="italic">{plant.scientific_name}</CardDescription>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {plant.plant_type && (
              <Badge className={getTypeColor(plant.plant_type)}>
                {plant.plant_type}
              </Badge>
            )}
            {plant.care_difficulty && (
              <Badge className={getDifficultyColor(plant.care_difficulty)}>
                {plant.care_difficulty}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {plant.description && (
          <p className="text-sm text-muted-foreground">{plant.description}</p>
        )}

        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-1">Active Months:</p>
            <div className="flex flex-wrap gap-1">
              {plant.months_active.sort((a, b) => a - b).map(month => (
                <Badge key={month} variant="outline" className="text-xs">
                  {MONTHS[month - 1]}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {plant.fun_fact && (
          <div className="bg-accent/10 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Fun Fact:</p>
                <p className="text-sm text-muted-foreground">{plant.fun_fact}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/identify")}
          >
            <Leaf className="h-4 w-4 mr-2" />
            Identify
          </Button>
          {plant.plant_type === "edible" && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate("/recipes")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Recipes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Seasonal Plant Finder</h1>
          <p className="text-muted-foreground">
            Discover what's growing in your area by season
          </p>
        </div>

        {/* Current Month Highlight */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-primary" />
              {MONTHS[currentMonth - 1]} - What's Growing Now
            </CardTitle>
            <CardDescription>
              {getCurrentSeasonPlants().length} plants are in season this month
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Seasonal Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="current">This Month</TabsTrigger>
            <TabsTrigger value="spring">Spring</TabsTrigger>
            <TabsTrigger value="summer">Summer</TabsTrigger>
            <TabsTrigger value="fall">Fall</TabsTrigger>
            <TabsTrigger value="winter">Winter</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {loading ? (
              <div className="text-center py-12">Loading plants...</div>
            ) : getCurrentSeasonPlants().length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Leaf className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No plants found</h3>
                  <p className="text-muted-foreground">
                    Check back next month for seasonal recommendations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentSeasonPlants().map(plant => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="spring">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Spring Plants</h2>
              <p className="text-muted-foreground">March, April, May</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSeasonPlants("spring").map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summer">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Summer Plants</h2>
              <p className="text-muted-foreground">June, July, August</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSeasonPlants("summer").map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fall">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Fall Plants</h2>
              <p className="text-muted-foreground">September, October, November</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSeasonPlants("fall").map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="winter">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Winter Plants</h2>
              <p className="text-muted-foreground">December, January, February</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSeasonPlants("winter").map(plant => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeasonalFinder;

