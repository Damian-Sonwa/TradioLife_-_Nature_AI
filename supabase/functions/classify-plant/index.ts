import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imagePath } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // For demo purposes, return mock classification
    // In production, you would use AI model for real classification
    const mockClassifications = [
      {
        species: "Garlic Mustard",
        type: "invasive",
        confidence: 0.92,
        description: "An invasive species that threatens native plants by forming dense stands that crowd out other vegetation.",
        safetyNotes: "Edible but highly invasive - report all sightings to help control spread.",
      },
      {
        species: "Purslane",
        type: "edible",
        confidence: 0.88,
        description: "A nutritious edible succulent rich in omega-3 fatty acids, vitamins, and minerals.",
        safetyNotes: "Safe to eat when properly identified. Avoid areas treated with pesticides.",
      },
      {
        species: "Japanese Knotweed",
        type: "invasive",
        confidence: 0.95,
        description: "Fast-growing invasive perennial that can damage buildings and infrastructure.",
        safetyNotes: "Extremely invasive - do not plant. Report sightings immediately.",
      },
      {
        species: "Dandelion",
        type: "edible",
        confidence: 0.91,
        description: "Common edible plant where every part is edible - leaves, flowers, and roots.",
        safetyNotes: "Safe when properly identified. Young spring leaves are less bitter.",
      },
    ];

    // Return random mock result for demo
    const result = mockClassifications[Math.floor(Math.random() * mockClassifications.length)];

    console.log(`Classified plant: ${result.species} (${result.type})`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Classification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
