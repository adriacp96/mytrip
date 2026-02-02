-- Create trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create trip_members table
CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT DEFAULT 'editor',
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- Create itinerary_items table
CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_date DATE,
  title TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  category TEXT DEFAULT 'activity',
  updated_by UUID NOT NULL REFERENCES auth.users(id),
  updated_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  category TEXT DEFAULT 'general',
  paid_by UUID NOT NULL REFERENCES auth.users(id),
  expense_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create expense_splits table
CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  share_amount DECIMAL(10, 2) NOT NULL,
  settled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(expense_id, user_id)
);

-- Create packing_lists table
CREATE TABLE packing_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create packing_items table
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES packing_lists(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  packed BOOLEAN DEFAULT false,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Create activity_log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips
CREATE POLICY "trips_select" ON trips FOR SELECT USING (
  owner_id = auth.uid() OR id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "trips_insert" ON trips FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "trips_update" ON trips FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "trips_delete" ON trips FOR DELETE USING (owner_id = auth.uid());

-- RLS Policies for trip_members
CREATE POLICY "trip_members_select" ON trip_members FOR SELECT USING (
  user_id = auth.uid() OR trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "trip_members_insert" ON trip_members FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "trip_members_delete" ON trip_members FOR DELETE USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid() AND role = 'owner')
);

-- RLS Policies for itinerary_items
CREATE POLICY "itinerary_select" ON itinerary_items FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "itinerary_insert" ON itinerary_items FOR INSERT WITH CHECK (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "itinerary_update" ON itinerary_items FOR UPDATE USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "itinerary_delete" ON itinerary_items FOR DELETE USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);

-- RLS Policies for expenses
CREATE POLICY "expenses_select" ON expenses FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "expenses_insert" ON expenses FOR INSERT WITH CHECK (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "expenses_update" ON expenses FOR UPDATE USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "expenses_delete" ON expenses FOR DELETE USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);

-- RLS Policies for expense_splits
CREATE POLICY "expense_splits_select" ON expense_splits FOR SELECT USING (
  expense_id IN (
    SELECT id FROM expenses WHERE trip_id IN (
      SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    )
  )
);
CREATE POLICY "expense_splits_insert" ON expense_splits FOR INSERT WITH CHECK (
  expense_id IN (
    SELECT id FROM expenses WHERE trip_id IN (
      SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    )
  )
);

-- RLS Policies for packing lists
CREATE POLICY "packing_lists_select" ON packing_lists FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "packing_lists_insert" ON packing_lists FOR INSERT WITH CHECK (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);

-- RLS Policies for packing items
CREATE POLICY "packing_items_select" ON packing_items FOR SELECT USING (
  list_id IN (
    SELECT id FROM packing_lists WHERE trip_id IN (
      SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    )
  )
);
CREATE POLICY "packing_items_insert" ON packing_items FOR INSERT WITH CHECK (
  list_id IN (
    SELECT id FROM packing_lists WHERE trip_id IN (
      SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    )
  )
);
CREATE POLICY "packing_items_update" ON packing_items FOR UPDATE USING (
  list_id IN (
    SELECT id FROM packing_lists WHERE trip_id IN (
      SELECT trip_id FROM trip_members WHERE user_id = auth.uid()
    )
  )
);

-- RLS Policies for activity log
CREATE POLICY "activity_log_select" ON activity_log FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);
CREATE POLICY "activity_log_insert" ON activity_log FOR INSERT WITH CHECK (
  trip_id IN (SELECT trip_id FROM trip_members WHERE user_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON trip_members(user_id);
CREATE INDEX idx_itinerary_trip_id ON itinerary_items(trip_id);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_packing_lists_trip_id ON packing_lists(trip_id);
CREATE INDEX idx_activity_log_trip_id ON activity_log(trip_id);
