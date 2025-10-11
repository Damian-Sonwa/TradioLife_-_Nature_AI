import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, AlertTriangle, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface ClassificationResult {
  species: string;
  type: "invasive" | "edible" | "unknown";
  confidence: number;
  description: string;
  safetyNotes?: string;
}

const Identify = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setLoading(true);
    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("plant-images")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Call classification edge function
      const { data, error } = await supabase.functions.invoke("classify-plant", {
        body: { imagePath: filePath },
      });

      if (error) throw error;

      setResult(data);
      toast.success("Plant identified!");
    } catch (error: any) {
      toast.error(error.message || "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    // Navigate to map with report mode
    navigate("/map?report=true");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Identify Plant</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Photo</CardTitle>
              <CardDescription>
                Take a photo or upload an image of the plant you want to identify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div className="py-12">
                    <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No image selected</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </Button>
                <Button
                  onClick={handleClassify}
                  disabled={!selectedFile || loading}
                  className="flex-1"
                >
                  {loading ? "Analyzing..." : "Identify Plant"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Identification Result</CardTitle>
              <CardDescription>AI analysis of the uploaded plant</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {result.type === "invasive" ? (
                      <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
                    ) : (
                      <Check className="h-6 w-6 text-accent flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{result.species}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {result.type} • {Math.round(result.confidence * 100)}% confidence
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground">{result.description}</p>

                  {result.safetyNotes && (
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">Safety Notes:</p>
                      <p className="text-sm text-muted-foreground">{result.safetyNotes}</p>
                    </div>
                  )}

                  {result.type === "invasive" && (
                    <Button onClick={handleReport} variant="destructive" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report This Sighting
                    </Button>
                  )}

                  {result.type === "edible" && (
                    <Button asChild className="w-full">
                      <a href="/recipes">View Recipes</a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Upload and identify a plant to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Identify;
