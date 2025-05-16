import { PRIMARY_PIECE, SIDES } from "./PuzzleState.js";

export function piecesInFront(node, puzzleState) {
    const coordsToCheck = [];
    const primaryPiece = node.board.pieces.get(PRIMARY_PIECE);
    switch (puzzleState.doorSide) {
        case SIDES.UP:
            for (let i = primaryPiece.anchorY-1; i >= 0; i--) {
                coordsToCheck.push({ x: primaryPiece.anchorX, y: i });
            }
            break;
        case SIDES.DOWN:
            for (let i = primaryPiece.anchorY+primaryPiece.length; i < node.board.height; i++) {
                coordsToCheck.push({ x: primaryPiece.anchorX, y: i });
            }
            break;
        case SIDES.LEFT:
            for (let i = primaryPiece.anchorX-1; i >= 0; i--) {
                coordsToCheck.push({ x: i, y: primaryPiece.anchorY });
            }
            break;
        case SIDES.RIGHT:
            for (let i = primaryPiece.anchorX+primaryPiece.length; i < node.board.width; i++) {
                coordsToCheck.push({ x: i, y: primaryPiece.anchorY });
            }
            break;
    }

    let count = 0;
    for (const coord of coordsToCheck) {
        const piece = node.board.pieceAt(coord.x, coord.y);
        if (piece !== null && piece !== PRIMARY_PIECE) {
            count++;
        }
    }
    return count;
}


export function piecesInFrontRecursive(node, puzzleState, piece) {
    let blockers = new Set();

    const coordsToCheck = [];
    const primaryPiece = node.board.pieces.get(piece);
    switch (puzzleState.doorSide) {
        case SIDES.UP:
            for (let i = primaryPiece.anchorY-1; i >= 0; i--) {
                coordsToCheck.push({ x: primaryPiece.anchorX, y: i });
            }
            break;
        case SIDES.DOWN:
            for (let i = primaryPiece.anchorY+primaryPiece.length; i < node.board.height; i++) {
                coordsToCheck.push({ x: primaryPiece.anchorX, y: i });
            }
            break;
        case SIDES.LEFT:
            for (let i = primaryPiece.anchorX-1; i >= 0; i--) {
                coordsToCheck.push({ x: i, y: primaryPiece.anchorY });
            }
            break;
        case SIDES.RIGHT:
            for (let i = primaryPiece.anchorX+primaryPiece.length; i < node.board.width; i++) {
                coordsToCheck.push({ x: i, y: primaryPiece.anchorY });
            }
            break;
    }

    let count = 0;
    for (const coord of coordsToCheck) {
        const piece = node.board.pieceAt(coord.x, coord.y);
        if (piece !== null && piece !== PRIMARY_PIECE) {
            count++;
            blockers.add(piece);
        }
    }

    for (const blocker of blockers) {
        count += piecesInFront(node, puzzleState, blocker);
    }
    return count;
}