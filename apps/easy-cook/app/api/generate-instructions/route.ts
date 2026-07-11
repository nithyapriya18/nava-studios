import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@/auth'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  try {
    const { mealName, ingredients, servings, cuisine } = await req.json()

    const ingList = (ingredients as Array<{ name: string; quantity: string; unit: string }>)
      .map((i) => `${i.quantity}${i.unit} ${i.name}`)
      .join(', ')

    const prompt = `Generate step-by-step cooking instructions for: ${mealName} (${cuisine}, serves ${servings}).
Ingredients: ${ingList}

Output JSON array of 5-8 clear, concise cooking steps. Each step should be one sentence describing a single action.
Format: ["Step 1 action.", "Step 2 action.", ...]
MINIFIED JSON only, no markdown.`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = (message.content as Anthropic.ContentBlock[])
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/\s*```\s*$/m, '')
      .trim()

    const instructions: string[] = JSON.parse(rawText)
    return NextResponse.json({ instructions })
  } catch (err) {
    console.error('[generate-instructions]', err)
    return NextResponse.json({ error: 'Failed to generate instructions' }, { status: 500 })
  }
}
