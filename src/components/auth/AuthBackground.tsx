"use client"

import { motion } from "framer-motion"

interface AuthBackgroundProps {
  type: "login" | "register"
  width: "w-3/5" | "w-2/5"
}

const AuthBackground = ({ type, width }: AuthBackgroundProps) => {
  const isLogin = type === "login"
  
  return (
    <motion.div 
      className={`hidden lg:flex lg:${width} relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 overflow-hidden`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Patterns */}
      <div className="absolute inset-0">
        {isLogin ? (
          <svg className="w-full h-full opacity-20" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="3" fill="white" opacity="0.3"/>
                <path d="M20 50 L80 50 M50 20 L50 80" stroke="white" strokeWidth="1" opacity="0.2"/>
                <circle cx="20" cy="20" r="2" fill="white" opacity="0.2"/>
                <circle cx="80" cy="80" r="2" fill="white" opacity="0.2"/>
                <path d="M20 20 L50 50 L80 80" stroke="white" strokeWidth="0.5" opacity="0.15"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)"/>
          </svg>
        ) : (
          <svg className="w-full h-full opacity-20" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diamond-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,10 70,40 40,70 10,40" fill="none" stroke="white" strokeWidth="1" opacity="0.3"/>
                <circle cx="40" cy="40" r="2" fill="white" opacity="0.2"/>
                <path d="M40 20 L60 40 L40 60 L20 40 Z" fill="white" opacity="0.05"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diamond-pattern)"/>
          </svg>
        )}
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-16 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center"
        animate={{ y: [-20, 20, -20], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-20 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center"
        animate={{ y: [15, -15, 15], rotate: [360, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 8.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center"
        animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-16 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isLogin ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 8.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" : "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"}/>
            </svg>
          </div> */}
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            {isLogin ? (
              <>Welcome Back to<br/><span className="text-blue-200">Medynx</span></>
            ) : (
              <>Join the<br/><span className="text-teal-200">Medynx Family</span></>
            )}
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-md leading-relaxed">
            {isLogin 
              ? "Your trusted healthcare platform connecting you with verified doctors worldwide"
              : "Start your healthcare journey with thousands of verified doctors and trusted care"
            }
          </p>
          <div className={`grid ${isLogin ? "grid-cols-3" : "grid-cols-2"} gap-8 text-blue-100`}>
            {isLogin ? (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm">Happy Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1,200+</div>
                  <div className="text-sm">Verified Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">Secure</div>
                  <div className="text-sm">Bank-level encryption</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">Verified</div>
                  <div className="text-sm">Licensed doctors only</div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AuthBackground