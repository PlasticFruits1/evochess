
'use server';

/**
 * @fileOverview This file defines a Genkit flow for evaluating a chess board position.
 * 
 * - evaluateBoard - A function that takes the current board state and returns an evaluation.
 * - EvaluateBoardInput - The input type for the evaluateBoard function.
 * - EvaluateBoardOutput - The return type for the evaluateBoard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateBoardInputSchema = z.object({
  boardState: z
    .string()
    .describe("A string representing the current state of the chess board in FEN notation."),
});
export type EvaluateBoardInput = z.infer<typeof EvaluateBoardInputSchema>;

const EvaluateBoardOutputSchema = z.object({
  evaluation: z
    .number()
    .describe("A number between -10 and 10, where a positive value favors White, a negative value favors Black, and 0 is an even position. For example, +2.5 means White is ahead by about 2.5 pawns."),
  reason: z
    .string()
    .describe("A brief explanation of the evaluation, mentioning key positional factors, threats, or material advantage.")
    .optional(),
});
export type EvaluateBoardOutput = z.infer<typeof EvaluateBoardOutputSchema>;

export async function evaluateBoard(input: EvaluateBoardInput): Promise<EvaluateBoardOutput> {
  return evaluateBoardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateBoardPrompt',
  input: {schema: EvaluateBoardInputSchema},
  output: {schema: EvaluateBoardOutputSchema},
  prompt: `You are a world-class chess grandmaster. Analyze the following chess position provided in FEN notation and provide a concise evaluation.

FEN: {{boardState}}

Your evaluation should be a single number from -10 to 10.
- A positive number indicates an advantage for White.
- A negative number indicates an advantage for Black.
- 0 indicates a balanced position.
- The magnitude of the number indicates the size of the advantage (e.g., +1 is a small advantage for White, -5 is a decisive advantage for Black).

Also, provide a brief, one-sentence explanation for your evaluation, focusing on the most critical strategic element (e.g., "White has a strong kingside attack," "Black controls the center," or "The position is equal due to the symmetrical pawn structure.").
`,
});

const evaluateBoardFlow = ai.defineFlow(
  {
    name: 'evaluateBoardFlow',
    inputSchema: EvaluateBoardInputSchema,
    outputSchema: EvaluateBoardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
