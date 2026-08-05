import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { ROUTES } from '../../constants/routes'

function UpcomingTests({ tests }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-xs uppercase tracking-wider text-muted">Mock tests ready</p>
        <Link to={ROUTES.MOCK_TESTS} className="text-primary text-xs flex items-center gap-1 hover:underline">
          View all <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>

      {tests.length === 0 ? (
        <p className="font-body text-sm text-muted">No mock tests available right now.</p>
      ) : (
        <ul className="space-y-2.5">
          {tests.slice(0, 4).map((test) => (
            <li key={test.id} className="flex items-center gap-2.5 font-body text-sm text-text">
              <ClipboardCheck className="w-3.5 h-3.5 text-secondary shrink-0" strokeWidth={2} aria-hidden="true" />
              <span className="truncate flex-1">{test.title}</span>
              <Badge tone="secondary">{test.subject}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default UpcomingTests
