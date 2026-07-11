import { FoxMark } from './FoxMark'

interface BrandLogoProps {
  size?: 'sm' | 'md'
  className?: string
}

/** Snugglefox logotype: the sleeping fox mark + wordmark in Fraunces. */
export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const mark = size === 'sm' ? 26 : 32
  const text = size === 'sm' ? 'text-base' : 'text-lg'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <FoxMark size={mark} />
      <span className={`font-display ${text} font-semibold tracking-tight text-text-primary`}>
        Snugglefox
      </span>
    </span>
  )
}
