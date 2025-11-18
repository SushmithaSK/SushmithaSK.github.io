// --------------------------------------------------
// sketch2.js — Responsive + Mobile Optimized Version
// --------------------------------------------------
let sketch2 = (p) => {
  let startTime = 0;
  const animationDuration = 40000;

  // Detect mobile (small screens or touch)
  const IS_MOBILE = window.innerWidth < 768 || navigator.maxTouchPoints > 0;

  // Nebula noise
  let noiseOffset1_X, noiseOffset1_Y;
  let noiseOffset2_X, noiseOffset2_Y;
  let noiseScale = IS_MOBILE ? 0.003 : 0.002;
  let noiseSpeed = 0.00005;

  // Stars (scaled for mobile)
  let stars = [];
  const numNormalStars = IS_MOBILE ? 450 : 1000;
  const numBrightStars = IS_MOBILE ? 15 : 30;
  const numRedStars = IS_MOBILE ? 6 : 10;

  // Scroll fade (nebula only)
  let nebulaAlpha = 0;

  // Smooth fade for stars
  let starFade = 0;
  const starFadeDuration = 1000;
  let starFadeStart = 0;

  // Handle mobile scroll jump
  let lastScrollY = 0;

  p.__started = false;
  p.canvasEl = null;

  // ------------------------------
  // SETUP
  // ------------------------------
  p.setup = () => {
    p.canvasEl = p.createCanvas(window.innerWidth, window.innerHeight);
    const c = p.canvasEl;

    c.addClass("sketch2-canvas");

    p.pixelDensity(IS_MOBILE ? 0.75 : 1); // reduce load for mobile
    p.noiseDetail(3, 0.5);

    initializeStars();
    setupScrollFade();
  };

  // ------------------------------
  // Triggered by sketch.js
  // ------------------------------
  p.startNebula = () => {
    p.__started = true;
    resetAnimation();
    starFadeStart = p.millis();
    starFade = 0;
  };

  window.addEventListener("spiralFinished", () => {
    if (!p.__started) p.startNebula();
  });

  // ------------------------------
  // Scroll fade (nebula only)
//  Mobile scroll needs throttled fade updates
  // ------------------------------
  function setupScrollFade() {
    window.addEventListener("scroll", () => {
      let scrollY = window.scrollY;

      // Prevent sudden jumps on mobile
      if (IS_MOBILE && Math.abs(scrollY - lastScrollY) > 150) return;
      lastScrollY = scrollY;

      const fadeInStart = 30;
      const fadeInEnd = IS_MOBILE ? 200 : 300;

      const fadeOutStart = IS_MOBILE ? 500 : 800;
      const fadeOutEnd = IS_MOBILE ? 900 : 1400;

      if (scrollY < fadeInStart) {
        nebulaAlpha = 0;
      } else if (scrollY < fadeInEnd) {
        nebulaAlpha = p.map(scrollY, fadeInStart, fadeInEnd, 0, 1);
      } else if (scrollY < fadeOutStart) {
        nebulaAlpha = 1;
      } else {
        nebulaAlpha = p.map(scrollY, fadeOutStart, fadeOutEnd, 1, 0);
        nebulaAlpha = p.constrain(nebulaAlpha, 0, 1);
      }
    });
  }

  // ------------------------------
  // STAR INITIALIZATION
  // ------------------------------
  function initializeStars() {
    stars.length = 0;

    const addStars = (count, minS, maxS, colorFn, type) => {
      for (let i = 0; i < count; i++) {
        stars.push({
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(minS, maxS),
          color: colorFn(),
          twinkleOffset: p.random(1000),
          type
        });
      }
    };

    addStars(
      numNormalStars,
      1,
      IS_MOBILE ? 2 : 2.5,
      () => p.color(200 + p.random(55), 200 + p.random(55), 255, p.random(150, 220)),
      "normal"
    );

    addStars(
      numBrightStars,
      IS_MOBILE ? 2 : 2.5,
      IS_MOBILE ? 5 : 6,
      () => p.color(255, 200 + p.random(55), 100 + p.random(100), p.random(180, 255)),
      "bright"
    );

    addStars(
      numRedStars,
      IS_MOBILE ? 1.7 : 2,
      IS_MOBILE ? 3.5 : 4,
      () => p.color(255, p.random(50, 100), p.random(50, 100), p.random(180, 255)),
      "red"
    );
  }

  // ------------------------------
  // RESET ANIMATION
  // ------------------------------
  function resetAnimation() {
    startTime = p.millis();

    noiseOffset1_X = p.random(1000);
    noiseOffset1_Y = p.random(1000);

    noiseOffset2_X = p.random(1000);
    noiseOffset2_Y = p.random(1000);
  }

  // ------------------------------
  // DRAW LOOP
  // ------------------------------
  p.draw = () => {
    if (!p.__started) return;

    let t = p.millis() - startTime;

    if (t > animationDuration) {
      resetAnimation();
      t = 0;
    }

    starFade = p.constrain((p.millis() - starFadeStart) / starFadeDuration, 0, 1);

    p.background(10, 5, 15);
    p.noStroke();

    const z = t * noiseSpeed;

    // ------------------------------
    // NEBULA (mobile-enhanced)
    // ------------------------------
    p.blendMode(p.SCREEN);

    const grid1 = IS_MOBILE ? 55 : 40;
    const grid2 = IS_MOBILE ? 80 : 60;

    let n, a;

    for (let y = 0; y < p.height; y += grid1) {
      for (let x = 0; x < p.width; x += grid1) {

        n = p.noise(x * noiseScale + noiseOffset1_X,
                    y * noiseScale + noiseOffset1_Y,
                    z);

        a = p.lerp(0, IS_MOBILE ? 50 : 60, n) * nebulaAlpha;

        if (a < 1) continue;

        p.fill(
          p.lerp(80, 180, n),
          p.lerp(40, 90, n),
          p.lerp(0, 20, n),
          a
        );

        p.ellipse(x, y, grid1 * (1 + n));
      }
    }

    for (let y = 0; y < p.height; y += grid2) {
      for (let x = 0; x < p.width; x += grid2) {

        n = p.noise(x * noiseScale * 0.8 + noiseOffset2_X,
                    y * noiseScale * 0.8 + noiseOffset2_Y,
                    z * 1.5);

        a = p.lerp(0, IS_MOBILE ? 55 : 70, n) * nebulaAlpha;

        if (a < 1) continue;

        p.fill(
          p.lerp(150, 255, n),
          p.lerp(80, 190, n),
          p.lerp(0, 50, n),
          a
        );

        p.ellipse(x, y, grid2 * (0.5 + n * 1.5));
      }
    }

    // ------------------------------
    // STARS — smooth fade-in
    // ------------------------------
    p.blendMode(p.BLEND);

    const tSec = t / 1000;

    for (let s of stars) {
      const tw = p.sin(s.twinkleOffset + tSec * 2) * 0.2 + 1;
      const size = s.size * tw;
      const baseA = p.alpha(s.color) * tw * starFade;

      const r = p.red(s.color);
      const g = p.green(s.color);
      const b = p.blue(s.color);

      if (s.type === "bright") {
        for (let i = 0; i < 3; i++) {
          p.fill(r, g, b, baseA * (0.15 - i * 0.05));
          p.ellipse(s.x, s.y, size * (1 + i * 0.4));
        }
      }

      p.fill(r, g, b, baseA);
      p.ellipse(s.x, s.y, size);
    }
  };

  // ------------------------------
  // Resize for mobile (VERY IMPORTANT)
  // ------------------------------
  p.windowResized = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    p.resizeCanvas(w, h);

    initializeStars();
    resetAnimation();
  };
};

new p5(sketch2);
