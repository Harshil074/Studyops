import Card from '../ui/Card'
import CountUp from '../ui/CountUp'
import { cn } from '../../utils/cn'

function StatCard({ icon: Icon, label, value, suffix = '', sub, tone = 'text-text' }) {
  const isNumeric = typeof value === 'number'

  return (
    <Card hoverLift>
      <div className="flex items-center justify-between mb-3">
        <p className="font-body text-xs uppercase tracking-wider text-muted">{label}</p>
        <Icon className={cn('w-4 h-4', tone)} strokeWidth={2} aria-hidden="true" />
      </div>
      <p className={cn('font-mono text-3xl sm:text-4xl font-semibold', tone)}>
        {isNumeric ? <CountUp value={value} suffix={suffix} /> : value}
      </p>
      {sub && <p className="font-body text-xs text-muted mt-1">{sub}</p>}
    </Card>
  )
}

export default StatCard
