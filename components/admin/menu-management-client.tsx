"use client"
import { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, Upload, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createMenuItem, updateMenuItem, deleteMenuItem, createCategory, uploadMenuImage } from "@/lib/actions/menu"
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
  name: z.string().min(1, "Namn krävs"),
  description: z.string().optional(),
  priceCents: z.coerce.number().int().nonnegative("Priset måste vara 0 eller mer"),
  categoryId: z.string().uuid("Välj en kategori"),
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
  const [newCatName, setNewCatName] = useState("")
  const [addingCat, setAddingCat] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(ItemSchema),
    defaultValues: { name: "", description: "", priceCents: 0, categoryId: "", isAvailable: true, isVegetarian: false, isVegan: false, isGlutenFree: false },
  })

  function openAddItem(categoryId: string) {
    setEditingItem(null)
    setImageUrl(null)
    form.reset({ name: "", description: "", priceCents: 0, categoryId, isAvailable: true, isVegetarian: false, isVegan: false, isGlutenFree: false })
    setItemDialogOpen(true)
  }

  function openEditItem(item: MenuItemWithDetails) {
    setEditingItem(item)
    setImageUrl(item.image_url)
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const fd = new FormData()
    fd.append("file", file)
    const { url, error } = await uploadMenuImage(restaurantId, fd)
    setUploadingImage(false)
    if (error || !url) {
      toast({ title: "Kunde inte ladda upp bild", variant: "destructive" })
    } else {
      setImageUrl(url)
    }
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ""
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
        imageUrl,
      })
      if (error) {
        toast({ title: "Kunde inte uppdatera rätten", variant: "destructive" })
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
        image_url: imageUrl,
      } : i))
      toast({ title: "Rätt uppdaterad" })
    } else {
      const { error, id } = await createMenuItem({
        restaurantId,
        categoryId: values.categoryId,
        name: values.name,
        description: values.description,
        priceCents: values.priceCents,
        imageUrl,
        isAvailable: values.isAvailable,
        isVegetarian: values.isVegetarian,
        isVegan: values.isVegan,
        isGlutenFree: values.isGlutenFree,
        allergenIds: [],
      })
      if (error || !id) {
        toast({ title: "Kunde inte skapa rätten", variant: "destructive" })
        return
      }
      const newItem: MenuItemWithDetails = {
        id,
        restaurant_id: restaurantId,
        category_id: values.categoryId,
        name: values.name,
        description: values.description ?? null,
        price_cents: values.priceCents,
        image_url: imageUrl,
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
      toast({ title: "Rätt skapad" })
    }
    setItemDialogOpen(false)
  }

  async function handleDeleteItem(itemId: string) {
    setDeletingId(itemId)
    const { error } = await deleteMenuItem(itemId)
    setDeletingId(null)
    if (error) {
      toast({ title: "Kunde inte radera rätten", variant: "destructive" })
    } else {
      setItems(prev => prev.filter(i => i.id !== itemId))
      toast({ title: "Rätt raderad" })
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
      toast({ title: "Kunde inte skapa kategorin", variant: "destructive" })
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
      toast({ title: "Kategori skapad" })
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
          placeholder="Namn på ny kategori…"
          value={newCatName}
          onChange={e => setNewCatName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleAddCategory() }}
          className="max-w-xs"
        />
        <Button variant="amber" onClick={handleAddCategory} disabled={addingCat || !newCatName.trim()}>
          <Plus className="h-4 w-4 mr-1" /> Lägg till kategori
        </Button>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          Inga kategorier än. Skapa en ovan för att börja bygga din meny.
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
                    {catItems.length} rätt{catItems.length !== 1 ? "er" : ""}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
                </button>
                <Button variant="outline" size="sm" onClick={() => openAddItem(cat.id)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Lägg till rätt
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0">
                {catItems.length === 0 ? (
                  <p className="text-sm text-stone-400 py-4 text-center">
                    Inga rätter än.{" "}
                    <button onClick={() => openAddItem(cat.id)} className="text-amber-600 hover:underline">
                      Lägg till den första rätten
                    </button>
                  </p>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {catItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 py-3">
                        {item.image_url && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.image_url} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm ${item.is_available ? "text-stone-800" : "text-stone-400 line-through"}`}>
                              {item.name}
                            </p>
                            {item.is_vegan && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Vegansk</Badge>}
                            {!item.is_vegan && item.is_vegetarian && <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">Vegetarisk</Badge>}
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
                          title={item.is_available ? "Markera som otillgänglig" : "Markera som tillgänglig"}
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
            <DialogTitle>{editingItem ? "Redigera rätt" : "Lägg till menyrätt"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmitItem)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Namn *</Label>
              <Input {...form.register("name")} placeholder="t.ex. Margherita Pizza" />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Beskrivning</Label>
              <Input {...form.register("description")} placeholder="Kort beskrivning…" />
            </div>

            <div className="space-y-1.5">
              <Label>Bild</Label>
              <div className="flex items-center gap-3">
                {imageUrl && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-stone-900/70 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-3 py-2 border border-stone-300 border-dashed rounded-lg text-sm text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Laddar upp..." : imageUrl ? "Byt bild" : "Ladda upp bild"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Pris (i ören) *</Label>
              <Input type="number" {...form.register("priceCents")} placeholder="12000" />
              {form.formState.errors.priceCents && (
                <p className="text-xs text-red-500">{form.formState.errors.priceCents.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Kategori *</Label>
              <Select
                value={form.watch("categoryId")}
                onValueChange={v => form.setValue("categoryId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
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
                <Label htmlFor="isAvailable">Tillgänglig</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isVegetarian"
                  checked={form.watch("isVegetarian")}
                  onCheckedChange={v => form.setValue("isVegetarian", v)}
                />
                <Label htmlFor="isVegetarian">Vegetarisk</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isVegan"
                  checked={form.watch("isVegan")}
                  onCheckedChange={v => form.setValue("isVegan", v)}
                />
                <Label htmlFor="isVegan">Vegansk</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isGlutenFree"
                  checked={form.watch("isGlutenFree")}
                  onCheckedChange={v => form.setValue("isGlutenFree", v)}
                />
                <Label htmlFor="isGlutenFree">Glutenfritt</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="amber" disabled={form.formState.isSubmitting || uploadingImage} className="flex-1">
                {form.formState.isSubmitting ? "Sparar…" : editingItem ? "Spara ändringar" : "Lägg till rätt"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setItemDialogOpen(false)}>
                Avbryt
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
