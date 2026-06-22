-- Migration 009: per-table QR scan tracking
--
-- Records one row each time a guest opens a table's menu (deduped client-side
-- to once per browsing session per table). Mirrors the table_pings event-table
-- pattern: anyone may insert (guests are anonymous), only staff of the
-- restaurant may read.

BEGIN;

CREATE TABLE IF NOT EXISTS qr_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  session_id TEXT,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_scans_restaurant_table ON qr_scans(restaurant_id, table_number);
CREATE INDEX IF NOT EXISTS idx_qr_scans_restaurant_time ON qr_scans(restaurant_id, scanned_at DESC);

ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Guests are anonymous; the insert is performed by an anon server action.
CREATE POLICY "Anyone can insert qr scans"
  ON qr_scans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view their restaurants' scans"
  ON qr_scans FOR SELECT
  USING (user_can_access_restaurant(restaurant_id));

COMMIT;
