import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Section from './Section'
import Button from '../ui/Button'
import { ROUTES } from '../../constants/routes'

function CTA() {
  return (
    <Section className="py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-surface-1 to-secondary/10 px-8 py-16 text-center">
        <div className="aurora-bg opacity-60" aria-hidden="true" />
        <div className="relative z-10">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-text mb-4">
            Ready to get your study week under control?
          </h2>
          <p className="font-body text-muted max-w-lg mx-auto mb-8">
            Join students who traded five scattered apps for one calm workspace.
          </p>
          <Button as={Link} to={ROUTES.REGISTER} size="lg" icon={ArrowRight} className="flex-row-reverse">
            Start studying free
          </Button>
        </div>
      </div>
    </Section>
  )
}

export default CTA
