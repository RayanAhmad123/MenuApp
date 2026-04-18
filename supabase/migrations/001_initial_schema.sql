-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- RESTAURANTS
-- =============================================
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  address TEXT,
  stripe_account_id TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- STAFF
-- =============================================
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'kitchen', 'waiter')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, email)
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MENU ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_vegetarian BOOLEAN NOT NULL DEFAULT false,
  is_vegan BOOLEAN NOT NULL DEFAULT false,
  is_gluten_free BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ALLERGENS
-- =============================================
CREATE TABLE IF NOT EXISTS allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  UNIQUE(restaurant_id, name)
);

CREATE TABLE IF NOT EXISTS item_allergens (
  item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, allergen_id)
);

-- =============================================
-- MODIFIERS
-- =============================================
CREATE TABLE IF NOT EXISTS modifier_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT false,
  allow_multiple BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_adjustment_cents INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS item_modifier_groups (
  item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, modifier_group_id)
);

-- =============================================
-- ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  session_id TEXT NOT NULL,
  total_cents INT NOT NULL CHECK (total_cents >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  stripe_payment_intent_id TEXT,
  special_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  item_price_cents INT NOT NULL CHECK (item_price_cents >= 0),
  special_requests TEXT,
  item_status TEXT NOT NULL DEFAULT 'pending' CHECK (item_status IN ('pending', 'preparing', 'ready'))
);

CREATE TABLE IF NOT EXISTS order_item_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  modifier_id UUID NOT NULL REFERENCES modifiers(id),
  price_adjustment_cents INT NOT NULL DEFAULT 0
);

-- =============================================
-- TABLE PINGS
-- =============================================
CREATE TABLE IF NOT EXISTS table_pings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  table_number INT NOT NULL,
  ping_type TEXT NOT NULL CHECK (ping_type IN ('assistance', 'payment', 'refill')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- QR CODES
-- =============================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  qr_code_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, table_number)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_staff_restaurant ON staff(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON categories(restaurant_id, display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_table_pings_restaurant ON table_pings(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_qr_codes_restaurant ON qr_codes(restaurant_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's restaurant_id
CREATE OR REPLACE FUNCTION get_my_restaurant_id()
RETURNS UUID AS $$
  SELECT restaurant_id FROM staff WHERE email = auth.jwt() ->> 'email' AND is_active = true LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM staff WHERE email = auth.jwt() ->> 'email' AND is_active = true LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =============================================
-- RESTAURANTS POLICIES
-- =============================================
CREATE POLICY "Anyone can view active restaurants"
  ON restaurants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Staff can view their own restaurant"
  ON restaurants FOR SELECT
  USING (id = get_my_restaurant_id());

CREATE POLICY "Admin can update their restaurant"
  ON restaurants FOR UPDATE
  USING (id = get_my_restaurant_id() AND get_my_role() = 'admin');

-- =============================================
-- STAFF POLICIES
-- =============================================
CREATE POLICY "Staff can view their restaurant's staff"
  ON staff FOR SELECT
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "Admin can insert staff"
  ON staff FOR INSERT
  WITH CHECK (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

CREATE POLICY "Admin can update staff"
  ON staff FOR UPDATE
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

-- =============================================
-- CATEGORIES POLICIES
-- =============================================
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

-- =============================================
-- MENU ITEMS POLICIES
-- =============================================
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "Staff can view all menu items for their restaurant"
  ON menu_items FOR SELECT
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "Admin can manage menu items"
  ON menu_items FOR ALL
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

-- =============================================
-- ALLERGENS POLICIES
-- =============================================
CREATE POLICY "Anyone can view allergens"
  ON allergens FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage allergens"
  ON allergens FOR ALL
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

CREATE POLICY "Anyone can view item allergens"
  ON item_allergens FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage item allergens"
  ON item_allergens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM menu_items mi
      WHERE mi.id = item_allergens.item_id
      AND mi.restaurant_id = get_my_restaurant_id()
      AND get_my_role() = 'admin'
    )
  );

-- =============================================
-- MODIFIER POLICIES
-- =============================================
CREATE POLICY "Anyone can view modifier groups"
  ON modifier_groups FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage modifier groups"
  ON modifier_groups FOR ALL
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

CREATE POLICY "Anyone can view modifiers"
  ON modifiers FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage modifiers"
  ON modifiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM modifier_groups mg
      WHERE mg.id = modifiers.modifier_group_id
      AND mg.restaurant_id = get_my_restaurant_id()
      AND get_my_role() = 'admin'
    )
  );

CREATE POLICY "Anyone can view item modifier groups"
  ON item_modifier_groups FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage item modifier groups"
  ON item_modifier_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM menu_items mi
      WHERE mi.id = item_modifier_groups.item_id
      AND mi.restaurant_id = get_my_restaurant_id()
      AND get_my_role() = 'admin'
    )
  );

-- =============================================
-- ORDERS POLICIES
-- =============================================
-- Customers can insert orders (anonymous)
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Anyone with the order UUID can view it (UUIDs are unguessable)
CREATE POLICY "Anyone can view order by id"
  ON orders FOR SELECT
  USING (true);

-- Staff can view their restaurant's orders
CREATE POLICY "Staff can view restaurant orders"
  ON orders FOR SELECT
  USING (restaurant_id = get_my_restaurant_id());

-- Staff can update order status
CREATE POLICY "Staff can update order status"
  ON orders FOR UPDATE
  USING (restaurant_id = get_my_restaurant_id());

-- =============================================
-- ORDER ITEMS POLICIES
-- =============================================
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Staff can update order items"
  ON order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND o.restaurant_id = get_my_restaurant_id()
    )
  );

-- =============================================
-- ORDER ITEM MODIFIERS POLICIES
-- =============================================
CREATE POLICY "Anyone can insert order item modifiers"
  ON order_item_modifiers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order item modifiers"
  ON order_item_modifiers FOR SELECT
  USING (true);

-- =============================================
-- TABLE PINGS POLICIES
-- =============================================
CREATE POLICY "Anyone can insert table pings"
  ON table_pings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view their restaurant's pings"
  ON table_pings FOR SELECT
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "Staff can update ping status"
  ON table_pings FOR UPDATE
  USING (restaurant_id = get_my_restaurant_id());

-- =============================================
-- QR CODES POLICIES
-- =============================================
CREATE POLICY "Anyone can view active QR codes"
  ON qr_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage QR codes"
  ON qr_codes FOR ALL
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'admin');

-- =============================================
-- REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders, order_items, table_pings;
