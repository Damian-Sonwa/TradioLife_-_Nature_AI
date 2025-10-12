import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import recipePurslane from "@/assets/recipe-purslane-salad.jpg";
import recipePesto from "@/assets/recipe-pesto.jpg";
import recipeDandelion from "@/assets/recipe-dandelion.jpg";
import recipeSoup from "@/assets/recipe-soup.jpg";
import recipeSaladBowl from "@/assets/recipe-salad-bowl.jpg";
import recipeHealthyPlate from "@/assets/recipe-healthy-plate.jpg";

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  chef_tip: string;
  prep_time_minutes: number;
  species: {
    name: string;
  };
}

const recipeImages: Record<string, string> = {
  "Wild Purslane Salad": recipePurslane,
  "Garlic Mustard Pesto": recipePesto,
  "Dandelion Green Sauté": recipeDandelion,
};

const fallbackImages = [recipeSoup, recipeSaladBowl, recipeHealthyPlate, recipePurslane, recipePesto, recipeDandelion];

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      loadRecipes();
    });
  }, [navigate]);

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          species (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Wild Plant Recipes</h1>
          <p className="text-muted-foreground">
            Chef-curated recipes for edible native plants
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading recipes...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <img
                    src={recipeImages[recipe.title] || fallbackImages[index % fallbackImages.length]}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{recipe.title}</CardTitle>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {recipe.species.name}
                    </Badge>
                  </div>
                  <CardDescription>{recipe.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.prep_time_minutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      Easy
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Ingredients:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                        <li key={idx}>• {ingredient}</li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li className="text-primary">+ {recipe.ingredients.length - 3} more</li>
                      )}
                    </ul>
                  </div>

                  {recipe.chef_tip && (
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">Chef's Tip:</p>
                      <p className="text-sm text-muted-foreground">{recipe.chef_tip}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;
