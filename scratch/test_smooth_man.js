const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');

const RED = '#FF2020';
const RED_BRIGHT = '#FF3B3B';
const RED_DEEP = '#A41212';
const CUTOUT = '#000000';

function drawSmoothMan(ctx, options = {}) {
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
  let torsoTilt = 0.02;
  let nearLegAngle = 0;
  let farLegAngle = 0;
  let nearKneeAngle = 0;
  let farKneeAngle = 0;
  let nearArmAngle = 0;
  let farArmAngle = 0;
  let briefcaseTilt = 0;

  if (isWalking) {
    const cycle = walkPhase * Math.PI * 2;
    bob = -Math.abs(Math.sin(cycle)) * 4.5;
    torsoTilt = 0.025 + Math.sin(cycle) * 0.008;

    const stride = 0.38;
    nearLegAngle = Math.sin(cycle) * stride;
    farLegAngle = Math.sin(cycle + Math.PI) * stride;

    nearKneeAngle = Math.max(0, -Math.sin(cycle) * 0.45);
    farKneeAngle = Math.max(0, -Math.sin(cycle + Math.PI) * 0.45);

    farArmAngle = -Math.sin(cycle) * 0.32;
    nearArmAngle = Math.sin(cycle) * 0.12;
    briefcaseTilt = nearArmAngle * 0.85;
  } else {
    torsoTilt = 0.01;
    nearLegAngle = 0.02;
    farLegAngle = -0.03;
    nearKneeAngle = 0.02;
    farKneeAngle = 0.02;
    farArmAngle = armReach > 0 ? -1.15 * armReach : 0.04;
    nearArmAngle = 0.02;
    briefcaseTilt = 0.01;
  }

  ctx.translate(0, bob);

  // --- 1. FAR ARM (Left arm) ---
  ctx.save();
  ctx.translate(-2, -145);
  ctx.rotate(farArmAngle);

  ctx.fillStyle = RED_DEEP;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 46, 5);
  ctx.fill();

  ctx.translate(0, 44);
  if (armReach > 0) {
    ctx.rotate(-0.50 * armReach);
  }
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 42, 4);
  ctx.fill();

  ctx.translate(0, 40);
  ctx.beginPath();
  ctx.arc(0, 4, 5.5, 0, Math.PI * 2);
  ctx.fill();
  if (armReach > 0.25) {
    ctx.fillRect(-2, 2, 10, 5);
  }
  ctx.restore();

  // --- 2. FAR LEG (Left leg) ---
  const drawLeg = (angle, kneeBend, isBack) => {
    ctx.save();
    ctx.translate(isBack ? -4 : 4, -105);
    ctx.rotate(angle);

    ctx.fillStyle = isBack ? RED_DEEP : RED;

    // Thigh
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.lineTo(10, 56);
    ctx.lineTo(-10, 56);
    ctx.closePath();
    ctx.fill();

    // Knee & Shin
    ctx.translate(0, 56);
    ctx.rotate(kneeBend);

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(12, 52);
    ctx.lineTo(-11, 52);
    ctx.closePath();
    ctx.fill();

    // Shoe
    ctx.translate(0, 52);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(9, 0);
    ctx.lineTo(20, 7);
    ctx.lineTo(19, 13);
    ctx.lineTo(-11, 13);
    ctx.lineTo(-11, 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-11, 8, 4.5, 5);

    ctx.restore();
  };

  drawLeg(farLegAngle, farKneeAngle, true);

  // --- 3. TORSO & COAT (Profile) ---
  ctx.save();
  ctx.translate(0, -105);
  ctx.rotate(torsoTilt);

  ctx.fillStyle = RED;
  // Natural suit jacket silhouette
  ctx.beginPath();
  ctx.moveTo(-14, -72); // back collar
  ctx.bezierCurveTo(-20, -50, -19, -20, -18, 16); // natural back curve into skirt
  ctx.lineTo(15, 16);  // bottom hem
  ctx.bezierCurveTo(18, -10, 20, -45, 12, -72);   // chest curve into front collar
  ctx.closePath();
  ctx.fill();

  // White shirt collar opening in negative space
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(3, -72);
  ctx.lineTo(13, -72);
  ctx.lineTo(7, -48);
  ctx.lineTo(1, -48);
  ctx.closePath();
  ctx.fill();

  // Red necktie inside cutout
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(5, -66);
  ctx.lineTo(9, -66);
  ctx.lineTo(8, -42);
  ctx.lineTo(6, -42);
  ctx.closePath();
  ctx.fill();

  // Suit lapel seam line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(13, -70);
  ctx.lineTo(9, -46);
  ctx.lineTo(4, -22);
  ctx.stroke();

  // --- 4. MATURE BUSINESSMAN HEAD IN PROFILE ---
  // Neck
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-9, -72);
  ctx.lineTo(-7, -84);
  ctx.lineTo(6, -84);
  ctx.lineTo(8, -72);
  ctx.closePath();
  ctx.fill();

  // Shirt collar ring in negative space
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-7, -73);
  ctx.lineTo(8, -73);
  ctx.stroke();

  // Head Profile
  ctx.beginPath();
  ctx.moveTo(-7, -84);                               // nape
  ctx.bezierCurveTo(-18, -88, -19, -108, -6, -115); // occiput to crown
  ctx.bezierCurveTo(4, -117, 13, -114, 14, -104);   // crown to forehead
  ctx.lineTo(14, -98);                              // forehead
  ctx.lineTo(19, -94);                              // nose
  ctx.lineTo(15, -91);                              // under nose
  ctx.lineTo(15.5, -88);                            // lips
  ctx.lineTo(14, -85);                              // chin
  ctx.lineTo(4, -83);                               // jawline
  ctx.closePath();
  ctx.fill();

  // Side part hair line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-7, -106);
  ctx.quadraticCurveTo(1, -108, 11, -103);
  ctx.stroke();

  // Ear
  ctx.beginPath();
  ctx.arc(-1, -94, 3.5, -Math.PI * 0.45, Math.PI * 0.55);
  ctx.stroke();

  ctx.restore(); // Torso

  // --- 5. NEAR LEG (Right leg) ---
  drawLeg(nearLegAngle, nearKneeAngle, false);

  // --- 6. NEAR ARM & BRIEFCASE (Right arm) ---
  ctx.save();
  ctx.translate(5, -177 + bob);
  ctx.rotate(nearArmAngle);

  // Upper arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 46, 5);
  ctx.fill();

  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-6, 4);
  ctx.lineTo(-6, 40);
  ctx.stroke();

  // Forearm
  ctx.translate(0, 44);
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 42, 4);
  ctx.fill();

  // Shirt cuff
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

    ctx.strokeStyle = RED;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, -5, 7.5, Math.PI, 0, false);
    ctx.stroke();

    const bw = 54;
    const bh = 36;
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.roundRect(-bw / 2, 0, bw, bh, 3);
    ctx.fill();

    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-bw / 2 + 1, bh / 2);
    ctx.lineTo(bw / 2 - 1, bh / 2);
    ctx.stroke();

    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-15, bh / 2 - 2.5, 4.5, 5);
    ctx.fillRect(10.5, bh / 2 - 2.5, 4.5, 5);

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

drawSmoothMan(ctx, { x: 450, y: 750, scale: 1.5, walkPhase: 0.25, isWalking: true });
drawSmoothMan(ctx, { x: 960, y: 750, scale: 1.5, walkPhase: 0.75, isWalking: true });
drawSmoothMan(ctx, { x: 1470, y: 750, scale: 1.5, armReach: 0.85, isWalking: false });

const outPath = path.join(__dirname, 'test_smooth_man.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('Saved:', outPath);
