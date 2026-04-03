let num = 0;
let faces = []; // 用数组代替 eval，性能更好且不易出错

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始运行时先生成一次，免得屏幕是空的
  generateBatch();
}

function draw() {
  // p5.js 的 draw 循环在这里不需要做太多事，
  // 因为我们将通过点击来控制画面的刷新
}

// --- 新增的核心交互 ---
function mousePressed() {
  generateBatch(); // 每次点击，重新生成一批
}

// 将原本 setup 里的生成逻辑提取出来
function generateBatch() {
  // 1. 重置背景，把上一批“清理”掉
  background(255);
  
  // 2. 清空数组，准备生成新的 200 个数据
  faces = []; 
  
  // 3. 循环生成数据
  for (let i = 0; i < 200; i++) {
    faces[i] = createface();
  }
  
  // 4. 循环绘制
  for (let i = 0; i < 200; i++) {
    // 传入 i 是为了判断是不是第 199 个 (最后一个)
    updateface(faces[i], i); 
  }
  
  // 5. 绘制边框
  noFill();
  stroke(0); // 确保边框是黑色的
  strokeWeight(5);
  rect(0, 0, windowWidth, windowHeight);
}

function createface() {
  let face = {};
  face.x = random(-100, width);
  face.y = random(-100, height);
  return face;
}

function updateface(face, index) {
  // 随机颜色填充主体
  fill(random(255), random(255), random(255));
  strokeWeight(random(0.25, 2));
  rect(face.x, face.y, random(50, 120));
  
  strokeWeight(1);
  
  // 眼睛
  fill(random(255), random(255), random(255));
  rect(face.x + 20, face.y + 20, 5, 5);
  rect(face.x + 40, face.y + 20, 5, 5);
  
  // 嘴巴
  num = random(10);
  line(face.x + 20 - num, face.y + 40, face.x + 40 + num, face.y + 40);
  
  // --- 判定是否为“真爱” (第 199 个) ---
  if (index == 199) {
    // 只有这一个会有特殊的嘴型和爱心
    line(face.x + 20 - num, face.y + 40, face.x + 20 - num, face.y + 35);
    line(face.x + 40 + num, face.y + 40, face.x + 40 + num, face.y + 35);
    
    fill(255, 0, 0); // 确保爱心是红色的
    textSize(20);
    text("❤️❤️❤️", face.x + 50 + num, face.y + 30);
    
    // 可以在这里打印日志，告诉你“真爱”在哪
    console.log("Found love at: " + face.x + ", " + face.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateBatch(); // 窗口大小时也刷新一下
}