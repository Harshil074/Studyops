import Card from '../ui/Card'
import { cn } from '../../utils/cn'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MiniCalendar({ dueDates }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = today.getDate()

  const dueDays = new Set(
    dueDates
      .map((d) => new Date(d))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate())
  )

  const cells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4">
        {today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      </p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-body text-[10px] text-muted">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              'aspect-square flex items-center justify-center rounded-md font-mono text-[11px]',
              day === null && 'invisible',
              day === todayDate ? 'bg-primary text-white font-semibold' : 'text-muted',
              day !== todayDate && day !== null && dueDays.has(day) && 'bg-surface-2 text-text ring-1 ring-secondary/60'
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-4 font-body text-[11px] text-muted">
        <span className="w-2.5 h-2.5 rounded-sm ring-1 ring-secondary/60 bg-surface-2 inline-block" />
        Due date
      </div>
    </Card>
  )
}

export default MiniCalendar
