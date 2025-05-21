import { SearchNode, PriorityQueue } from './PuzzleState.js';

const MAX_ITER = 100000;

// Returns the final goal node if found, otherwise null
// gEstimator and hEstimator are functions that estimates the g(n) and h(n) costs
// If only gEstimator is provided, the pathfinding algorithm is equivalent to UCS
// If only hEstimator is provided, the pathfinding algorithm is equivalent to Greedy
// If both are provided, the pathfinding algorithm is equivalent to A* search
export function Pathfind(puzzleState, gEstimator, hEstimator) {
    const q = new PriorityQueue();
    const visited = new Map();

    const startNode = new SearchNode(puzzleState.initialBoard, null, null, 0);
    if (gEstimator !== null) {
        startNode.setG(gEstimator(startNode, puzzleState));
    }
    if (hEstimator !== null) {
        startNode.setH(hEstimator(startNode, puzzleState));
    }
    q.enqueue(startNode);
    visited.set(startNode.getSignature(), startNode.getF());

    let finalNode = null;  // Will point to the goal node if found
    let iterCount = 0;
    while (!q.isEmpty()) {
        const node = q.dequeue();
        if (puzzleState.isGoalNode(node)) {
            finalNode = node;
            break;
        }
        if (visited.has(node.getSignature()) && node.getF() > visited.get(node.getSignature())) {
            continue;
        }
        
        // Generate nodes by trying to move pieces in this current state
        for (const letter of puzzleState.getAllPieces()) {
            tryMoves(puzzleState, node, q, visited, letter, gEstimator, hEstimator);
        }

        iterCount++;
        if (iterCount > MAX_ITER) {
            console.log("Max iterations reached. Stopping search.");
            break;
        }
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

            if (gEstimator !== null) {
                newNode.setG(gEstimator(newNode, puzzleState));
            }
            if (hEstimator !== null) {
                newNode.setH(hEstimator(newNode, puzzleState));
            }

            const signature = newNode.getSignature();
            if (!visited.has(signature) || newNode.getF() < visited.get(signature)) {
                queue.enqueue(newNode);
                visited.set(signature, newNode.getF());
            }
        }
    }
    return null;
}