import clsx from 'clsx'

/**
 * Thin wrapper around clsx so every component imports from one place.
 * Usage: cn('base-class', condition && 'conditional-class', className)
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
