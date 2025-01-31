-- Add policies for admin access to all tables
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Allow admin access to user_progress" ON user_progress;
  DROP POLICY IF EXISTS "Allow admin access to order_items" ON order_items;
  DROP POLICY IF EXISTS "Allow admin access to orders" ON orders;
  DROP POLICY IF EXISTS "Allow admin access to courses" ON courses;
  DROP POLICY IF EXISTS "Allow admin access to products" ON products;

  -- Create new admin policies
  CREATE POLICY "Allow admin access to user_progress"
    ON user_progress
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

  CREATE POLICY "Allow admin access to order_items"
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

  CREATE POLICY "Allow admin access to orders"
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

  CREATE POLICY "Allow admin access to courses"
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

  CREATE POLICY "Allow admin access to products"
    ON products
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
END $$;