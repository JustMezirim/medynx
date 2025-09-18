interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address?: string
  lastAppointment: string
  appointmentsCount: number
  lastStatus: string
}

interface PatientDetails extends Patient {
  appointments?: Appointment[]
}

interface Appointment {
  _id: string
  date: string
  timeSlot: string
  status: string
  type: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
}

interface PatientsResponse {
  patients: Patient[]
  total: number
}

interface PatientDetailsResponse {
  patient: PatientDetails
  appointments: Appointment[]
}

export const doctorPatientsApi = {
  getPatients: async (): Promise<PatientsResponse> => {
    const response = await fetch("/api/doctor/patients")
    if (!response.ok) throw new Error("Failed to fetch patients")
    return response.json()
  },

  getPatientDetails: async (patientId: string): Promise<PatientDetailsResponse> => {
    const [patientRes, appointmentsRes] = await Promise.all([
      fetch(`/api/doctor/patients/${patientId}`),
      fetch(`/api/appointments?patientId=${patientId}`)
    ])

    if (!patientRes.ok) throw new Error("Failed to fetch patient details")
    
    const patientData = await patientRes.json()
    const appointmentsData = appointmentsRes.ok ? await appointmentsRes.json() : { appointments: [] }

    return {
      patient: patientData.patient,
      appointments: appointmentsData.appointments || []
    }
  },
}

export type { Patient, PatientDetails, Appointment, PatientsResponse, PatientDetailsResponse }