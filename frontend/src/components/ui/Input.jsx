import { forwardRef, useId } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(function Input(
  { label, error, icon: Icon, rightElement, className, ...props },
  ref
) {
  const generatedId = useId()
  const inputId = props.id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-body text-sm text-muted mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full rounded-xl bg-surface-2 text-text placeholder:text-muted/60 px-3.5 py-2.5 font-body text-sm',
            'border border-border outline-none transition focus:border-primary',
            Icon && 'pl-10',
            rightElement && 'pr-10',
            error && 'border-danger focus:border-danger',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="font-body text-xs text-danger mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
