import { Link, useLocation } from 'react-router-dom'
import { LogOut, GraduationCap } from 'lucide-react'
import { NAV_ITEMS } from '../../constants/nav'
import { cn } from '../../utils/cn'

function Sidebar({ onNavigate, onLogout }) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-10">
        <GraduationCap className="w-6 h-6 text-primary" strokeWidth={2} aria-hidden="true" />
        <span className="font-display font-semibold text-xl text-text">StudyOps</span>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Primary">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition',
                active
                  ? 'bg-primary text-white font-medium'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-muted hover:text-danger hover:bg-surface-2 transition"
      >
        <LogOut className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
        Log out
      </button>
    </div>
  )
}

export default Sidebar
