"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PaymentStatsCards } from "@/components/admin/payments/payment-stats"
import { PaymentFilters } from "@/components/admin/payments/payment-filters"
import { PaymentsList } from "@/components/admin/payments/payments-list"
import { LoadingSpinner } from "@/components/admin"
import { PaymentDetailsModal } from "@/components/admin/payments/payment-details-modal"
import { RefundDialog } from "@/components/admin/payments/refund-dialog"
import { Pagination } from "@/components/admin/payments/pagination"
import { Calendar, User, RefreshCw, CreditCard, AlertCircle, CheckCircle, XCircle, Clock, Mail, FileText } from 'lucide-react'
import { showToast } from '@/components/ui/toast-helper'

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

interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  refundedAmount: number
  pendingPayments: number
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulPayments: 0,
    refundedAmount: 0,
    pendingPayments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [refundingPayment, setRefundingPayment] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [searchTerm, statusFilter, currentPage])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "5",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      })
      const response = await fetch(`/api/admin/payments?${params}`)
      const data = await response.json()
      if (response.ok) {
        setPayments(data.payments || [])
        setStats(data.stats || stats)
        setTotalPages(data.pagination?.pages || 1)
      } else {
        showToast.error(data.message || "Failed to load payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      showToast.error("Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (paymentId: string) => {
    setRefundingPayment(paymentId)
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: "POST",
      })
      if (response.ok) {
        showToast.success("Refund processed successfully")
        fetchPayments()
      } else {
        const data = await response.json()
        showToast.error(data.message || "Failed to process refund")
      }
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
      const response = await fetch("/api/admin/payments/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        showToast.success("Payment data exported successfully")
      } else {
        showToast.error("Failed to export payment data")
      }
    } catch (error) {
      console.error("Error exporting payments:", error)
      showToast.error("Failed to export payment data")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "refunded":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "card":
      case "credit_card":
      case "debit_card":
        return <CreditCard className="h-4 w-4" />
      default:
        return <span className="text-sm font-bold">₦</span>
    }
  }

  if (loading && payments.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar userRole="admin" userName="Admin User" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Payment Management" 
          subtitle="Monitor and manage all payment transactions" 
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
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
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
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
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
