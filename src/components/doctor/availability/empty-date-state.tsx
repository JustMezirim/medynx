import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function EmptyDateState() {
  return (
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
  )
}