"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createMenuItem, updateMenuItem, deleteMenuItem, createCategory } from "@/lib/actions/menu"
import { formatPrice } from "@/lib/utils"
import type { Category, MenuItem, Allergen } from "@/types/database"

type MenuItemWithDetails = MenuItem & {
  item_allergens: Array<{ allergen_id: string; allergens: Allergen }>
  item_modifier_groups: Array<{
    modifier_group_id: string
    modifier_groups: {
      id: string; name: string; is_required: boolean; allow_multiple: boolean
      modifiers: Array<{ id: string; name: string; price_adjustment_cents: number }>
    }
  }>
}

const ItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  priceCents: z.coerce.number().int().nonnegative("Price must be 0 or more"),
  categoryId: z.string().uuid("Please select a category"),
  isAvailable: z.boolean().default(true),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
})

type ItemFormValues = z.infer<typeof ItemSchema>

interface Props {
  restaurantId: string
  categories: Category[]
  menuItems: MenuItemWithDetails[]
  allergens: Allergen[]
}

export function MenuManagementClient({ restaurantId, categories: initCats, menuItems: initItems }: Props) {
  const [categories, setCategories] = useState(initCats)
  const [items, setItems] = useState(initItems)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(initCats.map(c => c.id)))
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItemWithDetails | null>(null)
  const [editingForCategoryId, setEditingForCategoryId] = useState<string>("")
  const [newCatName, setNewCatName] = useState("")
  const [addingCat, setAddingCat] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: { name: "", description: "", priceCents: 0, categoryId: "", isAvailable: true, isVegetarian: false, isVegan: false, isGlutenFree: false },
  })

  function openAddItem(categoryId: string) {
    setEditingItem(null)
    setEditingForCategoryId(categoryId)
    form.reset({ name: "", description: "", priceCents: 0, categoryId, isAvailable: true, isVegetarian: false, isVegan: false, isGlutenFree: false })
    setItemDialogOpen(true)
  }

  function openEditItem(item: MenuItemWithDetails) {
    setEditingItem(item)
    form.reset({
      name: item.name,
      description: item.description ?? "",
      priceCents: item.price_cents,
      categoryId: item.category_id,
      isAvailable: item.is_available,
      isVegetarian: item.is_vegetarian,
      isVegan: item.is_vegan,
      isGlutenFree: item.is_gluten_free,
    })
    setItemDialogOpen(true)
  }

  async function onSubmitItem(values: ItemFormValues) {
    if (editingItem) {
      const { error } = await updateMenuItem(editingItem.id, {
        name: values.name,
        description: values.description,
        priceCents: values.priceCents,
        categoryId: values.categoryId,
        isAvailable: values.isAvailable,
        isVegetarian: values.isVegetarian,
        isVegan: values.isVegan,
        isGlutenFree: values.isGlutenFree,
      })
      if (error) {
        toast({ title: "Failed to update item", variant: "destructive" })
        return
      }
      setItems(prev => prev.map(i => i.id === editingItem.id ? {
        ...i,
        name: values.name,
        description: values.description ?? null,
        price_cents: values.priceCents,
        category_id: values.categoryId,
        is_available: values.isAvailable,
        is_vegetarian: values.isVegetarian,
        is_vegan: values.isVegan,
        is_gluten_free: values.isGlutenFree,
      } : i))
      toast({ title: "Item updated" })
    } else {
      const { error, id } = await createMenuItem({
        restaurantId,
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        priceCents: values.priceCents,
        isAvailable: values.isAvailable,
        isVegetarian: values.isVegetarian,
        isVegan: values.isVegan,
        isGlutenFree: values.isGlutenFree,
        allergenIds: [],
      })
      if (error || !id) {
        toast({ title: "Failed to create item", variant: "destructive" })
        return
      }
      const newItem: MenuItemWithDetails = {
        id,
        restaurant_id: restaurantId,
        category_id: values.categoryId,
        name: values.name,
        description: values.description ?? null,
        price_cents: values.priceCents,
        image_url: null,
        is_available: values.isAvailable,
        is_vegetarian: values.isVegetarian,
        is_vegan: values.isVegan,
        is_gluten_free: values.isGlutenFree,
        display_order: 0,
        created_at: new Date().toISOString(),
        item_allergens: [],
        item_modifier_groups: [],
      }
      setItems(prev => [...prev, newItem])
      toast({ title: "Item created" })
    }
    setItemDialogOpen(false)
  }

  async function handleDeleteItem(itemId: string) {
    setDeletingId(itemId)
    const { error } = await deleteMenuItem(itemId)
    setDeletingId(null)
    if (error) {
      toast({ title: "Failed to delete item", variant: "destructive" })
    } else {
      setItems(prev => prev.filter(i => i.id !== itemId))
      toast({ title: "Item deleted" })
    }
  }

  async function handleToggleAvailability(item: MenuItemWithDetails) {
    const { error } = await updateMenuItem(item.id, { isAvailable: !item.is_available })
    if (!error) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: !i.is_available } : i))
    }
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    setAddingCat(true)
    const { error, id } = await createCategory(restaurantId, newCatName.trim(), categories.length)
    setAddingCat(false)
    if (error || !id) {
      toast({ title: "Failed to create category", variant: "destructive" })
    } else {
      const newCat: Category = {
        id,
        restaurant_id: restaurantId,
        name: newCatName.trim(),
        display_order: categories.length,
        is_active: true,
        created_at: new Date().toISOString(),
      }
      setCategories(prev => [...prev, newCat])
      setExpandedCats(prev => new Set(Array.from(prev).concat(id)))
      setNewCatName("")
      toast({ title: "Category created" })
    }
  }

  function toggleCat(catId: string) {
    setExpandedCats(prev => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Add category row */}
      <div className="flex gap-2">
        <Input
          placeholder="New category name…"
          value={newCatName}
          onChange={e => setNewCatName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleAddCategory() }}
          className="max-w-xs"
        />
        <Button variant="amber" onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          No categories yet. Create one above to start building your menu.
        </div>
      )}

      {categories.map(cat => {
        const catItems = items.filter(i => i.category_id === cat.id)
        const isExpanded = expandedCats.has(cat.id)
        return (
          <Card key={cat.id} className="border-stone-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="flex items-center gap-2 text-left"
                >
                  <CardTitle className="text-stone-800 text-lg">{cat.name}</CardTitle>
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                    {catItems.length} item{catItems.length !== 1 ? "s" : ""}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
                </button>
                <Button variant="outline" size="sm" onClick={() => openAddItem(cat.id)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                {catItems.length === 0 ? (
                  <p className="text-sm text-stone-400 py-4 text-center">
                    No items yet.{" "}
                    <button onClick={() => openAddItem(cat.id)} className="text-amber-600 hover:underline">
                      Add the first item
                    </button>
                  </p>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {catItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm ${item.is_available ? "text-stone-800" : "text-stone-400 line-through"}`}>
                              {item.name}
                            </p>
                            {item.is_vegan && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Vegan</Badge>}
                            {!item.is_vegan && item.is_vegetarian && <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">Veg</Badge>}
                            {item.is_gluten_free && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">GF</Badge>}
                          </div>
                          {item.description && (
                            <p className="text-xs text-stone-400 mt-0.5 truncate max-w-md">{item.description}</p>
                          )}
                        </div>
                        <span className="font-semibold text-stone-700 text-sm">{formatPrice(item.price_cents)}</span>
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className="text-stone-400 hover:text-stone-600 transition-colors"
                          title={item.is_available ? "Mark unavailable" : "Mark available"}
                        >
                          {item.is_available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => openEditItem(item)}
                          className="text-stone-400 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingId === item.id}
                          className="text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Item dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmitItem)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input {...form.register("name")} placeholder="e.g. Margherita Pizza" />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input {...form.register("description")} placeholder="Short description…" />
            </div>

            <div className="space-y-1.5">
              <Label>Price (in pence/cents) *</Label>
              <Input type="number" {...form.register("priceCents")} placeholder="1200" />
              {form.formState.errors.priceCents && (
                <p className="text-xs text-red-500">{form.formState.errors.priceCents.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select
                value={form.watch("categoryId")}
                onValueChange={v => form.setValue("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-xs text-red-500">{form.formState.errors.categoryId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="isAvailable"
                  checked={form.watch("isAvailable")}
                  onCheckedChange={v => form.setValue("isAvailable", v)}
                />
                <Label htmlFor="isAvailable">Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isVegetarian"
                  checked={form.watch("isVegetarian")}
                  onCheckedChange={v => form.setValue("isVegetarian", v)}
                />
                <Label htmlFor="isVegetarian">Vegetarian</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isVegan"
                  checked={form.watch("isVegan")}
                  onCheckedChange={v => form.setValue("isVegan", v)}
                />
                <Label htmlFor="isVegan">Vegan</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isGlutenFree"
                  checked={form.watch("isGlutenFree")}
                  onCheckedChange={v => form.setValue("isGlutenFree", v)}
                />
                <Label htmlFor="isGlutenFree">Gluten-Free</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="amber" disabled={form.formState.isSubmitting} className="flex-1">
                {form.formState.isSubmitting ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setItemDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
