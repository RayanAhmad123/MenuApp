-- =============================================
-- SUPERADMINS
-- =============================================
CREATE TABLE IF NOT EXISTS superadmins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE superadmins ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is a superadmin
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM superadmins
    WHERE email = auth.jwt() ->> 'email' AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Superadmins can read/manage other superadmins
CREATE POLICY "Superadmins can view superadmins"
  ON superadmins FOR SELECT
  USING (is_superadmin());

CREATE POLICY "Superadmins can manage superadmins"
  ON superadmins FOR ALL
  USING (is_superadmin());

-- Superadmins can manage all restaurants
CREATE POLICY "Superadmins can manage all restaurants"
  ON restaurants FOR ALL
  USING (is_superadmin());

-- Superadmins can manage all staff
CREATE POLICY "Superadmins can manage all staff"
  ON staff FOR ALL
  USING (is_superadmin());

-- Index
CREATE INDEX IF NOT EXISTS idx_superadmins_email ON superadmins(email);
