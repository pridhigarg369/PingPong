const canva = document.getElementById("canva");
const draw = canva.getContext("2d");
let text = document.querySelector("p");
//Music
const hitSound = new Audio("./music/hitSound.wav");
const scoreSound = new Audio("./music/scoreSound.wav");
const wallHitSound = new Audio("./music/wallHitSound.wav");

/* objects */
const sep = {
  x: canva.width / 2 - 2,
  y: 0,
  height: 10,
  width: 2,
  color: "white",
};
const user = {
  x: 10,
  y: (canva.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "white",
};
const cpu = {
  x: canva.width - 20,
  y: (canva.height - 100) / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};
const ball = {
  x: canva.width / 2,
  y: canva.height / 2,
  radius: 9,
  velx: 5,
  vely: 5,
  speed: 7,
  color: "orange",
};

// Functions
function drawSeparator() {
  for (let i = 0; i < canva.height; i += 20) {
    drawRectangle(sep.x, sep.y + i, sep.width, sep.height, sep.color);
  }
}
function drawScore(text, x, y) {
  draw.fillStyle = "white";
  draw.font = "60px arial";
  draw.fillText(text, x, y);
}

function drawRectangle(x, y, w, h, color) {
  draw.fillStyle = color;
  draw.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
  draw.fillStyle = color;
  draw.beginPath();
  draw.arc(x, y, r, 0, Math.PI * 2, true);
  draw.closePath();
  draw.fill();
}

// Functionalities
canva.addEventListener("mousemove", getMousePos);
function getMousePos(evt) {
  let rect = canva.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height / 2;
}
function restart() {
  ball.x = canva.width / 2;
  ball.y = canva.width / 2;
  ball.speed = 7;
  ball.velx = -ball.velx;
  ball.vely = -ball.vely;
}
function detect_collision(ball, player) {
  player.top = player.y;
  player.bottom = player.height + player.y;
  player.left = player.x;
  player.right = player.x + player.width;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return (
    ball.left < player.right &&
    ball.top < player.bottom &&
    ball.right > player.left &&
    ball.bottom > player.top
  );
}
// function cpu_movement() {
//   // if (cpu.y < ball.y) {
//   //   cpu.y += 5;
//   // } else {
//   //   cpu.y -= 5;
//   // }

// }
function updates() {
  if (ball.y + ball.radius >= canva.height || ball.y - ball.radius <= 0) {
    // play wallHitSound
    wallHitSound.play();
    ball.vely = -ball.vely;
  }

  // if ball hit on left wall
  if (ball.x - ball.radius <= 0) {
    // play scoreSound
    scoreSound.play();
    // then ai scored 1 point
    cpu.score += 1;
    restart();
  }
  // if ball hit on right wall
  if (ball.x + ball.radius >= canva.width) {
    // play scoreSound
    scoreSound.play();
    // then user scored 1 point
    user.score += 1;
    restart();
  }

  // move the ball
  ball.x += ball.velx;
  ball.y += ball.vely;

  // ai paddle movement
  cpu.y += (ball.y - (cpu.y + cpu.height / 2)) * 0.09;

  // collision detection on paddles
  let player = ball.x < canva.width / 2 ? user : cpu;

  if (detect_collision(ball, player)) {
    // play hitSound
    hitSound.play();
    // default angle is 0deg in Radian
    let angle = 0;

    // if ball hit the top of paddle
    if (ball.y < player.y + player.height / 2) {
      // then -1 * Math.PI / 4 = -45deg
      angle = (-1 * Math.PI) / 4;
    } else if (ball.y > player.y + player.height / 2) {
      // if it hit the bottom of paddle
      // then angle will be Math.PI / 4 = 45deg
      angle = Math.PI / 4;
    }

    /* change velocity of ball according to on which paddle the ball hitted */
    ball.velx = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.vely = ball.speed * Math.sin(angle);

    // increase ball speed
    ball.speed += 0.2;
  }
}

function render() {
  drawRectangle(0, 0, canva.width, canva.height, "rgb(222, 197, 243) ");
  drawScore(user.score, canva.width / 4, canva.height / 6);
  drawScore(cpu.score, (3 * canva.width) / 4, canva.height / 6);
  drawSeparator();
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  console.log("abs");
}

function winner() {
  if (cpu.score == 5) {
    text.innerHTML = "Sad! You Lost. Try Playing another Game";
  } else {
    text.innerHTML = "HURRAY! We Won , Let's Play another Game ";
  }
  exit();
}
function game() {
  updates();
  render();
  if (cpu.score == 5 || user.score == 5) {
    winner();
  }
}
let x = false;
let looper;
function start() {
  if (!x) {
    looper = setInterval(game, 1000 / 60);
  } else {
    clearInterval(looper);
  }
  x = !x;
  text.innerHTML = "Score 5 to win the Game";
}
function exit() {
  user.score = 0;
  cpu.score = 0;
  cpu.x = canva.width - 20;
  cpu.y = (canva.height - 100) / 2;
  ball.x = canva.width / 2;
  ball.y = canva.height / 2;
  user.x = 10;
  user.y = (canva.height - 100) / 2;
  clearInterval(looper);
  x = false;
  render();
  restart();
}
