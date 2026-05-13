-- Migration 007: multi-restaurant-aware RLS
--
-- The original `get_my_restaurant_id()` returned the user's restaurant_id via
-- `LIMIT 1`, which silently picked one row when an admin belongs to more than
-- one restaurant (e.g. a chain admin like kontakt@triadsolutions.se). RLS then
-- only granted access to that single arbitrarily-chosen restaurant, leaving
-- the user stuck on whichever tenant Postgres happened to return first.
--
-- This migration replaces the single-tenant model with two new helpers that
-- take a restaurant_id parameter, and rewrites every policy that used the old
-- helpers. The old functions are kept (as deprecated thin wrappers) so any
-- external code that may reference them keeps compiling.
--
-- Naming convention:
--   user_can_access_restaurant(rid) → true if active staff at <rid>
--   user_has_role_at(rid, role)     → true if active staff with <role> at <rid>

BEGIN;

-- =============================================
-- NEW HELPERS
-- =============================================
CREATE OR REPLACE FUNCTION user_can_access_restaurant(p_restaurant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff
    WHERE email = auth.jwt() ->> 'email'
      AND is_active = true
      AND restaurant_id = p_restaurant_id
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION user_has_role_at(p_restaurant_id UUID, p_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff
    WHERE email = auth.jwt() ->> 'email'
      AND is_active = true
      AND restaurant_id = p_restaurant_id
      AND role = p_role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Keep old helpers around as wrappers so any legacy consumer keeps working.
-- They are deprecated — new policies must NOT use them.
CREATE OR REPLACE FUNCTION get_my_restaurant_id()
RETURNS UUID AS $$
  SELECT restaurant_id FROM staff
  WHERE email = auth.jwt() ->> 'email' AND is_active = true
  ORDER BY created_at LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM staff
  WHERE email = auth.jwt() ->> 'email' AND is_active = true
  ORDER BY created_at LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- =============================================
-- RESTAURANTS
-- =============================================
DROP POLICY IF EXISTS "Staff can view their own restaurant" ON restaurants;
CREATE POLICY "Staff can view their restaurants"
  ON restaurants FOR SELECT
  USING (user_can_access_restaurant(id));

DROP POLICY IF EXISTS "Admin can update their restaurant" ON restaurants;
CREATE POLICY "Admin can update their restaurants"
  ON restaurants FOR UPDATE
  USING (user_has_role_at(id, 'admin'));

-- =============================================
-- STAFF
-- =============================================
DROP POLICY IF EXISTS "Staff can view their restaurant's staff" ON staff;
CREATE POLICY "Staff can view their restaurants' staff"
  ON staff FOR SELECT
  USING (user_can_access_restaurant(restaurant_id));

DROP POLICY IF EXISTS "Admin can insert staff" ON staff;
CREATE POLICY "Admin can insert staff"
  ON staff FOR INSERT
  WITH CHECK (user_has_role_at(restaurant_id, 'admin'));

DROP POLICY IF EXISTS "Admin can update staff" ON staff;
CREATE POLICY "Admin can update staff"
  ON staff FOR UPDATE
  USING (user_has_role_at(restaurant_id, 'admin'));

-- =============================================
-- CATEGORIES
-- =============================================
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (user_has_role_at(restaurant_id, 'admin'));

-- =============================================
-- MENU ITEMS
-- =============================================
DROP POLICY IF EXISTS "Staff can view all menu items for their restaurant" ON menu_items;
CREATE POLICY "Staff can view all menu items for their restaurants"
  ON menu_items FOR SELECT
  USING (user_can_access_restaurant(restaurant_id));

DROP POLICY IF EXISTS "Admin can manage menu items" ON menu_items;
CREATE POLICY "Admin can manage menu items"
  ON menu_items FOR ALL
  USING (user_has_role_at(restaurant_id, 'admin'));

-- =============================================
-- ALLERGENS
-- =============================================
DROP POLICY IF EXISTS "Admin can manage allergens" ON allergens;
CREATE POLICY "Admin can manage allergens"
  ON allergens FOR ALL
  USING (user_has_role_at(restaurant_id, 'admin'));

-- =============================================
-- ITEM ALLERGENS
-- =============================================
DROP POLICY IF EXISTS "Admin can manage item allergens" ON item_allergens;
CREATE POLICY "Admin can manage item allergens"
  ON item_allergens FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM menu_items mi
      WHERE mi.id = item_allergens.menu_item_id
        AND user_has_role_at(mi.restaurant_id, 'admin')
    )
  );

-- =============================================
-- MODIFIER GROUPS
-- =============================================
DROP POLICY IF EXISTS "Admin can manage modifier groups" ON modifier_groups;
CREATE POLICY "Admin can manage modifier groups"
  ON modifier_groups FOR ALL
  USING (user_has_role_at(restaurant_id, 'admin'));

-- =============================================
-- MODIFIERS
-- =============================================
DROP POLICY IF EXISTS "Admin can manage modifiers" ON modifiers;
CREATE POLICY "Admin can manage modifiers"
  ON modifiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM modifier_groups mg
      WHERE mg.id = modifiers.modifier_group_id
        AND user_has_role_at(mg.restaurant_id, 'admin')
    )
  );

-- =============================================
-- ITEM MODIFIER GROUPS
-- =============================================
DROP POLICY IF EXISTS "Admin can manage item modifier groups" ON item_modifier_groups;
CREATE POLICY "Admin can manage item modifier groups"
  ON item_modifier_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM menu_items mi
      WHERE mi.id = item_modifier_groups.menu_item_id
        AND user_has_role_at(mi.restaurant_id, 'admin')
    )
  );

-- =============================================
-- ORDERS
-- =============================================
DROP POLICY IF EXISTS "Staff can view restaurant orders" ON orders;
CREATE POLICY "Staff can view restaurant orders"
  ON orders FOR SELECT
  USING (user_can_access_restaurant(restaurant_id));

DROP POLICY IF EXISTS "Staff can update order status" ON orders;
CREATE POLICY "Staff can update order status"
  ON orders FOR UPDATE
  USING (user_can_access_restaurant(restaurant_id));

-- =============================================
-- ORDER ITEMS  (migration 006 added these)
-- =============================================
DROP POLICY IF EXISTS "Staff can view their restaurant's order items" ON order_items;
CREATE POLICY "Staff can view their restaurants' order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND user_can_access_restaurant(o.restaurant_id)
    )
  );

DROP POLICY IF EXISTS "Staff can update order items" ON order_items;
CREATE POLICY "Staff can update order items"
  ON order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND user_can_access_restaurant(o.restaurant_id)
    )
  );

-- =============================================
-- ORDER ITEM MODIFIERS  (migration 006 added these)
-- =============================================
DROP POLICY IF EXISTS "Staff can view their restaurant's order item modifiers" ON order_item_modifiers;
CREATE POLICY "Staff can view their restaurants' order item modifiers"
  ON order_item_modifiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.id = order_item_modifiers.order_item_id
        AND user_can_access_restaurant(o.restaurant_id)
    )
  );

-- =============================================
-- TABLE PINGS
-- =============================================
DROP POLICY IF EXISTS "Staff can view their restaurant's pings" ON table_pings;
CREATE POLICY "Staff can view their restaurants' pings"
  ON table_pings FOR SELECT
  USING (user_can_access_restaurant(restaurant_id));

DROP POLICY IF EXISTS "Staff can update ping status" ON table_pings;
CREATE POLICY "Staff can update ping status"
  ON table_pings FOR UPDATE
  USING (user_can_access_restaurant(restaurant_id));

-- =============================================
-- QR CODES
-- =============================================
DROP POLICY IF EXISTS "Admin can manage QR codes" ON qr_codes;
CREATE POLICY "Admin can manage QR codes"
  ON qr_codes FOR ALL
  USING (user_has_role_at(restaurant_id, 'admin'));

COMMIT;
