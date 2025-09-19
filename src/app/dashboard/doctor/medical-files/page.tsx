"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { FileText, Download, Eye, Plus, Search, User } from "lucide-react"
import { showToast } from "@/components/ui/toast-helper"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { useMedicalFiles, useUploadMedicalFile } from "@/hooks/doctor/use-medical-files"
import { getCategoryColor, formatFileSize } from "@/components/ui/status-colors"


export default function DoctorMedicalFilesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadForm, setShowUploadForm] = useState(false)

  const { data, isLoading } = useMedicalFiles(categoryFilter)
  const uploadMutation = useUploadMedicalFile()

  const files = data?.files || []

  const filteredFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${file.patient.firstName} ${file.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar userRole="doctor" userName="Dr. Sarah Johnson" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading medical files...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="doctor" userName="Dr. Sarah Johnson" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          // title="Medical Files" 
          // subtitle="Manage patient medical documents and reports"
        />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Actions Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search files or patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="report">Medical Reports</SelectItem>
                      <SelectItem value="prescription">Prescriptions</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => setShowUploadForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Form */}
          {showUploadForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upload Medical File</CardTitle>
                <CardDescription>Add a medical document for a patient</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient</Label>
                      <Select name="patientId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">John Doe</SelectItem>
                          <SelectItem value="2">Jane Smith</SelectItem>
                          <SelectItem value="3">Mike Johnson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="report">Medical Report</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="image">Medical Image</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Brief description of the file" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <UploadButton<OurFileRouter, "medicalFileUploader">
                      endpoint="medicalFileUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          const formData = new FormData(document.querySelector("form") as HTMLFormElement)
                          const patientId = formData.get("patientId") as string
                          const category = formData.get("category") as string
                          const description = formData.get("description") as string

                          if (!patientId || !category || !description) {
                            showToast.error("Please fill in all required fields")
                            return
                          }

                          uploadMutation.mutate({
                            patientId,
                            category,
                            description,
                            fileName: res[0].name,
                            fileUrl: res[0].url,
                            fileType: res[0].type || "application/octet-stream",
                            fileSize: res[0].size,
                          })

                          setShowUploadForm(false)
                        }
                      }}
                      onUploadError={(error: Error) => {
                        showToast.error(`Upload failed: ${error.message}`)
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Files Grid */}
          <div className="grid gap-4">
            {filteredFiles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No medical files found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || categoryFilter !== "all"
                      ? "No files match your current filters."
                      : "Upload your first medical file to get started."}
                  </p>
                  <Button onClick={() => setShowUploadForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFiles.map((file) => (
                <Card key={file._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900 truncate">{file.fileName}</h3>
                            <Badge className={getCategoryColor(file.category)}>
                              {file.category}
                            </Badge>
                          </div>
                          
                          {file.description && (
                            <p className="text-sm text-gray-600 mb-2">{file.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{file.patient.firstName} {file.patient.lastName}</span>
                            </div>
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline" asChild>
                          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={file.fileUrl} download={file.fileName}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
