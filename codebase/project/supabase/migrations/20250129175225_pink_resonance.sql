/*
  # Fix courses and orders tables

  1. Changes
    - Add level column to courses table
    - Fix permissions for orders table

  2. Security
    - Update RLS policies for orders table to use raw_user_meta_data
*/

-- Add level column to courses table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'level'
  ) THEN
    ALTER TABLE courses ADD COLUMN level text NOT NULL DEFAULT 'Ibanze';
  END IF;
END $$;

-- Update orders policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_name = current_user
    OR EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_name = current_user
    OR EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON orders
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