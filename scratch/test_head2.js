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
ctx.translate(400, 480);
ctx.scale(5.0, 5.0);

ctx.fillStyle = RED;

// Combined Neck + Head in one unified anatomical silhouette
ctx.beginPath();
// Base of neck at back (trapezius slope)
ctx.moveTo(-16, 32);
// Nape of neck curving gently into back of head
ctx.quadraticCurveTo(-14, 12, -13, -4);
// Lower occiput
ctx.bezierCurveTo(-15, -16, -18, -32, -12, -42);
// Back of skull & crown (1970s styled hair volume)
ctx.bezierCurveTo(-7, -50, 4, -51, 11, -44);
// Forehead hairline down to brow
ctx.bezierCurveTo(15, -39, 15, -34, 14, -28);
// Glabella / brow ridge
ctx.lineTo(15, -26);
// Bridge of nose indent (nasion)
ctx.lineTo(14, -24);
// Straight nose slope
ctx.lineTo(19, -20);
// Nose tip & under-nose curve
ctx.lineTo(18.5, -18);
ctx.lineTo(15, -18);
// Philtrum
ctx.lineTo(15, -15);
// Upper lip
ctx.lineTo(16, -14);
// Mouth seam
ctx.lineTo(14.5, -13);
// Lower lip
ctx.lineTo(15.5, -11.5);
// Chin crease & strong chin
ctx.lineTo(14, -10);
ctx.bezierCurveTo(15.5, -7, 14.5, -4, 11, -4);
// Jawline sloping back to angle of mandible
ctx.lineTo(3, -7);
// Under jaw / throat down to Adam's apple and base of neck
ctx.quadraticCurveTo(3, 4, 6, 12);
ctx.lineTo(7, 32);
ctx.closePath();
ctx.fill();

// 1971 Businessman Side-Part line in negative space
ctx.strokeStyle = CUTOUT;
ctx.lineWidth = 1.0;
ctx.beginPath();
ctx.moveTo(-8, -40);
ctx.quadraticCurveTo(2, -42, 11, -34);
ctx.stroke();

// Hairline contour around temple and sideburn
ctx.beginPath();
ctx.moveTo(11, -34);
ctx.lineTo(7, -24);
ctx.lineTo(3, -24);
ctx.lineTo(2, -16); // neat 1971 sideburn terminating above earlobe
ctx.stroke();

// Subtle ear in negative space
ctx.beginPath();
ctx.arc(0, -18, 3.5, -Math.PI * 0.45, Math.PI * 0.6);
ctx.stroke();

// White shirt collar opening at neck base (negative space)
ctx.fillStyle = CUTOUT;
ctx.beginPath();
ctx.moveTo(3, 14);
ctx.lineTo(10, 24);
ctx.lineTo(0, 30);
ctx.lineTo(-2, 18);
ctx.closePath();
ctx.fill();

ctx.restore();

fs.writeFileSync(path.join(__dirname, 'test_magnified_head2.png'), canvas.toBuffer('image/png'));
console.log('Saved test_magnified_head2.png');
