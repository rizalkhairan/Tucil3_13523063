import { SearchNode, PriorityQueue, PRIMARY_PIECE } from './PuzzleState.js';

// Returns the final goal node if found, otherwise null
// gEstimator and hEstimator are functions that estimates the g(n) and h(n) costs
// If only gEstimator is provided, the pathfinding algorithm is equivalent to UCS
// If only hEstimator is provided, the pathfinding algorithm is equivalent to Greedy
// If both are provided, the pathfinding algorithm is equivalent to A* search
export function Pathfind(puzzleState, gEstimator, hEstimator) {
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
            if (letter === PRIMARY_PIECE) continue;
            finalNode = tryMoves(puzzleState, node, q, visited, letter, gEstimator, hEstimator);
            if (finalNode !== null) return finalNode;
        }

        // Try to move primary piece
        finalNode = tryMoves(puzzleState, node, q, visited, PRIMARY_PIECE, gEstimator, hEstimator);
        if (finalNode !== null) return finalNode;
    }

    return finalNode;
}

// Try moving pieces forwards and backwards a varying distance
function tryMoves(puzzleState, node, queue, visited, piece, gEstimator,hEstimator) {
    for (const direction of [1, -1]) { // Try positive and negative directions
        let moveDist = 0;
        while (true) {
            puzzleState.nodeCount++;
            moveDist += direction;
            const newNode = puzzleState.generateNode(piece, moveDist, node);
            if (newNode === null) break;
            if (puzzleState.isGoalNode(node)) {
                return node;
            }

            if (gEstimator !== null) {
                newNode.setG(gEstimator(newNode, puzzleState));
            }
            if (hEstimator !== null) {
                newNode.setH(hEstimator(newNode, puzzleState));
            }

            if (!visited.has(newNode.getSignature())) {
                queue.enqueue(newNode);
                visited.add(newNode.getSignature());
            }
        }
    }
    return null;
}