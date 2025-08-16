'use server';
/**
 * @fileOverview A transcript optimization AI agent.
 *
 * - optimizeTranscript - A function that handles the transcript optimization process.
 * - OptimizeTranscriptInput - The input type for the optimizeTranscript function.
 * - OptimizeTranscriptOutput - The return type for the optimizeTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeTranscriptInputSchema = z.object({
  transcript: z.string().describe('The transcript to optimize.'),
});
export type OptimizeTranscriptInput = z.infer<typeof OptimizeTranscriptInputSchema>;

const OptimizeTranscriptOutputSchema = z.object({
  optimizations: z.array(z.string()).describe('A list of bullet-point optimizations and action items.'),
});
export type OptimizeTranscriptOutput = z.infer<typeof OptimizeTranscriptOutputSchema>;

export async function optimizeTranscript(input: OptimizeTranscriptInput): Promise<OptimizeTranscriptOutput> {
  return optimizeTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeTranscriptPrompt',
  input: {schema: OptimizeTranscriptInputSchema},
  output: {schema: OptimizeTranscriptOutputSchema},
  prompt: `You are an expert in providing actionable optimizations for transcripts.

  Given the following transcript, generate a list of bullet-point optimizations and action items.

  Transcript: {{{transcript}}}

  Optimizations and Action Items:
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const optimizeTranscriptFlow = ai.defineFlow(
  {
    name: 'optimizeTranscriptFlow',
    inputSchema: OptimizeTranscriptInputSchema,
    outputSchema: OptimizeTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
