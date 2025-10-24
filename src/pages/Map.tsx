import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import MapboxMap from "@/components/MapboxMap";

interface Report {
  id: string;
  latitude: number;
  longitude: number;
  notes: string;
  created_at: string;
  species: {
    name: string;
    plant_type: string;
  };
}

const Map = () => {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadReports();
      loadMapboxToken();
      
      if (searchParams.get("report") === "true") {
        setShowReportForm(true);
        getCurrentLocation();
      }
    });
  }, [navigate, searchParams]);

  const loadMapboxToken = async () => {
    try {
      // First, try to get token from environment variable
      const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (envToken) {
        setMapboxToken(envToken);
        return;
      }

      // If not in env, try to fetch from edge function
      const { data, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        console.error("Error loading Mapbox token from edge function:", error);
        toast.error("Mapbox token not configured. Please add VITE_MAPBOX_TOKEN to your .env.local file or MAPBOX_PUBLIC_TOKEN to Supabase Edge Function Secrets.");
        return;
      }
      if (data?.token) {
        setMapboxToken(data.token);
      }
    } catch (error) {
      console.error("Error loading Mapbox token:", error);
      toast.error("Failed to load Mapbox configuration. Check console for details.");
    }
  };

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          species (name, plant_type)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast.error("Unable to get location. Please enable location services.");
        }
      );
    }
  };

  const handleSubmitReport = async () => {
    if (!location) {
      toast.error("Please enable location services");
      return;
    }

    setLoading(true);
    try {
      // For demo, use the first invasive species
      const { data: invasiveSpecies } = await supabase
        .from("species")
        .select("id")
        .eq("plant_type", "invasive")
        .limit(1)
        .single();

      if (!invasiveSpecies) throw new Error("No invasive species found");

      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        species_id: invasiveSpecies.id,
        latitude: location.lat,
        longitude: location.lng,
        notes,
      });

      if (error) throw error;

      toast.success("Report submitted successfully!");
      setShowReportForm(false);
      setNotes("");
      loadReports();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Invasive Species Map</h1>
          <p className="text-muted-foreground">View and report invasive species sightings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sightings Map</CardTitle>
                <CardDescription>Interactive map showing reported invasive species</CardDescription>
              </CardHeader>
              <CardContent>
                {mapboxToken ? (
                  <MapboxMap reports={reports} mapboxToken={mapboxToken} />
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MapPin className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground mb-2">Enter your Mapbox token to view the map</p>
                        <Input
                          type="text"
                          placeholder="pk.eyJ1..."
                          value={mapboxToken}
                          onChange={(e) => setMapboxToken(e.target.value)}
                          className="max-w-md mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {showReportForm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Report Sighting
                  </CardTitle>
                  <CardDescription>Submit a new invasive species sighting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {location ? (
                    <div className="text-sm text-muted-foreground">
                      <p>Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                    </div>
                  ) : (
                    <Button onClick={getCurrentLocation} variant="outline" className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Current Location
                    </Button>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Notes</label>
                    <Textarea
                      placeholder="Describe the sighting..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitReport}
                      disabled={!location || loading}
                      className="flex-1"
                    >
                      {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowReportForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => {
                  setShowReportForm(true);
                  getCurrentLocation();
                }}
                className="w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report New Sighting
              </Button>
            )}

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest invasive species sightings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <div
                      key={report.id}
                      className="p-3 bg-secondary/50 rounded-lg"
                    >
                      <p className="font-semibold text-sm text-foreground">
                        {report.species.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                      {report.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {report.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
