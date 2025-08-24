import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Payment {
  _id: string
  appointment: {
    patient: { firstName: string; lastName: string }
  }
  amount: number
}

interface RefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  onConfirm: (paymentId: string) => void
  isProcessing: boolean
}

export function RefundDialog({
  open,
  onOpenChange,
  payment,
  onConfirm,
  isProcessing
}: RefundDialogProps) {
  if (!payment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Are you sure you want to process a refund for this payment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Payment Amount</p>
                <p className="text-2xl font-bold text-emerald-600">₦{payment.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Patient</p>
                <p className="text-slate-600">
                  {payment.appointment.patient.firstName} {payment.appointment.patient.lastName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => onConfirm(payment._id)}
            disabled={isProcessing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Process Refund
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}