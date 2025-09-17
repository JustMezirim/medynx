"use client"

import { useState, useCallback  } from "react"
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

interface MedicalFile {
  _id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  category: string
  description?: string
  patient: {
    firstName: string
    lastName: string
  }
  uploadedBy: {
    firstName: string
    lastName: string
    role: string
  }
  createdAt: string
}

export default function DoctorMedicalFilesPage() {
  const [files, setFiles] = useState<MedicalFile[]>([])
  const [loading, setLoading] = useState(true)
  // const [uploading, setUploading] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadForm, setShowUploadForm] = useState(false)

  const fetchMedicalFiles = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      })

      const response = await fetch(`/api/medical-files?${params}`)
      const data = await response.json()

      setFiles(data.files || [])
    } catch (error) {
      console.error("Error fetching medical files:", error)
      showToast.error("Failed to load medical files")
    } finally {
      // Loading handled by React Query
    }
  }, [categoryFilter])

  // Replaced with React Query

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "report":
        return "bg-blue-100 text-blue-800"
      case "prescription":
        return "bg-green-100 text-green-800"
      case "image":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${file.patient.firstName} ${file.patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
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

                          // Save file info to database
                          fetch("/api/medical-files", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              patientId,
                              fileName: res[0].name,
                              fileUrl: res[0].url,
                              fileType: res[0].type || "application/octet-stream",
                              fileSize: res[0].size,
                              category,
                              description,
                            }),
                          }).then(async (response) => {
                            if (response.ok) {
                              showToast.success("File uploaded successfully")
                              setShowUploadForm(false)
                              fetchMedicalFiles()
                            } else {
                              const data = await response.json()
                              showToast.error(data.message || "Upload failed")
                            }
                          })
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
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <Card key={file._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm truncate" title={file.fileName}>
                            {file.fileName}
                          </h3>
                          <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(file.category)}>{file.category}</Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {file.patient.firstName} {file.patient.lastName}
                        </span>
                      </div>
                      {file.description && <p className="text-sm text-gray-600 line-clamp-2">{file.description}</p>}
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      <p>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</p>
                      <p>
                        By: {file.uploadedBy.firstName} {file.uploadedBy.lastName}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(file.fileUrl, "_blank")}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medical files found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "No files match your search criteria."
                    : "Upload your first medical document to get started."}
                </p>
                {!searchTerm && categoryFilter === "all" && (
                  <Button onClick={() => setShowUploadForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload First File
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
