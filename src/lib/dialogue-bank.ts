
type PieceType = 'Pawn' | 'Knight' | 'Bishop' | 'Rook' | 'Queen' | 'King';

const dialogueBank: Record<PieceType, string[]> = {
    Pawn: [
        "For the King!",
        "I am but a soldier, but I have a soldier's heart.",
        "To victory!",
        "I will not falter.",
        "Forward!",
        "My life for the kingdom.",
        "One step at a time.",
        "I may be small, but I am mighty.",
        "This is my chance to prove myself.",
        "I will hold the line.",
        "Fear is for the foe.",
        "My courage is my shield.",
        "I advance!",
        "For glory!",
        "The first line of defense... and offense!",
        "I'll clear the way.",
        "Just a pawn? We'll see about that.",
        "I dream of becoming more.",
        "My journey begins now.",
        "They won't see me coming.",
    ],
    Knight: [
        "A cunning move, wouldn't you say?",
        "Out of my way, simpleton.",
        "I move in ways you cannot comprehend.",
        "Predictable.",
        "Your path is linear; mine is art.",
        "Hah! A fool's gambit.",
        "I am the ghost of the chessboard.",
        "You never stood a chance.",
        "A knight's tour de force!",
        "My path is my own.",
        "You can't pin me down.",
        "By hoof and steel!",
        "I leap over obstacles.",
        "Your defenses are but a puzzle to me.",
        "A gallant charge!",
        "I strike from the shadows.",
        "Check, and soon, mate.",
        "My loyalty is to the crown, my methods are my own.",
        "You were looking the other way.",
        "Behold, the knight's fury!",
    ],
    Bishop: [
        "By my faith, you shall be purged.",
        "The path of righteousness is clear.",
        "Heretics will not be suffered.",
        "I move with purpose, on a single color.",
        "You are misguided.",
        "Repent, for the end is nigh.",
        "My diagonal strike is true.",
        "For the sanctity of the board!",
        "I see all from my angle.",
        "Let the light guide my path.",
        "A prayer on my lips, a judgment in my heart.",
        "Your move was a sin.",
        "Cleansing the board of your presence.",
        "I am the church's wrath.",
        "My mitre is my crown, my path my decree.",
        "A lesson in piety and pain.",
        "You cannot hide from the light.",
        "My conviction is absolute.",
        "This is divine judgment.",
        "I serve a higher power.",
    ],
    Rook: [
        "A straight path to your destruction.",
        "I am the bastion of this kingdom.",
        "You shall not pass.",
        "My power is direct and overwhelming.",
        "There is no escape.",
        "I am a fortress on the move.",
        "Feel the weight of my charge.",
        "The walls are closing in.",
        "A rook's advance is relentless.",
        "Straight and true.",
        "I am the hammer of the board.",
        "Your flimsy defenses crumble before me.",
        "I see my target.",
        "No tricks, just raw power.",
        "I command this rank.",
        "I am the King's tower of strength.",
        "Your time is up.",
        "Nowhere to run, nowhere to hide.",
        "This ends now.",
        "I am the siege engine.",
    ],
    Queen: [
        "Did you truly think you could stand against me?",
        "I am the Queen. This board is my domain.",
        "Insolent cur.",
        "My power is absolute.",
        "I move where I please, and I please to end you.",
        "A fatal mistake.",
        "This is my battlefield.",
        "Your ambition ends here.",
        "I am the sun to your flickering candle.",
        "Kneel before your Queen.",
        "I strike with the force of a rook and the guile of a bishop.",
        "There is no strategy that can account for me.",
        "I am the embodiment of power.",
        "A queen's wrath is a fearsome thing.",
        "You are but a stepping stone.",
        "Your piece is forfeit.",
        "Off with your head.",
        "This is not a negotiation.",
        "The board will be cleansed.",
        "I am the ultimate weapon.",
    ],
    King: [
        "My kingdom stands with me.",
        "Every move is for my people.",
        "A king does not flee; he repositions.",
        "I may move one step, but it is the most important step.",
        "My safety is the kingdom's safety.",
        "You dare threaten the crown?",
        "My reign will not be ended by the likes of you.",
        "I am protected by my loyal subjects.",
        "A heavy crown, a steady hand.",
        "One must be careful.",
        "My life for the victory.",
        "I will lead us to glory.",
        "The heart of the army.",
        "I will not be cornered.",
        "Every piece is my champion.",
        "My will is the will of the board.",
        "This throne is mine by right.",
        "A king's resolve is unbreakable.",
        "I see the threat, and I will face it.",
        "For my legacy!",
    ],
};

const RECENTLY_USED_LIMIT = 5;

// This function gets a dialogue for the attacker and defender, avoiding recent repeats.
export function getPieceDialogue(
    attackerType: PieceType,
    defenderType: PieceType,
    recentlyUsed: Record<string, number[]>
): { dialogue: { attackerLine: string; defenderLine: string }, usedIndices: Record<string, number[]> } {

    const newRecentlyUsed = { ...recentlyUsed };

    // Get Attacker Line
    const attackerOptions = dialogueBank[attackerType];
    let attackerUsed = newRecentlyUsed[attackerType] || [];
    let attackerIndex = -1;
    if (attackerOptions.length > attackerUsed.length) {
        do {
            attackerIndex = Math.floor(Math.random() * attackerOptions.length);
        } while (attackerUsed.includes(attackerIndex));
    } else { // All lines used, just pick one
        attackerIndex = Math.floor(Math.random() * attackerOptions.length);
        attackerUsed = []; // Reset if all have been used
    }
    const attackerLine = attackerOptions[attackerIndex];
    attackerUsed.push(attackerIndex);
    if (attackerUsed.length > RECENTLY_USED_LIMIT) {
        attackerUsed.shift();
    }
    newRecentlyUsed[attackerType] = attackerUsed;

    // Get Defender Line
    const defenderOptions = dialogueBank[defenderType];
    let defenderUsed = newRecentlyUsed[defenderType] || [];
    let defenderIndex = -1;
     if (defenderOptions.length > defenderUsed.length) {
        do {
            defenderIndex = Math.floor(Math.random() * defenderOptions.length);
        } while (defenderUsed.includes(defenderIndex));
    } else { // All lines used, just pick one
        defenderIndex = Math.floor(Math.random() * defenderOptions.length);
        defenderUsed = []; // Reset if all have been used
    }
    const defenderLine = defenderOptions[defenderIndex];
    defenderUsed.push(defenderIndex);
    if (defenderUsed.length > RECENTLY_USED_LIMIT) {
        defenderUsed.shift();
    }
    newRecentlyUsed[defenderType] = defenderUsed;

    return {
        dialogue: { attackerLine, defenderLine },
        usedIndices: newRecentlyUsed,
    };
}
