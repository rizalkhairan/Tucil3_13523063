import { SearchNode, PriorityQueue, PRIMARY_PIECE } from './PuzzleState.js';

export function UCS(puzzleState){
    const q = new PriorityQueue();
    const visited = new Set();

    const startNode = new SearchNode(puzzleState.initialBoard, null, null, 0);
    q.enqueue(startNode);
    visited.add(startNode.getSignature());

    let status = null;  // Will point to the goal node if found
    while (!q.isEmpty()) {
        const node = q.dequeue();

        // Try to move primary piece
        status = puzzleState.tryMoves(node, q, visited, PRIMARY_PIECE);
        if (status !== null) return status;

        // Try to move other pieces
        for (const letter of puzzleState.getAllPieces()) {
            if (letter === PRIMARY_PIECE) {
                continue;
            }
            status = puzzleState.tryMoves(node, q, visited, letter);
            if (status !== null) return status;
        }
    }

    return status;
}