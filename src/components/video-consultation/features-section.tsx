"use client"

import { motion } from "framer-motion"
import { Video, Shield, Clock, FileText, Calendar, Users } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: "HD Video Quality",
      description: "Crystal clear video calls with professional-grade quality for accurate consultations.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encrypted video calls ensuring complete privacy and compliance.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Connect with doctors anytime, anywhere. No more waiting rooms or travel time.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Receive digital prescriptions instantly and get medications delivered to your door.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments with real-time availability and automated reminders.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Users,
      title: "Multi-Specialist Access",
      description: "Connect with specialists across various medical fields from a single platform.",
      color: "from-pink-500 to-pink-600"
    }
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Video Consultations?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced technology meets healthcare expertise to deliver exceptional remote medical care
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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