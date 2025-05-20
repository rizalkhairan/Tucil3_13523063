import { SearchNode, PriorityQueue, PRIMARY_PIECE } from './PuzzleState.js';
import { piecesInFront, piecesInFrontRecursive } from './Heuristics.js';

function gEstimator(node, puzzleState) {
    return 0;   // Greedy algorithm does not use g(n)
}
function hEstimator(node, puzzleState) {
    // Heuristic: number of piece that is in front of the primary piece
    return piecesInFront(node, puzzleState);
}

export function Greedy(puzzleState) {
    const q = new PriorityQueue();
    const visited = new Set();

    const startNode = new SearchNode(puzzleState.initialBoard, null, null, 0);
    q.enqueue(startNode);
    visited.add(startNode.getSignature());

    let finalNode = null;  // Will point to the goal node if found
    while (!q.isEmpty()) {
        // Generate nodes by trying to move pieces in this current state
        const node = q.dequeue();
        
        // Try to move other pieces
        for (const letter of puzzleState.getAllPieces()) {
            if (letter === PRIMARY_PIECE) {
                continue;
            }
            finalNode = puzzleState.tryMoves(node, q, visited, letter, gEstimator, hEstimator);
            if (finalNode !== null) return finalNode;
        }

        // Try to move primary piece
        finalNode = puzzleState.tryMoves(node, q, visited, PRIMARY_PIECE, gEstimator, hEstimator);
        if (finalNode !== null) return finalNode;
    }

    return finalNode;
}