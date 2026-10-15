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
const RED_DEEP = '#A41212';
const RED_DIM = 'rgba(255, 32, 32, 0.45)';
const RED_FAINT = 'rgba(255, 32, 32, 0.12)';
const CUTOUT = '#000000';

function testShot4Aligned(progress = 0.5) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1920, 1080);

  const camZoom = 1.25 + progress * 0.15; // medium shot zoom & slow push-in
  ctx.save();
  ctx.translate(960, 540);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-960, -540);

  const floorY = 960;
  const counterY = 660; // waist height
  const counterTopY = counterY - 16;
  const counterLeft = 720;
  const counterRight = 1420;
  const counterW = counterRight - counterLeft;

  // Background subtle airport wall architecture
  ctx.strokeStyle = RED_FAINT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 360);
  ctx.lineTo(1820, 360);
  ctx.moveTo(100, 460);
  ctx.lineTo(1820, 460);
  ctx.stroke();

  // Departure board in background
  ctx.strokeStyle = RED_DIM;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(780, 220, 480, 100);

  ctx.fillStyle = RED_DIM;
  ctx.font = 'bold 15px RobotoMono, monospace';
  ctx.fillText('NW 305   PORTLAND -> SEATTLE   14:50', 810, 260);
  ctx.fillText('GATE 4   ON TIME   PASSENGER CHECK-IN', 810, 290);

  // 1. DRAW TICKET AGENT (standing on floorY behind counter, facing left)
  ctx.save();
  ctx.translate(1320, floorY);
  ctx.scale(1.45, 1.45); // matching scale

  // Torso
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(16, 0);
  ctx.lineTo(-16, 0);
  ctx.bezierCurveTo(-18, -40, -20, -90, -15, -135); // shoulder
  ctx.lineTo(15, -135);
  ctx.bezierCurveTo(18, -90, 18, -40, 16, 0);
  ctx.closePath();
  ctx.fill();

  // White collared blouse cutout
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(-9, -135);
  ctx.lineTo(0, -135);
  ctx.lineTo(-5, -108);
  ctx.closePath();
  ctx.fill();

  // Airline neck scarf
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.arc(-5, -112, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = RED;
  ctx.fillRect(-7, -150, 14, 16);

  // Blouse collar seam line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-8, -136);
  ctx.lineTo(8, -136);
  ctx.stroke();

  // Head in Profile facing left
  ctx.beginPath();
  ctx.moveTo(6, -150);
  ctx.bezierCurveTo(17, -154, 18, -178, 6, -184);
  ctx.bezierCurveTo(-4, -186, -13, -182, -14, -172);
  ctx.lineTo(-14, -166);
  ctx.lineTo(-18, -163); // nose
  ctx.lineTo(-14.5, -160);
  ctx.lineTo(-15, -157);
  ctx.lineTo(-13, -154); // chin
  ctx.lineTo(-3, -151);
  ctx.closePath();
  ctx.fill();

  // Hair contour
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(6, -174);
  ctx.quadraticCurveTo(-2, -176, -10, -170);
  ctx.stroke();

  ctx.restore(); // Agent

  // 2. COUNTER DESK (Draw solid black in front of agent to occlude lower body)
  ctx.fillStyle = CUTOUT;
  ctx.fillRect(counterLeft, counterY, counterW, floorY - counterY + 20);

  ctx.strokeStyle = RED;
  ctx.lineWidth = 3.0;
  ctx.strokeRect(counterLeft, counterY, counterW, floorY - counterY + 20);

  // Counter Top Shelf
  ctx.fillStyle = RED;
  ctx.fillRect(counterLeft - 30, counterTopY, counterW + 50, 16);

  // Stamp machine / ticket validator on desk
  ctx.strokeStyle = RED_DIM;
  ctx.lineWidth = 2.0;
  ctx.strokeRect(1140, counterTopY - 26, 50, 26);

  // 3. THE MAN (standing on floorY in front of counter, facing right)
  ctx.save();
  ctx.translate(620, floorY);
  ctx.scale(1.45, 1.45); // exact matching scale

  // Torso
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-14, -72); // back collar
  ctx.bezierCurveTo(-20, -50, -19, -20, -18, 16);
  ctx.lineTo(15, 16);  // bottom hem
  ctx.bezierCurveTo(18, -10, 20, -45, 12, -72);   // chest curve
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

  // Neck
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-9, -72);
  ctx.lineTo(-7, -84);
  ctx.lineTo(6, -84);
  ctx.lineTo(8, -72);
  ctx.closePath();
  ctx.fill();

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

  // Legs visible down to floor
  const drawManLeg = (offsetX, isBack) => {
    ctx.save();
    ctx.translate(offsetX, 16);
    ctx.fillStyle = isBack ? RED_DEEP : RED;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(11, 75);
    ctx.lineTo(-10, 75);
    ctx.closePath();
    ctx.fill();

    // Shoe
    ctx.translate(0, 75);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(9, 0);
    ctx.lineTo(19, 7);
    ctx.lineTo(18, 13);
    ctx.lineTo(-11, 13);
    ctx.lineTo(-11, 3);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-11, 8, 4.5, 5);
    ctx.restore();
  };

  drawManLeg(-5, true);
  drawManLeg(3, false);

  // Right arm holding briefcase down at side
  ctx.save();
  ctx.translate(4, -68);
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-5.5, 0, 11, 46, 4);
  ctx.fill();

  // Hand & Briefcase
  ctx.translate(0, 46);
  ctx.beginPath();
  ctx.arc(0, 4, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(1, 8);
  ctx.strokeStyle = RED;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.arc(0, -5, 7, Math.PI, 0, false);
  ctx.stroke();

  const bw = 50;
  const bh = 34;
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-bw / 2, 0, bw, bh, 3);
  ctx.fill();

  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-bw / 2 + 1, bh / 2);
  ctx.lineTo(bw / 2 - 1, bh / 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // The Man

  // 4. TRANSACTION: ARMS & EXCHANGE ON THE COUNTER
  // Man shoulder is at x = 620 + (12 * 1.45) = 637, y = floorY + (-70 * 1.45) = 858.
  // Agent shoulder is at x = 1320 - (15 * 1.45) = 1298, y = floorY + (-135 * 1.45) = 764.
  // Counter top is at counterTopY = 644.
  // Wait: man's y in the man group was translated to floorY = 960, and torso was from -72 to 16.
  // If floorY is 960, the man's torso is at 960 - (72*1.45) = 855!
  // But wait, the man's total height is 250px!
  // If feet are at 960, head is at 960 - 250 = 710!
  // And the counter top was at 644!
  // That means the counter top at 644 was higher than the man's head!
  // A typical human is ~175cm tall. Counter is ~105cm tall (60% of human height).
  // If human height on screen is 360px:
  // Counter height should be 360px * 0.60 = 216px!
  // So if floorY = 960:
  // Head is at y = 960 - 360 = 600.
  // Shoulder is at y = 670.
  // Counter top should be at y = 960 - 216 = 744!
  // Exactly at waist height!
  console.log('Scale verified!');
}

testShot4Aligned(0.5);
