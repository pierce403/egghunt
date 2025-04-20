import React, { useState, useEffect, useRef } from 'react';

type Position = { x: number; y: number; };

const BOARD_SIZE = 10;
const NUM_EGGS = 5;

const getRandomPositions = (count: number, exclude: Position): Position[] => {
  const positions: Position[] = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (x === exclude.x && y === exclude.y) continue;
      positions.push({ x, y });
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions.slice(0, count);
};

const Game: React.FC = () => {
  const [bunny, setBunny] = useState<Position>({ x: 0, y: 0 });
  const [eggs, setEggs] = useState<Position[]>(() => getRandomPositions(NUM_EGGS, { x: 0, y: 0 }));
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Refs for continuous movement and state synchronization
  const bunnyRef = useRef<Position>(bunny);
  const eggsRef = useRef<Position[]>(eggs);
  const gameOverRef = useRef<boolean>(gameOver);
  const pressedKeyRef = useRef<string | null>(null);
  const MOVE_INTERVAL_MS = 100;
  const lastMoveTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Sync refs with state
  useEffect(() => { bunnyRef.current = bunny; }, [bunny]);
  useEffect(() => { eggsRef.current = eggs; }, [eggs]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);

  // Continuous movement: start moving on keydown, stop on keyup
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(gameLoop);

      if (gameOverRef.current) return;

      // Check if enough time has passed since the last move
      if (currentTime - lastMoveTimeRef.current < MOVE_INTERVAL_MS) {
        return;
      }

      let { x, y } = bunnyRef.current;
      switch (pressedKeyRef.current) {
        case 'ArrowUp':
          if (y > 0) y -= 1;
          break;
        case 'ArrowDown':
          if (y < BOARD_SIZE - 1) y += 1;
          break;
        case 'ArrowLeft':
          if (x > 0) x -= 1;
          break;
        case 'ArrowRight':
          if (x < BOARD_SIZE - 1) x += 1;
          break;
        default:
          return;
      }
      lastMoveTimeRef.current = currentTime; // Record the time of this move

      const newPos = { x, y };
      setBunny(newPos);
      bunnyRef.current = newPos;

      const eggIndex = eggsRef.current.findIndex(pos => pos.x === x && pos.y === y);
      if (eggIndex !== -1) {
        const newEggs = [...eggsRef.current];
        newEggs.splice(eggIndex, 1);
        setEggs(newEggs);
        eggsRef.current = newEggs;
        setScore(prev => prev + 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Only set the key, don't trigger movement directly
        // Allow changing direction even if a key is already held
        pressedKeyRef.current = e.key;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === pressedKeyRef.current) {
        // Clear the key when released
        pressedKeyRef.current = null;
      }
    };

    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Stop the game loop on cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Record start time on mount
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (score === NUM_EGGS) {
      setGameOver(true);
      if (startTime) {
        const endTime = Date.now();
        setDuration((endTime - startTime) / 1000); // Duration in seconds
      }
    }
  }, [score, startTime]);

  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${BOARD_SIZE}, 50px)`,
    gridTemplateRows: `repeat(${BOARD_SIZE}, 50px)`,
    gap: '2px',
    justifyContent: 'center',
    margin: '16px auto',
  };

  const cellStyle: React.CSSProperties = {
    width: '50px',
    height: '50px',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  };

  return (
    <div>
      <p>Score: {score}</p>
      {gameOver && (
        <p>
          You found all the eggs! 🎉
          {duration !== null && ` Time: ${duration.toFixed(1)} seconds`}
        </p>
      )}
      <div style={boardStyle}>
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const isBunny = bunny.x === col && bunny.y === row;
            const isEgg = eggs.some(pos => pos.x === col && pos.y === row);
            return (
              <div key={`${col}-${row}`} style={cellStyle}>
                {isBunny ? '🐰' : isEgg ? '🥚' : null}
              </div>
            );
          })
        )}
      </div>
      {gameOver && (
        <button onClick={() => window.location.reload()}>
          Restart
        </button>
      )}
    </div>
  );
};

export default Game;