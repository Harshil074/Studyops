import Alert from '../ui/Alert'

function LiveEventBanner({ event }) {
  if (!event) return null

  const message =
    event.event === 'homework_completed'
      ? `Task completed — ${event.subject}`
      : event.event === 'mock_test_submitted'
        ? `Mock test scored ${event.score}/${event.total_questions}`
        : 'Progress updated'

  return (
    <Alert tone="info" className="mb-6">
      {message}
    </Alert>
  )
}

export default LiveEventBanner
