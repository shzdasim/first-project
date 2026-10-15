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

/**
 * 1971 Airline Ticket Agent Silhouette
 * Viewed from waist up behind the ticket desk
 */
function drawTicketAgent(ctx, options = {}) {
  const {
    x = 1200,
    y = 650, // Counter top level
    scale = 1.4,
    action = 'idle', // 'idle', 'receive', 'give'
    progress = 0
  } = options;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Agent is facing LEFT toward the customer (-x direction)
  // Let's draw agent:
  // Counter top is at y = 0 relative to this origin!
  // Torso extends down to y = 100 (hidden behind counter), up to shoulders at y = -80.
  // Head is at y = -95 to -125.
  // Hands rest on counter (y = 0) or reach forward to x = -60.

  // 1. Uniform Torso (standing behind counter)
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(18, 50);
  ctx.lineTo(-18, 50);
  ctx.bezierCurveTo(-20, 10, -22, -40, -16, -72); // chest & front shoulder
  ctx.lineTo(16, -72); // back shoulder
  ctx.bezierCurveTo(20, -40, 20, 10, 18, 50);
  ctx.closePath();
  ctx.fill();

  // White collared blouse cutout (negative space V)
  ctx.fillStyle = CUTOUT;
  ctx.beginPath();
  ctx.moveTo(-10, -72);
  ctx.lineTo(0, -72);
  ctx.lineTo(-5, -45);
  ctx.closePath();
  ctx.fill();

  // Red airline neck scarf / knot
  ctx.fillStyle = RED_BRIGHT;
  ctx.beginPath();
  ctx.arc(-5, -50, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = RED;
  ctx.fillRect(-8, -86, 14, 16);

  // Blouse collar seam line
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-9, -73);
  ctx.lineTo(8, -73);
  ctx.stroke();

  // Head Silhouette (Profile facing LEFT toward passenger)
  ctx.beginPath();
  ctx.moveTo(6, -86);                               // back of neck
  ctx.bezierCurveTo(16, -90, 18, -112, 6, -118);    // hair updo / bun (1971 bouffant/chignon)
  ctx.bezierCurveTo(-4, -120, -12, -116, -14, -106); // crown & forehead
  ctx.lineTo(-14, -100);                            // brow
  ctx.lineTo(-18, -96);                             // neat nose
  ctx.lineTo(-14, -94);                             // philtrum
  ctx.lineTo(-15, -91);                             // lips
  ctx.lineTo(-13, -87);                             // chin
  ctx.lineTo(-3, -85);                              // jawline
  ctx.closePath();
  ctx.fill();

  // Hair contour line in negative space
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(6, -108);
  ctx.quadraticCurveTo(-2, -110, -11, -104);
  ctx.stroke();

  // Ear
  ctx.beginPath();
  ctx.arc(0, -96, 3, -Math.PI * 0.55, Math.PI * 0.45);
  ctx.stroke();

  // 2. Arms & Hands on Counter
  // Left arm (front arm, nearest to counter)
  let armReachX = -15;
  let armReachY = -4;

  if (action === 'receive') {
    // Reaching forward to accept money
    armReachX = -15 - progress * 45;
    armReachY = -6 - progress * 4;
  } else if (action === 'give') {
    // Sliding ticket forward
    armReachX = -20 - progress * 55;
    armReachY = -4;
  }

  // Draw arm
  ctx.fillStyle = RED;
  ctx.beginPath();
  ctx.moveTo(-16, -68); // shoulder
  ctx.lineTo(-10, -68);
  ctx.lineTo(armReachX + 8, armReachY);
  ctx.lineTo(armReachX - 4, armReachY);
  ctx.closePath();
  ctx.fill();

  // Negative space arm seam
  ctx.strokeStyle = CUTOUT;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-16, -66);
  ctx.lineTo(-10, -30);
  ctx.stroke();

  // Hand
  ctx.beginPath();
  ctx.arc(armReachX, armReachY, 5, 0, Math.PI * 2);
  ctx.fill();

  // If giving ticket: ticket envelope in hand!
  if (action === 'give') {
    ctx.save();
    ctx.translate(armReachX - 18, armReachY - 6);
    ctx.fillStyle = CUTOUT;
    ctx.fillRect(-22, -6, 44, 18);
    ctx.strokeStyle = RED_BRIGHT;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(-22, -6, 44, 18);
    // Ticket typography stripes
    ctx.fillStyle = RED_BRIGHT;
    ctx.fillRect(-18, -2, 18, 2.5);
    ctx.fillRect(-18, 3, 30, 2.5);
    ctx.restore();
  }

  ctx.restore();
}

// Test rendering
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 1920, 1080);

// Counter desk
const counterX = 820;
const counterY = 620;
const counterW = 750;
const floorY = 860;

// Counter desk
ctx.fillStyle = '#000000';
ctx.fillRect(counterX, counterY, counterW, floorY - counterY);
ctx.strokeStyle = RED;
ctx.lineWidth = 3.0;
ctx.strokeRect(counterX, counterY, counterW, floorY - counterY);

// Counter top surface
ctx.fillStyle = RED;
ctx.fillRect(counterX - 40, counterY - 14, counterW + 40, 16);

// Draw Agent behind counter
drawTicketAgent(ctx, {
  x: counterX + 280,
  y: counterY - 14,
  scale: 1.45,
  action: 'give',
  progress: 0.8
});

fs.writeFileSync(path.join(__dirname, 'test_agent_counter.png'), canvas.toBuffer('image/png'));
console.log('Saved test_agent_counter.png');
