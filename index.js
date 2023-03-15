
// --- canvas setup --- //
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 300;




// --- keys --- //
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    x: {
        pressed: false,
    }
    
}

var lastKey;

document.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;              
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 'x':
            keys.x.pressed = true;
            lastKey = 'x';
            break;
        
    }

    console.log(event.key);
})

document.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;     
        case 'a':
            keys.a.pressed = false;
            break;
        case 'x':
            keys.x.pressed = false;
            break;
    }
    
   
})




// --- Sprites Class --- //
class Sprites{
    constructor(img, width, height, frameX, frameY, xPos, yPos, frames, scale){
        this.img = img;
        this.width = width;
        this.height = height;
        this.frameX = frameX;
        this.frameY = frameY;
        this.xPos = xPos;
        this.yPos = yPos;
        this.frames = frames;   
        this.scale = scale;
    }

    draw(){


        c.drawImage(this.img, this.frameY*this.width, this.frameX*this.height, 
            this.width, this.height,  this.xPos,  this.yPos, this.width*this.scale, this.height*this.scale);
        

        if(this.frameY == this.frames-1){
            this.frameY = 0;
        }
        else{
            this.frameY+=1;
        }
            
      
    }
    
}

// --- player Class --- //
class Player extends Sprites{
    constructor(img, width, height, frameX, frameY, xPos, yPos, frames, scale, hp, dmg, energy){
        super(img, width, height, frameX, frameY, xPos, yPos, frames, scale);
        this.pos = xPos; //initial position
        this.hp = hp;
        this.dmg = dmg;
        this.inDmg = this.dmg; // initial dmg
        this.energy = energy;
        this.isAttack = false;
        this.isSkill = false;
        this.isDrink = false;
        this.isPass = false;
        this.isDead = false;
        this.isEndTurn = false;
        
    }
    
    attack(){
        if(!this.isDead && this.energy >= 2 && !enemy.isEndTurn && !this.isEndTurn){

            this.frameY = 0;
            this.frames = 27;
            this.img.src = "basicattack1.png"; 
            this.isAttack = true;
            this.isEndTurn = true;
            this.energy-=2;
           
        }
        
    }
    skill(){
        if(!this.isDead && this.energy == 10 && !enemy.isEndTurn && !this.isEndTurn){
            this.isSkill = true;
            this.isEndTurn = true;
            this.frameY = 0;
            this.frames = 33;
            this.xPos = 0;
            this.img.src = "skill1.png";
            this.energy -= 10; // energy cost for skill
            
        }
        
    }
    drink(){ //need fix
        if(!this.isDead && this.energy >= 5 && !enemy.isEndTurn && !this.isEndTurn){
            this.isDrink = true;
            this.isEndTurn = true;
            this.frameY = 0;
            this.frames = 19;
            this.img.src = "player-heal.png";
            this.energy -= 5;
            this.hp += 50;
        }
        
    }
    pass(){
        if(!this.isDead && !enemy.isDead && !enemy.isEndTurn && !this.isEndTurn){
            this.frameY = 0;
            this.frames = 6;
            this.isEndTurn = true;
            this.isPass = true;
            
        }
    }
    

    takeHit(){
        if(!this.isDead){
            this.frameY = 0;
            this.frames = 9;
            playerImg.src = "player-takeHit.png";
            this.hp -= enemy.dmg;
            // if(this.frameY == 4){
            //     this.energy +=1;
            // }
        }
    }

    dead(){
        if(!this.isDead){
            this.frameY = 0;
            this.frames = 9;
            this.img.src = "player-dead.png";
            this.isDead = true;
        }
    }

    drawHpBar(){
        
        if( this.hp/10 > 65){
            c.fillStyle = "green";          
        }else if(this.hp/10 > 30){
            c.fillStyle = "yellow";
        }else{
            c.fillStyle = "red";
        }
        

        c.fillRect(this.xPos+10, this.yPos+150, this.hp/10, 5);
        c.closePath();

        c.beginPath(); // outline
        c.rect(this.xPos+10, this.yPos+150, 101, 6);//thickenning the outline
        c.rect(this.xPos+10, this.yPos+150, 101, 6);
        c.rect(this.xPos+10, this.yPos+150, 101, 6);
        c.stroke();
        // c.closePath();
    }
    drawEnergyBar(){
        
        
        c.fillStyle = "white";
        c.fillRect(this.xPos+10, this.yPos+160, this.energy*10, 5);
        

        c.beginPath(); // outline
        c.rect(this.xPos+10, this.yPos+160, 101, 6);//thickenning the outline
        c.rect(this.xPos+10, this.yPos+160, 101, 6);
        c.rect(this.xPos+10, this.yPos+160, 101, 6);
        c.stroke();

        
    }
    
    drawPass(){
        if(!this.isDead && !enemy.isDead ){
            c.font = "30px charybdis";
            c.fillStyle = "white";
            c.fillText("PASS!", 30, 150);
            c.strokeText("PASS!", 30, 150);
            c.strokeText("PASS!", 30, 150);
            c.closePath();
        }
    }

    update(){
        if(enemy.isAttack && enemy.frameY == 11){ // if attacked and ended turn, take hit
            
            this.takeHit();
        }
             
        if(enemy.isSkill && enemy.frameY > 18 && enemy.frameY < 26){
            this.takeHit();
        }

        if(frameCount >= (maxTime*8)-6 || this.isPass){
            this.pass();
            this.drawPass();
            this.isPass = false;
           
        }

        if(this.hp <= 0){ // if no hp, dead
            this.hp = 0;
            this.dead(); 
            this.isDead = true;
        }

        if(this.energy > 10){ // energy limiter
            this.energy = 10;
        }

        if(this.hp > 1000){ // hp limiter
            this.hp = 1000;
        }
        
        //for animation 
        if(this.frameY == this.frames-1 && !this.isDead){ // if reached max frames reset to frame0 and idle --

            //reset 
            this.img.src = "player-idle.png";
            this.frameY = 0;
            this.frames = 8;

            
            this.isAttack = false;
            this.isSkill = false;
            this.isDrink = false;
            this.isEndTurn = false;

            this.dmg = this.inDmg;
            
        }
        else{// if not reached max frames, proceed to next frame --
        

            if(this.isDead && this.frameY == this.frames-1){ // if dead and frameY = last frame, stop animating
                this.frameY=this.frames-1;
            }else{ // else animate
                this.frameY+=1;
                
            } 
        }

        
        
    }

    

    draw(){
        this.update();
        this.drawHpBar();
        this.drawEnergyBar();
        c.drawImage(this.img, this.frameY*this.width, this.frameX*this.height, 
            this.width, this.height,  this.xPos,  this.yPos, this.width*this.scale, this.height*this.scale);
    
        
    }

}

// --- Enemy Class --- //

class Enemy extends Sprites{
    constructor(img, width, height, frameX, frameY, xPos, yPos, frames, scale, hp, dmg, energy){
        super(img, width, height, frameX, frameY, xPos, yPos, frames, scale);
        this.pos = xPos; //initial position
        this.hp = hp;
        this.dmg = dmg;
        this.inDmg = this.dmg; // initial dmg
        this.energy = energy;
        this.isAttack = false;
        this.isSkill = false;
        this.isShield = false;
        this.isPass = false;
        this.isDead = false;
        this.isEndTurn = false;
    }

    attack(){
        if(!this.isDead && this.energy >= 1 && !player.isDead){
            
            this.frameY = 0;
            this.img.src = "enemy-basicatk2.png";
            this.frames = 18;
            this.isAttack = true;
            this.isEndTurn = true;
            this.energy--;
            
            
        }
        
    }
    skill(){
        if(!this.isDead && this.energy == 10 && !player.isSkill && !player.isDead){
            this.isSkill = true;
            this.isEndTurn = true;
            this.frameY = 0;
            this.frames = 34;
            this.img.src = "enemy-skill1.png";
            this.energy -= 10; // energy cost for skill
        }
    }

    shield(){
        if(!this.isDead && this.energy >= 5 && !player.isDead){
            this.isEndTurn = true;
            this.isShield = true;
            this.frameY = 0;
            this.frames = 7;
            this.img.src = "enemy-shield.png";
            this.energy -= 2; // energy cost
        
           
        }
        
    }

    
    pass(){
        if(!this.isDead && !player.isDead){
            this.isEndTurn = true;
            this.isPass = true;
        }
    }

    takeHit(){
        if(!this.isDead){
            this.frameY = 0;
            this.frames = 8;
            this.img.src = "enemy-hit.png";
            this.hp -= player.dmg; // compute damage dealt      
        }
    }

    
    
    dead(){
        if(!this.isDead){
            this.frameY = 0;
            this.frames = 15;   
            this.img.src = "enemy-dead.png";
            this.isDead = true;    
        }
    }

    drawHpBar(){
        
        if( this.hp/10 > 65){
            c.fillStyle = "green";          
        }else if(this.hp/10 > 30){
            c.fillStyle = "yellow";
        }else{
            c.fillStyle = "red";
        }

        c.fillRect(510, 150, this.hp/10, 5);
        c.closePath();

        c.beginPath(); // outline
        c.rect(510, 150, 101, 6);//thickenning the outline
        c.rect(510, 150, 101, 6);
        c.rect(510, 150, 101, 6);
        c.stroke();
        // c.closePath();
        
    }
    drawPass(){
        
        if(!this.isDead && !player.isDead){
            c.font = "30px charybdis";
            c.fillStyle = "white";
            c.fillText("PASS!", canvas.width - 110, 150);
            c.strokeText("PASS!", canvas.width - 110, 150);
            c.strokeText("PASS!", canvas.width - 110, 150);
            
            c.closePath();
        }
  
    }

    drawEnergyBar(){
        
        
        c.fillStyle = "white";
        c.fillRect(510, 160, this.energy*10, 5);
        c.closePath();

        c.beginPath(); // outline
        c.rect(510, 160, 101, 6);//thickenning the outline
        c.rect(510, 160, 101, 6);
        c.rect(510, 160, 101, 6);
        c.stroke();        
    }
    drawTurn(){
        if(!this.isDead && !player.isDead){
            c.font = "30px charybdis";
            c.fillStyle = "white";
            c.fillText("My Turn...", canvas.width - 110, 150);
            c.strokeText("My Turn...", canvas.width - 110, 150);
            c.strokeText("PMy Turn...", canvas.width - 110, 150);
            
            c.closePath();
        }
    }
    turn(){
        //random move
       
        move = Math.floor(Math.random() *3 + 1);

        let temp = Math.floor(Math.random() *100); 

        
        if(move != 1 && temp > 65){ //slighty increase frequency of attacking
            move = 1;
            this.attack();
        }
        if(this.energy == 10){ //skill if full energy
            move = 2;
        }

        

        if(move == 1 && this.energy >= 1){
           
            this.attack();
            
            
        }
        else if(move == 2 && this.energy >= 10){ // pass if not enough energy
            this.skill();
        }
        else if(move == 3 && this.energy >= 5){ // pass if not enough energy
            this.shield();
        }else{
            this.pass();
        }

        // console.log("move: ", move); 
        
      
         
        
    }

    update(){
        
        if(player.isAttack && player.frameY == 20){ // hit when player use attacks
            
            this.takeHit();
            
        }
        if(player.isDrink && player.frameY > 16){ // hit when player use drink
            
            this.takeHit(); 
        }
        if(player.isSkill && player.frameY > 20 && player.frameY < 27){ // hit when player use skill
          
            this.takeHit();
        }

        

        if(frameCount == maxTime*8-5 || (player.isEndTurn && player.frameY == player.frames-1 && !player.isDead)){ //make ai choose a move after player's turn
            
            this.turn();
            if(move == 3){
                player.dmg -= 25;
            }
            frameCount+=1;
           
        }
        
        if(this.isPass){ //if pass or time is up, drawpass
            this.drawPass();
        }


        if(this.energy > 10){ // energy limiter
            this.energy = 10;
        }
        

        
        
        if(this.hp <= 0){ // if no hp, death animation and set isDead to true
            this.hp = 0;
            this.dead(); 
            this.isDead = true;
        }

        if(this.frameY == this.frames-1 && !this.isDead){ // if reached max frames reset to frame0 and idle--
            //reset
            this.frames = 6;
            this.frameY = 0;
            this.img.src = "enemy-idle.png";   

            this.isAttack = false;
            this.isEndTurn = false;
            this.isShield = false;
            this.isSkill = false;
            this.isPass = false;

            this.dmg = this.inDmg;
         
        }

        else{// if not reached max frames, proceed to next frame --
            if(this.isDead && this.frameY == this.frames-1){ // if dead and frameY = last frame, stop animating
                this.frameY=this.frames-1;
            }else{ // else animate
                this.frameY+=1;
                
            } 
        }
        
        
    }

    draw(){
        
        this.update();
        // console.log(this.isPass)
        this.drawHpBar();
        this.drawEnergyBar();
        c.drawImage(this.img, this.frameY*this.width, this.frameX*this.height, 
            this.width, this.height,  this.xPos,  this.yPos, this.width*this.scale, this.height*this.scale);
        
    }

}



// --- sprites declaration --- //

// -- player Declaration --
const playerImg = new Image();
playerImg.src = "player-idle.png";
// playerImg.src = "player-idle.png";
var player;

// -- Enemy Declaration --
const enemyImg = new Image();
enemyImg.src = "enemy-idle.png";
var enemy;




//--- background --- //
const backgroundImg = new Image();
backgroundImg.src = "background.png";

//--title screen
let titleNum = 1;
const titleScreen = new Image();
var title = new Sprites(titleScreen, 640, 300, 0, 0, 0, 0, 20, 1);

//--- cat1 
const cat1img = new Image();
cat1img.src = "cat1.png";
var cat1 = new Sprites(cat1img, 100, 50, 0, 0, 175, 250, 73, 1);

//--- cat2
const cat2img = new Image();
cat2img.src = "cat4.png";  
var cat2 = new Sprites(cat2img, 640, 300, 0, 0, 0, 0, 40, 1);

//--- bird
const birdimg = new Image();
birdimg.src = "bird2.png";
var bird = new Sprites(birdimg, 640, 300, 0, 0, 0, 0, 15, 1);



// --- Main Menu --- //
var isPlaying = false;
function start(){
    
    player = new Player(
        //  img       w    h      xF yF   xPos  Ypos   F scale   hp    dmg   energy
            playerImg, 640, 300,  0, 0,   0,    5,     8, 1,    1000,   50,    2
        );

    enemy = new Enemy(
        //  img       w    h   xF yF       xPos     Ypos        F  scale  hp    dmg  energy
            enemyImg, 640, 300, 0, 0,       0,       5,         8,   1,   1000, 50, 2
        );

    maxTime = 10;
    time = maxTime;
    isPlaying = true;
    document.getElementById('startBtn').style.visibility = 'hidden';
    document.getElementById('changeBG').style.visibility = 'hidden';
    document.getElementById('howTP').style.visibility = 'hidden';
    document.getElementById('shop').style.visibility = 'hidden';

    document.getElementById('attack').style.visibility = 'visible';
    document.getElementById('pass').style.visibility = 'visible';
    document.getElementById('drink').style.visibility = 'visible';
    document.getElementById('skill').style.visibility = 'visible';
    document.getElementById('details').style.visibility = 'visible';
    document.getElementById('surrender').style.visibility = 'visible';
}

function main_menu(){
    isPlaying = false;
    document.getElementById('startBtn').style.visibility = 'visible';
    document.getElementById('changeBG').style.visibility = 'visible';
    document.getElementById('howTP').style.visibility = 'visible';
    document.getElementById('shop').style.visibility = 'visible';

    document.getElementById('main-menu').style.visibility = 'hidden';
    document.getElementById('attack').style.visibility = 'hidden';
    document.getElementById('pass').style.visibility = 'hidden';
    document.getElementById('drink').style.visibility = 'hidden';
    document.getElementById('skill').style.visibility = 'hidden';
    document.getElementById('details').style.visibility = 'hidden';
    document.getElementById('surrender').style.visibility = 'hidden';
    
}

function howToPlay(){
    document.getElementById('startBtn').style.visibility = 'hidden';
    document.getElementById('changeBG').style.visibility = 'hidden';
    document.getElementById('howTP').style.visibility = 'hidden';
    document.getElementById('howTP-container').style.visibility = 'visible';  
    document.getElementById('back').style.visibility = 'visible';

}

function back(){
    document.getElementById('startBtn').style.visibility = 'visible';
    document.getElementById('changeBG').style.visibility = 'visible';
    document.getElementById('howTP').style.visibility = 'visible';
    
    document.getElementById('howTP-container').style.visibility = 'hidden';  
    document.getElementById('back').style.visibility = 'hidden';

}

function surrender(){
    isPlaying = false;
    document.getElementById('startBtn').style.visibility = 'visible';
    document.getElementById('changeBG').style.visibility = 'visible';
    document.getElementById('howTP').style.visibility = 'visible';
    document.getElementById('shop').style.visibility = 'visible';

    document.getElementById('main-menu').style.visibility = 'hidden';
    document.getElementById('attack').style.visibility = 'hidden';
    document.getElementById('pass').style.visibility = 'hidden';
    document.getElementById('drink').style.visibility = 'hidden';
    document.getElementById('skill').style.visibility = 'hidden';
    document.getElementById('details').style.visibility = 'hidden';
    document.getElementById('surrender').style.visibility = 'hidden';
    
}







// --- frame management --- //
var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
   
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;

   
    gameLoop();
    
    
}




var move=0;
var frameCount=0;
var maxTime;
var time; 


// --- game loop --- //
function gameLoop(){

    window.requestAnimationFrame(gameLoop);

    now = Date.now();
    elapsed = now - then;

    

    if (elapsed > fpsInterval && isPlaying) { //draw game if play is clicked
        then = now - (elapsed % fpsInterval);

        c.clearRect(0, 0, canvas.width, canvas.height);
        
        c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        c.strokeStyle = "black";
        
        //draw sprites
        cat1.draw();
        cat2.draw();
        bird.draw();


        player.draw();
       

        
      
       
        // --- enemy ai and timer
        //if player's turn is done or time = 0
        if((frameCount == maxTime*8) || (player.isEndTurn && player.frameY == player.frames-1) || (enemy.isEndTurn && enemy.frameY == enemy.frames-1)){// 8fps = 1 second (30 secs = 240 frames)
            enemy.draw();
          
            // add 1 energy each turn
            
            enemy.energy++; 
            player.energy++;
                       

            
            //reset time
            frameCount = 0;
            time = maxTime; 
           
        }

        else{
            if(player.isEndTurn && player.frameY < player.frames-1 || (enemy.isEndTurn && enemy.frameY < enemy.frames-1)){
                frameCount = frameCount;
            } else{
                frameCount+=1;
                if(frameCount % 8 == 0){
                    time--;
                }
            }

            

            enemy.draw();
        }
       

        
     

        // --- print time
        if(!player.isDead && !enemy.isDead){
            c.font = "70px charybdis";
            c.fillStyle = "#ebc5ba";
            c.fillText(time, (canvas.width/2)-15, 50);
            c.strokeStyle = "#93081e";
            c.strokeText(time, (canvas.width/2)-15, 50);
            c.strokeText(time, (canvas.width/2)-15, 50);
            c.strokeText(time, (canvas.width/2)-15, 50);
            c.closePath();
        }
       
        // //print HP
        // c.font = "30px Comic Sans MS";
        // c.fillStyle = "red";
        // c.fillText("HP: " + player.hp, 10, 50);
        // c.font = "30px Comic Sans MS";
        // c.fillText("HP: " + enemy.hp, canvas.width -130, 50);
        
        // --- print result
        if(enemy.hp == 0){
            c.beginPath();
            c.font = "50px charybdis";
            c.fillStyle = "#8256f1";
            c.fillText("VICTORY!", (canvas.width/2)-80, 50);
            c.strokeText("VICTORY!", (canvas.width/2)-80, 50);
            c.strokeText("VICTORY!", (canvas.width/2)-80, 50);
            c.strokeText("VICTORY!", (canvas.width/2)-80, 50);
            c.closePath();
            document.getElementById('main-menu').style.visibility = 'visible';
        }else if(player.hp == 0){
            c.beginPath();
            c.font = "50px charybdis";
            c.fillStyle = "#f15658";
            c.fillText("DEFEAT!", (canvas.width/2)-70, 50);
            c.strokeText("DEFEAT!", (canvas.width/2)-70, 50);
            c.strokeText("DEFEAT!", (canvas.width/2)-70, 50);
            c.strokeText("DEFEAT!", (canvas.width/2)-70, 50);
            c.closePath();
            document.getElementById('main-menu').style.visibility = 'visible';
        }

        

        
    }
    else if(elapsed > fpsInterval && !isPlaying){
        c.clearRect(0, 0, canvas.width, canvas.height);

        //--titlescreen
        if(titleNum>3 || titleNum <=0){
            titleNum=1;
        }
        switch(titleNum){
            case 1:
                title.frames = 20;
                titleScreen.src = "title-screen.png";
                break;
            case 2:
                title.frames = 41;
                titleScreen.src = "title-screen2.png";
                break;
            case 3:
                title.frames = 40;
                titleScreen.src = "title-screen3.png";
                break;
            default:
                title.frames = 20;
                titleScreen.src = "title-screen.png";
                break;
        }        
        title.draw();
        //--print credits
        c.font = "25px charybdis";
        c.fillStyle = "black";
        c.fillText("Developed by: Dave Jamil D. Siarez     Artist: Bofer Duran", 0, canvas.height-5);
        
    }
    
}

// --- frame counter ---
startAnimating(8);








