
-- Add columns to store CV and LinkedIn analysis data
ALTER TABLE consultants 
ADD COLUMN IF NOT EXISTS cv_analysis_data JSONB,
ADD COLUMN IF NOT EXISTS linkedin_analysis_data JSONB;
