"use client"

import { motion } from "framer-motion"

const StatsSection = () => {
  const stats = [
    { number: "50K+", label: "Happy Patients" },
    { number: "1,200+", label: "Verified Doctors" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join the growing community of patients who have chosen Medynx for their healthcare needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -10 }}
            >
              <motion.div 
                className="text-5xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection