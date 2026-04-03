// Gachapon Chaos: Simulation of Accumulation
// 点击鼠标 = "扭动开关"，搅动所有的扭蛋

let capsules = [];
let gravity = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 初始生成 50 个扭蛋
  for (let i = 0; i < 50; i++) {
    capsules.push(new Capsule(random(width), random(height/2)));
  }
}

function draw() {
  background(255);
  
  // 机器的容器边界
  noFill();
  stroke(0);
  strokeWeight(5);
  rect(50, 50, width-100, height-100);

  // 渲染每一个扭蛋
  for (let i = 0; i < capsules.length; i++) {
    capsules[i].update();
    capsules[i].display();
    capsules[i].checkEdges();
  }
  
  // 模拟拥挤感：随着数量增加，屏幕变暗
  if (capsules.length > 100) {
      fill(0, 0, 0, map(capsules.length, 100, 300, 0, 100));
      rect(0,0,width,height);
  }
}

function mousePressed() {
  // 交互：每次点击，剧烈搅动现有的扭蛋（模拟机器运作）
  // 并掉落新的扭蛋（模拟消费）
  shakeMachine();
  addCapsule();
}

function shakeMachine() {
  for (let c of capsules) {
    // 给所有球一个向上的随机爆发力
    c.velocity.y = random(-15, -5);
    c.velocity.x = random(-10, 10);
  }
}

function addCapsule() {
  // 增加一个新的胶囊
  capsules.push(new Capsule(width/2, 60));
}

class Capsule {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.r = random(20, 35); // 扭蛋半径
    
    // 你的高饱和度配色方案
    let colors = ['#FF69B4', '#00FFFF', '#7FFF00', '#FFD700', '#FF4500'];
    this.col = random(colors);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
    // 重力
    this.velocity.y += gravity;
    // 空气阻力
    this.velocity.mult(0.99);
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    
    // 塑料质感模拟
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = this.col;
    
    fill(this.col);
    noStroke();
    ellipse(0, 0, this.r * 2);
    
    // 高光
    fill(255, 255, 255, 150);
    ellipse(-this.r/3, -this.r/3, this.r/1.5, this.r/2);
    
    // 分模线 (模拟塑料球的接缝)
    stroke(0, 50);
    strokeWeight(1);
    noFill();
    arc(0, 0, this.r*2, this.r*2, 0, PI);
    
    pop();
  }

  checkEdges() {
    // 简单的边界碰撞
    if (this.position.y > height - 100 - this.r) {
      this.position.y = height - 100 - this.r;
      this.velocity.y *= -0.6; // 弹性碰撞
    }
    if (this.position.x > width - 50 - this.r) {
      this.position.x = width - 50 - this.r;
      this.velocity.x *= -0.6;
    }
    if (this.position.x < 50 + this.r) {
      this.position.x = 50 + this.r;
      this.velocity.x *= -0.6;
    }
  }
}