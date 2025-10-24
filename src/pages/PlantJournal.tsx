import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Heart, Search, Calendar, MapPin, Leaf, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface JournalEntry {
  id: string;
  plant_name: string;
  common_name: string | null;
  scientific_name: string | null;
  image_url: string | null;
  notes: string | null;
  location_name: string | null;
  identified_date: string;
  is_favorite: boolean;
  confidence_score: number | null;
  plant_type: string | null;
}

const PlantJournal = () => {
  const [user, setUser] = useState<any>(null);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [filteredJournal, setFilteredJournal] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadJournal(session.user.id);
    });
  }, [navigate]);

  useEffect(() => {
    filterEntries();
  }, [searchQuery, filterType, journal]);

  const loadJournal = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("plant_journal")
        .select("*")
        .eq("user_id", userId)
        .order("identified_date", { ascending: false });

      if (error) throw error;
      setJournal(data || []);
      setFilteredJournal(data || []);
    } catch (error) {
      console.error("Error loading journal:", error);
      toast.error("Failed to load plant journal");
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = [...journal];

    if (searchQuery) {
      filtered = filtered.filter(
        (entry) =>
          entry.plant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.common_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      if (filterType === "favorites") {
        filtered = filtered.filter((entry) => entry.is_favorite);
      } else {
        filtered = filtered.filter((entry) => entry.plant_type === filterType);
      }
    }

    setFilteredJournal(filtered);
  };

  const toggleFavorite = async (entryId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from("plant_journal")
        .update({ is_favorite: !currentFavorite })
        .eq("id", entryId);

      if (error) throw error;
      
      setJournal(journal.map(entry => 
        entry.id === entryId ? { ...entry, is_favorite: !currentFavorite } : entry
      ));
      toast.success(currentFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite");
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase
        .from("plant_journal")
        .delete()
        .eq("id", entryId);

      if (error) throw error;
      
      setJournal(journal.filter(entry => entry.id !== entryId));
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Failed to delete entry");
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

  const getTypeIcon = (type: string | null) => {
    return <Leaf className="h-4 w-4" />;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Plant Journal</h1>
            <p className="text-muted-foreground">
              Your personal collection of identified plants
            </p>
          </div>
          <Button onClick={() => navigate("/identify")}>
            <Leaf className="h-4 w-4 mr-2" />
            Add New Plant
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold text-foreground">{journal.length}</p>
                <p className="text-sm text-muted-foreground">Total Plants</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-3xl font-bold text-foreground">
                  {journal.filter(e => e.is_favorite).length}
                </p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Leaf className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-3xl font-bold text-foreground">
                  {journal.filter(e => e.plant_type === 'edible').length}
                </p>
                <p className="text-sm text-muted-foreground">Edible</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-3xl font-bold text-foreground">
                  {journal.filter(e => e.plant_type === 'medicinal').length}
                </p>
                <p className="text-sm text-muted-foreground">Medicinal</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "favorites" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("favorites")}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Favorites
                </Button>
                <Button
                  variant={filterType === "edible" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("edible")}
                >
                  Edible
                </Button>
                <Button
                  variant={filterType === "invasive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("invasive")}
                >
                  Invasive
                </Button>
                <Button
                  variant={filterType === "medicinal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("medicinal")}
                >
                  Medicinal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        {loading ? (
          <div className="text-center py-12">Loading journal...</div>
        ) : filteredJournal.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No plants found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterType !== "all" 
                  ? "Try adjusting your filters" 
                  : "Start identifying plants to build your journal"}
              </p>
              <Button onClick={() => navigate("/identify")}>
                Identify Your First Plant
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournal.map((entry) => (
              <Card key={entry.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {entry.image_url && (
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={entry.image_url}
                      alt={entry.plant_name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(entry.id, entry.is_favorite)}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          entry.is_favorite ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{entry.plant_name}</CardTitle>
                      {entry.scientific_name && (
                        <CardDescription className="italic">{entry.scientific_name}</CardDescription>
                      )}
                    </div>
                    {entry.plant_type && (
                      <Badge className={getTypeColor(entry.plant_type)}>
                        {entry.plant_type}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{entry.notes}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {entry.identified_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.identified_date).toLocaleDateString()}
                      </span>
                    )}
                    {entry.confidence_score && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {Math.round(entry.confidence_score * 100)}% confident
                      </span>
                    )}
                  </div>

                  {entry.location_name && (
                    <div className="flex items-start gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{entry.location_name}</span>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Entry
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantJournal;

