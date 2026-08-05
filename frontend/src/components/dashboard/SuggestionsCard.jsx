import { Lightbulb } from 'lucide-react'
import Card from '../ui/Card'

function SuggestionsCard({ suggestions }) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-accent" strokeWidth={2} aria-hidden="true" />
        <p className="font-body text-xs uppercase tracking-wider text-muted">Suggested focus</p>
      </div>
      <ul className="space-y-3">
        {suggestions.map((tip, i) => (
          <li key={i} className="font-body text-sm text-text leading-relaxed">
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default SuggestionsCard
