// マウスを動かすと、水色の丸がふわっと残るエフェクト
let particles = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('pointer-events', 'none');
  pixelDensity(1);
  clear();
}

function draw() {
  clear(); // 前のフレームを消す（背景色・写真は変更しない）

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    noStroke();
    fill(0, 200, 255, p.alpha);
    circle(p.x, p.y, p.size);

    p.alpha -= 5;
    p.size += 0.35;
    if (p.alpha <= 0) particles.splice(i, 1);
  }
}

function mouseMoved() {
  // 画面外とヘッダー上では増やさない
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height || mouseY < 75) return;
  particles.push({
    x: mouseX,
    y: mouseY,
    size: random(10, 24),
    alpha: 90
  });
  // 長時間動かしても重くなりにくいようにする
  if (particles.length > 120) particles.shift();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
}
