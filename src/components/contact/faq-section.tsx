"use client"

import { motion } from "framer-motion"

export function FAQSection() {
  const faqs = [
    {
      question: "How do I book a video consultation?",
      answer: "Simply register on our platform, browse available doctors, select your preferred time slot, and complete the payment. You'll receive a Zoom link via email."
    },
    {
      question: "Is my medical information secure?",
      answer: "Yes, we use bank-level encryption and are fully compliant. All your medical data is stored securely and never shared without your consent."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital wallets through our secure Paystack integration."
    },
    {
      question: "Can I get a prescription through video consultation?",
      answer: "Yes, licensed doctors can prescribe medications during video consultations. Digital prescriptions are sent directly to your preferred pharmacy."
    },
    {
      question: "What if I need to cancel my appointment?",
      answer: "You can cancel appointments up to 24 hours in advance through your dashboard. Refunds are processed according to our cancellation policy."
    },
    {
      question: "Do you offer emergency consultations?",
      answer: "For life-threatening emergencies, please call 911. For urgent but non-emergency medical issues, our 24/7 hotline connects you with available doctors."
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quick answers to common questions about Medynx platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}