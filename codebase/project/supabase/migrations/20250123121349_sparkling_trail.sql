/*
  # Orders and Items Schema

  1. New Tables
    - `orders` table for storing order information
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `total` (decimal)
      - `status` (enum: pending, confirmed, cancelled, delivered)
      - `order_date` (timestamptz)
      - `category` (enum: marketplace, hatchery)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `order_items` table for storing order line items
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `name` (text)
      - `quantity` (integer)
      - `price` (decimal)
      - `category` (enum: product, chick)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to view their own orders
    - Add policies for admins to manage all orders
*/

-- Create enum types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'cancelled', 'delivered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_category AS ENUM ('marketplace', 'hatchery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_category AS ENUM ('product', 'chick');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  total decimal NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  order_date timestamptz NOT NULL DEFAULT now(),
  category order_category NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price decimal NOT NULL CHECK (price >= 0),
  category item_category NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_name = (
      SELECT COALESCE(raw_user_meta_data->>'full_name', email)
      FROM auth.users
      WHERE auth.uid() = id
    )
  );

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_name = (
      SELECT COALESCE(raw_user_meta_data->>'full_name', email)
      FROM auth.users
      WHERE auth.uid() = id
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

-- Create policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id 
      FROM orders
      WHERE customer_name = (
        SELECT COALESCE(raw_user_meta_data->>'full_name', email)
        FROM auth.users
        WHERE auth.uid() = id
      )
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id 
      FROM orders
      WHERE customer_name = (
        SELECT COALESCE(raw_user_meta_data->>'full_name', email)
        FROM auth.users
        WHERE auth.uid() = id
      )
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();