-- Add username column to auth.users
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS username text;

-- Update user management trigger
CREATE OR REPLACE FUNCTION auth.handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Set username from metadata if not set
  IF NEW.username IS NULL AND NEW.raw_user_meta_data->>'username' IS NOT NULL THEN
    NEW.username := NEW.raw_user_meta_data->>'username';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_user_update ON auth.users;
CREATE TRIGGER on_user_update
  BEFORE UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.handle_user_update();

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_user_create ON auth.users;
CREATE TRIGGER on_user_create
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.handle_user_update();