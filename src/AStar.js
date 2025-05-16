import { SearchNode, PriorityQueue, PRIMARY_PIECE } from './PuzzleState.js';
import { piecesInFront, piecesInFrontRecursive } from './Heuristics.js';

function gEstimator(node, puzzleState) {
    return node.g + 1;
}
function hEstimator(node, puzzleState) {
    // Heuristic: number of piece that is in front of the primary piece
    return piecesInFrontRecursive(node, puzzleState, PRIMARY_PIECE);
}

export function AStar(puzzleState) {
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