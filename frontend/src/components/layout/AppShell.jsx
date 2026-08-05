import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, GraduationCap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

function AppShell({ children }) {
  const navigate = useNavigate()
  const { logoutUser } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleLogout() {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-border">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" strokeWidth={2} aria-hidden="true" />
          <span className="font-display font-semibold text-text">StudyOps</span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-2"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/60"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface-1 border-r border-border"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
              <Sidebar onNavigate={() => setDrawerOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pt-20 lg:pt-10 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  )
}

export default AppShell
