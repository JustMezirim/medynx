"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your account with basic information",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      color: "blue",
      side: "left"
    },
    {
      step: 2,
      title: "Browse Doctors",
      description: "Choose from verified specialists",
      icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "teal",
      side: "right"
    },
    {
      step: 3,
      title: "Book Appointment",
      description: "Select your preferred date and time",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "green",
      side: "left"
    },
    {
      step: 4,
      title: "Make Payment",
      description: "Secure payment via Paystack",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      color: "purple",
      side: "right"
    },
    {
      step: 5,
      title: "Join Video Call",
      description: "Connect with your doctor instantly",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      color: "orange",
      side: "left"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting healthcare has never been easier. Follow these simple steps to start your journey.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <div className="space-y-24">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                className={`flex items-center ${item.side === "left" ? "" : "flex-row-reverse"}`}
                initial={{ opacity: 0, x: item.side === 'left' ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`w-1/2 ${item.side === 'left' ? 'pr-12 text-right' : 'pl-12'}`}>
                  <motion.div 
                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`text-sm font-bold text-${item.color}-600 mb-2`}>STEP {item.step}</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-lg">{item.description}</p>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="relative flex-shrink-0 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full flex items-center justify-center shadow-xl`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <motion.div 
                    className={`absolute -top-2 -right-2 w-8 h-8 bg-${item.color}-100 rounded-full flex items-center justify-center`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className={`text-sm font-bold text-${item.color}-600`}>{item.step}</span>
                  </motion.div>
                </motion.div>
                
                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="absolute top-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"
            animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-20"
            animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div 
            className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-lg font-semibold text-gray-900">Ready to get started?</span>
            <Link href="/register">
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorksSection