class ChessGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameOver = false;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.lastMove = null;
        this.enPassantTarget = null;
        this.castlingRights = {
            white: { king: true, queen: true },
            black: { king: true, queen: true }
        };
        this.kingPositions = { white: null, black: null };
        this.isInCheck = { white: false, black: false };
        
        this.pieces = {
            white: {
                king: '♔', queen: '♕', rook: '♖', 
                bishop: '♗', knight: '♘', pawn: '♙'
            },
            black: {
                king: '♚', queen: '♛', rook: '♜', 
                bishop: '♝', knight: '♞', pawn: '♟'
            }
        };
        
        this.initializeBoard();
        this.renderBoard();
        this.setupEventListeners();
        this.updateGameStatus();
    }
    
    initializeBoard() {
        // Initialize empty board
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Place pieces in starting positions
        const initialSetup = [
            ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn']
        ];
        
        // Place black pieces
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 8; col++) {
                this.board[row][col] = {
                    type: initialSetup[row][col],
                    color: 'black',
                    hasMoved: false
                };
            }
        }
        
        // Place white pieces
        for (let row = 6; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.board[row][col] = {
                    type: initialSetup[7 - row][col],
                    color: 'white',
                    hasMoved: false
                };
            }
        }
        
        // Set initial king positions
        this.kingPositions.white = { row: 7, col: 4 };
        this.kingPositions.black = { row: 0, col: 4 };
    }
    
    renderBoard() {
        const boardElement = document.getElementById('chessBoard');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = this.pieces[piece.color][piece.type];
                    square.appendChild(pieceElement);
                }
                
                square.addEventListener('click', (e) => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
        
        this.highlightLastMove();
        this.highlightCheck();
    }
    
    handleSquareClick(row, col) {
        if (this.gameOver) return;
        
        const clickedPiece = this.board[row][col];
        
        if (this.selectedSquare) {
            const selectedRow = this.selectedSquare.row;
            const selectedCol = this.selectedSquare.col;
            const selectedPiece = this.board[selectedRow][selectedCol];
            
            // If clicking on a piece of the same color, select it instead
            if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                this.selectSquare(row, col);
                return;
            }
            
            // Try to make the move
            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                this.makeMove(selectedRow, selectedCol, row, col);
                this.selectedSquare = null;
                this.clearHighlights();
                this.switchPlayer();
                this.updateGameStatus();
            } else {
                this.selectedSquare = null;
                this.clearHighlights();
            }
        } else {
            // Select a square if it has a piece of the current player
            if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                this.selectSquare(row, col);
            }
        }
    }
    
    selectSquare(row, col) {
        this.selectedSquare = { row, col };
        this.clearHighlights();
        
        const square = this.getSquareElement(row, col);
        square.classList.add('selected');
        
        // Highlight valid moves
        this.highlightValidMoves(row, col);
    }
    
    highlightValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return;
        
        for (let targetRow = 0; targetRow < 8; targetRow++) {
            for (let targetCol = 0; targetCol < 8; targetCol++) {
                if (this.isValidMove(row, col, targetRow, targetCol)) {
                    const targetSquare = this.getSquareElement(targetRow, targetCol);
                    const targetPiece = this.board[targetRow][targetCol];
                    
                    if (targetPiece && targetPiece.color !== piece.color) {
                        targetSquare.classList.add('capture-move');
                    } else {
                        targetSquare.classList.add('valid-move');
                    }
                }
            }
        }
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Basic bounds check
        if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
        
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        const targetPiece = this.board[toRow][toCol];
        
        // Can't capture own piece
        if (targetPiece && targetPiece.color === piece.color) return false;
        
        // Check piece-specific movement rules
        if (!this.isPieceMovementValid(piece, fromRow, fromCol, toRow, toCol)) return false;
        
        // Check if move would leave king in check
        if (this.wouldMoveLeaveKingInCheck(fromRow, fromCol, toRow, toCol)) return false;
        
        return true;
    }
    
    isPieceMovementValid(piece, fromRow, fromCol, toRow, toCol) {
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const targetPiece = this.board[toRow][toCol];
        
        switch (piece.type) {
            case 'pawn':
                return this.isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff, targetPiece);
            case 'rook':
                return this.isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
            case 'bishop':
                return this.isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
            case 'queen':
                return this.isValidQueenMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
            case 'knight':
                return this.isValidKnightMove(rowDiff, colDiff);
            case 'king':
                return this.isValidKingMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
            default:
                return false;
        }
    }
    
    isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff, targetPiece) {
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Moving forward
        if (colDiff === 0) {
            if (targetPiece) return false; // Can't capture moving forward
            
            if (rowDiff === direction) return true; // One square forward
            
            if (fromRow === startRow && rowDiff === 2 * direction) return true; // Two squares from start
        }
        
        // Diagonal capture
        if (Math.abs(colDiff) === 1 && rowDiff === direction) {
            if (targetPiece && targetPiece.color !== piece.color) return true;
            
            // En passant
            if (this.enPassantTarget && 
                toRow === this.enPassantTarget.row && 
                toCol === this.enPassantTarget.col) {
                return true;
            }
        }
        
        return false;
    }
    
    isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
        if (rowDiff !== 0 && colDiff !== 0) return false; // Must move in straight line
        
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
        if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false; // Must move diagonally
        
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidQueenMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
        // Queen moves like rook or bishop
        const isRookMove = (rowDiff === 0 || colDiff === 0);
        const isBishopMove = (Math.abs(rowDiff) === Math.abs(colDiff));
        
        if (!isRookMove && !isBishopMove) return false;
        
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidKnightMove(rowDiff, colDiff) {
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);
        
        return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
    }
    
    isValidKingMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
        // Normal king move (one square in any direction)
        if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1) return true;
        
        // Castling
        if (!piece.hasMoved && rowDiff === 0 && Math.abs(colDiff) === 2) {
            return this.canCastle(piece.color, colDiff > 0 ? 'king' : 'queen');
        }
        
        return false;
    }
    
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }
    
    canCastle(color, side) {
        if (!this.castlingRights[color][side]) return false;
        if (this.isInCheck[color]) return false;
        
        const row = color === 'white' ? 7 : 0;
        const kingCol = 4;
        const rookCol = side === 'king' ? 7 : 0;
        const direction = side === 'king' ? 1 : -1;
        
        // Check if rook is in position and hasn't moved
        const rook = this.board[row][rookCol];
        if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
        
        // Check if path is clear
        for (let col = kingCol + direction; col !== rookCol; col += direction) {
            if (this.board[row][col]) return false;
        }
        
        // Check if king would pass through or end up in check
        for (let col = kingCol; col !== kingCol + 3 * direction; col += direction) {
            if (this.isSquareUnderAttack(row, col, color === 'white' ? 'black' : 'white')) {
                return false;
            }
        }
        
        return true;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Store move for history
        const move = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: { ...piece },
            capturedPiece: capturedPiece ? { ...capturedPiece } : null,
            castling: null,
            enPassant: null,
            promotion: null
        };
        
        // Handle special moves
        this.handleSpecialMoves(piece, fromRow, fromCol, toRow, toCol, move);
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        piece.hasMoved = true;
        
        // Update king position
        if (piece.type === 'king') {
            this.kingPositions[piece.color] = { row: toRow, col: toCol };
        }
        
        // Handle captured piece
        if (capturedPiece) {
            this.capturedPieces[capturedPiece.color].push(capturedPiece.type);
            this.updateCapturedPieces();
        }
        
        // Add move to history
        this.moveHistory.push(move);
        this.lastMove = { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } };
        
        // Update move history display
        this.updateMoveHistory();
        
        // Check for pawn promotion
        if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
            this.handlePawnPromotion(toRow, toCol, move);
            return;
        }
        
        this.renderBoard();
    }
    
    handleSpecialMoves(piece, fromRow, fromCol, toRow, toCol, move) {
        // Castling
        if (piece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
            const direction = toCol > fromCol ? 1 : -1;
            const rookFromCol = direction === 1 ? 7 : 0;
            const rookToCol = toCol - direction;
            
            const rook = this.board[fromRow][rookFromCol];
            this.board[fromRow][rookToCol] = rook;
            this.board[fromRow][rookFromCol] = null;
            rook.hasMoved = true;
            
            move.castling = { direction, rookFrom: rookFromCol, rookTo: rookToCol };
            
            // Update castling rights
            this.castlingRights[piece.color].king = false;
            this.castlingRights[piece.color].queen = false;
        }
        
        // En passant capture
        if (piece.type === 'pawn' && this.enPassantTarget && 
            toRow === this.enPassantTarget.row && toCol === this.enPassantTarget.col) {
            const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
            const capturedPawn = this.board[capturedPawnRow][toCol];
            this.board[capturedPawnRow][toCol] = null;
            
            if (capturedPawn) {
                this.capturedPieces[capturedPawn.color].push(capturedPawn.type);
                move.enPassant = { row: capturedPawnRow, col: toCol };
            }
        }
        
        // Set en passant target for next move
        this.enPassantTarget = null;
        if (piece.type === 'pawn' && Math.abs(toRow - fromRow) === 2) {
            this.enPassantTarget = {
                row: fromRow + (toRow - fromRow) / 2,
                col: fromCol
            };
        }
        
        // Update castling rights
        if (piece.type === 'rook') {
            if (fromRow === 0 && fromCol === 0) this.castlingRights.black.queen = false;
            if (fromRow === 0 && fromCol === 7) this.castlingRights.black.king = false;
            if (fromRow === 7 && fromCol === 0) this.castlingRights.white.queen = false;
            if (fromRow === 7 && fromCol === 7) this.castlingRights.white.king = false;
        }
        
        if (piece.type === 'king') {
            this.castlingRights[piece.color].king = false;
            this.castlingRights[piece.color].queen = false;
        }
    }
    
    handlePawnPromotion(row, col, move) {
        this.showPromotionModal((promotedPiece) => {
            const piece = this.board[row][col];
            piece.type = promotedPiece;
            move.promotion = promotedPiece;
            this.renderBoard();
        });
    }
    
    showPromotionModal(callback) {
        const modal = document.getElementById('promotionModal');
        modal.classList.add('show');
        
        const promotionButtons = modal.querySelectorAll('.promotion-btn');
        promotionButtons.forEach(button => {
            button.onclick = () => {
                const piece = button.dataset.piece;
                modal.classList.remove('show');
                callback(piece);
            };
        });
    }
    
    wouldMoveLeaveKingInCheck(fromRow, fromCol, toRow, toCol) {
        // Make temporary move
        const originalPiece = this.board[toRow][toCol];
        const movingPiece = this.board[fromRow][fromCol];
        
        this.board[toRow][toCol] = movingPiece;
        this.board[fromRow][fromCol] = null;
        
        // Update king position temporarily if moving king
        let originalKingPos = null;
        if (movingPiece.type === 'king') {
            originalKingPos = { ...this.kingPositions[movingPiece.color] };
            this.kingPositions[movingPiece.color] = { row: toRow, col: toCol };
        }
        
        const wouldBeInCheck = this.isKingInCheck(movingPiece.color);
        
        // Restore board
        this.board[fromRow][fromCol] = movingPiece;
        this.board[toRow][toCol] = originalPiece;
        
        // Restore king position
        if (originalKingPos) {
            this.kingPositions[movingPiece.color] = originalKingPos;
        }
        
        return wouldBeInCheck;
    }
    
    isKingInCheck(color) {
        const kingPos = this.kingPositions[color];
        if (!kingPos) return false;
        
        return this.isSquareUnderAttack(kingPos.row, kingPos.col, color === 'white' ? 'black' : 'white');
    }
    
    isSquareUnderAttack(row, col, attackingColor) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === attackingColor) {
                    if (this.canPieceAttackSquare(piece, fromRow, fromCol, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    canPieceAttackSquare(piece, fromRow, fromCol, toRow, toCol) {
        // Similar to isPieceMovementValid but without castling for king
        if (piece.type === 'king') {
            const rowDiff = toRow - fromRow;
            const colDiff = toCol - fromCol;
            return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
        }
        
        return this.isPieceMovementValid(piece, fromRow, fromCol, toRow, toCol);
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateCurrentPlayerDisplay();
    }
    
    updateGameStatus() {
        // Check for check
        this.isInCheck.white = this.isKingInCheck('white');
        this.isInCheck.black = this.isKingInCheck('black');
        
        // Check for checkmate or stalemate
        const hasValidMoves = this.hasValidMoves(this.currentPlayer);
        
        if (!hasValidMoves) {
            if (this.isInCheck[this.currentPlayer]) {
                // Checkmate
                this.gameOver = true;
                const winner = this.currentPlayer === 'white' ? 'Black' : 'White';
                this.showGameOverModal(`Checkmate! ${winner} wins!`);
                document.getElementById('gameStatus').textContent = `Checkmate - ${winner} wins!`;
            } else {
                // Stalemate
                this.gameOver = true;
                this.showGameOverModal('Stalemate! The game is a draw.');
                document.getElementById('gameStatus').textContent = 'Stalemate - Draw';
            }
        } else if (this.isInCheck[this.currentPlayer]) {
            document.getElementById('gameStatus').textContent = `${this.currentPlayer} is in check!`;
        } else {
            document.getElementById('gameStatus').textContent = 'Game in progress';
        }
    }
    
    hasValidMoves(color) {
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    
    showGameOverModal(message) {
        const modal = document.getElementById('gameOverModal');
        document.getElementById('gameOverMessage').textContent = message;
        modal.classList.add('show');
    }
    
    updateCurrentPlayerDisplay() {
        const playerText = this.currentPlayer === 'white' ? 'White to move' : 'Black to move';
        document.getElementById('currentPlayerText').textContent = playerText;
    }
    
    updateCapturedPieces() {
        const whiteElement = document.getElementById('capturedWhite');
        const blackElement = document.getElementById('capturedBlack');
        
        whiteElement.innerHTML = this.capturedPieces.white.map(piece => 
            `<span class="captured-piece">${this.pieces.white[piece]}</span>`
        ).join('');
        
        blackElement.innerHTML = this.capturedPieces.black.map(piece => 
            `<span class="captured-piece">${this.pieces.black[piece]}</span>`
        ).join('');
    }
    
    updateMoveHistory() {
        const historyElement = document.getElementById('moveHistory');
        historyElement.innerHTML = this.moveHistory.map((move, index) => {
            const moveNumber = Math.floor(index / 2) + 1;
            const isWhiteMove = index % 2 === 0;
            const piece = this.pieces[move.piece.color][move.piece.type];
            const from = this.coordinateToChess(move.from.row, move.from.col);
            const to = this.coordinateToChess(move.to.row, move.to.col);
            const capture = move.capturedPiece ? 'x' : '';
            const check = this.isInCheck[move.piece.color === 'white' ? 'black' : 'white'] ? '+' : '';
            
            const moveText = `${isWhiteMove ? moveNumber + '.' : ''} ${piece}${from}${capture}${to}${check}`;
            
            return `<div class="move-item ${isWhiteMove ? 'white-move' : 'black-move'}">${moveText}</div>`;
        }).join('');
        
        // Scroll to bottom
        historyElement.scrollTop = historyElement.scrollHeight;
    }
    
    coordinateToChess(row, col) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        return files[col] + ranks[row];
    }
    
    highlightLastMove() {
        if (this.lastMove) {
            const fromSquare = this.getSquareElement(this.lastMove.from.row, this.lastMove.from.col);
            const toSquare = this.getSquareElement(this.lastMove.to.row, this.lastMove.to.col);
            fromSquare.classList.add('last-move');
            toSquare.classList.add('last-move');
        }
    }
    
    highlightCheck() {
        if (this.isInCheck.white) {
            const kingPos = this.kingPositions.white;
            const square = this.getSquareElement(kingPos.row, kingPos.col);
            square.classList.add('in-check');
        }
        
        if (this.isInCheck.black) {
            const kingPos = this.kingPositions.black;
            const square = this.getSquareElement(kingPos.row, kingPos.col);
            square.classList.add('in-check');
        }
    }
    
    getSquareElement(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
    
    clearHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected', 'valid-move', 'capture-move', 'last-move', 'in-check');
        });
    }
    
    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('newGameFromModal').addEventListener('click', () => {
            document.getElementById('gameOverModal').classList.remove('show');
            this.resetGame();
        });
        
        document.getElementById('undoMove').addEventListener('click', () => {
            this.undoLastMove();
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }
    
    resetGame() {
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameOver = false;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.lastMove = null;
        this.enPassantTarget = null;
        this.castlingRights = {
            white: { king: true, queen: true },
            black: { king: true, queen: true }
        };
        this.isInCheck = { white: false, black: false };
        
        this.initializeBoard();
        this.renderBoard();
        this.updateCurrentPlayerDisplay();
        this.updateGameStatus();
        this.updateCapturedPieces();
        document.getElementById('moveHistory').innerHTML = '';
    }
    
    undoLastMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        const lastMove = this.moveHistory.pop();
        const { from, to, piece, capturedPiece, castling, enPassant, promotion } = lastMove;
        
        // Restore the piece to its original position
        this.board[from.row][from.col] = piece;
        
        // Remove piece from destination or restore captured piece
        if (capturedPiece) {
            this.board[to.row][to.col] = capturedPiece;
            // Remove from captured pieces
            const capturedArray = this.capturedPieces[capturedPiece.color];
            const index = capturedArray.lastIndexOf(capturedPiece.type);
            if (index > -1) capturedArray.splice(index, 1);
        } else {
            this.board[to.row][to.col] = null;
        }
        
        // Handle special move reversions
        if (castling) {
            const rook = this.board[from.row][castling.rookTo];
            this.board[from.row][castling.rookFrom] = rook;
            this.board[from.row][castling.rookTo] = null;
            rook.hasMoved = false;
        }
        
        if (enPassant) {
            // Restore the en passant captured pawn
            const restoredPawn = {
                type: 'pawn',
                color: piece.color === 'white' ? 'black' : 'white',
                hasMoved: true
            };
            this.board[enPassant.row][enPassant.col] = restoredPawn;
            
            // Remove from captured pieces
            const capturedArray = this.capturedPieces[restoredPawn.color];
            const index = capturedArray.lastIndexOf('pawn');
            if (index > -1) capturedArray.splice(index, 1);
        }
        
        // Update king position if king was moved
        if (piece.type === 'king') {
            this.kingPositions[piece.color] = { row: from.row, col: from.col };
        }
        
        // Reset last move
        this.lastMove = this.moveHistory.length > 0 ? 
            this.moveHistory[this.moveHistory.length - 1] : null;
        
        // Switch player back
        this.switchPlayer();
        
        // Update displays
        this.renderBoard();
        this.updateGameStatus();
        this.updateCapturedPieces();
        this.updateMoveHistory();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
}); 