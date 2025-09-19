// Appointment status colors
export const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
    case "no-show":
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
  }
}

// Payment status colors
export const getPaymentStatusColor = (status: string) => {
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

// Doctor status colors
export const getDoctorStatusColor = (isVerified: boolean, isActive: boolean) => {
  if (!isVerified) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
  if (!isActive) return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
  return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
}

// Doctor status text
export const getDoctorStatusText = (isVerified: boolean, isActive: boolean) => {
  if (!isVerified) return "Pending"
  if (!isActive) return "Inactive"
  return "Verified"
}

// Appointment status colors for doctor view
export const getNotificationStatusColor = (type: string) => {
  switch (type) {
    case 'appointment': return { bg: 'bg-blue-50', dot: 'bg-blue-500' }
    case 'payment': return { bg: 'bg-green-50', dot: 'bg-green-500' }
    case 'system': return { bg: 'bg-purple-50', dot: 'bg-purple-500' }
    case 'reminder': return { bg: 'bg-yellow-50', dot: 'bg-yellow-500' }
    default: return { bg: 'bg-gray-50', dot: 'bg-gray-500' }
  }
}

export const getAppointmentStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

// Appointment status icons
export const getAppointmentStatusIcon = (status: string) => {
  // const iconProps = { className: "h-3 w-3" }
  switch (status) {
    case "confirmed":
      return "check"
    case "pending":
      return "clock"
    case "completed":
      return "file-text"
    case "cancelled":
      return "x"
    default:
      return "activity"
  }
}

// Appointment status icon components
export const getAppointmentStatusIconComponent = (status: string) => {
  // const iconProps = { className: "h-3 w-3" }
  const iconProps = { className: "h-3 w-3" }
  switch (status) {
    case "confirmed":
      return <Check {...iconProps} />
    case "pending":
      return <Clock {...iconProps} />
    case "completed":
      return <FileText {...iconProps} />
    case "cancelled":
      return <X {...iconProps} />
    default:
      return <Activity {...iconProps} />
  }
}

// Import required icons
import { Check, X, Activity, Clock, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, CreditCard } from "lucide-react"

// Medical file category colors
export const getCategoryColor = (category: string) => {
  switch (category) {
    case "report":
      return "bg-blue-100 text-blue-800"
    case "prescription":
      return "bg-green-100 text-green-800"
    case "image":
      return "bg-purple-100 text-purple-800"
    case "document":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Payment status icon components
export const getPaymentStatusIcon = (status: string) => {
  const iconProps = { className: "h-4 w-4" }
  switch (status) {
    case "paid":
      return <CheckCircle {...iconProps} />
    case "pending":
      return <Clock {...iconProps} />
    case "failed":
      return <XCircle {...iconProps} />
    case "refunded":
      return <RefreshCw {...iconProps} />
    default:
      return <AlertCircle {...iconProps} />
  }
}

// Payment method icon components
export const getPaymentMethodIcon = (method: string) => {
  const iconProps = { className: "h-4 w-4" }
  switch (method.toLowerCase()) {
    case "card":
    case "credit_card":
    case "debit_card":
      return <CreditCard {...iconProps} />
    default:
      return <span className="text-sm font-bold">₦</span>
  }
}

// Role color utility
export const getRoleColor = (role: string) => {
  switch (role) {
    case "admin": return "bg-red-100 text-red-800"
    case "doctor": return "bg-blue-100 text-blue-800"
    case "patient": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

// Medical file category color utility
export const getMedicalFileCategoryColor = (category: string) => {
  switch (category) {
    case "report": return "bg-blue-100 text-blue-800"
    case "prescription": return "bg-green-100 text-green-800"
    case "image": return "bg-purple-100 text-purple-800"
    case "document": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

// File size formatter
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}