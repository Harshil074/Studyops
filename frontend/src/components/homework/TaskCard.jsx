import { memo } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Square, Trash2 } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import UrgencyBadge from './UrgencyBadge'
import { computeUrgency } from '../../utils/homework'
import { formatDueDate } from '../../utils/date'
import { cn } from '../../utils/cn'

function TaskCard({ task, onToggle, onDelete }) {
  const urgency = computeUrgency(task)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onToggle(task)}
            aria-label={task.is_completed ? 'Mark as not done' : 'Mark as done'}
            className="mt-0.5 shrink-0 text-muted hover:text-primary transition"
          >
            {task.is_completed ? (
              <CheckSquare className="w-4 h-4 text-success" strokeWidth={2} />
            ) : (
              <Square className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
          <p className={cn('font-body text-sm flex-1', task.is_completed ? 'text-muted line-through' : 'text-text')}>
            {task.title}
          </p>
          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Delete ${task.title}`}
            className="shrink-0 text-muted hover:text-danger transition"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge tone="primary">{task.subject}</Badge>
          <div className="flex items-center gap-2">
            {task.due_date && (
              <span className="font-body text-xs text-muted">{formatDueDate(task.due_date)}</span>
            )}
            <UrgencyBadge urgency={urgency} />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default memo(TaskCard)
