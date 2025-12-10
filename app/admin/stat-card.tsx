import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  change: string
  color: string
}

export default function StatCard({ icon: Icon, label, value, change, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{change}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}
