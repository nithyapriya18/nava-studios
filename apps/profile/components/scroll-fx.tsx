'use client'

import { useEffect } from 'react'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (n: number) => Math.min(1, Math.max(0, n))

/**
 * Every scroll-driven effect on the page, from one listener. It writes CSS
 * variables and classes; the stylesheet does the drawing.
 *
 * - --p on <html>: progress down the page (the header's line)
 * - --h on .hero: how far the intro has scrolled away (it drifts and fades)
 * - --w on [data-words]: how far you've read a paragraph (words light up)
 * - .in on .rv: blocks ease in once they enter the screen
 * - [data-count]: numbers count up the first time they're seen
 */
export function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement
    const hero = document.querySelector<HTMLElement>('.hero')
    const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('[data-words]'))
    const still = reduced()

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      root.style.setProperty('--p', clamp(window.scrollY / (root.scrollHeight - vh)).toFixed(4))
      if (hero && !still) hero.style.setProperty('--h', clamp(window.scrollY / hero.offsetHeight).toFixed(4))
      for (const el of paragraphs) {
        // From the paragraph's top reaching 85% of the screen to its bottom reaching 45%.
        const r = el.getBoundingClientRect()
        const w = still ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4))
        el.style.setProperty('--w', w.toFixed(4))
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('in')
          reveal.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    document.querySelectorAll('.rv').forEach((el) => reveal.observe(el))

    // Numbers already on screen at load keep their value; the rest count up.
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]')).filter(
      (el) => !still && el.getBoundingClientRect().top > window.innerHeight,
    )
    const show = (el: HTMLElement, v: number) => {
      const d = Number(el.dataset.decimals ?? 0)
      el.textContent = `${el.dataset.prefix ?? ''}${v.toFixed(d)}${el.dataset.suffix ?? ''}`
    }
    counters.forEach((el) => show(el, 0))
    const count = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          count.unobserve(el)
          const to = Number(el.dataset.count)
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 1400)
            show(el, to * (1 - Math.pow(1 - t, 3)))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    counters.forEach((el) => count.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      reveal.disconnect()
      count.disconnect()
    }
  }, [])

  return null
}
