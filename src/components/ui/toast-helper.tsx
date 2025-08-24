import { toast } from "sonner"

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      style: {
        background: "#28a745",
        color: "white",
        border: "1px solid #059669"
      }
    })
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      style: {
        background: '#fa0202',
        color: 'white',
        border: '1px solid #dc2626'
      }
    })
  },
  
  warning: (message: string, description?: string) => {
    toast(message, {
      description,
      style: {
        background: '#f59e0b',
        color: 'white',
        border: '1px solid #d97706'
      }
    })
  },
  
  info: (message: string, description?: string) => {
    toast(message, {
      description,
      style: {
        background: '#ffcc26',
        color: 'white',
        border: '1px solid #ffcc26'
      }
    })
  }
}