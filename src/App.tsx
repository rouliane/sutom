import './App.css';
import Cell from './Letter';
import { useGameContext } from './gameContext';
import useEventListener from './useEventListener';

function App() {
  const gameContext = useGameContext();
  const handler = ({ key }: { key: any }) => {
    gameContext.enterLetter(key)
  };
  useEventListener("keydown", handler);

  const displayAttempt = (attemptNumber: number) => {
    return <tr>
      {gameContext.word.split('').map((_, index) => (
        <Cell attempt={attemptNumber} index={index}></Cell>
      ))}
    </tr>;
  }

  return (
    <div className="App">
        <table>
          <tbody>
            {displayAttempt(0)}
            {displayAttempt(1)}
            {displayAttempt(2)}
            {displayAttempt(3)}
            {displayAttempt(4)}
            {displayAttempt(5)}
          </tbody>
        </table>
    </div>
  );
}

export default App;
