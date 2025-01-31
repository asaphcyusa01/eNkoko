-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin access to user_progress" ON user_progress;
DROP POLICY IF EXISTS "Allow admin access to order_items" ON order_items;
DROP POLICY IF EXISTS "Allow admin access to orders" ON orders;
DROP POLICY IF EXISTS "Allow admin access to courses" ON courses;
DROP POLICY IF EXISTS "Allow admin access to products" ON products;

-- Create new admin policies with proper checks
CREATE POLICY "admin_access_user_progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "admin_access_order_items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "admin_access_orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "admin_access_courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "admin_access_products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add public read access for certain tables
CREATE POLICY "public_read_courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "public_read_products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);