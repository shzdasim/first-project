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
const RED_DIM = 'rgba(255, 32, 32, 0.35)';
const RED_FAINT = 'rgba(255, 32, 32, 0.12)';
const CUTOUT = '#000000';

function testShot4(progress = 0.5) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1920, 1080);

  // Medium shot framing
  const camZoom = 1.0 + progress * 0.12; // slow cinematic push-in
  ctx.save();
  ctx.translate(960, 540);
  ctx.scale(camZoom, camZoom);
  ctx.translate(-960, -540);

  // Background subtle airport wall architecture
  ctx.strokeStyle = RED_FAINT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 320);
  ctx.lineTo(1820, 320);
  ctx.moveTo(100, 420);
  ctx.lineTo(1820, 420);
  ctx.stroke();

  // Departure board in background (NW 305 SEATTLE)
  ctx.strokeStyle = RED_DIM;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(700, 160, 520, 120);

  ctx.fillStyle = RED_DIM;
  ctx.font = 'bold 16px RobotoMono, monospace';
  ctx.fillText('NW 305   PORTLAND -> SEATTLE   14:50', 740, 210);
  ctx.fillText('STATUS: BOARDING ON TIME       GATE 4', 740, 245);

  const counterY = 640;
  const counterTopY = counterY - 16;
  const counterLeft = 560;
  const counterRight = 1360;

  // 1. Draw AGENT Upper Body BEHIND counter
  ctx.save();
  ctx.translate(1420, counterTopY);
  ctx.scale(1.9, 1.9);

  // Agent Torso
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(18, 120);
  ctx.lineTo(-18, 120);
  ctx.bezierCurveTo(-20, 30, -22, -20, -16, -65);
  ctx.lineTo(16, -65);
  ctx.bezierCurveTo(20, -20, 20, 30, 18, 120);
  ctx.closePath();
  ctx.fill();

  // White collared blouse cutout
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(-10, -65);
  ctx.lineTo(0, -65);
  ctx.lineTo(-5, -42);
  ctx.closePath();
  ctx.fill();

  // Airline neck scarf
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.arc(-5, -46, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = RED;
  ctx.fillRect(-7, -78, 14, 15);

  // Blouse collar seam line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-8, -66);
  ctx.lineTo(8, -66);
  ctx.stroke();

  // Head in Profile facing left
  ctx.beginPath();
  ctx.moveTo(6, -78);
  ctx.bezierCurveTo(16, -82, 17, -104, 6, -110);
  ctx.bezierCurveTo(-4, -112, -12, -108, -13, -98);
  ctx.lineTo(-13, -92);
  ctx.lineTo(-17, -89); // nose
  ctx.lineTo(-13.5, -87);
  ctx.lineTo(-14, -84);
  ctx.lineTo(-12, -81); // chin
  ctx.lineTo(-3, -79);
  ctx.closePath();
  ctx.fill();

  // Hair contour
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(6, -100);
  ctx.quadraticCurveTo(-2, -102, -10, -96);
  ctx.stroke();

  ctx.restore(); // Agent Behind Counter

  // 2. COUNTER DESK (Solid black fill to occlude agent lower body)
  ctx.fillStyle = CUTOUT;
  ctx.fillRect(counterLeft, counterY, counterRight - counterLeft, 440);

  ctx.strokeStyle = RED;
  ctx.lineWidth = 3.0;
  ctx.strokeRect(counterLeft, counterY, counterRight - counterLeft, 440);

  // Counter Top Shelf
  ctx.fillStyle = RED;
  ctx.fillRect(counterLeft - 40, counterTopY, (counterRight - counterLeft) + 80, 16);

  // Counter accessories (Ticket punch / validator, desk sign)
  ctx.strokeStyle = RED_DIM;
  ctx.lineWidth = 2.0;
  ctx.strokeRect(1200, counterTopY - 32, 60, 32); // validator stamp

  ctx.fillStyle = RED_DIM;
  ctx.font = 'bold 12px RobotoMono, monospace';
  ctx.fillText('AGENT', 1140, counterTopY - 10);

  // 3. THE MAN (Framed from waist up on the left)
  ctx.save();
  ctx.translate(480, counterTopY + 120);
  ctx.scale(1.9, 1.9);

  // Man Torso in profile
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-16, -65);
  ctx.bezierCurveTo(-22, -35, -20, 10, -18, 50);
  ctx.lineTo(16, 50);
  ctx.bezierCurveTo(19, 10, 20, -35, 12, -65);
  ctx.closePath();
  ctx.fill();

  // White shirt collar cutout
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(3, -65);
  ctx.lineTo(12, -65);
  ctx.lineTo(7, -42);
  ctx.lineTo(1, -42);
  ctx.closePath();
  ctx.fill();

  // Red tie
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.moveTo(5, -60);
  ctx.lineTo(9, -60);
  ctx.lineTo(8, -38);
  ctx.lineTo(6, -38);
  ctx.closePath();
  ctx.fill();

  // Lapel line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(13, -64);
  ctx.lineTo(9, -42);
  ctx.lineTo(4, -20);
  ctx.stroke();

  // Neck
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-8, -65);
  ctx.lineTo(-7, -78);
  ctx.lineTo(6, -78);
  ctx.lineTo(8, -65);
  ctx.closePath();
  ctx.fill();

  // Shirt collar ring
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-7, -66);
  ctx.lineTo(8, -66);
  ctx.stroke();

  // Head in profile
  ctx.beginPath();
  ctx.moveTo(-7, -78);
  ctx.bezierCurveTo(-17, -82, -18, -102, -6, -108);
  ctx.bezierCurveTo(4, -110, 13, -106, 14, -96);
  ctx.lineTo(14, -90);
  ctx.lineTo(18.5, -86); // nose
  ctx.lineTo(14.5, -83);
  ctx.lineTo(15, -80);
  ctx.lineTo(13.5, -77); // chin
  ctx.lineTo(4, -75);
  ctx.closePath();
  ctx.fill();

  // Hair parting
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-6, -99);
  ctx.quadraticCurveTo(1, -101, 10, -96);
  ctx.stroke();

  // Ear
  ctx.beginPath();
  ctx.arc(-1, -86, 3.5, -Math.PI * 0.45, Math.PI * 0.55);
  ctx.stroke();

  // Right arm holding briefcase down at side
  ctx.save();
  ctx.translate(6, -60);
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.roundRect(-6, 0, 12, 44, 4);
  ctx.fill();

  // Briefcase
  ctx.translate(2, 48);
  const bw = 46;
  const bh = 32;
  ctx.beginPath();
  ctx.roundRect(-bw / 2, 0, bw, bh, 3);
  ctx.fill();

  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-bw / 2 + 1, bh / 2);
  ctx.lineTo(bw / 2 - 1, bh / 2);
  ctx.stroke();
  ctx.restore();

  ctx.restore(); // The Man

  // 4. TRANSACTION INTERACTION ON COUNTER
  // Man's reaching arm & Agent's reaching arm across counter:
  // Transaction Phases:
  // 0.0 -> 0.35: Man hands over cash payment
  // 0.35 -> 0.70: Agent receives payment, slides ticket forward
  // 0.70 -> 1.00: Man reaches and takes ticket

  // Agent's arm (reaching onto counter from right)
  const agentReach = progress < 0.35
    ? progress / 0.35 // reaching forward to take cash
    : progress < 0.70
      ? 1.0 - (progress - 0.35) / 0.35 * 0.3 // sliding ticket forward
      : 0.7;

  const agentHandX = 1340 - agentReach * 180;
  const agentHandY = counterTopY - 6;

  ctx.save();
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(1390, counterTopY - 60);
  ctx.lineTo(1370, counterTopY - 60);
  ctx.lineTo(agentHandX + 10, agentHandY);
  ctx.lineTo(agentHandX - 8, agentHandY);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(agentHandX, agentHandY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Man's reaching arm (reaching onto counter from left)
  const manReach = progress < 0.35
    ? progress / 0.35 // reaching forward with money
    : progress < 0.70
      ? 0.7 // waiting while agent prepares ticket
      : 0.7 + (progress - 0.70) / 0.30 * 0.3; // picking up ticket

  const manHandX = 570 + manReach * 280;
  const manHandY = counterTopY - 8;

  ctx.save();
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(500, counterTopY - 60);
  ctx.lineTo(520, counterTopY - 60);
  ctx.lineTo(manHandX + 8, manHandY);
  ctx.lineTo(manHandX - 10, manHandY);
  ctx.closePath();
  ctx.fill();

  // White cuff
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(manHandX - 18, manHandY - 4);
  ctx.lineTo(manHandX - 18, manHandY + 4);
  ctx.stroke();

  // Man's hand
  ctx.beginPath();
  ctx.arc(manHandX, manHandY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // The Items Exchanged:
  if (progress < 0.35) {
    // Folded cash payment ($20 bill fold)
    const billX = manHandX + 12;
    const billY = counterTopY - 14;
    ctx.save();
    ctx.fillStyle = RED_BRIGHT;
    ctx.fillRect(billX - 18, billY - 8, 36, 16);
    ctx.strokeStyle = CUTOUT;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(billX - 18, billY - 8, 36, 16);
    ctx.restore();
  } else {
    // The Red Ticket Envelope on the Counter
    const ticketProgress = (progress - 0.35) / 0.35;
    const ticketX = progress < 0.70
      ? 1100 - Math.min(1.0, ticketProgress) * 220
      : 880 - (progress - 0.70) / 0.30 * 40;

    const ticketY = counterTopY - 18;

    ctx.save();
    ctx.translate(ticketX, ticketY);

    // Ticket outline
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-45, -14, 90, 28);
    ctx.strokeStyle = RED_BRIGHT;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-45, -14, 90, 28);

    // Ticket details
    ctx.fillStyle = RED_BRIGHT;
    ctx.fillRect(-36, -8, 32, 3);
    ctx.fillRect(-36, -1, 54, 3);
    ctx.fillRect(-36, 5, 42, 2.5);

    // Highlight text
    ctx.font = 'bold 9px RobotoMono, monospace';
    ctx.fillText('SEATTLE', 12, -4);

    ctx.restore();
  }

  ctx.restore(); // camera
}

testShot4(0.2);
fs.writeFileSync(path.join(__dirname, 'test_shot4_phase1.png'), canvas.toBuffer('image/png'));

testShot4(0.55);
fs.writeFileSync(path.join(__dirname, 'test_shot4_phase2.png'), canvas.toBuffer('image/png'));

testShot4(0.85);
fs.writeFileSync(path.join(__dirname, 'test_shot4_phase3.png'), canvas.toBuffer('image/png'));

console.log('Saved 3 phases of Shot 4 test');
