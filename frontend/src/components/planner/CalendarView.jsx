import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { buildMonthGrid, buildWeekGrid, groupTasksByDate, dateKey, isSameDay } from '../../utils/planner'
import { cn } from '../../utils/cn'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function CalendarView({ tasks, selectedDate, onSelectDate }) {
  const [view, setView] = useState('month')
  const [anchor, setAnchor] = useState(new Date())

  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks])
  const today = new Date()

  const cells = useMemo(() => {
    if (view === 'week') return buildWeekGrid(anchor)
    return buildMonthGrid(anchor.getFullYear(), anchor.getMonth())
  }, [view, anchor])

  function navigate(delta) {
    const next = new Date(anchor)
    if (view === 'week') next.setDate(next.getDate() + delta * 7)
    else next.setMonth(next.getMonth() + delta)
    setAnchor(next)
  }

  const title =
    view === 'week'
      ? `Week of ${buildWeekGrid(anchor)[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      : anchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} aria-label="Previous">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <p className="font-body text-sm font-medium text-text min-w-[9rem] text-center">{title}</p>
          <Button variant="ghost" size="sm" onClick={() => navigate(1)} aria-label="Next">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex rounded-lg border border-border p-0.5">
          {['week', 'month'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1 rounded-md font-body text-xs capitalize transition',
                view === v ? 'bg-primary text-white' : 'text-muted hover:text-text'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-body text-[11px] text-muted">{d}</div>
        ))}
      </div>

      <div className={cn('grid grid-cols-7 gap-1.5', view === 'month' && 'auto-rows-fr')}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="invisible" />
          const key = dateKey(date)
          const dayTasks = tasksByDate.get(key) || []
          const isToday = isSameDay(date, today)
          const isSelected = selectedDate && isSameDay(date, selectedDate)

          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 font-mono text-xs transition',
                isSelected ? 'bg-primary text-white' : isToday ? 'bg-surface-2 text-primary ring-1 ring-primary/50' : 'text-muted hover:bg-surface-2 hover:text-text'
              )}
            >
              {date.getDate()}
              {dayTasks.length > 0 && (
                <span className={cn('w-1 h-1 rounded-full', isSelected ? 'bg-white' : 'bg-secondary')} />
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default CalendarView
