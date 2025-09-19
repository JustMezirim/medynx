import mongoose from "mongoose"

const permissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  permissions: {
    // Dashboard access
    canAccessDashboard: { type: Boolean, default: true },
    
    // Appointment permissions
    canCreateAppointments: { type: Boolean, default: true },
    canViewAppointments: { type: Boolean, default: true },
    canCancelAppointments: { type: Boolean, default: true },
    canRescheduleAppointments: { type: Boolean, default: true },
    
    // Medical records
    canViewMedicalRecords: { type: Boolean, default: true },
    canEditMedicalRecords: { type: Boolean, default: false },
    canDownloadRecords: { type: Boolean, default: true },
    
    // Payment permissions
    canMakePayments: { type: Boolean, default: true },
    canViewPaymentHistory: { type: Boolean, default: true },
    canRequestRefunds: { type: Boolean, default: true },
    
    // Communication
    canSendMessages: { type: Boolean, default: true },
    canReceiveNotifications: { type: Boolean, default: true },
    
    // Profile management
    canEditProfile: { type: Boolean, default: true },
    canChangePassword: { type: Boolean, default: true },
    canDeleteAccount: { type: Boolean, default: false },
    
    // Doctor specific
    canManageAvailability: { type: Boolean, default: false },
    canViewPatientRecords: { type: Boolean, default: false },
    canPrescribeMedication: { type: Boolean, default: false },
    
    // Admin specific
    canManageUsers: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: false }
  }
}, {
  timestamps: true
})

const Permission = mongoose.models.Permission || mongoose.model("Permission", permissionSchema)

export default Permission