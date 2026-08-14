import Card from '../ui/Card'
import Badge from '../ui/Badge'

function UnscheduledList({ tasks, onSchedule }) {
  const unscheduled = tasks.filter((t) => !t.due_date && !t.is_completed)

  if (unscheduled.length === 0) return null

  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4">
        Unscheduled tasks ({unscheduled.length})
      </p>
      <ul className="space-y-3">
        {unscheduled.map((task) => (
          <li key={task.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-body text-sm text-text truncate">{task.title}</p>
              <Badge tone="neutral" className="mt-1">{task.subject}</Badge>
            </div>
            <input
              type="date"
              onChange={(e) => e.target.value && onSchedule(task.id, e.target.value)}
              aria-label={`Schedule ${task.title}`}
              className="rounded-lg bg-surface-2 border border-border text-text font-body text-xs px-2 py-1.5 outline-none focus:border-primary shrink-0"
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default UnscheduledList
