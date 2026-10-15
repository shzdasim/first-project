const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const canvas = createCanvas(800, 800);
const ctx = canvas.getContext('2d');

const RED = '#FF2020';
const CUTOUT = '#000000';

ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 800, 800);

ctx.save();
ctx.translate(400, 500);
ctx.scale(4.0, 4.0); // Magnified 4x for precision review

// Draw Neck
ctx.fillStyle = RED;
ctx.beginPath();
ctx.moveTo(-16, 20); // base of back neck (trapezius slope)
ctx.quadraticCurveTo(-14, 0, -12, -20); // nape of neck
ctx.lineTo(8, -20); // front throat
ctx.quadraticCurveTo(10, 0, 12, 20); // base of throat
ctx.closePath();
ctx.fill();

// Negative space shirt collar
ctx.fillStyle = CUTOUT;
ctx.beginPath();
ctx.moveTo(8, -8);
ctx.lineTo(16, 8);
ctx.lineTo(6, 12);
ctx.lineTo(4, -6);
ctx.closePath();
ctx.fill();

// Draw Head Silhouette
ctx.fillStyle = RED;
ctx.beginPath();
ctx.moveTo(-12, -20); // nape

// Curve around occiput and back of skull
ctx.bezierCurveTo(-22, -26, -26, -48, -16, -62);
// Crown of head / styled 1971 hair volume
ctx.bezierCurveTo(-10, -70, 8, -70, 14, -62);
// Forehead slope
ctx.bezierCurveTo(17, -56, 17, -50, 16, -44);
// Nasion (bridge indent)
ctx.lineTo(15, -42);
// Nose (straight, masculine 1970s profile)
ctx.lineTo(21, -38); // nose tip
ctx.lineTo(16, -34); // base of nose / nostril
// Philtrum
ctx.lineTo(15.5, -31);
// Lips & mouth slit
ctx.lineTo(17, -29); // upper lip
ctx.lineTo(14.5, -28); // mouth corner indent
ctx.lineTo(16, -25); // lower lip
// Chin
ctx.bezierCurveTo(16.5, -21, 14, -18, 9, -18);
// Jawline sloping back to ear/neck
ctx.lineTo(-2, -22);
ctx.lineTo(-12, -20);
ctx.closePath();
ctx.fill();

// 1971 Side-parted hair line in negative space
ctx.strokeStyle = CUTOUT;
ctx.lineWidth = 1.0;
ctx.beginPath();
ctx.moveTo(-10, -56);
ctx.bezierCurveTo(0, -60, 8, -58, 14, -50);
ctx.stroke();

// Subtle ear outline in negative space
ctx.beginPath();
ctx.arc(-2, -32, 4.5, -Math.PI * 0.4, Math.PI * 0.6);
ctx.stroke();

ctx.restore();

fs.writeFileSync(path.join(__dirname, 'test_magnified_head.png'), canvas.toBuffer('image/png'));
console.log('Saved magnified head test');
