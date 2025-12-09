import type { LucideIcon } from "lucide-react"

interface BusinessCardProps {
  title: string
  count: string
  description: string
  icon: LucideIcon
  color: string
}

export default function BusinessCard({ title, count, description, icon: Icon, color }: BusinessCardProps) {
  return (
    <div className={`${color} rounded-lg p-6 border border-current border-opacity-20`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm opacity-75 mt-1">{description}</p>
        </div>
        <Icon size={28} />
      </div>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  )
}
