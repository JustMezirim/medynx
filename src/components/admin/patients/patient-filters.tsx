import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Users } from "lucide-react"

interface PatientFiltersProps {
  searchTerm: string
  statusFilter: string
  genderFilter: string
  sortBy: string
  sortOrder: "asc" | "desc"
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onGenderChange: (value: string) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  onExport: () => void
  onAddPatient: () => void
}

export function PatientFilters({
  searchTerm,
  statusFilter,
  genderFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onGenderChange,
  onSortChange,
  onExport,
  onAddPatient
}: PatientFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={genderFilter} onValueChange={onGenderChange}>
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={`${sortBy}-${sortOrder}`} 
          onValueChange={(value) => {
            const [field, order] = value.split('-')
            onSortChange(field, order as "asc" | "desc")
          }}
        >
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="firstName-asc">Name A-Z</SelectItem>
            <SelectItem value="firstName-desc">Name Z-A</SelectItem>
            <SelectItem value="appointmentCount-desc">Most Appointments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} className="h-10">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onAddPatient} className="h-10">
          <Users className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>
    </div>
  )
}