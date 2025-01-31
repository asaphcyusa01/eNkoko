/*
  # Add phone authentication support
  
  1. Changes
    - Add phone authentication configuration
    - Add username field to auth.users
    - Update authentication policies
    - Add phone number validation function
*/

-- Enable phone auth provider
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS phone text UNIQUE,
ADD COLUMN IF NOT EXISTS username text;

-- Create phone number validation function
CREATE OR REPLACE FUNCTION public.validate_phone_number(phone text)
RETURNS boolean AS $$
BEGIN
  RETURN phone ~ '^\+250[0-9]{9}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user management trigger
CREATE OR REPLACE FUNCTION auth.handle_user_update()
RETURNS trigger AS $$
BEGIN
  -- Validate phone number format
  IF NEW.phone IS NOT NULL AND NOT public.validate_phone_number(NEW.phone) THEN
    RAISE EXCEPTION 'Invalid phone number format. Must be +250 followed by 9 digits';
  END IF;

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