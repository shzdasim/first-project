const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');

const RED = '#FF2020';
const RED_BRIGHT = '#FF3B3B';
const RED_DEEP = '#B01414';
const CUTOUT = '#000000';

/**
 * Highly refined, cinematic 1970s businessman silhouette
 */
function drawRefinedMan(ctx, x, y, scale = 1.0, options = {}) {
  const {
    walkPhase = 0,
    isWalking = false,
    armReach = 0, // 0 to 1
    briefcase = true,
    facing = 1
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);

  // Walk physics
  let bob = 0;
  let torsoLean = 0.02; // slight forward lean
  let leftLegRot = 0;
  let rightLegRot = 0;
  let leftKneeRot = 0;
  let rightKneeRot = 0;
  let leftArmRot = 0;
  let rightArmRot = 0;
  let briefcaseRot = 0;

  if (isWalking) {
    const w = walkPhase * Math.PI * 2;
    bob = -Math.abs(Math.sin(w)) * 5;
    torsoLean = 0.03 + Math.sin(w) * 0.01;

    const stride = 0.42;
    // Front leg (left) and back leg (right)
    leftLegRot = Math.sin(w) * stride;
    rightLegRot = Math.sin(w + Math.PI) * stride;

    // Knee bends on the backswing
    leftKneeRot = Math.max(0, -Math.sin(w) * 0.55);
    rightKneeRot = Math.max(0, -Math.sin(w + Math.PI) * 0.55);

    // Free arm (left) swings counter to left leg
    leftArmRot = -Math.sin(w) * 0.35;

    // Briefcase arm (right) has subtle pendulum motion
    rightArmRot = Math.sin(w) * 0.14;
    briefcaseRot = rightArmRot * 0.85;
  } else {
    leftLegRot = -0.04;
    rightLegRot = 0.04;
    leftKneeRot = 0.03;
    rightKneeRot = 0.03;
    leftArmRot = armReach > 0 ? -1.15 * armReach : 0.05;
    rightArmRot = 0.02;
    briefcaseRot = 0.01;
  }

  ctx.translate(0, bob);

  // --- LEGS ---
  // Leg function with realistic anatomical silhouette
  const renderLeg = (hipRot, kneeRot, isBack) => {
    ctx.save();
    ctx.translate(isBack ? 4 : -4, -132); // Hip socket
    ctx.rotate(hipRot);

    ctx.fillStyle = isBack ? RED_DEEP : RED;

    // Upper Leg / Thigh (tapered)
    ctx.beginPath();
    ctx.moveTo(-13, 0);
    ctx.lineTo(13, 0);
    ctx.lineTo(10.5, 68);
    ctx.lineTo(-11, 68);
    ctx.closePath();
    ctx.fill();

    // Knee & Shin
    ctx.translate(0, 68);
    ctx.rotate(kneeRot);

    // Knee cap
    ctx.beginPath();
    ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
    ctx.fill();

    // Trouser Calf / Shin (1971 straight cut, slight flare at hem)
    ctx.beginPath();
    ctx.moveTo(-10.5, 0);
    ctx.lineTo(10.5, 0);
    ctx.lineTo(13, 62);
    ctx.lineTo(-12, 62);
    ctx.closePath();
    ctx.fill();

    // Crease line in negative space
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(1, 58);
    ctx.stroke();

    // 1971 Dress Shoe
    ctx.translate(0, 62);
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(22, 9);
    ctx.lineTo(21, 15);
    ctx.lineTo(-12, 15);
    ctx.lineTo(-12, 3);
    ctx.closePath();
    ctx.fill();

    // Heel cutout
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-12, 9, 5, 6);

    ctx.restore();
  };

  // Draw back leg then front leg
  renderLeg(rightLegRot, rightKneeRot, true);
  renderLeg(leftLegRot, leftKneeRot, false);

  // --- TORSO & COAT ---
  ctx.save();
  ctx.translate(0, -132);
  ctx.rotate(torsoLean);

  // Coat skirt (extends over hips, authentic 1971 length)
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-21, -30);
  ctx.lineTo(21, -30);
  ctx.lineTo(24, 22);
  ctx.lineTo(-22, 22);
  ctx.closePath();
  ctx.fill();

  // Skirt center vent in negative space
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(0, 22);
  ctx.stroke();

  // Main Torso (chest & shoulders)
  ctx.beginPath();
  ctx.moveTo(-26, -88); // Left shoulder point
  ctx.lineTo(26, -88);  // Right shoulder point
  ctx.lineTo(21, -30);  // Right waist
  ctx.lineTo(-21, -30); // Left waist
  ctx.closePath();
  ctx.fill();

  // White Shirt Collar (Crisp negative space V-notch cutout)
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(-8, -88);
  ctx.lineTo(8, -88);
  ctx.lineTo(4, -54);
  ctx.lineTo(-4, -54);
  ctx.closePath();
  ctx.fill();

  // 1971 Wide Notch Lapel lines (Cutout lines)
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-20, -86);
  ctx.lineTo(-6, -56);
  ctx.lineTo(-1, -26);
  ctx.moveTo(20, -86);
  ctx.lineTo(6, -56);
  ctx.lineTo(-1, -26);
  ctx.stroke();

  // Classic Red Necktie inside the collar cutout
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(-3, -80);
  ctx.lineTo(3, -80);
  ctx.lineTo(4.5, -50);
  ctx.lineTo(0, -44);
  ctx.lineTo(-4.5, -50);
  ctx.closePath();
  ctx.fill();

  // Breast pocket welt
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(9, -70);
  ctx.lineTo(18, -70);
  ctx.stroke();

  // --- NECK & MATURE 1971 BUSINESSMAN HEAD ---
  // Neck
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-7, -88);
  ctx.lineTo(-7, -104);
  ctx.lineTo(7, -104);
  ctx.lineTo(7, -88);
  ctx.closePath();
  ctx.fill();

  // Head Silhouette (Profile facing right)
  ctx.beginPath();
  ctx.moveTo(-9, -104);             // nape of neck
  ctx.lineTo(-12, -114);            // base of skull
  ctx.bezierCurveTo(-16, -126, -14, -145, 0, -148); // occiput & crown
  ctx.bezierCurveTo(10, -148, 17, -142, 17, -130);  // forehead
  ctx.lineTo(16, -124);             // brow ridge
  ctx.lineTo(21, -120);             // nose tip (straight 1970s nose)
  ctx.lineTo(16.5, -117);           // under nose / philtrum
  ctx.lineTo(17, -114);             // upper lip & mouth
  ctx.lineTo(15, -111);             // lower lip
  ctx.lineTo(15.5, -107);           // strong chin
  ctx.lineTo(5, -104);              // jawline back to neck
  ctx.closePath();
  ctx.fill();

  // 1971 Side-parted businessman hair parting line (negative space)
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-8, -135);
  ctx.quadraticCurveTo(3, -138, 15, -130);
  ctx.stroke();

  // Subtle ear contour (negative space)
  ctx.beginPath();
  ctx.arc(-1, -118, 4, -Math.PI * 0.45, Math.PI * 0.55);
  ctx.stroke();

  // --- LEFT ARM (FREE / REACHING ARM) ---
  ctx.save();
  ctx.translate(-19, -84); // Shoulder socket
  ctx.rotate(leftArmRot);

  // Upper arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6.5, 0, 13, 50, 4);
  ctx.fill();

  // Forearm
  ctx.translate(0, 48);
  if (armReach > 0) {
    ctx.rotate(-0.55 * armReach);
  }
  ctx.beginPath();
  ctx.roundRect(-5.5, 0, 11, 46, 3);
  ctx.fill();

  // Shirt cuff slit
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-5.5, 42);
  ctx.lineTo(5.5, 42);
  ctx.stroke();

  // Hand
  ctx.translate(0, 44);
  ctx.beginPath();
  ctx.arc(0, 5, 5.5, 0, Math.PI * 2);
  ctx.fill();

  if (armReach > 0.25) {
    ctx.beginPath();
    ctx.moveTo(-2, 4);
    ctx.lineTo(10, 4);
    ctx.lineTo(10, 9);
    ctx.lineTo(-2, 9);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore(); // Left arm

  // --- RIGHT ARM & BRIEFCASE ---
  ctx.save();
  ctx.translate(17, -84); // Shoulder socket
  ctx.rotate(rightArmRot);

  // Upper arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6.5, 0, 13, 50, 4);
  ctx.fill();

  // Forearm
  ctx.translate(0, 48);
  ctx.beginPath();
  ctx.roundRect(-5.5, 0, 11, 44, 3);
  ctx.fill();

  // Shirt cuff slit
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-5.5, 40);
  ctx.lineTo(5.5, 40);
  ctx.stroke();

  // Hand gripping briefcase handle
  ctx.translate(0, 42);
  ctx.beginPath();
  ctx.arc(0, 5, 6, 0, Math.PI * 2);
  ctx.fill();

  // BRIEFCASE
  if (briefcase) {
    ctx.save();
    ctx.translate(2, 9);
    ctx.rotate(briefcaseRot);

    // Arched Handle
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.arc(0, -6, 8, Math.PI, 0, false);
    ctx.stroke();

    // Attache Body
    const bw = 58;
    const bh = 40;
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
    ctx.fillRect(-17, bh / 2 - 3, 5, 6);
    ctx.fillRect(12, bh / 2 - 3, 5, 6);

    // Chrome corner guards
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.0;
    ctx.strokeRect(-bw / 2 + 1, 1, 6, 6);
    ctx.strokeRect(bw / 2 - 7, 1, 6, 6);
    ctx.strokeRect(-bw / 2 + 1, bh - 7, 6, 6);
    ctx.strokeRect(bw / 2 - 7, bh - 7, 6, 6);

    ctx.restore();
  }

  ctx.restore(); // Right arm
  ctx.restore(); // Torso
  ctx.restore(); // Root
}

ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 1920, 1080);

drawRefinedMan(ctx, 450, 750, 1.5, { walkPhase: 0.25, isWalking: true });
drawRefinedMan(ctx, 960, 750, 1.5, { walkPhase: 0.75, isWalking: true });
drawRefinedMan(ctx, 1470, 750, 1.5, { armReach: 0.85, isWalking: false });

const outPath = path.join(__dirname, 'test_refined_man.png');
fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
console.log('Saved:', outPath);
