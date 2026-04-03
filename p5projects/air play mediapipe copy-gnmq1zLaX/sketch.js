let video;
let hands = [];          // 本地手
let remoteHands = [];    // 网络传来的手
let p5lm;                // LiveMedia对象

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 本地视频
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  // 配置Hands模型
  handsModel.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  handsModel.onResults(onResults);

  // 启动摄像头
  const camera = new Camera(video.elt, {
    onFrame: async () => {
      await handsModel.send({ image: video.elt });
    },
    width: windowWidth,
    height: windowHeight,
  });
  camera.start();

  // 建立 p5LiveMedia 房间
  p5lm = new p5LiveMedia(this, "DATA", null, "two-hands-room");
  p5lm.on("data", gotData);

  createParticles();
}

function onResults(results) {
  if (results.multiHandLandmarks) {
    hands = results.multiHandLandmarks.map((landmarks, i) => ({
      landmarks,
      handedness: results.multiHandedness[i].label,
    }));
  } else hands = [];

  // 每次检测到本地手，发送给远端
  if (p5lm) {
    p5lm.send(JSON.stringify(hands));
  }
}

// 接收到对方数据
function gotData(data) {
  try {
    remoteHands = JSON.parse(data);
  } catch (e) {
    remoteHands = [];
  }
}

function draw() {
  background(0);

  // 画视频
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  image(graphics, 0, 0);
  for (const p of particles) p.update();
  for (const p of particles) p.draw();

  // 绘制本地和远程手
  drawHands(hands, color(255, 220, 100));  // 自己 - 金色
  drawHands(remoteHands, color(100, 150, 255));  // 对方 - 蓝色

  // 检查交互
  checkInteraction();

  waterPaint();
  drawRipples();
}

function drawHands(handsArray, c) {
  handsArray.forEach((hand) => {
    stroke(c);
    strokeWeight(2);
    hand.landmarks.forEach((pt) => {
      const x = width - pt.x * width;
      const y = pt.y * height;
      fill(c);
      ellipse(x, y, 8);
    });
  });
}

// ✋ 检测两人手指靠近交互
function checkInteraction() {
  if (hands.length && remoteHands.length) {
    for (let h1 of hands) {
      for (let h2 of remoteHands) {
        h1.landmarks.forEach((p1) => {
          h2.landmarks.forEach((p2) => {
            let x1 = width - p1.x * width;
            let y1 = p1.y * height;
            let x2 = width - p2.x * width;
            let y2 = p2.y * height;

            if (dist(x1, y1, x2, y2) < 30) {
              addParticle((x1 + x2) / 2, (y1 + y2) / 2);
              playRandomNote("Left");
              yuan.push([(x1 + x2) / 2, (y1 + y2) / 2, 0]);
            }
          });
        });
      }
    }
  }
}
