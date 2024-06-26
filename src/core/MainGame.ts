import * as PIXI from 'pixi.js';
import { Tetromino, IShape, LShape, JShape, OShape, TShape, SShape, ZShape } from './tetromino';
export class Game {
    score: number;
    level: number;
    baseFallSpeed: number;
    scoreToNextLevel: number;
    boardWidth: number;
    boardHeight: number;
    currentBoard: number[][];
    landedBoard: number[][];
    currentTetromino: Tetromino;
    app: PIXI.Application;
    blockSize: number;
    padding: number;
    blockColors: number[];
    gameOverSoundPlayed: boolean;

    constructor() {
        this.score = 0;
        this.level = 1;
        this.baseFallSpeed = 800; 
        this.scoreToNextLevel = 100; 
        this.boardWidth = 10;
        this.boardHeight = 23;
        this.currentBoard = Array.from({ length: this.boardHeight }, () => Array(this.boardWidth).fill(0));
        this.landedBoard = Array.from({ length: this.boardHeight }, () => Array(this.boardWidth).fill(0));
        this.currentTetromino = this.randomTetromino();
        this.app = new PIXI.Application({ width: 560, height: 700, backgroundColor: 0xFFFFFF });
        document.body.appendChild(this.app.view);
        this.blockSize = 25;
        this.padding = 4;
        this.gameOverSoundPlayed = false;
        this.blockColors = [
            0xFF0000, // Đỏ
            0x00FF00, // Xanh lá cây
            0x0000FF, // Xanh dương
            0xFFFF00, // Vàng
            0xFF00FF, // Hồng
            0x00FFFF, // Cyan
            0xFFA500, // Cam
            0x800080, // Tím
            0xFFFF99, // Màu vàng nhạt
            0x00FF99, // Màu xanh lá cây nhạt
        ];
    }
    draw() {
        const previousScoreText = this.app.stage.getChildByName("scoreText");
        if (previousScoreText) {
            this.app.stage.removeChild(previousScoreText);
        }

        const graphics = new PIXI.Graphics();
        this.app.stage.addChild(graphics);
        graphics.clear();
        graphics.lineStyle(1, 0x800080);
        // Vẽ khung board
        graphics.drawRect(this.padding, this.padding, this.blockSize * this.boardWidth + this.padding * (this.boardWidth + 1), this.blockSize * (this.boardHeight - 3) + this.padding * (this.boardHeight - 3 + 1));

        for (let i = 3; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                const colorIndex = this.currentBoard[i][j] - 1; // Lấy màu từ mảng blockColors
                const color = colorIndex >= 0 ? this.blockColors[colorIndex] : 0xf8f8f8; // Mặc định là màu xám nếu không có màu nào được định
                graphics.beginFill(color);
                graphics.drawRect(this.padding * 2 + j * (this.blockSize + this.padding), this.padding * 2 + (i - 3) * (this.blockSize + this.padding), this.blockSize, this.blockSize);
                graphics.endFill();
            }
        } 
        this.app.renderer.resize(560, 700);
        const gameTitle = PIXI.Sprite.from('../assets/logo_tetris.png');
        gameTitle.position.set(325, 10);
        gameTitle.width = 200;
        gameTitle.height = 50;
        this.app.stage.addChild(gameTitle);

        // Text NEXT
        const nextTextStyle = new PIXI.TextStyle({
            fontFamily: 'Press Start 2P',
            fontSize: 18,
            fill: '##000000',
            fontWeight: 'bold',
        });

        const nextText = new PIXI.Text('Next:', nextTextStyle);
        nextText.position.set(310, 100);
        this.app.stage.addChild(nextText);

        // Text Level
        const levelTextStyle = new PIXI.TextStyle({
            fontFamily: 'Press Start 2P',
            fontSize: 18,
            fill: '##000000',
            fontWeight: 'bold',
        });

        const levelText = new PIXI.Text('Level:', levelTextStyle);
        levelText.position.set(310, 390);
        this.app.stage.addChild(levelText);

        // Text Score
        const scoreTextStyle = new PIXI.TextStyle({
            fontFamily: 'Press Start 2P',
            fontSize: 18,
            fill: '##000000',
            fontWeight: 'bold',
        });

        const scoreText = new PIXI.Text('Scores: ', scoreTextStyle);
        scoreText.name = "scoreText";
        scoreText.position.set(310, 360);
        this.app.stage.addChild(scoreText);

        // button play game
        const stage = PIXI.Sprite.from('../assets/R.png');
        stage.position.set(340, 425);
        stage.width = 175;
        stage.height = 55;
        this.app.stage.addChild(stage);
        stage.interactive = true;
        stage.buttonMode = true;
        stage.on('click', () => {
            location.reload();
        });

        // button pause game
        const replay = PIXI.Sprite.from('../assets/replay.png');
        replay.position.set(340, 490);
        replay.width = 173
        replay.height = 60;
        this.app.stage.addChild(replay);
        replay.interactive = true;
        replay.buttonMode = true;
        replay.on('click', () => {
            location.reload();
        });
        // button pause game
        const pause = PIXI.Sprite.from('../assets/pause.png');
        pause.position.set(333, 560);
        pause.width = 190;
        pause.height = 70;
        this.app.stage.addChild(pause);
        pause.interactive = true;
        pause.buttonMode = true;
        pause.on('click', () => {
            location.reload();
        });
        //  button exit game
        const exit = PIXI.Sprite.from('../assets/exit.png');
        exit.position.set(320, 628);
        exit.width = 220;
        exit.height = 80;
        this.app.stage.addChild(exit);
        exit.interactive = true;
        exit.buttonMode = true;
        exit.on('click', () => {
            location.reload();
        });

         //  button exit game
         const arow = PIXI.Sprite.from('../assets/aroww.png');
         arow.position.set(20, 580);
         arow.width = 200;
         arow.height = 200;
         this.app.stage.addChild(arow);
         arow.interactive = true;
         arow.buttonMode = true;
        
    }
    randomTetromino(): Tetromino {
        const randNum = Math.floor(Math.random() * 2);
        switch (randNum) {
            // case 0:
            //     return new LShape(1, 4);
            // case 1:
            //     return new JShape(1, 4);
            case 0:
                return new OShape(2, 4);
            // case 3:
            //     return new TShape(2, 4);
            // case 4:
            //     return new SShape(2, 4);
            // case 5:
            //     return new ZShape(2, 4);
            case 1:
                return new IShape(0, 4);
            default:
                throw new Error("Invalid Tetromino");
        }
    }
    canTetrominoMoveSideways(direction: string): boolean {
        const offset = direction === 'left' ? -1 : 1;
        for (let i = 0; i < this.currentTetromino.height; i++) {
            for (let j = 0; j < this.currentTetromino.width; j++) {
                if (this.currentTetromino.shape[i][j] > 0) {
                    const row = this.currentTetromino.row + i;
                    const col = this.currentTetromino.col + j + offset;
                    // Kiểm tra xem có di chuyển ra ngoài biên trái/phải không
                    if (col < 0 || col >= this.boardWidth) {
                        return false;
                    }
                    // Kiểm tra xem có đè lên các khối hộp đã ổn định không
                    if (row >= 0 && row < this.boardHeight && this.landedBoard[row][col] > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    play() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    if (this.canTetrominoMoveSideways('left')) {
                        this.currentTetromino.move('left');
                    }
                    break;
                case 'ArrowRight':
                    if (this.canTetrominoMoveSideways('right')) {
                        this.currentTetromino.move('right');
                    }
                    break;
                case 'ArrowUp':
                    this.currentTetromino.rotate();
                    break;
                case 'ArrowDown':
                    this.dropTetromino();
                    break;
            }
          
            this.updateCurrentBoard();
            this.draw();
            
        });

        setInterval(() => {
            this.progress();
            this.updateCurrentBoard();
            this.draw();
        }, this.baseFallSpeed);
    }

    dropTetromino() {
        while (this.canTetrominoFall()) {
            this.currentTetromino.fall();
        }
    }

    progress() {
        if (this.canTetrominoFall()) {
            this.currentTetromino.fall();
            this.fallBlockSound();
        } else {
            this.updateLandedBoard();
            this.checkAndClearFilledRows();
            this.currentTetromino = this.randomTetromino();
            if (!this.canTetrominoFall()) {
                this.showGameOverDialog();
                // console.log("Game Over!");
                return;
            }
        }
        this.updateCurrentBoard();
        this.draw();
    }
    

    showGameOverDialog() {
        this.playGameOverSound();
        // Tạo hộp thoại Game Over
        const dialog = new PIXI.Graphics();
        dialog.beginFill(0x000000, 0.5);
        dialog.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height);
        dialog.endFill();
        dialog.zIndex = 9999;
        this.app.stage.addChild(dialog);

        // Thêm văn bản "Game Over!"
        const gameOverText = new PIXI.Text('Game Over!', { fontFamily: 'Arial', fontSize: 43, fill: 0xFF0000, fontWeight: 'bold' });
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(430, 410);
        dialog.addChild(gameOverText);


        const reloadButton = PIXI.Sprite.from('../assets/R.png');
        reloadButton.width = 200;
        reloadButton.height = 50;
        reloadButton.interactive = true;
        reloadButton.buttonMode = true;
        reloadButton.position.set(330, 430);
        dialog.addChild(reloadButton);

        // Xử lý sự kiện khi nhấn nút "Reload Game"
        reloadButton.on('pointerdown', () => {
            location.reload();
        });
       

    }
    canTetrominoFall(): boolean {
        for (let i = 0; i < this.currentTetromino.height; i++) {
            for (let j = 0; j < this.currentTetromino.width; j++) {
                if (this.currentTetromino.shape[i][j] > 0) {
                    let row = this.currentTetromino.row + i + 1;
                    let col = this.currentTetromino.col + j;
                    if (row >= this.boardHeight || this.landedBoard[row][col] > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    updateLandedBoard() {
        for (let i = 0; i < this.currentTetromino.height; i++) {
            for (let j = 0; j < this.currentTetromino.width; j++) {
                if (this.currentTetromino.shape[i][j] > 0) {
                    this.landedBoard[this.currentTetromino.row + i][this.currentTetromino.col + j] = this.currentTetromino.shape[i][j];
                }
            }
        }
    }

    updateCurrentBoard() {
        for (let i = 0; i < this.boardHeight; i++) {
            for (let j = 0; j < this.boardWidth; j++) {
                this.currentBoard[i][j] = this.landedBoard[i][j];
            }
        }

        for (let i = 0; i < this.currentTetromino.height; i++) {
            for (let j = 0; j < this.currentTetromino.width; j++) {
                if (this.currentTetromino.shape[i][j] > 0) {
                    this.currentBoard[this.currentTetromino.row + i][this.currentTetromino.col + j] = this.currentTetromino.shape[i][j];
                }
            }
        }
    }


    checkAndClearFilledRows() {
        let clearedRowCount = 0;
        for (let i = this.boardHeight - 1; i >= 0; i--) {
            let rowFilled = true;
            for (let j = 0; j < this.boardWidth; j++) {
                if (this.landedBoard[i][j] === 0) {
                    rowFilled = false;
                    break;
                }
            }
            if (rowFilled) {
                this.clearRow(i);
                this.moveBlocksDown(i);
                clearedRowCount++;
            }
        }
        if (clearedRowCount > 0) {
            this.Updatescore(clearedRowCount);
            this.Updatescore(0);
            this.checkAndClearFilledRows();

        } else {
            return;
        }
    }
    Updatescore(clearedRowCount: number) {
        let scoreIncrement = 0;
        if (clearedRowCount  === 1) {
            scoreIncrement = 100;
        } else if (clearedRowCount  == 2) {
            scoreIncrement = 200;
        } else if (clearedRowCount  == 3) {
            scoreIncrement = 200;
        } else if (clearedRowCount === 4) {
            scoreIncrement = 1000;
        }
        this.score += scoreIncrement;
    }
    
    clearRow(row: number) {
        for (let j = 0; j < this.boardWidth; j++) {
            this.landedBoard[row][j] = 0;
        }
        this.playEatSound();
    }
// âm thanh của game
    playEatSound() {
       
        const audio = new Audio('../assets/audio/258020__kodack__arcade-bleep-sound.mp3');
        audio.play();
    }
    playGameOverSound() {
        if (!this.gameOverSoundPlayed) {
            const audio = new Audio('../assets/audio/251461__joshuaempyre__arcade-music-loop.mp3');
            audio.play();
            this.gameOverSoundPlayed = true;
        }
    }
    fallBlockSound() {
        const audio = new Audio('../assets/audio/263006__dermotte__giant-step-1.mp3');
        audio.play();
    }
    moveBlocksDown(clearedRow: number) {
        for (let i = clearedRow - 1; i >= 0; i--) {
            for (let j = 0; j < this.boardWidth; j++) {
                this.landedBoard[i + 1][j] = this.landedBoard[i][j];
                this.landedBoard[i][j] = 0;
            }
        }
    }


}

export function initializeGame() {
    const game = new Game();
    game.updateCurrentBoard();
    game.draw();
    // game.drawNextTetromino();
    game.play();

}