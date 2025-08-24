import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, Heart } from "lucide-react"

interface DoctorSearchFiltersProps {
  searchTerm: string
  selectedSpecialization: string
  sortBy: string
  priceRange: string
  availabilityFilter: string
  viewMode: "grid" | "list"
  onSearchChange: (value: string) => void
  onSpecializationChange: (value: string) => void
  onSortChange: (value: string) => void
  onPriceRangeChange: (value: string) => void
  onAvailabilityChange: (value: string) => void
  onViewModeChange: (mode: "grid" | "list") => void
  onSubmit: (e: React.FormEvent) => void
}

const specializations = [
  { value: "all", label: "All Specializations", icon: Heart },
  { value: "general", label: "General Medicine", icon: Heart },
  { value: "cardiology", label: "Cardiology", icon: Heart },
  { value: "dermatology", label: "Dermatology", icon: Heart },
  { value: "neurology", label: "Neurology", icon: Heart },
  { value: "orthopedics", label: "Orthopedics", icon: Heart },
  { value: "pediatrics", label: "Pediatrics", icon: Heart },
  { value: "psychiatry", label: "Psychiatry", icon: Heart },
  { value: "radiology", label: "Radiology", icon: Heart },
]

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "availability", label: "Next Available" },
]

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-5000", label: "Under ₦5,000" },
  { value: "5000-10000", label: "₦5,000 - ₦10,000" },
  { value: "10000-20000", label: "₦10,000 - ₦20,000" },
  { value: "20000+", label: "₦20,000+" },
]

export function DoctorSearchFilters({
  searchTerm,
  selectedSpecialization,
  sortBy,
  priceRange,
  availabilityFilter,
  viewMode,
  onSearchChange,
  onSpecializationChange,
  onSortChange,
  onPriceRangeChange,
  onAvailabilityChange,
  onViewModeChange,
  onSubmit
}: DoctorSearchFiltersProps) {
  return (
    <Card className="mb-6 border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-blue-600" />
          <span>Find Your Perfect Doctor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search doctors by name, specialization, or condition..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={selectedSpecialization} onValueChange={onSpecializationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    <div className="flex items-center space-x-2">
                      <spec.icon className="h-4 w-4" />
                      <span>{spec.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={onPriceRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                <SelectItem value="today">Available Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="urgent">Urgent Care</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
              >
                Grid
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("list")}
              >
                List
              </Button>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}