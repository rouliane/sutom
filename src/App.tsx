import './App.css';
// import Letter from './Letter';
import { useGameContext } from './gameContext';
import useEventListener from './useEventListener';
import Cell from "./Cell";

function App() {
  const gameContext = useGameContext();
  const handler = ({ key }: { key: any }) => {
    gameContext.typeLetter(key)
  };
  useEventListener("keydown", handler);

  const displayAttempt = (attemptNumber: number) => {
    return <tr>
      {/*{gameContext.wordToGuess.split('').map((_, index) => (*/}
      {/*  <Cell attempt={attemptNumber} index={index}></Cell>*/}
      {/*))}*/}
    </tr>;
  }

  return (
    <div className="App">
        <table>
          <tbody>
            {gameContext.previousAttempts.map((letters) => {
                return <tr>
                    {letters.map((letter) => {
                    return <Cell content={letter.letter} isCorrect={letter.isCorrect} isMisplaced={letter.isMisplaced} />
                    })}
                </tr>
            })}
            {
              Array.from(Array(gameContext.currentAttempt), (letters) => {
                return <tr>
                    {letters.map((letter) => {
                      return <Cell content={letter.letter} />
                    })}
                </tr>
            })}

            {/* {displayAttempt(0)}
            {displayAttempt(1)}
            {displayAttempt(2)}
            {displayAttempt(3)}
            {displayAttempt(4)}
            {displayAttempt(5)} */}
          </tbody>
        </table>
    </div>
  );
}

export default App;
