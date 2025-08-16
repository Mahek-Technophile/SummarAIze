// src/ai/genkit.ts
'use server';

import {ai} from '@/ai/genkit';
import {configureGenkit, genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import {z} from 'zod';

// Configure Genkit plugins
configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracing: true,
});

export const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: z.object({
      text: z.string(),
      prompt: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({text, prompt}) => {
    const systemPrompt = `You are a chatbot summarizing text. Create a slightly detailed and conversational summary of the following text, guided by the prompt.\n\nPrompt: ${prompt}\n\nText: ${text}`;
    const messages = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: `Summarize the text based on the prompt.`},
    ];

    // 1. Try Groq
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('Attempting to generate summary with Groq');
        const groqClient = new Groq({apiKey: process.env.GROQ_API_KEY});
        const resp = await groqClient.chat.completions.create({
          model: 'mixtral-8x7b-32768',
          messages: messages as any,
        });
        const summary = resp.choices[0].message?.content ?? '';
        if (summary) {
          console.log('Successfully generated summary with Groq');
          return summary;
        }
      } catch (err) {
        console.warn('Groq failed, falling back to OpenAI...', err);
      }
    }

    // 2. Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('Attempting to generate summary with OpenAI');
        const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
        const resp = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages as any,
        });
        const summary = resp.choices[0].message?.content ?? '';
        if (summary) {
          console.log('Successfully generated summary with OpenAI');
          return summary;
        }
      } catch (err) {
        console.warn('OpenAI failed, falling back to Gemini...', err);
      }
    }

    // 3. Try Gemini
    try {
      console.log('Attempting to generate summary with Gemini');
      const gemini = googleAI().model('gemini-1.5-pro');
      const result = await gemini.generate({
        body: {
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{text: msg.content}],
          })),
        },
      });
      const summary = result.candidates[0]?.content?.parts[0]?.text ?? '';
      if (summary) {
        console.log('Successfully generated summary with Gemini');
        return summary;
      }
    } catch (err) {
      console.error('All providers failed:', err);
      throw new Error('Summarization failed across all providers');
    }

    throw new Error('All AI models failed to generate a summary.');
  }
);
