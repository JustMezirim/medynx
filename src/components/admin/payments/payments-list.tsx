import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RefreshCw, Eye, Mail, User, FileText, Calendar } from "lucide-react"

interface Payment {
  _id: string
  appointment: {
    _id: string
    patient: {
      firstName: string
      lastName: string
      email: string
    }
    doctor: {
      firstName: string
      lastName: string
    }
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

interface PaymentsListProps {
  payments: Payment[]
  onViewDetails: (payment: Payment) => void
  onRefund: (payment: Payment) => void
  refundingPayment: string | null
  getStatusColor: (status: string) => string
  getStatusIcon: (status: string) => React.ReactNode
  getPaymentMethodIcon: (method: string) => React.ReactNode
}

export function PaymentsList({
  payments,
  onViewDetails,
  onRefund,
  refundingPayment,
  getStatusColor,
  getStatusIcon,
  getPaymentMethodIcon
}: PaymentsListProps) {
  return (
    <div className="space-y-6">
      {payments.map((payment) => (
        <Card key={payment._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 hover:scale-[1.01] hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6 flex-1">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">₦</span>
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs ${
                    payment.status === 'paid' ? 'bg-emerald-500' : 
                    payment.status === 'pending' ? 'bg-amber-500' : 
                    payment.status === 'failed' ? 'bg-red-500' : 'bg-purple-500'
                  }`}>
                    {getStatusIcon(payment.status)}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        ₦{payment.amount.toLocaleString()}
                      </h3>
                      <Badge className={`${getStatusColor(payment.status)} border font-medium px-3 py-1`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(payment)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
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
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {payment.transactionId}
                          </p>
                          <p className="text-sm text-slate-500">Transaction ID</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-slate-500">Payment Method</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <Calendar className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {payment.appointment.date} at {payment.appointment.time}
                          </p>
                          <p className="text-sm text-slate-500">Appointment Date</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {payment.refundedAt && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <RefreshCw className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-800 dark:text-purple-300">
                            Refunded: ₦{payment.refundAmount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            Processed on {new Date(payment.refundedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-500">
                      Payment processed on {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {payment.status === 'paid' && !payment.refundedAt && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
                        onClick={() => onRefund(payment)}
                        disabled={refundingPayment === payment._id}
                      >
                        {refundingPayment === payment._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Process Refund
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}