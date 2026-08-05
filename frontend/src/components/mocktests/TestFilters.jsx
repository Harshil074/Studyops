import { Search } from 'lucide-react'
import Input from '../ui/Input'

function TestFilters({ search, onSearchChange, subject, onSubjectChange, subjects }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1">
        <Input
          icon={Search}
          placeholder="Search mock tests..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search mock tests"
        />
      </div>
      <select
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        aria-label="Filter by category"
        className="rounded-xl bg-surface-2 border border-border text-text font-body text-sm px-3.5 py-2.5 outline-none focus:border-primary"
      >
        <option value="">All categories</option>
        {subjects.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )
}

export default TestFilters
