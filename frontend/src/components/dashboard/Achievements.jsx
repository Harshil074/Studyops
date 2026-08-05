import { Trophy, Award } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import CountUp from '../ui/CountUp'

function Achievements({ gamification, badges }) {
  const { xp, level, levelProgressPct, xpToNext } = gamification

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-xs uppercase tracking-wider text-muted">Achievements</p>
        <span className="flex items-center gap-1 font-mono text-xs text-accent">
          <Trophy className="w-3.5 h-3.5" aria-hidden="true" /> Level {level}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5 font-body text-xs text-muted">
          <span><CountUp value={xp} suffix=" XP" /></span>
          <span>{xpToNext} XP to level {level + 1}</span>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${levelProgressPct}%` }}
          />
        </div>
      </div>

      {badges.length === 0 ? (
        <p className="font-body text-sm text-muted">Keep going — your first badge is close.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <Badge key={b.id} tone="accent" className="flex items-center gap-1">
              <Award className="w-3 h-3" aria-hidden="true" />
              {b.label}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  )
}

export default Achievements
