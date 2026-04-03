let capture;
let cacheGraphics;
let fullscreenBtn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  capture = createCapture(VIDEO);
  capture.hide();
  cacheGraphics = createGraphics(windowWidth, windowHeight);
  cacheGraphics.translate(windowWidth, 0);
  cacheGraphics.scale(-1, 1);

  fullscreenBtn = createButton("Fullscreen");
  fullscreenBtn.position(20, 20);
  fullscreenBtn.style("padding", "10px 20px");
  fullscreenBtn.style("font-size", "16px");
  fullscreenBtn.style("cursor", "pointer");
  fullscreenBtn.style("background", "white");
  fullscreenBtn.style("border", "none");
  fullscreenBtn.style("border-radius", "6px");
  fullscreenBtn.mousePressed(() => fullscreen(!fullscreen()));
}

function draw() {
  background(0);
  cacheGraphics.image(capture, 0, 0, windowWidth, windowHeight);
  noStroke();

  let span = 10 + mouseX / 20;

  for (let i = 0; i < cacheGraphics.width; i += span) {
    for (let o = 0; o < cacheGraphics.height; o += span) {
      let c = cacheGraphics.get(i, o);
      let bk = (c[0] + c[1] + c[2]) / 3;
      let chars = "10100";
      let bkId = int(map(bk, 0, 255, chars.length - 1, 0));
      fill(c[0] + 50, c[1] + 30, c[2] + 50);
      textStyle(BOLD);
      textSize(span);
      text(chars[bkId], i, o);
    }
  }
}

function keyPressed() {
  if (key == "f" || key == "F") fullscreen(!fullscreen());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cacheGraphics = createGraphics(windowWidth, windowHeight);
  cacheGraphics.translate(windowWidth, 0);
  cacheGraphics.scale(-1, 1);
}