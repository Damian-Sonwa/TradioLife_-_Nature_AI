-- Enhanced Features Migration
-- Adds plant journal, seasonal finder, challenges, and more discovery features

-- 1. Plant Journal/Collection
CREATE TABLE IF NOT EXISTS public.plant_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  species_id UUID REFERENCES public.species(id) ON DELETE SET NULL,
  plant_name TEXT NOT NULL,
  common_name TEXT,
  scientific_name TEXT,
  image_url TEXT,
  notes TEXT,
  location_name TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  identified_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false,
  confidence_score DECIMAL(3, 2),
  plant_type TEXT CHECK (plant_type IN ('invasive', 'edible', 'medicinal', 'ornamental', 'unknown')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Identification History
CREATE TABLE IF NOT EXISTS public.identification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  result JSONB NOT NULL,
  species_identified TEXT,
  confidence DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Community Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT CHECK (challenge_type IN ('identification', 'reporting', 'recipe', 'streak')),
  goal_count INTEGER NOT NULL,
  points_reward INTEGER NOT NULL DEFAULT 50,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  icon TEXT DEFAULT 'Trophy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. User Challenge Progress
CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_count INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- 5. Seasonal Plants Recommendations
CREATE TABLE IF NOT EXISTS public.seasonal_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID REFERENCES public.species(id) ON DELETE CASCADE,
  common_name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  months_active INTEGER[] NOT NULL, -- Array of months (1-12)
  plant_type TEXT CHECK (plant_type IN ('invasive', 'edible', 'medicinal', 'ornamental')),
  image_url TEXT,
  care_difficulty TEXT CHECK (care_difficulty IN ('easy', 'moderate', 'hard')),
  fun_fact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Plant Care Guides
CREATE TABLE IF NOT EXISTS public.plant_care_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID REFERENCES public.species(id) ON DELETE CASCADE,
  plant_name TEXT NOT NULL,
  watering_schedule TEXT,
  sunlight_requirements TEXT,
  soil_type TEXT,
  temperature_range TEXT,
  growing_season TEXT,
  propagation_methods TEXT[],
  common_pests TEXT[],
  harvest_tips TEXT,
  storage_tips TEXT,
  nutritional_info JSONB,
  medicinal_properties TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. User Activity Log
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('identification', 'report', 'recipe_view', 'achievement', 'login')),
  activity_details JSONB,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Community Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  us.user_id,
  us.total_points,
  us.level,
  us.reports_count,
  us.identifications_count,
  us.streak_days,
  COUNT(DISTINCT ua.achievement_id) as achievement_count,
  RANK() OVER (ORDER BY us.total_points DESC) as rank
FROM public.user_stats us
LEFT JOIN public.user_achievements ua ON us.user_id = ua.user_id
GROUP BY us.user_id, us.total_points, us.level, us.reports_count, us.identifications_count, us.streak_days
ORDER BY us.total_points DESC;

-- Enable Row Level Security
ALTER TABLE public.plant_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_care_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plant_journal
CREATE POLICY "Users can view their own plant journal"
  ON public.plant_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their plant journal"
  ON public.plant_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their plant journal"
  ON public.plant_journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their plant journal"
  ON public.plant_journal FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for identification_history
CREATE POLICY "Users can view their identification history"
  ON public.identification_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert identification history"
  ON public.identification_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for challenges (public read, admin write)
CREATE POLICY "Anyone can view active challenges"
  ON public.challenges FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_challenge_progress
CREATE POLICY "Users can view their challenge progress"
  ON public.user_challenge_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their challenge progress"
  ON public.user_challenge_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their challenge progress"
  ON public.user_challenge_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for seasonal_plants (public read)
CREATE POLICY "Anyone can view seasonal plants"
  ON public.seasonal_plants FOR SELECT
  USING (true);

-- RLS Policies for plant_care_guides (public read)
CREATE POLICY "Anyone can view plant care guides"
  ON public.plant_care_guides FOR SELECT
  USING (true);

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their activity log"
  ON public.user_activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert activity log"
  ON public.user_activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert sample challenges
INSERT INTO public.challenges (title, description, challenge_type, goal_count, points_reward, icon, is_active) VALUES
  ('Rookie Identifier', 'Identify your first 5 plants', 'identification', 5, 50, 'Target', true),
  ('Invasive Hunter', 'Report 10 invasive species sightings', 'reporting', 10, 100, 'Shield', true),
  ('Recipe Master', 'View 10 different wild plant recipes', 'recipe', 10, 75, 'ChefHat', true),
  ('Week Streaker', 'Log in for 7 consecutive days', 'streak', 7, 150, 'Flame', true),
  ('Plant Expert', 'Identify 20 different plant species', 'identification', 20, 200, 'Award', true);

-- Insert sample seasonal plants (edible and invasive)
INSERT INTO public.seasonal_plants (common_name, scientific_name, description, months_active, plant_type, care_difficulty, fun_fact) VALUES
  ('Wild Garlic', 'Allium vineale', 'Edible bulb and greens with strong garlic flavor', ARRAY[3,4,5], 'edible', 'easy', 'All parts are edible and can be used as a garlic substitute'),
  ('Dandelion', 'Taraxacum officinale', 'Highly nutritious with edible flowers, leaves, and roots', ARRAY[3,4,5,6,7,8,9], 'edible', 'easy', 'Every part of the dandelion is edible and medicinal'),
  ('Purslane', 'Portulaca oleracea', 'Succulent herb rich in omega-3 fatty acids', ARRAY[5,6,7,8,9], 'edible', 'easy', 'Contains more omega-3 than many fish oils'),
  ('Chickweed', 'Stellaria media', 'Tender green with mild flavor, high in vitamins', ARRAY[3,4,5,9,10,11], 'edible', 'easy', 'Can be eaten raw in salads or cooked like spinach'),
  ('Japanese Knotweed', 'Fallopia japonica', 'Highly invasive but young shoots are edible', ARRAY[4,5,6], 'invasive', 'hard', 'Despite being invasive, it tastes like rhubarb'),
  ('Garlic Mustard', 'Alliaria petiolata', 'Invasive plant with garlic-flavored leaves', ARRAY[3,4,5], 'invasive', 'easy', 'Eating this invasive plant actually helps control it'),
  ('Wood Sorrel', 'Oxalis stricta', 'Lemony-tasting leaves and flowers, high in vitamin C', ARRAY[4,5,6,7,8], 'edible', 'easy', 'The sour taste comes from oxalic acid, like in lemons'),
  ('Lamb''s Quarters', 'Chenopodium album', 'Nutritious green, related to quinoa', ARRAY[5,6,7,8,9], 'edible', 'easy', 'More nutritious than spinach with higher protein content'),
  ('Stinging Nettle', 'Urtica dioica', 'Nutritious but must be cooked to remove sting', ARRAY[3,4,5], 'edible', 'moderate', 'Cooking or drying removes the sting, revealing a spinach-like flavor'),
  ('Wild Violet', 'Viola sororia', 'Edible flowers and leaves, high in vitamins A and C', ARRAY[3,4,5], 'edible', 'easy', 'Both flowers and leaves are edible and make beautiful salad garnishes');

-- Insert sample plant care guides
INSERT INTO public.plant_care_guides (plant_name, watering_schedule, sunlight_requirements, soil_type, temperature_range, growing_season, propagation_methods, common_pests, harvest_tips, storage_tips, medicinal_properties) VALUES
  ('Dandelion', 'Moderate - keep soil moist but not waterlogged', 'Full sun to partial shade', 'Any well-draining soil', '50-85°F (10-30°C)', 'Spring, Summer, Fall', ARRAY['Seeds', 'Root division'], ARRAY['Aphids', 'Leaf miners'], 'Harvest young leaves before flowering for best flavor', 'Store fresh leaves in refrigerator for up to a week', ARRAY['Digestive aid', 'Liver support', 'Anti-inflammatory']),
  ('Purslane', 'Low to moderate - drought tolerant', 'Full sun', 'Poor to average, well-draining', '70-100°F (21-38°C)', 'Summer', ARRAY['Seeds', 'Stem cuttings'], ARRAY['Few pests'], 'Harvest tender tips and leaves throughout summer', 'Best used fresh, can be refrigerated for 3-4 days', ARRAY['Heart health', 'Anti-inflammatory', 'Rich in antioxidants']),
  ('Wild Garlic', 'Moderate - consistent moisture', 'Partial shade to full sun', 'Rich, moist soil', '40-75°F (4-24°C)', 'Spring', ARRAY['Bulbs', 'Seeds'], ARRAY['Onion flies'], 'Harvest leaves before flowering, bulbs in late spring', 'Store in refrigerator or preserve in vinegar', ARRAY['Antimicrobial', 'Heart health', 'Immune support']),
  ('Chickweed', 'Moderate - prefers moist conditions', 'Partial shade', 'Rich, moist soil', '50-70°F (10-21°C)', 'Spring, Fall, Winter', ARRAY['Seeds', 'Stem cuttings'], ARRAY['Slugs'], 'Harvest tender shoots and leaves', 'Use fresh within 2-3 days', ARRAY['Anti-inflammatory', 'Skin conditions', 'Digestive aid']);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plant_journal_updated_at
  BEFORE UPDATE ON public.plant_journal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenge_progress_updated_at
  BEFORE UPDATE ON public.user_challenge_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log user activity and award points
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_details JSONB,
  p_points_earned INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  -- Insert activity log
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_details, points_earned)
  VALUES (p_user_id, p_activity_type, p_activity_details, p_points_earned);
  
  -- Update user stats if points earned (only if user_stats table exists)
  IF p_points_earned > 0 AND EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_stats'
  ) THEN
    -- Try to update existing record first
    UPDATE public.user_stats
    SET 
      total_points = total_points + p_points_earned,
      level = GREATEST(1, (total_points + p_points_earned) / 100),
      updated_at = now()
    WHERE user_id = p_user_id;
    
    -- If no row was updated, insert new one
    IF NOT FOUND THEN
      INSERT INTO public.user_stats (user_id, total_points, level)
      VALUES (p_user_id, p_points_earned, GREATEST(1, p_points_earned / 100));
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

