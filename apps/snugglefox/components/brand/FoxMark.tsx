interface FoxMarkProps {
  size?: number
  className?: string
}

/**
 * The Snugglefox mark — a small geometric fox, curled up and fast asleep.
 * Pure inline SVG, brand colors baked in (terracotta body, cream muzzle and
 * tail tip, night-ink features) so it reads correctly on any dark surface.
 */
export function FoxMark({ size = 32, className = '' }: FoxMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Tail, curled around the front of the body */}
      <path
        d="M7.5 26c-1.5 9.5 6.5 16.5 16.5 16.5 8.5 0 15-4.5 16.5-11"
        stroke="#B85E33"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Cream tail tip */}
      <circle cx="40.5" cy="31.5" r="3.4" fill="#F5E6DC" />
      {/* Ears */}
      <path d="M12 17 15 4.5 22.5 12 Z" fill="#D9834B" />
      <path d="M36 17 33 4.5 25.5 12 Z" fill="#D9834B" />
      {/* Head */}
      <circle cx="24" cy="22.5" r="13.5" fill="#D9834B" />
      {/* Cream muzzle */}
      <path
        d="M24 36c6.5 0 11.6-4.6 13.1-10.4-3.9 2.3-8.2 3.6-13.1 3.6s-9.2-1.3-13.1-3.6C12.4 31.4 17.5 36 24 36Z"
        fill="#F5E6DC"
      />
      {/* Closed, sleeping eyes */}
      <path
        d="M15.5 21.5c1.7 2 3.9 2 5.6 0"
        stroke="#16121F"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M26.9 21.5c1.7 2 3.9 2 5.6 0"
        stroke="#16121F"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      {/* Nose */}
      <ellipse cx="24" cy="28.6" rx="2" ry="1.6" fill="#16121F" />
    </svg>
  )
}
