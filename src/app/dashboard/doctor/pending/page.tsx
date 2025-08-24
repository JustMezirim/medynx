"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DoctorPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Medynx</span>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
            <CardDescription>
              Your doctor account is currently under review by our admin team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Registration Complete</p>
                  <p className="text-sm text-gray-600">Your account has been successfully created</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Under Review</p>
                  <p className="text-sm text-gray-600">Our team is verifying your credentials</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-400">Email Notification</p>
                  <p className="text-sm text-gray-500">You'll receive an email once approved</p>
                </div>
              </div>
            </div>

            <div className='bg-blue-50 p-4 rounded-lg'>
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Admin reviews your credentials</li>
                <li>• Account activation (usually within 24-48 hours)</li>
                <li>• Email notification sent to you</li>
                <li>• Full access to doctor dashboard</li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/api/auth/logout">
                <Button variant="outline" className="w-full">
                  Logout
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}