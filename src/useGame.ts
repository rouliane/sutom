import {useState} from "react";

type AttemptLetter = {
    letter: string | null;
    isCorrect: boolean;
    isMisplaced: boolean;
}

type Attempt = AttemptLetter[];

interface GameContextType {
    wordToGuess: string,
    previousAttempts: Attempt[],
    currentAttempt: Attempt;
    typeLetter: (letter: string) => void;
}

const MAX_ATTEMPTS = 6;
const ALLOWED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz.';

const useGame = (wordToGuess: string): GameContextType => {
    const [previousAttempts, setPreviousAttempts] = useState<Attempt[]>([]);

    const defaultLetter = {letter: null, isCorrect: false, isMisplaced: false};

    const initCurrentAttempt = () =>{
        return [
            {letter: wordToGuess.charAt(0), isCorrect: true, isMisplaced: false},
            ...Array.from({length: wordToGuess.length - 1}, () => defaultLetter),
        ];
    }

    const [currentAttempt, setCurrentAttempt] = useState<Attempt>(initCurrentAttempt());

    const isLetterMisplaced = (typedLetter: string, newLetterIndex: number) => {
        if (!wordToGuess.includes(typedLetter)) {
            return false;
        }

        const letterOccurencesInWord = wordToGuess.split("").filter((letter) => letter === typedLetter).length;
        const numberOfTimesThisLetterIsCorrectlyPlacedInCurrentAttempt = currentAttempt.filter((attempt) => attempt.isCorrect && attempt.letter === typedLetter).length;
        const numberOfTimesThisLetterIsMisplacedBeforeInCurrentAttempt = currentAttempt.filter((attempt, index) => attempt.isMisplaced && attempt.letter === typedLetter && index < newLetterIndex).length;

        return letterOccurencesInWord - numberOfTimesThisLetterIsMisplacedBeforeInCurrentAttempt - numberOfTimesThisLetterIsCorrectlyPlacedInCurrentAttempt > 0;
    }

    const isTypedWordLongEnough = () => {
        return currentAttempt.filter((attempt) => attempt.letter !== null).length === wordToGuess.length
    }

    const evaluateCurrentAttempt = () => {
        const newCurrentAttempt = [...currentAttempt];
        currentAttempt.forEach((letter, index) => {
            const isCorrect = wordToGuess.charAt(index) === letter.letter;
            newCurrentAttempt[index] = {
                letter: letter.letter,
                isCorrect,
                isMisplaced: !isCorrect && isLetterMisplaced(letter.letter as string, index),
            };
        });
        return newCurrentAttempt;
    }

    const typeLetter = (typedLetter: string) => {
        if (!ALLOWED_CHARACTERS.includes(typedLetter) && typedLetter !== "Backspace" && typedLetter !== "Enter") {
            return;

        }

        if (typedLetter === "Enter") {
            if (!isTypedWordLongEnough()) {
                return;
            }
            setPreviousAttempts([...previousAttempts, evaluateCurrentAttempt()]);
            setCurrentAttempt(initCurrentAttempt());
            return;
        }

        const nextLetterIndexInCurrentAttempt = currentAttempt.findIndex((attempt) => attempt.letter === null);

        if (typedLetter === "Backspace") {
            if (nextLetterIndexInCurrentAttempt === 1) {
                return;
            }
            const newCurrentAttempt = [...currentAttempt];
            newCurrentAttempt[nextLetterIndexInCurrentAttempt - 1] = defaultLetter;
            setCurrentAttempt(newCurrentAttempt);
            return;
        }

        //If this is the last letter, we don't update the current attempt
        if (nextLetterIndexInCurrentAttempt === -1) {
            return;
        }

        const newCurrentAttempt = [...currentAttempt];
        const isCorrect = wordToGuess.charAt(nextLetterIndexInCurrentAttempt) === typedLetter;
        newCurrentAttempt[nextLetterIndexInCurrentAttempt] = {
            letter: typedLetter,
            isCorrect,
            isMisplaced: !isCorrect && isLetterMisplaced(typedLetter, nextLetterIndexInCurrentAttempt),
        };
        setCurrentAttempt(newCurrentAttempt);
    }

    return {
        wordToGuess,
        previousAttempts,
        currentAttempt,
        typeLetter,
    };
}

export {useGame, MAX_ATTEMPTS, ALLOWED_CHARACTERS};

export type {GameContextType};
