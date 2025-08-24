import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, UserCheck } from "lucide-react"

interface DoctorFiltersProps {
  searchTerm: string
  statusFilter: string
  specializationFilter: string
  sortBy: string
  sortOrder: "asc" | "desc"
  specializations: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSpecializationChange: (value: string) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  onExport: () => void
  onAddDoctor: () => void
}

export function DoctorFilters({
  searchTerm,
  statusFilter,
  specializationFilter,
  sortBy,
  sortOrder,
  specializations,
  onSearchChange,
  onStatusChange,
  onSpecializationChange,
  onSortChange,
  onExport,
  onAddDoctor
}: DoctorFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search doctors by name, email, or license..."
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
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={specializationFilter} onValueChange={onSpecializationChange}>
          <SelectTrigger className="w-44 h-10">
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map(spec => (
              <SelectItem key={spec} value={spec}>
                {spec.charAt(0).toUpperCase() + spec.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={`${sortBy}-${sortOrder}`} 
          onValueChange={(value) => {
            const [field, order] = value.split("-")
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
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="experience-desc">Most Experienced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} className="h-10">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onAddDoctor} className="h-10">
          <UserCheck className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>
    </div>
  )
}