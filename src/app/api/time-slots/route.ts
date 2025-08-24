import { NextRequest, NextResponse } from "next/server"
import moment from "moment"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const startHour = parseInt(searchParams.get("startHour") || "9")
    const endHour = parseInt(searchParams.get("endHour") || "17")
    const intervalMinutes = parseInt(searchParams.get("intervalMinutes") || "30")

    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 })
    }

    const selectedDate = moment(date)
    const currentTime = moment()
    const isToday = selectedDate.isSame(currentTime, "day")
    
    const slots = []
    const start = selectedDate.clone().hour(startHour).minute(0).second(0)
    const end = selectedDate.clone().hour(endHour).minute(0).second(0)

    let id = 1
    while (start.isBefore(end)) {
      const isPastTime = isToday && start.isSameOrBefore(currentTime)
      
      slots.push({
        id: `slot-${id}`,
        time: start.format('h:mm A'),
        isAvailable: !isPastTime
      })
      start.add(intervalMinutes, 'minutes')
      id++
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Error generating time slots:', error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}