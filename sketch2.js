// sketch2.js — Floating sparkles with faster filament motion ✨

const sparkSketch = (p) => {
  let sparkles = [];
  const maxSparkles = 15;
  const palette = ["#eae0d5", "#c6ac8f", "#5e503f"];

  p.setup = function () {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("p5-cygnus");
    p.angleMode(p.RADIANS);
    p.noFill();
  };

  p.draw = function () {
    p.clear();

    // Sparkle generation
    if (sparkles.length < maxSparkles && p.random() < 0.02) {
      sparkles.push(new Sparkle(p.random(p.width), p.random(p.height)));
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.update();
      s.display();
      if (s.finished()) sparkles.splice(i, 1);
    }
  };

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.t = p.random(1000);
      this.life = 0;
      this.maxLife = p.random(200, 280);
      this.scale = p.random(0.3, 0.6);
      this.fade = 0;
      this.color = p.color(p.random(palette));

      // Movement constants
      this.vx = p.random(-0.2, 0.2);
      this.vy = p.random(-0.3, -0.05);
      this.wobbleAmp = p.random(0.5, 2.5);
      this.wobbleSpeed = p.random(0.01, 0.03);
    }

    update() {
      this.t += p.PI / 180;
      this.life++;

      // Fade
      if (this.life < 40) this.fade = p.map(this.life, 0, 40, 0, 1);
      else if (this.life > this.maxLife - 40)
        this.fade = p.map(this.life, this.maxLife - 40, this.maxLife, 1, 0);
      else this.fade = 1;

      // Drift
      this.x += this.vx + p.sin(this.t * 0.5) * 0.1 * this.wobbleAmp;
      this.y += this.vy + p.cos(this.t * 0.3) * 0.1 * this.wobbleAmp;

      // Mouse interaction
      const dx = this.x - p.mouseX;
      const dy = this.y - p.mouseY;
      const distSq = dx * dx + dy * dy;

      if (distSq < 12000) {
        const dist = p.sqrt(distSq);
        const strength = p.map(dist, 0, 120, 2.0, 0.2, true);
        const angle = p.atan2(dy, dx);
        this.x += p.cos(angle) * strength;
        this.y += p.sin(angle) * strength;
        this.fade = p.constrain(this.fade + 0.05, 0, 1.2);
      }

      // Wrap
      if (this.x < -100) this.x = p.width + 50;
      if (this.x > p.width + 100) this.x = -50;
      if (this.y < -100) this.y = p.height + 50;
    }

    display() {
      p.push();
      p.translate(this.x, this.y);
      p.scale(this.scale);
      p.noFill();

      // 💨 Faster filament oscillation
      const speedFactor = 2.2; // increase this for faster illusion

      for (let i = 0; i < 16; i++) {
        p.push();
        p.rotate(i * p.PI / 8 + p.sin(this.t * 0.1 * speedFactor) * 0.1);
        for (let j = 1; j <= 40; j++) {
          let x1 = p.map(j - 1, 0, 40, 0, 100),
              x2 = p.map(j, 0, 40, 0, 100);

          let y1 =
            p.sin((j - 1) * 0.3 + this.t * 0.8 * speedFactor + i * 0.5) *
              (10 + p.sin(this.t * 0.5 * speedFactor) * 5) *
              p.map(j - 1, 0, 40, 0.1, 1) +
            p.cos((j - 1) * 0.6 + this.t * 0.5 * speedFactor + i * 0.3) *
              (5 + p.cos(this.t * 0.7 * speedFactor) * 3) *
              p.map(j - 1, 0, 40, 0, 0.8);

          let y2 =
            p.sin(j * 0.3 + this.t * 0.8 * speedFactor + i * 0.5) *
              (10 + p.sin(this.t * 0.5 * speedFactor) * 5) *
              p.map(j, 0, 40, 0.1, 1) +
            p.cos(j * 0.6 + this.t * 0.5 * speedFactor + i * 0.3) *
              (5 + p.cos(this.t * 0.7 * speedFactor) * 3) *
              p.map(j, 0, 40, 0, 0.8);

          let c1 = p.color(50, 50, 50, 80 * this.fade);
          let c2 = p.color(this.color);
          c2.setAlpha(220 * this.fade);
          p.stroke(p.lerpColor(c1, c2, j / 40));
          p.strokeWeight(1 + p.sin(this.t * 0.2 * speedFactor + j * 0.1) * 0.5);
          p.line(x1, y1, x2, y2);
          p.line(x1, -y1, x2, -y2);
        }
        p.pop();
      }

      // Glow
      let r = (20 + p.sin(this.t * 0.5) * 5) * this.scale;
      let baseCol = p.color(this.color);
      baseCol.setAlpha(140 * this.fade);
      p.noStroke();
      p.fill(baseCol);
      p.ellipse(0, 0, r * 3.2);
      baseCol.setAlpha(240 * this.fade);
      p.fill(baseCol);
      p.ellipse(0, 0, r * 1.6);

      // Orbiting sparks
      for (let k = 0; k < 12; k++) {
        let a = k * p.PI / 6 + this.t * 0.2 * speedFactor;
        baseCol.setAlpha((100 + p.sin(this.t * 0.5 * speedFactor + k) * 80) * this.fade);
        p.fill(baseCol);
        p.ellipse(
          p.cos(a) * (r + 10),
          p.sin(a) * (r + 10),
          (4 + p.sin(this.t * 0.7 * speedFactor + k) * 1.5) * this.scale
        );
      }

      p.pop();
    }

    finished() {
      return this.life > this.maxLife;
    }
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sparkSketch);
