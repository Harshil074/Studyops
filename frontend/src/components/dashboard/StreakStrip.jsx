import Card from '../ui/Card'
import { cn } from '../../utils/cn'

function StreakStrip({ streak }) {
  const days = Array.from({ length: 14 }, (_, i) => i < streak)

  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4">Last 14 days</p>
      <div className="flex gap-1.5" role="img" aria-label={`${streak} day streak out of the last 14 days`}>
        {days.map((filled, i) => (
          <div
            key={i}
            className={cn(
              'w-full h-5 rounded-md transition',
              filled ? 'bg-danger shadow-[0_0_12px_rgba(239,68,68,0.45)]' : 'bg-surface-2'
            )}
          />
        ))}
      </div>
    </Card>
  )
}

export default StreakStrip
