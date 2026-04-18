"use client"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { inviteStaff, updateStaffStatus } from "@/lib/actions/restaurant"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Crown, ChefHat, Coffee } from "lucide-react"
import type { Staff } from "@/types/database"

const InviteSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["admin", "kitchen", "waiter"]),
})

const roleIcons = { admin: Crown, kitchen: ChefHat, waiter: Coffee }
const roleColors = {
  admin: "bg-purple-100 text-purple-700",
  kitchen: "bg-orange-100 text-orange-700",
  waiter: "bg-blue-100 text-blue-700",
}

export function StaffClient({ staff: initialStaff, restaurantId }: { staff: Staff[]; restaurantId: string }) {
  const [staff, setStaff] = useState(initialStaff)
  const [showInvite, setShowInvite] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<z.infer<typeof InviteSchema>>({
    resolver: zodResolver(InviteSchema),
    defaultValues: { role: "waiter" },
  })

  const roleValue = watch("role")

  async function onSubmit(data: z.infer<typeof InviteSchema>) {
    const { error } = await inviteStaff(restaurantId, data.email, data.role, data.firstName, data.lastName)
    if (error) {
      toast({ title: "Failed to invite staff", description: error, variant: "destructive" })
    } else {
      toast({ title: "Staff member added" })
      setShowInvite(false)
      reset()
    }
  }

  async function toggleActive(staffId: string, isActive: boolean) {
    const { error } = await updateStaffStatus(staffId, isActive)
    if (!error) {
      setStaff(prev => prev.map(s => s.id === staffId ? { ...s, is_active: isActive } : s))
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <p className="text-stone-500">{staff.length} team member{staff.length !== 1 ? "s" : ""}</p>
        <Button variant="amber" onClick={() => setShowInvite(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="space-y-3">
        {staff.map(member => {
          const Icon = roleIcons[member.role]
          return (
            <Card key={member.id} className={`border-stone-200 ${!member.is_active ? "opacity-60" : ""}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-stone-600 text-sm">
                    {member.first_name[0]}{member.last_name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800">{member.first_name} {member.last_name}</p>
                  <p className="text-sm text-stone-500">{member.email}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                  <Icon className="h-3 w-3" />
                  {member.role}
                </span>
                <Switch
                  checked={member.is_active}
                  onCheckedChange={v => toggleActive(member.id, v)}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>First Name</Label>
                <Input {...register("firstName")} placeholder="Jane" />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Last Name</Label>
                <Input {...register("lastName")} placeholder="Smith" />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input {...register("email")} type="email" placeholder="jane@restaurant.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={roleValue} onValueChange={v => setValue("role", v as "admin" | "kitchen" | "waiter")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="waiter">Waiter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowInvite(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="amber" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Staff"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
