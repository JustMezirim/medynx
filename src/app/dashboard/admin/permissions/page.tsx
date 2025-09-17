"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  isVerified?: boolean
}

interface AdminUser extends User {
  canManageDoctors?: boolean
  canManagePatients?: boolean
  canViewAllAppointments?: boolean
  canManagePayments?: boolean
  canManageSettings?: boolean
  canManagePermissions?: boolean
}

export default function PermissionsPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users.filter((user: User) => user.role === 'admin'))
      }
    } catch {
      showToast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = async (userId: string, permission: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [permission]: !currentValue })
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, [permission]: !currentValue } : user
        ))
        showToast.success('Permission updated successfully')
      }
    } catch {
      showToast.error('Failed to update permission')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar userRole="admin" userName="Admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="admin" userName="Admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">User Permissions</h1>
            </div>
            
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Admin Permissions Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin User</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Doctors</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Patients</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Appointments</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Payments</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Settings</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Permissions</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Checkbox 
                              checked={user.canManageDoctors || false} 
                              onCheckedChange={() => togglePermission(user._id, 'canManageDoctors', user.canManageDoctors || false)} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Checkbox 
                              checked={user.canManagePatients || false} 
                              onCheckedChange={() => togglePermission(user._id, 'canManagePatients', user.canManagePatients || false)} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Checkbox 
                              checked={user.canViewAllAppointments || false} 
                              onCheckedChange={() => togglePermission(user._id, 'canViewAllAppointments', user.canViewAllAppointments || false)} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Checkbox 
                              checked={user.canManagePayments || false} 
                              onCheckedChange={() => togglePermission(user._id, 'canManagePayments', user.canManagePayments || false)} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Checkbox 
                              checked={user.canManageSettings || false} 
                              onCheckedChange={() => togglePermission(user._id, 'canManageSettings', user.canManageSettings || false)} 
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Checkbox 
                              checked={user.canManagePermissions || false} 
                              onCheckedChange={() => togglePermission(user._id, 'canManagePermissions', user.canManagePermissions || false)} 
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}