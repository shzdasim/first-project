const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const regularWoff = path.resolve(__dirname, '../node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff');
const boldWoff = path.resolve(__dirname, '../node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff');
const monoWoff = path.resolve(__dirname, '../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff');

if (fs.existsSync(regularWoff)) GlobalFonts.registerFromPath(regularWoff, 'Roboto');
if (fs.existsSync(boldWoff)) GlobalFonts.registerFromPath(boldWoff, 'RobotoBold');
if (fs.existsSync(monoWoff)) GlobalFonts.registerFromPath(monoWoff, 'RobotoMono');

const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');

const RED = '#FF2020';
const RED_BRIGHT = '#FF3B3B';
const RED_DEEP = '#A61212';
const CUTOUT = '#000000';

function drawManSilhouette(ctx, options = {}) {
  const {
    x = 960,
    y = 800,
    scale = 1.4,
    walkPhase = 0,
    isWalking = false,
    briefcaseHold = true,
    armReachProgress = 0, // 0 to 1
    facing = 1
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);

  let hipBob = 0;
  let torsoTilt = 0.01;
  let leftLegAngle = 0;
  let rightLegAngle = 0;
  let leftKneeAngle = 0;
  let rightKneeAngle = 0;
  let leftArmAngle = 0;
  let rightArmAngle = 0;
  let briefcaseAngle = 0;

  if (isWalking) {
    const cycle = walkPhase * Math.PI * 2;
    hipBob = -Math.abs(Math.sin(cycle)) * 5;
    torsoTilt = 0.03 + Math.sin(cycle) * 0.015;

    const stride = 0.38;
    // Right leg is back leg / briefcase side, left leg is front leg
    leftLegAngle = Math.sin(cycle) * stride;
    rightLegAngle = Math.sin(cycle + Math.PI) * stride;

    // Knee flex on swing phase
    leftKneeAngle = Math.max(0, -Math.sin(cycle) * 0.50);
    rightKneeAngle = Math.max(0, -Math.sin(cycle + Math.PI) * 0.50);

    // Free arm (left) swings counter to left leg
    leftArmAngle = -Math.sin(cycle) * 0.32;

    // Right arm holding briefcase: subtle constrained pendulum swing
    rightArmAngle = Math.sin(cycle) * 0.12;
    briefcaseAngle = rightArmAngle * 0.8;
  } else {
    torsoTilt = 0.01;
    leftLegAngle = -0.03;
    rightLegAngle = 0.03;
    leftKneeAngle = 0.02;
    rightKneeAngle = 0.02;
    leftArmAngle = armReachProgress > 0 ? -1.15 * armReachProgress : 0.04;
    rightArmAngle = 0.02;
    briefcaseAngle = 0;
  }

  ctx.translate(0, hipBob);

  // --- LEGS HELPER ---
  const drawLeg = (angle, kneeBend, isRightLeg) => {
    ctx.save();
    ctx.translate(isRightLeg ? 3 : -3, -135); // Hip pivot
    ctx.rotate(angle);

    const legColor = isRightLeg ? RED_DEEP : RED;
    ctx.fillStyle = legColor;

    // Thigh with tailored trouser cut
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(11, 0);
    ctx.lineTo(9.5, 68);
    ctx.lineTo(-9.5, 68);
    ctx.closePath();
    ctx.fill();

    // Knee cap & Lower Leg (Shin / Trousers)
    ctx.translate(0, 68);
    ctx.rotate(kneeBend);

    // Smooth knee circle joint
    ctx.beginPath();
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    ctx.fill();

    // Lower trouser leg (classic 1971 slight flare at hem)
    ctx.beginPath();
    ctx.moveTo(-9.5, 0);
    ctx.lineTo(9.5, 0);
    ctx.lineTo(11.5, 64);
    ctx.lineTo(-10.5, 64);
    ctx.closePath();
    ctx.fill();

    // Trouser crease line (negative space)
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(0.5, 60);
    ctx.stroke();

    // Shoe (1971 Oxford Leather Dress Shoe)
    ctx.translate(0, 64);
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(8, 0);
    ctx.lineTo(19, 8);
    ctx.lineTo(19, 14);
    ctx.lineTo(-10, 14);
    ctx.lineTo(-10, 3);
    ctx.closePath();
    ctx.fill();

    // Heel cutout
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-10, 8, 4, 6);

    ctx.restore();
  };

  // Draw back leg (right) then front leg (left)
  drawLeg(rightLegAngle, rightKneeAngle, true);
  drawLeg(leftLegAngle, leftKneeAngle, false);

  // --- TORSO & 1971 SUIT JACKET ---
  ctx.save();
  ctx.translate(0, -135); // Hip level
  ctx.rotate(torsoTilt);

  // Jacket lower skirt
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-18, -35);
  ctx.lineTo(18, -35);
  ctx.lineTo(21, 20);
  ctx.lineTo(-19, 20);
  ctx.closePath();
  ctx.fill();

  // Negative space jacket vent slit
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(0, 20);
  ctx.stroke();

  // Main Torso / Chest
  ctx.beginPath();
  ctx.moveTo(-22, -90); // Left shoulder
  ctx.lineTo(22, -90);  // Right shoulder
  ctx.lineTo(18, -35);
  ctx.lineTo(-18, -35);
  ctx.closePath();
  ctx.fill();

  // Crisp White Shirt Collar (NEGATIVE SPACE CUTOUT)
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(-7, -90);
  ctx.lineTo(7, -90);
  ctx.lineTo(4, -58);
  ctx.lineTo(-4, -58);
  ctx.closePath();
  ctx.fill();

  // Suit Notch Lapels (Negative space seam line)
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-16, -88);
  ctx.lineTo(-5, -60);
  ctx.lineTo(-1, -30);
  ctx.moveTo(16, -88);
  ctx.lineTo(5, -60);
  ctx.lineTo(-1, -30);
  ctx.stroke();

  // 1971 Slim Red Necktie inside the collar cutout
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(-2.5, -82);
  ctx.lineTo(2.5, -82);
  ctx.lineTo(3.5, -55);
  ctx.lineTo(0, -50);
  ctx.lineTo(-3.5, -55);
  ctx.closePath();
  ctx.fill();

  // Breast pocket welt
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(8, -72);
  ctx.lineTo(15, -72);
  ctx.stroke();

  // --- NECK & SLEEK 1971 BUSINESSMAN HEAD ---
  ctx.fillStyle = RED;
  ctx.fillRect(-6, -104, 12, 16);

  // Anatomically balanced head silhouette
  ctx.beginPath();
  ctx.moveTo(-8, -104);             // nape of neck
  ctx.lineTo(-10, -118);            // base of skull
  ctx.bezierCurveTo(-12, -135, -5, -145, 6, -144); // back of skull & crown
  ctx.bezierCurveTo(12, -143, 14, -135, 14, -128); // crown to forehead
  ctx.lineTo(14, -122);             // forehead
  ctx.lineTo(17.5, -119);           // bridge & tip of nose
  ctx.lineTo(14, -116);             // philtrum
  ctx.lineTo(14.5, -113);           // closed calm lips
  ctx.lineTo(12, -108);             // chin & jaw angle
  ctx.lineTo(4, -104);              // jawline to neck
  ctx.closePath();
  ctx.fill();

  // Crisp 1970s side-parted hairstyle outline
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-7, -130);
  ctx.quadraticCurveTo(2, -132, 12, -126);
  ctx.stroke();

  // Subtle ear contour (negative space)
  ctx.beginPath();
  ctx.arc(-1, -117, 3.5, -Math.PI * 0.4, Math.PI * 0.6);
  ctx.stroke();

  // --- LEFT ARM (FREE / REACHING ARM) ---
  ctx.save();
  ctx.translate(-16, -85); // Shoulder
  ctx.rotate(leftArmAngle);

  // Upper arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 48, 4);
  ctx.fill();

  // Forearm
  ctx.translate(0, 46);
  if (armReachProgress > 0) {
    ctx.rotate(-0.55 * armReachProgress);
  }
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 44, 3);
  ctx.fill();

  // Shirt cuff cutout
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, 40);
  ctx.lineTo(5, 40);
  ctx.stroke();

  // Hand
  ctx.translate(0, 42);
  ctx.beginPath();
  ctx.arc(0, 4, 5, 0, Math.PI * 2);
  ctx.fill();

  if (armReachProgress > 0.3) {
    // Extended fingers for transaction
    ctx.beginPath();
    ctx.moveTo(-2, 4);
    ctx.lineTo(8, 4);
    ctx.lineTo(8, 8);
    ctx.lineTo(-2, 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore(); // Left arm

  // --- RIGHT ARM & BRIEFCASE ---
  ctx.save();
  ctx.translate(14, -85); // Shoulder
  ctx.rotate(rightArmAngle);

  // Upper arm (with subtle negative space separation outline)
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 48, 4);
  ctx.fill();

  // Forearm
  ctx.translate(0, 46);
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 42, 3);
  ctx.fill();

  // Shirt cuff cutout
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, 38);
  ctx.lineTo(5, 38);
  ctx.stroke();

  // Hand gripping briefcase
  ctx.translate(0, 40);
  ctx.beginPath();
  ctx.arc(0, 4, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // BRIEFCASE
  if (briefcaseHold) {
    ctx.save();
    ctx.translate(1, 8);
    ctx.rotate(briefcaseAngle);

    // Arched Handle
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, -6, 7.5, Math.PI, 0, false);
    ctx.stroke();

    // Attache Body
    const bw = 54;
    const bh = 36;
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.roundRect(-bw / 2, 0, bw, bh, 2.5);
    ctx.fill();

    // Negative space center seam
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 1, bh / 2);
    ctx.lineTo(bw / 2 - 1, bh / 2);
    ctx.stroke();

    // Dual keylatches
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-15, bh / 2 - 2.5, 4.5, 5);
    ctx.fillRect(10.5, bh / 2 - 2.5, 4.5, 5);

    // Corner reinforcements
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.0;
    ctx.strokeRect(-bw / 2 + 1, 1, 5, 5);
    ctx.strokeRect(bw / 2 - 6, 1, 5, 5);
    ctx.strokeRect(-bw / 2 + 1, bh - 6, 5, 5);
    ctx.strokeRect(bw / 2 - 6, bh - 6, 5, 5);

    ctx.restore();
  }

  ctx.restore(); // Right arm
  ctx.restore(); // Torso
  ctx.restore(); // Base
}

// Render test frames
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 1920, 1080);

// Draw man in 3 states: walking (phase 0.25), walking (phase 0.75), stationary with reach
drawManSilhouette(ctx, { x: 450, y: 750, scale: 1.5, walkPhase: 0.25, isWalking: true });
drawManSilhouette(ctx, { x: 960, y: 750, scale: 1.5, walkPhase: 0.75, isWalking: true });
drawManSilhouette(ctx, { x: 1470, y: 750, scale: 1.5, armReachProgress: 0.8, isWalking: false });

const outPath = path.join(__dirname, 'test_man_silhouette.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('Saved:', outPath);
