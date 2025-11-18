// --------------------------------------------------
// sketch2.js — Mobile Optimized + Subtle Parallax Stars
// --------------------------------------------------
let sketch2 = (p) => {
  let startTime = 0;
  const animationDuration = 40000;

  const IS_MOBILE = window.innerWidth < 768 || navigator.maxTouchPoints > 0;

  // Nebula
  let noiseOffset1_X, noiseOffset1_Y;
  let noiseOffset2_X, noiseOffset2_Y;
  let noiseScale = IS_MOBILE ? 0.003 : 0.002;
  let noiseSpeed = 0.00005;

  // Stars
  let stars = [];
  const numNormalStars = IS_MOBILE ? 450 : 1000;
  const numBrightStars = IS_MOBILE ? 15 : 30;
  const numRedStars = IS_MOBILE ? 6 : 10;

  // Scroll fade
  let nebulaAlpha = 0;

  // Fade in
  let starFade = 0;
  const starFadeDuration = 1000;
  let starFadeStart = 0;

  // Parallax
  let scrollOffset = 0;

  p.__started = false;
  p.canvasEl = null;

  // ------------------------------
  // SETUP
  // ------------------------------
  p.setup = () => {
    p.canvasEl = p.createCanvas(window.innerWidth, window.innerHeight);
    p.canvasEl.addClass("sketch2-canvas");

    p.pixelDensity(IS_MOBILE ? 0.75 : 1);
    p.noiseDetail(3, 0.5);

    initializeStars();
    setupScrollEffects();
  };

  // ------------------------------
  // Triggered by sketch.js
  // ------------------------------
  p.startNebula = () => {
    p.__started = true;
    resetAnimation();
    starFadeStart = p.millis();
  };

  window.addEventListener("spiralFinished", () => {
    if (!p.__started) p.startNebula();
  });

  // ------------------------------
  // Scroll listener (fade + parallax)
  // ------------------------------
  function setupScrollEffects() {
    window.addEventListener("scroll", () => {
      scrollOffset = window.scrollY;

      const fadeInStart = 30;
      const fadeInEnd = IS_MOBILE ? 200 : 300;
      const fadeOutStart = IS_MOBILE ? 500 : 800;
      const fadeOutEnd = IS_MOBILE ? 900 : 1400;

      if (scrollOffset < fadeInStart) {
        nebulaAlpha = 0;
      } else if (scrollOffset < fadeInEnd) {
        nebulaAlpha = p.map(scrollOffset, fadeInStart, fadeInEnd, 0, 1);
      } else if (scrollOffset < fadeOutStart) {
        nebulaAlpha = 1;
      } else {
        nebulaAlpha = p.map(scrollOffset, fadeOutStart, fadeOutEnd, 1, 0);
        nebulaAlpha = p.constrain(nebulaAlpha, 0, 1);
      }
    });
  }

  // ------------------------------
  // STAR INITIALIZATION
  // ------------------------------
  function initializeStars() {
    stars.length = 0;

    const addStars = (count, minS, maxS, colFn, type) => {
      for (let i = 0; i < count; i++) {

        // ⭐ Only a few stars shift (5–12%)
        const willParallax = Math.random() < (IS_MOBILE ? 0.05 : 0.12);

        stars.push({
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(minS, maxS),
          color: colFn(),

          // Twinkle offset
          twinkleOffset: p.random(1000),
          type,

          // ⭐ Parallax attributes
          parallax: willParallax,
          parallaxStrength: p.random(0.3, 1.8) // unique depth movement
        });
      }
    };

    addStars(
      numNormalStars,
      1, IS_MOBILE ? 2 : 2.5,
      () => p.color(200 + p.random(55), 200 + p.random(55), 255, p.random(150, 220)),
      "normal"
    );

    addStars(
      numBrightStars,
      IS_MOBILE ? 2 : 2.5, IS_MOBILE ? 5 : 6,
      () => p.color(255, 200 + p.random(55), 100 + p.random(100), p.random(180, 255)),
      "bright"
    );

    addStars(
      numRedStars,
      IS_MOBILE ? 1.7 : 2, IS_MOBILE ? 3.5 : 4,
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
    // NEBULA (unchanged)
    // ------------------------------
    p.blendMode(p.SCREEN);

    const grid1 = IS_MOBILE ? 55 : 40;
    const grid2 = IS_MOBILE ? 80 : 60;

    let n, a;

    // Layer 1
    for (let y = 0; y < p.height; y += grid1) {
      for (let x = 0; x < p.width; x += grid1) {

        n = p.noise(x * noiseScale + noiseOffset1_X, y * noiseScale + noiseOffset1_Y, z);
        a = p.lerp(0, IS_MOBILE ? 50 : 60, n) * nebulaAlpha;
        if (a < 1) continue;

        p.fill(p.lerp(80, 180, n), p.lerp(40, 90, n), p.lerp(0, 20, n), a);
        p.ellipse(x, y, grid1 * (1 + n));
      }
    }

    // Layer 2
    for (let y = 0; y < p.height; y += grid2) {
      for (let x = 0; x < p.width; x += grid2) {

        n = p.noise(x * noiseScale * 0.8 + noiseOffset2_X, y * noiseScale * 0.8 + noiseOffset2_Y, z * 1.5);
        a = p.lerp(0, IS_MOBILE ? 55 : 70, n) * nebulaAlpha;
        if (a < 1) continue;

        p.fill(p.lerp(150, 255, n), p.lerp(80, 190, n), p.lerp(0, 50, n), a);
        p.ellipse(x, y, grid2 * (0.5 + n * 1.5));
      }
    }

    // ------------------------------
    // STARS — now with natural parallax
    // ------------------------------
    p.blendMode(p.BLEND);
    const tSec = t / 1000;

    const PX = IS_MOBILE ? 0.05 : 0.10;
    const PY = IS_MOBILE ? 0.02 : 0.04;

    for (let s of stars) {

      const tw = p.sin(s.twinkleOffset + tSec * 2) * 0.2 + 1;
      const size = s.size * tw;
      const baseA = p.alpha(s.color) * tw * starFade;

      // ⭐ Apply parallax ONLY to chosen stars
      let px = 0;
      let py = 0;
      if (s.parallax) {
        px = scrollOffset * PX * s.parallaxStrength;
        py = scrollOffset * PY * s.parallaxStrength;
      }

      const r = p.red(s.color), g = p.green(s.color), b = p.blue(s.color);

      // Glow for bright stars
      if (s.type === "bright") {
        for (let i = 0; i < 3; i++) {
          p.fill(r, g, b, baseA * (0.15 - i * 0.05));
          p.ellipse(s.x + px, s.y + py, size * (1 + i * 0.4));
        }
      }

      p.fill(r, g, b, baseA);
      p.ellipse(s.x + px, s.y + py, size);
    }
  };

  // ------------------------------
  // Handle screen resize
  // ------------------------------
  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    initializeStars();
    resetAnimation();
  };
};

new p5(sketch2);
