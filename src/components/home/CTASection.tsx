"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-black/10"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to Transform Your Healthcare Experience?
        </motion.h2>
        <motion.p 
          className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join thousands of patients who trust Medynx for their healthcare needs.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link href="/register">
            <motion.button 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "rgb(37, 99, 235)" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CTASection