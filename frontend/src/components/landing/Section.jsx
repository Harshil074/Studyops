import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Wraps every landing-page section with a consistent max-width, vertical
 * rhythm, and a one-time fade/slide-up as it scrolls into view. Optional
 * eyebrow/title/subtitle header keeps section intros consistent.
 */
function Section({ id, eyebrow, title, subtitle, className, children }) {
  return (
    <section id={id} className={cn('relative py-20 sm:py-24 px-6', className)}>
      <div className="max-w-6xl mx-auto">
        {(eyebrow || title) && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={revealVariants}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            {eyebrow && (
              <p className="font-body text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display font-semibold text-3xl sm:text-4xl text-text mb-4">
                {title}
              </h2>
            )}
            {subtitle && <p className="font-body text-muted text-base sm:text-lg">{subtitle}</p>}
          </motion.div>
        )}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

export default Section
