-- Fix recipes table to allow NULL image_url
-- Run this BEFORE the main migration if image_url has NOT NULL constraint

-- Make image_url nullable
ALTER TABLE public.recipes ALTER COLUMN image_url DROP NOT NULL;

-- Also make sure other optional fields are nullable
DO $$
BEGIN
  -- Make chef_tip nullable if it isn't
  BEGIN
    ALTER TABLE public.recipes ALTER COLUMN chef_tip DROP NOT NULL;
  EXCEPTION
    WHEN OTHERS THEN NULL;
  END;
  
  -- Make description nullable if it isn't
  BEGIN
    ALTER TABLE public.recipes ALTER COLUMN description DROP NOT NULL;
  EXCEPTION
    WHEN OTHERS THEN NULL;
  END;
  
  -- Make prep_time_minutes nullable if it isn't
  BEGIN
    ALTER TABLE public.recipes ALTER COLUMN prep_time_minutes DROP NOT NULL;
  EXCEPTION
    WHEN OTHERS THEN NULL;
  END;
END $$;

-- Verify the fix
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'recipes' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

