const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');

const RED = '#FF2020';
const RED_BRIGHT = '#FF3B3B';
const RED_DEEP = '#B81414';
const CUTOUT = '#000000';

/**
 * True Cinematic Profile Silhouette of the 1971 Businessman
 * Viewed in profile/three-quarter walking Left to Right
 */
function drawProfileMan(ctx, options = {}) {
  const {
    x = 960,
    y = 800,
    scale = 1.45,
    walkPhase = 0,
    isWalking = false,
    armReach = 0,
    briefcase = true,
    facing = 1
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);

  let bob = 0;
  let torsoLean = 0.03; // slight forward posture of a purposeful walk
  let leftLegAngle = 0;  // far leg (left)
  let rightLegAngle = 0; // near leg (right)
  let leftKneeAngle = 0;
  let rightKneeAngle = 0;
  let farArmAngle = 0;   // far arm (left)
  let nearArmAngle = 0;  // near arm (right, holding briefcase)
  let briefcaseTilt = 0;

  if (isWalking) {
    const w = walkPhase * Math.PI * 2;
    bob = -Math.abs(Math.sin(w)) * 5.5;
    torsoLean = 0.04 + Math.sin(w) * 0.015;

    const stride = 0.40;
    // Near leg (right) and far leg (left)
    rightLegAngle = Math.sin(w) * stride;
    leftLegAngle = Math.sin(w + Math.PI) * stride;

    // Knee flex
    rightKneeAngle = Math.max(0, -Math.sin(w) * 0.52);
    leftKneeAngle = Math.max(0, -Math.sin(w + Math.PI) * 0.52);

    // Far arm (left free arm) swings
    farArmAngle = -Math.sin(w) * 0.38;

    // Near arm (right briefcase arm) has subtle pendulum swing
    nearArmAngle = Math.sin(w) * 0.14;
    briefcaseTilt = nearArmAngle * 0.8;
  } else {
    torsoLean = 0.02;
    rightLegAngle = 0.02;
    leftLegAngle = -0.04;
    rightKneeAngle = 0.02;
    leftKneeAngle = 0.02;
    farArmAngle = armReach > 0 ? -1.15 * armReach : 0.05;
    nearArmAngle = 0.02;
    briefcaseTilt = 0.01;
  }

  ctx.translate(0, bob);

  // --- 1. FAR ARM (drawn behind body if swinging back) ---
  const renderFarArm = () => {
    ctx.save();
    ctx.translate(-4, -175); // Far shoulder
    ctx.rotate(farArmAngle);

    ctx.fillStyle = RED_DEEP;
    // Upper arm
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 48, 4);
    ctx.fill();

    // Forearm
    ctx.translate(0, 44);
    if (armReach > 0) {
      ctx.rotate(-0.55 * armReach);
    }
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 44, 3);
    ctx.fill();

    // Hand
    ctx.translate(0, 42);
    ctx.beginPath();
    ctx.arc(0, 4, 5, 0, Math.PI * 2);
    ctx.fill();

    if (armReach > 0.3) {
      // Reaching fingers
      ctx.fillRect(-2, 3, 10, 5);
    }

    ctx.restore();
  };

  if (farArmAngle > 0 || armReach > 0) {
    // If far arm is swinging back or reaching forward, draw according to depth
    renderFarArm();
  }

  // --- 2. FAR LEG (LEFT LEG) ---
  const renderLeg = (angle, kneeBend, isFar) => {
    ctx.save();
    ctx.translate(isFar ? -6 : 4, -118); // Hip joint
    ctx.rotate(angle);

    ctx.fillStyle = isFar ? RED_DEEP : RED;

    // Thigh (classic tailored trousers)
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.lineTo(10, 64);
    ctx.lineTo(-10, 64);
    ctx.closePath();
    ctx.fill();

    // Knee
    ctx.translate(0, 64);
    ctx.rotate(kneeBend);

    ctx.beginPath();
    ctx.arc(0, 0, 9.8, 0, Math.PI * 2);
    ctx.fill();

    // Trouser Shin / Calf
    ctx.beginPath();
    ctx.moveTo(-9.8, 0);
    ctx.lineTo(9.8, 0);
    ctx.lineTo(12, 58);
    ctx.lineTo(-11, 58);
    ctx.closePath();
    ctx.fill();

    // Crease line
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(1, 4);
    ctx.lineTo(2, 54);
    ctx.stroke();

    // Shoe
    ctx.translate(0, 58);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(21, 8);
    ctx.lineTo(20, 14);
    ctx.lineTo(-11, 14);
    ctx.lineTo(-11, 3);
    ctx.closePath();
    ctx.fill();

    // Shoe heel notch
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-11, 9, 5, 5);

    ctx.restore();
  };

  // Draw far leg first
  renderLeg(leftLegAngle, leftKneeAngle, true);

  // --- 3. TORSO IN PROFILE (1971 TWO-PIECE SUIT) ---
  ctx.save();
  ctx.translate(0, -118); // Hip level
  ctx.rotate(torsoLean);

  // Suit jacket body (profile view: chest forward at right, back curve at left)
  ctx.fillStyle = RED;
  ctx.beginPath();
  // Start at back of neck / collar
  ctx.moveTo(-12, -74);
  // Curve down back of jacket
  ctx.bezierCurveTo(-18, -48, -17, -15, -16, 16);
  // Lower jacket hemline
  ctx.lineTo(14, 18);
  // Front jacket line (buttoned front edge)
  ctx.lineTo(16, -25);
  // Chest / Lapel protrusion in profile
  ctx.bezierCurveTo(18, -45, 17, -62, 12, -74);
  // Across shoulder seam to back neck
  ctx.closePath();
  ctx.fill();

  // White Shirt Collar in negative space (profile notch)
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(10, -74);
  ctx.lineTo(15, -60);
  ctx.lineTo(5, -60);
  ctx.lineTo(4, -74);
  ctx.closePath();
  ctx.fill();

  // 1971 Wide Lapel Profile Line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(11, -74);
  ctx.lineTo(17, -54);
  ctx.lineTo(10, -32);
  ctx.stroke();

  // Red Necktie in profile peeking between lapel
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(8, -68);
  ctx.lineTo(11, -68);
  ctx.lineTo(10, -48);
  ctx.lineTo(7, -48);
  ctx.closePath();
  ctx.fill();

  // Suit Pocket Flap in profile
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-2, -5);
  ctx.lineTo(12, -5);
  ctx.stroke();

  // Jacket back vent line in negative space
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(-14, 16);
  ctx.stroke();

  // --- 4. HEAD & PROFILE (1970s DIGNIFIED BUSINESSMAN) ---
  // Neck in profile
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-9, -74);
  ctx.lineTo(-8, -90);
  ctx.lineTo(7, -90);
  ctx.lineTo(9, -74);
  ctx.closePath();
  ctx.fill();

  // Shirt collar band at base of neck (negative space slit)
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-8, -75);
  ctx.lineTo(8, -75);
  ctx.stroke();

  // Head in Profile
  ctx.beginPath();
  ctx.moveTo(-8, -90);              // nape of neck
  ctx.lineTo(-11, -100);            // base of skull
  ctx.bezierCurveTo(-15, -114, -13, -128, 0, -132); // back of skull & crown
  ctx.bezierCurveTo(9, -132, 14, -127, 14, -118);   // crown to forehead
  ctx.lineTo(14, -112);             // forehead
  ctx.lineTo(18.5, -108);           // strong straight nose
  ctx.lineTo(14, -105);             // philtrum
  ctx.lineTo(14.5, -102);           // upper lip
  ctx.lineTo(13, -100);             // lower lip
  ctx.lineTo(14, -96);              // strong chin
  ctx.lineTo(4, -92);               // jawline sloping back to ear
  ctx.closePath();
  ctx.fill();

  // 1971 Haircut: side parting line and neat ear contour
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-7, -120);
  ctx.quadraticCurveTo(2, -122, 12, -116);
  ctx.stroke();

  // Ear in profile
  ctx.beginPath();
  ctx.arc(-1, -104, 3.5, -Math.PI * 0.45, Math.PI * 0.55);
  ctx.stroke();

  ctx.restore(); // Torso

  // --- 5. NEAR LEG (RIGHT LEG) ---
  renderLeg(rightLegAngle, rightKneeAngle, false);

  // --- 6. NEAR ARM & BRIEFCASE (RIGHT ARM) ---
  ctx.save();
  ctx.translate(torsoLean * 15, -188 + bob); // Near shoulder socket
  ctx.rotate(nearArmAngle);

  // Upper arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6.5, 0, 13, 48, 4);
  ctx.fill();

  // Negative space seam separating arm from torso
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-6.5, 4);
  ctx.lineTo(-6.5, 44);
  ctx.stroke();

  // Forearm
  ctx.translate(0, 44);
  ctx.beginPath();
  ctx.roundRect(-5.5, 0, 11, 44, 3);
  ctx.fill();

  // White shirt cuff cutout
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-5.5, 38);
  ctx.lineTo(5.5, 38);
  ctx.stroke();

  // Hand gripping briefcase handle
  ctx.translate(0, 40);
  ctx.beginPath();
  ctx.arc(0, 5, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // BRIEFCASE
  if (briefcase) {
    ctx.save();
    ctx.translate(1, 9);
    ctx.rotate(briefcaseTilt);

    // Arched Handle
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.arc(0, -6, 7.5, Math.PI, 0, false);
    ctx.stroke();

    // Attache Body
    const bw = 54;
    const bh = 38;
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.roundRect(-bw / 2, 0, bw, bh, 3);
    ctx.fill();

    // Negative space center seam
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 1, bh / 2);
    ctx.lineTo(bw / 2 - 1, bh / 2);
    ctx.stroke();

    // Twin latches
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-15, bh / 2 - 2.5, 4.5, 5);
    ctx.fillRect(10.5, bh / 2 - 2.5, 4.5, 5);

    // Chrome corner guards
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.0;
    ctx.strokeRect(-bw / 2 + 1, 1, 5, 5);
    ctx.strokeRect(bw / 2 - 6, 1, 5, 5);
    ctx.strokeRect(-bw / 2 + 1, bh - 6, 5, 5);
    ctx.strokeRect(bw / 2 - 6, bh - 6, 5, 5);

    ctx.restore();
  }

  ctx.restore(); // Near arm
  ctx.restore(); // Base
}

ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 1920, 1080);

drawProfileMan(ctx, { x: 450, y: 750, scale: 1.5, walkPhase: 0.25, isWalking: true });
drawProfileMan(ctx, { x: 960, y: 750, scale: 1.5, walkPhase: 0.75, isWalking: true });
drawProfileMan(ctx, { x: 1470, y: 750, scale: 1.5, armReach: 0.85, isWalking: false });

const outPath = path.join(__dirname, 'test_profile_man.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('Saved:', outPath);
