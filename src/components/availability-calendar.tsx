"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Calendar, Save, Copy, RotateCcw, CheckCircle, Settings, Trash2, ChevronLeft, ChevronRight, Plus, Users, TrendingUp, CalendarDays, Filter } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface TimeSlot {
  id: string
  time: string
  isAvailable: boolean
}

interface DayAvailability {
  date: string
  slots: TimeSlot[]
  isFullyBooked?: boolean
}

// Simple calendar component that uses full width
function FullWidthCalendar({ selectedDate, onDateSelect, availability }: {
  selectedDate: Date | undefined
  onDateSelect: (date: Date) => void
  availability: Record<string, DayAvailability>
}) {
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
    const dateKey = date.toISOString().split("T")[0]
    const dayAvailability = availability[dateKey]
    
    if (!dayAvailability) return null
    
    const availableCount = dayAvailability.slots.filter(slot => slot.isAvailable).length
    if (availableCount === 0) return null
    if (availableCount === dayAvailability.slots.length) return 'full'
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
  
  // Previous month's days
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
  )
}

const fetchTimeSlots = async (date: Date, startHour: number = 9, endHour: number = 17) => {
  try {
    const response = await fetch(`/api/time-slots?date=${date.toISOString()}&startHour=${startHour}&endHour=${endHour}`)
    if (response.ok) {
      const data = await response.json()
      return data.slots
    }
  } catch (error) {
    console.error("Error fetching time slots:", error)
  }
  return []
}

const presetSchedules = {
  "morning": { start: 9, end: 13, name: "Morning (9 AM - 1 PM)" },
  "afternoon": { start: 14, end: 18, name: "Afternoon (2 PM - 6 PM)" },
  "evening": { start: 18, end: 22, name: "Evening (6 PM - 10 PM)" },
  "fullday": { start: 9, end: 17, name: "Full Day (9 AM - 5 PM)" }
}

export default function DoctorAvailabilityCalendar () {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({})
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [copyFromDate, setCopyFromDate] = useState<string>("")
  const [customTime, setCustomTime] = useState<string>("")
  const [showStats, setShowStats] = useState(false)
  const [filterView, setFilterView] = useState<"all" | "available" | "unavailable">("all")
  const timeSlotsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const getWeeklyStats = () => {
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date.toISOString().split('T')[0]
    })
    
    const totalSlots = weekDates.reduce((acc, dateKey) => {
      const dayAvailability = availability[dateKey]
      return acc + (dayAvailability?.slots.length || 0)
    }, 0)
    
    const availableSlots = weekDates.reduce((acc, dateKey) => {
      const dayAvailability = availability[dateKey]
      return acc + (dayAvailability?.slots.filter(slot => slot.isAvailable).length || 0)
    }, 0)
    
    return { totalSlots, availableSlots, weekDates: weekDates.length }
  }

  // Fetch doctor's availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/availability/doctor')
        if (response.ok) {
          const data = await response.json()
          const availabilityMap: Record<string, DayAvailability> = {}
          
          data.availabilities.forEach((avail: any) => {
            const dateKey = new Date(avail.date).toISOString().split('T')[0]
            availabilityMap[dateKey] = {
              date: dateKey,
              slots: avail.timeSlots.map((slot: any) => ({
                id: `slot-${slot.time}`,
                time: slot.time,
                isAvailable: !slot.isBooked
              }))
            }
          })
          
          setAvailability(availabilityMap)
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
    }
    
    fetchAvailability()
  }, [])

  // Fetch time slots when date is selected
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (selectedDate) {
        const slots = await fetchTimeSlots(selectedDate)
        setTimeSlots(slots)
        
        // If no saved availability exists, initialize with API slots
        const dateKey = selectedDate.toISOString().split('T')[0]
        if (!availability[dateKey]) {
          setAvailability(prev => ({
            ...prev,
            [dateKey]: {
              date: dateKey,
              slots: slots.map((slot: TimeSlot) => ({
                ...slot,
                isAvailable: false
              }))
            }
          }))
        }
        
        // Auto-scroll to time slots section
        setTimeout(() => {
          timeSlotsRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
    
    loadTimeSlots()
  }, [selectedDate, availability])

  const getCurrentDateAvailability = (): TimeSlot[] => {
    if (!selectedDate) return timeSlots
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const dayAvailability = availability[dateKey]
    
    if (dayAvailability) {
      return dayAvailability.slots.map((slot: TimeSlot) => {
        const apiSlot = timeSlots.find((s: TimeSlot) => s.time === slot.time)
        return {
          ...slot,
          isAvailable: apiSlot ? (apiSlot.isAvailable && slot.isAvailable) : slot.isAvailable
        }
      })
    }
    
    return timeSlots
  }

  const handleSlotToggle = (slotId: string) => {
    if (!selectedDate) return
    
    const apiSlot = timeSlots.find((s: TimeSlot) => s.id === slotId)
    if (apiSlot && !apiSlot.isAvailable) return
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentSlots = getCurrentDateAvailability()
    
    const updatedSlots = currentSlots.map((slot: TimeSlot) =>
      slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
    )
    
    setAvailability(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        slots: updatedSlots
      }
    }))
  }

  const handleSelectAll = () => {
    if (!selectedDate) return
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const currentSlots = getCurrentDateAvailability()
    const allSelected = currentSlots.every((slot: TimeSlot) => slot.isAvailable)
    
    const updatedSlots = currentSlots.map((slot: TimeSlot) => ({
      ...slot,
      isAvailable: !allSelected
    }))
    
    setAvailability(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        slots: updatedSlots
      }
    }))
  }

  const handlePresetSchedule = async (preset: string) => {
    if (!selectedDate || !presetSchedules[preset as keyof typeof presetSchedules]) return
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const presetConfig = presetSchedules[preset as keyof typeof presetSchedules]
    
    const slots = await fetchTimeSlots(selectedDate, presetConfig.start, presetConfig.end)
    const updatedSlots = slots.map((slot: TimeSlot) => ({
      ...slot,
      isAvailable: slot.isAvailable
    }))
    
    setAvailability(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        slots: updatedSlots
      }
    }))
    
    setSelectedPreset('')
  }

  const handleCopyFromDate = () => {
    if (!selectedDate || !copyFromDate) return
    
    const sourceDateAvailability = availability[copyFromDate]
    if (!sourceDateAvailability) {
      toast({
        title: "No availability found",
        description: "No availability found for the selected date",
        variant: "destructive"
      })
      return
    }
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    setAvailability(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        slots: [...sourceDateAvailability.slots]
      }
    }))
    
    setCopyFromDate('')
    toast({
      title: "Availability copied",
      description: "Availability has been successfully copied"
    })
  }

  const handleSaveAvailability = async () => {
    if (!selectedDate) {
      toast({
        title: "No date selected",
        description: "Please select a date first",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    try {
      const dateKey = selectedDate.toISOString().split('T')[0]
      const currentSlots = getCurrentDateAvailability()
      
      const timeSlots = currentSlots.map((slot: TimeSlot) => ({
        time: slot.time,
        isBooked: !slot.isAvailable
      }))
      
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: dateKey,
          timeSlots
        })
      })
      
      if (response.ok) {
        toast({
          title: 'Availability saved',
          description: "Your availability has been updated successfully"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Save failed",
          description: error.message || "Failed to save availability",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving availability:', error)
      toast({
        title: 'Save failed',
        description: "Failed to save availability",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearDay = () => {
    if (!selectedDate) return
    
    const dateKey = selectedDate.toISOString().split('T')[0]
    const clearedSlots = getCurrentDateAvailability().map((slot: TimeSlot) => ({
      ...slot,
      isAvailable: false
    }))
    
    setAvailability(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        slots: clearedSlots
      }
    }))
  }

  const handleDeleteAvailability = async () => {
    if (!selectedDate) return
    
    setLoading(true)
    try {
      const dateKey = selectedDate.toISOString().split('T')[0]
      
      const response = await fetch(`/api/availability?date=${dateKey}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from local state
        setAvailability(prev => {
          const newAvailability = { ...prev }
          delete newAvailability[dateKey]
          return newAvailability
        })
        
        toast({
          title: 'Availability deleted',
          description: "Your availability for this date has been completely removed"
        })
      } else {
        const error = await response.json()
        toast({
          title: "Delete failed",
          description: error.message || "Failed to delete availability",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting availability:', error)
      toast({
        title: 'Delete failed',
        description: "Failed to delete availability",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getAvailableSlotCount = () => {
    return getCurrentDateAvailability().filter((slot: TimeSlot) => {
      const apiSlot = timeSlots.find((s: TimeSlot) => s.id === slot.id)
      return slot.isAvailable && (!apiSlot || apiSlot.isAvailable)
    }).length
  }

  const availableDates = Object.keys(availability).filter(dateKey => {
    const dayAvailability = availability[dateKey]
    return dayAvailability.slots.some((slot: TimeSlot) => slot.isAvailable)
  })

  return (
    <div className='max-w-10xl mx-auto p-6 space-y-8'>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Availability</p>
                <p className="text-3xl font-bold">{Object.keys(availability).length}</p>
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
                <p className="text-3xl font-bold">{getWeeklyStats().availableSlots}</p>
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
                <p className="text-3xl font-bold">{getWeeklyStats().totalSlots > 0 ? Math.round((getWeeklyStats().availableSlots / getWeeklyStats().totalSlots) * 100) : 0}%</p>
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
                  onClick={() => setShowStats(!showStats)}
                >
                  {showStats ? 'Hide' : 'Show'} Details
                </Button>
              </div>
              <Settings className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>
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
          <FullWidthCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availability={availability}
          />
          
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

      {selectedDate && (
        <Card ref={timeSlotsRef} className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-slate-800 dark:text-slate-200 text-xl">
                    Time Slots
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {formatSelectedDate(selectedDate)}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 px-4 py-2">
                {getAvailableSlotCount()} slots available
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Schedule</label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Choose preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(presetSchedules).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPreset && (
                    <Button 
                      size="sm" 
                      onClick={() => handlePresetSchedule(selectedPreset)}
                      className="w-full h-10 bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Preset
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Custom Time</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="flex-1 h-11 px-3 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (customTime && selectedDate) {
                          const [hours, minutes] = customTime.split(':')
                          const time12 = new Date()
                          time12.setHours(parseInt(hours), parseInt(minutes))
                          const timeString = time12.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })
                          
                          const dateKey = selectedDate.toISOString().split('T')[0]
                          const currentSlots = getCurrentDateAvailability()
                          const newSlot = {
                            id: `slot-${timeString}`,
                            time: timeString,
                            isAvailable: true
                          }
                          
                          if (!currentSlots.find(s => s.time === timeString)) {
                            setAvailability(prev => ({
                              ...prev,
                              [dateKey]: {
                                date: dateKey,
                                slots: [...currentSlots, newSlot].sort((a, b) => {
                                  const timeA = new Date(`1970/01/01 ${a.time}`)
                                  const timeB = new Date(`1970/01/01 ${b.time}`)
                                  return timeA.getTime() - timeB.getTime()
                                })
                              }
                            }))
                            toast({
                              title: 'Time slot added',
                              description: `${timeString} has been added to your availability`
                            })
                          } else {
                            toast({
                              title: "Time slot already exists",
                              description: `${timeString} is already in your availability`,
                              variant: "destructive"
                            })
                          }
                          setCustomTime('')
                        }
                      }}
                      disabled={!customTime || !selectedDate}
                      className="px-4"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Copy From Date</label>
                  <Select value={copyFromDate} onValueChange={setCopyFromDate}>
                    <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map(dateKey => (
                        <SelectItem key={dateKey} value={dateKey}>
                          {new Date(dateKey).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {copyFromDate && (
                    <Button 
                      size="sm" 
                      onClick={handleCopyFromDate}
                      className="w-full h-10"
                      variant="outline"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
                

              </div>

              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Available Time Slots</h4>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleSelectAll}
                    variant="outline"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Toggle All
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleClearDay}
                    variant="outline"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getCurrentDateAvailability().filter((slot: TimeSlot) => {
                  const apiSlot = timeSlots.find((s: TimeSlot) => s.id === slot.id)
                  return !apiSlot || apiSlot.isAvailable
                }).map((slot: TimeSlot) => {
                  return (
                    <Button
                      key={slot.id}
                      variant={slot.isAvailable ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleSlotToggle(slot.id)}
                      className={`h-16 text-sm font-semibold transition-all duration-300 relative group ${
                        slot.isAvailable
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-lg scale-[1.02] border-green-600"
                          : "hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800 dark:border-slate-600 border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {slot.isAvailable && (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        <span>{slot.time}</span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            const dateKey = selectedDate!.toISOString().split('T')[0]
                            const currentSlots = getCurrentDateAvailability()
                            const updatedSlots = currentSlots.filter(s => s.id !== slot.id)
                            setAvailability(prev => ({
                              ...prev,
                              [dateKey]: {
                                date: dateKey,
                                slots: updatedSlots
                              }
                            }))
                            toast({
                              title: "Time slot removed",
                              description: `${slot.time} has been removed from your availability`
                            })
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-red-600"
                        >
                          ×
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                {getAvailableSlotCount() > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Availability Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Date:</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                          {formatSelectedDate(selectedDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Available Slots:</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                          {getAvailableSlotCount()} out of {getCurrentDateAvailability().length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handleSaveAvailability}
                    disabled={loading || getAvailableSlotCount() === 0}
                    className="flex-1 h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Save className="h-5 w-5" />
                        Save Availability
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleClearDay}
                    variant="outline"
                    className="h-12 px-6 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                    disabled={getAvailableSlotCount() === 0}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  
                  <Button
                    onClick={handleDeleteAvailability}
                    variant="outline"
                    className="h-12 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    disabled={loading || getCurrentDateAvailability().length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedDate && (
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Select a Date to Continue
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg">
                Choose a date from the calendar above to set your availability and manage your appointment time slots
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}