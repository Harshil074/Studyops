import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '../../utils/cn'

const TONES = {
  danger: { wrap: 'bg-danger/10 border-danger text-danger', Icon: AlertCircle },
  success: { wrap: 'bg-success/10 border-success text-success', Icon: CheckCircle2 },
  info: { wrap: 'bg-primary/10 border-primary text-primary', Icon: Info },
}

function Alert({ tone = 'danger', children, className }) {
  const { wrap, Icon } = TONES[tone]
  return (
    <div
      role="alert"
      className={cn('flex items-center gap-2 border rounded-xl px-4 py-3 font-body text-sm', wrap, className)}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export default Alert
