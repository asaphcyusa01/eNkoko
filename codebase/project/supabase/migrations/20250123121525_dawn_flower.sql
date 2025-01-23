/*
  # Courses Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `thumbnail` (text)
      - `duration` (text)
      - `level` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `type` (enum: video, reading)
      - `content` (text)
      - `duration` (text)
      - `order` (integer)
      - `created_at` (timestamptz)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `module_id` (uuid, foreign key)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public course viewing
    - Add policies for admin course management
    - Add policies for user progress tracking
*/

-- Create module type enum
DO $$ BEGIN
    CREATE TYPE module_type AS ENUM ('video', 'reading');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail text NOT NULL,
  duration text NOT NULL,
  level text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  type module_type NOT NULL,
  content text NOT NULL,
  duration text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, "order")
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Allow public viewing of courses"
  ON courses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated viewing of courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin management of courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Modules policies
CREATE POLICY "Allow public viewing of modules"
  ON modules
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated viewing of modules"
  ON modules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin management of modules"
  ON modules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- User progress policies
CREATE POLICY "Allow users to view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger to courses
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();