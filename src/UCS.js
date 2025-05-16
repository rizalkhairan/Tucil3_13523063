import { SearchNode, PriorityQueue, PRIMARY_PIECE } from './PuzzleState.js';

function tryMoves(puzzleState, node, queue, visited, piece) {
    for (const direction of [1, -1]) { // Try positive and negative directions
        let moveDist = 0;
        while (true) {
            puzzleState.nodeCount++;
            moveDist += direction;
            const newNode = puzzleState.generateNode(piece, moveDist, node);
            if (newNode === null) break;

            const status = visitNode(puzzleState, newNode, queue, visited);
            if (status !== null) return status;
        }
    }
    return null;
}

function visitNode(puzzleState, node, queue, visited) {
    if (puzzleState.isGoalNode(node)) {
        return node;
    }
    if (!visited.has(node.getSignature())) {
        queue.enqueue(node);
        visited.add(node.getSignature());
    }
    return null;
}

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
        status = tryMoves(puzzleState, node, q, visited, PRIMARY_PIECE);
        if (status !== null) return status;

        // Try to move other pieces
        for (const letter of puzzleState.getAllPieces()) {
            if (letter === PRIMARY_PIECE) {
                continue;
            }
            status = tryMoves(puzzleState, node, q, visited, letter);
            if (status !== null) return status;
        }
    }

    return status;
}