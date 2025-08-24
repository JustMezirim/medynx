import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, UserPlus, Search, Calendar, Video, FileText, CreditCard } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Medynx</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Medynx Works
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with qualified doctors and manage your healthcare journey through our simple and secure platform.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Step 1 - Patient */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>For Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Register as a patient to access healthcare services and connect with doctors.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Create patient account</li>
                  <li>• Access patient dashboard</li>
                  <li>• Manage health records</li>
                  <li>• Book appointments</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2 - Doctor */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>For Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Join as a healthcare provider to offer your services to patients.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Register as doctor</li>
                  <li>• Get verified by admin</li>
                  <li>• Access doctor dashboard</li>
                  <li>• Manage appointments</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3 - Connection */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Connect & Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Patients find doctors and schedule appointments for consultations.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Browse available doctors</li>
                  <li>• View doctor profiles</li>
                  <li>• Schedule appointments</li>
                  <li>• Secure communication</li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 4 - Healthcare */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Healthcare Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Receive quality healthcare services and maintain your medical records.
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Attend consultations</li>
                  <li>• Receive prescriptions</li>
                  <li>• Track medical history</li>
                  <li>• Follow-up care</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust Medynx for their healthcare needs.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="mr-4">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}