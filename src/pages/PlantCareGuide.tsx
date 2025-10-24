import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Droplet, Sun, Thermometer, Leaf, Calendar, Heart, Bug, BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface CareGuide {
  id: string;
  plant_name: string;
  watering_schedule: string | null;
  sunlight_requirements: string | null;
  soil_type: string | null;
  temperature_range: string | null;
  growing_season: string | null;
  propagation_methods: string[] | null;
  common_pests: string[] | null;
  harvest_tips: string | null;
  storage_tips: string | null;
  nutritional_info: any;
  medicinal_properties: string[] | null;
}

const PlantCareGuide = () => {
  const [user, setUser] = useState<any>(null);
  const [guides, setGuides] = useState<CareGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<CareGuide[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<CareGuide | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadCareGuides();
    });
  }, [navigate]);

  useEffect(() => {
    const plantName = searchParams.get("plant");
    if (plantName && guides.length > 0) {
      const guide = guides.find(g => 
        g.plant_name.toLowerCase() === plantName.toLowerCase()
      );
      if (guide) {
        setSelectedGuide(guide);
      }
    }
  }, [searchParams, guides]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredGuides(
        guides.filter(guide =>
          guide.plant_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredGuides(guides);
    }
  }, [searchQuery, guides]);

  const loadCareGuides = async () => {
    try {
      const { data, error } = await supabase
        .from("plant_care_guides")
        .select("*")
        .order("plant_name");

      if (error) throw error;
      setGuides(data || []);
      setFilteredGuides(data || []);
      
      if (data && data.length > 0 && !selectedGuide) {
        setSelectedGuide(data[0]);
      }
    } catch (error) {
      console.error("Error loading care guides:", error);
      toast.error("Failed to load care guides");
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ icon: Icon, title, content, color = "text-primary" }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content || "Information not available"}</p>
      </CardContent>
    </Card>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Plant Care Guide</h1>
          <p className="text-muted-foreground">
            Comprehensive care instructions for wild and native plants
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plant List Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Browse Plants</CardTitle>
              <CardDescription>Select a plant to view its care guide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search plants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading...</div>
                  ) : filteredGuides.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No plants found</div>
                  ) : (
                    filteredGuides.map(guide => (
                      <Button
                        key={guide.id}
                        variant={selectedGuide?.id === guide.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedGuide(guide)}
                      >
                        <Leaf className="h-4 w-4 mr-2" />
                        {guide.plant_name}
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Care Guide Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedGuide ? (
              <>
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl mb-2">{selectedGuide.plant_name}</CardTitle>
                        <CardDescription className="text-base">
                          Complete care instructions and growing information
                        </CardDescription>
                      </div>
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                </Card>

                <Tabs defaultValue="care" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="care">Care Basics</TabsTrigger>
                    <TabsTrigger value="growing">Growing Tips</TabsTrigger>
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  </TabsList>

                  <TabsContent value="care" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <InfoCard
                        icon={Droplet}
                        title="Watering"
                        content={selectedGuide.watering_schedule}
                        color="text-blue-500"
                      />
                      <InfoCard
                        icon={Sun}
                        title="Sunlight"
                        content={selectedGuide.sunlight_requirements}
                        color="text-yellow-500"
                      />
                      <InfoCard
                        icon={Thermometer}
                        title="Temperature"
                        content={selectedGuide.temperature_range}
                        color="text-red-500"
                      />
                      <InfoCard
                        icon={Leaf}
                        title="Soil Type"
                        content={selectedGuide.soil_type}
                        color="text-green-500"
                      />
                    </div>

                    {selectedGuide.growing_season && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                            Growing Season
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{selectedGuide.growing_season}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="growing" className="space-y-4">
                    {selectedGuide.propagation_methods && selectedGuide.propagation_methods.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-pink-500" />
                            Propagation Methods
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedGuide.propagation_methods.map((method, idx) => (
                              <Badge key={idx} variant="secondary">{method}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedGuide.common_pests && selectedGuide.common_pests.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bug className="h-5 w-5 text-orange-500" />
                            Common Pests
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedGuide.common_pests.map((pest, idx) => (
                              <Badge key={idx} variant="outline">{pest}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {selectedGuide.harvest_tips && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-500" />
                            Harvest Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{selectedGuide.harvest_tips}</p>
                        </CardContent>
                      </Card>
                    )}

                    {selectedGuide.storage_tips && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                            Storage Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{selectedGuide.storage_tips}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="benefits" className="space-y-4">
                    {selectedGuide.medicinal_properties && selectedGuide.medicinal_properties.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Medicinal Properties
                          </CardTitle>
                          <CardDescription>
                            Traditional and documented health benefits
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {selectedGuide.medicinal_properties.map((property, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span className="text-muted-foreground">{property}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {selectedGuide.nutritional_info && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Nutritional Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(selectedGuide.nutritional_info, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="bg-accent/10">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          <strong>Disclaimer:</strong> This information is for educational purposes only. 
                          Always consult with a qualified healthcare professional before using any plant 
                          for medicinal purposes, and ensure proper identification before consuming any wild plant.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Leaf className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Select a plant</h3>
                  <p className="text-muted-foreground">
                    Choose a plant from the list to view its care guide
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCareGuide;

