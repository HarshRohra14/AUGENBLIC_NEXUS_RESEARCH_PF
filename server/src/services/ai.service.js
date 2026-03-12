const fetch = require('node-fetch');

const HF_BASE = 'https://router.huggingface.co/hf-inference/models';
// Non-gated model with OpenAI-compatible chat completions support
const CHAT_MODEL = 'HuggingFaceH4/zephyr-7b-beta';

// Pipeline endpoint — used for BART summarization
async function hfRequest(model, body, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const response = await fetch(`${HF_BASE}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    if (!response.ok && !text.startsWith('{') && !text.startsWith('[')) {
      throw new Error(`HuggingFace API error: ${text.trim()}`);
    }
    const data = JSON.parse(text);

    if (data.error && data.error.includes('loading') && attempt < retries) {
      const wait = data.estimated_time ? Math.min(data.estimated_time * 1000, 30000) : 20000;
      console.log(`Model ${model} loading, retrying in ${wait / 1000}s (${attempt}/${retries})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    if (data.error) throw new Error(`HuggingFace API error: ${data.error}`);
    return data;
  }
  throw new Error('Max retries exceeded waiting for model to load');
}

// OpenAI-compatible chat completions endpoint — used for text generation
async function hfChat(systemPrompt, userMessage) {
  const response = await fetch(`${HF_BASE}/${CHAT_MODEL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: false,
    }),
  });

  const text = await response.text();
  if (!response.ok && !text.startsWith('{')) {
    throw new Error(`HuggingFace API error: ${text.trim()}`);
  }
  const data = JSON.parse(text);
  if (data.error) throw new Error(`HuggingFace API error: ${data.error}`);
  return data.choices?.[0]?.message?.content || '';
}

async function summarizePaper(text) {
  const data = await hfRequest('facebook/bart-large-cnn', {
    inputs: text.slice(0, 1024),
    parameters: { max_length: 200, min_length: 50 },
  });
  return data[0]?.summary_text || 'Summary unavailable';
}

async function extractKeywords(text) {
  try {
    const data = await hfRequest('yanekyuk/bert-uncased-keyword-extractor', {
      inputs: text.slice(0, 512),
    });
    if (Array.isArray(data)) {
      return data
        .filter((item) => item.score > 0.5)
        .map((item) => item.word)
        .filter((w, i, arr) => arr.indexOf(w) === i)
        .slice(0, 15);
    }
    return [];
  } catch {
    return text
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .filter((w, i, arr) => arr.indexOf(w) === i)
      .slice(0, 10);
  }
}

async function generateResearchGaps(projectContext) {
  const result = await hfChat(
    'You are a research assistant for Nexus Research Platform. Be concise and structured.',
    `Analyze the following research project context and identify 3-5 specific research gaps that could be explored further. List them as numbered points with brief explanations.\n\nContext: ${projectContext.slice(0, 1500)}`
  );
  return result || 'Unable to generate gap analysis';
}

async function suggestConnections(insightsList) {
  const insightsText = insightsList
    .map((ins, i) => `${i + 1}. ${ins.title}: ${ins.description}`)
    .join('\n');

  const result = await hfChat(
    'You are a research assistant for Nexus Research Platform. Be concise and structured.',
    `Given these research insights, suggest 3 non-obvious connections between them that could lead to new research directions. For each connection specify which insights are linked and explain the relationship.\n\nInsights:\n${insightsText.slice(0, 1500)}`
  );
  return result || 'Unable to suggest connections';
}

async function chatWithAI(message, context) {
  const result = await hfChat(
    `You are a research assistant for Nexus Research Platform. You help researchers analyze papers, find gaps, and make connections across their research projects. Active project context: ${context.slice(0, 800)}`,
    message
  );
  return result || 'Unable to generate a response';
}

module.exports = {
  summarizePaper,
  extractKeywords,
  generateResearchGaps,
  suggestConnections,
  chatWithAI,
};
