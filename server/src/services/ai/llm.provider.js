import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import logger from '../../utils/logger.js';

// --- Provider initialization ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Check if an error is a rate limit or service unavailable error.
 * @param {Error} err
 * @returns {boolean}
 */
export const isRateLimitError = (err) => {
  const status = err?.status || err?.httpStatusCode || err?.code;
  const message = err?.message || '';
  return (
    status === 429 ||
    status === 503 ||
    message.includes('429') ||
    message.includes('503') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('overloaded')
  );
};

/**
 * Strip markdown code fences from LLM output before JSON.parse.
 * @param {string} text - Raw LLM text that may contain ```json ... ``` fences
 * @returns {string} Clean JSON string
 */
export const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  // Remove ```json or ``` prefix
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  // Remove trailing ```
  cleaned = cleaned.replace(/\n?```\s*$/i, '');
  return cleaned.trim();
};

/**
 * Generate text using Gemini primary, Groq fallback.
 * @param {string} systemPrompt - System-level instruction
 * @param {string} userPrompt - User-level input
 * @param {object} [options={}] - Options: temperature, maxTokens
 * @returns {Promise<string>} Generated text
 */
export const generateText = async (systemPrompt, userPrompt, options = {}) => {
  const { temperature = 0.3, maxTokens = 4096 } = options;

  // Try Gemini first
  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    const response = result.response;
    return response.text();
  } catch (err) {
    if (isRateLimitError(err)) {
      logger.warn('Gemini rate limited, falling back to Groq', { error: err.message });
      return generateTextGroq(systemPrompt, userPrompt, temperature, maxTokens);
    }
    throw err;
  }
};

/**
 * Generate text via Groq (fallback).
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {number} temperature
 * @param {number} maxTokens
 * @returns {Promise<string>}
 */
const generateTextGroq = async (systemPrompt, userPrompt, temperature, maxTokens) => {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content || '';
};

/**
 * Generate and parse JSON using Gemini primary, Groq fallback.
 * @param {string} systemPrompt - System-level instruction
 * @param {string} userPrompt - User-level input
 * @param {object} [options={}] - Options: temperature, maxTokens
 * @returns {Promise<object>} Parsed JSON object
 */
export const generateJSON = async (systemPrompt, userPrompt, options = {}) => {
  const rawText = await generateText(
    systemPrompt + '\n\nYou MUST respond with valid JSON only. No markdown, no explanation.',
    userPrompt,
    { ...options, temperature: options.temperature ?? 0.1 }
  );

  const cleaned = cleanJsonResponse(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    logger.error('JSON parse failed from LLM response', {
      rawText: rawText.substring(0, 500),
      error: parseError.message,
    });
    throw new Error(`Failed to parse LLM JSON response: ${parseError.message}`);
  }
};

/**
 * Stream text using Gemini primary, Groq fallback.
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {object} [options={}]
 * @returns {AsyncGenerator<string>}
 */
export async function* streamText(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.3, maxTokens = 4096 } = options;

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (err) {
    if (isRateLimitError(err)) {
      logger.warn('Gemini streaming rate limited, falling back to Groq');
      yield* streamTextGroq(systemPrompt, userPrompt, temperature, maxTokens);
    } else {
      throw err;
    }
  }
}

/**
 * Stream text via Groq (fallback).
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {number} temperature
 * @param {number} maxTokens
 * @returns {AsyncGenerator<string>}
 */
async function* streamTextGroq(systemPrompt, userPrompt, temperature, maxTokens) {
  const stream = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
