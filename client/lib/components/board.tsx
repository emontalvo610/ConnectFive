

'use client';

import React, { useState, useEffect } from "react";

import { createSocket } from '../utils/signalr-connector';

const SOCKET_URL = new URL('http://localhost:5000/hub');

const socket = createSocket(SOCKET_URL);


export const Board = () => {
  console.log("rerender");
  const [game, setGame] = useState<Game>({
    board: Array(9).fill(''),
    currentPlayer: "X",
  });
  console.log(JSON.stringify(game))
  const [errorMessage, setErrorMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState("Player A");

  useEffect(() => {
  
    socket.on("moveMade", (data) => {
      console.log("setGame")
      console.log("updatedGame", data.updatedGame)
      setGame(data.updatedGame);
      setPlayerTurn(data.updatedGame.currentPlayer);
      setErrorMessage("");
    });

    socket.on("gameReset", (newGame) => {
      setGame(newGame);
      setPlayerTurn("Player A");
      setErrorMessage("");
    });

    // socket.on("connect_error", (error) => {
    //   console.error("WebSocket connection error:", error.message);
    // });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from server");
    // });

    return () => {
      socket.off("moveMade");
      socket.off("gameReset");
      // socket.off("connect_error");
      // socket.off("disconnect");
    };
  }, []);

  const calculateWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares?.[a] && squares?.[a] === squares?.[b] && squares?.[a] === squares?.[c]) {
        return squares?.[a];
      }
    }

    return null;
  };

  const makeMove = (index: number) => {
    console.log({index});
    const squares = [...game.board];
    console.log({squares})

    if (calculateWinner(squares) || squares[index]) {
      setErrorMessage("Invalid move. Please try again.");
      return;
    }

    squares[index] = game.currentPlayer;

    const updatedGame = {
      ...game,
      board: squares,
      currentPlayer: game.currentPlayer === "X" ? "O" : "X",
    };

    console.log({updatedGame})

    socket.emit("makeMove", { index, updatedGame });
  };

  const resetGame = () => {
    const newGame = {
      board: Array(9).fill(null),
      currentPlayer: "X",
    };

    socket.emit("resetGame", newGame);
  };

  const winner = calculateWinner(game.board);

  return (
    <div className="text-center">
      <div>
        <div className="grid grid-cols-3 gap-[10px] mt-[20px] ml-[65px]">
          {game.board.map((cell, index) => (
            <div
              key={index}
              className={`text-black w-[100px] h-[100px] border-2 border-[#333] text-[20px] flex items-center justify-center cursor-pointer bg-[#fff] transition-colors duration-300 ${winner && winner === cell ? "bg-green-500 font-white" : ""}`}
              onClick={() => makeMove(index)}
            >
              {cell}
            </div>
          ))}
        </div>
        <p className="mt-[20px] font-[1.5em] text-[#333] ">
          {winner
            ? `Player ${winner} wins!`
            : `Current Player: ${playerTurn}`}
        </p>
        <button className="mt-[10px] px-[10px] py-[20px] font-[1em] cursor-pointer bg-[#4caf50] text-[#fff] border-none transition-colors duration-300 border-r-[5px]" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      {errorMessage && (
        <p className="text-[#ff0000] mt-[10px] font-[1.2em]">{errorMessage}</p>
      )}
    </div>
  );
};


