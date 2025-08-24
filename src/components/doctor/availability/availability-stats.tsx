import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, TrendingUp, Settings } from "lucide-react"

interface AvailabilityStatsProps {
  totalDays: number
  availableSlots: number
  utilization: number
  showStats: boolean
  onToggleStats: () => void
}

export function AvailabilityStats({ 
  totalDays, 
  availableSlots, 
  utilization, 
  showStats, 
  onToggleStats 
}: AvailabilityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Availability</p>
              <p className="text-3xl font-bold">{totalDays}</p>
              <p className="text-blue-100 text-xs mt-1">Days scheduled</p>
            </div>
            <CalendarDays className="h-8 w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Available Slots</p>
              <p className="text-3xl font-bold">{availableSlots}</p>
              <p className="text-green-100 text-xs mt-1">This week</p>
            </div>
            <Clock className="h-8 w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Utilization</p>
              <p className="text-3xl font-bold">{utilization}%</p>
              <p className="text-purple-100 text-xs mt-1">Weekly average</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Quick Actions</p>
              <Button 
                size="sm" 
                variant="secondary"
                className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={onToggleStats}
              >
                {showStats ? 'Hide' : 'Show'} Details
              </Button>
            </div>
            <Settings className="h-8 w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}