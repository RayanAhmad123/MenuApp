-- Restore SELECT access to order_items for restaurant staff.
--
-- The original 001 migration declared an "Anyone can view order items"
-- policy with USING (true), but that was removed in production (it leaked
-- every restaurant's order data to anyone with the anon key).
--
-- Without a replacement, even authenticated staff can't read order_items,
-- which breaks the analytics dashboard (best sellers, category breakdown,
-- menu engineering matrix all return empty). Customers can still INSERT
-- order_items at checkout because "Anyone can insert order items" remains.
--
-- This policy mirrors "Staff can view restaurant orders" — staff of a
-- given restaurant can SELECT order_items whose parent order belongs to
-- that restaurant.

CREATE POLICY "Staff can view their restaurant's order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND o.restaurant_id = get_my_restaurant_id()
    )
  );

-- Same problem exists for order_item_modifiers — staff can't read modifiers
-- on their own orders. Add the equivalent SELECT policy so the order detail
-- and analytics views can show modifier choices.
CREATE POLICY "Staff can view their restaurant's order item modifiers"
  ON order_item_modifiers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.id = order_item_modifiers.order_item_id
        AND o.restaurant_id = get_my_restaurant_id()
    )
  );
