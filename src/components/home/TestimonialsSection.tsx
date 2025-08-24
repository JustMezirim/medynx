"use client"

import { motion } from "framer-motion"

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Medynx made it so easy to connect with a specialist. I got the care I needed without leaving my home. Highly recommend!",
      name: "Sarah Johnson",
      // role: "Marketing Manager",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      text: "The doctors are professional and caring. The platform is user-friendly and booking appointments is a breeze.",
      name: "Michael James",
      // role: "Software Engineer",
      gradient: "from-teal-50 to-teal-100"
    },
    {
      text: "Amazing service! I was able to get my lab results quickly and the doctor explained everything clearly. Five stars!",
      name: "Favour Benjamin",
      // role: "Teacher",
      gradient: "from-green-50 to-green-100"
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real patients who have transformed their healthcare experience with Medynx
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className={`bg-gradient-to-br ${testimonial.gradient} p-8 rounded-2xl`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="flex items-center mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.svg 
                    key={i} 
                    className="w-5 h-5 text-yellow-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.2 + 0.4 + i * 0.1 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </motion.div>
              <p className="text-gray-700 mb-6">{testimonial.text}</p>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
              >
                <motion.img
                  src="/placeholder.svg?height=50&width=50"
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  {/* <div className="text-sm text-gray-600">{testimonial.role}</div> */}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection