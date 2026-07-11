'use client'

import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none'
  const variants = {
    primary:
      'bg-gradient-to-b from-candle to-amber text-night shadow-candle hover:from-amber hover:to-amber-dark hover:shadow-candle-lg',
    ghost:
      'bg-transparent text-text-muted border border-border hover:text-text-primary hover:border-text-muted/60',
  }
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props} />
}
