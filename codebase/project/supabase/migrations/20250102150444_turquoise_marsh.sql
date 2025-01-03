/*
  # Database Schema Setup

  1. Tables
    - courses: E-learning course content
    - products: Marketplace items
    - breeds: Hatchery breeds
  
  2. Security
    - Row Level Security (RLS) enabled
    - Admin-only access policies
*/

DO $$ 
BEGIN
  -- Courses table
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'courses') THEN
    CREATE TABLE courses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      thumbnail text NOT NULL,
      duration text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow admin full access to courses"
      ON courses
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;

  -- Products table
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    CREATE TABLE products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text NOT NULL,
      price decimal NOT NULL,
      category text NOT NULL,
      image text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow admin full access to products"
      ON products
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;

  -- Breeds table
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'breeds') THEN
    CREATE TABLE breeds (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text NOT NULL,
      price decimal NOT NULL,
      image text NOT NULL,
      availability boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow admin full access to breeds"
      ON breeds
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;