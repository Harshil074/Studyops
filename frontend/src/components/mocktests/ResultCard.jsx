import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ProgressRing from '../ui/ProgressRing'

function ResultCard({ result, onBack }) {
  const pct = result.total_questions ? Math.round((result.score / result.total_questions) * 100) : 0

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="max-w-sm text-center flex flex-col items-center gap-5">
        <p className="font-body text-xs uppercase tracking-wider text-muted">Test complete</p>
        <ProgressRing value={pct} sublabel={`${result.score}/${result.total_questions} correct`} size={140} />
        <Button onClick={onBack} variant="secondary" className="w-full justify-center">
          Back to tests
        </Button>
      </Card>
    </motion.div>
  )
}

export default ResultCard
