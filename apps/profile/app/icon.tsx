import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

/** "NV" in marigold on indigo: the studio's colours, my own mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          background: '#232C82',
          color: '#F5B53F',
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        NV
      </div>
    ),
    size,
  )
}
