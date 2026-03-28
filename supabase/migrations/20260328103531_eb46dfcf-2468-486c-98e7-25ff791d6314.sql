-- Create visit_requests table
CREATE TABLE public.visit_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  method TEXT NOT NULL,
  prayer TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit visit requests"
ON public.visit_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users (admin) can view
CREATE POLICY "Authenticated users can view visit requests"
ON public.visit_requests
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users (admin) can delete
CREATE POLICY "Authenticated users can delete visit requests"
ON public.visit_requests
FOR DELETE
TO authenticated
USING (true);