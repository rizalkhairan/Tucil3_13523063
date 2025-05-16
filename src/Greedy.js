import { SearchNode, PriorityQueue, PRIMARY_PIECE, SIDES } from './PuzzleState.js';

function gEstimator(node, puzzleState) {
    return 0;   // Greedy algorithm does not use g(n)
}
function hEstimator(node, puzzleState) {
    // Heuristic: number of piece that is in front of the primary piece
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

export function Greedy(puzzleState) {
    const q = new PriorityQueue();
    const visited = new Set();

    const startNode = new SearchNode(puzzleState.initialBoard, null, null, 0);
    q.enqueue(startNode);
    visited.add(startNode.getSignature());

    let status = null;  // Will point to the goal node if found
    while (!q.isEmpty()) {
        const node = q.dequeue();
        
        // Try to move other pieces
        for (const letter of puzzleState.getAllPieces()) {
            if (letter === PRIMARY_PIECE) {
                continue;
            }
            status = puzzleState.tryMoves(node, q, visited, letter);
            if (status !== null) return status;
        }

        // Try to move primary piece
        status = puzzleState.tryMoves(node, q, visited, PRIMARY_PIECE, gEstimator, hEstimator);
        if (status !== null) return status;
    }

    return status;
}