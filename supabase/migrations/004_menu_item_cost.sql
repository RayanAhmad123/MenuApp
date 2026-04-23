-- Menu engineering requires cost-per-item so margin can be computed.
-- NULL means "not yet configured" — analytics falls back to revenue-based quadrants.
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS cost_cents INT CHECK (cost_cents IS NULL OR cost_cents >= 0);
