-- ============================================================
-- HUMOR STUDY DATABASE SCHEMA
-- ============================================================

-- Images table - stores image data
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  image_description TEXT NOT NULL,
  created_by_user_id TEXT NULL, -- Allow NULL values for sample data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Captions table - stores AI-generated captions
CREATE TABLE IF NOT EXISTS captions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_text TEXT NOT NULL,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Studies table - stores humor study metadata
CREATE TABLE IF NOT EXISTS studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Caption Mappings table - links studies to captions
CREATE TABLE IF NOT EXISTS study_caption_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  caption_id UUID NOT NULL REFERENCES captions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(study_id, caption_id)
);

-- Caption Votes table - stores user votes on captions
CREATE TABLE IF NOT EXISTS caption_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption_id UUID NOT NULL REFERENCES captions(id) ON DELETE CASCADE,
  study_id UUID NOT NULL REFERENCES studies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  vote INTEGER NOT NULL CHECK (vote IN (-1, 1)), -- -1 for thumbs down, 1 for thumbs up
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(caption_id, user_id) -- Each User can vote once per caption
);

-- ============================================================
-- INSERT SAMPLE DATA (for testing)
-- ============================================================

-- Insert sample images
INSERT INTO images (id, url, image_description, created_by_user_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'https://picsum.photos/400/300?random=1', 'A person looking confused at a computer screen', NULL),
('550e8401-e29b-41d4-a716-446655440001', 'https://picsum.photos/400/300?random=2', 'Two people having an animated conversation', NULL),
('550e8402-e29b-41d4-a716-446655440002', 'https://picsum.photos/400/300?random=3', 'A cat sitting on a keyboard looking unimpressed', NULL),
('550e8403-e29b-41d4-a716-446655440003', 'https://picsum.photos/400/300?random=4', 'Someone dramatically falling off a chair', NULL),
('550e8404-e29b-41d4-a716-446655440004', 'https://picsum.photos/400/300?random=5', 'A dog wearing sunglasses looking cool', NULL);

-- Insert sample captions
INSERT INTO captions (id, caption_text, image_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'When you realize the deadline is tomorrow and you haven''t started Yet', '550e8400-e29b-41d4-a716-446655440000'),
('550e8401-e29b-41d4-a716-446655440001', 'Me explaining my side project: "It''s basically Twitter but with more characters"', '550e8401-e29b-41d4-a716-446655440001'),
('550e8402-e29b-41d4-a716-446655440002', 'That moment when your code works on the first try', '550e8402-e29b-41d4-a716-446655440002'),
('550e8403-e29b-41d4-a716-446655440003', 'My face when I see "undefined is not a function" in the console', '550e8403-e29b-41d4-a716-446655440003'),
('550e8404-e29b-41d4-a716-446655440004', 'That awkward moment when you accidentally push to main instead of a branch', '550e8404-e29b-41d4-a716-446655440004');

-- Insert sample study
INSERT INTO studies (id, name, description, start_time, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'AI Caption Humor Study', 'A study to evaluate humor in AI-generated image captions', NOW(), true);

-- Link captions to study
INSERT INTO study_caption_mappings (study_id, caption_id) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440000', '550e8401-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440000', '550e8402-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440000', '550e8403-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440000', '550e8404-e29b-41d4-a716-446655440004');

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_captions_image_id ON captions(image_id);
CREATE INDEX IF NOT EXISTS idx_studies_start_time ON studies(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_study_mappings_study_id ON study_caption_mappings(study_id);
CREATE INDEX IF NOT EXISTS idx_caption_votes_caption_id ON caption_votes(caption_id);
CREATE INDEX IF NOT EXISTS idx_caption_votes_user_id ON caption_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_caption_votes_study_id ON caption_votes(study_id);
