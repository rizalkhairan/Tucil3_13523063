export const EMPTY_SPACE = ".";
export const SIDES = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
};

export { SearchNode, PriorityQueue, PuzzleState };

class SearchNode {
    constructor(board, parentNode, letter, moveDistance) {
        this.board = board;
        this.g = parentNode ? parentNode.g + 1 : 0;
        this.h = 0;
        this.f = this.g + this.h;
        this.parent = parentNode;
        this.letter = letter;
        this.moveDistance = moveDistance;
    }

    getF () {
        return this.f;
    }
    setH(h) {
        this.h = h;
        this.f = this.g + this.h;
    }
    
    printNode(count) {
        const piece = this.board.pieces.get(this.letter);

        let lines = [];
        lines.push(`Gerakan ${count}: ${this.letter}-`)
        if (this.moveDistance > 0 && piece.isHorizontal) {
            lines.push("kanan\n");
        } else if (this.moveDistance < 0 && piece.isHorizontal) {
            lines.push("kiri\n");
        } else if (this.moveDistance > 0 && !piece.isHorizontal) {
            lines.push("bawah\n");
        } else if (this.moveDistance < 0 && !piece.isHorizontal) {
            lines.push("atas\n");
        }
        for (let i = 0; i < this.board.height; i++) {
            let row = "";
            for (let j = 0; j < this.board.width; j++) {
                row += this.board.pieceAt(j, i);
            }
            lines.push(row + "\n");
        }

        console.log(lines.join(""));
    }
}

class PriorityQueue {
    // Simple array priority queue implementation
    constructor() {
        this.queue = [];    // Of SearchNode
    }

    enqueue(node) {
        this.queue.push(node);
        this.queue.sort((a, b) => a.f - b.f);
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

/* -------------------------------------------------------------------------------------- */

class PuzzleState {
    constructor(width, height, pieceCount, board, doorSide, doorPos) {
        this.pieceCount = pieceCount;
        this.doorSide = doorSide;
        this.doorPos = doorPos;
        this.initialBoard = new Board(width, height, board);

    }

    getAllPieces() {
        return this.initialBoard.pieces.keys();
    }

    isGoalNode() {
        const primaryPiece = this.initialBoard.pieces.get("P");
        // Check if the primary piece incide with the door
        for (let i = 0; i < primaryPiece.length; i++) {
            const x = primaryPiece.anchorX + (primaryPiece.isHorizontal ? i : 0);
            const y = primaryPiece.anchorY + (primaryPiece.isHorizontal ? 0 : i);
            if (x === this.doorPos.x && y === this.doorPos.y) {
                return true;
            }
        }
        return false;
    }

    generateNode(letter, moveDistance, node) { // Factory to generate a new search node
        if (!node.board.isMoveValid(letter, moveDistance)) {
            return null;
        }

        let newBoard = new Board(node.board.width, node.board.height, node.board.board);
        newBoard.movePiece(letter, moveDistance);
        return new Node(newBoard, node, letter, moveDistance);
    }
}

class Board {
    constructor(width, height, board) {
        this.width = width;
        this.height = height;
        this.board = [];
        for (let i = 0; i < width * height; i++) {
            this.board.push(board.at(i));
        }

        this.pieces = new Map();
        for (let i = 0; i < width * height; i++) {
            const letter = this.pieceAt(i);
            if (!this.pieces.has(letter)) {
                const isHorizontal = true;    // Temporary value
                const length = 1;             // Temporary value
                const xPos = i % width;
                const yPos = Math.floor(i / width);
                this.pieces.set(letter, new Piece(xPos, yPos, length, isHorizontal));
            } else {
                const piece = this.pieces.get(letter);
                piece.length++;
                const xPos = i % width;
                if (piece.anchorX == xPos) {
                    piece.isHorizontal = false;
                } else {
                    piece.isHorizontal = true;
                }
            }
        }
    }

    pieceAt(x, y = null) {
        if (y === null) {
            return this.board[x];
        }
        return this.board[y*this.width+x];
    }
    movePiece(letter, moveDistance) {
        const piece = this.pieces.get(letter);
        if (piece === undefined) {
            return false;
        }
    
        // Clear current piece from board
        for (let i = 0; i < piece.length; i++) {
            const x = piece.anchorX + (piece.isHorizontal ? i : 0);
            const y = piece.anchorY + (piece.isHorizontal ? 0 : i);
            this.board[y * this.width + x] = EMPTY_SPACE;
        }
    
        if (piece.isHorizontal) {
            piece.anchorX += moveDistance;
        } else {
            piece.anchorY += moveDistance;
        }
    
        for (let i = 0; i < piece.length; i++) {
            const x = piece.anchorX + (piece.isHorizontal ? i : 0);
            const y = piece.anchorY + (piece.isHorizontal ? 0 : i);
            this.board[y * this.width + x] = letter;
        }
    
        return true;
    }
    
    isMoveValid(letter, moveDistance) {
        const piece = this.pieces.get(letter);
        if (piece === undefined) {
            return false;
        }

        for (let i = 0; i < piece.length; i++) {
            const coordX = piece.anchorX + (piece.isHorizontal ? i : 0) + (piece.isHorizontal ? moveDistance : 0);
            const coordY = piece.anchorY + (piece.isHorizontal ? 0 : i) + (piece.isHorizontal ? 0 : moveDistance);

            if (coordX < 0 || coordX >= this.width || coordY < 0 || coordY >= this.height) {
                return false;
            }

            const letterAtCoord = this.pieceAt(coordX, coordY);
            if (letterAtCoord !== EMPTY_SPACE && letterAtCoord !== letter) {
                return false;
            }
        }
        return true;
    }
}

class Piece {
    constructor(anchorX, anchorY, length, isHorizontal) {
        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.length = length;
        this.isHorizontal = isHorizontal;
    }
}
