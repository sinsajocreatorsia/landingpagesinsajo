-- ============================================================
-- Migration 018: Prompt Library for Hanna
-- Biblioteca de 10K+ prompts para generacion de imagenes con IA
-- ============================================================

-- 1. Main prompt library table
CREATE TABLE IF NOT EXISTS hanna_prompt_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_external_id TEXT UNIQUE,              -- ID externo para evitar duplicados en re-import
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,                        -- El prompt real
    language TEXT DEFAULT 'en',
    author TEXT,
    source_link TEXT,
    is_featured BOOLEAN DEFAULT false,

    -- Images: JSONB array of { url, width, height, alt }
    media JSONB DEFAULT '[]'::jsonb,

    -- Categories como arrays para filtrado rapido con GIN
    use_cases TEXT[] DEFAULT '{}',
    styles TEXT[] DEFAULT '{}',
    subjects TEXT[] DEFAULT '{}',

    -- Full-text search vector
    search_vector tsvector,

    -- Contadores de popularidad
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    copy_count INTEGER DEFAULT 0,
    chat_use_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para prompt library
CREATE INDEX IF NOT EXISTS idx_prompt_library_featured ON hanna_prompt_library(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_prompt_library_use_cases ON hanna_prompt_library USING GIN(use_cases);
CREATE INDEX IF NOT EXISTS idx_prompt_library_styles ON hanna_prompt_library USING GIN(styles);
CREATE INDEX IF NOT EXISTS idx_prompt_library_subjects ON hanna_prompt_library USING GIN(subjects);
CREATE INDEX IF NOT EXISTS idx_prompt_library_search ON hanna_prompt_library USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_prompt_library_popular ON hanna_prompt_library(favorite_count DESC, view_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_library_created ON hanna_prompt_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_library_language ON hanna_prompt_library(language);

-- Trigger para auto-generar search_vector
CREATE OR REPLACE FUNCTION prompt_library_search_trigger()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prompt_library_search
    BEFORE INSERT OR UPDATE OF title, description, content
    ON hanna_prompt_library
    FOR EACH ROW
    EXECUTE FUNCTION prompt_library_search_trigger();

-- 2. Categories lookup table
CREATE TABLE IF NOT EXISTS hanna_prompt_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('use_case', 'style', 'subject')),
    slug TEXT NOT NULL,
    label TEXT NOT NULL,
    label_es TEXT,
    description TEXT,
    prompt_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(type, slug)
);

CREATE INDEX IF NOT EXISTS idx_prompt_categories_type ON hanna_prompt_categories(type);

-- 3. User favorites
CREATE TABLE IF NOT EXISTS hanna_prompt_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES hanna_prompt_library(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, prompt_id)
);

CREATE INDEX IF NOT EXISTS idx_prompt_favorites_user ON hanna_prompt_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_favorites_prompt ON hanna_prompt_favorites(prompt_id);

-- 4. Usage tracking
CREATE TABLE IF NOT EXISTS hanna_prompt_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES hanna_prompt_library(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL CHECK (action IN ('view', 'copy', 'favorite', 'unfavorite', 'chat_use')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prompt_usage_prompt ON hanna_prompt_usage_stats(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_usage_action ON hanna_prompt_usage_stats(action);
CREATE INDEX IF NOT EXISTS idx_prompt_usage_created ON hanna_prompt_usage_stats(created_at DESC);

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE hanna_prompt_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_prompt_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_prompt_usage_stats ENABLE ROW LEVEL SECURITY;

-- Prompt library: lectura publica (SEO)
CREATE POLICY "Anyone can view prompts"
    ON hanna_prompt_library FOR SELECT
    USING (true);

-- Categories: lectura publica
CREATE POLICY "Anyone can view categories"
    ON hanna_prompt_categories FOR SELECT
    USING (true);

-- Favorites: solo el usuario puede ver/crear/borrar los suyos
CREATE POLICY "Users can view own favorites"
    ON hanna_prompt_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
    ON hanna_prompt_favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON hanna_prompt_favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Usage stats: insert via service_role solamente (no user-facing policy needed)

-- Service role full access
GRANT ALL ON hanna_prompt_library TO service_role;
GRANT ALL ON hanna_prompt_categories TO service_role;
GRANT ALL ON hanna_prompt_favorites TO service_role;
GRANT ALL ON hanna_prompt_usage_stats TO service_role;

-- Funcion helper para incrementar contadores
CREATE OR REPLACE FUNCTION increment_prompt_counter(
    p_prompt_id UUID,
    p_counter TEXT
)
RETURNS void AS $$
BEGIN
    EXECUTE format(
        'UPDATE hanna_prompt_library SET %I = %I + 1 WHERE id = $1',
        p_counter, p_counter
    ) USING p_prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
