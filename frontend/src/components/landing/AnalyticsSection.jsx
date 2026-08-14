import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import Section from './Section'
import Card from '../ui/Card'
import CountUp from '../ui/CountUp'

// Illustrative data for the marketing page only — real analytics are
// wired to /progress/summary once a user is logged in (see Dashboard).
const WEEKLY_DATA = [
  { day: 'Mon', hours: 2.1 },
  { day: 'Tue', hours: 3.4 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 2.6 },
  { day: 'Sat', hours: 3.9 },
  { day: 'Sun', hours: 1.5 },
]

const TOTAL_HOURS = WEEKLY_DATA.reduce((sum, d) => sum + d.hours, 0)

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-surface-2 border border-border px-3 py-2 font-body text-xs text-text">
      {label}: <span className="text-primary font-semibold">{payload[0].value}h</span>
    </div>
  )
}

function AnalyticsSection() {
  return (
    <Section
      id="analytics"
      eyebrow="Analytics"
      title="Numbers that actually tell you something"
      subtitle="Weekly study time, subject breakdowns, and progress trends — so effort and results are easy to connect."
    >
      <Card glass className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="font-body text-sm text-muted">Study time this week</p>
          <p className="font-mono text-2xl font-semibold text-text">
            <CountUp value={TOTAL_HOURS} decimals={1} suffix="h" />
          </p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Inter' }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
              <Bar dataKey="hours" fill="#7C3AED" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </Section>
  )
}

export default AnalyticsSection
