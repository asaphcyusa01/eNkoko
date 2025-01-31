/*
  # Fix Admin Dashboard Permissions V2

  1. Changes
    - Create secure admin access function
    - Add policies for admin access to all required tables
    - Fix cross-schema permission issues
    - Update order statistics access
*/

-- Create admin check function in public schema for better accessibility
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN coalesce(current_setting('request.jwt.claims', true)::json->>'role', '') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on required tables
ALTER TABLE IF EXISTS auth.users FORCE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Enable admin access to users" ON auth.users;
DROP POLICY IF EXISTS "admin_access_orders" ON orders;
DROP POLICY IF EXISTS "admin_access_order_items" ON order_items;

-- Create new admin policies with proper schema handling
CREATE POLICY "admin_select_users"
ON auth.users
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "admin_orders"
ON orders
FOR ALL 
TO authenticated
USING (
  CASE 
    WHEN public.is_admin() THEN true
    ELSE customer_name = auth.jwt() ->> 'email'
  END
);

CREATE POLICY "admin_order_items"
ON order_items
FOR ALL
TO authenticated
USING (
  CASE
    WHEN public.is_admin() THEN true
    ELSE order_id IN (
      SELECT id FROM orders 
      WHERE customer_name = auth.jwt() ->> 'email'
    )
  END
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT SELECT ON orders TO authenticated;
GRANT SELECT ON order_items TO authenticated;

-- Ensure proper function execution permissions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Add index to improve order queries performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_order_items_category ON order_items(category);