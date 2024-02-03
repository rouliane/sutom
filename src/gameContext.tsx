import React, { createContext, useContext, useState } from 'react';

type Attempts = {
    [index: number]: string[];
}

interface GameContextType {
    attempts: Attempts;
    word: string;
    setWord: (newWord: string) => void;
    currentAttempt: number;
    getTypedLetter: (attemptNumber: number, letterIndex: number) => string | null;
    enterLetter: (letter: string) => void;
}

const initialWord = 'suggestion';
const maxAttempts = 6;
const allowedCharacters = 'abcdefghijklmnopqrstuvwxyz';

export const GameContext = createContext<GameContextType>({
    currentAttempt: 0,
    attempts: {},
    word: initialWord,
    setWord: () => {},
    getTypedLetter: () => null,
    enterLetter: () => {},
});

const GameProvider = ({ children }: {children: any}) => {
    const [word, setWord] = useState(initialWord);
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [attempts, setAttempts] = useState<Attempts>({0: [initialWord.charAt(0)]});

    const getTypedLetter = (attemptNumber: number, letterIndex: number) => {
        const attempt = attempts[attemptNumber];
        if (attempt) {
            return attempt[letterIndex];
        }
        return null;
    }

    const fillNextAttemptWithCorrectLettersFromThePreviousAttempt = () => {
        const attempt = attempts[currentAttempt];
        if (attempt) {
            const nextAttempt = attempt.map((letter, index) => {
                if (letter === word.charAt(index)) {
                    return letter;
                }
                return "";
            });
            setAttempts({...attempts, [currentAttempt + 1]: nextAttempt});
        }
    }

    const enterLetter = (letter: string) => {
        const attempt = attempts[currentAttempt];
        if (attempt) {
            if (!allowedCharacters.includes(letter) && letter !== "Backspace" && letter !== "Enter") {
                return;
            }

            if (attempt.length === word.length && letter !== "Backspace" && letter !== "Enter") {
                return;
            }

            if (letter === "Backspace") {
                if (attempt.length === 1) {
                    return;
                }
                attempt.pop();
                setAttempts({...attempts, [currentAttempt]: attempt});
                return;
            }

            if (letter === "Enter") {
                if (currentAttempt === maxAttempts) {
                    return;
                }
                fillNextAttemptWithCorrectLettersFromThePreviousAttempt();
                setCurrentAttempt(currentAttempt + 1);
                return;
            }

            const nextIndex = attempt.length
            attempt[nextIndex] = letter;
            setAttempts({...attempts, [currentAttempt]: attempt});
        } else {
            attempts[currentAttempt] = [letter];
        }
    };

    return (
        <GameContext.Provider value={{ enterLetter, currentAttempt, getTypedLetter, attempts, word, setWord }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    return useContext(GameContext);
};



export default GameProvider;