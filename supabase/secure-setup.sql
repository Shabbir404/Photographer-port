-- =============================================================================
-- SECURE SETUP for a NEW Supabase project (run in SQL Editor)
-- Prerequisite: Authentication → disable public sign-ups; create ONE admin user.
-- Writes are allowed for any authenticated user (only your admin can sign in).
-- =============================================================================

-- Table (use "projects" to match this app; skip if you already created it)
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Remove insecure policies (from old README or experiments)
DROP POLICY IF EXISTS "Public can read works" ON projects;
DROP POLICY IF EXISTS "Allow insert" ON projects;
DROP POLICY IF EXISTS "Allow delete" ON projects;
DROP POLICY IF EXISTS "Allow update" ON projects;
DROP POLICY IF EXISTS "Public read" ON projects;
DROP POLICY IF EXISTS "admin_insert" ON projects;
DROP POLICY IF EXISTS "admin_delete" ON projects;
DROP POLICY IF EXISTS "public_select" ON projects;

-- Public gallery: read only
CREATE POLICY "public_select"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only signed-in users (your single admin if sign-ups are disabled)
CREATE POLICY "admin_insert"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "admin_delete"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- =============================================================================
-- Storage bucket "works" — public read, admin-only write/delete
-- Create the bucket in Dashboard → Storage first (public bucket).
-- =============================================================================

DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete" ON storage.objects;
DROP POLICY IF EXISTS "public_read_works" ON storage.objects;
DROP POLICY IF EXISTS "admin_upload_works" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_works" ON storage.objects;

CREATE POLICY "public_read_works"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'works');

CREATE POLICY "admin_upload_works"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'works');

CREATE POLICY "admin_delete_works"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'works');
