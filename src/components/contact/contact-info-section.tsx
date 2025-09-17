"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function ContactInfoSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+234 717 123 4567",
      description: "Available 24/7 for emergencies",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "medynxcare@gmail.com",
      description: "Response within 24 hours",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: "Galadimawa, Medical District",
      description: "Abuja, Nigeria",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Fri: 8:00 AM - 8:00 PM",
      description: "Sat - Sun: 9:00 AM - 5:00 PM",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <section className='py-20'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Multiple ways to reach our support team for assistance with your healthcare needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <info.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
              <p className="text-blue-600 font-medium mb-2">{info.details}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}