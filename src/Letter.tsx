import React from 'react';
import { useGameContext } from './gameContext';

type CellProps = {
    attempt: number;
    index: number;
}

const Letter: React.FC<CellProps> = ({ attempt, index }) => {
    // const gameContext = useGameContext();
    //
    // const isCurrentAttempt = attempt === gameContext.currentAttempt;
    // const letter = gameContext.getTypedLetter(attempt, index);
    // const isFirstLetterOfFirstAttempt = attempt === 0 && index === 0;
    // const wasLetterCorrectAtPreviousAttempt = attempt <= gameContext.currentAttempt && gameContext.getTypedLetter(attempt - 1, index) === gameContext.word.charAt(index);
    // const isLetterMisplaced = !isCurrentAttempt && !wasLetterCorrectAtPreviousAttempt && letter && gameContext.word.includes(letter);
    //
    // return <td className={wasLetterCorrectAtPreviousAttempt || isFirstLetterOfFirstAttempt ? "correct" : isLetterMisplaced ? "misplaced" : ""}>{letter}</td>;
    return <></>
};

export default Letter;
