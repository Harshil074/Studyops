/**
 * The backend homework schema is just { id, subject, title, due_date,
 * is_completed } — no priority or status field. "Urgency" here is a
 * transparent, recomputed-on-render label derived from due_date, not
 * something stored or editable. It's shown as a badge/filter, never as
 * an input in the create form, so nothing implies it's persisted.
 */
export function computeUrgency(task) {
  if (task.is_completed) return 'done'
  if (!task.due_date) return 'none'

  const due = new Date(task.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays <= 2) return 'high'
  if (diffDays <= 5) return 'medium'
  return 'low'
}

export function computeColumn(task) {
  if (task.is_completed) return 'completed'
  return computeUrgency(task) === 'overdue' ? 'overdue' : 'pending'
}

export function filterTasks(tasks, { search, subject, urgency }) {
  return tasks.filter((task) => {
    if (search && !`${task.title} ${task.subject}`.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (subject && task.subject !== subject) return false
    if (urgency && computeUrgency(task) !== urgency) return false
    return true
  })
}

export function computeHomeworkStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.is_completed).length
  const overdue = tasks.filter((t) => computeUrgency(t) === 'overdue').length
  const pct = total ? Math.round((completed / total) * 100) : 0
  return { total, completed, overdue, pct }
}

export function uniqueSubjects(tasks) {
  return Array.from(new Set(tasks.map((t) => t.subject))).sort()
}
