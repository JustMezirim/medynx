import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function BackNavigation() {
  return (
    <Link href="/dashboard/doctor/patients">
      <Button variant="ghost" size="sm" className="mb-4 hover:bg-slate-100">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Patients
      </Button>
    </Link>
  )
}