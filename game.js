class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = Math.floor(this.canvas.width / 30); // Adjust grid size based on canvas width
        this.snake = [
            { x: 15, y: 10 },
            { x: 14, y: 10 },
            { x: 13, y: 10 }
        ];
        this.direction = 'right';
        this.apple = this.generateApple();
        this.score = 0;
        this.speed = 200;
        this.minSpeed = 50;
        this.speedDecrement = 5;
        this.gameLoop = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0 && this.direction !== 'left') {
                    this.direction = 'right';
                } else if (deltaX < 0 && this.direction !== 'right') {
                    this.direction = 'left';
                }
            } else {
                if (deltaY > 0 && this.direction !== 'up') {
                    this.direction = 'down';
                } else if (deltaY < 0 && this.direction !== 'down') {
                    this.direction = 'up';
                }
            }
        });
    }

    startGame() {
        document.getElementById('entry-page').style.display = 'none';
        this.canvas.style.display = 'block';
        const hintText = document.querySelector('.hint-text');
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        hintText.textContent = isMobile ? 'Hint: swipe to change direction' : 'Hint: use arrow keys';
        hintText.style.display = 'block';
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    handleKeyPress(e) {
        const key = e.key;
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        if (directions[key]) {
            const newDirection = directions[key];
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            if (this.direction !== opposites[newDirection]) {
                this.direction = newDirection;
            }
        }
    }

    generateApple() {
        const maxX = this.canvas.width / this.gridSize - 1;
        const maxY = this.canvas.height / this.gridSize - 1;
        let newApple;

        do {
            newApple = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.snake.some(segment => 
            segment.x === newApple.x && segment.y === newApple.y));

        return newApple;
    }

    update() {
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.score++;
            this.apple = this.generateApple();
            this.increaseSpeed();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        return (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= this.canvas.width / this.gridSize ||
            head.y >= this.canvas.height / this.gridSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    increaseSpeed() {
        if (this.speed > this.minSpeed) {
            this.speed -= this.speedDecrement;
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.speed);
        }
    }

    reset() {
        this.snake = [
            { x: 15, y: 10 },
            { x: 14, y: 10 },
            { x: 13, y: 10 }
        ];
        this.direction = 'right';
        this.apple = this.generateApple();
        this.score = 0;
        this.speed = 200;
        this.gameLoop = null;
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart';
        restartBtn.style.padding = '15px 40px';
        restartBtn.style.fontSize = '24px';
        restartBtn.style.background = '#4CAF50';
        restartBtn.style.color = 'white';
        restartBtn.style.border = 'none';
        restartBtn.style.borderRadius = '8px';
        restartBtn.style.cursor = 'pointer';
        restartBtn.style.marginTop = '20px';
        restartBtn.addEventListener('click', () => {
            restartBtn.remove();
            this.reset();
            this.startGame();
        });
        document.getElementById('game-container').appendChild(restartBtn);
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.apple.x * this.gridSize,
            this.apple.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
}

new SnakeGame();