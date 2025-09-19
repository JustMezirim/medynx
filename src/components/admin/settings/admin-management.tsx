import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface AdminManagementProps {
  onAddAdmin: () => void
}

export function AdminManagement({ onAddAdmin }: AdminManagementProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-md dark:bg-slate-800/95 rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            Admin Management
          </div>
          <Button onClick={onAddAdmin} className="bg-violet-600 hover:bg-violet-700 text-white px-4 h-10">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create new administrator accounts with granular permissions to manage different aspects of the system.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}