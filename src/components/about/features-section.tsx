"use client"

import { motion } from "framer-motion"
import { Monitor, Video, CreditCard, FileText } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Advanced Technology Stack",
      description: "Built with modern web technologies for optimal performance.",
      icon: Monitor,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Secure Video Consultations",
      description: "Powered by Zoom's enterprise infrastructure.",
      icon: Video,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Integrated Payment System",
      description: "Secure payment processing with Paystack integration for seamless transactions.",
      icon: CreditCard,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Digital Health Records",
      description: "Comprehensive medical record management with secure cloud storage.",
      icon: FileText,
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge technology and innovative features designed to enhance your healthcare experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}