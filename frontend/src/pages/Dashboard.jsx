import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { ReadyState } from 'react-use-websocket/dist/lib/constants'
import { useAuth } from '../context/AuthContext'
import { getProgressSummary } from '../api/progress'

function Dashboard() {
  const { logoutUser, token } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liveEvent, setLiveEvent] = useState(null)

  const wsUrl = token ? `ws://localhost:8000/ws/progress?token=${token}` : null

  const { lastJsonMessage, readyState } = useWebSocket(wsUrl, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  })

  const loadSummary = useCallback(async () => {
    try {
      const data = await getProgressSummary()
      setSummary(data)
    } catch (err) {
      console.error('Failed to load progress', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  // Whenever a WebSocket event arrives, re-fetch the summary and flash a notice
  useEffect(() => {
    if (lastJsonMessage) {
      setLiveEvent(lastJsonMessage)
      loadSummary()
      const timer = setTimeout(() => setLiveEvent(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [lastJsonMessage, loadSummary])

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  const connectionLabel = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Live',
    [ReadyState.CLOSING]: 'Closing...',
    [ReadyState.CLOSED]: 'Disconnected',
    [ReadyState.UNINSTANTIATED]: '—',
  }[readyState]

  const connectionColor = readyState === ReadyState.OPEN ? 'bg-green-500' : 'bg-slate-500'

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            Study<span className="text-blue-400">Ops</span> Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${connectionColor}`} />
            {connectionLabel}
          </div>
        </div>

        {liveEvent && (
          <div className="bg-blue-500/10 border border-blue-500 text-blue-300 text-sm rounded-lg px-4 py-2 mb-4">
            🔔 Live update: {liveEvent.event === 'homework_completed'
              ? `Homework completed — ${liveEvent.subject}`
              : liveEvent.event === 'mock_test_submitted'
                ? `Mock test submitted — scored ${liveEvent.score}/${liveEvent.total_questions}`
                : 'Progress updated'}
          </div>
        )}

        {loading ? (
          <p className="text-slate-400 text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Homework Completion</p>
              <p className="text-3xl font-bold text-white">{summary.completion_rate_pct}%</p>
              <p className="text-slate-500 text-xs mt-1">
                {summary.completed_homework_tasks}/{summary.total_homework_tasks} tasks
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-white">{summary.current_streak_days} 🔥</p>
              <p className="text-slate-500 text-xs mt-1">days in a row</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Mock Tests Taken</p>
              <p className="text-3xl font-bold text-white">{summary.mock_tests_taken}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Average Score</p>
              <p className="text-3xl font-bold text-white">{summary.average_mock_score_pct}%</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link to="/homework" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            Homework
          </Link>
          <Link to="/mock-tests" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            Mock Tests
          </Link>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition ml-auto">
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard