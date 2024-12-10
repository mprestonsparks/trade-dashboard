'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  LineChart,
  History,
  Wallet,
  TrendingUp
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={cn("h-full overflow-auto py-6", className)}>
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            <Button 
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              API Status
            </Button>
            <Button 
              variant={pathname === "/market-analysis" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/market-analysis")}
            >
              <LineChart className="mr-2 h-4 w-4" />
              Market Analysis
            </Button>
            <Button 
              variant={pathname === "/trade-management" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/trade-management")}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Trade Management
            </Button>
            <Button 
              variant={pathname === "/trade-discovery" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push("/trade-discovery")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Trade Discovery
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">History</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <History className="mr-2 h-4 w-4" />
              Trade History
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
