import { useState, useEffect, useMemo, useCallback } from 'react'
import { getHomework, createHomework, updateHomework, deleteHomework } from '../api/homework'
import AppShell from '../components/layout/AppShell'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import HomeworkHeader from '../components/homework/HomeworkHeader'
import HomeworkFilters from '../components/homework/HomeworkFilters'
import AddTaskForm from '../components/homework/AddTaskForm'
import KanbanBoard from '../components/homework/KanbanBoard'
import { filterTasks, computeHomeworkStats, uniqueSubjects } from '../utils/homework'

function Homework() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [urgencyFilter, setUrgencyFilter] = useState('')

  const loadTasks = useCallback(async () => {
    try {
      const data = await getHomework()
      setTasks(data)
    } catch {
      setError('Failed to load homework.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleAdd = useCallback(
    async (values) => {
      try {
        await createHomework(values)
        loadTasks()
      } catch {
        setError('Failed to add task.')
      }
    },
    [loadTasks]
  )

  const handleToggle = useCallback(
    async (task) => {
      try {
        await updateHomework(task.id, { is_completed: !task.is_completed })
        loadTasks()
      } catch {
        setError('Failed to update task.')
      }
    },
    [loadTasks]
  )

  const handleDelete = useCallback(
    async (taskId) => {
      try {
        await deleteHomework(taskId)
        loadTasks()
      } catch {
        setError('Failed to delete task.')
      }
    },
    [loadTasks]
  )

  const stats = useMemo(() => computeHomeworkStats(tasks), [tasks])
  const subjects = useMemo(() => uniqueSubjects(tasks), [tasks])
  const visibleTasks = useMemo(
    () => filterTasks(tasks, { search, subject: subjectFilter, urgency: urgencyFilter }),
    [tasks, search, subjectFilter, urgencyFilter]
  )

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner label="Loading homework..." />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-6xl">
        <HomeworkHeader stats={stats} />

        {error && (
          <Alert tone="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <AddTaskForm onAdd={handleAdd} />

        <HomeworkFilters
          search={search}
          onSearchChange={setSearch}
          subject={subjectFilter}
          onSubjectChange={setSubjectFilter}
          urgency={urgencyFilter}
          onUrgencyChange={setUrgencyFilter}
          subjects={subjects}
        />

        {tasks.length === 0 ? (
          <p className="font-body text-sm text-muted text-center py-12">
            No homework yet. Add your first task above.
          </p>
        ) : visibleTasks.length === 0 ? (
          <p className="font-body text-sm text-muted text-center py-12">
            No tasks match your filters.
          </p>
        ) : (
          <KanbanBoard tasks={visibleTasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
    </AppShell>
  )
}

export default Homework
