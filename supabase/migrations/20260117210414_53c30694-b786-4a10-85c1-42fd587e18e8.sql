-- Fix orders table: Make user_id NOT NULL to prevent anonymous order insertion
-- First, delete any existing orders with NULL user_id (if any)
DELETE FROM public.orders WHERE user_id IS NULL;

-- Then alter the column to be NOT NULL
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;