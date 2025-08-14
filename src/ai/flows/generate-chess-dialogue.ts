'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating pre-battle dialogue between two chess pieces.
 *
 * - generateChessDialogue - A function that takes the attacking and defending pieces and returns a short, creative dialogue.
 * - GenerateChessDialogueInput - The input type for the generateChessDialogue function.
 * - GenerateChessDialogueOutput - The return type for the generateChessDialogue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PieceSchema = z.object({
    color: z.enum(['White', 'Black']),
    type: z.enum(['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King']),
});

const GenerateChessDialogueInputSchema = z.object({
  attacker: PieceSchema,
  defender: PieceSchema,
});
export type GenerateChessDialogueInput = z.infer<typeof GenerateChessDialogueInputSchema>;

const GenerateChessDialogueOutputSchema = z.object({
  attackerLine: z.string().describe("A short, creative, in-character line for the attacking piece."),
  defenderLine: z.string().describe("A short, creative, in-character line for the defending piece in response to the attacker."),
});
export type GenerateChessDialogueOutput = z.infer<typeof GenerateChessDialogueOutputSchema>;

export async function generateChessDialogue(input: GenerateChessDialogueInput): Promise<GenerateChessDialogueOutput> {
    return generateChessDialogueFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateChessDialoguePrompt',
    input: {schema: GenerateChessDialogueInputSchema},
    output: {schema: GenerateChessDialogueOutputSchema},
    prompt: `You are a creative writer for a fantasy chess game. Your task is to write a brief, dramatic, and creative pre-battle dialogue between two chess pieces.

The dialogue should reflect the personalities of the pieces involved.
- Pawns are brave but expendable.
- Knights are tricky and arrogant.
- Bishops are zealous and righteous.
- Rooks are straightforward and powerful.
- Queens are dominant and regal.
- Kings are noble but vulnerable.

Keep the lines very short and punchy.

Attacking Piece: {{attacker.color}} {{attacker.type}}
Defending Piece: {{defender.color}} {{defender.type}}

Generate a unique dialogue for this encounter.
`,
});


const generateChessDialogueFlow = ai.defineFlow(
    {
        name: 'generateChessDialogueFlow',
        inputSchema: GenerateChessDialogueInputSchema,
        outputSchema: GenerateChessDialogueOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
