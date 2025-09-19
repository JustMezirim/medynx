import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, CheckCircle, RefreshCw, Clock, TrendingUp } from "lucide-react"

interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  refundedAmount: number
  pendingPayments: number
}

interface PaymentStatsProps {
  stats?: PaymentStats
}

export function PaymentStatsCards({ stats }: PaymentStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-200 to-slate-300">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-300 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <span className="text-sm font-bold">₦</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₦{(stats?.totalRevenue || 0).toLocaleString()}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>All time earnings</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Transactions</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <CreditCard className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalTransactions || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Payment transactions</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Successful</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.successfulPayments || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>{(stats?.totalTransactions || 0) > 0 ? Math.round(((stats?.successfulPayments || 0) / (stats?.totalTransactions || 1)) * 100) : 0}% success rate</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Refunded</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <RefreshCw className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₦{(stats?.refundedAmount || 0).toLocaleString()}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Total refunds</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Pending</CardTitle>
          <div className="p-2 bg-white/20 rounded-lg">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.pendingPayments || 0}</div>
          <div className="flex items-center mt-2 text-xs opacity-80">
            <span>Awaiting processing</span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </Card>
    </div>
  )
}