import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'

function TestRunner({ test, answers, onSelectAnswer, onSubmit, onCancel }) {
  const answeredCount = Object.keys(answers).length
  const total = test.questions.length

  return (
    <Card className="max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-semibold text-xl text-text">{test.title}</h2>
        <span className="font-mono text-xs text-muted">{answeredCount}/{total} answered</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${total ? (answeredCount / total) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-6">
        {test.questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <p className="font-body text-sm text-text mb-3">
              {i + 1}. {q.question_text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx
                return (
                  <label
                    key={idx}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 font-body text-sm cursor-pointer transition',
                      selected ? 'border-primary bg-primary/10 text-text' : 'border-border text-muted hover:border-border/70'
                    )}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={selected}
                      onChange={() => onSelectAnswer(q.id, idx)}
                      className="accent-primary w-4 h-4"
                    />
                    {opt}
                  </label>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="secondary" onClick={onCancel} className="flex-1 justify-center">
          Cancel
        </Button>
        <Button onClick={onSubmit} className="flex-1 justify-center">
          Submit
        </Button>
      </div>
    </Card>
  )
}

export default TestRunner
