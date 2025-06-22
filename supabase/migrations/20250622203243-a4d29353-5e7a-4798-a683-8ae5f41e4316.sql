
-- Add analysis_results column to store CV analysis data
ALTER TABLE consultants ADD COLUMN analysis_results JSONB;

-- Add self_description column for personal description
ALTER TABLE consultants ADD COLUMN self_description TEXT;
