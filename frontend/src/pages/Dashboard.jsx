import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Flame, Target, Trophy } from 'lucide-react'
import AppShell from '../components/layout/AppShell'
import Spinner from '../components/ui/Spinner'
import WelcomeHero from '../components/dashboard/WelcomeHero'
import LiveEventBanner from '../components/dashboard/LiveEventBanner'
import StatCard from '../components/dashboard/StatCard'
import StreakStrip from '../components/dashboard/StreakStrip'
import CompletionRing from '../components/dashboard/CompletionRing'
import HomeworkSummary from '../components/dashboard/HomeworkSummary'
import TodaysGoals from '../components/dashboard/TodaysGoals'
import UpcomingTests from '../components/dashboard/UpcomingTests'
import SubjectBreakdown from '../components/dashboard/SubjectBreakdown'
import Achievements from '../components/dashboard/Achievements'
import SuggestionsCard from '../components/dashboard/SuggestionsCard'
import QuickActions from '../components/dashboard/QuickActions'
import MiniCalendar from '../components/dashboard/MiniCalendar'
import { useDashboardData } from '../hooks/useDashboardData'
import {
  computeTodaysGoals,
  computeSubjectBreakdown,
  computeGamification,
  computeBadges,
  computeSuggestions,
} from '../utils/dashboard'

const gridItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

function Dashboard() {
  const { profile, summary, homework, mockTests, loading, liveEvent, isLive } = useDashboardData()

  const pendingHomework = useMemo(() => homework.filter((t) => !t.is_completed), [homework])
  const todaysGoals = useMemo(() => computeTodaysGoals(homework), [homework])
  const subjectBreakdown = useMemo(() => computeSubjectBreakdown(homework), [homework])
  const gamification = useMemo(() => computeGamification(summary), [summary])
  const badges = useMemo(() => computeBadges(summary), [summary])
  const suggestions = useMemo(
    () => computeSuggestions(summary, subjectBreakdown, todaysGoals),
    [summary, subjectBreakdown, todaysGoals]
  )
  const dueDates = useMemo(
    () => homework.filter((t) => t.due_date && !t.is_completed).map((t) => t.due_date),
    [homework]
  )

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Spinner label="Loading your dashboard..." />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-6xl">
        <WelcomeHero name={profile?.name} isLive={isLive} />
        <LiveEventBanner event={liveEvent} />

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
        >
          <motion.div variants={gridItem}>
            <StatCard
              icon={CheckCircle2}
              label="Completion"
              value={summary.completion_rate_pct}
              suffix="%"
              sub={`${summary.completed_homework_tasks}/${summary.total_homework_tasks} tasks`}
              tone="text-success"
            />
          </motion.div>
          <motion.div variants={gridItem}>
            <StatCard
              icon={Flame}
              label="Streak"
              value={summary.current_streak_days}
              sub="days running"
              tone="text-danger"
            />
          </motion.div>
          <motion.div variants={gridItem}>
            <StatCard icon={Target} label="Tests Taken" value={summary.mock_tests_taken} tone="text-text" />
          </motion.div>
          <motion.div variants={gridItem}>
            <StatCard
              icon={Trophy}
              label="Avg Score"
              value={summary.average_mock_score_pct}
              suffix="%"
              tone="text-accent"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <TodaysGoals goals={todaysGoals} />
            <CompletionRing
              pct={summary.completion_rate_pct}
              completed={summary.completed_homework_tasks}
              total={summary.total_homework_tasks}
            />
            <StreakStrip streak={summary.current_streak_days} />
            <HomeworkSummary tasks={pendingHomework.slice(0, 4)} />
            <UpcomingTests tests={mockTests} />
          </div>
          <div className="grid gap-4">
            <MiniCalendar dueDates={dueDates} />
            <QuickActions />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SubjectBreakdown subjects={subjectBreakdown} />
          <Achievements gamification={gamification} badges={badges} />
          <SuggestionsCard suggestions={suggestions} />
        </div>
      </div>
    </AppShell>
  )
}

export default Dashboard
