import {useState} from "react";

type AttemptLetter = {
    letter: string | null;
    isCorrect: boolean;
    isMisplaced: boolean;
}

type Attempt = AttemptLetter[];

enum GameStatus {
    INPROGRESS = "inprogress",
    WON = "won",
    LOST = "lost",
}

type GameType = {
    wordToGuess: string,
    previousAttempts: Attempt[],
    currentAttempt: Attempt;
    typeLetter: (letter: string) => void;
    gameStatus: GameStatus;
}

const MAX_ATTEMPTS = 6;
const ALLOWED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz.';
const defaultLetter = {letter: null, isCorrect: false, isMisplaced: false};

const useGame = (wordToGuess: string): GameType => {
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.INPROGRESS);
    const [previousAttempts, setPreviousAttempts] = useState<Attempt[]>([]);
    const initCurrentAttempt = () =>{
        return [
            {letter: wordToGuess.charAt(0), isCorrect: true, isMisplaced: false},
            ...Array.from({length: wordToGuess.length - 1}, () => defaultLetter),
        ];
    }
    const [currentAttempt, setCurrentAttempt] = useState<Attempt>(initCurrentAttempt());

    const typeLetter = (typedLetter: string) => {
        if (previousAttempts.length === MAX_ATTEMPTS) {
            return;
        }

        if (!ALLOWED_CHARACTERS.includes(typedLetter) && typedLetter !== "Backspace" && typedLetter !== "Enter") {
            return;
        }

        if (typedLetter === "Enter") {
            if (!isTypedWordLongEnough() || currentAttemptContainsDot() || gameStatus === GameStatus.WON) {
                return;
            }

            const currentAttempt = evaluateCurrentAttempt();

            if (isCurrentAttemptCorrect(currentAttempt)) {
                setGameStatus(GameStatus.WON);
                return;
            }

            const newPreviousAttempts: Attempt[] = [...previousAttempts, currentAttempt];
            setPreviousAttempts(newPreviousAttempts);
            if (newPreviousAttempts.length === MAX_ATTEMPTS) {
                setGameStatus(GameStatus.LOST);
                return;
            }
            setCurrentAttempt(initCurrentAttempt());
            return;
        }

        const nextLetterIndex = currentAttempt.findIndex((attempt) => attempt.letter === null);

        if (typedLetter === "Backspace") {
            if (nextLetterIndex === 1) {
                return;
            }
            const newCurrentAttempt = [...currentAttempt];
            newCurrentAttempt[nextLetterIndex - 1] = defaultLetter;
            setCurrentAttempt(newCurrentAttempt);
            return;
        }

        if (nextLetterIndex === -1) {
            return;
        }

        const newCurrentAttempt = [...currentAttempt];
        const isCorrect = wordToGuess.charAt(nextLetterIndex) === typedLetter;
        newCurrentAttempt[nextLetterIndex] = {
            letter: typedLetter,
            isCorrect,
            isMisplaced: !isCorrect && isLetterMisplaced(typedLetter, nextLetterIndex),
        };
        setCurrentAttempt(newCurrentAttempt);
    }
    const isLetterMisplaced = (typedLetter: string, letterIndex: number) => {
        if (!wordToGuess.includes(typedLetter)) {
            return false;
        }

        const letterOccurencesInWord = wordToGuess.split("").filter((letter) => letter === typedLetter).length;
        const numberOfTimesThisLetterIsCorrectlyPlacedInCurrentAttempt = currentAttempt.filter((attempt) => attempt.isCorrect && attempt.letter === typedLetter).length;
        const numberOfTimesThisLetterIsMisplacedBeforeInCurrentAttempt = currentAttempt.filter((attempt, index) => attempt.isMisplaced && attempt.letter === typedLetter && index < letterIndex).length;

        return letterOccurencesInWord - numberOfTimesThisLetterIsMisplacedBeforeInCurrentAttempt - numberOfTimesThisLetterIsCorrectlyPlacedInCurrentAttempt > 0;
    }

    const isTypedWordLongEnough = () => {
        return currentAttempt.filter((attempt) => attempt.letter !== null).length === wordToGuess.length
    }

    const currentAttemptContainsDot = () => {
        return currentAttempt.some((attempt) => attempt.letter === ".");
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

    const isCurrentAttemptCorrect = (currentAttempt: AttemptLetter[]) => {
        return currentAttempt.every((letter) => letter.isCorrect);
    };

    return {
        wordToGuess,
        previousAttempts,
        currentAttempt,
        typeLetter,
        gameStatus,
    };
}

export {useGame, MAX_ATTEMPTS, ALLOWED_CHARACTERS, GameStatus};

export type {GameType};
