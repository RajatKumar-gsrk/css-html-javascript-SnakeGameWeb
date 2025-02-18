const gamePanel = document.querySelector(".gamePanel");
const scoreBar_score = document.querySelector(".score");
const scoreBar_highScore = document.querySelector(".highScore");
const touchControls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX = 0, foodY = 0;
let snakeBody = []
snakeBody.push([5, 5]);
snakeBody.push([5, 4]);
snakeBody.push([5,3]);
let dx = 1, dy = 0;
let score = 0, highScore = retrieveHighScore();

function generateFood(){
    foodX = Math.floor(Math.random() * 25) + 1;
    foodY = Math.floor(Math.random() * 25) + 1;

    for(let i = 0; i < snakeBody.length; i += 1){
        if(foodX === snakeBody[i][0] && foodY === snakeBody[i][1]){
            generateFood();
            return;
        }
    }
}
generateFood();

const gameLoop = () => {//anonymous function

        let boardUpdater = `<div class = "food" style = "grid-area: ${foodY} / ${foodX}"></div>`;//row == Y, col == X, draws food
        moveSnake();
        checkGameOver();
        if(gameOver){
            return handleGameOver();
        }
        checkFood();
        boardUpdater += `<div class = "snake_head" style = "grid-area: ${snakeBody[0][1]} / ${snakeBody[0][0]}"></div>`;
        for(let i = 1; i < snakeBody.length; i +=1){//draws snake
            boardUpdater += `<div class = "snake" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        gamePanel.innerHTML = boardUpdater;
        updateScoreBar();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp" && dy != 1){
        dx = 0;
        dy = -1;
    }else if(e.key === "ArrowDown" && dy != -1){
        dx = 0;
        dy = 1;
    }else if(e.key === "ArrowRight" && dx != -1){
        dx = 1;
        dy = 0;
    }else if(e.key === "ArrowLeft" && dx != 1){
        dx = -1;
        dy = 0;
    }
}

touchControls.forEach(key => {
    key.addEventListener("click", ()=>changeDirection({key: key.dataset.key}));//calling chnagedirection on click with lambda
});

function moveSnake(){
    for(let i = snakeBody.length - 1; i > 0; i -= 1){
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeBody[0][0] + dx, snakeBody[0][1] + dy];
    //doesn't work as immutable as react state
    // snakeBody[0][0] += dx;
    // snakeBody[0][1] += dy;
}

const checkFood = () => {
    if(snakeBody[0][0] === foodX && snakeBody[0][1] === foodY){
        snakeBody.push([snakeBody[snakeBody.length - 1][0], snakeBody[snakeBody.length - 1][1]]);
        generateFood();
        score += 5;
        if(score > highScore){
            highScore = score;
            saveHighScore();
        }
    }
}

function retrieveHighScore(){
    return localStorage.getItem("highScore");
}

const updateScoreBar = () =>{
    scoreBar_score.innerHTML = `Score: ${score}`;//no need double quotes for strings
    scoreBar_highScore.innerHTML = `High Score: ${highScore}`;
}

function saveHighScore(){
    localStorage.setItem("highScore", highScore);
}

const checkGameOver = () => {
    if(snakeBody[0][0] <= 0 || snakeBody[0][0] > 25){
        gameOver = true;
        return;
    }else if(snakeBody[0][1] <= 0|| snakeBody[0][1] > 25){
        gameOver = true;
        return;
    }

    for(let i = 1; i < snakeBody.length; i += 1){
        if(snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]){
            gameOver = true;
            return;
        }
    }
}

function handleGameOver(){
    let overMsg = `<div class = "msg" style = "grid-area: 6/6/20/20">GAME OVER</div>`;
    gamePanel.insertAdjacentHTML('beforeend', overMsg);

    sleep(250).then(() => {
        // This will execute after the delay
        alert("Game Over press OK to RESTART...");
        location.reload();
    });
    clearInterval(intervalID);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


let intervalID = setInterval(gameLoop, 150);//runs loop every 150 ms

document.addEventListener("keydown", changeDirection);//don't put changeDirections() as that will directly call the funtion