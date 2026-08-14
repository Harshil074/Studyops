import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import Section from './Section'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { cn } from '../../utils/cn'
import { ROUTES } from '../../constants/routes'
import { StaggerContainer, StaggerItem } from '../ui/Stagger'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything you need to get organized.',
    features: ['Homework tracker', 'Study planner', '3 mock tests / month', 'Basic analytics'],
    cta: 'Get started',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$6',
    period: '/month',
    desc: 'For students who want the full toolkit.',
    features: ['Everything in Free', 'Unlimited mock tests', 'AI Study Assistant', 'Flashcards & quiz generator', 'Full analytics & streaks'],
    cta: 'Start free trial',
    featured: true,
  },
  {
    name: 'Family',
    price: '$10',
    period: '/month',
    desc: 'Pro, plus a dashboard for parents.',
    features: ['Everything in Pro', 'Parent dashboard', 'Weekly progress reports', 'Up to 3 student profiles'],
    cta: 'Start free trial',
    featured: false,
  },
]

function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Simple pricing, no surprises"
      subtitle="Start free. Upgrade only when you need more."
    >
      <StaggerContainer className="grid md:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan) => (
          <StaggerItem key={plan.name}>
            <Card
              className={cn('relative flex flex-col h-full', plan.featured && 'border-primary ring-1 ring-primary/40')}
            >
              {plan.featured && (
                <Badge tone="primary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <h3 className="font-display font-semibold text-xl text-text mb-1">{plan.name}</h3>
              <p className="font-body text-sm text-muted mb-5">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-bold text-4xl text-text">{plan.price}</span>
                <span className="font-body text-sm text-muted">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-body text-sm text-text">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                as={Link}
                to={ROUTES.REGISTER}
                variant={plan.featured ? 'primary' : 'secondary'}
                className="w-full justify-center"
              >
                {plan.cta}
              </Button>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}

export default Pricing
