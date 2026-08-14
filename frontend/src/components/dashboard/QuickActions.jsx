import { Link } from 'react-router-dom'
import { PlusCircle, ClipboardCheck } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { ROUTES } from '../../constants/routes'

function QuickActions() {
  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-wider text-muted mb-4">Quick actions</p>
      <div className="flex flex-col gap-2.5">
        <Button as={Link} to={ROUTES.HOMEWORK} variant="secondary" icon={PlusCircle} className="justify-start">
          Add homework
        </Button>
        <Button as={Link} to={ROUTES.MOCK_TESTS} variant="secondary" icon={ClipboardCheck} className="justify-start">
          Take a mock test
        </Button>
      </div>
    </Card>
  )
}

export default QuickActions
