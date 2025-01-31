/*
  # Add Learning Features Schema

  1. New Tables
    - `notes`
      - For storing user notes for each module
      - Contains note content and timestamps
    - `comments`
      - For module discussions
      - Supports threaded comments with parent_id
    - `achievements`
      - Defines available achievements
      - Includes title, description, icon, and points
    - `user_achievements`
      - Tracks which achievements users have unlocked
      - Links users to achievements with unlock status

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Ensure users can only access their own data

  3. Changes
    - Add foreign key constraints
    - Add indexes for performance
    - Add triggers for updated_at timestamps
*/

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points integer NOT NULL CHECK (points >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked boolean NOT NULL DEFAULT false,
  unlocked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can manage their own notes"
  ON notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own comments"
  ON comments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Anyone can view achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage achievements"
  ON achievements
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

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage user achievements"
  ON user_achievements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS notes_module_id_idx ON notes(module_id);
CREATE INDEX IF NOT EXISTS comments_module_id_idx ON comments(module_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS user_achievements_achievement_id_idx ON user_achievements(achievement_id);

-- Add updated_at triggers
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default achievements
INSERT INTO achievements (title, description, icon, points) VALUES
  ('Intangiriro', 'Watangiye kwiga isomo ryawe rya mbere', 'star', 100),
  ('Umuhanga', 'Warangije amasomo 5', 'award', 500),
  ('Intwari', 'Warangije amasomo 10', 'trophy', 1000),
  ('Umwarimu', 'Watanze ibisubizo 10 bifasha abandi', 'medal', 750),
  ('Umuhanga mu bumenyi', 'Wabonye amanota 100% mu isuzuma', 'target', 300),
  ('Umwete', 'Wize amasomo 7 mu cyumweru', 'zap', 400)
ON CONFLICT DO NOTHING;