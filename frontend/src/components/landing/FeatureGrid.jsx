import {
  BookOpen, ClipboardCheck, CalendarClock, Bot, Layers,
  BarChart3, Flame, Users,
} from 'lucide-react'
import Section from './Section'
import Card from '../ui/Card'
import { StaggerContainer, StaggerItem } from '../ui/Stagger'

const FEATURES = [
  { icon: BookOpen, title: 'Homework', desc: 'Track every assignment with subjects, deadlines, and progress in one board.' },
  { icon: ClipboardCheck, title: 'Mock Tests', desc: 'Practice with timed tests and instant scoring across every subject.' },
  { icon: CalendarClock, title: 'Study Planner', desc: 'Plan your week, block focus time, and run Pomodoro sessions.' },
  { icon: Bot, title: 'AI Study Assistant', desc: 'Get homework help, chapter summaries, and instant quiz generation.' },
  { icon: Layers, title: 'Flashcards', desc: 'Turn any topic into spaced-repetition flashcards in seconds.' },
  { icon: BarChart3, title: 'Analytics', desc: 'See exactly where your time goes and which subjects need work.' },
  { icon: Flame, title: 'Study Streaks', desc: 'Stay consistent with streaks, XP, and weekly challenges.' },
  { icon: Users, title: 'Parent Monitoring', desc: 'A calm, read-only view for parents — no nagging required.' },
]

function FeatureGrid() {
  return (
    <Section
      id="features"
      eyebrow="Everything in one place"
      title="One workspace for the whole school week"
      subtitle="Stop juggling five different apps. StudyOps brings the tools you actually use into a single, focused product."
    >
      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <StaggerItem key={title}>
            <Card hoverLift className="flex flex-col gap-3 h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" strokeWidth={2} aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-text">{title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{desc}</p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  )
}

export default FeatureGrid
