/* This script uses the p5.js library to create an animated, organic background. */
/* The 'Helixa' creature provides a subtle, dynamic texture for the portfolio. */

let t = 0;
const p = {};
let W, H;
let CX, CY;
const epsilon = 0.001;

let startTime;
let fallProgress = 0;        // 0 → 1 as it starts falling
let fallDuration = 3;        // time for full fall-out
let fallStartTime = 8;      // animation runs normally for 10 seconds

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  canvas.id("background-canvas");

  angleMode(RADIANS);
  frameRate(60);

  W = width;
  H = height;
  CX = W / 2;
  CY = H / 2;

  startTime = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  W = width;
  H = height;
  CX = W / 2;
  CY = H / 2;
}

function draw() {
  let elapsed = (millis() - startTime) / 1000;
  t += 0.01;

  background(0, 0, 0, 25);
  noFill();

  /* -------------------------------------------------------------
     ORGANIC FALL LOGIC AFTER 10 SECONDS
  ------------------------------------------------------------- */
  let dropOffset = 0;
  let globalFade = 1;

  if (elapsed > fallStartTime) {
    let fallT = map(elapsed, fallStartTime, fallStartTime + fallDuration, 0, 1);
    fallProgress = constrain(fallT, 0, 1);

    // Natural easing for smooth movement
    let ease = fallProgress * fallProgress * (3 - 2 * fallProgress);

    // Downward motion + noise sway
    dropOffset = ease * (H * 0.8) + noise(t * 0.5) * 40;

    // Fade out as it falls
    globalFade = 1 - ease;

    // If fully gone → stop drawing
    if (globalFade <= 0.01) {
      // When the spiral has fully faded out:
      window.dispatchEvent(new Event("spiralFinished"));

      clear();
      noLoop();
      return;
    }
  }

  /* -------------------------------------------------------------
     HELIX DRAWING
  ------------------------------------------------------------- */

  const SPINE_HEIGHT = H * 0.5;
  const HELIX_RADIUS = W * 0.04;
  const HELIX_PITCH = 1.2;

  const drift_x = 15 * sin(t * 0.7);
  const drift_y = 10 * cos(t * 0.5);

  const NUM_FILAMENTS = 150;
  const MAX_FILAMENT_LENGTH = W * 0.25;
  const WAVE_MODULATION_FREQ = 8;

  const rotation_t = t * 1.5;

  for (let i = 0; i < NUM_FILAMENTS; i++) {
    const ratio_i = i / (NUM_FILAMENTS + epsilon);

    const y_pos_base = map(ratio_i, 0, 1, -SPINE_HEIGHT / 2, SPINE_HEIGHT / 2);
    const angle = ratio_i * TWO_PI * HELIX_PITCH + rotation_t;

    // Apply downward movement to core_y
    const core_x = CX + drift_x + HELIX_RADIUS * cos(angle);
    const core_y = CY + drift_y + y_pos_base + dropOffset;

    const taper_factor = sin(ratio_i * PI);
    const filament_base_angle = angle + HALF_PI;

    const length_mod = 0.8 + 0.25 * sin(t * 4.0 + ratio_i * 10);
    const current_length = MAX_FILAMENT_LENGTH * pow(taper_factor, 1.5) * length_mod;

    const filament_wave_amp = 45 * taper_factor;
    const filament_wave_phase = t * 3.5;

    let P0x = core_x;
    let P0y = core_y;

    const P1_dist = current_length * 0.3;
    const P1_wiggle = 15 * sin(filament_wave_phase + ratio_i * WAVE_MODULATION_FREQ);

    let P1x = P0x + P1_dist * cos(filament_base_angle) + P1_wiggle * sin(filament_base_angle);
    let P1y = P0y + P1_dist * sin(filament_base_angle) + P1_wiggle * cos(filament_base_angle);

    const P2_dist = current_length * 0.7;
    const shear_angle = sin(t * 1.0) * 0.25;
    const P2_wave = filament_wave_amp * cos(filament_wave_phase * 0.5 + ratio_i * 4);

    let P2x = P0x + P2_dist * cos(filament_base_angle + shear_angle) + P2_wave * sin(filament_base_angle);
    let P2y = P0y + P2_dist * sin(filament_base_angle + shear_angle) + P2_wave * cos(filament_base_angle);

    const P3_wave = filament_wave_amp * 0.5 * sin(filament_wave_phase + ratio_i * 6);

    let P3x = P0x + current_length * cos(filament_base_angle + shear_angle) + P3_wave * sin(filament_base_angle);
    let P3y = P0y + current_length * sin(filament_base_angle + shear_angle) + P3_wave * cos(filament_base_angle);

    const alpha = map(taper_factor, 0, 1, 15, 96) * globalFade;
    const weight = map(taper_factor, 0, 1, 0.5, 1.8);

    stroke(255, alpha);
    strokeWeight(weight);

    bezier(
      constrain(P0x, 0, W),
      constrain(P0y, 0, H),
      constrain(P1x, 0, W),
      constrain(P1y, 0, H),
      constrain(P2x, 0, W),
      constrain(P2y, 0, H),
      constrain(P3x, 0, W),
      constrain(P3y, 0, H)
    );
  }
}
