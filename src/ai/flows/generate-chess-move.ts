
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating chess moves using an AI model.
 *
 * - generateChessMove - A function that takes the current board state and difficulty level as input and returns a suggested chess move.
 * - GenerateChessMoveInput - The input type for the generateChessMove function.
 * - GenerateChessMoveOutput - The return type for the generateChessMove function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChessMoveInputSchema = z.object({
  boardState: z
    .string()
    .describe("A string representing the current state of the chess board in FEN notation."),
  difficulty: z
    .enum(['Easy', 'Medium', 'Hard', 'Expert', 'Grandmaster'])
    .describe('The difficulty level of the AI opponent.'),
});
export type GenerateChessMoveInput = z.infer<typeof GenerateChessMoveInputSchema>;

const GenerateChessMoveOutputSchema = z.object({
  move: z.string().describe("A string representing the suggested chess move in UCI notation (e.g., 'e2e4', 'a1h8'). If it is a promotion, it should include the promotion piece (e.g., 'e7e8q')."),
  explanation: z
    .string()
    .describe("A brief explanation of the AI's reasoning behind the suggested move.")
    .optional(),
});
export type GenerateChessMoveOutput = z.infer<typeof GenerateChessMoveOutputSchema>;

export async function generateChessMove(input: GenerateChessMoveInput): Promise<GenerateChessMoveOutput> {
  return generateChessMoveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChessMovePrompt',
  input: {schema: GenerateChessMoveInputSchema},
  output: {schema: GenerateChessMoveOutputSchema},
  prompt: `You are a sophisticated chess AI that suggests the next move given a board state and a difficulty level.

Given the current board state in FEN notation:

{{boardState}}

And the difficulty level: {{difficulty}}

Suggest the best chess move in UCI notation and briefly explain your reasoning.

IMPORTANT: If you are in check, you MUST make a move to get out of check.

The move must be a legal move and in UCI format. For example: e2e4, g1f3, e7e8q (for promotion).

Output format: 
{
  "move": "<move_in_uci_notation>",
  "explanation": "<brief_explanation>"
}
`,
});

const generateChessMoveFlow = ai.defineFlow(
  {
    name: 'generateChessMoveFlow',
    inputSchema: GenerateChessMoveInputSchema,
    outputSchema: GenerateChessMoveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
