const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');

const RED = '#FF2020';
const RED_BRIGHT = '#FF3B3B';
const RED_DEEP = '#B21414';
const CUTOUT = '#000000';

function drawCinematicMan(ctx, options = {}) {
  const {
    x = 960,
    y = 800,
    scale = 1.4,
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
  let torsoLean = 0.025;
  let nearLegAngle = 0;
  let farLegAngle = 0;
  let nearKneeAngle = 0;
  let farKneeAngle = 0;
  let nearArmAngle = 0;
  let farArmAngle = 0;
  let briefcaseTilt = 0;

  if (isWalking) {
    const cycle = walkPhase * Math.PI * 2;
    bob = -Math.abs(Math.sin(cycle)) * 5;
    torsoLean = 0.03 + Math.sin(cycle) * 0.01;

    const stride = 0.40;
    nearLegAngle = Math.sin(cycle) * stride;
    farLegAngle = Math.sin(cycle + Math.PI) * stride;

    nearKneeAngle = Math.max(0, -Math.sin(cycle) * 0.48);
    farKneeAngle = Math.max(0, -Math.sin(cycle + Math.PI) * 0.48);

    farArmAngle = -Math.sin(cycle) * 0.35;
    nearArmAngle = Math.sin(cycle) * 0.12;
    briefcaseTilt = nearArmAngle * 0.85;
  } else {
    torsoLean = 0.015;
    nearLegAngle = 0.02;
    farLegAngle = -0.03;
    nearKneeAngle = 0.02;
    farKneeAngle = 0.02;
    farArmAngle = armReach > 0 ? -1.15 * armReach : 0.04;
    nearArmAngle = 0.02;
    briefcaseTilt = 0.01;
  }

  ctx.translate(0, bob);

  // --- FAR ARM (Left arm, swinging opposite or reaching) ---
  ctx.save();
  ctx.translate(-2, -135); // Shoulder
  ctx.rotate(farArmAngle);

  ctx.fillStyle = RED_DEEP;
  // Bicep
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 46, 4);
  ctx.fill();

  // Forearm
  ctx.translate(0, 44);
  if (armReach > 0) {
    ctx.rotate(-0.55 * armReach);
  }
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 42, 3);
  ctx.fill();

  // Hand
  ctx.translate(0, 40);
  ctx.beginPath();
  ctx.arc(0, 4, 5, 0, Math.PI * 2);
  ctx.fill();
  if (armReach > 0.25) {
    ctx.fillRect(-2, 2, 10, 5);
  }
  ctx.restore();

  // --- FAR LEG (Left leg) ---
  const drawLeg = (angle, kneeBend, isBack) => {
    ctx.save();
    ctx.translate(isBack ? -4 : 4, -95); // Hip
    ctx.rotate(angle);

    ctx.fillStyle = isBack ? RED_DEEP : RED;

    // Thigh
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(11, 0);
    ctx.lineTo(9.5, 52);
    ctx.lineTo(-9.5, 52);
    ctx.closePath();
    ctx.fill();

    // Knee & Shin
    ctx.translate(0, 52);
    ctx.rotate(kneeBend);

    ctx.beginPath();
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    ctx.fill();

    // Lower trouser
    ctx.beginPath();
    ctx.moveTo(-9.5, 0);
    ctx.lineTo(9.5, 0);
    ctx.lineTo(11.5, 48);
    ctx.lineTo(-10.5, 48);
    ctx.closePath();
    ctx.fill();

    // Shoe
    ctx.translate(0, 48);
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(8, 0);
    ctx.lineTo(18, 7);
    ctx.lineTo(18, 12);
    ctx.lineTo(-10, 12);
    ctx.lineTo(-10, 3);
    ctx.closePath();
    ctx.fill();

    // Heel cutout
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-10, 7, 4, 5);

    ctx.restore();
  };

  // Draw far leg first
  drawLeg(farLegAngle, farKneeAngle, true);

  // --- TORSO & COAT (Profile / 3/4) ---
  ctx.save();
  ctx.translate(0, -95);
  ctx.rotate(torsoLean);

  // Coat skirt
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-17, -25);
  ctx.lineTo(17, -25);
  ctx.lineTo(19, 18);
  ctx.lineTo(-17, 18);
  ctx.closePath();
  ctx.fill();

  // Negative space jacket vent slit
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(0, 18);
  ctx.stroke();

  // Upper Torso / Chest
  ctx.beginPath();
  ctx.moveTo(-19, -68); // back shoulder
  ctx.lineTo(19, -68);  // chest shoulder
  ctx.lineTo(16, -25);  // front waist
  ctx.lineTo(-16, -25); // back waist
  ctx.closePath();
  ctx.fill();

  // White Shirt Collar opening (Negative space cutout)
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(2, -68);
  ctx.lineTo(12, -68);
  ctx.lineTo(6, -45);
  ctx.lineTo(0, -45);
  ctx.closePath();
  ctx.fill();

  // Red Necktie in cutout
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(4, -62);
  ctx.lineTo(8, -62);
  ctx.lineTo(7, -38);
  ctx.lineTo(5, -38);
  ctx.closePath();
  ctx.fill();

  // 1971 Suit Lapel seam in negative space
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(14, -66);
  ctx.lineTo(8, -45);
  ctx.lineTo(3, -24);
  ctx.stroke();

  // --- NECK & SLEEK MINIMALIST PROFILE HEAD ---
  // Neck
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-7, -68);
  ctx.lineTo(-6, -82);
  ctx.lineTo(6, -82);
  ctx.lineTo(8, -68);
  ctx.closePath();
  ctx.fill();

  // Shirt collar collar band at neck base
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-6, -69);
  ctx.lineTo(8, -69);
  ctx.stroke();

  // Clean, confident, iconic mid-century silhouette head:
  ctx.beginPath();
  ctx.moveTo(-6, -82);              // nape
  ctx.bezierCurveTo(-15, -86, -16, -106, -6, -112); // occiput & crown
  ctx.bezierCurveTo(3, -114, 11, -111, 12, -102);   // crown to forehead
  ctx.lineTo(12, -96);              // clean forehead slope
  ctx.lineTo(16, -93);              // crisp straight nose
  ctx.lineTo(12.5, -90);            // under nose
  ctx.lineTo(13, -87);              // upper lip & mouth
  ctx.lineTo(12, -84);              // strong chin
  ctx.lineTo(4, -82);               // jawline
  ctx.closePath();
  ctx.fill();

  // 1971 side-parted hair line (clean, restrained negative space)
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(-6, -104);
  ctx.quadraticCurveTo(1, -106, 9, -101);
  ctx.stroke();

  // Ear contour
  ctx.beginPath();
  ctx.arc(0, -92, 3, -Math.PI * 0.45, Math.PI * 0.55);
  ctx.stroke();

  ctx.restore(); // Torso

  // --- NEAR LEG (Right leg) ---
  drawLeg(nearLegAngle, nearKneeAngle, false);

  // --- NEAR ARM & BRIEFCASE (Right arm) ---
  ctx.save();
  ctx.translate(6, -163 + bob); // Near shoulder socket
  ctx.rotate(nearArmAngle);

  // Upper arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 46, 4);
  ctx.fill();

  // Arm separation line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-6, 4);
  ctx.lineTo(-6, 42);
  ctx.stroke();

  // Forearm
  ctx.translate(0, 44);
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 42, 3);
  ctx.fill();

  // Shirt cuff slit
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, 36);
  ctx.lineTo(5, 36);
  ctx.stroke();

  // Hand
  ctx.translate(0, 38);
  ctx.beginPath();
  ctx.arc(0, 4, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // BRIEFCASE
  if (briefcase) {
    ctx.save();
    ctx.translate(1, 8);
    ctx.rotate(briefcaseTilt);

    // Arched Handle
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.arc(0, -5, 7.5, Math.PI, 0, false);
    ctx.stroke();

    // Attache Case Body
    const bw = 54;
    const bh = 36;
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.roundRect(-bw / 2, 0, bw, bh, 3);
    ctx.fill();

    // Center seam in negative space
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 1, bh / 2);
    ctx.lineTo(bw / 2 - 1, bh / 2);
    ctx.stroke();

    // Latches
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-15, bh / 2 - 2.5, 4.5, 5);
    ctx.fillRect(10.5, bh / 2 - 2.5, 4.5, 5);

    // Corner brackets
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

drawCinematicMan(ctx, { x: 450, y: 750, scale: 1.6, walkPhase: 0.25, isWalking: true });
drawCinematicMan(ctx, { x: 960, y: 750, scale: 1.6, walkPhase: 0.75, isWalking: true });
drawCinematicMan(ctx, { x: 1470, y: 750, scale: 1.6, armReach: 0.85, isWalking: false });

const outPath = path.join(__dirname, 'test_cinematic_man.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('Saved:', outPath);
