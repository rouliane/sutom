import useEventListener from '../hooks/useEventListener';
import Cell from "./Cell";
import {GameStatus, MAX_ATTEMPTS, useGame} from "../hooks/useGame";
import WonGame from "./WonGame";
import LostGame from "./LostGame";

function App() {
  const {wordToGuess, previousAttempts, currentAttempt, typeLetter, gameStatus} = useGame("peplum");
  const handler = ({ key }: { key: any }) => {
    typeLetter(key)
  };
  useEventListener("keydown", handler);

  if (gameStatus === GameStatus.WON) {
    return <WonGame/>
  }
  if (gameStatus === GameStatus.LOST) {
    return <LostGame/>
  }

  return (
      <>
        <h1>SUTOM</h1>
        <div className="App">
            <table>
              <tbody>
                {previousAttempts.map((letters) => {
                    return <tr>
                        {letters.map((letter) => {
                        return <Cell content={letter.letter} isCorrect={letter.isCorrect} isMisplaced={letter.isMisplaced} />
                        })}
                    </tr>
                })}
                {
                  previousAttempts.length < MAX_ATTEMPTS && Array.from(Array(currentAttempt), (letters) => {
                    return <tr>
                        {letters.map((letter) => {
                          return <Cell content={letter.letter} />
                        })}
                    </tr>
                })}
                {
                  Array.from({length: MAX_ATTEMPTS - previousAttempts.length - 1}, () => {
                    return <tr>
                        {wordToGuess.split("").map(() => {
                          return <td></td>
                        })}
                    </tr>
                })}
              </tbody>
            </table>
        </div>
      </>
  );
}

export default App;
