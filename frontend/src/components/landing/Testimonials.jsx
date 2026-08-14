import Section from './Section'
import Card from '../ui/Card'
import { StaggerContainer, StaggerItem } from '../ui/Stagger'

const TESTIMONIALS = [
  { name: 'Priya S.', role: '11th grade student', quote: 'The streak feature is the only reason I stopped putting off chemistry homework until 11pm.', initials: 'PS' },
  { name: 'Marcus T.', role: '10th grade student', quote: 'I used four different apps before. Now homework, tests, and my planner are all in one tab.', initials: 'MT' },
  { name: 'Dana W.', role: 'Parent', quote: "I can see how my daughter's week is going without asking her ten questions at dinner.", initials: 'DW' },
]

function Testimonials() {
  return (
    <Section eyebrow="Loved by students and parents" title="Don't just take our word for it">
      <StaggerContainer className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <StaggerItem key={t.name}>
            <Card hoverLift className="h-full">
              <p className="font-body text-sm text-text leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-body text-xs font-semibold text-white shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-text">{t.name}</p>
                  <p className="font-body text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}

export default Testimonials
