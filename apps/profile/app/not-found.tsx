import Link from 'next/link'
import { studio } from '@/config'

export default function NotFound() {
  return (
    <main className="lost">
      <span className="kicker">404</span>
      <h1>There’s nothing at this address.</h1>
      <p className="muted">
        The page may have moved, or the link has a typo. Studio NPV’s pages now live on studionpv.com.
      </p>
      <div className="actions">
        <Link href="/" className="btn btn-primary">
          Go to my profile
        </Link>
        <a href={studio()} className="btn">
          Go to Studio NPV
        </a>
      </div>
    </main>
  )
}
