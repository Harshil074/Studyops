import { useState, useEffect } from 'react'
import { getHomework, updateHomework } from '../api/homework'
import AppShell from '../components/layout/AppShell'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import CalendarView from '../components/planner/CalendarView'
import DayTasksPanel from '../components/planner/DayTasksPanel'
import UnscheduledList from '../components/planner/UnscheduledList'
import PomodoroTimer from '../components/planner/PomodoroTimer'

function Planner() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())

  async function loadTasks() {
    try {
      const data = await getHomework()
      setTasks(data)
    } catch {
      setError('Failed to load your schedule.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleReschedule(taskId, newDate) {
    try {
      await updateHomework(taskId, { due_date: newDate })
      loadTasks()
    } catch {
      setError('Failed to reschedule task.')
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner label="Loading your planner..." />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-6xl">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-text mb-6">Study Planner</h1>

        {error && (
          <Alert tone="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <CalendarView tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>
          <DayTasksPanel selectedDate={selectedDate} tasks={tasks} onReschedule={handleReschedule} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <UnscheduledList tasks={tasks} onSchedule={handleReschedule} />
          </div>
          <PomodoroTimer />
        </div>
      </div>
    </AppShell>
  )
}

export default Planner
