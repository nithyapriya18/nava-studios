import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-content flex-col justify-center px-6 md:px-8">
      <p className="font-sans text-sm tabular-nums text-text-muted">404</p>
      <h1 className="mt-2 text-4xl font-semibold text-text-primary md:text-5xl">
        There&apos;s nothing at this address.
      </h1>
      <p className="mt-4 text-lg text-text-muted">
        The page may have moved, or the link has a typo.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-sans text-[0.9375rem]">
        <Link href="/" className="text-link">
          Go to the home page
        </Link>
        <Link href="/lab" className="text-link">
          See the lab
        </Link>
      </div>
    </div>
  )
}
