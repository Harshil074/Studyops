import Card from '../ui/Card'

function SubjectBreakdown({ subjects }) {
  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4">Subject completion</p>

      {subjects.length === 0 ? (
        <p className="font-body text-sm text-muted">Add homework tasks to see a breakdown by subject.</p>
      ) : (
        <ul className="space-y-3.5">
          {subjects.slice(0, 5).map((s) => (
            <li key={s.subject}>
              <div className="flex items-center justify-between mb-1.5 font-body text-sm">
                <span className="text-text">{s.subject}</span>
                <span className="text-muted text-xs">
                  {s.completed}/{s.total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export default SubjectBreakdown
