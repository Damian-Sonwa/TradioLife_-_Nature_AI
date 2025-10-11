-- Create enum for plant classification types
CREATE TYPE plant_type AS ENUM ('invasive', 'edible', 'unknown');

-- Create species table
CREATE TABLE public.species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  scientific_name TEXT,
  description TEXT,
  plant_type plant_type NOT NULL,
  image_url TEXT,
  safety_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create reports table for invasive species sightings
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  species_id UUID REFERENCES public.species(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID REFERENCES public.species(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  steps TEXT[] NOT NULL,
  chef_tip TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for species (public read, admin write)
CREATE POLICY "Anyone can view species"
  ON public.species FOR SELECT
  USING (true);

-- RLS Policies for reports (users can CRUD their own)
CREATE POLICY "Users can view all reports"
  ON public.reports FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON public.reports FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for recipes (public read)
CREATE POLICY "Anyone can view recipes"
  ON public.recipes FOR SELECT
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample species data
INSERT INTO public.species (name, scientific_name, description, plant_type, safety_notes) VALUES
('Garlic Mustard', 'Alliaria petiolata', 'An invasive species that threatens native plants', 'invasive', 'Edible but highly invasive - report all sightings'),
('Japanese Knotweed', 'Fallopia japonica', 'Fast-growing invasive perennial', 'invasive', 'Extremely invasive - do not plant'),
('Purslane', 'Portulaca oleracea', 'Nutritious edible succulent with omega-3 fatty acids', 'edible', 'Safe to eat when properly identified'),
('Dandelion', 'Taraxacum officinale', 'Common edible plant, every part is edible', 'edible', 'Avoid areas treated with pesticides'),
('Wild Garlic', 'Allium vineale', 'Edible wild onion with medicinal properties', 'edible', 'Safe when properly identified');

-- Insert sample recipes
INSERT INTO public.recipes (species_id, title, description, ingredients, steps, chef_tip, prep_time_minutes)
SELECT 
  id,
  'Wild Purslane Salad',
  'A refreshing, nutrient-dense salad featuring purslane',
  ARRAY['2 cups purslane', '1 tomato, diced', '1/4 red onion, thinly sliced', '2 tbsp olive oil', '1 tbsp lemon juice', 'Salt and pepper'],
  ARRAY['Wash purslane thoroughly', 'Remove thick stems', 'Combine with tomato and onion', 'Dress with olive oil and lemon', 'Season to taste'],
  'Purslane has a slightly sour, salty taste that pairs wonderfully with acidic dressings',
  15
FROM public.species WHERE name = 'Purslane';

INSERT INTO public.recipes (species_id, title, description, ingredients, steps, chef_tip, prep_time_minutes)
SELECT 
  id,
  'Garlic Mustard Pesto',
  'A delicious way to use invasive garlic mustard',
  ARRAY['2 cups garlic mustard leaves', '1/2 cup olive oil', '1/3 cup pine nuts', '1/2 cup parmesan', '2 cloves garlic', 'Salt'],
  ARRAY['Wash leaves thoroughly', 'Toast pine nuts lightly', 'Blend all ingredients until smooth', 'Adjust consistency with olive oil', 'Season with salt'],
  'Using invasive species in cooking helps control their spread while enjoying free, wild food',
  20
FROM public.species WHERE name = 'Garlic Mustard';

INSERT INTO public.recipes (species_id, title, description, ingredients, steps, chef_tip, prep_time_minutes)
SELECT 
  id,
  'Dandelion Green Sauté',
  'Tender dandelion greens with garlic',
  ARRAY['3 cups young dandelion greens', '3 cloves garlic, minced', '2 tbsp olive oil', 'Red pepper flakes', 'Lemon juice', 'Salt'],
  ARRAY['Clean greens and remove tough stems', 'Heat oil in large pan', 'Sauté garlic until fragrant', 'Add greens and cook until wilted', 'Finish with lemon and seasoning'],
  'Young spring dandelions are less bitter - look for tender leaves',
  12
FROM public.species WHERE name = 'Dandelion';