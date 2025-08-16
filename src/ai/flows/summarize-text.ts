'use server';

/**
 * @fileOverview A text summarization AI agent.
 *
 * - summarizeText - A function that handles the text summarization process.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import { summarizeTextFlow } from '@/ai/genkit';
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
  const summary =  await summarizeTextFlow(input);
  return { summary };
}
