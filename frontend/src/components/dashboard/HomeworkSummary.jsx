import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import { formatDueDate, isOverdue } from '../../utils/date'
import { ROUTES } from '../../constants/routes'
import { cn } from '../../utils/cn'

function HomeworkSummary({ tasks }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-xs uppercase tracking-wider text-muted">Up next</p>
        <Link to={ROUTES.HOMEWORK} className="text-primary text-xs flex items-center gap-1 hover:underline">
          View all <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="font-body text-sm text-muted">Nothing pending — add a task to get started.</p>
      ) : (
        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between font-body text-sm gap-3">
              <span className="text-text truncate">{task.title}</span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-muted text-xs">{task.subject}</span>
                {task.due_date && (
                  <span className={cn('text-xs', isOverdue(task.due_date) ? 'text-danger' : 'text-muted')}>
                    {formatDueDate(task.due_date)}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default HomeworkSummary
