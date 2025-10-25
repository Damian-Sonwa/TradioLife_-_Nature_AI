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
    
    // Validate input
    if (!imagePath) {
      throw new Error("imagePath is required");
    }

    console.log(`Processing classification for image: ${imagePath}`);
    
    // Note: AI_API_KEY is optional for the demo mock classification
    // In production, you would use a real AI model API
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (AI_API_KEY) {
      console.log("API key configured for production use");
    } else {
      console.log("Using mock classification (no API key configured)");
    }

    // Enhanced mock classification with more realistic plant database
    const mockClassifications = [
      {
        species: "Garlic Mustard (Alliaria petiolata)",
        type: "invasive",
        confidence: 0.92,
        description: "An invasive biennial herb that threatens native plants by forming dense stands. It releases chemicals that inhibit other plant growth and disrupts native ecosystems.",
        safetyNotes: "Edible but highly invasive - report all sightings. All parts are edible with a mild garlic flavor.",
      },
      {
        species: "Purslane (Portulaca oleracea)",
        type: "edible",
        confidence: 0.88,
        description: "A nutritious succulent herb exceptionally rich in omega-3 fatty acids, vitamins A, C, and E. Contains more omega-3s than many fish oils.",
        safetyNotes: "Safe to eat when properly identified. Avoid areas treated with pesticides. Best eaten fresh in salads.",
      },
      {
        species: "Japanese Knotweed (Fallopia japonica)",
        type: "invasive",
        confidence: 0.95,
        description: "Fast-growing invasive perennial that can grow through concrete and damage buildings. Spreads rapidly through underground rhizomes.",
        safetyNotes: "Extremely invasive - do not plant. Young shoots are edible (taste like rhubarb) but harvesting doesn't control spread.",
      },
      {
        species: "Dandelion (Taraxacum officinale)",
        type: "edible",
        confidence: 0.91,
        description: "Highly nutritious perennial where every part is edible and medicinal. Leaves are rich in vitamins A, C, K, calcium, and iron. Roots can be roasted as coffee substitute.",
        safetyNotes: "Safe when properly identified. Young spring leaves are less bitter. Excellent for liver health and digestion.",
      },
      {
        species: "Wild Violet (Viola sororia)",
        type: "edible",
        confidence: 0.85,
        description: "Native North American wildflower with heart-shaped leaves. Both flowers and leaves are edible, high in vitamins A and C.",
        safetyNotes: "Completely safe to eat. Flowers make beautiful salad garnishes. Leaves can be cooked like spinach.",
      },
      {
        species: "Chickweed (Stellaria media)",
        type: "edible",
        confidence: 0.87,
        description: "Delicate annual herb with tender leaves and small white flowers. Rich in vitamins and minerals, traditionally used for skin conditions.",
        safetyNotes: "Safe to eat raw or cooked. Best harvested young. Excellent in salads or as a spinach substitute.",
      },
      {
        species: "Lamb's Quarters (Chenopodium album)",
        type: "edible",
        confidence: 0.89,
        description: "Highly nutritious annual plant related to quinoa. More nutritious than spinach with higher protein content, vitamins, and minerals.",
        safetyNotes: "Safe when properly identified. Contains some oxalic acid - cook to reduce. Avoid if prone to kidney stones.",
      },
      {
        species: "Stinging Nettle (Urtica dioica)",
        type: "edible",
        confidence: 0.93,
        description: "Perennial herb with stinging hairs containing formic acid. Extremely nutritious when cooked, rich in iron, calcium, and vitamins.",
        safetyNotes: "Must be cooked or dried to remove sting. Wear gloves when harvesting. Excellent for anemia and joint health.",
      },
      {
        species: "Wood Sorrel (Oxalis stricta)",
        type: "edible",
        confidence: 0.84,
        description: "Small plant with clover-like leaves that have a pleasant lemony taste due to oxalic acid. High in vitamin C.",
        safetyNotes: "Safe in moderation. High oxalic acid content - don't eat in large quantities. Avoid if prone to kidney stones.",
      },
      {
        species: "Wild Garlic (Allium vineale)",
        type: "edible",
        confidence: 0.90,
        description: "Perennial bulb plant with strong garlic odor. All parts edible - bulbs, leaves, and flowers can be used as garlic substitute.",
        safetyNotes: "Safe when properly identified. Ensure it smells like garlic. Similar-looking plants can be toxic.",
      },
      {
        species: "English Ivy (Hedera helix)",
        type: "invasive",
        confidence: 0.94,
        description: "Aggressive climbing vine that smothers trees and structures. Forms dense ground cover preventing native plant growth.",
        safetyNotes: "NOT EDIBLE - berries and leaves are toxic. Remove carefully as it can damage building exteriors.",
      },
      {
        species: "Common Plantain (Plantago major)",
        type: "edible",
        confidence: 0.86,
        description: "Perennial herb with medicinal properties. Leaves are edible when young, traditionally used for wound healing.",
        safetyNotes: "Safe to eat young leaves. Older leaves are tough and fibrous. Excellent poultice for insect bites.",
      },
    ];

    // Return random mock result for demo with enhanced information
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
