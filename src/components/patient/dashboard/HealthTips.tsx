import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, TrendingUp, Clock } from "lucide-react"

export function HealthTips() {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Daily Health Tips
        </CardTitle>
        <CardDescription>Personalized recommendations for better health</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-900 mb-3">Stay Hydrated</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Drink at least 8 glasses of water daily to maintain optimal health and energy levels.
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-green-900 mb-3">Regular Exercise</h4>
            <p className="text-sm text-green-700 leading-relaxed">
              Aim for 30 minutes of moderate exercise most days of the week for better cardiovascular health.
            </p>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-purple-900 mb-3">Quality Sleep</h4>
            <p className="text-sm text-purple-700 leading-relaxed">
              Get 7-9 hours of quality sleep each night for better recovery and mental clarity.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}