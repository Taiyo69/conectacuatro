import { useState } from 'react';
import './index.css';

const TURNS = {
  X: 'X',
  O: 'O',
};

const WINNER_COMBOS = (combo, board, i) => {
  if (combo === 'one row') {
    return board[i] === board[i - 1] &&
      board[i] === board[i + 1] &&
      board[i] === board[i + 2]
      ? true
      : false;
  } else if (combo === 'one column') {
    return board[i] === board[i - 7] &&
      board[i] === board[i + 7] &&
      board[i] === board[i + 14]
      ? true
      : false;
  } else if (combo === 'diagonal right down') {
    return board[i] === board[i - 6] &&
      board[i] === board[i + 6] &&
      board[i] === board[i + 12]
      ? true
      : false;
  } else if (combo === 'diagonal right up') {
    return board[i] === board[i - 8] &&
      board[i] === board[i + 8] &&
      board[i] === board[i + 16]
      ? true
      : false;
  } else if (combo === 'diagonal left down') {
    return board[i] === board[i + 6] &&
      board[i] === board[i - 6] &&
      board[i] === board[i - 12]
      ? true
      : false;
  } else if (combo === 'diagonal left up') {
    return board[i] === board[i + 8] &&
      board[i] === board[i - 8] &&
      board[i] === board[i - 16]
      ? true
      : false;
  }
};

function App() {
  const [board, setBoard] = useState(() => {
    return localStorage.getItem('board') !== null
      ? JSON.parse(localStorage.getItem('board'))
      : Array(42).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    return localStorage.getItem('turn') !== null
      ? localStorage.getItem('turn')
      : TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const Square = ({ children, index, isSelected, updateBoard }) => {
    const className = `square ${isSelected ? 'is-selected' : ''}`;

    const handleClick = () => {
      updateBoard(index);
    };

    return (
      <div className={className} onClick={handleClick}>
        {children}
      </div>
    );
  };

  const updateBoardCheck = (board, index) => {
    let newBoard = [...board];
    let count = index;
    for (let i = 0; i < 7; i++) {
      count += 7;
      if (
        typeof board[count] === 'undefined' ||
        typeof board[count] === 'string'
      ) {
        count -= 7;
        newBoard[count] = turn;
        break;
      }
    }
    return newBoard;
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = updateBoardCheck(board, index);
    localStorage.setItem('board', JSON.stringify(newBoard));
    setBoard(newBoard);

    setWinner(() => {
      if (checkWinner(newBoard)) {
        return turn;
      } else if (checkEndGame(newBoard)) {
        return '=';
      }
    });

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    localStorage.setItem('turn', newTurn);
    setTurn(newTurn);
  };

  const resetGame = () => {
    setBoard(Array(42).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    localStorage.removeItem('board');
    localStorage.removeItem('turn');
  };

  const checkWinner = (board) => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null && WINNER_COMBOS('one row', board, i)) {
        return true;
      } else if (board[i] !== null && WINNER_COMBOS('one column', board, i)) {
        return true;
      } else if (
        board[i] !== null &&
        WINNER_COMBOS('diagonal right down', board, i)
      ) {
        return true;
      } else if (
        board[i] !== null &&
        WINNER_COMBOS('diagonal right up', board, i)
      ) {
        return true;
      } else if (
        board[i] !== null &&
        WINNER_COMBOS('diagonal left down', board, i)
      ) {
        return true;
      } else if (
        board[i] !== null &&
        WINNER_COMBOS('diagonal left up', board, i)
      ) {
        return true;
      }
    }
  };

  const checkEndGame = (board) => {
    return board.every((square) => square !== null);
  };

  return (
    <main>
      {winner !== null && (
        <div className={typeof winner === 'string' ? 'modal' : 'modal hide'}>
          <strong>{winner === '=' ? 'Lo siento...' : '¡¡FELICIDADES!!'}</strong>
          <h1>{winner !== '=' ? 'Ha ganado:' : 'Empate'}</h1>
          <span>{winner}</span>
          <button onClick={resetGame}>Reiniciar juego</button>
        </div>
      )}
      <h1>Conecta Cuatro</h1>
      <button onClick={resetGame}>Reiniciar juego</button>

      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
    </main>
  );
}

export default App;
