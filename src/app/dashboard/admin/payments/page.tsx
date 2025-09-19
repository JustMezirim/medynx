"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PaymentStatsCards } from "@/components/admin/payments/payment-stats"
import { PaymentFilters } from "@/components/admin/payments/payment-filters"
import { PaymentsList } from "@/components/admin/payments/payments-list"
import { LoadingSpinner } from "@/components/admin"
import { PaymentDetailsModal } from "@/components/admin/payments/payment-details-modal"
import { RefundDialog } from "@/components/admin/payments/refund-dialog"
import { Pagination } from "@/components/admin/payments/pagination"
import { showToast } from '@/components/ui/toast-helper'
import { getPaymentStatusColor, getPaymentStatusIcon, getPaymentMethodIcon } from '@/components/ui/status-colors'
import { usePayments, usePaymentStats, useProcessRefund } from '@/hooks/admin/use-payments'
import { paymentsApi } from '@/lib/api/admin/payments'

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



export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [refundingPayment, setRefundingPayment] = useState<string | null>(null)

  const { data: paymentsData, isLoading } = usePayments({
    page: currentPage,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: searchTerm,
    status: statusFilter,
  })

  const { data: stats } = usePaymentStats()
  const processRefund = useProcessRefund()

  const payments = paymentsData?.payments || []
  const totalPages = paymentsData?.pagination?.pages || 1

  const handleRefund = async (paymentId: string) => {
    setRefundingPayment(paymentId)
    try {
      await processRefund.mutateAsync({ id: paymentId, data: {} })
      showToast.success("Refund processed successfully")
    } catch (error) {
      console.error("Error processing refund:", error)
      showToast.error("Failed to process refund")
    } finally {
      setRefundingPayment(null)
      setShowRefundDialog(false)
    }
  }

  const exportPayments = async () => {
    try {
      const blob = await paymentsApi.exportPayments()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      showToast.success("Payment data exported successfully")
    } catch (error) {
      console.error("Error exporting payments:", error)
      showToast.error("Failed to export payment data")
    }
  }





  if (isLoading && payments.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title="Payment Management" 
          // subtitle="Monitor and manage all payment transactions" 
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          <PaymentStatsCards stats={stats} />

          <PaymentFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onExport={exportPayments}
          />

          {payments.length > 0 ? (
            <>
              <PaymentsList
                payments={payments}
                onViewDetails={(payment) => {
                  setSelectedPayment(payment)
                  setShowPaymentModal(true)
                }}
                onRefund={(payment) => {
                  setSelectedPayment(payment)
                  setShowRefundDialog(true)
                }}
                refundingPayment={refundingPayment}
                getStatusColor={getPaymentStatusColor}
                getStatusIcon={getPaymentStatusIcon}
                getPaymentMethodIcon={getPaymentMethodIcon}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-slate-400">₦</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No payments found</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "No payments match your search criteria. Try adjusting your filters."
                    : "No payments have been processed yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <PaymentDetailsModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        payment={selectedPayment}
        onProcessRefund={() => {
          setShowPaymentModal(false)
          setShowRefundDialog(true)
        }}
        getStatusColor={getPaymentStatusColor}
        getStatusIcon={getPaymentStatusIcon}
        getPaymentMethodIcon={getPaymentMethodIcon}
      />

      <RefundDialog
        open={showRefundDialog}
        onOpenChange={setShowRefundDialog}
        payment={selectedPayment}
        onConfirm={handleRefund}
        isProcessing={refundingPayment === selectedPayment?._id}
      />
    </div>
  )
}
