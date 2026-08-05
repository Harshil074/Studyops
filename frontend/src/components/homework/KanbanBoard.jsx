import { AnimatePresence } from 'framer-motion'
import TaskCard from './TaskCard'
import { computeColumn } from '../../utils/homework'

const COLUMNS = [
  { id: 'overdue', label: 'Overdue', dot: 'bg-danger' },
  { id: 'pending', label: 'Pending', dot: 'bg-secondary' },
  { id: 'completed', label: 'Completed', dot: 'bg-success' },
]

function KanbanBoard({ tasks, onToggle, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => computeColumn(t) === col.id)
        return (
          <div key={col.id} className="min-w-0">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`w-2 h-2 rounded-full ${col.dot}`} aria-hidden="true" />
              <h2 className="font-body text-sm font-medium text-text">{col.label}</h2>
              <span className="font-mono text-xs text-muted">{colTasks.length}</span>
            </div>
            <div className="flex flex-col gap-3 min-h-[80px]">
              <AnimatePresence mode="popLayout">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </AnimatePresence>
              {colTasks.length === 0 && (
                <p className="font-body text-xs text-muted px-1">Nothing here.</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanBoard
