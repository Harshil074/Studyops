import { memo } from 'react'
import { ClipboardList, Clock, BarChart3 } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const DIFFICULTY_TONE = { easy: 'success', medium: 'accent', hard: 'danger' }

function TestCard({ test, lastScorePct, onStart }) {
  const questionCount = test.question_count ?? test.questions?.length
  const difficulty = test.difficulty
  const timeLimit = test.time_limit_minutes

  return (
    <Card hoverLift className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-text mb-1">{test.title}</h3>
          <Badge tone="primary">{test.subject}</Badge>
        </div>
        {difficulty && (
          <Badge tone={DIFFICULTY_TONE[difficulty.toLowerCase()] || 'neutral'} className="capitalize shrink-0">
            {difficulty}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4 font-body text-xs text-muted">
        {questionCount != null && (
          <span className="flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" /> {questionCount} questions
          </span>
        )}
        {timeLimit != null && (
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {timeLimit} min
          </span>
        )}
        {lastScorePct != null && (
          <span className="flex items-center gap-1.5 text-accent">
            <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" /> Last: {lastScorePct}%
          </span>
        )}
      </div>

      <Button onClick={() => onStart(test.id)} className="justify-center mt-auto">
        Take test
      </Button>
    </Card>
  )
}

export default memo(TestCard)
