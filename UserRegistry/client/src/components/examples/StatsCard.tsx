import StatsCard from '../StatsCard'
import { Users, Store, Star } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <StatsCard 
          title="Total Users" 
          value={1234} 
          icon={Users}
          description="+12% from last month"
        />
        <StatsCard 
          title="Total Stores" 
          value={89} 
          icon={Store}
          description="+5 new stores"
        />
        <StatsCard 
          title="Total Ratings" 
          value="5.2K" 
          icon={Star}
          description="+234 this week"
        />
      </div>
    </div>
  )
}
