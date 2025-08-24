import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"

interface AppointmentFiltersProps {
  searchTerm: string
  statusFilter: string
  typeFilter: string
  paymentFilter: string
  sortBy: string
  sortOrder: "asc" | "desc"
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onTypeChange: (value: string) => void
  onPaymentChange: (value: string) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  onExport: () => void
}

export function AppointmentFilters({
  searchTerm,
  statusFilter,
  typeFilter,
  paymentFilter,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onPaymentChange,
  onSortChange,
  onExport
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient or doctor name..."
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No Show</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="in-person">In-Person</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
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
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="amount-desc">Highest Amount</SelectItem>
            <SelectItem value="status-asc">Status A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} className="h-10">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}