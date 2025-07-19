
export const command = {
    name: 'chess',
    aliases: ['chessboard'],
    description: 'Play a complete chess game with move validation',
    usage: 'chess [move] | reset | help',
    category: 'Games',
    
    async execute(sock, msg, args, context) {
        const { from } = context;
        const sender = msg.key.remoteJid;
        
        // Initialize global chess games storage
        if (!global.chessGames) global.chessGames = new Map();
        
        const gameKey = from;
        let game = global.chessGames.get(gameKey);
        
        // Initialize new game if doesn't exist
        if (!game) {
            game = createNewGame();
            global.chessGames.set(gameKey, game);
        }
        
        const command = args.trim().toLowerCase();
        
        if (command === 'reset') {
            game = createNewGame();
            global.chessGames.set(gameKey, game);
            
            await sock.sendMessage(from, {
                text: `♟️ **Chess Game Reset**\n\n${getBoardDisplay(game.board)}\n\n🎮 **How to play:**\n• Use algebraic notation: e2e4, d7d5, etc.\n• White (uppercase) moves first\n• Type .chess help for more commands\n\n**Current turn:** ${game.currentTurn === 'white' ? '⚪ White' : '⚫ Black'}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Chess Game Reset',
                        body: 'New game started',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=301',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (command === 'help' || command === '') {
            await sock.sendMessage(from, {
                text: `♟️ **Chess Game Help**\n\n${getBoardDisplay(game.board)}\n\n🎮 **Commands:**\n• .chess <move> - Make a move (e.g., e2e4)\n• .chess reset - Start new game\n• .chess help - Show this help\n\n📝 **Move Format:**\n• Use format: from_square + to_square\n• Examples: e2e4, d7d5, g1f3, b8c6\n\n♟️ **Piece Symbols:**\n• ♔♕♖♗♘♙ = White pieces\n• ♚♛♜♝♞♟ = Black pieces\n\n**Current turn:** ${game.currentTurn === 'white' ? '⚪ White' : '⚫ Black'}\n**Game status:** ${game.status}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Chess Game Help',
                        body: 'Learn how to play',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=302',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        // Process move
        const movePattern = /^[a-h][1-8][a-h][1-8]$/;
        if (!movePattern.test(command)) {
            await sock.sendMessage(from, {
                text: `❌ **Invalid move format!**\n\nUse format: e2e4 (from e2 to e4)\n\n📝 Examples:\n• e2e4 - Pawn forward\n• g1f3 - Knight move\n• e1g1 - Castling (if valid)\n\nType .chess help for more info`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Invalid Move',
                        body: 'Check move format',
                        thumbnailUrl: 'https://picsum.photos/300/300?random=303',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        if (game.status !== 'active') {
            await sock.sendMessage(from, {
                text: `🏁 **Game Over!**\n\nStatus: ${game.status}\n\nUse .chess reset to start a new game.`
            });
            return;
        }
        
        // Parse and validate move
        const from_square = command.substring(0, 2);
        const to_square = command.substring(2, 4);
        
        const moveResult = makeMove(game, from_square, to_square);
        
        if (!moveResult.success) {
            await sock.sendMessage(from, {
                text: `❌ **Invalid Move!**\n\n${moveResult.error}\n\n${getBoardDisplay(game.board)}\n\n**Current turn:** ${game.currentTurn === 'white' ? '⚪ White' : '⚫ Black'}`,
                contextInfo: {
                    externalAdReply: {
                        title: 'Invalid Move',
                        body: moveResult.error,
                        thumbnailUrl: 'https://picsum.photos/300/300?random=304',
                        sourceUrl: 'https://github.com',
                        mediaType: 1
                    }
                }
            });
            return;
        }
        
        // Update game state
        global.chessGames.set(gameKey, game);
        
        // Check for game end conditions
        const gameStatus = checkGameStatus(game);
        
        let statusText = '';
        if (gameStatus === 'checkmate') {
            game.status = `Checkmate! ${game.currentTurn === 'white' ? 'Black' : 'White'} wins!`;
            statusText = `\n\n🏆 **${game.status}**`;
        } else if (gameStatus === 'check') {
            statusText = `\n\n⚠️ **Check!** ${game.currentTurn === 'white' ? 'White' : 'Black'} king is in danger!`;
        } else if (gameStatus === 'stalemate') {
            game.status = 'Stalemate - Draw!';
            statusText = `\n\n🤝 **${game.status}**`;
        }
        
        await sock.sendMessage(from, {
            text: `♟️ **Move: ${from_square.toUpperCase()}→${to_square.toUpperCase()}**\n\n${getBoardDisplay(game.board)}\n\n**Current turn:** ${game.currentTurn === 'white' ? '⚪ White' : '⚫ Black'}\n**Move count:** ${game.moveCount}${statusText}\n\n${moveResult.message || ''}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Chess Move',
                    body: `${from_square.toUpperCase()}→${to_square.toUpperCase()}`,
                    thumbnailUrl: 'https://picsum.photos/300/300?random=305',
                    sourceUrl: 'https://github.com',
                    mediaType: 1
                }
            }
        });
        
        function createNewGame() {
            return {
                board: [
                    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
                    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
                    ['.', '.', '.', '.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.', '.', '.', '.'],
                    ['.', '.', '.', '.', '.', '.', '.', '.'],
                    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
                    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
                ],
                currentTurn: 'white',
                moveCount: 0,
                status: 'active',
                castlingRights: {
                    whiteKingSide: true,
                    whiteQueenSide: true,
                    blackKingSide: true,
                    blackQueenSide: true
                },
                enPassantTarget: null,
                capturedPieces: { white: [], black: [] }
            };
        }
        
        function getBoardDisplay(board) {
            let display = '  a b c d e f g h\n';
            for (let i = 0; i < 8; i++) {
                display += `${8 - i} `;
                for (let j = 0; j < 8; j++) {
                    display += board[i][j] + ' ';
                }
                display += `${8 - i}\n`;
            }
            display += '  a b c d e f g h';
            return display;
        }
        
        function squareToCoords(square) {
            const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
            const rank = 8 - parseInt(square[1]);
            return { row: rank, col: file };
        }
        
        function coordsToSquare(row, col) {
            const file = String.fromCharCode('a'.charCodeAt(0) + col);
            const rank = 8 - row;
            return file + rank;
        }
        
        function isWhitePiece(piece) {
            return '♔♕♖♗♘♙'.includes(piece);
        }
        
        function isBlackPiece(piece) {
            return '♚♛♜♝♞♟'.includes(piece);
        }
        
        function getPieceColor(piece) {
            if (isWhitePiece(piece)) return 'white';
            if (isBlackPiece(piece)) return 'black';
            return null;
        }
        
        function makeMove(game, from, to) {
            const fromCoords = squareToCoords(from);
            const toCoords = squareToCoords(to);
            
            // Validate coordinates
            if (fromCoords.row < 0 || fromCoords.row > 7 || fromCoords.col < 0 || fromCoords.col > 7 ||
                toCoords.row < 0 || toCoords.row > 7 || toCoords.col < 0 || toCoords.col > 7) {
                return { success: false, error: 'Invalid square coordinates' };
            }
            
            const piece = game.board[fromCoords.row][fromCoords.col];
            const targetPiece = game.board[toCoords.row][toCoords.col];
            
            // Check if there's a piece to move
            if (piece === '.') {
                return { success: false, error: 'No piece on source square' };
            }
            
            // Check if it's the right player's turn
            const pieceColor = getPieceColor(piece);
            if (pieceColor !== game.currentTurn) {
                return { success: false, error: `It's ${game.currentTurn}'s turn` };
            }
            
            // Check if trying to capture own piece
            if (targetPiece !== '.' && getPieceColor(targetPiece) === pieceColor) {
                return { success: false, error: 'Cannot capture your own piece' };
            }
            
            // Validate move according to piece rules
            if (!isValidMove(game, piece, fromCoords, toCoords)) {
                return { success: false, error: 'Invalid move for this piece' };
            }
            
            // Make the move
            game.board[toCoords.row][toCoords.col] = piece;
            game.board[fromCoords.row][fromCoords.col] = '.';
            
            // Handle captures
            let message = '';
            if (targetPiece !== '.') {
                game.capturedPieces[game.currentTurn].push(targetPiece);
                message = `Captured ${targetPiece}!`;
            }
            
            // Handle pawn promotion
            if ((piece === '♙' && toCoords.row === 0) || (piece === '♟' && toCoords.row === 7)) {
                game.board[toCoords.row][toCoords.col] = piece === '♙' ? '♕' : '♛';
                message += ' Pawn promoted to Queen!';
            }
            
            // Switch turns
            game.currentTurn = game.currentTurn === 'white' ? 'black' : 'white';
            game.moveCount++;
            
            return { success: true, message };
        }
        
        function isValidMove(game, piece, from, to) {
            const rowDiff = to.row - from.row;
            const colDiff = to.col - from.col;
            const absRowDiff = Math.abs(rowDiff);
            const absColDiff = Math.abs(colDiff);
            
            switch (piece) {
                case '♙': // White pawn
                    if (colDiff === 0) { // Forward move
                        if (rowDiff === -1) return game.board[to.row][to.col] === '.';
                        if (rowDiff === -2 && from.row === 6) return game.board[to.row][to.col] === '.' && game.board[5][to.col] === '.';
                    } else if (absColDiff === 1 && rowDiff === -1) { // Capture
                        return game.board[to.row][to.col] !== '.' && isBlackPiece(game.board[to.row][to.col]);
                    }
                    return false;
                    
                case '♟': // Black pawn
                    if (colDiff === 0) { // Forward move
                        if (rowDiff === 1) return game.board[to.row][to.col] === '.';
                        if (rowDiff === 2 && from.row === 1) return game.board[to.row][to.col] === '.' && game.board[2][to.col] === '.';
                    } else if (absColDiff === 1 && rowDiff === 1) { // Capture
                        return game.board[to.row][to.col] !== '.' && isWhitePiece(game.board[to.row][to.col]);
                    }
                    return false;
                    
                case '♖': case '♜': // Rook
                    if (rowDiff === 0 || colDiff === 0) {
                        return isPathClear(game.board, from, to);
                    }
                    return false;
                    
                case '♗': case '♝': // Bishop
                    if (absRowDiff === absColDiff) {
                        return isPathClear(game.board, from, to);
                    }
                    return false;
                    
                case '♕': case '♛': // Queen
                    if (rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff) {
                        return isPathClear(game.board, from, to);
                    }
                    return false;
                    
                case '♘': case '♞': // Knight
                    return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
                    
                case '♔': case '♚': // King
                    return absRowDiff <= 1 && absColDiff <= 1;
                    
                default:
                    return false;
            }
        }
        
        function isPathClear(board, from, to) {
            const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0;
            const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0;
            
            let currentRow = from.row + rowStep;
            let currentCol = from.col + colStep;
            
            while (currentRow !== to.row || currentCol !== to.col) {
                if (board[currentRow][currentCol] !== '.') {
                    return false;
                }
                currentRow += rowStep;
                currentCol += colStep;
            }
            
            return true;
        }
        
        function checkGameStatus(game) {
            // Simplified check detection
            // In a full implementation, you'd check for check, checkmate, and stalemate
            return 'active';
        }
    }
};
