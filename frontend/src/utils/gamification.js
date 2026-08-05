import { Flame, CheckCircle2, Trophy, ClipboardCheck, Star } from 'lucide-react'

/**
 * XP/levels/badges are NOT backend concepts today — there is no
 * gamification endpoint. Everything here is computed client-side from
 * the real numbers /progress/summary already returns, so it's honest
 * (no invented stats) even though it's not persisted anywhere.
 */
export function computeXp(summary) {
  if (!summary) return 0
  return (
    summary.completed_homework_tasks * 10 +
    summary.mock_tests_taken * 25 +
    summary.current_streak_days * 5
  )
}

export function computeLevel(xp) {
  return Math.floor(xp / 200) + 1
}

export function xpIntoLevel(xp) {
  return xp % 200
}

export function getAchievements(summary) {
  if (!summary) return []
  const badges = []
  if (summary.current_streak_days >= 3) badges.push({ id: 'streak3', label: '3-Day Streak', icon: Flame })
  if (summary.current_streak_days >= 7) badges.push({ id: 'streak7', label: '7-Day Streak', icon: Flame })
  if (summary.completed_homework_tasks >= 10) badges.push({ id: 'tasks10', label: '10 Tasks Done', icon: CheckCircle2 })
  if (summary.completed_homework_tasks >= 50) badges.push({ id: 'tasks50', label: '50 Tasks Done', icon: Trophy })
  if (summary.mock_tests_taken >= 5) badges.push({ id: 'tests5', label: '5 Mock Tests', icon: ClipboardCheck })
  if (summary.average_mock_score_pct >= 90) badges.push({ id: 'highscore', label: 'High Scorer', icon: Star })
  return badges
}
