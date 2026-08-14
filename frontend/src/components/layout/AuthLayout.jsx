import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import { ROUTES } from '../../constants/routes'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="aurora-bg" aria-hidden="true" />

      <Link
        to={ROUTES.HOME}
        className="absolute top-6 left-6 z-10 flex items-center gap-1.5 font-body text-sm text-muted hover:text-text transition"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
        Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-primary" strokeWidth={2} aria-hidden="true" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-text text-center">{title}</h1>
          {subtitle && <p className="font-body text-sm text-muted text-center mt-1.5">{subtitle}</p>}
        </div>

        <div className="rounded-2xl border border-border bg-surface-1/80 backdrop-blur-xl p-7 shadow-2xl shadow-black/20">
          {children}
        </div>

        {footer && <div className="mt-6 text-center">{footer}</div>}
      </motion.div>
    </div>
  )
}

export default AuthLayout
