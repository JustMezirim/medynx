import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DayAvailability {
  date: string
  slots: Array<{ id: string; time: string; isAvailable: boolean }>
  isFullyBooked?: boolean
}

interface CalendarViewProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date) => void
  availability: Record<string, DayAvailability>
}

export function CalendarView({ selectedDate, onDateSelect, availability }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }
  
  const getDaysInPreviousMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate()
  }
  
  const getDateStatus = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    const dayAvailability = availability[dateKey]
    
    if (!dayAvailability) return null
    
    const availableCount = dayAvailability.slots.filter(slot => slot.isAvailable).length
    if (availableCount === 0) return null
    if (availableCount === dayAvailability.slots.length) return "full"
    return "partial"
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  const firstDay = getFirstDayOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)
  const daysInPrevMonth = getDaysInPreviousMonth(currentDate)
  
  // Generate calendar days
  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = []
  
  // Previous month"s days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
    calendarDays.push({ date, isCurrentMonth: false })
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    calendarDays.push({ date, isCurrentMonth: true })
  }
  
  // Next month's days to complete the grid
  const remainingDays = 42 - calendarDays.length // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
    calendarDays.push({ date, isCurrentMonth: false })
  }

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">
            Select Date
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="w-full">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const status = getDateStatus(date)
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
              const isTodayDate = isToday(date)
              const isPast = isPastDate(date)
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "ghost"}
                  onClick={() => !isPast && isCurrentMonth && onDateSelect(date)}
                  disabled={isPast || !isCurrentMonth}
                  className={`
                    h-16 w-full p-2 flex flex-col items-center justify-center relative transition-all duration-200
                    ${!isCurrentMonth ? "text-slate-300 dark:text-slate-600" : ""}
                    ${isPast ? "opacity-50 cursor-not-allowed" : ""}
                    ${isTodayDate && !isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                    ${isSelected ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" : ""}
                    ${status === 'full' && !isSelected ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200" : ""}
                    ${status === 'partial' && !isSelected ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 hover:bg-orange-200" : ""}
                    hover:shadow-md
                  `}
                >
                  <span className={`text-lg font-semibold ${isTodayDate && !isSelected ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </span>
                  
                  {/* Status indicator */}
                  {status && !isSelected && (
                    <div className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
                      status === 'full' ? 'bg-green-500' : 'bg-orange-400'
                    }`} />
                  )}
                  
                  {/* Today indicator */}
                  {isTodayDate && !isSelected && (
                    <div className="absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-8 text-sm bg-slate-50 dark:bg-slate-800 rounded-full px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Fully Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Partially Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">No Availability</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}