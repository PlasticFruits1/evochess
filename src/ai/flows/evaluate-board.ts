
'use server';

/**
 * @fileOverview This file defines a Genkit flow for evaluating a chess board state.
 *
 * - evaluateBoard - A function that takes the current board state and returns a numerical evaluation.
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
  evaluation: z.number().describe("A numerical evaluation of the board state from White's perspective. Positive values favor White, negative values favor Black. The range should ideally be between -10 and 10, where 0 represents an equal position. For example, +1.5 means White is slightly better, and -3.0 means Black has a significant advantage."),
});
export type EvaluateBoardOutput = z.infer<typeof EvaluateBoardOutputSchema>;

export async function evaluateBoard(input: EvaluateBoardInput): Promise<EvaluateBoardOutput> {
  return evaluateBoardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateBoardPrompt',
  input: {schema: EvaluateBoardInputSchema},
  output: {schema: EvaluateBoardOutputSchema},
  prompt: `You are a world-class chess engine. Your task is to evaluate a chess position and provide a numerical score from White's perspective.

The current board state is given in FEN notation:
{{boardState}}

Analyze the position carefully, considering material advantage, piece activity, king safety, pawn structure, and control of the center.

Provide a single numerical evaluation.
- A positive number means White has the advantage.
- A negative number means Black has the advantage.
- 0 means the position is equal.
- A value of +1.0 is equivalent to being up one pawn.
- Keep the evaluation score within a range of -10 to +10.

Output only the JSON object with the evaluation score.`,
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

    