import { useCountUp } from '../../hooks/useCountUp'

function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 800, className }) {
  const animated = useCountUp(value, { duration, decimals })
  return (
    <span className={className}>
      {prefix}
      {animated}
      {suffix}
    </span>
  )
}

export default CountUp
