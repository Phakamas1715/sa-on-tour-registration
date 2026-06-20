CREATE POLICY "Authenticated users can delete tour programs"
ON public.tour_programs
FOR DELETE
TO authenticated
USING (true);