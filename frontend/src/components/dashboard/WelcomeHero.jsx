import { greetingForHour } from '../../utils/date'

function WelcomeHero({ name, isLive }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="font-body text-xs uppercase tracking-widest text-primary mb-1">
          {greetingForHour()}
          {name ? `, ${name.split(' ')[0]}` : ''}
        </p>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl text-text">
          Here's where you stand
        </h1>
      </div>
      <div className="flex items-center gap-2 mt-2 shrink-0">
        <span
          className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted/40'}`}
          aria-hidden="true"
        />
        <span className="font-mono text-xs text-muted">{isLive ? 'live' : 'offline'}</span>
      </div>
    </div>
  )
}

export default WelcomeHero
