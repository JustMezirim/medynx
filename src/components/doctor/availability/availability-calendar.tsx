"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { AvailabilityStats } from "./availability-stats"
import { CalendarView } from "./calendar-view"
import { TimeSlotManager } from "./time-slot-manager"
import { EmptyDateState } from "./empty-date-state"

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

export default function DoctorAvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({})
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [copyFromDate, setCopyFromDate] = useState<string>("")
  const [customTime, setCustomTime] = useState<string>("")
  const [showStats, setShowStats] = useState(false)
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

  const handleAddCustomTime = () => {
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
  }

  const handleCopyFromDate = () => {
    if (!selectedDate || !copyFromDate) return
    
    const sourceDateAvailability = availability[copyFromDate]
    if (!sourceDateAvailability) {
      toast({
        title: 'No availability found',
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

  const weeklyStats = getWeeklyStats()

  return (
    <div className="max-w-10xl mx-auto p-6 space-y-8">
      <AvailabilityStats
        totalDays={Object.keys(availability).length}
        availableSlots={weeklyStats.availableSlots}
        utilization={weeklyStats.totalSlots > 0 ? Math.round((weeklyStats.availableSlots / weeklyStats.totalSlots) * 100) : 0}
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
      />

      <CalendarView
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        availability={availability}
      />

      {selectedDate ? (
        <TimeSlotManager
          ref={timeSlotsRef}
          selectedDate={selectedDate}
          timeSlots={getCurrentDateAvailability().filter((slot: TimeSlot) => {
            const apiSlot = timeSlots.find((s: TimeSlot) => s.id === slot.id)
            return !apiSlot || apiSlot.isAvailable
          })}
          availableSlotCount={getAvailableSlotCount()}
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
          customTime={customTime}
          setCustomTime={setCustomTime}
          copyFromDate={copyFromDate}
          setCopyFromDate={setCopyFromDate}
          availableDates={availableDates}
          loading={loading}
          onSlotToggle={handleSlotToggle}
          onSelectAll={handleSelectAll}
          onClearDay={handleClearDay}
          onPresetSchedule={handlePresetSchedule}
          onAddCustomTime={handleAddCustomTime}
          onCopyFromDate={handleCopyFromDate}
          onSaveAvailability={handleSaveAvailability}
          onDeleteAvailability={handleDeleteAvailability}
        />
      ) : (
        <EmptyDateState />
      )}
    </div>
  )
}