const DEVICE_ID_KEY = 'nava-studios:snugglefox.deviceId'
const LEGACY_DEVICE_ID_KEY = 'snugglefox.deviceId'

export function getOrCreateDeviceId(): string {
  let deviceId =
    localStorage.getItem(DEVICE_ID_KEY) ?? localStorage.getItem(LEGACY_DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = crypto.randomUUID()
  }
  localStorage.setItem(DEVICE_ID_KEY, deviceId)
  return deviceId
}
