'use server';

/**
 * @fileOverview A text summarization AI agent.
 *
 * - summarizeText - A function that handles the text summarization process.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import {ai} from '@/ai/genkit';
import {generate} from 'genkit';
import {z} from 'genkit';

const SummarizeTextInputSchema = z.object({
  text: z.string().describe('The transcript or text to summarize.'),
  prompt: z.string().describe('The prompt to guide the summarization.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('The chatbot-style summary of the text.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export async function summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput> {
  return summarizeTextFlow(input);
}

const prompt = `You are a chatbot summarizing text. Create a slightly detailed and conversational summary of the following text, guided by the prompt.\n\nPrompt: {{{prompt}}}\n\nText: {{{text}}}`;

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async input => {
    const models = ['groq/gemma-7b-it', 'openai/gpt-4', 'googleai/gemini-1.5-flash'];
    
    for (const model of models) {
      try {
        console.log(`Attempting to generate summary with ${model}`);
        const {output} = await generate({
          model: model,
          prompt: prompt,
          input: input,
          output: {
            schema: SummarizeTextOutputSchema,
          },
        });
        console.log(`Successfully generated summary with ${model}`);
        return output!;
      } catch (error) {
        console.error(`Failed to generate summary with ${model}:`, error);
        // Try the next model
      }
    }

    // If all models fail
    throw new Error('All AI models failed to generate a summary.');
  }
);
