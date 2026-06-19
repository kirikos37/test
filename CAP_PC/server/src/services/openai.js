import OpenAI from 'openai'

let client = null

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

export async function chatCompletion(systemPrompt, userPrompt) {
  const openai = getClient()
  if (!openai) return null

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  })

  const text = response.choices[0]?.message?.content
  if (!text) return null
  return JSON.parse(text)
}

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY)
}
