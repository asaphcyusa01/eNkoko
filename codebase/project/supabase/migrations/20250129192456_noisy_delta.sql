/*
  # Fix Admin Dashboard Permissions

  1. Changes
    - Add policies for admin access to auth.users
    - Update order policies to properly check admin role
    - Fix permission issues with order statistics
*/

-- Enable admin access to auth.users table
CREATE POLICY "Enable admin access to users"
ON auth.users
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Update order policies to use JWT claims
DROP POLICY IF EXISTS "admin_access_orders" ON orders;
DROP POLICY IF EXISTS "admin_access_order_items" ON order_items;

CREATE POLICY "admin_access_orders"
ON orders
FOR ALL 
TO authenticated
USING (
  CASE 
    WHEN auth.jwt() ->> 'role' = 'admin' THEN true
    ELSE customer_name = auth.jwt() ->> 'email'
  END
);

CREATE POLICY "admin_access_order_items"
ON order_items
FOR ALL
TO authenticated
USING (
  CASE
    WHEN auth.jwt() ->> 'role' = 'admin' THEN true
    ELSE order_id IN (
      SELECT id FROM orders 
      WHERE customer_name = auth.jwt() ->> 'email'
    )
  END
);

-- Create helper function for admin checks
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (auth.jwt() ->> 'role') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;