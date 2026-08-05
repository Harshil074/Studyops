import Badge from '../ui/Badge'

const CONFIG = {
  overdue: { tone: 'danger', label: 'Overdue' },
  high: { tone: 'danger', label: 'Due soon' },
  medium: { tone: 'accent', label: 'This week' },
  low: { tone: 'neutral', label: 'Upcoming' },
  done: { tone: 'success', label: 'Done' },
  none: { tone: 'neutral', label: 'No date' },
}

function UrgencyBadge({ urgency }) {
  const config = CONFIG[urgency] || CONFIG.none
  return <Badge tone={config.tone}>{config.label}</Badge>
}

export default UrgencyBadge
