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

/**
 * Distinguished 1971 Businessman Head Silhouette
 * (No floating circular ear, elegant masculine proportions)
 */
function drawDignifiedHead(ctx, facing = 1) {
  ctx.save();
  ctx.scale(facing, 1);
  ctx.fillStyle = RED;

  // Head Profile Contour
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

  // Subtle 1971 side-part negative space line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-6, -34);
  ctx.quadraticCurveTo(2, -37, 12, -31);
  ctx.stroke();

  // Clean hair sideburn / ear notch contour
  ctx.beginPath();
  ctx.moveTo(3, -18);
  ctx.lineTo(3, -8);
  ctx.quadraticCurveTo(0, -6, -2, -10);
  ctx.stroke();

  ctx.restore();
}

/**
 * Professional 1971 Airline Agent Head Silhouette
 */
function drawAgentHead(ctx, facing = -1) {
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

function testTwoShot(progress = 0.5) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1920, 1080);

  const camZoom = 1.28 + progress * 0.14; // smooth cinematic push-in
  ctx.save();
  ctx.translate(960, 540);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-960, -540);

  const floorY = 880;
  const counterTopY = 660; // waist height
  const counterLeft = 680;
  const counterRight = 1240;
  const counterW = counterRight - counterLeft;

  // Background flight status board
  ctx.strokeStyle = RED_FAINT;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(700, 220, 520, 95);
  ctx.font = 'bold 16px RobotoMono, monospace';
  ctx.fillStyle = RED_DIM;
  ctx.fillText('NW 305   PORTLAND -> SEATTLE   14:50', 730, 258);
  ctx.fillText('STATUS: ON TIME    BOARDING    GATE 4', 730, 290);

  // 1. TICKET AGENT (Framed comfortably on right, waist up above counter)
  const agentX = 1140;
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
  drawAgentHead(ctx, 1); // facing left
  ctx.restore();

  ctx.restore(); // Agent Upper Body

  // 2. COUNTER DESK (Draw solid black in front of agent's lower body)
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
  ctx.strokeRect(counterRight - 120, counterTopY - 38, 50, 24);

  // 3. THE MIDDLE-AGED MAN (Framed on left, facing right)
  const manX = 740;
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
  drawDignifiedHead(ctx, 1); // facing right
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
  ctx.restore();

  ctx.restore(); // Man Upper Body

  // 4. TRANSACTION DYNAMICS ACROSS THE COUNTER
  // Phases:
  // p1 (0.0 to 0.35): Man presents payment
  // p2 (0.35 to 0.70): Agent presents ticket envelope
  // p3 (0.70 to 1.00): Man receives ticket

  const p1 = Math.max(0, Math.min(1, progress / 0.35));
  const p2 = Math.max(0, Math.min(1, (progress - 0.35) / 0.35));
  const p3 = Math.max(0, Math.min(1, (progress - 0.70) / 0.30));

  // Man's reaching arm (front arm)
  const manArmT = progress < 0.35 ? p1 : progress < 0.70 ? 0.4 : 0.4 + p3 * 0.6;
  const manHandX = 760 + manArmT * 150;
  const manHandY = counterTopY - 14;

  ctx.save();
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(manX + 18, manShoulderY + 8);
  ctx.lineTo(manX + 8, manShoulderY + 8);
  ctx.lineTo(manHandX - 8, manHandY);
  ctx.lineTo(manHandX + 8, manHandY);
  ctx.closePath();
  ctx.fill();

  // White cuff
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(manHandX - 12, manHandY - 4);
  ctx.lineTo(manHandX - 12, manHandY + 4);
  ctx.stroke();

  // Man hand
  ctx.beginPath();
  ctx.arc(manHandX, manHandY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Agent's reaching arm
  const agentArmT = progress < 0.35 ? p1 * 0.7 : progress < 0.70 ? 0.7 + p2 * 0.3 : 1.0 - p3 * 0.4;
  const agentHandX = 1120 - agentArmT * 140;
  const agentHandY = counterTopY - 14;

  ctx.save();
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(agentX - 18, agentShoulderY + 8);
  ctx.lineTo(agentX - 8, agentShoulderY + 8);
  ctx.lineTo(agentHandX + 8, agentHandY);
  ctx.lineTo(agentHandX - 8, agentHandY);
  ctx.closePath();
  ctx.fill();

  // Agent hand
  ctx.beginPath();
  ctx.arc(agentHandX, agentHandY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Item exchange on counter:
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
      ? 1040 - p2 * 100
      : 940 - p3 * 30;
    const ticketY = counterTopY - 16;

    ctx.save();
    ctx.translate(ticketX, ticketY);

    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-32, -10, 64, 20);
    ctx.strokeStyle = RED_BRIGHT;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(-32, -10, 64, 20);

    ctx.fillStyle = RED_BRIGHT;
    ctx.fillRect(-26, -5, 24, 2.5);
    ctx.fillRect(-26, 0, 42, 2.5);
    ctx.fillRect(-26, 4, 30, 2);

    ctx.font = 'bold 7.5px RobotoMono, monospace';
    ctx.fillText('SEATTLE', 6, -2);

    ctx.restore();
  }

  ctx.restore(); // camera
}

testTwoShot(0.55);
fs.writeFileSync(path.join(__dirname, 'test_shot4_perfect.png'), canvas.toBuffer('image/png'));
console.log('Saved test_shot4_perfect.png');
