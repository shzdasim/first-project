/**
 * High-performance deterministic frame renderer and MP4 video encoder
 * Uses @napi-rs/canvas (Skia 2D) and FFmpeg
 */

const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Register Fonts for Node Canvas Skia engine
const regularWoff = path.resolve(__dirname, 'node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff');
const boldWoff = path.resolve(__dirname, 'node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff');
const monoWoff = path.resolve(__dirname, 'node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff');

if (fs.existsSync(regularWoff)) GlobalFonts.registerFromPath(regularWoff, 'Roboto');
if (fs.existsSync(boldWoff)) GlobalFonts.registerFromPath(boldWoff, 'RobotoBold');
if (fs.existsSync(monoWoff)) GlobalFonts.registerFromPath(monoWoff, 'RobotoMono');

console.log('Registered Fonts:', GlobalFonts.families.map(f => f.family).join(', '));

const MysteryAnimation = require('./src/animation.js');
const { CONFIG, renderFrame } = MysteryAnimation;
const WIDTH = CONFIG.width;
const HEIGHT = CONFIG.height;
const FPS = CONFIG.fps;
const DURATION = CONFIG.totalDuration;
const TOTAL_FRAMES = Math.round(DURATION * FPS); // 420 frames

const OUTPUT_VIDEO = path.join(__dirname, 'mystery_1971_portland_seattle.mp4');
const PREVIEWS_DIR = path.join(__dirname, 'previews');

if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

console.log('====================================================');
console.log('1971 Mystery Documentary Video Generator');
console.log(`Resolution: ${WIDTH}x${HEIGHT} (16:9)`);
console.log(`Framerate: ${FPS} FPS | Duration: ${DURATION}s | Frames: ${TOTAL_FRAMES}`);
console.log(`Output: ${OUTPUT_VIDEO}`);
console.log('====================================================');

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// FFmpeg spawn
const ffmpegBinary = '/home/agent/.local/bin/ffmpeg';
const ffmpegArgs = [
  '-y',
  '-f', 'rawvideo',
  '-vcodec', 'rawvideo',
  '-s', `${WIDTH}x${HEIGHT}`,
  '-pix_fmt', 'rgba',
  '-r', `${FPS}`,
  '-i', '-',
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  OUTPUT_VIDEO
];

const ffmpeg = spawn(ffmpegBinary, ffmpegArgs);

ffmpeg.stderr.on('data', () => {});
ffmpeg.on('error', (err) => {
  console.error('FFmpeg process error:', err);
});

// Key sample times to save preview stills for verification:
const previewTimes = [
  { shot: 1, time: 1.6, name: 'shot1_airport_establishing.png' },
  { shot: 2, time: 4.2, name: 'shot2_man_enters.png' },
  { shot: 3, time: 7.2, name: 'shot3_ticket_counter.png' },
  { shot: 4, time: 9.8, name: 'shot4_buying_ticket.png' },
  { shot: 5, time: 12.3, name: 'shot5_destination_seattle.png' }
];

let frameIndex = 0;

function writeNextFrame() {
  while (frameIndex < TOTAL_FRAMES) {
    const t = frameIndex / FPS;
    renderFrame(ctx, t);

    // Save preview PNG at designated key moments
    for (const p of previewTimes) {
      if (Math.abs(t - p.time) < 0.5 / FPS) {
        const pngBuf = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(PREVIEWS_DIR, p.name), pngBuf);
        console.log(`[Snapshot] Saved ${p.name} at t=${t.toFixed(2)}s`);
      }
    }

    const rawBuffer = canvas.data();
    const canContinue = ffmpeg.stdin.write(rawBuffer);

    frameIndex++;

    if (frameIndex % 30 === 0 || frameIndex === TOTAL_FRAMES) {
      process.stdout.write(`\r[Rendering] Frame ${frameIndex}/${TOTAL_FRAMES} (${((frameIndex / TOTAL_FRAMES) * 100).toFixed(1)}%) - ${(frameIndex / FPS).toFixed(2)}s`);
    }

    if (!canContinue) {
      ffmpeg.stdin.once('drain', writeNextFrame);
      return;
    }
  }

  ffmpeg.stdin.end();
  console.log('\n[Rendering] All frames sent to FFmpeg. Finalizing MP4 encoding...');
}

ffmpeg.on('close', (code) => {
  if (code === 0) {
    const stats = fs.statSync(OUTPUT_VIDEO);
    console.log(`[Success] Video rendered successfully! File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`File: ${OUTPUT_VIDEO}`);
  } else {
    console.error(`[Error] FFmpeg exited with error code ${code}`);
  }
});

writeNextFrame();
