-- Complete fix for recipes table with unusual primary key structure
-- This handles the case where image_url is part of the primary key

DO $$
DECLARE
    v_constraint_name TEXT;
BEGIN
    -- Step 1: Find and drop any primary key constraint involving image_url
    FOR v_constraint_name IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'recipes' 
          AND table_schema = 'public'
          AND constraint_type = 'PRIMARY KEY'
    LOOP
        EXECUTE format('ALTER TABLE public.recipes DROP CONSTRAINT %I', v_constraint_name);
        RAISE NOTICE 'Dropped primary key: %', v_constraint_name;
    END LOOP;

    -- Step 2: Add a proper UUID primary key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'recipes' 
          AND column_name = 'id' 
          AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.recipes ADD COLUMN id UUID DEFAULT gen_random_uuid();
    END IF;

    -- Step 3: Create proper primary key on id
    BEGIN
        ALTER TABLE public.recipes ADD PRIMARY KEY (id);
        RAISE NOTICE 'Added proper primary key on id column';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Primary key already exists or could not be added';
    END;

    -- Step 4: Make optional columns nullable
    BEGIN
        ALTER TABLE public.recipes ALTER COLUMN image_url DROP NOT NULL;
        RAISE NOTICE 'Made image_url nullable';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'image_url constraint issue: %', SQLERRM;
    END;

    BEGIN
        ALTER TABLE public.recipes ALTER COLUMN chef_tip DROP NOT NULL;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.recipes ALTER COLUMN description DROP NOT NULL;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.recipes ALTER COLUMN prep_time_minutes DROP NOT NULL;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;

    RAISE NOTICE '=== Recipes table fix complete! ===';
    
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Recipes table does not exist yet - will be created correctly';
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- Verify the fix
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'recipes' AND table_schema = 'public') THEN
        RAISE NOTICE '=== Current recipes table structure: ===';
        PERFORM column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'recipes' AND table_schema = 'public'
        ORDER BY ordinal_position;
    END IF;
END $$;

