import { motion } from 'framer-motion'
import { CheckSquare, Square, Clock, Trophy } from 'lucide-react'
import Section from './Section'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { cn } from '../../utils/cn'

const ROWS = [
  {
    eyebrow: 'Dashboard',
    title: 'Your whole week, at a glance',
    desc: "Completion rate, streak, upcoming deadlines, and live updates the moment you finish a task — no refreshing needed.",
    mockup: 'dashboard',
  },
  {
    eyebrow: 'Homework',
    title: 'A board that keeps up with you',
    desc: 'Add a task in seconds, filter by subject or deadline, and watch your completion rate move in real time.',
    mockup: 'homework',
  },
  {
    eyebrow: 'Mock Tests',
    title: 'Practice like the real thing',
    desc: 'Timed, subject-based mock tests with instant scoring so you know exactly where you stand before exam day.',
    mockup: 'mocktest',
  },
]

function DashboardMockup() {
  return (
    <Card glass className="p-5">
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Completion', value: '86%', tone: 'text-success' },
          { label: 'Streak', value: '12d', tone: 'text-danger' },
          { label: 'Avg Score', value: '91%', tone: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-surface-2 p-3">
            <p className="font-body text-[11px] text-muted mb-1">{s.label}</p>
            <p className={cn('font-mono text-lg font-semibold', s.tone)}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className={cn('h-5 flex-1 rounded-md', i < 10 ? 'bg-primary' : 'bg-surface-2')} />
        ))}
      </div>
    </Card>
  )
}

function HomeworkMockup() {
  const tasks = [
    { title: 'Physics — Ch.6 problems', subject: 'Physics', done: false },
    { title: 'Read Act II, Macbeth', subject: 'English', done: true },
    { title: 'Chemistry lab report', subject: 'Chemistry', done: false },
  ]
  return (
    <Card glass className="p-5 space-y-2.5">
      {tasks.map((t) => (
        <div key={t.title} className="flex items-center gap-3 rounded-xl bg-surface-2 px-3.5 py-3">
          {t.done ? (
            <CheckSquare className="w-4 h-4 text-success shrink-0" strokeWidth={2} />
          ) : (
            <Square className="w-4 h-4 text-muted shrink-0" strokeWidth={2} />
          )}
          <span className={cn('font-body text-sm flex-1', t.done ? 'text-muted line-through' : 'text-text')}>
            {t.title}
          </span>
          <Badge tone="primary">{t.subject}</Badge>
        </div>
      ))}
    </Card>
  )
}

function MockTestMockup() {
  return (
    <Card glass className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-text">Algebra Fundamentals</h4>
        <span className="flex items-center gap-1 font-mono text-xs text-muted">
          <Clock className="w-3.5 h-3.5" /> 18:24
        </span>
      </div>
      <p className="font-body text-sm text-text mb-3">7. Solve for x: 2x + 5 = 17</p>
      <div className="space-y-2">
        {['x = 5', 'x = 6', 'x = 7', 'x = 8'].map((opt, i) => (
          <label key={opt} className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 font-body text-sm border',
            i === 1 ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted'
          )}>
            <span className={cn('w-3.5 h-3.5 rounded-full border-2', i === 1 ? 'border-primary bg-primary' : 'border-border')} />
            {opt}
          </label>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-4 font-body text-xs text-accent">
        <Trophy className="w-3.5 h-3.5" /> Last attempt: 91%
      </div>
    </Card>
  )
}

const MOCKUPS = { dashboard: DashboardMockup, homework: HomeworkMockup, mocktest: MockTestMockup }

function ProductShowcase() {
  return (
    <Section eyebrow="See it in action" title="Built like a product, not a project">
      <div className="space-y-20">
        {ROWS.map((row, i) => {
          const Mockup = MOCKUPS[row.mockup]
          return (
            <div
              key={row.title}
              className={cn(
                'grid lg:grid-cols-2 gap-10 items-center',
                i % 2 === 1 && 'lg:[&>*:first-child]:order-2'
              )}
            >
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-body text-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                  {row.eyebrow}
                </p>
                <h3 className="font-display font-semibold text-2xl sm:text-3xl text-text mb-3">
                  {row.title}
                </h3>
                <p className="font-body text-muted leading-relaxed">{row.desc}</p>
              </motion.div>
              <Mockup />
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export default ProductShowcase
