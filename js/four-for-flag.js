const SCR_WIDTH = 640;
const SCR_HEIGHT = 640;
const FPS = 1000/100;
const TILE_SIZE = 16;
const GRID = true;

class Player {
  constructor(spr,x,y){
    this.spr = spr;
    this.x = x;
    this.y = y;
    this.input = new Array();
    this.input.push("idle");
    this.state = this.input.at(-1);
    this.left = 0;
    this.collisions = [false,false,false,false];
  }

  draw(ctx){
    ctx.drawImage(this.spr,this.x,this.y);
  }

  checkCollision(walls){
    if(!this.x){
      this.collisions[0]=true;
    }else if(walls[(this.x/TILE_SIZE)-1][(this.y/TILE_SIZE)]!="none"){
      this.collisions[0]=true;
    }else{
      this.collisions[0]=false;
    }
    if(this.x==(640-16)){
      this.collisions[1]=true;
    }else if(walls[(this.x/TILE_SIZE)+1][(this.y/TILE_SIZE)]!="none"){
      this.collisions[1]=true;
    }else{
      this.collisions[1]=false;
    }
    if(walls[(this.x/TILE_SIZE)][(this.y/TILE_SIZE)-1]!="none"){
      this.collisions[2]=true;
    }else{
      this.collisions[2]=false;
    }
    if(walls[(this.x/TILE_SIZE)][(this.y/TILE_SIZE)+1]!="none"){
      this.collisions[3]=true;
    }else{
      this.collisions[3]=false;
    }
  }

  update(ctx, walls){
    if(!this.left){
      this.state = this.input.at(-1);
      if(this.input != "idle"){
        this.left = 16;
	this.checkCollision(walls);
      }
    }
    if(this.left){
      switch(this.state){
	case "left": 
	  if(!this.collisions[0]){
	    this.x--;
	  }else{
	    this.left=1;
	  }
	  break;
	case "right": 
	  if(!this.collisions[1]){
	    this.x++;
	  }else{
	    this.left=1;
	  }
	  break;
	case "up": 
	  if(!this.collisions[2]){
	    this.y--;
	  }else{
	    this.left=1;
	  }
	  break;
	case "down": 
	  if(!this.collisions[3]){
	    this.y++;
	  }else{
	    this.left=1;
	  }
	  break;
      }
      this.left--;
    }
    this.draw(ctx);
  }
}

class Wall {
  constructor(spr,x,y){
    this.spr = spr;
    this.x = x;
    this.y = y;
  }

  draw(ctx){
    ctx.drawImage(this.spr,this.x*TILE_SIZE,this.y*TILE_SIZE);
  }
}

async function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hKeyDown(objPlayers, e){
  var code = e.keyCode;
  //console.log(code);
  if(!e.repeat){
    switch(code){
      case 65:
	if(objPlayers.p1.input.at(-1)!="left") objPlayers.p1.input.push("left");
	break;
      case 68:
	if(objPlayers.p1.input.at(-1)!="right") objPlayers.p1.input.push("right");
	break;
      case 87:
	if(objPlayers.p1.input.at(-1)!="up") objPlayers.p1.input.push("up");
	break;
      case 83:
	if(objPlayers.p1.input.at(-1)!="down") objPlayers.p1.input.push("down"); 
	break;
    }
  }
  //console.log(objPlayers.p1.input);
  e.preventDefault()
}

function hKeyUp(objPlayers, e){
  var code = e.keyCode;
  switch(code){
    case 65:
      objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("left"),1);
      break;
    case 68:
      objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("right"),1);
      break;
    case 87:
      objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("up"),1);
      break;
    case 83:
      objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("down"),1);
      break;
  }
  //console.log(objPlayers.p1.input);
  e.preventDefault();
}

function drawGrid(ctx){
  ctx.fillStyle = "black";
  for(let i = 16; i < SCR_WIDTH; i += 16){
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i,SCR_HEIGHT);
    ctx.stroke();
  }
  for(let i=16;i<SCR_HEIGHT;i+=16){
    ctx.beginPath();
    ctx.moveTo(0,i);
    ctx.lineTo(SCR_HEIGHT,i);
    ctx.stroke();
  }
}

async function combat(ctx, backColor, p1, walls){
  ctx.fillStyle = backColor;
  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
  if (GRID) await drawGrid(ctx);
  //cube1.draw(ctx);
  for(let i=0;i<(SCR_WIDTH/TILE_SIZE);i++){
    for(let j=0;j<(SCR_HEIGHT/TILE_SIZE);j++){
      if(walls[i][j]!="none"){
	//console.log(i,j);
	walls[i][j].draw(ctx);
      }
    }
  }

  p1.update(ctx,walls);

  await sleep(FPS);
  await combat(ctx, backColor, p1, walls);
}

async function main(){
  const canvas = document.getElementById('game');
  const path = "img/four-for-flag/";
  const ctx = canvas.getContext('2d');
  
  var backColor = "white";
  
  const objWalls = Array.from({length:(SCR_WIDTH/TILE_SIZE)}, () => new Array((SCR_HEIGHT/TILE_SIZE)).fill("none"));
  const imgCube = new Image();
  const imgWall = new Image();
  imgCube.src = path + "CubeBeta.png";
  imgWall.src = path + "WallBeta.png";
  await imgCube.decode();
  await imgWall.decode();
  
  const objPlayers = {p1: "none"};
  
  document.removeEventListener("keydown", preventKeyboardScroll, false);
  window.addEventListener("keydown", (e) => hKeyDown(objPlayers, e), false);
  window.addEventListener("keyup", (e) => hKeyUp(objPlayers, e), false);



  while(true){
    player1 = new Player(imgCube, 64, 64);
    cube1 = new Wall(imgWall, 1, 1);
    cube2 = new Wall(imgWall, 1, 2);
    cube3 = new Wall(imgWall, 1, 3);
    cube4 = new Wall(imgWall, 1, 4);
    cube5 = new Wall(imgWall, 2, 1);
    cube6 = new Wall(imgWall, 3, 1);
    cube7 = new Wall(imgWall, 4, 1);
    cube8 = new Wall(imgWall, 5, 5);
    cube9 = new Wall(imgWall, 5, 6);
    cube10 = new Wall(imgWall, 6, 5);
    cube11 = new Wall(imgWall, 6, 6);
    
    objWalls[cube1.x][cube1.y] = cube1;
    objWalls[cube2.x][cube2.y] = cube2;
    objWalls[cube3.x][cube3.y] = cube3;
    objWalls[cube4.x][cube4.y] = cube4;
    objWalls[cube5.x][cube5.y] = cube5;
    objWalls[cube6.x][cube6.y] = cube6;
    objWalls[cube7.x][cube7.y] = cube7;
    objWalls[cube8.x][cube8.y] = cube8;
    objWalls[cube9.x][cube9.y] = cube9;
    objWalls[cube10.x][cube10.y] = cube10;
    objWalls[cube11.x][cube11.y] = cube11;

    objPlayers.p1 = player1;
    await combat(ctx, backColor, player1, objWalls);
  }
}

main();
