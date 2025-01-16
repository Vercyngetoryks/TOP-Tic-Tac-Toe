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
      return false;
    }
  };

  const reset = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = "";
      }
    }
  };
  return { getBoard, placeMarker, reset };
}

function gameController(playerOneName, playerTwoName, marker1, marker2) {
  const board = gameboard();

  let counterP1 = 0;
  let counterP2 = 0;

  const players = [
    {
      name: playerOneName,
      marker: marker1,
    },
    {
      name: playerTwoName,
      marker: marker2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getCounterP1 = () => counterP1;
  const getCounterP2 = () => counterP2;

  const getActivePlayer = () => activePlayer;
  const getPlayers = () => players;

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

  const playRound = (row, column) => {
    const result = board.placeMarker(row, column, activePlayer.marker);
    if (result) {
      const win = checkWin(board.getBoard());
      const draw = checkDraw(board.getBoard());
      if (win) {
        if (activePlayer.name === players[0].name) counterP1++;
        else counterP2++;
        return "win";
      }
      if (draw) {
        return "draw";
      }
      switchPlayer();
    } else return "taken";
  };

  return {
    getBoard: board.getBoard,
    checkWin,
    checkDraw,
    playRound,
    getActivePlayer,
    reset: board.reset,
    getCounterP1,
    getCounterP2,
    getPlayers,
  };
}

function screenController() {
  const form = document.querySelector(".init-input");
  const boardDiv = document.querySelector(".board");
  const marker1 = document.getElementById("marker-p1");
  const marker2 = document.getElementById("marker-p2");
  const playerTurnDiv = document.querySelector(".player-turn");
  const gameDiv = document.querySelector(".game-box");
  const dialogBox = document.querySelector(".dialog");
  const playerOneScore = document.querySelector(".counter-p1");
  const playerTwoScore = document.querySelector(".counter-p2");
  const updateScreen = () => {
    boardDiv.textContent = "";
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("board-cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        if (cell === "") {
          cellButton.dataset.marker = game.getActivePlayer().marker;
        } else {
          cellButton.textContent = cell; // Jeśli zajęta, wyświetl marker
        }
        boardDiv.appendChild(cellButton);
      });
    });
    cells = document.querySelectorAll(".board-cell");
  };
  let playerOneName;
  let playerTwoName;
  let game;
  let board;
  let activePlayer;
  let cells;

  form.addEventListener("click", (e) => {
    if (e.target.classList.contains("marker-select-btn")) {
      marker1.textContent = marker1.textContent === "O" ? "X" : "O";
      marker2.textContent = marker2.textContent === "X" ? "O" : "X";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    playerOneName = document.getElementById("player1-name").value;
    playerTwoName = document.getElementById("player2-name").value;
    game = gameController(
      playerOneName,
      playerTwoName,
      marker1.textContent.trim(),
      marker2.textContent.trim()
    );
    board = game.getBoard();
    activePlayer = game.getActivePlayer();
    form.classList.add("hidden");
    updateScreen();
    playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
    playerOneScore.textContent = `${
      game.getPlayers()[0].name
    }: ${game.getCounterP1()}`;
    playerTwoScore.textContent = `${
      game.getPlayers()[1].name
    }: ${game.getCounterP2()}`;
    gameDiv.classList.remove("hidden");
  });

  dialogBox.querySelector(".new-game").addEventListener("click", () => {
    location.reload();
  });
  dialogBox.querySelector(".play-again").addEventListener("click", () => {
    game.reset();
    dialogBox.close();
    updateScreen();
    playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
  });

  function clickHandlerBoard(e) {
    const selectedRow = Number(e.target.dataset.row);
    const selectedColumn = Number(e.target.dataset.column);
    if (!game.checkWin(game.getBoard()) && !game.checkDraw(game.getBoard())) {
      const result = game.playRound(selectedRow, selectedColumn);
      if (result === "win") {
        updateScreen();
        playerTurnDiv.textContent = `${
          game.getActivePlayer().name
        } wins the game!!`;
        playerOneScore.textContent = `${
          game.getPlayers()[0].name
        }: ${game.getCounterP1()}`;
        playerTwoScore.textContent = `${
          game.getPlayers()[1].name
        }: ${game.getCounterP2()}`;
        dialogBox.querySelector(".game-result").textContent = `${
          game.getActivePlayer().name
        } wins!!`;
        dialogBox.showModal();
      } else if (result === "draw") {
        updateScreen();
        playerTurnDiv.textContent = "We have a draw!";
        dialogBox.querySelector(
          ".game-result"
        ).textContent = `We have a draw!!`;
        dialogBox.showModal();
      } else if (result === "taken")
        playerTurnDiv.textContent = "This field is taken! Choose another one";
      else {
        updateScreen();
        playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
      }
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
}

screenController();
