import { promises as fs } from 'fs'
import path from 'path'
import { config } from '@/lib/config'

export interface AudioStorage {
  put(storyId: string, mp3: Buffer): Promise<void>
  get(storyId: string): Promise<Buffer | null>
}

const AUDIO_DIR = path.join(process.cwd(), '.data', 'audio')

function audioPath(storyId: string): string {
  // Defense-in-depth: storyId comes from a URL segment — never let it escape
  // the audio directory.
  return path.join(AUDIO_DIR, `${path.basename(storyId)}.mp3`)
}

class LocalAudioStorage implements AudioStorage {
  async put(storyId: string, mp3: Buffer): Promise<void> {
    await fs.mkdir(AUDIO_DIR, { recursive: true })
    const finalPath = audioPath(storyId)
    // Write to a temp file then rename (atomic on the same filesystem) so a
    // concurrent get() can never observe a partially-written file.
    const tmpPath = `${finalPath}.${process.pid}.${Date.now()}.tmp`
    await fs.writeFile(tmpPath, mp3)
    await fs.rename(tmpPath, finalPath)
  }

  async get(storyId: string): Promise<Buffer | null> {
    try {
      return await fs.readFile(audioPath(storyId))
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw err
    }
  }
}

export function getAudioStorage(): AudioStorage {
  switch (config.audioStorage) {
    case 'local':
      return new LocalAudioStorage()
    default:
      throw new Error(
        `Unsupported AUDIO_STORAGE "${config.audioStorage}" — only "local" is implemented`,
      )
  }
}
