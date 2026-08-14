import { useState, useEffect, useCallback } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { ReadyState } from 'react-use-websocket/dist/lib/constants'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../api/auth'
import { getProgressSummary } from '../api/progress'
import { getHomework } from '../api/homework'
import { getMockTests } from '../api/mocktests'

export function useDashboardData() {
  const { token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [summary, setSummary] = useState(null)
  const [homework, setHomework] = useState([])
  const [mockTests, setMockTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [liveEvent, setLiveEvent] = useState(null)

  // Build the WS URL relative to wherever the app is actually being served from,
  // instead of hardcoding localhost:8000. This works for both local dev (Vite
  // proxies /api to the backend) and production (ALB routes /api/* to the
  // backend target group — the websocket route is mounted under /api too, at
  // /api/ws/progress, specifically so it matches that same ALB rule).
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = token ? `${wsProtocol}//${window.location.host}/api/ws/progress?token=${token}` : null
  const { lastJsonMessage, readyState } = useWebSocket(wsUrl, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  })

  const loadAll = useCallback(async () => {
    try {
      const [profileData, summaryData, homeworkData, mockTestsData] = await Promise.all([
        getProfile().catch(() => null),
        getProgressSummary(),
        getHomework(),
        getMockTests().catch(() => []),
      ])
      setProfile(profileData)
      setSummary(summaryData)
      setHomework(homeworkData)
      setMockTests(mockTestsData)
    } catch (err) {
      console.error('Failed to load dashboard', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    if (lastJsonMessage) {
      setLiveEvent(lastJsonMessage)
      loadAll()
      const timer = setTimeout(() => setLiveEvent(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [lastJsonMessage, loadAll])

  return {
    profile,
    summary,
    homework,
    mockTests,
    loading,
    liveEvent,
    isLive: readyState === ReadyState.OPEN,
  }
}
