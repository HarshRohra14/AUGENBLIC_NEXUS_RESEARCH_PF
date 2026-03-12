const fetch = require('node-fetch');

const HF_BASE = 'https://api-inference.huggingface.co/models';

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

    const data = await response.json();

    if (data.error && data.error.includes('loading') && attempt < retries) {
      const wait = data.estimated_time ? Math.min(data.estimated_time * 1000, 30000) : 20000;
      console.log(`Model ${model} is loading. Retrying in ${wait / 1000}s (attempt ${attempt}/${retries})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }

    if (data.error) {
      throw new Error(`HuggingFace API error: ${data.error}`);
    }

    return data;
  }
  throw new Error('Max retries exceeded waiting for model to load');
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
    // NER-style model returns array of entities
    if (Array.isArray(data)) {
      const keywords = data
        .filter((item) => item.score > 0.5)
        .map((item) => item.word)
        .filter((w, i, arr) => arr.indexOf(w) === i);
      return keywords.slice(0, 15);
    }
    return [];
  } catch {
    // Fallback: extract keywords using zero-shot classification
    const candidates = text
      .split(/\s+/)
      .filter((w) => w.length > 4)
      .filter((w, i, arr) => arr.indexOf(w) === i)
      .slice(0, 20);
    return candidates.slice(0, 10);
  }
}

async function generateResearchGaps(projectContext) {
  const prompt = `<s>[INST] You are a research assistant for Nexus Research Platform. Analyze the following research project context and identify 3-5 specific research gaps that could be explored further.

Context: ${projectContext.slice(0, 1500)}

List the gaps as numbered points with brief explanations. [/INST]`;

  const data = await hfRequest('mistralai/Mistral-7B-Instruct-v0.1', {
    inputs: prompt,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
      return_full_text: false,
    },
  });

  return data[0]?.generated_text || 'Unable to generate gap analysis';
}

async function suggestConnections(insightsList) {
  const insightsText = insightsList
    .map((ins, i) => `${i + 1}. ${ins.title}: ${ins.description}`)
    .join('\n');

  const prompt = `<s>[INST] You are a research assistant for Nexus Research Platform. Given these research insights, suggest 3 non-obvious connections between them that could lead to new research directions.

Insights:
${insightsText.slice(0, 1500)}

For each connection, specify which insights are connected and explain the relationship. [/INST]`;

  const data = await hfRequest('mistralai/Mistral-7B-Instruct-v0.1', {
    inputs: prompt,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.8,
      return_full_text: false,
    },
  });

  return data[0]?.generated_text || 'Unable to suggest connections';
}

async function chatWithAI(message, context) {
  const prompt = `<s>[INST] You are a research assistant for Nexus Research Platform. You help researchers analyze papers, find gaps, and make connections across their research projects.

Active project context: ${context.slice(0, 1000)}

User question: ${message} [/INST]`;

  const data = await hfRequest('mistralai/Mistral-7B-Instruct-v0.1', {
    inputs: prompt,
    parameters: {
      max_new_tokens: 500,
      temperature: 0.7,
      return_full_text: false,
    },
  });

  return data[0]?.generated_text || 'Unable to generate a response';
}

module.exports = {
  summarizePaper,
  extractKeywords,
  generateResearchGaps,
  suggestConnections,
  chatWithAI,
};
