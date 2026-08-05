import Card from '../ui/Card'
import ProgressRing from '../ui/ProgressRing'

function CompletionRing({ pct, completed, total }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4 self-start">
        Homework completion
      </p>
      <ProgressRing value={pct} sublabel={`${completed}/${total} tasks`} />
    </Card>
  )
}

export default CompletionRing
