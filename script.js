"use strict";

function gameboard() {
  const row = 3;
  const column = 3;
  const board = [];
  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, marker) => {
    if (board[row][column] === "") {
      board[row][column] = marker;
      return true;
    } else {
      console.log("This field is already taken! Choose another one!");
      return false;
    }
  };

  const printBoard = () => {
    for (let i = 0; i < 3; i++) {
      console.log(board[i].join("|"));
    }
  };
  return { getBoard, placeMarker, printBoard };
}

function gameController() {
  const playerOneName = "Bob";
  const playerTwoName = "John";

  const board = gameboard();

  const players = [
    {
      name: playerOneName,
      marker: "O",
    },
    {
      name: playerTwoName,
      marker: "X",
    },
  ];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(
      `${activePlayer.name}'s round. ${activePlayer.name}, place your marker.`
    );
  };

  const checkWin = (board) => {
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== "" &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return true;
      }
      if (
        board[0][i] !== "" &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      ) {
        return true;
      }
    }
    if (
      board[0][0] !== "" &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return true;
    }
    if (
      board[0][2] !== "" &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return true;
    }

    return false;
  };

  const checkDraw = (board) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  };

  printNewRound();
  board.printBoard();

  const playRound = () => {
    const row = Number(prompt("Enter row no.:"));
    const column = Number(prompt("Enter column no.:"));
    if (board.placeMarker(row, column, activePlayer.marker)) {
      const win = checkWin(board.getBoard());
      const draw = checkDraw(board.getBoard());
      if (win) {
        console.log(`${activePlayer.name} wins the game!!!`);
        return;
      }
      if (draw) {
        console.log("We have a draw!");
        return;
      }
      switchPlayer();
      printNewRound();
      board.printBoard();
    }
  };

  return {
    getBoard: board.getBoard,
    checkWin,
    checkDraw,
    playRound,
    getActivePlayer,
  };
}

function screenController() {
  const game = gameController();
  const form = document.querySelector(".init-input");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const playerOneName = document.getElementById("player1-name").value;
    const playerTwoName = document.getElementById("player2-name").value;
  });
}

while (!game.checkWin(game.getBoard()) && !game.checkDraw(game.getBoard())) {
  game.playRound();
}
