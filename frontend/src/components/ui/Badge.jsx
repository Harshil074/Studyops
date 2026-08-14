import { cn } from '../../utils/cn'

const TONES = {
  neutral: 'bg-surface-2 text-muted',
  primary: 'bg-primary/15 text-primary',
  secondary: 'bg-secondary/15 text-secondary',
  success: 'bg-success/15 text-success',
  danger: 'bg-danger/15 text-danger',
  accent: 'bg-accent/15 text-accent',
}

function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-body text-xs font-medium',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
