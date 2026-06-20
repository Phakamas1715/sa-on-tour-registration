-- Create enums for organization types and lead statuses
CREATE TYPE public.org_type AS ENUM ('government', 'corporate', 'education', 'association', 'other');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'proposal_sent', 'negotiating', 'won', 'lost');
CREATE TYPE public.tour_status AS ENUM ('draft', 'active', 'archived');

-- Tour programs table (admin-managed)
CREATE TABLE public.tour_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  airline TEXT,
  price_per_person DECIMAL(10,2),
  highlights TEXT[],
  included TEXT[],
  excluded TEXT[],
  itinerary JSONB,
  image_url TEXT,
  status tour_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Leads / Quote requests
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT NOT NULL,
  contact_line_id TEXT,
  org_name TEXT NOT NULL,
  org_type org_type NOT NULL DEFAULT 'other',
  destination TEXT NOT NULL,
  travel_date_start DATE,
  travel_date_end DATE,
  num_travelers INTEGER NOT NULL DEFAULT 20,
  budget_per_person DECIMAL(10,2),
  study_objectives TEXT,
  study_topics TEXT[],
  preferred_visits TEXT,
  accommodation_level TEXT,
  meal_preference TEXT,
  transport_preference TEXT,
  special_requests TEXT,
  ai_generated_program JSONB,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quotations linked to leads
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  tour_program_id UUID REFERENCES public.tour_programs(id),
  quotation_number TEXT NOT NULL UNIQUE,
  price_per_person DECIMAL(10,2) NOT NULL,
  num_travelers INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  custom_itinerary JSONB,
  valid_until DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tour_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Public read for active tour programs
CREATE POLICY "Anyone can view active tour programs"
  ON public.tour_programs FOR SELECT
  USING (status = 'active');

-- Leads: allow public insert (quote request form)
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true);

-- Quotations: authenticated only
CREATE POLICY "Authenticated users can manage quotations"
  ON public.quotations FOR ALL
  TO authenticated
  USING (true);

-- Tour programs: authenticated can manage all
CREATE POLICY "Authenticated users can manage tour programs"
  ON public.tour_programs FOR ALL
  TO authenticated
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tour_programs_updated_at
  BEFORE UPDATE ON public.tour_programs FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();