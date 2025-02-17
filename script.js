const gamePanel = document.querySelector(".gamePanel");
const scoreBar_score = document.querySelector(".score");
const scoreBar_highScore = document.querySelector(".highScore");


let foodX = 0, foodY = 0;
let snakeBody = []
snakeBody.push([5, 5]);
let dx = 0, dy = 0;
let score = 0, highScore = retrieveHighScore();

function generateFood(){
    foodX = Math.floor(Math.random() * 25) + 1;
    foodY = Math.floor(Math.random() * 25) + 1;
}
generateFood();

const gameLoop = () => {//anonymous function

        let boardUpdater = `<div class = "food" style = "grid-area: ${foodY} / ${foodX}"></div>`;//row == Y, col == X, draws food
        moveSnake();
        checkFood();
        for(let i = 0; i < snakeBody.length; i +=1){//draws snake
            boardUpdater += `<div class = "snake" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        gamePanel.innerHTML = boardUpdater;
        updateScoreBar();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp"){
        dx = 0;
        dy = -1;
    }else if(e.key === "ArrowDown"){
        dx = 0;
        dy = 1;
    }else if(e.key === "ArrowRight"){
        dx = 1;
        dy = 0;
    }else if(e.key === "ArrowLeft"){
        dx = -1;
        dy = 0;
    }
}

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
        snakeBody.push([foodX, foodY]);
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


setInterval(gameLoop, 150);//runs loop every 150 ms

document.addEventListener("keydown", changeDirection);//don't put changeDirections() as that will directly call the funtion