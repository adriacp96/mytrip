-- Add order_seq column to itinerary_items table
ALTER TABLE itinerary_items ADD COLUMN IF NOT EXISTS order_seq INT DEFAULT 0;

-- Initialize order_seq for existing items
UPDATE itinerary_items
SET order_seq = 0
WHERE order_seq IS NULL;
