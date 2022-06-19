let snakeArray = [{x:10, y:10}]; // inital location of snake
let lastElementSnakeArray; // when the food touches head of the snake, append a new element with the 
// coordinate of the last element of "previous state" of the snake array
let velocity = {x:0, y:0}; // initial velocity
let foodLoc = {x:5, y:5}; // initial food location
let prevTime = 0; 
let speed = 8;
let cool = 16-speed; // to maintain movements on the frame number multiple of cool
let frameNum = 0;
let fps = 60; // frames per second
let score = 0;
let maxScore = 0;
let pause = 1; // snake is at rest
let timer = 10; // game over
let difficulty = "hard";
let pausebtn = 'p', startbtn = 's', resumebtn = 'r';
let upbtn = 'ArrowUp', downbtn = 'ArrowDown', leftbtn = 'ArrowLeft', rightbtn = 'ArrowRight';
let timesPlayed = 0;
let obstacleArray = [{x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:10,y:7},{x:11,y:7},
{x:12,y:7},{x:13,y:7},{x:14,y:7},{x:15,y:7}];

// callback function
function paint(currTime){
    window.requestAnimationFrame(paint);
    if ((currTime-prevTime)<1000/fps){
        return;
    }
    gameEngine();
    frameNum++;
    prevTime = currTime;
}

// requesting web api for calling paint function 
window.requestAnimationFrame(paint);

// form listener
document.querySelector("#submit").addEventListener("click", (e)=>{
    const form = document.querySelector(".controls-setting");
    let startbtn0 = form.querySelector("#start").value; // startbtn0 to know if any input is recieve via form
    if (startbtn0) startbtn = startbtn0; // if recieved set startbtn to it
    let pausebtn0 = form.querySelector("#pause").value;
    if (pausebtn0) pausebtn = pausebtn0;
    let resumebtn0 = form.querySelector("#resume").value;
    if (resumebtn0) resumebtn = resumebtn0;
    let upbtn0 = form.querySelector("#up").value;
    if (upbtn0) upbtn = upbtn0;
    let downbtn0 = form.querySelector("#down").value;
    if (downbtn0) downbtn = downbtn0;
    let leftbtn0 = form.querySelector("#left").value;
    if (leftbtn0) leftbtn = leftbtn0;
    let rightbtn0 = form.querySelector("#right").value;
    if (rightbtn0) rightbtn = rightbtn0;
    let speed0 = form.querySelector("#speeds").value;
    if (speed0) speed = speed0, cool = 16-speed;
    let difficulty0 = form.querySelector("#menu").value;
    if (difficulty0) difficulty = difficulty0;
});

// movements listener
document.addEventListener("keydown", (e) => {
    const scoreBox = document.querySelector(".score");
    scoreBox.style.color = `white`;
    switch(e.key){
        case upbtn:
            // if snake tries to move opposite game over
            if (difficulty!=="easy" && velocity.y===1){
                reset();
                break;
            }
            velocity.x = 0;
            velocity.y = -1;
            pause = 0;
            break;
        case downbtn:
            if (difficulty!=="easy" && velocity.y===-1){
                reset();
                break;
            }
            velocity.x = 0;
            velocity.y = 1;
            pause = 0;
            break;
        case leftbtn:
            if (difficulty!=="easy" && velocity.x===1){
                reset();
                break;
            }
            velocity.x = -1;
            velocity.y = 0;
            pause = 0;
            break;
        case rightbtn:
            if (difficulty!=="easy" && velocity.x===-1){
                reset();
                break;
            }
            velocity.x = 1;
            velocity.y = 0;
            pause = 0;
            break;
        case startbtn:
            reset();
            break;
        case resumebtn:
            pause = 0;
            break;
        case pausebtn:
            pause = 1;
            break;
        default:
            break;
    }
});


// checking if snakehead touches obstacles
function contains(a,b){
    for (let obstacleNum=0; obstacleNum<obstacleArray.length; obstacleNum++){
        let obstacleObj = obstacleArray[obstacleNum];
        if (a===obstacleObj.x && b===obstacleObj.y) return true;
    }
    return false;
}

// if collided against wall and obstacles and itself
function isCollided(){
    const snakeHead = snakeArray[0];
    if (difficulty==="hard"){
        if (contains(snakeHead.x,snakeHead.y)) return true;
    }
    if ((snakeHead.x<1 || snakeHead.y<1 || snakeHead.x>15 || snakeHead.y>15)) return true;
    if (difficulty!=="easy"){
        for (let pieceNum=snakeArray.length-1;pieceNum>0;pieceNum--){
            if (snakeArray[pieceNum].x===snakeHead.x && snakeArray[pieceNum].y===snakeHead.y) return true;
        }
    }
    return false;
}

function reset(){
    const board = document.querySelector(".board");
    board.innerHTML = "";
    snakeArray = [{x:10, y:10}];
    foodLoc = {x:5, y:5};
    velocity = {x:0, y:0};
    board.innerHTML = "";
    if (maxScore<score) maxScore = score;
    score = 0;
    const hscore = document.querySelector(".hscore");
    hscore.innerText = ''+maxScore;
    pause = 1;
    timer = 10;
    const scoreBox = document.querySelector(".score");
    scoreBox.style.color = `red`;
    timesPlayed++;
    const played = document.querySelector(".times-played");
    played.innerText = timesPlayed;
    gameEngine();
}

// if difficulty is hard make the settings
function ifDoDifficultyHard(){
    const board = document.querySelector(".board");
    board.innerHTML = "";
    if (difficulty==="hard"){
        obstacleArray.forEach(e=>{
            const obstacles = document.createElement("div");
            obstacles.style.gridRowStart = e.y;
            obstacles.style.gridColumnStart = e.x;
            obstacles.classList.add("obstacles");
            board.insertAdjacentElement("beforeend",obstacles);
        });
    }
}


// main function
function gameEngine(){

    if (pause===0 && frameNum%fps===0) timer--;
    if (timer<0){
        reset();
    }
    const board = document.querySelector(".board");
    board.innerHTML = "";
    
    if (isCollided()){
        reset(); 
    }

    ifDoDifficultyHard();
    if (pause===0){
        let scoreNum = document.getElementsByClassName("score-num")[0];
        scoreNum.innerText = ''+score;
    }
    if (foodLoc.x===snakeArray[0].x && foodLoc.y===snakeArray[0].y){
        timer = 10;
        snakeArray.push({x:lastElementSnakeArray.x,y:lastElementSnakeArray.y});
        let a = 1, b = 7;

        // generating random coordinates until overlap cancels
        while (contains(a,b)){
            a = Math.floor(1 + Math.random()*15);
            b = Math.floor(1 + Math.random()*15);
            foodLoc = {x:a,y:b};
        }
        score++;
    }

    if (pause===0 && frameNum%cool===0){
        lastElementSnakeArray = {...snakeArray[snakeArray.length-1]};
        for (let pieceNum = snakeArray.length-1; pieceNum>0; pieceNum--){
            snakeArray[pieceNum] = {...snakeArray[pieceNum-1]};
        }
    
        snakeArray[0].x = snakeArray[0].x+velocity.x;
        snakeArray[0].y = snakeArray[0].y+velocity.y;
    }

    for (let idx=snakeArray.length-1; idx>=0; idx--){
        const snakePiece = document.createElement("div");
        if (idx===0){
            snakePiece.classList.add("head");
            snakePiece.innerText = ''+timer;
        }
        else
            snakePiece.style.backgroundColor = `whitesmoke`;

        snakePiece.style.gridRowStart = snakeArray[idx].y;
        snakePiece.style.gridColumnStart = snakeArray[idx].x;

        board.insertAdjacentElement("beforeend",snakePiece);
    }

    const foodPiece = document.createElement("div");

    foodPiece.classList.add("foodPiece");

    foodPiece.style.gridRowStart = foodLoc.y;
    foodPiece.style.gridColumnStart = foodLoc.x;

    board.insertAdjacentElement("beforeend",foodPiece);

}