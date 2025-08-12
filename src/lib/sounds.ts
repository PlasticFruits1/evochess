'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

const getSynth = () => new Tone.Synth().toDestination();

export const playMoveSound = () => {
    if (!Tone.context.state || Tone.context.state !== 'running') return;
    const synth = getSynth();
    synth.triggerAttackRelease("C4", "8n", Tone.now());
};

export const playCaptureSound = () => {
    if (!Tone.context.state || Tone.context.state !== 'running') return;
    const synth = getSynth();
    synth.triggerAttackRelease("E4", "8n", Tone.now());
};

export const playEvolveSound = () => {
    if (!Tone.context.state || Tone.context.state !== 'running') return;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C5", "8n", now);
    synth.triggerAttackRelease("E5", "8n", now + 0.1);
    synth.triggerAttackRelease("G5", "8n", now + 0.2);
};

export const playCheckSound = () => {
    if (!Tone.context.state || Tone.context.state !== 'running') return;
    const synth = getSynth();
    synth.triggerAttackRelease("F#5", "16n", Tone.now());
};

export const playGameOverSound = () => {
    if (!Tone.context.state || Tone.context.state !== 'running') return;
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C3", "4n", now);
    synth.triggerAttackRelease("G3", "4n", now + 0.4);
};

export function useTone() {
    const started = useRef(false);
    useEffect(() => {
        const startAudio = async () => {
            if (!started.current && Tone.context.state !== 'running') {
                await Tone.start();
                started.current = true;
            }
        };

        const eventHandlers = ['click', 'keydown', 'touchstart'];
        eventHandlers.forEach(event => {
            document.body.addEventListener(event, startAudio, { once: true });
        });
        
        return () => {
             eventHandlers.forEach(event => {
                document.body.removeEventListener(event, startAudio);
            });
        };
    }, []);
}
