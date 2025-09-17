"use client"

import { motion } from "framer-motion"
import { Calendar, Video, Users, FileText } from "lucide-react"

export function HowItWorksSection() {
  const howItWorks = [
    {
      step: 1,
      title: "Book Appointment",
      description: "Choose your preferred doctor and schedule a convenient time slot.",
      icon: Calendar,
      color: "from-blue-500 to-blue-600"
    },
    {
      step: 2,
      title: "Join Video Call",
      description: "Click the meeting link sent to your email or access through your dashboard.",
      icon: Video,
      color: "from-green-500 to-green-600"
    },
    {
      step: 3,
      title: "Consult with Doctor",
      description: "Have your consultation with HD video quality and secure communication.",
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    {
      step: 4,
      title: "Receive Care Plan",
      description: "Get digital prescriptions, follow-up instructions, and medical records.",
      icon: FileText,
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How Video Consultations Work</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect with healthcare professionals from anywhere
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-sm font-bold text-blue-600 mb-2">STEP {step.step}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}