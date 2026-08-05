import { Bot, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react'
import Section from './Section'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

function AiTutorMockup() {
  return (
    <Card glass className="p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" strokeWidth={2} aria-hidden="true" />
        </div>
        <span className="font-display font-semibold text-text text-sm">AI Study Assistant</span>
      </div>

      <div className="self-start max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-2.5 font-body text-sm text-text">
        Can you explain photosynthesis in simple terms?
      </div>
      <div className="self-end max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-2.5 font-body text-sm text-text">
        Sure — think of it as a plant's way of cooking its own food using sunlight, water, and
        CO₂. Want a diagram or a 3-question quiz to check you've got it?
      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        {['Quiz me', 'Summarize chapter', 'Make flashcards'].map((chip) => (
          <span key={chip} className="rounded-full border border-border px-3 py-1.5 font-body text-xs text-muted">
            {chip}
          </span>
        ))}
      </div>
    </Card>
  )
}

function ParentMockup() {
  return (
    <Card glass className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-secondary" strokeWidth={2} aria-hidden="true" />
        <span className="font-display font-semibold text-text text-sm">Parent view — Aanya R.</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="font-body text-[11px] text-muted mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Weekly trend
          </p>
          <p className="font-mono text-lg font-semibold text-success">+14%</p>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="font-body text-[11px] text-muted mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Needs focus
          </p>
          <p className="font-body text-sm font-medium text-text">Chemistry</p>
        </div>
      </div>

      <div className="rounded-xl bg-surface-2 p-3">
        <p className="font-body text-xs text-muted mb-2">Teacher note</p>
        <p className="font-body text-sm text-text">
          "Great improvement on essay structure this month." <Badge tone="secondary" className="ml-1">Ms. Falk</Badge>
        </p>
      </div>
    </Card>
  )
}

function AiAndParentSection() {
  return (
    <Section
      id="ai-tutor"
      eyebrow="AI Tutor & Parent View"
      title="Help when you're stuck. Peace of mind for them."
      subtitle="An AI assistant that explains, not just answers — and a parent dashboard that informs without hovering."
    >
      <div className="grid md:grid-cols-2 gap-6">
        <AiTutorMockup />
        <ParentMockup />
      </div>
    </Section>
  )
}

export default AiAndParentSection
