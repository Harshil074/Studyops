import { useState, useEffect, useRef, useCallback } from 'react'

const DURATIONS = {
  work: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
}

export function usePomodoro() {
  const [phase, setPhase] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [completedWorkSessions, setCompletedWorkSessions] = useState(0)
  const intervalRef = useRef(null)

  const advancePhase = useCallback(() => {
    setPhase((prevPhase) => {
      let nextPhase
      if (prevPhase === 'work') {
        const nextCount = completedWorkSessions + 1
        setCompletedWorkSessions(nextCount)
        nextPhase = nextCount % 4 === 0 ? 'long_break' : 'short_break'
      } else {
        nextPhase = 'work'
      }
      setSecondsLeft(DURATIONS[nextPhase])
      return nextPhase
    })
    setIsRunning(false)
  }, [completedWorkSessions])

  useEffect(() => {
    if (!isRunning) return undefined

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          advancePhase()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning, advancePhase])

  function start() {
    setIsRunning(true)
  }
  function pause() {
    setIsRunning(false)
  }
  function reset() {
    setIsRunning(false)
    setSecondsLeft(DURATIONS[phase])
  }
  function skip() {
    advancePhase()
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const progressPct = Math.round(((DURATIONS[phase] - secondsLeft) / DURATIONS[phase]) * 100)

  return {
    phase,
    minutes,
    seconds,
    isRunning,
    completedWorkSessions,
    progressPct,
    start,
    pause,
    reset,
    skip,
  }
}
