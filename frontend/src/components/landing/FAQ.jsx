import Section from './Section'
import Accordion from '../ui/Accordion'

const FAQS = [
  { question: 'Is StudyOps free to use?', answer: 'Yes — the Free plan covers homework tracking, the study planner, a few mock tests a month, and basic analytics, with no credit card required.' },
  { question: 'Can my parents see everything I do?', answer: "Only if you're on a Family plan and choose to link an account. Parents see progress and summaries, not your private notes or chat history with the AI tutor." },
  { question: 'Which subjects does the AI tutor support?', answer: 'The AI Study Assistant works across core subjects — math, science, English, and history — and can summarize chapters, generate quizzes, and help with homework questions.' },
  { question: 'Can I use StudyOps on my phone?', answer: 'Yes. StudyOps is fully responsive and works on desktop, tablet, and mobile browsers.' },
  { question: 'Can I cancel anytime?', answer: 'Yes, Pro and Family plans are month-to-month with no lock-in — cancel whenever you like from your account settings.' },
]

function FAQ() {
  return (
    <Section id="faq" eyebrow="FAQ" title="Questions, answered">
      <div className="max-w-2xl mx-auto">
        <Accordion items={FAQS} />
      </div>
    </Section>
  )
}

export default FAQ
