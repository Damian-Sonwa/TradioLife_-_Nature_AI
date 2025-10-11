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
      
      if (searchParams.get("report") === "true") {
        setShowReportForm(true);
        getCurrentLocation();
      }
    });
  }, [navigate, searchParams]);

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
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Sightings Map</CardTitle>
                <CardDescription>Interactive map showing reported invasive species</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Map integration coming soon
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {reports.length} sightings reported
                    </p>
                  </div>
                </div>
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
