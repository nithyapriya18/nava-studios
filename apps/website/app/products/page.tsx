import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS, reviewHref } from '@/lib/products'
import { Arrow, Tick } from '@/components/pen'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Small, free products built and run by Studio NPV.',
}

export default function ProductsPage() {
  const product = PRODUCTS[0]

  return (
    <>
      <section className="band page-head">
        <p className="label">Products</p>
        <h1 className="display">
          Things I <em>run</em>
        </h1>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          Small products I’ve built and run myself. They’re free to use, and they show the kind of care I
          put into client work.
        </p>
      </section>

      <section className="section" aria-labelledby="p-h">
        <p className="label">Free · two reviews a day</p>
        <div className="section-body">
          <div className="product">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 id="p-h" className="h2">
                {product.name}
              </h2>
              <p className="muted">{product.description}</p>
              <div className="btns">
                <Link href={reviewHref} className="btn-primary">
                  Open {product.name} <Arrow />
                </Link>
              </div>
            </div>
            <ul className="ticks" style={{ border: '1px solid var(--rule)' }}>
              {product.features.map((f) => (
                <li key={f}>
                  <Tick />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
