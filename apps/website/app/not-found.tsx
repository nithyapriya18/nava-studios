import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <p className="text-sm uppercase tracking-widest text-text-muted mb-4">404</p>
        <h1 className="text-3xl font-medium text-text-primary mb-4">
          That page doesn&apos;t exist.
        </h1>
        <Link href="/" className="text-sm text-accent underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </div>
  )
}
