var Game, game,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

var color = '#FFF'
var moosic = new Audio('music.mp3');
var ding = new Audio('ding.mp3')

function invertColor(hex) {
  if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
  }
  if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
  }
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

Game = (function(_super) {

  __extends(Game, _super);

  function Game(h, w, ps) {
    var canvas_container;
    Game.__super__.constructor.apply(this, arguments);
    atom.input.bind(atom.key.LEFT_ARROW, 'move_left');
    atom.input.bind(atom.key.RIGHT_ARROW, 'move_right');
    atom.input.bind(atom.key.UP_ARROW, 'move_up');
    atom.input.bind(atom.key.DOWN_ARROW, 'move_down');
    atom.input.bind(atom.key.SPACE, 'toggle_pause');
    this.height = h;
    this.width = w;
    this.pixelsize = ps;
    window.onresize = function(e) {};
    canvas_container = document.getElementById('canvas_container');
    canvas_container.style.width = this.width * this.pixelsize + "px";
    atom.canvas.style.border = `${color} 1px solid`;
    atom.canvas.style.position = "relative";
    atom.canvas.height = this.height * this.pixelsize;
    atom.canvas.width = this.width * this.pixelsize;
    this.startGame();
  }

  Game.prototype.startGame = function() {
    var _ref, _x, _y;
    _x = Math.floor(this.width / 2);
    _y = Math.floor(this.height / 2);
    this.snake = [[_x, _y], [--_x, _y], [--_x, _y], [--_x, _y]];
    this.dir = "";
    this.newdir = "right";
    this.score = 0;
    this.gstarted = true;
    this.gpaused = false;
    this.food = [];
    this.last_dt = 0.00;
    this.delay = 0.08;
    this.noshow = true;
    this.gpaused = true;
    this.modest = true;
    this.music = confirm('music?')
    this.changeScore = () => {
      var pass = prompt("Please enter the password", "Youareanidiot")
      if(pass === "694200249669420"){
        var amount = prompt("Please enter the amount", 1)
        if(/^\d+$/.test(amount) && this.score + parseInt(amount, 10) < 1000){
        this.score += parseInt(amount, 10)
        } else if(this.score + parseInt(amount, 10) >= 1000){
          this.modest = false
          this.endGame();
        }
        else {
          alert('ALERT ALERT SWITZERLAND IS GOING TO BERN A NUUK')
        }
      } else {
        alert('why u so bad at guessing password')
      }
    }
    _ref = [this.width * this.pixelsize, this.height * this.pixelsize], this.tx = _ref[0], this.ty = _ref[1];
    this.genFood();
    return this.showIntro();
  };

  Game.prototype.genFood = function() {
  if(this.music){moosic.play()}
    ding.play()
    var x, y;
    x = void 0;
    y = void 0;
    while (true) {
      x = Math.floor(Math.random() * (this.width - 1));
      y = Math.floor(Math.random() * (this.height - 1));
      if (!this.testCollision(x, y)) break;
    }
    // black, white, blue, green, yellow, orange, red, purple, brown   
    // 0, 5, 10, 20, 30, 40, 50, 75, 100
    if(this.score === 0){
      color = "#FFF";
    } 
    if(this.score >= 5 && this.score < 10 && color !== "#000" && color !== "#000"){
      this.togglePause(true, "This is the alpha stage. Most players go past this boundary. You should too.")
      alert('press ctrl+shift+i (windows) or cmd+opt+i (mac)')
      color = "#000"
    }
    if(this.score >= 10 && this.score < 20 && color !== "#007aff"){
      this.togglePause(true, "Well done. Even though you may be colour-blind now, don't give up. You still have a long way to go.")
      color = "#007aff";
    }
    if(this.score >= 20 && this.score < 30 && color !== "#378805"){
      this.togglePause(true, `Look, now the snake is green. Try to get past this level. Even though it is easy, you still have ${100 - this.score} points to go before being god mode.`)
      color = "#378805";
    }
    if(this.score >= 30 && this.score < 40 && color !== "#FFFF00"){
      this.togglePause(true, `The Ikea level! This is scarier than the music. According to a poll, only 6% of Swedish people don't have Ikea furniture so deal with it. `)

      color = "#FFFF00";
    }
    if(this.score >= 40 && this.score < 50 && color !== "#FF5F00"){
      this.togglePause(true, `Phew. It's done. You only have ${100-this.score} to go. Nice. `)

      color = "#FF5F00";
    }
    if(this.score >= 50 && this.score < 75 && color !== "#FF0000"){
      this.togglePause(true, `u HaCKeR???? Ur literally advanced now. Only have ${100-this.score} to go!`)

      color = "#FF0000";
    }
    if(this.score >= 75 && this.score < 100 && color !== "#CC8899"){
      this.togglePause(true, `I hope you are not colour-blind now. Ur Pro now. Almost God!`)

      color = "#CC8899";
    }
    if(this.score >= 100 && color !== "#C38452"){
      this.togglePause(true, `Look at you! you are a god now! You now have bragging rights and please recommend this game to others.`)

      color = "#C38452";
    }
   
    console.log(this.score)
    return this.food = [x, y];
  };

  Game.prototype.drawFood = function() {
    atom.context.beginPath();
    atom.context.arc((this.food[0] * this.pixelsize) + this.pixelsize/2, (this.food[1] * this.pixelsize) + this.pixelsize / 2, this.pixelsize / 2, 0, Math.PI * 2, false);
    return atom.context.fill();
  };

  Game.prototype.drawSnake = function() {
    var i, l, x, y, _results;
    i = 0;
    l = this.snake.length;
    _results = [];
    while (i < l) {
      x = this.snake[i][0];
      y = this.snake[i][1];
      atom.context.fillRect(x * this.pixelsize, y * this.pixelsize, this.pixelsize, this.pixelsize);
      _results.push(i++);
    }
    return _results;
  };

  Game.prototype.testCollision = function(x, y) {
    var i, l;
    if (x < 0 || x > this.width - 1) return true;
    if (y < 0 || y > this.height - 1) return true;
    i = 0;
    l = this.snake.length;
    while (i < l) {
      if (x === this.snake[i][0] && y === this.snake[i][1]) return true;
      i++;
    }
    return false;
  };

  Game.prototype.endGame = function() {
    color = "#FFF"
    var mess, x, y, _ref, _ref2;
    this.gstarted = false;
    this.noshow = true;
    atom.context.fillStyle = invertColor(color);
    atom.context.strokeStyle = color;
    var messages = ["EMOTIOnAl dAMage", "leaf", "sonic slipper", "being a disappointment", "getting A- in math", "being bsian", "falling off a bed", "falling off a ladder", "eating rice too soft", "eating rice too dry", "sleeping", "death", "losing social credit", "being rickrolled", "eating with a knife", "being impaled by a pig", "overhydration", "eating durian", "meeting Ling Ling","drowning in a bathtub", "seeing pink", "gaming", "being shot by the FBI", "joining FBI", "being too lucky", "being too unlucky", "swearing"]
    // var messages = ["情感伤害","叶子","声波拖鞋","数学得A-","从床上掉下来","从梯子上掉下来","吃米饭太软","吃米饭太干","睡觉","死亡","失去社会信用","被骗","用刀吃饭","被猪刺穿","水分过多", "吃榴莲","遇见外星人","淹在浴缸里","看到粉红色","打游戏","被FBI枪杀","加入FBI","太幸运","太倒霉"]

    _ref = [`Died from ${messages[Math.floor(Math.random()*(messages.length))]}`, this.tx / 2, this.ty / 2.4], mess = _ref[0], x = _ref[1], y = _ref[2];
    atom.context.font = "bold 30px monospace";
    atom.context.textAlign = "center";
    atom.context.fillText(mess, x, y);
    atom.context.strokeText(mess, x, y);
    atom.context.font = "bold 25px monospace";
    _ref2 = ["Score: " + this.score, this.tx / 2, this.ty / 1.7], mess = _ref2[0], x = _ref2[1], y = _ref2[2];
    console.log(`ha ha yoo ongly did ${this.score}. trai agen next time`)
    atom.context.fillText(mess, x, y);
    return atom.context.strokeText(mess, x, y);
  };

  Game.prototype.togglePause = function(alert, message) {
    var mess, x, y, _ref;
    if (!this.gpaused) {
      var random = Math.ceil(Math.random() * 2)
      if(random === 1 && !alert){
      this.changeScore()
      if( this.modest === false){
        return; 
      }
      } else {
        console.log(message)
      }
      this.noshow = true;
      this.gpaused = true;
      _ref = [`Why u pause? U ongly haf ${this.score}. FAILIAH`, this.tx / 2, this.ty / 2], mess = _ref[0], x = _ref[1], y = _ref[2];
      atom.context.fillStyle = color;
      atom.context.font = "italic 28px monospace";
      atom.context.textAlign = "center";
      atom.context.fillText(mess, x, y);
      return atom.context.strokeText(mess, x, y);
    } else {
      this.gpaused = false;
      return this.noshow = false;
    }
  };

  Game.prototype.showIntro = function() {
    color = '#FFF'
    atom.context.fillStyle = color;
    atom.context.font = "30px sans-serif";
    atom.context.textAlign = "center";
    atom.context.textAlign = "left";
    atom.context.font = "36px monospace";
    atom.context.fillText("If Asian was a Difficulty:", 1.5 * this.pixelsize, this.ty / 3.7);
    atom.context.font = "30px monospace";
    atom.context.fillText("Instructions:", 1.5 * this.pixelsize, this.ty / 2.7);
    atom.context.font = "18px monospace";
    atom.context.fillText("Use arrow keys to change direction.", 1.5 * this.pixelsize, this.ty / 2);
    atom.context.fillText("Press space to start/pause.", 1.5 * this.pixelsize, this.ty / 1.8);
    console.clear()
    console.log("Hallo failiah. You have reech boss levul. Try to beet my recod of 153962")
    return atom.context.fillText("Press space now. Do it now comrade.", 1.5 * this.pixelsize, this.ty / 1.4);
  };

  Game.prototype.update = function(dt) {
    var x, y;
    if (atom.input.pressed('move_left')) {
      if (this.dir !== "right") this.newdir = "left";
    } else if (atom.input.pressed('move_up')) {
      if (this.dir !== "down") this.newdir = "up";
    } else if (atom.input.pressed('move_right')) {
      if (this.dir !== "left") this.newdir = "right";
    } else if (atom.input.pressed('move_down')) {
      if (this.dir !== "up") this.newdir = "down";
    } else if (atom.input.pressed('toggle_pause')) {
      if (!this.gstarted) {
        this.eraseCanvas();
        this.startGame();
      } else {
        this.togglePause();
      }
    }
    if (this.last_dt < this.delay) {
      this.last_dt += dt;
      return;
    } else {
      this.last_dt = 0.00;
    }
    if (!this.gstarted || this.gpaused) return;
    x = this.snake[0][0];
    y = this.snake[0][1];
    switch (this.newdir) {
      case "up":
        y--;
        break;
      case "right":
        x++;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
    }
    if (this.testCollision(x, y)) {
      this.endGame();
      return;
    }
    this.snake.unshift([x, y]);
    if (x === this.food[0] && y === this.food[1]) {
      this.score++;
      this.genFood();
    } else {
      this.snake.pop();
    }
    return this.dir = this.newdir;
  };

  Game.prototype.eraseCanvas = function() {
    atom.context.fillStyle = invertColor(color);
    atom.context.fillRect(0, 0, this.width * this.pixelsize, this.height * this.pixelsize);
    return atom.context.fillStyle = color;
  };

  Game.prototype.draw = function() {
    if (!this.noshow) {
      this.eraseCanvas();
      this.drawFood();
      return this.drawSnake();
    }
  };

  return Game;

})(atom.Game);

game = new Game(15, 20, 30);

game.run();