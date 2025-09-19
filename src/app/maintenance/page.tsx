import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Clock, Mail } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Under Maintenance
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We&apos;re currently performing scheduled maintenance to improve your experience. 
            We&apos;ll be back online shortly.
          </p>
          
          <div className='flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4'>
            <Clock className="h-4 w-4" />
            <span>Expected downtime: 30 minutes</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Mail className="h-4 w-4" />
            <span>Contact: admin@Medynx.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}