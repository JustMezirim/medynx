"use client"

import { motion } from "framer-motion"
import { Heart, Shield, Zap, Users } from "lucide-react"

export function ValuesSection() {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make is focused on improving patient outcomes and experiences.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We maintain the highest standards of data security and patient privacy protection.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to make healthcare more accessible and efficient.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Making quality healthcare available to everyone, regardless of location or circumstances.",
      color: "from-purple-500 to-purple-600"
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide everything we do and shape our commitment to excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <value.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}