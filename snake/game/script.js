document.documentElement.style.setProperty('--bodyHeight', `${window.innerHeight}px`);

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");



//Add event listener to restart button
document.getElementById('restart').addEventListener('click', () => location.reload());

class Snake {
    constructor() {
        this.canvasWidth = 70;
        this.blockSize = 10;
        this.score = 0;
        this.lost = false;
        this.interval = 40;
        this.color = null;
        this.snake = [
            {x: 3*this.blockSize, y: Math.floor(canvas.height/this.blockSize/2)*this.blockSize},
            {x: 2*this.blockSize, y: Math.floor(canvas.height/this.blockSize/2)*this.blockSize},
            {x: 1*this.blockSize, y: Math.floor(canvas.height/this.blockSize/2)*this.blockSize},
            {x: 0*this.blockSize, y: Math.floor(canvas.height/this.blockSize/2)*this.blockSize}
        ];

        //Move speed + direction
        this.move = {
            y : 0,
            x : this.blockSize
        }

        //Random food postion
        this.food = {
            x : (Math.floor(Math.random() * (canvas.width/this.blockSize - 5 )) + 4) * this.blockSize,
            y : (Math.floor(Math.random() * (canvas.height/this.blockSize - 5 )) + 4) * this.blockSize
        }

        this.action = {
            moveUp: () => {
                if(this.move.y == 0 && this.snake[1].y == this.snake[0].y) {
                    this.move.x = 0
                    this.move.y = -this.blockSize;
                }
            },
            
            moveDown: () => {
                if(this.move.y == 0 && this.snake[1].y == this.snake[0].y) {
                    this.move.x = 0
                    this.move.y = this.blockSize;
                }
            },

            moveLeft: () => {    
                if(this.move.x == 0 && this.snake[1].x == this.snake[0].x) {
                    this.move.y = 0;
                    this.move.x = -this.blockSize;
                }
            },

            moveRight: () => {    
                if(this.move.x == 0 && this.snake[1].x == this.snake[0].x) {
                    this.move.y = 0;
                    this.move.x = this.blockSize;
                }
            }
        }
    }

    setParameters() {
        //Shows Buttons if is set
        if(localStorage.keyboard == 'true') {
            this.keyPress();

        } else if(localStorage.buttons == 'true') {
            document.getElementsByClassName('buttons')[0].style.display = 'block';
            snake.buttonClick('touchstart');
            snake.buttonClick('mousedown');

        } else if(localStorage.swipe == 'true') {
            this.swipe();
            this.swipeMouse();
        };

        //Size of Buttons
        document.querySelectorAll('.buttons img').forEach(x => {
            x.style.height = localStorage.buttonSize + 'px';
            x.style.width = localStorage.buttonSize + 'px';
        })


        //Snake Color
        this.color = localStorage.snakeColor ? localStorage.snakeColor : 'yellow';
    }

    //Draw snake on canvas
    draw() {       
        let snake1;
        for(let i = 0; i  < this.snake.length; i++) {
            snake1 = this.snake[i];

            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.strokeStyle = 'rgb(40,40,40)';
            ctx.rect(snake1.x, snake1.y , this.blockSize, this.blockSize);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
    }

    //Draw food on canvas
    drawFood() {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(this.food.x, this.food.y, this.blockSize, this.blockSize);
        ctx.closePath();
    }

    //Add random position food
    addFood() {
        let x = (Math.floor(Math.random() * ( canvas.width/this.blockSize - 2 )) + 1) * this.blockSize;
        let y = (Math.floor(Math.random() * ( canvas.height/this.blockSize - 2 )) + 1) * this.blockSize;
        
        let snakeBlock;

        //Checks if food spawned on snake body, if true reruns function
        for(let i = 0; i < this.snake.length; i++) {
            snakeBlock = this.snake[i];
            if(x + this.blockSize > snakeBlock.x && x < snakeBlock.x + this.blockSize) {
                if(y + this.blockSize > snakeBlock.y && y < snakeBlock.y + this.blockSize) {
                    return this.addFood();
                }
            }
        }

        this.food.x = x;
        this.food.y = y;
    }

    //Captures keypresses
    keyPress() {
        document.addEventListener('keydown', (e) => {
            if(e.code == 'ArrowUp' || e.code == 'KeyW') {
                this.action.moveUp();
            }
            
            if(e.code == 'ArrowDown' || e.code == 'KeyS') {
                this.action.moveDown();
            }
            
            if(e.code == 'ArrowLeft' || e.code == 'KeyA') {
                this.action.moveLeft();
            }
            
            if(e.code == 'ArrowRight' || e.code == 'KeyD') {
                this.action.moveRight();
            }            
        })
    }

    //Catches presses. Feature for phone
    buttonClick(event) {
        document.getElementById('btn_up').addEventListener(event, () => {
            this.action.moveUp();
        })

        document.getElementById('btn_down').addEventListener(event, () => {
            this.action.moveDown();
        })

        document.getElementById('btn_left').addEventListener(event, () => {
            this.action.moveLeft();
        })

        document.getElementById('btn_right').addEventListener(event, () => {
            this.action.moveRight();
        })
    }


    //Checks if snake collided with wall
    wallCollision() {
        if(this.snake[0].x + this.blockSize > canvas.width) {
            this.snake[0].x = 0; 
        }

        else if(this.snake[0].x < 0) {
            this.snake[0].x = canvas.width - this.blockSize;
        }        

        else if(this.snake[0].y + this.blockSize > canvas.height) {
            this.snake[0].y = 0;
        }    

        else if(this.snake[0].y < 0) {
            this.snake[0].y = canvas.height - this.blockSize;
        }        
    }

    //Checks if snake collided with itself
    selfCollision() {
        for (var i = 1; i < this.snake.length; i++) {
            if (this.snake[0].x + this.blockSize > this.snake[i].x && this.snake[0].x < this.snake[i].x + this.blockSize) {
                if (this.snake[0].y + this.blockSize > this.snake[i].y && this.snake[0].y < this.snake[i].y + this.blockSize) {
                    this.lost = true;
                    document.getElementsByClassName('over')[0].style.display = 'flex';
                    document.getElementsByClassName('score_last')[0].innerHTML = `Score: ${this.score}`
                
                    if(localStorage.highScore) {
                        if(localStorage.highScore < this.score) localStorage.highScore = this.score;
                    } else {    
                        localStorage.highScore = this.score;
                    }
                }
            }
        }
    }

    //Checks if snake got food
    foodCollision() {
        if(this.snake[0].x < this.food.x + this.blockSize && this.snake[0].x + this.blockSize > this.food.x) {
            if(this.snake[0].y < this.food.y + this.blockSize && this.snake[0].y + this.blockSize > this.food.y) {
                this.addFood();

                this.score++;

                this.snake.push({//Adds New Block To Snake
                    x: this.snake[this.snake.length-1].x,
                    y: this.snake[this.snake.length-1].y
                })

                document.getElementById('score').innerHTML = `Score: ${this.score}`;
            }
        }
    }


    //Moves snake
    snakeMove() {
        for(let i = this.snake.length-1; i > 0; i--) {
            this.snake[i].y = this.snake[i-1].y;
            this.snake[i].x = this.snake[i-1].x;
        }
        
        this.snake[0].x += this.move.x; 
        this.snake[0].y += this.move.y;
        
        this.draw();
    }
    
    checkPositioning() {
        let canvPos = canvas.getBoundingClientRect(); 

        while(canvPos.top < 20) {
            this.canvasWidth--;
            canvas.style.width = this.canvasWidth + '%';
            canvPos = canvas.getBoundingClientRect(); 
        }
    };

    swipe() {
        let startX = false;
        let startY = false;
        let diffX = false;
        let diffY = false;
        let swiped = false;
    
        document.addEventListener('touchstart', (e) => {
            swiped = false;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        })
            
        document.addEventListener('touchmove', (e) => {
            if(swiped) return false;
            diffX = startX - e.changedTouches[0].clientX;
            diffY = startY - e.changedTouches[0].clientY;
            
            if(Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
                swiped = true;
                if(Math.abs(diffX) > Math.abs(diffY)) {
                    //Swipe Left
                    if(diffX > 0) this.action.moveLeft();
    
                    //Swipe Right
                    else if(diffX < 0) this.action.moveRight();
                }
    
                else if(Math.abs(diffX) < Math.abs(diffY)) {
                    //Swipe Up
                    if(diffY > 0) this.action.moveUp();
    
                    //Swipe Down
                    else if(diffY < 0) this.action.moveDown();
                }
            }
        })
    }


    swipeMouse() {
        let startX = false;
        let startY = false;
        let diffX = false;
        let diffY = false;
         
        let swiped = false;
        
        document.addEventListener('mousedown', (e) => {
            swiped = false;
            startX = e.offsetX;
            startY = e.offsetY;
         })
                
        document.addEventListener('mousemove', (e) => {
            if(swiped) return false;
            diffX = startX - e.offsetX;
            diffY = startY - e.offsetY;
            
            if(Math.abs(diffX) > 50 || Math.abs(diffY) > 50) {
                swiped = true;
    
                //Horizontall Swipe
                if(Math.abs(diffX) > Math.abs(diffY)) {
                    
                    //Swipe Left
                    if(diffX > 0) {
                        this.action.moveLeft();
                    }
                        
                        //Swipe Right
                        else if(diffX < 0) {
                            this.action.moveRight();
                        } ;
                    }
                    
                    //Vartical Swipe
                else if(Math.abs(diffX) < Math.abs(diffY)) {
                    
                    //Swipe Up
                    if(diffY > 0) {
                        this.action.moveUp();
                    }
                    
                    //Swipe Down
                    else if(diffY < 0) {
                        this.action.moveDown();
                    };
                }
   
            }
        })
    }

    //Main function which gets repeated 60 times second
    game() {
        let interval = setInterval(() => {
            if(this.lost) clearInterval(interval);
            ctx.clearRect(0,0, canvas.width, canvas.height);
            this.drawFood();
            this.snakeMove();
            this.foodCollision();
            this.wallCollision();
            this.selfCollision();
        }, this.interval);
    }

} 

let snake = new Snake();
snake.setParameters();
snake.draw();
snake.drawFood();
snake.checkPositioning();
snake.game();

// document.getElementById('go').addEventListener('click', function() {
    // document.body.requestFullscreen();
    // this.parentElement.style.display = 'none';
// })

document.getElementsByClassName('menuBtn')[0].addEventListener('click', () => {
    if(confirm('If You Leave You These Points Will Be Lost')) {
        window.location.href = '../index.html';
    }
})

