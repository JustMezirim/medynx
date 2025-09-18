"use client"

import { useState, useEffect, useRef } from "react"
import { showToast } from "@/components/ui/toast-helper"
import { formatDateForStorage } from "@/lib/date-utils"
import { formatTime, formatDate } from "@/lib/utils"
import { AvailabilityStats } from "./availability-stats"
import { CalendarView } from "./calendar-view"
import { TimeSlotManager } from "./time-slot-manager"
import { EmptyDateState } from "./empty-date-state"
import { useDoctorAvailability, useTimeSlots, useSaveAvailability, useDeleteAvailability } from '@/hooks/doctor/use-doctor-availability'

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



const presetSchedules = {
  "morning": { start: 9, end: 13, name: "Morning (9 AM - 1 PM)" },
  "afternoon": { start: 14, end: 18, name: "Afternoon (2 PM - 6 PM)" },
  "evening": { start: 18, end: 22, name: "Evening (6 PM - 10 PM)" },
  "fullday": { start: 9, end: 17, name: "Full Day (9 AM - 5 PM)" }
}

export default function DoctorAvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>({})
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [copyFromDate, setCopyFromDate] = useState<string>("")
  const [customTime, setCustomTime] = useState<string>("")
  const [showStats, setShowStats] = useState(false)
  const timeSlotsRef = useRef<HTMLDivElement>(null)

  const { data: availabilityData } = useDoctorAvailability()
  const { data: timeSlotsData } = useTimeSlots(selectedDate)
  const saveAvailability = useSaveAvailability()
  const deleteAvailability = useDeleteAvailability()

  const timeSlots = timeSlotsData?.slots || []


  const getWeeklyStats = () => {
    const today = new Date()
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date.toISOString().split('T')[0]
    })
    
    const totalSlots = weekDates.reduce((acc, date) => {
      const dayAvailability = availability[date]
      return acc + (dayAvailability?.slots.length || 0)
    }, 0)
    
    const availableSlots = weekDates.reduce((acc, date) => {
      const dayAvailability = availability[date]
      return acc + (dayAvailability?.slots.filter(slot => slot.isAvailable).length || 0)
    }, 0)
    
    return { totalSlots, availableSlots, weekDates: weekDates.length }
  }

  // Process availability data from React Query
  useEffect(() => {
    if (availabilityData?.availabilities) {
      const availabilityMap: Record<string, DayAvailability> = {}
      
      availabilityData.availabilities.forEach((avail: { date: string; timeSlots: { time: string; isBooked: boolean }[] }) => {
        // Use the date string directly without timezone conversion
        const dateKey = avail.date.split('T')[0] // Handle both YYYY-MM-DD and ISO formats
        availabilityMap[dateKey] = {
          date: dateKey,
          slots: avail.timeSlots.map((slot: { time: string; isBooked: boolean }) => ({
            id: `slot-${slot.time}`,
            time: slot.time,
            isAvailable: !slot.isBooked
          }))
        }
      })
      
      setAvailability(availabilityMap)
    }
  }, [availabilityData])

  // Initialize availability when time slots are loaded
  useEffect(() => {
    if (selectedDate && timeSlots.length > 0) {
      const dateKey = formatDateForStorage(selectedDate)
      if (!availability[dateKey]) {
        setAvailability(prev => ({
          ...prev,
          [dateKey]: {
            date: dateKey,
            slots: timeSlots.map((slot: TimeSlot) => ({
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
  }, [selectedDate, timeSlots, availability])

  const getCurrentDateAvailability = (): TimeSlot[] => {
    if (!selectedDate) return timeSlots
    
    const dateKey = formatDateForStorage(selectedDate)
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
    
    const dateKey = formatDateForStorage(selectedDate)
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
    
    const dateKey = formatDateForStorage(selectedDate)
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

  const handlePresetSchedule = (preset: string) => {
    if (!selectedDate || !presetSchedules[preset as keyof typeof presetSchedules]) return
    
    const currentSlots = getCurrentDateAvailability()
    const updatedSlots = currentSlots.map((slot: TimeSlot) => ({
      ...slot,
      isAvailable: slot.isAvailable
    }))
    
    const dateKey = formatDateForStorage(selectedDate)
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
      const timeString = formatTime(customTime)
      
      const currentSlots = getCurrentDateAvailability()
      const newSlot = {
        id: `slot-${timeString}`,
        time: timeString,
        isAvailable: true
      }
      
      if (!currentSlots.find(s => s.time === timeString)) {
        const dateKey = formatDateForStorage(selectedDate)
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
        showToast.success(`${timeString} has been added to your availability`)
      } else {
        showToast.error(`${timeString} is already in your availability`)
      }
      setCustomTime('')
    }
  }

  const handleCopyFromDate = () => {
    if (!selectedDate || !copyFromDate) return
    
    const sourceDateAvailability = availability[copyFromDate]
    if (!sourceDateAvailability) {
      showToast.error("No availability found for the selected date")
      return
    }
    
    const dateKey = formatDateForStorage(selectedDate)
    setAvailability(prev => ({
      ...prev,
      [dateKey]: {
        date: dateKey,
        slots: [...sourceDateAvailability.slots]
      }
    }))
    
    setCopyFromDate('')
    showToast.success("Availability has been successfully copied")
  }

  const handleSaveAvailability = async () => {
    if (!selectedDate) {
      showToast.error("Please select a date first")
      return
    }
    
    try {
      const currentSlots = getCurrentDateAvailability()
      
      const timeSlots = currentSlots
        .filter((slot: TimeSlot) => slot.isAvailable)
        .map((slot: TimeSlot) => ({
          time: slot.time,
          isBooked: false
        }))
      
      await saveAvailability.mutateAsync({
        date: formatDateForStorage(selectedDate),
        timeSlots
      })
      
      showToast.success("Your availability has been updated successfully")
    } catch (error) {
      console.error('Error saving availability:', error)
      showToast.error("Failed to save availability")
    }
  }

  const handleClearDay = () => {
    if (!selectedDate) return
    
    const dateKey = formatDateForStorage(selectedDate)
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
    
    try {
      const dateKey = formatDateForStorage(selectedDate)
      
      await deleteAvailability.mutateAsync(dateKey)
      
      // Remove from local state
      setAvailability(prev => {
        const newAvailability = { ...prev }
        delete newAvailability[dateKey]
        return newAvailability
      })
      
      showToast.success("Your availability for this date has been completely removed")
    } catch (error) {
      console.error('Error deleting availability:', error)
      showToast.error("Failed to delete availability")
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
          loading={saveAvailability.isPending || deleteAvailability.isPending}
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