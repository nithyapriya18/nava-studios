'use client'

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const baseClass = `
  w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-primary
  placeholder:text-text-muted/60 transition-colors
  focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent
  disabled:opacity-50 disabled:bg-surface
`

export function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}
      <input {...props} className={`${baseClass} ${error ? 'border-red-400' : ''} ${className}`} />
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function TextArea({ label, error, hint, className = '', ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}
      <textarea
        {...props}
        rows={props.rows ?? 3}
        className={`${baseClass} resize-none ${error ? 'border-red-400' : ''} ${className}`}
      />
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
