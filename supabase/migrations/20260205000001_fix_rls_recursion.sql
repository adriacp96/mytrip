-- Fix RLS policies to avoid infinite recursion between trips and trip_members

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "trips_select" ON trips;
DROP POLICY IF EXISTS "trips_insert" ON trips;
DROP POLICY IF EXISTS "trips_update" ON trips;
DROP POLICY IF EXISTS "trips_delete" ON trips;

-- Create a SECURITY DEFINER function to check trip membership
-- This bypasses RLS and prevents recursion
CREATE OR REPLACE FUNCTION is_trip_member(trip_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM trip_members
    WHERE trip_id = trip_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate trips policies using the function (no direct trip_members reference in policy)
CREATE POLICY "trips_select" ON trips FOR SELECT USING (
  is_trip_member(id, auth.uid())
);

CREATE POLICY "trips_insert" ON trips FOR INSERT WITH CHECK (
  owner_id = auth.uid()
);

CREATE POLICY "trips_update" ON trips FOR UPDATE USING (
  is_trip_member(id, auth.uid())
);

CREATE POLICY "trips_delete" ON trips FOR DELETE USING (
  owner_id = auth.uid()
);
