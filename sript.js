window.onload = function(){
    //  variable qui definit la dimension de mon serpent
    var ctx;
    var canvasWidth=900;//taille de l'ere de jeu
    var canvasHeight=600;
    var blocksize = 30;//taille d'un block de mon serpent
    var delay=150;//temps de restoration de mon serpent a une positon donne
    var snakee;//mon serpent
    var applee;
    var widthInBlock= canvasWidth/blocksize;
    var heightInBlock=canvasHeight/blocksize;
    var Score;
    var timeout;
    init();//declaration de la fontion qui lance le jeu

function init(){
    //fontion qui creer le jeu
     var canvas = document.createElement('canvas');//permet de creer l'ere de jeu
   /**structuration de mon air de jeu */
     Score = 0;
    canvas.width = canvasWidth ;
    canvas.height = canvasHeight ;
    canvas.style.border =" 30px  solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);//permet de definir ma var canvas comme unique element du body
    ctx = canvas.getContext('2d');//declare mon air de jeu en 2d(x,y)
    snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");//instanciation de mon serpent
    applee = new Apple([10,10]);
    refreshcanvas();//actualise mon air de jeu a un temps=delay
}
function refreshcanvas(){
        
        snakee.advance();
         if(snakee.checkCollision()){
           gameOver();
        }
        else{
            if(snakee.isEatingApple(applee)){
                snakee.ateApple = true;
                Score++;
                do{
                  applee.setNewPosition();
                
                }while(applee.isOnsnake(snakee))
            }

        ctx.clearRect(0 , 0 , canvasWidth,canvasHeight);
        drawScore();
        snakee.draw();
        applee.draw();
        timeout = setTimeout(refreshcanvas,delay);
         }

}
    function gameOver(){ 
        ctx.save();
        ctx.font = "bold 70px sans-serif ";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5 ;
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight /2
        ctx.strokeText("GAME OVER", centerX, centerY - 180);
        ctx.fillText("GAME OVER", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif ";
        ctx.fillStyle = "#000";
        ctx.strokeText("Appuyer sur tab pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur tab pour rejouer", centerX, centerY - 120);
        ctx.restore();
}
    function restart(){
        
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");//instanciation de mon serpent
        applee = new Apple([10,10]);
        Score = 0;
        clearTimeout(timeout);
        refreshcanvas();
}
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif ";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight /2
        ctx.fillText(Score.toString(), centerX, centerY);
        ctx.restore();
}
    function drawBlock(ctx,position){//dessine un block apres un temps=delay
        var x = position[0] * blocksize;
        var y = position[1] * blocksize;
        ctx.fillRect(x, y, blocksize, blocksize);
    }
    function Snake(body,direction){//fontion constructeur du serpent
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw=function(){   
            ctx.save();
            ctx.fillStyle = "#ff0000";

            for(var i=0; i<this.body.length;i++){  
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();

        };
     this.advance = function(){

       var nextPosition = this.body[0].slice();
       switch(this.direction){
        case "left":
            nextPosition[0] -=1;
            break;
        case "right":
            nextPosition[0] +=1;
            break; 
        case "down":
            nextPosition[1] +=1;
            break;
        case "up":
            nextPosition[1]  -=1;
                break;
        default:
            throw("Invalid Direction");
       }
       this.body.unshift(nextPosition);
       if(!this.ateApple)
       this.body.pop();//suprime le derniers element
      else
        this.ateApple = false;    
    };
    this.setDirection = function(newdirection)
    {
         var allowedDirection;
         switch(this.direction){
            case "left":
            case "right":
                allowedDirection = ["up","down"];
                break;
            case "down":
            case "up":
                 allowedDirection = ["left","right"];
                break;
            default:
                throw("Invalide direction");
         }
         if(allowedDirection.indexOf(newdirection) > -1){
            this.direction = newdirection;
          }
    };
    this.checkCollision = function(){
        var wallCollision = false;
        var SnakeCollision = false;
        var head = this.body[0];
        var res = this.body.slice(1);
        var snakeX = head[0];
        var snakeY = head[1];
        var minX = 0;
        var minY = 0;
        var maxX= widthInBlock - 1;
        var maxY = heightInBlock -1;
        var isnotbetweenHorizontaleWall = snakeX <minX || snakeX > maxX;
        var isnotbetweenVerticaleWall = snakeY < minY || snakeY > maxY;
        if(isnotbetweenHorizontaleWall || isnotbetweenVerticaleWall)
           {
              wallCollision = true;
           }
        for(var i=0;i < res.length; i++){
            if(snakeX == res[i][0] && snakeY == res[i][1])
            {
                SnakeCollision = true;
            }      
        }
         return wallCollision || SnakeCollision;
    };
    this.isEatingApple = function(appleToeat){
        var head = this.body[0];
        if(head[0] === appleToeat.position[0] && head[1] === appleToeat.position[1])
            return true;
        else
            return false;
    };
  }
 function Apple(position){
    this.position=position;
    this.draw = function(){
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
        var radius = blocksize/2;
        var x = this.position[0] * blocksize + radius;
        var y = this.position[1] * blocksize + radius;
        ctx.arc(x, y, radius , 0, Math.PI*2, true);
        ctx.fill();
        ctx.restore();
    };
    this.setNewPosition = function(){
        var newX = Math.round(Math.random() * (widthInBlock - 1));
        var newY = Math.round(Math.random() * (heightInBlock - 1));
        this.position = [newX , newY];
    };
    this.isOnsnake = function(sankeTocheck){
          var isOnSnake = false;
          for(var i =0; i< sankeTocheck.body.length; i++){
            if(this.position[0] === sankeTocheck.body[i] &&
                this.position[1] === sankeTocheck.body[i]){
                    isOnSnake = true;
                }
          }
          return isOnSnake;
    };
 }

document.onkeydown = function handlekeyDown(e){
    var key = e.keyCode;
    var newdirection;
    switch(key){
        case 37:
            newdirection = "left";
            break;
        case 38:
            newdirection = "up";
                break;
        case 39:
             newdirection = "right";
                    break;
        case 40:
             newdirection = "down";
                         break;

        case 32 :
            restart();
            break;
        default:
             return;
    }
    snakee.setDirection(newdirection);
}
}