-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create clothes table for product catalog
CREATE TABLE public.clothes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  size TEXT[],
  color TEXT[],
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clothes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view clothes (public product catalog)
CREATE POLICY "Anyone can view clothes"
ON public.clothes
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clothes_updated_at
BEFORE UPDATE ON public.clothes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for common queries
CREATE INDEX idx_clothes_category ON public.clothes(category);
CREATE INDEX idx_clothes_created_at ON public.clothes(created_at DESC);