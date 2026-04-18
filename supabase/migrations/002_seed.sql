-- =============================================
-- SEED DATA: Hirly Demo Restaurant
-- =============================================

-- Insert demo restaurant
INSERT INTO restaurants (id, name, subdomain, address, subscription_tier, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Hirly Demo',
  'hirly',
  '12 Rue de la Paix, Paris, France',
  'pro',
  true
) ON CONFLICT (subdomain) DO NOTHING;

-- Insert demo admin staff
-- Note: the user must be created in Supabase Auth separately; this links their email
INSERT INTO staff (id, restaurant_id, email, role, first_name, last_name, is_active)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'admin@hirly.demo', 'admin', 'Alex', 'Martin', true),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'kitchen@hirly.demo', 'kitchen', 'Jamie', 'Durand', true),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'waiter@hirly.demo', 'waiter', 'Sophie', 'Leclerc', true)
ON CONFLICT (restaurant_id, email) DO NOTHING;

-- Insert categories
INSERT INTO categories (id, restaurant_id, name, display_order, is_active)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Starters', 1, true),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Mains', 2, true),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Desserts', 3, true)
ON CONFLICT DO NOTHING;

-- Insert allergens
INSERT INTO allergens (id, restaurant_id, name)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Gluten'),
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Dairy'),
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Eggs'),
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Nuts'),
  ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Shellfish'),
  ('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Soy')
ON CONFLICT (restaurant_id, name) DO NOTHING;

-- Insert menu items
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price_cents, is_available, is_vegetarian, is_vegan, is_gluten_free, display_order)
VALUES
  -- Starters
  (
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Burrata & Heirloom Tomato',
    'Creamy burrata served with a medley of heirloom tomatoes, fresh basil oil, and Maldon sea salt. A summertime classic.',
    1650,
    true, true, false, true,
    1
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Tiger Prawn Tempura',
    'Lightly battered tiger prawns fried to a golden crisp, served with a yuzu dipping sauce and micro herbs.',
    1450,
    true, false, false, false,
    2
  ),
  -- Mains
  (
    'd0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    '28-Day Aged Ribeye',
    'A 300g dry-aged ribeye, cooked to your preference, served with truffle butter, roasted garlic, and hand-cut fries.',
    3800,
    true, false, false, true,
    1
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'Wild Mushroom Risotto',
    'Arborio rice slow-cooked with a blend of wild mushrooms, aged parmesan, white wine and fresh thyme. Finished with truffle oil.',
    2200,
    true, true, false, true,
    2
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'Pan-Seared Salmon',
    'Atlantic salmon fillet with crispy skin, served over lemon-caper beurre blanc, wilted spinach, and caperberries.',
    2600,
    true, false, false, true,
    3
  ),
  -- Desserts
  (
    'd0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'Valrhona Chocolate Fondant',
    'Warm dark chocolate fondant with a molten centre, served with Tahitian vanilla ice cream and a salted caramel drizzle.',
    1200,
    true, true, false, false,
    1
  ),
  (
    'd0000000-0000-0000-0000-000000000007',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000003',
    'Seasonal Fruit Sorbet',
    'Three scoops of house-made sorbet using the season''s finest fruits. Ask your server for today''s selection.',
    900,
    true, true, true, true,
    2
  )
ON CONFLICT DO NOTHING;

-- Link allergens to items
INSERT INTO item_allergens (item_id, allergen_id)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002'), -- Burrata: Dairy
  ('d0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001'), -- Tempura: Gluten
  ('d0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000005'), -- Tempura: Shellfish
  ('d0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002'), -- Ribeye: Dairy (truffle butter)
  ('d0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000002'), -- Risotto: Dairy
  ('d0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000002'), -- Salmon: Dairy (beurre blanc)
  ('d0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001'), -- Fondant: Gluten
  ('d0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000002'), -- Fondant: Dairy
  ('d0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000003')  -- Fondant: Eggs
ON CONFLICT DO NOTHING;

-- Insert modifier group for steak
INSERT INTO modifier_groups (id, restaurant_id, name, is_required, allow_multiple)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Steak Doneness', true, false),
  ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Sauce', false, false)
ON CONFLICT DO NOTHING;

INSERT INTO modifiers (id, modifier_group_id, name, price_adjustment_cents)
VALUES
  ('g0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Rare', 0),
  ('g0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Medium Rare', 0),
  ('g0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 'Medium', 0),
  ('g0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', 'Well Done', 0),
  ('g0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000002', 'Peppercorn Sauce', 300),
  ('g0000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000002', 'Béarnaise', 300),
  ('g0000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000002', 'Chimichurri', 250)
ON CONFLICT DO NOTHING;

INSERT INTO item_modifier_groups (item_id, modifier_group_id)
VALUES
  ('d0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001'),
  ('d0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Insert QR codes for 5 tables
INSERT INTO qr_codes (restaurant_id, table_number, is_active)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 1, true),
  ('a0000000-0000-0000-0000-000000000001', 2, true),
  ('a0000000-0000-0000-0000-000000000001', 3, true),
  ('a0000000-0000-0000-0000-000000000001', 4, true),
  ('a0000000-0000-0000-0000-000000000001', 5, true)
ON CONFLICT (restaurant_id, table_number) DO NOTHING;
