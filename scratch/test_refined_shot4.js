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
const RED_DEEP = '#A01010';
const RED_DIM = 'rgba(255, 32, 32, 0.45)';
const RED_FAINT = 'rgba(255, 32, 32, 0.15)';
const CUTOUT = '#000000';

function drawDignifiedHeadClean(ctx, facing = 1) {
  ctx.save();
  ctx.scale(facing, 1);
  ctx.fillStyle = RED;

  // Clean, iconic mid-century silhouette head profile
  ctx.beginPath();
  ctx.moveTo(-9, -4);                                 // nape of neck
  ctx.bezierCurveTo(-18, -10, -20, -32, -8, -42);     // back of skull & 1971 tapered hair
  ctx.bezierCurveTo(-2, -47, 10, -47, 15, -38);       // crown & hairstyle volume
  ctx.bezierCurveTo(18, -32, 17, -26, 16, -20);       // forehead hairline & brow
  ctx.lineTo(21, -16);                                // straight, distinguished nose
  ctx.lineTo(16.5, -13);                              // under-nose base
  ctx.lineTo(17, -10);                                // upper lip
  ctx.lineTo(15, -9);                                 // neutral mouth slit
  ctx.lineTo(16, -6);                                 // lower lip
  ctx.lineTo(15, -4);                                 // chin indentation
  ctx.bezierCurveTo(16, 0, 14, 3, 10, 3);             // firm square chin
  ctx.lineTo(0, 0);                                   // jawline
  ctx.lineTo(-9, -4);                                 // neck
  ctx.closePath();
  ctx.fill();

  // Subtle 1971 side-part negative space line along the hair crown
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-6, -34);
  ctx.quadraticCurveTo(2, -37, 12, -31);
  ctx.stroke();

  ctx.restore();
}

function drawAgentHeadClean(ctx, facing = -1) {
  ctx.save();
  ctx.scale(facing, 1);
  ctx.fillStyle = RED;

  ctx.beginPath();
  ctx.moveTo(-8, -4);                                 // nape
  ctx.bezierCurveTo(-18, -8, -20, -28, -10, -38);     // back of neck to hair bun/updo
  ctx.bezierCurveTo(-4, -46, 8, -46, 14, -36);        // crown of hairstyle
  ctx.bezierCurveTo(17, -30, 16, -24, 15, -18);       // forehead
  ctx.lineTo(19.5, -15);                              // refined nose
  ctx.lineTo(15.5, -12);                              // under nose
  ctx.lineTo(16, -10);                                // lips
  ctx.lineTo(14, -9);
  ctx.lineTo(15, -6);
  ctx.lineTo(13, -3);                                 // chin
  ctx.bezierCurveTo(13, 0, 10, 2, 7, 2);
  ctx.lineTo(0, 0);                                   // jawline
  ctx.closePath();
  ctx.fill();

  // Hair contour in negative space
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-6, -32);
  ctx.quadraticCurveTo(2, -35, 11, -28);
  ctx.stroke();

  ctx.restore();
}

function testRefinedShot4(progress = 0.55) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1920, 1080);

  // Intimate Medium Two-Shot: Zoomed into the characters and counter
  // Progress 0 to 1 pushes in smoothly
  const camZoom = 1.82 + progress * 0.22; // 1.82x to 2.04x
  ctx.save();
  ctx.translate(960, 560);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-960, -560);

  const floorY = 900;
  const counterTopY = 640;
  const counterLeft = 710;
  const counterRight = 1210;
  const counterW = counterRight - counterLeft;

  // Background flight status board
  ctx.strokeStyle = RED_FAINT;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(700, 360, 520, 85);
  ctx.font = 'bold 15px RobotoMono, monospace';
  ctx.fillStyle = RED_DIM;
  ctx.fillText('NW 305   PORTLAND -> SEATTLE   14:50', 730, 395);
  ctx.fillText('STATUS: ON TIME    BOARDING    GATE 4', 730, 425);

  // 1. TICKET AGENT (Framed on right, standing behind counter)
  const agentX = 1130;
  const agentShoulderY = counterTopY - 110;

  ctx.save();
  ctx.translate(agentX, agentShoulderY);

  // Upper Torso / Blazer
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-22, 0);  // front shoulder
  ctx.lineTo(22, 0);   // back shoulder
  ctx.bezierCurveTo(26, 40, 24, 90, 20, 160);
  ctx.lineTo(-20, 160);
  ctx.bezierCurveTo(-24, 90, -26, 40, -22, 0);
  ctx.closePath();
  ctx.fill();

  // White blouse cutout
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.lineTo(-2, 0);
  ctx.lineTo(-8, 36);
  ctx.closePath();
  ctx.fill();

  // Red airline scarf
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.arc(-8, 30, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = RED;
  ctx.fillRect(-9, -20, 16, 22);

  // Head
  ctx.save();
  ctx.translate(-1, -20);
  drawAgentHeadClean(ctx, 1); // facing left
  ctx.restore();

  ctx.restore(); // Agent Upper Body

  // 2. COUNTER DESK (Solid black fill in front of agent to occlude lower body)
  ctx.fillStyle = CUTOUT;
  ctx.fillRect(counterLeft, counterTopY, counterW, floorY - counterTopY);

  ctx.strokeStyle = RED;
  ctx.lineWidth = 3.0;
  ctx.strokeRect(counterLeft, counterTopY, counterW, floorY - counterTopY);

  // Counter Top Shelf
  ctx.fillStyle = RED;
  ctx.fillRect(counterLeft - 30, counterTopY - 14, counterW + 50, 16);

  // Validator stamp machine on counter
  ctx.strokeStyle = RED_DIM;
  ctx.lineWidth = 2.0;
  ctx.strokeRect(counterRight - 110, counterTopY - 38, 48, 24);

  // 3. THE MIDDLE-AGED MAN (Framed on left, facing right)
  const manX = 790;
  const manShoulderY = counterTopY - 110;

  ctx.save();
  ctx.translate(manX, manShoulderY);

  // Torso / Suit Jacket
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(22, 0);   // front shoulder
  ctx.lineTo(-22, 0);  // back shoulder
  ctx.bezierCurveTo(-26, 40, -24, 90, -20, 160);
  ctx.lineTo(20, 160);
  ctx.bezierCurveTo(24, 90, 26, 40, 22, 0);
  ctx.closePath();
  ctx.fill();

  // White shirt collar cutout
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(2, 0);
  ctx.lineTo(14, 0);
  ctx.lineTo(8, 36);
  ctx.closePath();
  ctx.fill();

  // Red necktie
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(6, 4);
  ctx.lineTo(10, 4);
  ctx.lineTo(9, 32);
  ctx.lineTo(7, 32);
  ctx.closePath();
  ctx.fill();

  // Lapel seam
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(15, 2);
  ctx.lineTo(10, 36);
  ctx.lineTo(5, 70);
  ctx.stroke();

  // Neck
  ctx.fillStyle = RED;
  ctx.fillRect(-7, -20, 16, 22);

  // Head
  ctx.save();
  ctx.translate(1, -20);
  drawDignifiedHeadClean(ctx, 1); // facing right
  ctx.restore();

  // Right arm holding briefcase down at side
  ctx.save();
  ctx.translate(-14, 10);
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 54, 4);
  ctx.fill();

  // Forearm & Briefcase
  ctx.translate(0, 52);
  ctx.beginPath();
  ctx.roundRect(-5, 0, 10, 48, 3);
  ctx.fill();

  ctx.translate(1, 48);
  // Handle
  ctx.strokeStyle = RED;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.arc(0, -6, 7, Math.PI, 0, false);
  ctx.stroke();

  // Briefcase Body
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
  ctx.restore(); // Briefcase

  ctx.restore(); // Man Upper Body

  // 4. TRANSACTION DYNAMICS ACROSS COUNTER
  const p1 = Math.max(0, Math.min(1, progress / 0.35));
  const p2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.35));
  const p3 = Math.max(0, Math.min(1, (progress - 0.70) / 0.30));

  // Man's reaching arm with articulated elbow
  const manArmT = progress < 0.35 ? p1 : progress < 0.70 ? 0.45 : 0.45 + p3 * 0.55;
  const manHandX = 820 + manArmT * 125;
  const manHandY = counterTopY - 14;
  const manElbowX = manX + 16;
  const manElbowY = manShoulderY + 44;

  ctx.save();
  ctx.fillStyle = RED;
  ctx.strokeStyle = RED;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(manX + 14, manShoulderY + 6);
  ctx.lineTo(manElbowX, manElbowY);
  ctx.lineTo(manHandX, manHandY);
  ctx.stroke();

  // White cuff slit
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(manHandX - 10, manHandY - 4);
  ctx.lineTo(manHandX - 10, manHandY + 4);
  ctx.stroke();

  // Man Hand
  ctx.beginPath();
  ctx.arc(manHandX, manHandY, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Agent's reaching arm with articulated elbow
  const agentArmT = progress < 0.35 ? p1 * 0.7 : progress < 0.70 ? 0.7 + p2 * 0.3 : 1.0 - p3 * 0.4;
  const agentHandX = 1110 - agentArmT * 120;
  const agentHandY = counterTopY - 14;
  const agentElbowX = agentX - 16;
  const agentElbowY = agentShoulderY + 44;

  ctx.save();
  ctx.fillStyle = RED;
  ctx.strokeStyle = RED;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(agentX - 14, agentShoulderY + 6);
  ctx.lineTo(agentElbowX, agentElbowY);
  ctx.lineTo(agentHandX, agentHandY);
  ctx.stroke();

  // Agent Hand
  ctx.beginPath();
  ctx.arc(agentHandX, agentHandY, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Items exchanged:
  if (progress < 0.35) {
    // Folded cash payment ($20 bill fold)
    const billX = manHandX + 14;
    const billY = counterTopY - 14;
    ctx.save();
    ctx.fillStyle = RED_BRIGHT;
    ctx.fillRect(billX - 14, billY - 7, 28, 14);
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(billX - 14, billY - 7, 28, 14);
    ctx.restore();
  } else {
    // Red ticket envelope on counter
    const ticketX = progress < 0.70
      ? 1020 - p2 * 80
      : 940 - p3 * 25;
    const ticketY = counterTopY - 16;

    ctx.save();
    ctx.translate(ticketX, ticketY);

    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-34, -11, 68, 22);
    ctx.strokeStyle = RED_BRIGHT;
    ctx.lineWidth = 2.4;
    ctx.strokeRect(-34, -11, 68, 22);

    ctx.fillStyle = RED_BRIGHT;
    ctx.fillRect(-28, -6, 26, 2.5);
    ctx.fillRect(-28, 0, 46, 2.5);
    ctx.fillRect(-28, 5, 34, 2);

    ctx.font = 'bold 8px RobotoMono, monospace';
    ctx.fillText('SEATTLE', 6, -2);

    ctx.restore();
  }

  ctx.restore(); // camera
}

testRefinedShot4(0.55);
fs.writeFileSync(path.join(__dirname, 'test_shot4_refined.png'), canvas.toBuffer('image/png'));
console.log('Saved test_shot4_refined.png');
