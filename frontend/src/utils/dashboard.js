/**
 * Everything in this file derives from real backend data (/homework,
 * /progress/summary). None of it is fetched from a dedicated endpoint —
 * the backend doesn't have goals/XP/AI-suggestion endpoints yet, so
 * rather than inventing API calls, these are honest client-side
 * computations over data StudyOps already has. If/when the backend
 * grows dedicated endpoints for these, swap the computation for a fetch.
 */

export function computeTodaysGoals(homework) {
  const today = new Date().toISOString().slice(0, 10)
  return homework.filter((task) => !task.is_completed && task.due_date === today)
}

export function computeSubjectBreakdown(homework) {
  const bySubject = new Map()
  for (const task of homework) {
    const entry = bySubject.get(task.subject) || { subject: task.subject, total: 0, completed: 0 }
    entry.total += 1
    if (task.is_completed) entry.completed += 1
    bySubject.set(task.subject, entry)
  }
  return Array.from(bySubject.values())
    .map((s) => ({ ...s, pct: s.total ? Math.round((s.completed / s.total) * 100) : 0 }))
    .sort((a, b) => b.total - a.total)
}

const LEVEL_XP_STEP = 200

export function computeGamification(summary) {
  if (!summary) return { xp: 0, level: 1, levelProgressPct: 0, xpToNext: LEVEL_XP_STEP }

  // A simple, transparent formula over real numbers — not stored anywhere,
  // recomputed each load so it always reflects actual progress.
  const xp =
    summary.completed_homework_tasks * 15 +
    summary.mock_tests_taken * 40 +
    summary.current_streak_days * 10

  const level = Math.floor(xp / LEVEL_XP_STEP) + 1
  const xpIntoLevel = xp % LEVEL_XP_STEP
  const levelProgressPct = Math.round((xpIntoLevel / LEVEL_XP_STEP) * 100)

  return { xp, level, levelProgressPct, xpToNext: LEVEL_XP_STEP - xpIntoLevel }
}

export function computeBadges(summary) {
  if (!summary) return []
  const badges = []
  if (summary.current_streak_days >= 7) badges.push({ id: 'streak-7', label: '7-day streak' })
  if (summary.completed_homework_tasks >= 10) badges.push({ id: 'homework-10', label: '10 tasks done' })
  if (summary.mock_tests_taken >= 5) badges.push({ id: 'tests-5', label: '5 mock tests' })
  if (summary.average_mock_score_pct >= 90) badges.push({ id: 'high-scorer', label: 'High scorer' })
  return badges
}

export function computeSuggestions(summary, subjectBreakdown, todaysGoals) {
  const suggestions = []

  if (todaysGoals.length > 0) {
    suggestions.push(`You have ${todaysGoals.length} task${todaysGoals.length > 1 ? 's' : ''} due today — knock those out first.`)
  }

  const weakest = [...subjectBreakdown].filter((s) => s.total >= 2).sort((a, b) => a.pct - b.pct)[0]
  if (weakest && weakest.pct < 60) {
    suggestions.push(`${weakest.subject} completion is at ${weakest.pct}% — worth carving out extra time this week.`)
  }

  if (summary && summary.current_streak_days === 0) {
    suggestions.push('Your streak reset — complete one task today to start a new one.')
  }

  if (summary && summary.mock_tests_taken < 3) {
    suggestions.push('Try a mock test this week to get a feel for exam pacing.')
  }

  if (suggestions.length === 0) {
    suggestions.push("You're on track — nothing urgent right now. Keep the streak going.")
  }

  return suggestions.slice(0, 3)
}
