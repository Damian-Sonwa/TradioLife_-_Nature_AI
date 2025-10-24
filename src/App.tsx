import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Identify from "./pages/Identify";
import Recipes from "./pages/Recipes";
import Map from "./pages/Map";
import PlantJournal from "./pages/PlantJournal";
import SeasonalFinder from "./pages/SeasonalFinder";
import Challenges from "./pages/Challenges";
import PlantCareGuide from "./pages/PlantCareGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/identify" element={<Identify />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/map" element={<Map />} />
          <Route path="/journal" element={<PlantJournal />} />
          <Route path="/seasonal" element={<SeasonalFinder />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/care-guide" element={<PlantCareGuide />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
