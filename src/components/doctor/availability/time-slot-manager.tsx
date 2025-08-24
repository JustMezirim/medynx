import { forwardRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, RotateCcw, Save, Copy, Trash2 } from "lucide-react"

interface TimeSlot {
  id: string
  time: string
  isAvailable: boolean
}

interface TimeSlotManagerProps {
  selectedDate: Date
  timeSlots: TimeSlot[]
  availableSlotCount: number
  selectedPreset: string
  setSelectedPreset: (preset: string) => void
  customTime: string
  setCustomTime: (time: string) => void
  copyFromDate: string
  setCopyFromDate: (date: string) => void
  availableDates: string[]
  loading: boolean
  onSlotToggle: (slotId: string) => void
  onSelectAll: () => void
  onClearDay: () => void
  onPresetSchedule: (preset: string) => void
  onAddCustomTime: () => void
  onCopyFromDate: () => void
  onSaveAvailability: () => void
  onDeleteAvailability: () => void
}

const presetSchedules = {
  "morning": { start: 9, end: 13, name: "Morning (9 AM - 1 PM)" },
  "afternoon": { start: 14, end: 18, name: "Afternoon (2 PM - 6 PM)" },
  "evening": { start: 18, end: 22, name: "Evening (6 PM - 10 PM)" },
  "fullday": { start: 9, end: 17, name: "Full Day (9 AM - 5 PM)" }
}

export const TimeSlotManager = forwardRef<HTMLDivElement, TimeSlotManagerProps>(({
  selectedDate,
  timeSlots,
  availableSlotCount,
  selectedPreset,
  setSelectedPreset,
  customTime,
  setCustomTime,
  copyFromDate,
  setCopyFromDate,
  availableDates,
  loading,
  onSlotToggle,
  onSelectAll,
  onClearDay,
  onPresetSchedule,
  onAddCustomTime,
  onCopyFromDate,
  onSaveAvailability,
  onDeleteAvailability
}, ref) => {
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card ref={ref} className='border-0 shadow-lg bg-white dark:bg-slate-900'>
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
            {availableSlotCount} slots available
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
                  onClick={() => onPresetSchedule(selectedPreset)}
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
                  onClick={onAddCustomTime}
                  disabled={!customTime}
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
                  onClick={onCopyFromDate}
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
                onClick={onSelectAll}
                variant="outline"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Toggle All
              </Button>
              <Button 
                size="sm" 
                onClick={onClearDay}
                variant="outline"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {timeSlots.map((slot) => (
              <Button
                key={slot.id}
                variant={slot.isAvailable ? "default" : "outline"}
                size="lg"
                onClick={() => onSlotToggle(slot.id)}
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
                </div>
              </Button>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            {availableSlotCount > 0 && (
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
                      {availableSlotCount} out of {timeSlots.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={onSaveAvailability}
                disabled={loading || availableSlotCount === 0}
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
                onClick={onClearDay}
                variant="outline"
                className="h-12 px-6 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                disabled={availableSlotCount === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
              
              <Button
                onClick={onDeleteAvailability}
                variant="outline"
                className="h-12 px-6 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                disabled={loading || timeSlots.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})