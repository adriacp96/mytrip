-- Add split tracking to expenses table
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS split_type TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS split_with JSONB;

-- Update existing expenses to have split_type = 'all'
UPDATE expenses 
SET split_type = 'all' 
WHERE split_type IS NULL;
