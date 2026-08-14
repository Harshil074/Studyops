import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_0_1px_rgba(124,58,237,0.4)]',
  secondary: 'bg-surface-2 hover:bg-surface-2/70 text-text border border-border',
  ghost: 'bg-transparent hover:bg-surface-2 text-muted hover:text-text',
  danger: 'bg-danger hover:bg-danger/90 text-white',
}

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
}

/**
 * Base button used everywhere in the app. Keep this the single place
 * button styling lives — don't hand-roll button classes in pages.
 *
 * Polymorphic via `as` (e.g. `as={Link}` for a nav CTA). Whatever is
 * passed is wrapped with motion() so hover/tap animation still works
 * without leaking framer-motion-only props onto a plain DOM node.
 */
function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const MotionComponent = useMemo(() => motion.create(as), [as])

  return (
    <MotionComponent
      whileHover={isDisabled ? {} : { y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      disabled={as === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-body font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isDisabled && as !== 'button' && 'pointer-events-none opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" strokeWidth={2} />
      )}
      {children}
    </MotionComponent>
  )
}

export default Button
