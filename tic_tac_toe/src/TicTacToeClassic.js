import React, { useState } from "react";

/**
 * Styling constants as specified in the project description.
 */
const COLORS = {
  primary: "#ffffff",    // background of grid, marks, general background
  secondary: "#222222",  // grid lines, border, text accent, mark X color
  accent: "#4caf50",     // highlight for winner, current turn indicator, mark O color
};

/**
 * Inline component style objects — override and expand as needed.
 */
const styles = {
  outerContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: COLORS.primary,
    fontFamily:
      "'Inter', 'Roboto', 'Helvetica', 'Arial', 'Segoe UI', 'Ubuntu', sans-serif",
  },
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: COLORS.primary,
    border: `2px solid ${COLORS.secondary}`,
    borderRadius: "16px",
    padding: "40px 32px 32px 32px",
    boxShadow: "0 2px 18px rgba(68,68,68,0.06)",
  },
  turnText: {
    marginBottom: "28px",
    fontSize: "1.35rem",
    fontWeight: "600",
    color: COLORS.secondary,
    letterSpacing: ".1em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 76px)",
    gridTemplateRows: "repeat(3, 76px)",
    gap: "0px",
    background: COLORS.primary,
    borderRadius: "12px",
    border: `2px solid ${COLORS.secondary}`,
    boxSizing: "border-box",
    marginBottom: "28px",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)"
  },
  cell: {
    width: "76px",
    height: "76px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2.9rem",
    fontWeight: "800",
    cursor: "pointer",
    border: `1px solid ${COLORS.secondary}`,
    background: COLORS.primary,
    transition: "background 0.12s",
    userSelect: "none",
    outline: "none"
  },
  cellWinner: {
    background: COLORS.accent,
    color: COLORS.primary,
    transition: "background 0.18s",
  },
  statusContainer: {
    marginTop: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statusText: {
    fontSize: "1.19rem",
    fontWeight: "500",
    marginBottom: "10px",
    color: COLORS.secondary,
    minHeight: "1.3em"
  },
  resetButton: {
    padding: "11px 34px",
    borderRadius: "6px",
    border: "none",
    background: COLORS.accent,
    color: COLORS.primary,
    fontSize: "1.09rem",
    fontWeight: "600",
    letterSpacing: "0.06em",
    marginTop: "7px",
    transition: "background 0.18s",
    boxShadow: "0 2px 8px rgba(44,68,44,0.08)",
    cursor: "pointer",
  },
  footer: {
    marginTop: "32px",
    fontSize: "0.95em",
    color: COLORS.secondary,
    fontWeight: "400"
  }
};

/**
 * All possible win line indices.
 */
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

// PUBLIC_INTERFACE
/**
 * The main TicTacToe Classic container component.
 */
function TicTacToeClassic() {
  // Board state: array of 9, null | 'X' | 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  // Current player: true for X, false for O
  const [xIsNext, setXIsNext] = useState(true);
  // Win info: null | { winner: 'X'|'O', line: [idx,idx,idx] }
  const [winInfo, setWinInfo] = useState(null);
  // Game ended draw: true/false
  const [isDraw, setIsDraw] = useState(false);

  /**
   * Checks for a winner or draw at each move.
   * @param {Array} newBoard
   * @returns void
   */
  function checkGameEnd(newBoard) {
    for (let line of WIN_LINES) {
      const [a, b, c] = line;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        setWinInfo({ winner: newBoard[a], line });
        setIsDraw(false);
        return;
      }
    }
    if (newBoard.every((cell) => cell)) {
      setWinInfo(null);
      setIsDraw(true);
    } else {
      setWinInfo(null);
      setIsDraw(false);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Handles a player move.
   * @param {number} idx
   */
  function handleCellClick(idx) {
    // Don't allow move if cell filled or game over
    if (board[idx] || winInfo || isDraw) return;
    const newBoard = [...board];
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext((x) => !x);
    // After state updates, check win/draw
    checkGameEnd(newBoard);
  }

  // PUBLIC_INTERFACE
  /**
   * Resets game
   */
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinInfo(null);
    setIsDraw(false);
  }

  /**
   * Helper for styling and rendering each cell
   */
  function renderCell(idx) {
    const cellValue = board[idx];
    let cellStyle = { ...styles.cell };
    // Winning highlight
    if (winInfo && winInfo.line.includes(idx)) {
      cellStyle = { ...cellStyle, ...styles.cellWinner };
    }
    // Distinct color for X and O
    let markColor = cellValue === "X" ? COLORS.secondary : COLORS.accent;
    if (winInfo && winInfo.line.includes(idx)) {
      markColor = cellValue === "X" ? COLORS.accent : COLORS.secondary;
    }
    return (
      <div
        key={idx}
        style={cellStyle}
        tabIndex={0}
        aria-label={`Cell ${idx} ${cellValue ? cellValue : ""}`}
        onClick={() => handleCellClick(idx)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCellClick(idx);
          }
        }}
        role="button"
      >
        {cellValue ? (
          <span style={{ color: markColor, textShadow: "0px 1px 2px #eee" }}>
            {cellValue}
          </span>
        ) : null}
      </div>
    );
  }

  // Status text
  let status = "";
  if (winInfo) {
    status = `Player ${winInfo.winner} wins!`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Game in progress...`;
  }

  // Turn indicator text
  const turnText =
    winInfo || isDraw
      ? "Game Over"
      : `Current Turn: `
        + (xIsNext
          ? <span style={{ color: COLORS.secondary }}>Player X</span>
          : <span style={{ color: COLORS.accent }}>Player O</span>);

  return (
    <div style={styles.outerContainer}>
      <div style={styles.boxContainer}>
        {/* Turn display */}
        <div style={styles.turnText}>
          {winInfo || isDraw ? (
            "Game Over"
          ) : (
            <>
              Current Turn:{" "}
              <span style={{ color: xIsNext ? COLORS.secondary : COLORS.accent }}>
                Player {xIsNext ? "X" : "O"}
              </span>
            </>
          )}
        </div>
        {/* Grid */}
        <div style={styles.grid}>
          {[...Array(9)].map((_, idx) => renderCell(idx))}
        </div>
        {/* Status and Reset Button */}
        <div style={styles.statusContainer}>
          <div style={styles.statusText}>{status}</div>
          <button style={styles.resetButton} onClick={handleReset}>
            Reset Game
          </button>
        </div>
      </div>
      <div style={styles.footer}>
        Two-player mode · Classic Tic Tac Toe
      </div>
    </div>
  );
}

export default TicTacToeClassic;
