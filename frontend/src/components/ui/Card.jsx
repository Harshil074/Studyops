import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

/**
 * hoverLift adds the subtle "premium" hover interaction used on
 * dashboard stat cards, homework cards, mock-test cards, etc.
 */
function Card({ as: Component = 'div', hoverLift = false, glass = false, className, children, ...props }) {
  const MotionComponent = hoverLift ? motion[Component] || motion.div : Component

  return (
    <MotionComponent
      whileHover={hoverLift ? { y: -3 } : undefined}
      className={cn(
        'rounded-2xl border border-border p-5',
        glass ? 'bg-surface-1/60 backdrop-blur-xl' : 'bg-surface-1',
        hoverLift && 'transition-colors hover:border-primary/40 cursor-default',
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

export default Card
