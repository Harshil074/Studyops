import { Link } from 'react-router-dom'
import { Circle, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { ROUTES } from '../../constants/routes'

function TodaysGoals({ goals }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-xs uppercase tracking-wider text-muted">Today's goals</p>
        {goals.length > 0 && <Badge tone="primary">{goals.length}</Badge>}
      </div>

      {goals.length === 0 ? (
        <p className="font-body text-sm text-muted">Nothing due today. Nice and clear.</p>
      ) : (
        <ul className="space-y-2.5">
          {goals.map((task) => (
            <li key={task.id} className="flex items-center gap-2.5 font-body text-sm text-text">
              <Circle className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2} aria-hidden="true" />
              <span className="truncate flex-1">{task.title}</span>
              <span className="text-muted text-xs shrink-0">{task.subject}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        to={ROUTES.HOMEWORK}
        className="mt-4 inline-flex items-center gap-1 text-primary text-xs hover:underline"
      >
        Go to homework <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </Link>
    </Card>
  )
}

export default TodaysGoals
