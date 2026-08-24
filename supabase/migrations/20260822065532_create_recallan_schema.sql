/*
# Recallan — courses, enrollments, and live activity

1. New Tables
- `courses`: the life-skills lessons shown on the dashboard. Each belongs to one
  of four subject categories (consumer-rights, digital-literacy, fintech, mental-health).
  - id (uuid pk)
  - title (text)
  - slug (text, unique)
  - category (text) — one of the four subject keys
  - description (text)
  - image_url (text) — hero image for the subject card
  - estimated_minutes (int)
  - created_at (timestamptz)
- `enrollments`: a user's progress on a course. Drives "recently accessed",
  completion percentage, and the streak.
  - id (uuid pk)
  - user_id (uuid, defaults to auth.uid(), fk -> auth.users)
  - course_id (uuid, fk -> courses)
  - progress (int 0..100, default 0)
  - last_accessed_at (timestamptz, default now())
  - completed_at (timestamptz, nullable — set when progress reaches 100)
  - created_at (timestamptz)
  - unique (user_id, course_id)
- `activity_events`: lightweight log used for the "live learners" count.
  Each row is a heartbeat that a user is engaging with a course right now.
  - id (uuid pk)
  - user_id (uuid, defaults to auth.uid(), fk -> auth.users)
  - course_id (uuid, fk -> courses)
  - created_at (timestamptz, default now())

2. Security
- RLS enabled on all three tables.
- `courses` are readable by anon + authenticated (catalog is public).
  Writes restricted to authenticated owners-of-content (authenticated, since
  this is a learning platform where users progress through seeded content, we
  keep course creation open to authenticated users).
- `enrollments` and `activity_events` are owner-scoped: authenticated users
  only see and modify their own rows. `user_id` defaults to auth.uid() so
  inserts from the client that omit user_id still satisfy WITH CHECK.

3. Seed data
- Inserts the four subject categories as courses plus a handful of lessons per
  category so "recently accessed" has realistic content.
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  estimated_minutes int NOT NULL DEFAULT 15,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_select_public" ON courses;
CREATE POLICY "courses_select_public"
ON courses FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "courses_insert_authenticated" ON courses;
CREATE POLICY "courses_insert_authenticated"
ON courses FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "courses_update_authenticated" ON courses;
CREATE POLICY "courses_update_authenticated"
ON courses FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress int NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enrollments_select_own" ON enrollments;
CREATE POLICY "enrollments_select_own"
ON enrollments FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_insert_own" ON enrollments;
CREATE POLICY "enrollments_insert_own"
ON enrollments FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_update_own" ON enrollments;
CREATE POLICY "enrollments_update_own"
ON enrollments FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "enrollments_delete_own" ON enrollments;
CREATE POLICY "enrollments_delete_own"
ON enrollments FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_select_own" ON activity_events;
CREATE POLICY "activity_select_own"
ON activity_events FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "activity_insert_own" ON activity_events;
CREATE POLICY "activity_insert_own"
ON activity_events FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "activity_delete_own" ON activity_events;
CREATE POLICY "activity_delete_own"
ON activity_events FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_last_accessed ON enrollments(last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- Seed the four flagship subjects as courses (used by the subject cards)
INSERT INTO courses (title, slug, category, description, image_url, estimated_minutes)
VALUES
  ('Consumer Rights & Awareness', 'consumer-rights', 'consumer-rights',
   'Understand warranties, returns, and how to spot unfair trade practices.',
   'https://images.pexels.com/photos/30342236/pexels-photo-30342236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 40),
  ('Digital Literacy', 'digital-literacy', 'digital-literacy',
   'Navigate the web safely, spot misinformation, and protect your data online.',
   'https://images.pexels.com/photos/9052131/pexels-photo-9052131.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 35),
  ('Fintech', 'fintech', 'fintech',
   'From UPI to crypto wallets — master the tools moving money today.',
   'https://images.pexels.com/photos/6771178/pexels-photo-6771178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 45),
  ('Mental Health', 'mental-health', 'mental-health',
   'Practical strategies for stress, sleep, and emotional resilience.',
   'https://images.pexels.com/photos/6496095/pexels-photo-6496095.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 30)
ON CONFLICT (slug) DO NOTHING;

-- Seed a few lessons per category so "recently accessed" has content
INSERT INTO courses (title, slug, category, description, image_url, estimated_minutes)
VALUES
  ('Reading a Receipt', 'reading-a-receipt', 'consumer-rights',
   'Decode every line item and know when a charge is unfair.',
   'https://images.pexels.com/photos/7772167/pexels-photo-7772167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 12),
  ('Filing a Consumer Complaint', 'filing-a-complaint', 'consumer-rights',
   'Step-by-step guide to raising a complaint and getting resolution.',
   'https://images.pexels.com/photos/36697646/pexels-photo-36697646.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 18),
  ('Spotting Phishing', 'spotting-phishing', 'digital-literacy',
   'Learn the red flags that expose a scam email or text.',
   'https://images.pexels.com/photos/7054524/pexels-photo-7054524.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 10),
  ('Password Hygiene', 'password-hygiene', 'digital-literacy',
   'Build passwords and habits that actually keep accounts safe.',
   'https://images.pexels.com/photos/7545179/pexels-photo-7545179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 14),
  ('UPI & Wallets 101', 'upi-wallets-101', 'fintech',
   'Send and receive money instantly without the fees.',
   'https://images.pexels.com/photos/5980876/pexels-photo-5980876.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 16),
  ('Understanding Credit Scores', 'credit-scores', 'fintech',
   'What your score means and how to improve it over time.',
   'https://images.pexels.com/photos/7267602/pexels-photo-7267602.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20),
  ('Breathing for Calm', 'breathing-for-calm', 'mental-health',
   'A 5-minute technique to dial down anxiety anywhere.',
   'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 8),
  ('Sleep Better Tonight', 'sleep-better', 'mental-health',
   'Small evening changes that lead to deeper rest.',
   'https://images.pexels.com/photos/6648583/pexels-photo-6648583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15)
ON CONFLICT (slug) DO NOTHING;
