import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { ROUTES } from '../../constants/routes'

const COLUMNS = [
  { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Analytics', href: '#analytics' }, { label: 'Pricing', href: '#pricing' }] },
  { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
  { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
]

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-primary" strokeWidth={2} aria-hidden="true" />
            <span className="font-display font-semibold text-text">StudyOps</span>
          </Link>
          <p className="font-body text-sm text-muted max-w-xs">
            The student productivity platform for homework, tests, planning, and more.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="font-body text-sm font-semibold text-text mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-body text-sm text-muted hover:text-text transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto border-t border-border mt-10 pt-6">
        <p className="font-body text-xs text-muted">© {new Date().getFullYear()} StudyOps. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
