"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { useRegister, useSpecializations } from "@/hooks/useAuth"
import { EmailVerification } from "./EmailVerification"
import { ArrowLeft, ArrowRight, Eye, EyeOff, User, Shield, FileText } from "lucide-react"

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<'register' | 'verify' | 'complete'>('register')
  const registerMutation = useRegister()
  const { data: specializations = [] } = useSpecializations()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    // Patient fields
    dateOfBirth: "",
    gender: "",
    address: "",
    // Doctor fields
    specialization: "",
    licenseNumber: "",
    experience: "",
    bio: ""
  })
  const router = useRouter()

  const totalSteps = 3



  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone)
      case 2:
        return !!(formData.password && formData.role)
      case 3:
        if (formData.role === "patient") {
          return !!(formData.dateOfBirth && formData.gender && formData.address)
        }
        if (formData.role === "doctor") {
          return !!(formData.specialization && formData.licenseNumber && formData.experience)
        }
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Send OTP for email verification
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, type: 'email_verification' })
        })
        
        // Redirect to verification page with email parameter
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`
      } else {
        console.error('Registration failed:', data.message)
      }
    } catch {
      // Error handling
    }
  }

  if (step === 'verify') {
    return (
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-gray-50">
        <EmailVerification
          email={formData.email}
          onVerified={() => setStep('complete')}
          // onBack={() => setStep('register')}
        />
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Your email has been verified. You can now login to your account.
            </p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div 
      className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-gray-50 relative overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="organic-waves" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30 Q15 15 30 30 T60 30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
              <path d="M0 45 Q15 30 30 45 T60 45" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
              <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#organic-waves)"/>
        </svg>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        {/* <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        > */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          {/* <motion.div 
            className="flex items-center space-x-4 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medynx</h1>
              <p className="text-blue-600 font-medium">Healthcare Platform</p>
            </div>
          </motion.div> */}
        {/* </motion.div> */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Create your account</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Step {currentStep} of {totalSteps} - Join Medynx to start your healthcare journey
              </CardDescription>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              
              {/* Step Indicators */}
              <div className="flex justify-center space-x-8 mt-6">
                {[1, 2, 3].map((step) => {
                  const icons = [User, Shield, FileText]
                  const Icon = icons[step - 1]
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs mt-2 transition-colors duration-300 ${
                        currentStep >= step ? 'text-blue-600 font-semibold' : 'text-gray-400'
                      }`}>
                        {step === 1 ? 'Basic Info' : step === 2 ? 'Account' : 'Details'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-5">
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-700 font-semibold">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={formData.firstName}
                            onChange={(e) => updateFormData('firstName', e.target.value)}
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray-700 font-semibold">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={formData.lastName}
                            onChange={(e) => updateFormData('lastName', e.target.value)}
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Account Setup */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg pr-11"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-700 font-semibold">I am a</Label>
                        <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                          <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="patient">Patient</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Role-specific Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      {formData.role === "patient" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="dateOfBirth" className="text-gray-700 font-semibold">Date of Birth</Label>
                              <Input 
                                id="dateOfBirth" 
                                type="date" 
                                value={formData.dateOfBirth}
                                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gender" className="text-gray-700 font-semibold">Gender</Label>
                              <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-700 font-semibold">Address</Label>
                            <Textarea 
                              id="address" 
                              rows={3} 
                              value={formData.address}
                              onChange={(e) => updateFormData('address', e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            />
                          </div>
                        </>
                      )}

                      {formData.role === "doctor" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="specialization" className="text-gray-700 font-semibold">Specialization</Label>
                            <Select value={formData.specialization} onValueChange={(value) => updateFormData("specialization", value)}>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                                <SelectValue placeholder="Select specialization" />
                              </SelectTrigger>
                              <SelectContent>
                                {specializations.map((spec: { name: string }, index: number) => (
                                  <SelectItem key={`${spec.name}-${index}`} value={spec.name}>
                                    {spec.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="licenseNumber" className="text-gray-700 font-semibold">License Number</Label>
                              <Input 
                                id="licenseNumber" 
                                value={formData.licenseNumber}
                                onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="experience" className="text-gray-700 font-semibold">Years of Experience</Label>
                              <Input 
                                id="experience" 
                                type="number" 
                                min="0" 
                                value={formData.experience}
                                onChange={(e) => updateFormData('experience', e.target.value)}
                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio" className="text-gray-700 font-semibold">Bio</Label>
                            <Textarea 
                              id="bio" 
                              rows={3} 
                              placeholder="Tell us about yourself..." 
                              value={formData.bio}
                              onChange={(e) => updateFormData('bio', e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!validateStep(currentStep) || registerMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create account"}
                    </Button>
                  )}
                </div>
              </div>

              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default RegisterForm