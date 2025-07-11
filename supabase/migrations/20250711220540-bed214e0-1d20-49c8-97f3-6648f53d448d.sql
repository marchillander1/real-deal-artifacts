-- Create storage bucket for consultant CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('consultant-cvs', 'consultant-cvs', false);

-- Create policies for the consultant-cvs bucket
CREATE POLICY "Users can upload CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'consultant-cvs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view uploaded CVs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'consultant-cvs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their CVs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'consultant-cvs' AND auth.uid() IS NOT NULL);