-- Add user_id column to orders table (nullable initially)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the insecure public policies first
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;

-- Create secure user-specific policies
-- For INSERT: require authentication and user_id matches
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- For SELECT: require authentication and user_id matches  
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);