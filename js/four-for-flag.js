const SCR_WIDTH = 640;
const SCR_HEIGHT = 640;
const FPS = 1000/100;

class Player {
  constructor(spr,x,y){
    this.spr = spr;
    this.x = x;
    this.y = y;
    this.input = new Array();
    this.input.push("idle");
    this.state = this.input.at(-1);
    this.left = 0;
  }

  draw(ctx){
    ctx.drawImage(this.spr,this.x,this.y);
  }

  update(ctx){
    if(!this.left){
      this.state = this.input.at(-1);
      if(this.input != "idle"){
        this.left = 16;
      }
    }
    if(this.left){
      switch(this.state){
	case "left": this.x--;
	  break;
	case "right": this.x++;
	  break;
	case "up": this.y--;
	  break;
	case "down": this.y++;
	  break;
      }
      this.left--;
    }
    this.draw(ctx);
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

async function combat(ctx, backColor, p1){
  ctx.fillStyle = backColor;
  ctx.fillRect(0, 0, SCR_WIDTH, SCR_HEIGHT);
  await drawGrid(ctx);
  p1.update(ctx);
  
  await sleep(FPS);
  await combat(ctx, backColor, p1);
}

async function main(){
  const canvas = document.getElementById('game');
  const path = "img/four-for-flag/";
  const ctx = canvas.getContext('2d');
  
  var backColor = "white";

  const imgCube = new Image();
  imgCube.src = path + "CubeBeta.png";
  await imgCube.decode();

  const objPlayers = {p1: "none"};
  
  document.removeEventListener("keydown", preventKeyboardScroll, false);
  window.addEventListener("keydown", (e) => hKeyDown(objPlayers, e), false);
  window.addEventListener("keyup", (e) => hKeyUp(objPlayers, e), false);

  while(true){
    player1 = new Player(imgCube, 64, 64);
    objPlayers.p1 = player1;
    await combat(ctx, backColor, player1);
  }
}

main();
