
-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cv-uploads', 'cv-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow anyone to upload CVs
CREATE POLICY "Anyone can upload CVs" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'cv-uploads');

-- Create policy to allow system to read CVs
CREATE POLICY "System can read CV files" ON storage.objects 
FOR SELECT USING (bucket_id = 'cv-uploads');

-- Create policy to allow system to delete old CVs
CREATE POLICY "System can delete CV files" ON storage.objects 
FOR DELETE USING (bucket_id = 'cv-uploads');
