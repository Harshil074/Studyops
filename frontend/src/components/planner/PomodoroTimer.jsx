import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { cn } from '../../utils/cn'
import { usePomodoro } from '../../hooks/usePomodoro'

const PHASE_LABEL = { work: 'Focus', short_break: 'Short break', long_break: 'Long break' }
const PHASE_TONE = { work: 'text-primary', short_break: 'text-secondary', long_break: 'text-accent' }

function PomodoroTimer() {
  const { phase, minutes, seconds, isRunning, completedWorkSessions, progressPct, start, pause, reset, skip } =
    usePomodoro()

  return (
    <Card className="flex flex-col items-center text-center">
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-1">Pomodoro timer</p>
      <p className="font-body text-[11px] text-muted mb-5">This session only — resets on refresh.</p>

      <span className={cn('font-body text-sm font-medium mb-3', PHASE_TONE[phase])}>
        {PHASE_LABEL[phase]}
      </span>

      <div className="font-mono text-5xl font-semibold text-text mb-4 tabular-nums">
        {minutes}:{seconds}
      </div>

      <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden mb-6">
        <div
          className={cn('h-full rounded-full transition-all', phase === 'work' ? 'bg-primary' : 'bg-secondary')}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={isRunning ? pause : start}
          icon={isRunning ? Pause : Play}
          size="sm"
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={reset} variant="secondary" size="sm" icon={RotateCcw} aria-label="Reset timer" />
        <Button onClick={skip} variant="secondary" size="sm" icon={SkipForward} aria-label="Skip phase" />
      </div>

      <p className="font-body text-xs text-muted mt-5">
        {completedWorkSessions} focus session{completedWorkSessions === 1 ? '' : 's'} completed this session
      </p>
    </Card>
  )
}

export default PomodoroTimer
