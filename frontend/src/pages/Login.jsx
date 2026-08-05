import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { loginSchema } from '../utils/validation'
import { ROUTES } from '../constants/routes'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

function Login() {
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values) {
    setServerError('')
    try {
      const data = await login(values)
      loginUser(data.access_token)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <p className="font-body text-sm text-muted">
          No account?{' '}
          <Link to={ROUTES.REGISTER} className="text-primary hover:underline font-medium">
            Register
          </Link>
        </p>
      }
    >
      {serverError && (
        <Alert tone="danger" className="mb-4">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          autoComplete="current-password"
          error={errors.password?.message}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="text-muted hover:text-text"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('password')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Login
