-- Add display_name column to trip_members to cache user display names
ALTER TABLE trip_members ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_trip_members_display_name ON trip_members(display_name);

-- Note: Display names should be updated when:
-- 1. User joins a trip
-- 2. User updates their display name in settings
-- 3. Periodically if needed (can be done in the app)
