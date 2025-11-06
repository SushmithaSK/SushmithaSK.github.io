/* This script uses the p5.js library to create an animated, organic background. */
/* The 'Helixa' creature provides a subtle, dynamic texture for the portfolio. */

/* Global variables for the animation state and parameters. */
let t = 0;
const p = {}; /* Placeholder object, not used in this specific sketch. */
let W, H; /* Canvas width and height, will be set dynamically. */
let CX, CY; /* Center X and Y coordinates of the canvas. */
const epsilon = 0.001; /* Small value to prevent division by zero. */

/* The setup function is called once when the program starts. */
function setup() {
  /* Create a canvas that fills the entire window. */
  let canvas = createCanvas(windowWidth, windowHeight);
  /* Position the canvas at the top-left corner. */
  canvas.position(0, 0);
  /* Set the z-index to -1 to place the canvas behind all other content. */
  canvas.style("z-index", "-1");
  /* Assign an ID to the canvas for potential CSS targeting, though p5.js creates its own. */
  canvas.id("background-canvas");

  /* Set angle mode to RADIANS for trigonometric functions. */
  angleMode(RADIANS);
  /* Set the frame rate for consistent animation speed. */
  frameRate(60);

  /* Initialize canvas dimensions and center coordinates. */
  W = width;
  H = height;
  CX = W / 2;
  CY = H / 2;
}

/* The windowResized function is called whenever the browser window is resized. */
function windowResized() {
  /* Resize the canvas to match the new window dimensions. */
  resizeCanvas(windowWidth, windowHeight);
  /* Update canvas dimensions and center coordinates. */
  W = width;
  H = height;
  CX = W / 2;
  CY = H / 2;
}

/* The draw function is called repeatedly, 60 times per second (as per frameRate). */
function draw() {
  /* Increment time variable for animation progression. */
  t += 0.01;

  /* Background fade: A subtle, dark blue void effect with transparency. */
  /* This creates a trailing effect for the moving elements. */
  background(0, 5, 20, 25);
  /* Disable filling shapes, only outlines will be drawn. */
  noFill();

  /* Core parameters for the Helixa creature's structure. */
  const SPINE_HEIGHT = H * 0.5; /* Spine height relative to canvas height. */
  const HELIX_RADIUS = W * 0.04; /* Helix radius relative to canvas width. */
  const HELIX_PITCH = 1.2; /* Controls how tight the spiral is. */

  /* Overall movement: Gentle drifting of the creature. */
  const drift_x = 15 * sin(t * 0.7);
  const drift_y = 10 * cos(t * 0.5);

  /* --- Draw the Helical Spine and Primary Filaments --- */

  const NUM_FILAMENTS = 150; /* Density of lines forming the creature. */
  const MAX_FILAMENT_LENGTH =
    W * 0.25; /* Maximum length of individual filaments. */
  const WAVE_MODULATION_FREQ = 8; /* Frequency for wave modulation along filaments. */

  /* Central rotation speed for the helix. */
  const rotation_t = t * 1.5;

  /* Loop to draw each individual filament. */
  for (let i = 0; i < NUM_FILAMENTS; i++) {
    const ratio_i = i / (NUM_FILAMENTS + epsilon);

    /* Map ratio_i (0 to 1) along the vertical spine. */
    const y_pos_base = map(ratio_i, 0, 1, -SPINE_HEIGHT / 2, SPINE_HEIGHT / 2);

    /* Calculate angular position around the helix based on height and time. */
    const angle = ratio_i * TWO_PI * HELIX_PITCH + rotation_t;

    /* Calculate the core spine position (X, Y) for the current filament. */
    const core_x = CX + drift_x + HELIX_RADIUS * cos(angle);
    const core_y = CY + drift_y + y_pos_base;

    /* Tapering factor: Fades out filaments at the ends of the spine. */
    const taper_factor = sin(ratio_i * PI);

    /* --- Draw the filament extending outward --- */

    /* Filament starts perpendicular to the helix radius. */
    const filament_base_angle = angle + HALF_PI;

    /* Length modulation: Pulsing/breathing effect for filament length. */
    const length_mod = 0.8 + 0.25 * sin(t * 4.0 + ratio_i * 10);
    const current_length =
      MAX_FILAMENT_LENGTH * pow(taper_factor, 1.5) * length_mod;

    /* Wave motion along the filament's extension. */
    const filament_wave_amp = 45 * taper_factor;
    const filament_wave_phase = t * 3.5;

    /* P0: Start Point (on the spine). */
    let P0x = core_x;
    let P0y = core_y;

    /* P1: Control Point 1 (Initial outward direction, slightly wiggled). */
    const P1_dist = current_length * 0.3;
    const P1_wiggle =
      15 * sin(filament_wave_phase + ratio_i * WAVE_MODULATION_FREQ);

    let P1x =
      P0x +
      P1_dist * cos(filament_base_angle) +
      P1_wiggle * sin(filament_base_angle);
    let P1y =
      P0y +
      P1_dist * sin(filament_base_angle) +
      P1_wiggle * cos(filament_base_angle);

    /* P2: Control Point 2 (Mid-length bend, incorporating shear). */
    const P2_dist = current_length * 0.7;
    const shear_angle = sin(t * 1.0) * 0.25;
    const P2_wave =
      filament_wave_amp * cos(filament_wave_phase * 0.5 + ratio_i * 4);

    let P2x =
      P0x +
      P2_dist * cos(filament_base_angle + shear_angle) +
      P2_wave * sin(filament_base_angle);
    let P2y =
      P0y +
      P2_dist * sin(filament_base_angle + shear_angle) +
      P2_wave * cos(filament_base_angle);

    /* P3: End Point (Tip of the filament). */
    const P3_wave =
      filament_wave_amp * 0.5 * sin(filament_wave_phase + ratio_i * 6);

    let P3x =
      P0x +
      current_length * cos(filament_base_angle + shear_angle) +
      P3_wave * sin(filament_base_angle);
    let P3y =
      P0y +
      current_length * sin(filament_base_angle + shear_angle) +
      P3_wave * cos(filament_base_angle);

    /* Set Stroke: Ghostly, translucent white. */
    const alpha = map(taper_factor, 0, 1, 15, 96);
    const weight = map(taper_factor, 0, 1, 0.5, 1.8);

    stroke(255, alpha);
    strokeWeight(weight);

    /* Draw the Bezier curve, applying constraints to prevent overflow outside canvas. */
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
