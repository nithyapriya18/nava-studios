import { ScanSearch } from 'lucide-react'

/** The product's app icon: a gradient tile with a white glyph. */
export function AppIcon({ size = 56 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center overflow-hidden text-white shadow-[0_14px_30px_-14px_rgba(1,41,135,0.7)]"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundImage:
          'linear-gradient(135deg, rgb(255 255 255 / 0.25), transparent 50%), linear-gradient(135deg, #012987 0%, #0a3a9c 50%, #006278 100%)',
      }}
    >
      <ScanSearch size={size * 0.48} strokeWidth={1.8} />
    </span>
  )
}
