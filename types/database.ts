export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          subdomain: string
          logo_url: string | null
          address: string | null
          stripe_account_id: string | null
          subscription_tier: "free" | "pro" | "enterprise"
          is_active: boolean
          payment_enabled: boolean
          yellow_threshold_minutes: number
          red_threshold_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain: string
          logo_url?: string | null
          address?: string | null
          stripe_account_id?: string | null
          subscription_tier?: "free" | "pro" | "enterprise"
          is_active?: boolean
          payment_enabled?: boolean
          yellow_threshold_minutes?: number
          red_threshold_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string
          logo_url?: string | null
          address?: string | null
          stripe_account_id?: string | null
          subscription_tier?: "free" | "pro" | "enterprise"
          is_active?: boolean
          payment_enabled?: boolean
          yellow_threshold_minutes?: number
          red_threshold_minutes?: number
          created_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          id: string
          restaurant_id: string
          email: string
          role: "admin" | "kitchen" | "waiter"
          first_name: string
          last_name: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          email: string
          role: "admin" | "kitchen" | "waiter"
          first_name: string
          last_name: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          email?: string
          role?: "admin" | "kitchen" | "waiter"
          first_name?: string
          last_name?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string
          name: string
          description: string | null
          price_cents: number
          image_url: string | null
          is_available: boolean
          is_vegetarian: boolean
          is_vegan: boolean
          is_gluten_free: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id: string
          name: string
          description?: string | null
          price_cents: number
          image_url?: string | null
          is_available?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string
          name?: string
          description?: string | null
          price_cents?: number
          image_url?: string | null
          is_available?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      allergens: {
        Row: {
          id: string
          restaurant_id: string
          name: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
        }
        Relationships: []
      }
      item_allergens: {
        Row: {
          item_id: string
          allergen_id: string
        }
        Insert: {
          item_id: string
          allergen_id: string
        }
        Update: {
          item_id?: string
          allergen_id?: string
        }
        Relationships: []
      }
      modifier_groups: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          is_required: boolean
          allow_multiple: boolean
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          is_required?: boolean
          allow_multiple?: boolean
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          is_required?: boolean
          allow_multiple?: boolean
        }
        Relationships: []
      }
      modifiers: {
        Row: {
          id: string
          modifier_group_id: string
          name: string
          price_adjustment_cents: number
        }
        Insert: {
          id?: string
          modifier_group_id: string
          name: string
          price_adjustment_cents?: number
        }
        Update: {
          id?: string
          modifier_group_id?: string
          name?: string
          price_adjustment_cents?: number
        }
        Relationships: []
      }
      item_modifier_groups: {
        Row: {
          item_id: string
          modifier_group_id: string
        }
        Insert: {
          item_id: string
          modifier_group_id: string
        }
        Update: {
          item_id?: string
          modifier_group_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          table_number: number
          session_id: string
          total_cents: number
          status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
          payment_status: "unpaid" | "paid"
          stripe_payment_intent_id: string | null
          special_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_number: number
          session_id: string
          total_cents: number
          status?: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
          payment_status?: "unpaid" | "paid"
          stripe_payment_intent_id?: string | null
          special_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_number?: number
          session_id?: string
          total_cents?: number
          status?: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
          payment_status?: "unpaid" | "paid"
          stripe_payment_intent_id?: string | null
          special_notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          item_price_cents: number
          special_requests: string | null
          item_status: "pending" | "preparing" | "ready"
          payment_status: "unpaid" | "paid"
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          item_price_cents: number
          special_requests?: string | null
          item_status?: "pending" | "preparing" | "ready"
          payment_status?: "unpaid" | "paid"
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          item_price_cents?: number
          special_requests?: string | null
          item_status?: "pending" | "preparing" | "ready"
          payment_status?: "unpaid" | "paid"
        }
        Relationships: []
      }
      order_item_modifiers: {
        Row: {
          id: string
          order_item_id: string
          modifier_id: string
          price_adjustment_cents: number
        }
        Insert: {
          id?: string
          order_item_id: string
          modifier_id: string
          price_adjustment_cents?: number
        }
        Update: {
          id?: string
          order_item_id?: string
          modifier_id?: string
          price_adjustment_cents?: number
        }
        Relationships: []
      }
      table_pings: {
        Row: {
          id: string
          restaurant_id: string
          order_id: string | null
          table_number: number
          ping_type: "assistance" | "payment" | "refill"
          status: "pending" | "acknowledged" | "resolved"
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          order_id?: string | null
          table_number: number
          ping_type: "assistance" | "payment" | "refill"
          status?: "pending" | "acknowledged" | "resolved"
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          order_id?: string | null
          table_number?: number
          ping_type?: "assistance" | "payment" | "refill"
          status?: "pending" | "acknowledged" | "resolved"
          created_at?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          id: string
          restaurant_id: string
          table_number: number
          qr_code_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_number: number
          qr_code_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_number?: number
          qr_code_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience types
export type Restaurant = Database["public"]["Tables"]["restaurants"]["Row"]
export type Staff = Database["public"]["Tables"]["staff"]["Row"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"]
export type Allergen = Database["public"]["Tables"]["allergens"]["Row"]
export type ItemAllergen = Database["public"]["Tables"]["item_allergens"]["Row"]
export type ModifierGroup = Database["public"]["Tables"]["modifier_groups"]["Row"]
export type Modifier = Database["public"]["Tables"]["modifiers"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type OrderItemModifier = Database["public"]["Tables"]["order_item_modifiers"]["Row"]
export type TablePing = Database["public"]["Tables"]["table_pings"]["Row"]
export type QrCode = Database["public"]["Tables"]["qr_codes"]["Row"]

// Extended types with relations
export type MenuItemWithDetails = MenuItem & {
  categories: Category
  item_allergens: Array<{ allergens: Allergen }>
  item_modifier_groups: Array<{ modifier_groups: ModifierGroup & { modifiers: Modifier[] } }>
}

export type OrderWithItems = Order & {
  order_items: Array<OrderItem & {
    menu_items: MenuItem
    order_item_modifiers: Array<OrderItemModifier & { modifiers: Modifier }>
  }>
}

// Cart types (client-side only)
export type CartModifier = {
  modifierId: string
  modifierName: string
  priceAdjustmentCents: number
}

export type CartItem = {
  cartItemId: string
  menuItemId: string
  name: string
  priceCents: number
  quantity: number
  imageUrl: string | null
  specialRequests: string
  selectedModifiers: CartModifier[]
}
