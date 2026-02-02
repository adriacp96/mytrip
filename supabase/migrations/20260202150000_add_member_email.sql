-- Add email column to trip_members to cache user emails
ALTER TABLE trip_members ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing records with current user emails
UPDATE trip_members tm
SET email = u.email
FROM auth.users u
WHERE tm.user_id = u.id AND tm.email IS NULL;
