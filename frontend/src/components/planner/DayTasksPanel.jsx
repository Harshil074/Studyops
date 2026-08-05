import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { dateKey } from '../../utils/planner'

function DayTasksPanel({ selectedDate, tasks, onReschedule }) {
  const key = selectedDate ? dateKey(selectedDate) : null
  const dayTasks = tasks.filter((t) => t.due_date === key)

  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4">
        {selectedDate
          ? selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
          : 'Select a day'}
      </p>

      {!selectedDate ? (
        <p className="font-body text-sm text-muted">Pick a date on the calendar to see or reschedule tasks.</p>
      ) : dayTasks.length === 0 ? (
        <p className="font-body text-sm text-muted">Nothing due this day.</p>
      ) : (
        <ul className="space-y-3">
          {dayTasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-body text-sm text-text truncate">{task.title}</p>
                <Badge tone="primary" className="mt-1">{task.subject}</Badge>
              </div>
              <input
                type="date"
                defaultValue={task.due_date}
                onChange={(e) => e.target.value && onReschedule(task.id, e.target.value)}
                aria-label={`Reschedule ${task.title}`}
                className="rounded-lg bg-surface-2 border border-border text-text font-body text-xs px-2 py-1.5 outline-none focus:border-primary shrink-0"
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default DayTasksPanel
