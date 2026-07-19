import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { logoutUser } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome to <span className="text-blue-400">StudyOps</span>
      </h1>
      <p className="text-slate-400 mb-6">You're logged in. Homework, mock tests, and your live progress dashboard land here next.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
      >
        Log Out
      </button>
    </div>
  )
}

export default Dashboard
