import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { register as registerUser } from '../api/auth'
import { registerSchema } from '../utils/validation'
import { ROUTES } from '../constants/routes'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

function Register() {
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values) {
    setServerError('')
    try {
      await registerUser(values)
      setSuccess(true)
      setTimeout(() => navigate(ROUTES.LOGIN), 1200)
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Registration failed.')
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start studying smarter in under a minute."
      footer={
        <p className="font-body text-sm text-muted">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      }
    >
      {serverError && (
        <Alert tone="danger" className="mb-4">
          {serverError}
        </Alert>
      )}
      {success && (
        <Alert tone="success" className="mb-4">
          Account created! Redirecting to login...
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Name"
          type="text"
          icon={User}
          autoComplete="name"
          error={errors.name?.message}
          {...registerField('name')}
        />

        <Input
          label="Email"
          type="email"
          icon={Mail}
          autoComplete="email"
          error={errors.email?.message}
          {...registerField('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          autoComplete="new-password"
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
          {...registerField('password')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default Register
