console.log("IOHandler.js loaded");
import { readFileSync } from 'fs';
import { EOL } from 'os';
import { PuzzleState, SIDES, EMPTY_SPACE } from './PuzzleState.js';

export function ReadConfig(filename) { // ret: BoardState
    console.log("Reading config file: " + filename);

    // Load file
    const filePath = filename;
    const fileContent = readFileSync(filePath, 'utf-8');
    const lines = fileContent.split(EOL);

    // Parse file
    let doorSide = SIDES.NONE;
    let doorPos = {x: -1, y: -1};   // door position resides inside the board along the edges
    let boardWidth = 6;
    let boardHeight = 6;
    let pieceCount = 0;
    
    let lineIdx = -1;
    let board = [];
    lines.forEach((line) => {
        lineIdx++;

        if (lineIdx === 0) {
            [boardWidth, boardHeight] = line.split(' ').map((x) => {
                try {
                    return parseInt(x);
                } catch (e) {
                    throw new Error("Invalid board size: " + x);
                }
            });
            if (boardWidth < 1 || boardHeight < 1) {
                throw new Error("Invalid board size: " + boardWidth + "x" + boardHeight);
            }
        } else if (lineIdx === 1) {
            [pieceCount] = line.split(' ').map((x) => {
                try {
                    return parseInt(x);
                } catch (e) {
                    throw new Error("Invalid piece count: " + x);
                }
            });
        } else {
            if (board.length >= boardHeight && doorSide !== SIDES.NONE) {
                return; // Ignore extra lines
            }

            // Deduce door side here
            if (line.trim() === "K" ) {
                if (doorSide !== SIDES.NONE) {
                    throw new Error("Multiple doors found");
                }
    
                if (lineIdx === 2) {
                    doorSide = SIDES.TOP;
                    doorPos.x = line.indexOf("K");
                    doorPos.y = 0;
                    lineIdx--;
                } else {
                    doorSide = SIDES.BOTTOM;
                    doorPos.x = line.indexOf("K");
                    doorPos.y = boardHeight - 1;
                }
                line = line.replace("K", " ");
                return;
            }
            if (line.at(0) === "K") {
                if (doorSide !== SIDES.NONE) {
                    throw new Error("Multiple doors found");
                }
                doorSide = SIDES.LEFT;
                doorPos.x = 0;
                doorPos.y = lineIdx - 2;
                line = line.replace("K", " ");
            }
            if (line.at(-1) === "K") {
                if (doorSide !== SIDES.NONE) {
                    throw new Error("Multiple doors found");
                }
                doorSide = SIDES.RIGHT;
                doorPos.x = boardWidth - 1;
                doorPos.y = lineIdx - 2;
                line = line.replace("K", " ");
            }

            line = line.trim();
            if (line.length !== boardWidth) {
                line = line.padEnd(boardWidth, EMPTY_SPACE);
                line = line.slice(0, boardWidth);
            }
            board.push(line)
        }

        return;
    })

    let state = new PuzzleState(boardWidth, boardHeight, pieceCount, board.join(""), doorSide, doorPos);
    console.log("Config file read successfully");
    switch (doorSide) {
        case SIDES.TOP:
            console.log("Door side: UP");
            break;
        case SIDES.RIGHT:
            console.log("Door side: RIGHT");
            break;
        case SIDES.BOTTOM:
            console.log("Door side: DOWN");
            break;
        case SIDES.LEFT:
            console.log("Door side: LEFT");
            break;
        default:
            console.log("Door side: NONE");
    }
    console.log("Door position: " + doorPos.x + ", " + doorPos.y);
    console.log("Piece count: " + pieceCount);
    console.log("Board size: " + boardWidth + "x" + boardHeight);
    return state;
}