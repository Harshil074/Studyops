import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Menu, X } from 'lucide-react'
import Button from '../ui/Button'
import { ROUTES } from '../../constants/routes'

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16" aria-label="Main">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" strokeWidth={2} aria-hidden="true" />
          <span className="font-display font-semibold text-lg text-text">StudyOps</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm text-muted hover:text-text transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to={ROUTES.LOGIN} className="font-body text-sm text-muted hover:text-text px-3 py-2">
            Log in
          </Link>
          <Button as={Link} to={ROUTES.REGISTER} size="sm">
            Get started free
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="md:hidden p-2 rounded-lg text-muted hover:text-text hover:bg-surface-2"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-body text-sm text-muted hover:text-text"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link to={ROUTES.LOGIN} className="font-body text-sm text-muted hover:text-text py-2">
                  Log in
                </Link>
                <Button as={Link} to={ROUTES.REGISTER} size="sm" className="justify-center">
                  Get started free
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
