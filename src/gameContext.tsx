import React, {createContext, useContext} from 'react';
import {GameContextType, useGame} from "./useGame";

export const GameContext = createContext<GameContextType>({
    wordToGuess: "",
    previousAttempts: [],
    currentAttempt: [],
    typeLetter: () => {},
});

const GameProvider = ({ children }: {children: any}) => {
    const {wordToGuess, previousAttempts, currentAttempt, typeLetter} = useGame("peplum");

    return (
        <GameContext.Provider value={{ wordToGuess, previousAttempts, currentAttempt, typeLetter }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    return useContext(GameContext);
};



export default GameProvider;
