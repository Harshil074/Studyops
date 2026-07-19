import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHomework, createHomework, updateHomework, deleteHomework } from '../api/homework'

function Homework() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadTasks() {
    try {
      const data = await getHomework()
      setTasks(data)
    } catch (err) {
      setError('Failed to load homework.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createHomework({ subject, title, due_date: dueDate || null })
      setSubject('')
      setTitle('')
      setDueDate('')
      loadTasks()
    } catch (err) {
      setError('Failed to add task.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(task) {
    try {
      await updateHomework(task.id, { is_completed: !task.is_completed })
      loadTasks()
    } catch (err) {
      setError('Failed to update task.')
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteHomework(taskId)
      loadTasks()
    } catch (err) {
      setError('Failed to delete task.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            Study<span className="text-blue-400">Ops</span> — Homework
          </h1>
          <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm">
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} className="bg-slate-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
          >
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {loading ? (
          <p className="text-slate-400 text-center">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-slate-400 text-center">No homework yet. Add your first task above.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => handleToggle(task)}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <div>
                    <p className={`text-white ${task.is_completed ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {task.subject}
                      {task.due_date && ` · due ${task.due_date}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Homework
