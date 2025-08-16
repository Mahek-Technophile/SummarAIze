// src/ai/flows/document-assistant.ts
'use server';

/**
 * @fileOverview Document Assistant AI agent.
 *
 * - askDocumentQuestion - A function that handles asking questions about uploaded documents.
 * - AskDocumentQuestionInput - The input type for the askDocumentQuestion function.
 * - AskDocumentQuestionOutput - The return type for the askDocumentQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskDocumentQuestionInputSchema = z.object({
  documentContent: z.string().describe('The content of the document as a string.'),
  question: z.string().describe('The follow-up question about the document.'),
});
export type AskDocumentQuestionInput = z.infer<typeof AskDocumentQuestionInputSchema>;

const AskDocumentQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question based on the document content.'),
});
export type AskDocumentQuestionOutput = z.infer<typeof AskDocumentQuestionOutputSchema>;

export async function askDocumentQuestion(input: AskDocumentQuestionInput): Promise<AskDocumentQuestionOutput> {
  return askDocumentQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askDocumentQuestionPrompt',
  input: {schema: AskDocumentQuestionInputSchema},
  output: {schema: AskDocumentQuestionOutputSchema},
  prompt: `You are a helpful document assistant. Use the content of the document provided to answer the user's question.

Document Content: {{{documentContent}}}

Question: {{{question}}}

Answer:`,
});

const askDocumentQuestionFlow = ai.defineFlow(
  {
    name: 'askDocumentQuestionFlow',
    inputSchema: AskDocumentQuestionInputSchema,
    outputSchema: AskDocumentQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
