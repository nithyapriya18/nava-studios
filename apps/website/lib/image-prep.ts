/**
 * Prepares an uploaded screenshot for review, in the browser: keeps the top
 * of the page (no taller than 1.6 times its width, so a full-page capture
 * isn't shrunk into something unreadable), scales it to at most 1568px on the
 * long edge, which is the size the AI model reads at, and saves it as JPEG.
 */
export async function prepareScreenshot(file: File): Promise<string> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
    throw new Error('Please choose a PNG, JPEG or WebP image.')
  }
  const bitmap = await createImageBitmap(file)
  const cropHeight = Math.min(bitmap.height, Math.round(bitmap.width * 1.6))
  const scale = Math.min(1, 1568 / Math.max(bitmap.width, cropHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(cropHeight * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Your browser couldn’t read that image.')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, bitmap.width, cropHeight, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}
