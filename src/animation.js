/**
 * 1971 Mystery Documentary Animation Engine
 * Red-on-Black Minimalist Cinematic Motion Graphic
 *
 * Sequence:
 * Narration: "In the afternoon of November 24, 1971, a middle-aged man carrying a briefcase
 * walked into Portland International Airport and purchased a one-way ticket to Seattle, Washington."
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MysteryAnimation = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // --- CONFIGURATION ---
  const CONFIG = {
    width: 1920,
    height: 1080,
    fps: 30,
    totalDuration: 14.0, // seconds
    colors: {
      bg: '#000000',
      red: '#FF2020',
      redBright: '#FF3B3B',
      redGlow: '#FF5252',
      redDeep: '#B81414',
      redMuted: 'rgba(255, 32, 32, 0.45)',
      redDim: 'rgba(255, 32, 32, 0.22)',
      redFaint: 'rgba(255, 32, 32, 0.09)',
      cutout: '#000000' // pure negative space
    },
    fonts: {
      sans: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
      bold: '"RobotoBold", "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
      mono: '"RobotoMono", "Courier New", Courier, monospace'
    },
    shots: [
      { id: 1, name: 'Establishing Airport', start: 0.0, end: 2.8, duration: 2.8 },
      { id: 2, name: 'Man Enters Terminal', start: 2.8, end: 5.8, duration: 3.0 },
      { id: 3, name: 'Approaching Counter', start: 5.8, end: 8.5, duration: 2.7 },
      { id: 4, name: 'Purchasing Ticket', start: 8.5, end: 11.4, duration: 2.9 },
      { id: 5, name: 'Destination: SEATTLE', start: 11.4, end: 14.0, duration: 2.6 }
    ]
  };

  // --- EASING & MATH UTILITIES ---
  const MathUtils = {
    clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    smoothstep: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    },
    easeInOutCubic: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
    },
    easeOutCubic: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return 1 - Math.pow(1 - c, 3);
    },
    easeInOutQuad: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    },
    easeOutQuad: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return 1 - (1 - c) * (1 - c);
    }
  };

  /**
   * Vector Arrow Helper (independent of font glyphs)
   */
  function drawVectorArrow(ctx, x, y, length = 44, color = CONFIG.colors.redBright, lineW = 3.5) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + length - 10, y - 7);
    ctx.lineTo(x + length + 2, y);
    ctx.lineTo(x + length - 10, y + 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // --- CHARACTER SILHOUETTES ---

  /**
   * Draws the Middle-Aged Man silhouette.
   * 1971 classic two-piece dark suit, negative-space collar cutout, red necktie,
   * short neat side-parted hairstyle, rectangular briefcase,
   * authentic walking kinematics or stationary posture.
   */
  function drawManSilhouette(ctx, options = {}) {
    const {
      x = 960,
      y = 800,
      scale = 1.0,
      walkPhase = 0,     // 0 to 1
      isWalking = false,
      briefcaseHold = true,
      armReachProgress = 0, // 0 to 1 (left arm reaching forward)
      facing = 1         // 1: right, -1: left
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    const red = CONFIG.colors.red;
    const redBright = CONFIG.colors.redBright;
    const redDeep = CONFIG.colors.redDeep;
    const cutout = CONFIG.colors.cutout;

    // Kinematic calculations
    let hipBob = 0;
    let torsoTilt = 0;
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    let leftKneeAngle = 0;
    let rightKneeAngle = 0;
    let leftArmAngle = 0;
    let rightArmAngle = 0;
    let briefcaseTilt = 0;

    if (isWalking) {
      const wAngle = Math.PI * 2 * walkPhase;
      // Natural walking vertical oscillation
      hipBob = -Math.abs(Math.sin(wAngle)) * 6;
      torsoTilt = Math.sin(wAngle) * 0.022;

      const legStride = 0.40;
      leftLegAngle = Math.sin(wAngle) * legStride;
      rightLegAngle = Math.sin(wAngle + Math.PI) * legStride;

      // Realistic knee flexion on leg recovery
      leftKneeAngle = Math.max(0, -Math.sin(wAngle) * 0.52);
      rightKneeAngle = Math.max(0, -Math.sin(wAngle + Math.PI) * 0.52);

      // Left arm (free arm) swings counter to left leg
      leftArmAngle = -Math.sin(wAngle) * 0.34;

      // Right arm (holding briefcase) has subtle pendulum swing with inertia
      rightArmAngle = Math.sin(wAngle) * 0.15;
      briefcaseTilt = rightArmAngle * 0.75;
    } else {
      hipBob = 0;
      torsoTilt = 0.01;
      leftLegAngle = -0.04;
      rightLegAngle = 0.04;
      leftKneeAngle = 0.02;
      rightKneeAngle = 0.02;
      leftArmAngle = armReachProgress > 0 ? -1.05 * armReachProgress : 0.04;
      rightArmAngle = 0.03;
      briefcaseTilt = 0.01;
    }

    ctx.translate(0, hipBob);

    // --- LEGS & SHOES ---
    const drawLeg = (baseAngle, kneeBend, isBackLeg) => {
      ctx.save();
      ctx.translate(0, -120); // Hip socket
      ctx.rotate(baseAngle);

      // Thigh
      ctx.fillStyle = isBackLeg ? redDeep : red;
      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.lineTo(11, 0);
      ctx.lineTo(8.5, 64);
      ctx.lineTo(-8.5, 64);
      ctx.closePath();
      ctx.fill();

      // Knee & Shin
      ctx.translate(0, 64);
      ctx.rotate(kneeBend);
      ctx.beginPath();
      ctx.moveTo(-8.5, 0);
      ctx.lineTo(8.5, 0);
      ctx.lineTo(7, 62);
      ctx.lineTo(-7, 62);
      ctx.closePath();
      ctx.fill();

      // Trouser crease line
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.lineTo(0, 60);
      ctx.stroke();

      // 1971 Oxford Dress Shoe
      ctx.translate(0, 62);
      ctx.fillStyle = isBackLeg ? redDeep : red;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.lineTo(18, 9);
      ctx.lineTo(17, 15);
      ctx.lineTo(-10, 15);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fill();

      // Heel notch cutout
      ctx.fillStyle = cutout;
      ctx.fillRect(-10, 10, 3, 5);

      ctx.restore();
    };

    // Draw back leg (right leg) first
    drawLeg(rightLegAngle, rightKneeAngle, true);
    // Draw front leg (left leg)
    drawLeg(leftLegAngle, leftKneeAngle, false);

    // --- TORSO / SUIT JACKET ---
    ctx.save();
    ctx.translate(0, -120); // Hip
    ctx.rotate(torsoTilt);

    // Lower jacket skirt (extends over hips, authentic 1971 cut)
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-18, -35);
    ctx.lineTo(18, -35);
    ctx.lineTo(21, 16);
    ctx.lineTo(-19, 16);
    ctx.closePath();
    ctx.fill();

    // Upper Torso & Chest
    ctx.beginPath();
    ctx.moveTo(-23, -112); // Left shoulder
    ctx.lineTo(23, -112);  // Right shoulder
    ctx.lineTo(19, -30);
    ctx.lineTo(-19, -30);
    ctx.closePath();
    ctx.fill();

    // White shirt collar opening (NEGATIVE SPACE CUTOUT)
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.moveTo(-6, -112);
    ctx.lineTo(6, -112);
    ctx.lineTo(3, -72);
    ctx.lineTo(-3, -72);
    ctx.closePath();
    ctx.fill();

    // Suit lapel cutlines
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-15, -110);
    ctx.lineTo(-4, -72);
    ctx.lineTo(0, -32);
    ctx.moveTo(15, -110);
    ctx.lineTo(4, -72);
    ctx.lineTo(0, -32);
    ctx.stroke();

    // Red necktie inside collar cutout
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-2.5, -100);
    ctx.lineTo(2.5, -100);
    ctx.lineTo(4.0, -70);
    ctx.lineTo(0, -64);
    ctx.lineTo(-4.0, -70);
    ctx.closePath();
    ctx.fill();

    // Suit breast pocket welt slit
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(8, -88);
    ctx.lineTo(16, -88);
    ctx.stroke();

    // --- NECK & HEAD ---
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.rect(-6, -126, 12, 16);
    ctx.fill();

    // Head base silhouette
    ctx.beginPath();
    ctx.moveTo(-9, -152);
    ctx.bezierCurveTo(-11, -170, 11, -170, 13, -152); // Crown
    ctx.lineTo(14, -141); // Forehead
    ctx.lineTo(18, -137); // Nose bridge
    ctx.lineTo(14, -133); // Under nose
    ctx.lineTo(14, -127); // Neutral mouth & chin
    ctx.lineTo(7, -122);  // Jawline
    ctx.lineTo(-8, -124); // Neck nape
    ctx.closePath();
    ctx.fill();

    // 1970s Businessman Haircut Contour
    ctx.beginPath();
    ctx.moveTo(-11, -153);
    ctx.bezierCurveTo(-15, -174, 12, -174, 15, -151);
    ctx.lineTo(15, -142);
    ctx.lineTo(9, -144);
    ctx.lineTo(-10, -140);
    ctx.lineTo(-13, -135);
    ctx.closePath();
    ctx.fill();

    // Negative space side-part line
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, -150);
    ctx.lineTo(8, -148);
    ctx.stroke();

    // --- LEFT ARM (FREE / REACHING ARM) ---
    ctx.save();
    ctx.translate(-16, -106); // Shoulder
    ctx.rotate(leftArmAngle);

    // Upper arm
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 54, 4);
    ctx.fill();

    // Forearm
    ctx.translate(0, 52);
    if (armReachProgress > 0) {
      ctx.rotate(-0.45 * armReachProgress);
    }
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 50, 3);
    ctx.fill();

    // Hand & fingers
    ctx.translate(0, 48);
    ctx.beginPath();
    ctx.arc(0, 5, 5, 0, Math.PI * 2);
    ctx.fill();

    if (armReachProgress > 0.4) {
      ctx.fillRect(-2, 4, 10, 4);
    }
    ctx.restore(); // Left arm

    // --- RIGHT ARM & BRIEFCASE ---
    ctx.save();
    ctx.translate(14, -106); // Shoulder
    ctx.rotate(rightArmAngle);

    // Upper arm
    ctx.fillStyle = redBright;
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 54, 4);
    ctx.fill();

    // Forearm
    ctx.translate(0, 52);
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 48, 3);
    ctx.fill();

    // Hand gripping briefcase handle
    ctx.translate(0, 48);
    ctx.beginPath();
    ctx.arc(0, 5, 6, 0, Math.PI * 2);
    ctx.fill();

    // BRIEFCASE (1971 Hard-shell Executive Attache)
    if (briefcaseHold) {
      ctx.save();
      ctx.translate(2, 10);
      ctx.rotate(briefcaseTilt);

      // Handle loop
      ctx.strokeStyle = red;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, -5, 8, Math.PI, 0, false);
      ctx.stroke();

      // Briefcase rectangular body
      const bW = 56;
      const bH = 38;
      ctx.fillStyle = red;
      ctx.beginPath();
      ctx.roundRect(-bW / 2, 0, bW, bH, 3);
      ctx.fill();

      // Aluminum / metal trim seam in negative space
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-bW / 2 + 2, bH / 2);
      ctx.lineTo(bW / 2 - 2, bH / 2);
      ctx.stroke();

      // Twin keylocks / latches
      ctx.fillStyle = cutout;
      ctx.fillRect(-16, bH / 2 - 3, 5, 6);
      ctx.fillRect(11, bH / 2 - 3, 5, 6);

      // Chrome corner brackets
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.0;
      ctx.strokeRect(-bW / 2 + 1, 1, 6, 6);
      ctx.strokeRect(bW / 2 - 7, 1, 6, 6);
      ctx.strokeRect(-bW / 2 + 1, bH - 7, 6, 6);
      ctx.strokeRect(bW / 2 - 7, bH - 7, 6, 6);

      ctx.restore();
    }

    ctx.restore(); // Right arm
    ctx.restore(); // Torso
    ctx.restore(); // Root
  }

  /**
   * Draws the Airline Ticket Agent behind the counter.
   * 1971 airline uniform (collared blazer, scarf cutout, neat updo hairstyle).
   */
  function drawTicketAgent(ctx, options = {}) {
    const {
      x = 1350,
      y = 740,
      scale = 0.95,
      action = 'idle', // 'idle', 'receive', 'validate', 'give'
      actionProgress = 0
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const red = CONFIG.colors.red;
    const redBright = CONFIG.colors.redBright;
    const cutout = CONFIG.colors.cutout;

    // Uniform torso (standing behind counter)
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(22, 0);
    ctx.lineTo(18, -96);
    ctx.lineTo(-18, -96);
    ctx.closePath();
    ctx.fill();

    // Uniform neck scarf cutout
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.moveTo(-6, -96);
    ctx.lineTo(6, -96);
    ctx.lineTo(0, -68);
    ctx.closePath();
    ctx.fill();

    // Red scarf knot
    ctx.fillStyle = redBright;
    ctx.beginPath();
    ctx.arc(0, -74, 3, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = red;
    ctx.fillRect(-5, -108, 10, 14);

    // Head profile facing left toward the passenger
    ctx.beginPath();
    ctx.arc(0, -124, 15, 0, Math.PI * 2);
    ctx.fill();

    // 1971 styled bouffant / salon updo hair
    ctx.beginPath();
    ctx.arc(-2, -128, 17, Math.PI * 0.7, Math.PI * 1.9);
    ctx.lineTo(9, -118);
    ctx.lineTo(-7, -118);
    ctx.closePath();
    ctx.fill();

    // Profile facing left: nose & chin
    ctx.beginPath();
    ctx.moveTo(-13, -126);
    ctx.lineTo(-18, -122);
    ctx.lineTo(-13, -119);
    ctx.closePath();
    ctx.fill();

    // Arms and hands
    ctx.save();
    let armAngle = 0.40;

    if (action === 'give') {
      const p = MathUtils.clamp(actionProgress, 0, 1);
      armAngle = MathUtils.lerp(0.40, -0.85, p);
    } else if (action === 'receive') {
      const p = MathUtils.clamp(actionProgress, 0, 1);
      armAngle = MathUtils.lerp(0.20, -0.55, p);
    }

    ctx.translate(-14, -90);
    ctx.rotate(armAngle);
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 54, 4);
    ctx.fill();

    ctx.translate(0, 54);
    ctx.beginPath();
    ctx.roundRect(-4, 0, 8, 44, 3);
    ctx.fill();

    ctx.translate(0, 44);
    ctx.beginPath();
    ctx.arc(0, 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ticket envelope held in hand
    if (action === 'give' && actionProgress > 0.25) {
      ctx.fillStyle = redBright;
      ctx.save();
      ctx.rotate(-0.25);
      ctx.fillRect(-20, -7, 36, 18);
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1;
      ctx.strokeRect(-20, -7, 36, 18);
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  /**
   * Distant Passenger Silhouette for spatial depth.
   */
  function drawDistantPassenger(ctx, x, y, scale = 0.4, walking = false, phase = 0, dir = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * dir, scale);
    ctx.fillStyle = CONFIG.colors.redDim;

    const bob = walking ? -Math.abs(Math.sin(phase * Math.PI * 2)) * 3 : 0;
    ctx.translate(0, bob);

    // Head
    ctx.beginPath();
    ctx.arc(0, -115, 9, 0, Math.PI * 2);
    ctx.fill();

    // Overcoat / Body
    ctx.beginPath();
    ctx.moveTo(-12, -100);
    ctx.lineTo(12, -100);
    ctx.lineTo(16, -20);
    ctx.lineTo(-16, -20);
    ctx.closePath();
    ctx.fill();

    // Legs
    const lA = walking ? Math.sin(phase * Math.PI * 2) * 0.35 : -0.05;
    const rA = walking ? -Math.sin(phase * Math.PI * 2) * 0.35 : 0.05;

    ctx.fillRect(-10 + lA * 15, -20, 7, 24);
    ctx.fillRect(3 + rA * 15, -20, 7, 24);

    ctx.restore();
  }

  // =========================================================================
  // SCENE 1 — AIRPORT ESTABLISHING SHOT
  // =========================================================================
  function scene_establishing_airport(ctx, width, height, t, progress, camera) {
    const reveal = MathUtils.clamp((progress - 0.12) / 0.70, 0, 1);
    const alpha = MathUtils.smoothstep(reveal);

    if (alpha <= 0.001) {
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    ctx.save();
    const camZoom = MathUtils.lerp(0.96, 1.05, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(18, -14, progress);
    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Modernist 1970s Airport Control Tower in background
    ctx.save();
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.35 * alpha})`;
    ctx.lineWidth = 1.5;
    const towerX = 340;
    const towerY = 160;
    // Tower shaft
    ctx.strokeRect(towerX - 18, towerY + 70, 36, 140);
    // Tower cab
    ctx.beginPath();
    ctx.moveTo(towerX - 35, towerY + 70);
    ctx.lineTo(towerX + 35, towerY + 70);
    ctx.lineTo(towerX + 45, towerY + 25);
    ctx.lineTo(towerX - 45, towerY + 25);
    ctx.closePath();
    ctx.stroke();
    // Tower radome / beacon
    ctx.beginPath();
    ctx.arc(towerX, towerY + 15, 12, Math.PI, 0, false);
    ctx.stroke();
    ctx.restore();

    // Tarmac / Ground Line
    const groundY = 760;
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.9 * alpha})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(80, groundY);
    ctx.lineTo(width - 80, groundY);
    ctx.stroke();

    // Perspective lines on the entrance plaza
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.22 * alpha})`;
    ctx.lineWidth = 1.2;
    for (let i = -7; i <= 7; i++) {
      ctx.beginPath();
      ctx.moveTo(width / 2 + i * 130, groundY);
      ctx.lineTo(width / 2 + i * 260, height + 40);
      ctx.stroke();
    }

    // Modernist 1970s Terminal Building Facade
    const roofY = 310;
    const roofH = 58;

    // Roof canopy cantilever
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(160, roofY, width - 320, roofH);

    ctx.strokeStyle = `rgba(255, 32, 32, ${0.9 * alpha})`;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(160, roofY, width - 320, roofH);

    // Structural roof trim lines
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.4 * alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(160, roofY + 12);
    ctx.lineTo(width - 160, roofY + 12);
    ctx.moveTo(160, roofY + roofH - 12);
    ctx.lineTo(width - 160, roofY + roofH - 12);
    ctx.stroke();

    // Airport Lettering Signage: "PORTLAND INTERNATIONAL AIRPORT"
    ctx.save();
    ctx.font = `bold 28px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = `rgba(255, 59, 59, ${0.95 * alpha})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PORTLAND INTERNATIONAL AIRPORT', width / 2, roofY + roofH / 2);
    ctx.restore();

    // Vertical Glass Mullions & Large Airport Windows
    const windowTop = roofY + roofH;
    const windowH = groundY - windowTop;
    const numPanels = 14;
    const panelW = (width - 400) / numPanels;

    for (let i = 0; i <= numPanels; i++) {
      const px = 200 + i * panelW;
      ctx.strokeStyle = `rgba(255, 32, 32, ${0.35 * alpha})`;
      ctx.lineWidth = (i % 2 === 0) ? 2.0 : 1.0;
      ctx.beginPath();
      ctx.moveTo(px, windowTop);
      ctx.lineTo(px, groundY);
      ctx.stroke();
    }

    // Horizontal window divisions
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.22 * alpha})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(200, windowTop + windowH * 0.38);
    ctx.lineTo(width - 200, windowTop + windowH * 0.38);
    ctx.moveTo(200, windowTop + windowH * 0.68);
    ctx.lineTo(width - 200, windowTop + windowH * 0.68);
    ctx.stroke();

    // Interior linear fluorescent light strips (visible through glass)
    ctx.strokeStyle = `rgba(255, 59, 59, ${0.75 * alpha})`;
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 7; i++) {
      const lx = 320 + i * 180;
      ctx.beginPath();
      ctx.moveTo(lx - 45, windowTop + 35);
      ctx.lineTo(lx + 45, windowTop + 35);
      ctx.stroke();
    }

    // Terminal Entrance Sliding Doors
    const doorW = 210;
    const doorH = 195;
    const doorX = (width - doorW) / 2;
    const doorY = groundY - doorH;

    ctx.strokeStyle = `rgba(255, 59, 59, ${0.9 * alpha})`;
    ctx.lineWidth = 2.8;
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Door center split and horizontal push bars
    ctx.beginPath();
    ctx.moveTo(doorX + doorW / 2, doorY);
    ctx.lineTo(doorX + doorW / 2, groundY);
    ctx.moveTo(doorX + 16, doorY + doorH * 0.54);
    ctx.lineTo(doorX + doorW - 16, doorY + doorH * 0.54);
    ctx.stroke();

    // Distant passenger silhouettes moving inside concourse
    const pass1X = 450 + progress * 80;
    const pass2X = 1390 - progress * 60;
    drawDistantPassenger(ctx, pass1X, groundY - 2, 0.42, true, t * 1.3, 1);
    drawDistantPassenger(ctx, pass2X, groundY - 2, 0.38, true, t * 1.1, -1);

    // Fade out near end of shot
    if (progress > 0.88) {
      const fadeOut = (progress - 0.88) / 0.12;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeOut})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }

  // =========================================================================
  // SCENE 2 — MAN ENTERS AIRPORT CONCOURSE
  // =========================================================================
  function scene_man_enters(ctx, width, height, t, progress, camera) {
    ctx.save();

    const camPanX = MathUtils.lerp(-90, 90, progress);
    const camZoom = MathUtils.lerp(0.99, 1.025, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2 - camPanX, -height / 2);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width * 1.5, height);

    const floorY = 820;

    // Architectural Interior: Ceiling beams with recessed downlights
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 1.8;
    for (let y = 130; y <= 240; y += 45) {
      ctx.beginPath();
      ctx.moveTo(-200, y);
      ctx.lineTo(width + 200, y);
      ctx.stroke();
    }

    // Ceiling linear fluorescent troffers
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.5;
    for (let x = -100; x < width + 300; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x, 175);
      ctx.lineTo(x + 110, 175);
      ctx.stroke();
    }

    // Floor perspective lines leading into deep vanishing point
    const vpX = 960;
    const vpY = 480;
    ctx.strokeStyle = CONFIG.colors.redFaint;
    ctx.lineWidth = 1.0;
    for (let x = -400; x <= width + 400; x += 110) {
      ctx.beginPath();
      ctx.moveTo(vpX, vpY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Floor horizontal tile seams
    for (let y = floorY; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(-200, y);
      ctx.lineTo(width + 200, y);
      ctx.stroke();
    }

    // Floor base line
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-200, floorY);
    ctx.lineTo(width + 200, floorY);
    ctx.stroke();

    // Distant Concourse Signage
    ctx.save();
    const signX = 1300;
    const signY = 290;
    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(signX, signY, 280, 52);

    ctx.font = `bold 20px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = CONFIG.colors.redBright;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('CONCOURSE B', signX + 24, signY + 26);
    drawVectorArrow(ctx, signX + 215, signY + 26, 32, CONFIG.colors.redBright, 2.8);
    ctx.restore();

    // Background passenger walking opposite direction
    const distManX = 1420 - progress * 95;
    drawDistantPassenger(ctx, distManX, floorY - 55, 0.48, true, t * 1.2, -1);

    // Queue barrier stanchions
    for (let sx = 1440; sx <= 1860; sx += 85) {
      ctx.strokeStyle = CONFIG.colors.redDim;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(sx, floorY - 55);
      ctx.lineTo(sx, floorY);
      ctx.stroke();

      ctx.fillStyle = CONFIG.colors.redDim;
      ctx.fillRect(sx - 8, floorY - 3, 16, 3);
      ctx.beginPath();
      ctx.arc(sx, floorY - 55, 4, 0, Math.PI * 2);
      ctx.fill();

      if (sx < 1860) {
        ctx.beginPath();
        ctx.moveTo(sx, floorY - 50);
        ctx.quadraticCurveTo(sx + 42, floorY - 38, sx + 85, floorY - 50);
        ctx.stroke();
      }
    }

    // THE MIDDLE-AGED MAN
    const manStartX = 160;
    const manEndX = 1040;
    const manX = MathUtils.lerp(manStartX, manEndX, MathUtils.clamp(progress / 0.95, 0, 1));
    const manY = floorY;

    const walkCycle = (t * 1.25) % 1.0;

    drawManSilhouette(ctx, {
      x: manX,
      y: manY,
      scale: 1.45,
      walkPhase: walkCycle,
      isWalking: true,
      briefcaseHold: true,
      facing: 1
    });

    if (progress < 0.10) {
      const fi = 1 - progress / 0.10;
      ctx.fillStyle = `rgba(0, 0, 0, ${fi})`;
      ctx.fillRect(0, 0, width, height);
    } else if (progress > 0.90) {
      const fo = (progress - 0.90) / 0.10;
      ctx.fillStyle = `rgba(0, 0, 0, ${fo})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }

  // =========================================================================
  // SCENE 3 — APPROACHING THE TICKET COUNTER
  // =========================================================================
  function scene_ticket_counter(ctx, width, height, t, progress, camera) {
    ctx.save();

    const camZoom = MathUtils.lerp(1.0, 1.07, MathUtils.easeInOutQuad(progress));
    const camPanX = MathUtils.lerp(0, 45, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2 + camPanX, -height / 2);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    const floorY = 820;

    // Floor lines
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, floorY);
    ctx.lineTo(width - 80, floorY);
    ctx.stroke();

    for (let x = 160; x <= width - 80; x += 140) {
      ctx.strokeStyle = CONFIG.colors.redFaint;
      ctx.beginPath();
      ctx.moveTo(960, 460);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 1971 Airline Ticket Counter Architecture
    const counterX = 1120;
    const counterY = 560;
    const counterW = 490;
    const counterH = floorY - counterY;

    // Back wall vintage flight departure board
    ctx.strokeStyle = CONFIG.colors.redFaint;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1060, 220, 580, 190);

    ctx.font = `bold 16px ${CONFIG.fonts.mono}`;
    ctx.fillStyle = CONFIG.colors.redDim;
    ctx.textAlign = 'left';
    ctx.fillText('FLIGHT   DESTINATION   DEP    GATE', 1085, 250);

    const flightRows = [
      'NW 305   SEATTLE       14:50  GATE 4',
      'UA 182   SAN FRANCISCO 15:15  GATE 6',
      'WA 409   LOS ANGELES   15:40  GATE 8'
    ];
    flightRows.forEach((row, idx) => {
      ctx.fillText(row, 1085, 285 + idx * 30);
    });

    // Hanging Overhead Desk Signage (elevated well above the agent's head)
    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + 20, counterY - 110, counterW - 40, 42);

    // Pendant suspension rods
    ctx.beginPath();
    ctx.moveTo(counterX + 80, counterY - 110);
    ctx.lineTo(counterX + 80, 140);
    ctx.moveTo(counterX + counterW - 80, counterY - 110);
    ctx.lineTo(counterX + counterW - 80, 140);
    ctx.stroke();

    ctx.font = `bold 20px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = CONFIG.colors.redBright;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PASSENGER SERVICE \u2022 TICKETS', counterX + counterW / 2, counterY - 89);

    // AIRLINE TICKET AGENT (Drawn BEFORE the solid counter so desk occludes lower body)
    drawTicketAgent(ctx, {
      x: counterX + 175,
      y: counterY + 120,
      scale: 1.35,
      action: 'idle',
      actionProgress: 0
    });

    // Counter Desk Top & Base (Solid Modernist Silhouette in front of agent)
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(counterX, counterY, counterW, counterH);

    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(counterX, counterY, counterW, counterH);

    // Counter top overhang lip
    ctx.fillStyle = CONFIG.colors.red;
    ctx.fillRect(counterX - 25, counterY - 12, counterW + 40, 14);

    // Desk fascia accent stripe
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(counterX, counterY + 50);
    ctx.lineTo(counterX + counterW, counterY + 50);
    ctx.stroke();

    // Baggage scale beside the counter
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + counterW - 40, floorY - 35, 120, 35);
    ctx.beginPath();
    ctx.moveTo(counterX + counterW + 40, floorY - 35);
    ctx.lineTo(counterX + counterW + 40, floorY - 95);
    ctx.arc(counterX + counterW + 40, floorY - 110, 15, 0, Math.PI * 2);
    ctx.stroke();

    // MIDDLE-AGED MAN
    const stopProgress = 0.62;
    const walkT = MathUtils.clamp(progress / stopProgress, 0, 1);
    const manCurrentX = MathUtils.lerp(380, 895, MathUtils.easeOutQuad(walkT));

    const manIsWalking = progress < stopProgress;
    const walkCycle = manIsWalking ? (t * 1.25 * (1 - walkT * 0.4)) % 1.0 : 0;

    drawManSilhouette(ctx, {
      x: manCurrentX,
      y: floorY,
      scale: 1.45,
      walkPhase: walkCycle,
      isWalking: manIsWalking,
      briefcaseHold: true,
      facing: 1
    });

    if (progress < 0.10) {
      const fi = 1 - progress / 0.10;
      ctx.fillStyle = `rgba(0, 0, 0, ${fi})`;
      ctx.fillRect(0, 0, width, height);
    } else if (progress > 0.90) {
      const fo = (progress - 0.90) / 0.10;
      ctx.fillStyle = `rgba(0, 0, 0, ${fo})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }

  // =========================================================================
  // SCENE 4 — BUYING THE TICKET
  // =========================================================================
  function scene_purchase_ticket(ctx, width, height, t, progress, camera) {
    ctx.save();

    // Intimate medium framing focusing on the counter transaction
    const camZoom = MathUtils.lerp(1.25, 1.42, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(30, -15, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    const floorY = 860;
    const counterY = 610;
    const counterX = 840;
    const counterW = 720;

    // Background horizontal divider lines
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, 360);
    ctx.lineTo(width - 100, 360);
    ctx.moveTo(100, 450);
    ctx.lineTo(width - 100, 450);
    ctx.stroke();

    // TRANSACTION PHASES:
    // 0.0 -> 0.35: Man hands over payment
    // 0.35 -> 0.65: Agent validates and slides ticket
    // 0.65 -> 1.0: Man receives and takes ticket
    const p1 = MathUtils.clamp(progress / 0.35, 0, 1);
    const p2 = MathUtils.clamp((progress - 0.35) / 0.30, 0, 1);
    const p3 = MathUtils.clamp((progress - 0.65) / 0.35, 0, 1);

    let agentAction = 'idle';
    let agentProgress = 0;
    if (progress < 0.35) {
      agentAction = 'receive';
      agentProgress = p1;
    } else if (progress < 0.65) {
      agentAction = 'give';
      agentProgress = p2;
    } else {
      agentAction = 'give';
      agentProgress = 1.0;
    }

    // Draw Agent behind counter
    drawTicketAgent(ctx, {
      x: counterX + 340,
      y: counterY + 115,
      scale: 1.5,
      action: agentAction,
      actionProgress: agentProgress
    });

    // Solid Counter Desk
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(counterX - 40, counterY, counterW, floorY - counterY);
    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(counterX - 40, counterY, counterW, floorY - counterY);

    // Counter Top
    ctx.fillStyle = CONFIG.colors.red;
    ctx.fillRect(counterX - 80, counterY - 14, counterW + 60, 16);

    // 1971 Ticket Validator / Stamp Machine outline on desk
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + 220, counterY - 45, 60, 32);
    ctx.beginPath();
    ctx.moveTo(counterX + 270, counterY - 45);
    ctx.lineTo(counterX + 285, counterY - 60);
    ctx.stroke();

    // The Man
    const armReach = (progress < 0.35)
      ? MathUtils.easeOutQuad(p1)
      : (progress < 0.65)
        ? 0.35
        : MathUtils.lerp(0.35, 0.95, MathUtils.easeOutQuad(p3));

    drawManSilhouette(ctx, {
      x: 650,
      y: floorY,
      scale: 1.5,
      walkPhase: 0,
      isWalking: false,
      briefcaseHold: true,
      armReachProgress: armReach,
      facing: 1
    });

    // Physical Ticket or Payment exchange on counter
    if (progress >= 0.35) {
      const ticketX = (progress < 0.65)
        ? MathUtils.lerp(counterX + 220, counterX + 40, MathUtils.easeInOutQuad(p2))
        : (progress < 0.85)
          ? counterX + 40
          : MathUtils.lerp(counterX + 40, counterX + 5, MathUtils.easeOutQuad((progress - 0.85) / 0.15));

      const ticketY = (progress < 0.85)
        ? counterY - 14
        : MathUtils.lerp(counterY - 14, counterY - 32, MathUtils.easeOutQuad((progress - 0.85) / 0.15));

      const ticketRot = (progress < 0.85) ? 0 : -0.16 * ((progress - 0.85) / 0.15);

      ctx.save();
      ctx.translate(ticketX, ticketY);
      ctx.rotate(ticketRot);

      // Red ticket envelope
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(-35, -12, 70, 24);
      ctx.strokeStyle = CONFIG.colors.redBright;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(-35, -12, 70, 24);

      // Typography lines
      ctx.fillStyle = CONFIG.colors.redBright;
      ctx.fillRect(-28, -6, 26, 3);
      ctx.fillRect(-28, 0, 46, 3);
      ctx.fillRect(-28, 6, 34, 2);

      ctx.restore();
    } else {
      // Payment (folded currency) handed over by man
      const billX = MathUtils.lerp(720, counterX + 40, MathUtils.easeOutQuad(p1));
      const billY = MathUtils.lerp(counterY - 35, counterY - 12, p1);
      ctx.save();
      ctx.fillStyle = CONFIG.colors.red;
      ctx.fillRect(billX - 18, billY - 6, 36, 12);
      ctx.strokeStyle = CONFIG.colors.cutout;
      ctx.lineWidth = 1;
      ctx.strokeRect(billX - 18, billY - 6, 36, 12);
      ctx.restore();
    }

    if (progress < 0.08) {
      const fi = 1 - progress / 0.08;
      ctx.fillStyle = `rgba(0, 0, 0, ${fi})`;
      ctx.fillRect(0, 0, width, height);
    } else if (progress > 0.90) {
      const fo = (progress - 0.90) / 0.10;
      ctx.fillStyle = `rgba(0, 0, 0, ${fo})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }

  // =========================================================================
  // SCENE 5 — DESTINATION REVEAL (TICKET CLOSE-UP)
  // =========================================================================
  function scene_ticket_closeup(ctx, width, height, t, progress, camera) {
    ctx.save();

    const camZoom = MathUtils.lerp(1.0, 1.08, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(0, -14, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Fade in from black 0.0 -> 0.15
    // Steady hold 0.15 -> 0.70
    // Fade to pure black 0.70 -> 1.00
    let alpha = 1.0;
    if (progress < 0.15) {
      alpha = MathUtils.smoothstep(progress / 0.15);
    } else if (progress > 0.70) {
      alpha = MathUtils.smoothstep(1.0 - (progress - 0.70) / 0.30);
    }

    if (alpha <= 0.001) {
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      return;
    }

    // THE 1971 AIRLINE PASSENGER TICKET
    const tW = 900;
    const tH = 480;
    const tX = (width - tW) / 2 + 80;
    const tY = (height - tH) / 2;

    // --- ANATOMICALLY REFINED SILHOUETTE HAND HOLDING TICKET ---
    ctx.save();
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.95})`;

    // Arm sleeve & white cuff cutout coming from bottom left
    const wristX = tX - 90;
    const wristY = tY + 340;

    // Suit sleeve
    ctx.beginPath();
    ctx.moveTo(0, height + 80);
    ctx.lineTo(wristX - 30, wristY + 80);
    ctx.lineTo(wristX + 45, wristY + 40);
    ctx.lineTo(wristX + 110, wristY + 110);
    ctx.lineTo(120, height + 100);
    ctx.closePath();
    ctx.fill();

    // White shirt cuff negative space slit
    ctx.strokeStyle = CONFIG.colors.cutout;
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(wristX - 5, wristY + 58);
    ctx.lineTo(wristX + 65, wristY + 22);
    ctx.stroke();

    // Hand palm & index finger supporting bottom edge of ticket
    ctx.beginPath();
    ctx.moveTo(wristX + 15, wristY + 35);
    ctx.lineTo(tX + 120, tY + tH + 6);
    ctx.lineTo(tX + 130, tY + tH - 18);
    ctx.lineTo(wristX + 45, wristY - 10);
    ctx.closePath();
    ctx.fill();

    // Thumb gripping over the left face of the ticket
    ctx.beginPath();
    ctx.moveTo(wristX + 25, wristY);
    ctx.bezierCurveTo(wristX + 40, wristY - 70, tX - 25, tY + 210, tX + 28, tY + 235); // thumb tip
    ctx.bezierCurveTo(tX + 42, tY + 242, tX + 22, tY + 270, wristX + 60, wristY + 40);
    ctx.closePath();
    ctx.fill();

    // Negative space thumbnail accent
    ctx.strokeStyle = CONFIG.colors.cutout;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(tX + 24, tY + 246, 7, -Math.PI * 0.8, Math.PI * 0.2);
    ctx.stroke();

    ctx.restore();

    // --- TICKET BODY ---
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(tX, tY, tW, tH);

    // Outer ticket border
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha})`;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(tX, tY, tW, tH);

    // Perforated inner stub border
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.40})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(tX + 12, tY + 12, tW - 24, tH - 24);
    ctx.setLineDash([]);

    // Header dividing line
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.65})`;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(tX + 12, tY + 65);
    ctx.lineTo(tX + tW - 12, tY + 65);
    ctx.stroke();

    // Header Text
    ctx.font = `600 20px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha * 0.9})`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PASSENGER TICKET & BAGGAGE CHECK', tX + 35, tY + 42);

    ctx.textAlign = 'right';
    ctx.font = `500 16px ${CONFIG.fonts.mono}`;
    ctx.fillText('FORM 305-NW', tX + tW - 35, tY + 42);

    // --- MAIN REQUIRED TICKET CONTENT ---
    // 1. "ONE WAY"
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `bold 28px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha})`;
    ctx.fillText('ONE WAY', tX + 50, tY + 130);

    // Accent line
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tX + 50, tY + 155);
    ctx.lineTo(tX + tW - 50, tY + 155);
    ctx.stroke();

    // 2. ROUTE: PORTLAND -> SEATTLE
    // Portland
    ctx.font = `bold 36px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.85})`;
    ctx.fillText('PORTLAND', tX + 50, tY + 230);

    // Vector route arrow
    drawVectorArrow(ctx, tX + 275, tY + 220, 50, `rgba(255, 59, 59, ${alpha * 0.85})`, 3.5);

    // SEATTLE (Prominently emphasized: larger, bold, authoritative, bright red)
    ctx.font = `bold 58px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha})`;
    ctx.fillText('SEATTLE', tX + 355, tY + 234);

    // Underline accent under SEATTLE
    ctx.strokeStyle = `rgba(255, 59, 59, ${alpha * 0.95})`;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(tX + 355, tY + 252);
    ctx.lineTo(tX + 665, tY + 252);
    ctx.stroke();

    // 3. DATE: NOV 24, 1971
    ctx.font = `600 28px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.95})`;
    ctx.fillText('NOV 24, 1971', tX + 50, tY + 325);

    // Historical Period Details
    ctx.font = `500 18px ${CONFIG.fonts.mono}`;
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.65})`;
    ctx.fillText('FLIGHT: NW 305       FARE: $20.00       STATUS: ISSUED', tX + 50, tY + 380);
    ctx.fillText('VALID FOR TRANSPORTATION AS SHOWN', tX + 50, tY + 415);

    // Circular stamp outline (Airport Gate / Validator Stamp)
    ctx.save();
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.55})`;
    ctx.lineWidth = 2.0;
    ctx.translate(tX + tW - 140, tY + 240);
    ctx.rotate(-0.18);
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = `bold 12px ${CONFIG.fonts.bold}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.6})`;
    ctx.fillText('PDX AIRPORT', 0, -18);
    ctx.fillText('24 NOV 1971', 0, 2);
    ctx.fillText('TICKETING', 0, 22);
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // MASTER FRAME RENDER FUNCTION
  // =========================================================================
  function renderFrame(ctx, timeInSeconds) {
    const t = MathUtils.clamp(timeInSeconds, 0, CONFIG.totalDuration);
    const { width, height, shots } = CONFIG;

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    let activeShot = shots[0];
    for (let i = 0; i < shots.length; i++) {
      if (t >= shots[i].start && (t < shots[i].end || i === shots.length - 1)) {
        activeShot = shots[i];
        break;
      }
    }

    const shotProgress = (t - activeShot.start) / activeShot.duration;
    const camera = { zoom: 1.0, panX: 0, panY: 0 };

    switch (activeShot.id) {
      case 1:
        scene_establishing_airport(ctx, width, height, t, shotProgress, camera);
        break;
      case 2:
        scene_man_enters(ctx, width, height, t, shotProgress, camera);
        break;
      case 3:
        scene_ticket_counter(ctx, width, height, t, shotProgress, camera);
        break;
      case 4:
        scene_purchase_ticket(ctx, width, height, t, shotProgress, camera);
        break;
      case 5:
        scene_ticket_closeup(ctx, width, height, t, shotProgress, camera);
        break;
    }

    return {
      time: t,
      shot: activeShot,
      shotProgress: shotProgress
    };
  }

  return {
    CONFIG,
    MathUtils,
    renderFrame,
    scene_establishing_airport,
    scene_man_enters,
    scene_ticket_counter,
    scene_purchase_ticket,
    scene_ticket_closeup,
    drawManSilhouette,
    drawTicketAgent
  };
});
