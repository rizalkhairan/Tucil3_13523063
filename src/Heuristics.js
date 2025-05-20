import { EMPTY_SPACE, PRIMARY_PIECE, SIDES } from "./PuzzleState.js";

/* g(n) estimators */

export function nodesFromStart(node, puzzleState) {
    if (node.parent === null || node.parent === undefined) {
        return 0;
    }
    return node.parent.g + 1;
}

/* h(n) estimators */

// Calculates the distance from the primary piece to the door. Not admissible
export function distanceToDoor(node, puzzleState) {
    switch (puzzleState.doorSide) {
        case SIDES.TOP:
            return node.board.pieces.get(PRIMARY_PIECE).anchorY;
        case SIDES.BOTTOM:
            return node.board.height - (node.board.pieces.get(PRIMARY_PIECE).anchorY + node.board.pieces.get(PRIMARY_PIECE).length);
        case SIDES.LEFT:
            return node.board.pieces.get(PRIMARY_PIECE).anchorX;
        case SIDES.RIGHT:
            return node.board.width - (node.board.pieces.get(PRIMARY_PIECE).anchorX + node.board.pieces.get(PRIMARY_PIECE).length);
    }
    return 0; // Invalid case
}

// Count how many pieces are in between the primary piece and the door
export function piecesInFront(node, puzzleState) {
    const coordsToCheck = [];
    const primaryPiece = node.board.pieces.get(PRIMARY_PIECE);
    switch (puzzleState.doorSide) {
        case SIDES.TOP:
            for (let i = primaryPiece.anchorY-1; i >= 0; i--) {
                coordsToCheck.push({ x: primaryPiece.anchorX, y: i });
            }
            break;
        case SIDES.BOTTOM:
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
        if (piece !== null && piece !== PRIMARY_PIECE && piece !== EMPTY_SPACE) {
            count++;
        }
    }
    return count;
}

// Returns the piece that prevents the blocker to free the blockee :p
// In order to be able to move the blockee, another blocker must be moved
function pieceBlocker(node, puzzleState, blockee, blocker) {
    const blockers = [];

    const lineToFree = { x: -1, y: -1 };
    const blockeePiece = node.board.pieces.get(blockee);
    if (blockeePiece.isHorizontal) {
        lineToFree.y = blockeePiece.anchorY;
    } else {
        lineToFree.x = blockeePiece.anchorX;
    }
};

export function recursiveBlockers(node, puzzleState) {
    const primaryBlockers = new Set();

    const primaryPiece = node.board.pieces.get(PRIMARY_PIECE);
    switch (puzzleState.doorSide) {
        case SIDES.TOP:
            for (let i = primaryPiece.anchorY-1; i >= 0; i--) {
                blockers.add(node.board.pieceAt(primaryPiece.anchorX, i));
            }
            break;
        case SIDES.BOTTOM:
            for (let i = primaryPiece.anchorY+primaryPiece.length; i < node.board.height; i++) {
                blockers.add(node.board.pieceAt(primaryPiece.anchorX, i));
            }
            break;
        case SIDES.LEFT:
            for (let i = primaryPiece.anchorX-1; i >= 0; i--) {
                blockers.add(node.board.pieceAt(i, primaryPiece.anchorY));
            }
            break;
        case SIDES.RIGHT:
            for (let i = primaryPiece.anchorX+primaryPiece.length; i < node.board.width; i++) {
                blockers.add(node.board.pieceAt(i, primaryPiece.anchorY));
            }
            break;
    }
    primaryBlockers.delete(EMPTY_SPACE);
    primaryBlockers.delete(PRIMARY_PIECE);

    const recursiveBlockers = new Set();
    for (const blocker of primaryBlockers) {        
        const secondaryBlockers = pieceBlocker(node, puzzleState, PRIMARY_PIECE, blocker);
        for (const secondaryBlocker of secondaryBlockers) {
            if (primaryBlockers.has(secondaryBlocker)) {
                continue; // Already counted
            }
            recursiveBlockers.add(secondaryBlocker);
        }
    }
    return primaryBlockers.size + recursiveBlockers.size;
}