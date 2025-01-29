/* eslint-disable max-lines-per-function */
import {
  Edit,
  Trash,
  Save,
  CirclePlus,
  MonitorCheck,
  MonitorX,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function SettingsToolbar({
  saveAction,
  addAction,
  editAction,
  deleteAction,
  activationAction,
  desactivationAction,
  isActive,
}) {
  const actions = [
    {
      type: "edit",
      label: "Edit",
      icon: Edit,
      action: editAction,
    },
    {
      type: "delete",
      label: "Delete",
      icon: Trash,
      color: "text-red-500",
      action: deleteAction,
    },
    {
      type: "save",
      label: "Save",
      icon: Save,
      color: "text-green-500",
      action: saveAction,
    },
    {
      type: "add",
      label: "Add",
      icon: CirclePlus,
      action: addAction,
    },
    {
      type: "activate",
      label: "Activate",
      icon: MonitorCheck,
      color: "text-green-500",
      action: activationAction,
      condition: !isActive,
    },
    {
      type: "deactivate",
      label: "Deactivate",
      icon: MonitorX,
      color: "text-orange-500",
      action: desactivationAction,
      condition: isActive,
    },
  ]
  const visibleActions = actions.filter(
    ({ action, condition }) => action && condition !== false
  )

  return (
    <div className="inline-flex justify-center items-center border border-gray-200 p-2 rounded-lg">
      {visibleActions.map(
        ({ type, label, icon: Icon, color, action }, index) => (
          <div key={type} className="flex items-center">
            {index > 0 && (
              <Separator orientation="vertical" className="mx-2 h-4" />
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={action}
                  title={label}
                  className={`flex justify-center items-center ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      )}
    </div>
  )
}
