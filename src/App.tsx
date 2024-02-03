import './App.css';
import { useGameContext } from './gameContext';
import useEventListener from './useEventListener';
import Cell from "./Cell";
import {MAX_ATTEMPTS} from "./useGame";

function App() {
  const gameContext = useGameContext();
  const handler = ({ key }: { key: any }) => {
    gameContext.typeLetter(key)
  };
  useEventListener("keydown", handler);

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
              gameContext.previousAttempts.length < MAX_ATTEMPTS && Array.from(Array(gameContext.currentAttempt), (letters) => {
                return <tr>
                    {letters.map((letter) => {
                      return <Cell content={letter.letter} />
                    })}
                </tr>
            })}
            {
              Array.from({length: MAX_ATTEMPTS - gameContext.previousAttempts.length - 1}, () => {
                return <tr>
                    {gameContext.wordToGuess.split("").map(() => {
                      return <Cell content={"."} />
                    })}
                </tr>
            })}
          </tbody>
        </table>
    </div>
  );
}

export default App;
