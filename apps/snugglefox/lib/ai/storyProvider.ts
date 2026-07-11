import Anthropic from '@anthropic-ai/sdk'
import { config } from '@/lib/config'
import type { AgeBand, Gender, LengthKey } from '@/lib/types'
import { buildStoryPrompt } from './prompt'

export interface StoryGenerationRequest {
  childName: string
  gender: Gender
  ageBand: AgeBand
  prompt: string
  lengthKey: LengthKey
}

export interface GeneratedStory {
  title: string
  text: string
}

export interface StoryProvider {
  generateStory(req: StoryGenerationRequest): Promise<GeneratedStory>
}

class AnthropicStoryProvider implements StoryProvider {
  // Reads ANTHROPIC_API_KEY from env automatically
  private client = new Anthropic()

  async generateStory(req: StoryGenerationRequest): Promise<GeneratedStory> {
    const { prompt, maxTokens } = buildStoryPrompt(req)

    const message = await this.client.messages.create({
      model: config.storyModel,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = (message.content as Anthropic.ContentBlock[])
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')

    const cleaned = rawText.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/m, '').trim()
    const parsed = JSON.parse(cleaned) as { title?: string; story?: string }

    if (!parsed.title || !parsed.story) {
      throw new Error('Story model returned malformed JSON (missing title or story)')
    }

    return { title: parsed.title, text: parsed.story }
  }
}

export function getStoryProvider(): StoryProvider {
  switch (config.storyProvider) {
    case 'anthropic':
      return new AnthropicStoryProvider()
    default:
      throw new Error(
        `Unsupported STORY_PROVIDER "${config.storyProvider}" — only "anthropic" is implemented`,
      )
  }
}
