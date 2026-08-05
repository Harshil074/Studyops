import CountUp from '../ui/CountUp'

function HomeworkHeader({ stats }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-text">Homework</h1>
        <p className="font-body text-sm text-muted mt-1">
          {stats.completed}/{stats.total} tasks done · <CountUp value={stats.pct} suffix="% complete" />
          {stats.overdue > 0 && <span className="text-danger"> · {stats.overdue} overdue</span>}
        </p>
      </div>
    </div>
  )
}

export default HomeworkHeader
