import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, CheckCircle2, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { ROUTES } from '../../constants/routes'

function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="aurora-bg" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3.5 py-1.5 font-body text-xs text-muted mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" strokeWidth={2} aria-hidden="true" />
            Built for students who want more than a to-do list
          </span>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text leading-[1.08] mb-6">
            Study smarter,
            <br />
            not <span className="text-primary">harder</span>.
          </h1>

          <p className="font-body text-lg text-muted max-w-lg mb-8">
            StudyOps brings homework, mock tests, a study planner, and an AI tutor into one
            calm, focused workspace — with a live dashboard your parents can actually understand.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button as={Link} to={ROUTES.REGISTER} size="lg" icon={ArrowRight} className="flex-row-reverse">
              Start studying free
            </Button>
            <Button as="a" href="#features" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>

          <div className="flex items-center gap-6 mt-10 font-body text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" strokeWidth={2} aria-hidden="true" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-success" strokeWidth={2} aria-hidden="true" />
              Free for students
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <Card glass className="p-6 shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-body text-xs uppercase tracking-wider text-muted">Good evening</p>
                <p className="font-display font-semibold text-xl text-text">Here's where you stand</p>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-xs text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-surface-2 p-4">
                <p className="font-body text-xs text-muted mb-1">Completion</p>
                <p className="font-mono text-2xl font-semibold text-success">86%</p>
              </div>
              <div className="rounded-xl bg-surface-2 p-4">
                <p className="font-body text-xs text-muted mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-danger" /> Streak
                </p>
                <p className="font-mono text-2xl font-semibold text-text">12 days</p>
              </div>
            </div>

            <div className="rounded-xl bg-surface-2 p-4">
              <p className="font-body text-xs text-muted mb-3">Up next</p>
              <ul className="space-y-2 font-body text-sm">
                <li className="flex justify-between text-text">
                  <span>Physics — Chapter 6 problems</span>
                  <span className="text-muted text-xs">Tomorrow</span>
                </li>
                <li className="flex justify-between text-text">
                  <span>English essay draft</span>
                  <span className="text-muted text-xs">Fri</span>
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
