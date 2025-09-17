"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white relative overflow-hidden">
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-6">
            Contact 
            <span className="block text-blue-200">Medynx</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Have questions about our platform? Need technical support? We&apos;re here to help you 
            get the most out of your healthcare experience.
          </p>
        </motion.div>
      </div>
    </section>
  )
}