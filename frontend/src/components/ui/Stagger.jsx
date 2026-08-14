import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function StaggerContainer({ as: Component = motion.div, className, children }) {
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </Component>
  )
}

export function StaggerItem({ className, children }) {
  return (
    <motion.div variants={itemVariants} transition={{ duration: 0.4 }} className={className}>
      {children}
    </motion.div>
  )
}
