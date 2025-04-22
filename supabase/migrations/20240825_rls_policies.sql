-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS public.images ENABLE ROW LEVEL SECURITY;

-- Create necessary policies for the images table
-- Allow users to view their own uploads
CREATE POLICY IF NOT EXISTS "Users can view their own images" 
ON public.images
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own images
CREATE POLICY IF NOT EXISTS "Users can upload their own images" 
ON public.images
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own images
CREATE POLICY IF NOT EXISTS "Users can update their own images" 
ON public.images
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own images
CREATE POLICY IF NOT EXISTS "Users can delete their own images" 
ON public.images
FOR DELETE 
USING (auth.uid() = user_id);

-- Create audit_logs table for security tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  resource_type TEXT,
  resource_id TEXT
);

-- Enable RLS on audit_logs
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from server-side
CREATE POLICY IF NOT EXISTS "Enable insert for service role" 
ON public.audit_logs
FOR INSERT
TO service_role;

-- Allow users to view their own logs
CREATE POLICY IF NOT EXISTS "Users can view their own audit logs" 
ON public.audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Create table for CSP violation reports
CREATE TABLE IF NOT EXISTS public.csp_violation_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report JSONB NOT NULL,
  user_agent TEXT,
  source_ip TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on csp_violation_reports
ALTER TABLE IF EXISTS public.csp_violation_reports ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert CSP reports
CREATE POLICY IF NOT EXISTS "Allow service role to insert CSP reports" 
ON public.csp_violation_reports 
FOR INSERT 
TO service_role; 