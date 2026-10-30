import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** The same mark as icon.tsx, square: iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#232C82',
          color: '#F5B53F',
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        NV
      </div>
    ),
    size,
  )
}
