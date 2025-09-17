import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface BulkAction {
  label: string
  icon: ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "destructive"
}

interface BulkActionsProps {
  selectedCount: number
  entityName: string
  actions: BulkAction[]
  onClearSelection: () => void
}

export function BulkActions({ 
  selectedCount, 
  entityName,
  actions,
  onClearSelection 
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-700">
              {selectedCount} {entityName}(s) selected
            </span>
            <div className="flex gap-2">
              {actions.map((action, index) => (
                <Button 
                  key={index}
                  size="sm" 
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onClearSelection}
          >
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}