import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.REACT_APP_DEEPSEEK_API_KEY || 'sk-3e322e5b5c9a4d89a4c316805d0cf3b3',
  dangerouslyAllowBrowser: true,
});

export async function getVerseExplanation(
  surahName: string,
  surahNumber: number,
  verseNumber: number,
  translation: string
): Promise<{ explanation: string; context: string; themes: string[] }> {
  const completion = await openai.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [
      {
        role: 'system',
        content:
          'You are a knowledgeable Islamic scholar providing Quran verse explanations. Respond in JSON format with: explanation (detailed verse explanation), context (historical/surah context), themes (array of key themes). Keep explanations concise but meaningful.',
      },
      {
        role: 'user',
        content: `Explain Surah ${surahName} (${surahNumber}), verse ${verseNumber}.\nTranslation: ${translation}`,
      },
    ],
    stream: false,
  });

  const content = completion.choices[0]?.message?.content || '';
  const cleaned = content.replace(/^```(?:json)?\s*\n?/gm, '').replace(/\n?```\s*$/gm, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      explanation: cleaned,
      context: '',
      themes: [],
    };
  }
}
