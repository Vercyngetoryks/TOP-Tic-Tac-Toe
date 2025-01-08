"use strict";

const gameboard = {
  board: ["", "", "", "", "", "", "", "", ""],
};

function createUser(name, marker, active) {
  return { name, marker, active };
}

const playerOne = createUser("Bob", "O", true);
const playerTwo = createUser("John", "X", false);

const players = [playerOne, playerTwo];

console.log(playerOne, playerTwo);
