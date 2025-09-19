"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Video } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white relative overflow-hidden">
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Video Consultations with 
              <span className="block text-blue-200">Certified Doctors</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Experience healthcare from the comfort of your home with our secure, 
              high-quality video consultation platform powered by Zoom integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <motion.button 
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Consultation
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="aspect-video bg-gray-900 rounded-xl mb-4 flex items-center justify-center">
                <Video className="w-16 h-16 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">HD Video Quality</h3>
                <p className="text-blue-100">Crystal clear consultations</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}