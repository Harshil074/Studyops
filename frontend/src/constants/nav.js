import { LayoutDashboard, BookOpen, ClipboardCheck, CalendarClock } from 'lucide-react'
import { ROUTES } from './routes'

// Only routes that exist today. New sections (AI Tutor, Analytics, Parent)
// get added here in their own phase once the pages exist — keeping this
// list honest avoids dead links in the sidebar.
export const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.HOMEWORK, label: 'Homework', icon: BookOpen },
  { to: ROUTES.MOCK_TESTS, label: 'Mock Tests', icon: ClipboardCheck },
  { to: ROUTES.PLANNER, label: 'Planner', icon: CalendarClock },
]
