"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DoctorSearchFilters, DoctorCard } from "@/components/patient"
import { Search } from "lucide-react"

interface Doctor {
  _id: string
  firstName: string
  lastName: string
  specialization: string
  experience: number
  rating: number
  consultationFee: number
  bio: string
  isVerified: boolean
  totalPatients?: number
  nextAvailable?: string
  languages?: string[]
  education?: string
  workingHours?: {
    [key: string]: { start: string; end: string }
  }
}

export default function FindDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>([])



  useEffect(() => {
    fetchDoctors()
    loadFavorites()
  }, [searchTerm, selectedSpecialization, sortBy, priceRange, availabilityFilter, currentPage])

  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteDoctors')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleFavorite = (doctorId: string) => {
    const newFavorites = favorites.includes(doctorId)
      ? favorites.filter(id => id !== doctorId)
      : [...favorites, doctorId]
    
    setFavorites(newFavorites)
    localStorage.setItem('favoriteDoctors', JSON.stringify(newFavorites))
  }

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(selectedSpecialization !== "all" && { specialization: selectedSpecialization }),
        ...(searchTerm && { search: searchTerm }),
        ...(sortBy && { sortBy }),
        ...(priceRange !== "all" && { priceRange }),
        ...(availabilityFilter !== "all" && { availability: availabilityFilter }),
      })

      const response = await fetch(`/api/doctors?${params}`)
      const data = await response.json()

      setDoctors(data.doctors || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchDoctors()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="patient" userName="John Doe" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Find Doctors"
          subtitle="Browse and book appointments with qualified healthcare professionals"
        />

        <main className="flex-1 overflow-y-auto p-6">
          <DoctorSearchFilters
            searchTerm={searchTerm}
            selectedSpecialization={selectedSpecialization}
            sortBy={sortBy}
            priceRange={priceRange}
            availabilityFilter={availabilityFilter}
            viewMode={viewMode}
            onSearchChange={setSearchTerm}
            onSpecializationChange={setSelectedSpecialization}
            onSortChange={setSortBy}
            onPriceRangeChange={setPriceRange}
            onAvailabilityChange={setAvailabilityFilter}
            onViewModeChange={setViewMode}
            onSubmit={handleSearch}
          />

          {!loading && doctors.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Found {doctors.length} doctors
              </p>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <>
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    viewMode={viewMode}
                    isFavorite={favorites.includes(doctor._id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all doctors.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSpecialization("all")
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
