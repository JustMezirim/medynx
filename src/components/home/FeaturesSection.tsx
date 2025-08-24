"use client"

import { motion } from "framer-motion"

const FeaturesSection = () => {
  const features = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Instant Consultations",
      description: "Connect with doctors in minutes, not hours. Get immediate medical advice when you need it most.",
      color: "blue"
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Secure & Private",
      description: "Your health data is protected with bank-level security and complete privacy compliance.",
      color: "teal"
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
      title: "Affordable Care",
      description: "Quality healthcare shouldn't break the bank. Transparent pricing with no hidden fees.",
      color: "green"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Medynx?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience healthcare like never before with our innovative platform designed for modern patients
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/home-image.webp"
              alt="Healthcare technology dashboard"
              className="w-full h-auto rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-3">
                {/* <motion.div 
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                > */}
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                {/* </motion.div> */}
                <div>
                  <div className="font-semibold text-gray-900">24/7 Available</div>
                  <div className="text-sm text-gray-600">Always here for you</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg className={`w-6 h-6 text-${feature.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection