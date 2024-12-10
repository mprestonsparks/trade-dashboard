import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ApiMenuBarProps {
  apiType: 'market-analysis' | 'trade-manager' | 'trade-discovery'
}

const menuItems = {
  'market-analysis': [
    { label: 'Market State', icon: Icons.chartLine },
    { label: 'Trading Signals', icon: Icons.signal },
    { label: 'Risk Analysis', icon: Icons.alertTriangle },
  ],
  'trade-manager': [
    { label: 'Active Trades', icon: Icons.activity },
    { label: 'Trade History', icon: Icons.history },
    { label: 'Performance', icon: Icons.trendingUp },
  ],
  'trade-discovery': [
    { label: 'Opportunities', icon: Icons.search },
    { label: 'Watchlist', icon: Icons.eye },
    { label: 'Alerts', icon: Icons.bell },
  ],
}

export function ApiMenuBar({ apiType }: ApiMenuBarProps) {
  const items = menuItems[apiType]

  return (
    <div className="flex items-center space-x-2 border-b border-border p-2">
      {items.map((item) => (
        <Button
          key={item.label}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Icons.moreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Icons.refresh className="mr-2 h-4 w-4" />
            Refresh
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Icons.settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
