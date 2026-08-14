import { Search } from 'lucide-react'
import Input from '../ui/Input'

const URGENCY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'high', label: 'Due soon' },
  { value: 'medium', label: 'This week' },
  { value: 'low', label: 'Upcoming' },
]

function HomeworkFilters({ search, onSearchChange, subject, onSubjectChange, urgency, onUrgencyChange, subjects }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1">
        <Input
          icon={Search}
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search homework"
        />
      </div>

      <select
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        aria-label="Filter by subject"
        className="rounded-xl bg-surface-2 border border-border text-text font-body text-sm px-3.5 py-2.5 outline-none focus:border-primary"
      >
        <option value="">All subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={urgency}
        onChange={(e) => onUrgencyChange(e.target.value)}
        aria-label="Filter by urgency"
        className="rounded-xl bg-surface-2 border border-border text-text font-body text-sm px-3.5 py-2.5 outline-none focus:border-primary"
      >
        {URGENCY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export default HomeworkFilters
