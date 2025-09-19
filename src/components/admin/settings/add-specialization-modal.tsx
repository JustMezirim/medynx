import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NewSpecialization {
  name: string
  description: string
}

interface AddSpecializationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newSpecialization: NewSpecialization
  setNewSpecialization: (spec: NewSpecialization | ((prev: NewSpecialization) => NewSpecialization)) => void
  addingSpecialization: boolean
  onAddSpecialization: () => void
}

export function AddSpecializationModal({
  open,
  onOpenChange,
  newSpecialization,
  setNewSpecialization,
  addingSpecialization,
  onAddSpecialization
}: AddSpecializationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Add New Specialization
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Add a new medical specialization for doctors to select.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specName">Specialization Name</Label>
            <Input
              id="specName"
              value={newSpecialization.name}
              onChange={(e) => setNewSpecialization(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Cardiology, Dermatology"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specDescription">Description</Label>
            <Input
              id="specDescription"
              value={newSpecialization.description}
              onChange={(e) => setNewSpecialization(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the specialization"
            />
          </div>
        </div>
        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddSpecialization} disabled={addingSpecialization} className="bg-teal-600 hover:bg-teal-700 text-white">
            {addingSpecialization ? "Adding..." : "Add Specialization"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}