import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NewAdmin {
  firstName: string
  lastName: string
  email: string
  permissions: string[]
}

interface AddAdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newAdmin: NewAdmin
  setNewAdmin: (admin: NewAdmin | ((prev: NewAdmin) => NewAdmin)) => void
  addingAdmin: boolean
  onAddAdmin: () => void
  togglePermission: (permissionId: string) => void
  permissions: { id: string; label: string }[]
}

export function AddAdminModal({
  open,
  onOpenChange,
  newAdmin,
  setNewAdmin,
  addingAdmin,
  onAddAdmin,
  togglePermission,
  permissions
}: AddAdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl max-w-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Add New Administrator
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Create a new administrator account with specific permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={newAdmin.firstName}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={newAdmin.lastName}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={newAdmin.permissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500 focus:ring-2"
                  />
                  <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddAdmin} disabled={addingAdmin} className="bg-violet-600 hover:bg-violet-700 text-white">
            {addingAdmin ? "Creating..." : "Create Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}