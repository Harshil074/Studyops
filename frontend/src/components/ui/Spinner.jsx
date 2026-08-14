import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

function Spinner({ className, label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center gap-2 text-muted font-body text-sm">
      <Loader2 className={cn('w-4 h-4 animate-spin', className)} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default Spinner
