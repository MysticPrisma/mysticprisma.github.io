const SCR_WIDTH = 640;
const SCR_HEIGHT = 640;
const FPS = 1000/200;
const TILE_SIZE = 16;
const GRID = false;

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
  constructor(spr, x, y, inum){
    this.spr = spr;
    this.x = x;
    this.y = y;
		this.inum;
		this.sx = (inum % 5);
		this.sy = Math.floor(inum/5);
		console.log(this.sx);
		console.log(this.sy);
  }

  draw(ctx){
    //ctx.drawImage(this.spr, this.x*TILE_SIZE, this.y*TILE_SIZE);
		ctx.drawImage(
			this.spr, 
			this.sx*TILE_SIZE, 
			this.sy*TILE_SIZE, 
			TILE_SIZE, 
			TILE_SIZE, 
			this.x*TILE_SIZE, 
			this.y*TILE_SIZE,
			TILE_SIZE,
			TILE_SIZE
		)
  }
}

async function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function hKeyDown(objPlayers, e){
  var code = e.keyCode;
  console.log(code);
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
      case 37:
	if(objPlayers.p2.input.at(-1)!="left") objPlayers.p2.input.push("left");
	break;
      case 39:
	if(objPlayers.p2.input.at(-1)!="right") objPlayers.p2.input.push("right");
	break;
      case 38:
	if(objPlayers.p2.input.at(-1)!="up") objPlayers.p2.input.push("up");
	break;
      case 40:
	if(objPlayers.p2.input.at(-1)!="down") objPlayers.p2.input.push("down"); 
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
      if(objPlayers.p1.input.indexOf("left")!=-1)
	objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("left"),1);
      break;
    case 68:
      if(objPlayers.p1.input.indexOf("right")!=-1)
	objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("right"),1);
      break;
    case 87:
      if(objPlayers.p1.input.indexOf("up")!=-1)
        objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("up"),1);
      break;
    case 83:
      if(objPlayers.p1.input.indexOf("down")!=-1)
        objPlayers.p1.input.splice(objPlayers.p1.input.indexOf("down"),1);
      break;
    case 37:
      if(objPlayers.p2.input.indexOf("left")!=-1)
	objPlayers.p2.input.splice(objPlayers.p2.input.indexOf("left"),1);
      break;
    case 39:
      if(objPlayers.p2.input.indexOf("right")!=-1)
	objPlayers.p2.input.splice(objPlayers.p2.input.indexOf("right"),1);
      break;
    case 38:
      if(objPlayers.p2.input.indexOf("up")!=-1)
        objPlayers.p2.input.splice(objPlayers.p2.input.indexOf("up"),1);
      break;
    case 40:
      if(objPlayers.p2.input.indexOf("down")!=-1)
        objPlayers.p2.input.splice(objPlayers.p2.input.indexOf("down"),1);
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

async function combat(ctx, backColor, players, walls){
  ctx.fillStyle = backColor;
  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
  if (GRID) await drawGrid(ctx);
  //await ctx.drawImage(back, 0, 0);
  //cube1.draw(ctx);
  for(let i=0;i<(SCR_WIDTH/TILE_SIZE);i++){
    for(let j=0;j<(SCR_HEIGHT/TILE_SIZE);j++){
      if(walls[i][j]!="none"){
	//console.log(i,j);
		walls[i][j].draw(ctx);
      }
    }
  }

  players.p1.update(ctx,walls);
  players.p2.update(ctx,walls);

  await sleep(FPS);
  await combat(ctx, backColor, players, walls);
}

async function main(){
  const canvas = document.getElementById('game');
  const path = "img/four-for-flag/";
  const ctx = canvas.getContext('2d');
  
  var backColor = "black";
  
  const objWalls = Array.from({length:(SCR_WIDTH/TILE_SIZE)}, () => new Array((SCR_HEIGHT/TILE_SIZE)).fill("none"));
  const imgCube = new Image();
  const imgCube0 = new Image();
  const imgCube2 = new Image();
  const imgWall = new Image();
  const imgLevel1 = new Image();
  //const imgBack = new Image();
	
  imgCube.src = path + "cubes/blue-cube.png";
  imgCube2.src = path + "cubes/pink-cube.png";
  imgWall.src = path + "walls/cube-white.png";
  imgLevel1.src = path + "walls/level1.png";
  //imgBack.src = path + "imgBack.webp";
  await imgCube.decode();
  //await imgCube0.decode();
  await imgCube2.decode();
  await imgWall.decode();
  await imgLevel1.decode();
  //await imgBack.decode();
  
  const objPlayers = {p1: "none", p2: "none"};
  
  document.removeEventListener("keydown", preventKeyboardScroll, false);
  window.addEventListener("keydown", (e) => hKeyDown(objPlayers, e), false);
  window.addEventListener("keyup", (e) => hKeyUp(objPlayers, e), false);

  while(true){
    for(let i = 0; i < (SCR_WIDTH/TILE_SIZE); i++){
      for(let j = 0; j < (SCR_WIDTH/TILE_SIZE); j++){
	//console.log(levels[0][(i*(SCR_WIDTH/TILE_SIZE))+j]);
		let wall = levels[0][(i*(SCR_WIDTH/TILE_SIZE))+j];
			if(wall != ' '){
				let inum = wall.charCodeAt(0) - 'a'.charCodeAt(0);
				console.log(inum);
				let cube = new Wall(imgLevel1, j, i, inum);
				objWalls[j][i] = cube;
			}
		}
	}

    player1 = new Player(imgCube, 48, 48);
    player2 = new Player(imgCube2, SCR_WIDTH-64, 48);

    objPlayers.p1 = player1;
    objPlayers.p2 = player2;
    await combat(ctx, backColor, objPlayers, objWalls);
  }
}

main();
