import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, RefreshCw, Mail } from "lucide-react"

interface Payment {
  _id: string
  appointment: {
    patient: { firstName: string; lastName: string; email: string }
    doctor: { firstName: string; lastName: string }
    date: string
    time: string
  }
  amount: number
  status: string
  paymentMethod: string
  transactionId: string
  createdAt: string
  refundedAt?: string
  refundAmount?: number
}

interface PaymentDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  onProcessRefund: () => void
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
  getPaymentMethodIcon: (method: string) => React.ReactNode
}

export function PaymentDetailsModal({
  open,
  onOpenChange,
  payment,
  onProcessRefund,
  getStatusColor,
  getStatusIcon,
  getPaymentMethodIcon
}: PaymentDetailsModalProps) {
  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">₦</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ₦{payment.amount.toLocaleString()}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${getStatusColor(payment.status)} border font-medium`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1 capitalize">{payment.status}</span>
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="transaction" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
              <TabsTrigger value="appointment">Appointment</TabsTrigger>
              <TabsTrigger value="refund">Refund Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transaction" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Transaction ID</label>
                  <p className="text-lg font-semibold break-all">{payment.transactionId}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Payment Method</label>
                  <p className="text-lg font-semibold capitalize flex items-center gap-2">
                    {getPaymentMethodIcon(payment.paymentMethod)}
                    {payment.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Amount</label>
                  <p className="text-lg font-semibold text-emerald-600">₦{payment.amount.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Status</label>
                  <Badge className={`${getStatusColor(payment.status)} border font-medium`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1 capitalize">{payment.status}</span>
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Processing Date</label>
                <p className="text-lg font-semibold">{new Date(payment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="appointment" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                      {payment.appointment.patient.firstName[0]}{payment.appointment.patient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {payment.appointment.patient.firstName} {payment.appointment.patient.lastName}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {payment.appointment.patient.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Dr. {payment.appointment.doctor.firstName} {payment.appointment.doctor.lastName}
                    </p>
                    <p className="text-sm text-slate-500">Consulting Doctor</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(payment.appointment.date).toLocaleDateString()} at {payment.appointment.time}
                    </p>
                    <p className="text-sm text-slate-500">Appointment Schedule</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="refund" className="space-y-4 mt-6">
              {payment.refundedAt ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <RefreshCw className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-800 dark:text-purple-300">Refund Processed</p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">This payment has been refunded</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-purple-600 dark:text-purple-400">Refund Amount</label>
                        <p className="text-lg font-bold text-purple-800 dark:text-purple-300">
                          ₦{payment.refundAmount?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-purple-600 dark:text-purple-400">Refund Date</label>
                        <p className="text-lg font-bold text-purple-800 dark:text-purple-300">
                          {new Date(payment.refundedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Refund Information</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This payment has not been refunded.
                  </p>
                  {payment.status === "paid" && (
                    <Button className="mt-4" onClick={onProcessRefund}>
                      Process Refund
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}