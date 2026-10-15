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
      redDeep: '#D01414',
      redMuted: 'rgba(255, 32, 32, 0.40)',
      redDim: 'rgba(255, 32, 32, 0.22)',
      redFaint: 'rgba(255, 32, 32, 0.08)',
      cutout: '#000000' // pure negative space
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

  // --- DRAWING PRIMITIVES & CHARACTERS ---

  /**
   * Draws the Middle-Aged Man silhouette.
   * Features:
   * - 1971 dark suit silhouette (notch lapel, tailored jacket skirt, straight trousers, oxford dress shoes)
   * - Negative space shirt cutout with red necktie
   * - Clean 1970s businessman side-parted hairstyle
   * - Rectangular hard-shell briefcase
   * - Natural articulation: walk cycle or idle stance
   */
  function drawManSilhouette(ctx, options = {}) {
    const {
      x = 960,
      y = 800,
      scale = 1.0,
      walkPhase = 0,     // 0 to 1 cycle
      isWalking = false,
      briefcaseHold = true,
      armReachProgress = 0, // for ticket interaction (0: at side, 1: reaching forward)
      facing = 1         // 1: right, -1: left
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    const red = CONFIG.colors.red;
    const cutout = CONFIG.colors.cutout;

    // Kinematic calculations for walk cycle
    let hipBob = 0;
    let torsoTilt = 0;
    let leftLegAngle = 0;
    let rightLegAngle = 0;
    let leftKneeFlex = 0;
    let rightKneeFlex = 0;
    let leftArmAngle = 0;
    let rightArmAngle = 0;
    let briefcaseAngle = 0;

    if (isWalking) {
      const wAngle = Math.PI * 2 * walkPhase;
      // Hip oscillation: rises twice per step cycle
      hipBob = -Math.abs(Math.sin(wAngle)) * 5;
      torsoTilt = Math.sin(wAngle) * 0.02; // subtle posture counter-balance

      // Legs swing in opposition
      const legStride = 0.42; // radians
      leftLegAngle = Math.sin(wAngle) * legStride;
      rightLegAngle = Math.sin(wAngle + Math.PI) * legStride;

      // Natural knee flexion on backswing
      leftKneeFlex = Math.max(0, -Math.sin(wAngle) * 0.55);
      rightKneeFlex = Math.max(0, -Math.sin(wAngle + Math.PI) * 0.55);

      // Left arm (free arm) swings opposite to left leg
      leftArmAngle = -Math.sin(wAngle) * 0.35;

      // Right arm (carrying briefcase) has subdued, heavier swing
      rightArmAngle = Math.sin(wAngle) * 0.16;
      briefcaseAngle = rightArmAngle * 0.6; // gentle inertial tilt
    } else {
      // Idle / stopped stance
      hipBob = 0;
      leftLegAngle = -0.05;
      rightLegAngle = 0.05;
      leftArmAngle = armReachProgress > 0 ? -1.1 * armReachProgress : 0.05;
      rightArmAngle = 0.04;
      briefcaseAngle = 0.02;
    }

    ctx.translate(0, hipBob);

    // --- LEGS & SHOES ---
    const drawLeg = (baseAngle, kneeBend, isBackLeg) => {
      ctx.save();
      ctx.translate(0, -115); // hip joint
      ctx.rotate(baseAngle);

      // Thigh
      ctx.fillStyle = isBackLeg ? CONFIG.colors.redDeep : red;
      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.lineTo(11, 0);
      ctx.lineTo(8, 62);
      ctx.lineTo(-8, 62);
      ctx.closePath();
      ctx.fill();

      // Knee & Shin
      ctx.translate(0, 62);
      ctx.rotate(kneeBend);
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.lineTo(6, 60);
      ctx.lineTo(-6, 60);
      ctx.closePath();
      ctx.fill();

      // Trouser cuff & Oxford dress shoe
      ctx.translate(0, 60);
      ctx.beginPath();
      // 1970s tapered dress shoe
      ctx.moveTo(-7, 0);
      ctx.lineTo(7, 0);
      ctx.lineTo(16, 7);
      ctx.lineTo(14, 13);
      ctx.lineTo(-9, 13);
      ctx.lineTo(-9, 4);
      ctx.closePath();
      ctx.fill();

      // Subtle heel notch
      ctx.fillStyle = cutout;
      ctx.fillRect(-9, 9, 3, 4);

      ctx.restore();
    };

    // Draw back leg first for depth
    drawLeg(rightLegAngle, rightKneeFlex, true);
    // Draw front leg
    drawLeg(leftLegAngle, leftKneeFlex, false);

    // --- TORSO / SUIT JACKET ---
    ctx.save();
    ctx.translate(0, -115); // hip
    ctx.rotate(torsoTilt);

    // Lower jacket skirt (extends over hips, classic 1971 cut)
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-18, -35);
    ctx.lineTo(18, -35);
    ctx.lineTo(21, 15);
    ctx.lineTo(-19, 15);
    ctx.closePath();
    ctx.fill();

    // Suit jacket torso
    ctx.beginPath();
    ctx.moveTo(-22, -105); // shoulders
    ctx.lineTo(22, -105);
    ctx.lineTo(19, -30);
    ctx.lineTo(-19, -30);
    ctx.closePath();
    ctx.fill();

    // White shirt collar opening (NEGATIVE SPACE CUTOUT)
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.moveTo(-5, -105);
    ctx.lineTo(5, -105);
    ctx.lineTo(2, -68);
    ctx.lineTo(-2, -68);
    ctx.closePath();
    ctx.fill();

    // Lapel cutlines
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-14, -103);
    ctx.lineTo(-4, -68);
    ctx.lineTo(0, -32);
    ctx.moveTo(14, -103);
    ctx.lineTo(4, -68);
    ctx.lineTo(0, -32);
    ctx.stroke();

    // Red necktie inside negative space
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-2.5, -94);
    ctx.lineTo(2.5, -94);
    ctx.lineTo(3.5, -66);
    ctx.lineTo(0, -60);
    ctx.lineTo(-3.5, -66);
    ctx.closePath();
    ctx.fill();

    // --- NECK & HEAD ---
    // Neck
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-6, -105);
    ctx.lineTo(6, -105);
    ctx.lineTo(6, -118);
    ctx.lineTo(-6, -118);
    ctx.closePath();
    ctx.fill();

    // Head base (profile / three-quarters silhouette)
    ctx.beginPath();
    // Crown, forehead, nose, calm neutral mouth, solid jawline
    ctx.moveTo(-10, -145);
    ctx.bezierCurveTo(-12, -162, 10, -162, 12, -145); // top of head
    ctx.lineTo(13, -135); // forehead
    ctx.lineTo(17, -131); // subtle nose bridge
    ctx.lineTo(13, -127); // under nose
    ctx.lineTo(13, -122); // lips / chin
    ctx.lineTo(7, -117);  // jaw
    ctx.lineTo(-8, -118); // back of neck
    ctx.closePath();
    ctx.fill();

    // 1970s Businessman Haircut Silhouette (neat side part, slight collar length)
    ctx.beginPath();
    ctx.moveTo(-11, -146);
    ctx.bezierCurveTo(-14, -166, 12, -166, 14, -144);
    ctx.lineTo(14, -136);
    ctx.lineTo(8, -138);
    ctx.lineTo(-9, -134);
    ctx.lineTo(-12, -130);
    ctx.closePath();
    ctx.fill();

    // Subtle negative hairline detail
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-7, -142);
    ctx.lineTo(7, -140);
    ctx.stroke();

    // --- LEFT ARM (FREE / REACHING ARM) ---
    ctx.save();
    ctx.translate(-16, -100); // shoulder
    ctx.rotate(leftArmAngle);

    // Upper arm
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.lineTo(5, 52);
    ctx.lineTo(-5, 52);
    ctx.closePath();
    ctx.fill();

    // Forearm & Hand
    ctx.translate(0, 52);
    if (armReachProgress > 0) {
      ctx.rotate(-0.4 * armReachProgress);
    }
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.lineTo(4, 50);
    ctx.lineTo(-4, 50);
    ctx.closePath();
    ctx.fill();

    // Hand
    ctx.translate(0, 50);
    ctx.beginPath();
    ctx.arc(0, 5, 5, 0, Math.PI * 2);
    ctx.fill();

    // If reaching, draw outstretched fingers holding payment or ticket
    if (armReachProgress > 0.5) {
      ctx.fillRect(-2, 4, 8, 4);
    }
    ctx.restore();

    // --- RIGHT ARM & BRIEFCASE ---
    ctx.save();
    ctx.translate(14, -100); // shoulder
    ctx.rotate(rightArmAngle);

    // Upper arm
    ctx.fillStyle = CONFIG.colors.redBright;
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(6, 0);
    ctx.lineTo(5, 54);
    ctx.lineTo(-5, 54);
    ctx.closePath();
    ctx.fill();

    // Forearm & Hand
    ctx.translate(0, 54);
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.lineTo(4, 48);
    ctx.lineTo(-4, 48);
    ctx.closePath();
    ctx.fill();

    // Hand gripping handle
    ctx.translate(0, 48);
    ctx.beginPath();
    ctx.arc(0, 5, 6, 0, Math.PI * 2);
    ctx.fill();

    // THE BRIEFCASE (1971 Classic Hard-shell Executive Attache)
    if (briefcaseHold) {
      ctx.save();
      ctx.translate(2, 10);
      ctx.rotate(briefcaseAngle);

      // Handle loop
      ctx.strokeStyle = red;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, -4, 7, Math.PI, 0, false);
      ctx.stroke();

      // Briefcase body (sharp rectangular silhouette)
      const bW = 54;
      const bH = 38;
      ctx.fillStyle = red;
      ctx.beginPath();
      ctx.roundRect(-bW / 2, 0, bW, bH, 3);
      ctx.fill();

      // Aluminum / brass trim detail (represented by negative space slits)
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-bW / 2 + 3, bH / 2);
      ctx.lineTo(bW / 2 - 3, bH / 2); // center seam
      ctx.stroke();

      // Twin keylocks / latches
      ctx.fillStyle = cutout;
      ctx.fillRect(-15, bH / 2 - 2, 4, 4);
      ctx.fillRect(11, bH / 2 - 2, 4, 4);

      ctx.restore();
    }

    ctx.restore(); // right arm

    ctx.restore(); // torso
    ctx.restore(); // root
  }

  /**
   * Draws the Airline Ticket Agent behind the counter.
   * Features:
   * - 1971 airline uniform (collared blazer, neat hair)
   * - Professional, calm counter posture
   * - Handing over ticket / processing payment
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
    const cutout = CONFIG.colors.cutout;

    // Body / Uniform torso (positioned behind the counter)
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(22, 0);
    ctx.lineTo(18, -90);
    ctx.lineTo(-18, -90);
    ctx.closePath();
    ctx.fill();

    // Airline scarf / collar cutout
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.moveTo(-5, -90);
    ctx.lineTo(5, -90);
    ctx.lineTo(0, -65);
    ctx.closePath();
    ctx.fill();

    // Neck & Head
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.rect(-5, -102, 10, 12);
    ctx.fill();

    // Head profile (facing left toward the man)
    ctx.beginPath();
    ctx.arc(0, -118, 14, 0, Math.PI * 2);
    ctx.fill();

    // 1971 flight attendant / gate agent bouffant/updo hairstyle
    ctx.beginPath();
    ctx.arc(-2, -122, 16, Math.PI * 0.7, Math.PI * 1.9);
    ctx.lineTo(8, -112);
    ctx.lineTo(-6, -112);
    ctx.closePath();
    ctx.fill();

    // Nose / profile facing left
    ctx.beginPath();
    ctx.moveTo(-12, -120);
    ctx.lineTo(-17, -117);
    ctx.lineTo(-12, -114);
    ctx.closePath();
    ctx.fill();

    // Arms and hands
    ctx.save();
    let leftArmAngle = 0.5; // resting on counter
    let rightArmAngle = -0.4;

    if (action === 'give') {
      const p = MathUtils.clamp(actionProgress, 0, 1);
      leftArmAngle = MathUtils.lerp(0.5, -0.7, p);
    } else if (action === 'receive') {
      const p = MathUtils.clamp(actionProgress, 0, 1);
      leftArmAngle = MathUtils.lerp(0.2, -0.5, p);
    }

    // Left arm (reaching forward over counter)
    ctx.translate(-14, -85);
    ctx.rotate(leftArmAngle);
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 52, 4);
    ctx.fill();

    ctx.translate(0, 52);
    ctx.beginPath();
    ctx.roundRect(-4, 0, 8, 42, 3);
    ctx.fill();

    // Hand holding ticket
    ctx.translate(0, 42);
    ctx.beginPath();
    ctx.arc(0, 4, 5, 0, Math.PI * 2);
    ctx.fill();

    if (action === 'give' && actionProgress > 0.3) {
      // Small rectangular ticket in hand
      ctx.fillStyle = CONFIG.colors.redBright;
      ctx.save();
      ctx.rotate(-0.3);
      ctx.fillRect(-15, -4, 28, 14);
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1;
      ctx.strokeRect(-15, -4, 28, 14);
      ctx.restore();
    }

    ctx.restore();

    ctx.restore();
  }

  /**
   * Distant Passenger Silhouette for depth and scale.
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

    // Coat / Body
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
    // 0.0 to 0.4s: Pure black opening
    // 0.4 to 2.8s: Slow cinematic red linework reveal and camera push
    const reveal = MathUtils.clamp((progress - 0.12) / 0.70, 0, 1);
    const alpha = MathUtils.smoothstep(reveal);

    if (alpha <= 0.001) {
      // Pure black
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    ctx.save();
    // Camera slow push-in toward terminal entrance
    const camZoom = MathUtils.lerp(0.97, 1.05, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(15, -15, progress);
    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    // Clear background
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Airport Horizon & Tarmac / Ground Line
    const groundY = 760;
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.85 * alpha})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(100, groundY);
    ctx.lineTo(width - 100, groundY);
    ctx.stroke();

    // Perspective lines on the entrance plaza
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.25 * alpha})`;
    ctx.lineWidth = 1.2;
    for (let i = -6; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(width / 2 + i * 140, groundY);
      ctx.lineTo(width / 2 + i * 260, height);
      ctx.stroke();
    }

    // Modernist 1970s Terminal Building Facade
    // Cantilever roof canopy
    const roofY = 320;
    const roofH = 45;
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(180, roofY, width - 360, roofH);

    ctx.strokeStyle = `rgba(255, 32, 32, ${0.9 * alpha})`;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(180, roofY, width - 360, roofH);

    // Deep canopy overhang fascia lines
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.45 * alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, roofY + 15);
    ctx.lineTo(width - 180, roofY + 15);
    ctx.moveTo(180, roofY + 30);
    ctx.lineTo(width - 180, roofY + 30);
    ctx.stroke();

    // Airport Lettering Signage: "PORTLAND INTERNATIONAL AIRPORT"
    ctx.save();
    ctx.font = 'bold 28px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 59, 59, ${0.95 * alpha})`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '5px';
    ctx.fillText('PORTLAND INTERNATIONAL AIRPORT', width / 2, roofY + 32);
    ctx.restore();

    // Vertical Glass Mullions & Large Airport Windows
    const windowTop = roofY + roofH;
    const windowH = groundY - windowTop;
    const numPanels = 14;
    const panelW = (width - 440) / numPanels;

    for (let i = 0; i <= numPanels; i++) {
      const px = 220 + i * panelW;
      ctx.strokeStyle = `rgba(255, 32, 32, ${0.4 * alpha})`;
      ctx.lineWidth = (i % 2 === 0) ? 2.0 : 1.0;
      ctx.beginPath();
      ctx.moveTo(px, windowTop);
      ctx.lineTo(px, groundY);
      ctx.stroke();
    }

    // Horizontal window divisions
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.25 * alpha})`;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(220, windowTop + windowH * 0.4);
    ctx.lineTo(width - 220, windowTop + windowH * 0.4);
    ctx.moveTo(220, windowTop + windowH * 0.7);
    ctx.lineTo(width - 220, windowTop + windowH * 0.7);
    ctx.stroke();

    // Interior linear fluorescent light strips (visible through glass)
    ctx.strokeStyle = `rgba(255, 32, 32, ${0.7 * alpha})`;
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 7; i++) {
      const lx = 320 + i * 180;
      ctx.beginPath();
      ctx.moveTo(lx - 40, windowTop + 35);
      ctx.lineTo(lx + 40, windowTop + 35);
      ctx.stroke();
    }

    // Terminal Entrance Sliding Doors
    const doorW = 200;
    const doorH = 190;
    const doorX = (width - doorW) / 2;
    const doorY = groundY - doorH;

    ctx.strokeStyle = `rgba(255, 32, 32, ${0.85 * alpha})`;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Door center split and horizontal push bars
    ctx.beginPath();
    ctx.moveTo(doorX + doorW / 2, doorY);
    ctx.lineTo(doorX + doorW / 2, groundY);
    ctx.moveTo(doorX + 15, doorY + doorH * 0.55);
    ctx.lineTo(doorX + doorW - 15, doorY + doorH * 0.55);
    ctx.stroke();

    // Distant passenger silhouettes moving inside concourse
    const pass1X = 460 + progress * 70;
    const pass2X = 1380 - progress * 50;
    drawDistantPassenger(ctx, pass1X, groundY - 2, 0.42, true, t * 1.3, 1);
    drawDistantPassenger(ctx, pass2X, groundY - 2, 0.38, true, t * 1.1, -1);

    // Subtle atmospheric fade out near shot end
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

    // Camera slow tracking from left to right with the man
    const camPanX = MathUtils.lerp(-80, 80, progress);
    const camZoom = MathUtils.lerp(0.99, 1.02, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2 - camPanX, -height / 2);

    // Clear background
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width * 1.5, height);

    const floorY = 820;

    // Architectural Interior: Ceiling beams with recessed downlights
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 1.8;
    for (let y = 140; y <= 240; y += 45) {
      ctx.beginPath();
      ctx.moveTo(-200, y);
      ctx.lineTo(width + 200, y);
      ctx.stroke();
    }

    // Ceiling lights (1970s linear troffers)
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.5;
    for (let x = -100; x < width + 300; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x, 185);
      ctx.lineTo(x + 110, 185);
      ctx.stroke();
    }

    // Floor perspective lines leading into deep vanishing point
    const vpX = 960;
    const vpY = 480;
    ctx.strokeStyle = CONFIG.colors.redFaint;
    ctx.lineWidth = 1.0;
    for (let x = -400; x <= width + 400; x += 120) {
      ctx.beginPath();
      ctx.moveTo(vpX, vpY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Floor base line
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-200, floorY);
    ctx.lineTo(width + 200, floorY);
    ctx.stroke();

    // Distant Terminal Concourse Signage
    ctx.save();
    const signX = 1320;
    const signY = 310;
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2;
    ctx.strokeRect(signX, signY, 260, 48);

    ctx.font = 'bold 18px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = CONFIG.colors.redBright;
    ctx.textAlign = 'left';
    ctx.fillText('CONCOURSE B   \u2192', signX + 25, signY + 31);
    ctx.restore();

    // Background passenger walking in opposite direction for depth
    const distManX = 1400 - progress * 90;
    drawDistantPassenger(ctx, distManX, floorY - 60, 0.48, true, t * 1.2, -1);

    // Queue barrier stanchions in mid-ground
    for (let sx = 1450; sx <= 1850; sx += 90) {
      ctx.strokeStyle = CONFIG.colors.redDim;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(sx, floorY - 55);
      ctx.lineTo(sx, floorY);
      ctx.stroke();

      // Stanchion base & cap
      ctx.fillStyle = CONFIG.colors.redDim;
      ctx.fillRect(sx - 8, floorY - 3, 16, 3);
      ctx.beginPath();
      ctx.arc(sx, floorY - 55, 4, 0, Math.PI * 2);
      ctx.fill();

      // Velvet rope
      if (sx < 1850) {
        ctx.beginPath();
        ctx.moveTo(sx, floorY - 50);
        ctx.quadraticCurveTo(sx + 45, floorY - 38, sx + 90, floorY - 50);
        ctx.stroke();
      }
    }

    // THE MIDDLE-AGED MAN
    // Walks calmly from left edge (x ~ 180) to center-right (x ~ 980)
    // Speed is normal, steady, measured.
    const manStartX = 180;
    const manEndX = 1040;
    const manX = MathUtils.lerp(manStartX, manEndX, MathUtils.clamp(progress / 0.95, 0, 1));
    const manY = floorY;

    // Step cycle: ~1.25 Hz
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

    // Fade-in at start & fade-out at end for smooth shot transition
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

    // Camera slow push-in focusing toward the two figures
    const camZoom = MathUtils.lerp(1.0, 1.06, MathUtils.easeInOutQuad(progress));
    const camPanX = MathUtils.lerp(0, 40, progress);

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
    ctx.moveTo(100, floorY);
    ctx.lineTo(width - 100, floorY);
    ctx.stroke();

    for (let x = 200; x <= width - 100; x += 150) {
      ctx.strokeStyle = CONFIG.colors.redFaint;
      ctx.beginPath();
      ctx.moveTo(960, 460);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 1971 Airline Ticket Counter Architecture
    const counterX = 1120;
    const counterY = 560;
    const counterW = 480;
    const counterH = floorY - counterY;

    // Back wall flight information board outline (vintage flip-disc board grid)
    ctx.strokeStyle = CONFIG.colors.redFaint;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(1080, 240, 560, 180);
    for (let r = 270; r < 420; r += 28) {
      ctx.beginPath();
      ctx.moveTo(1080, r);
      ctx.lineTo(1640, r);
      ctx.stroke();
    }

    // Vintage Airline Logo / Desk header
    ctx.font = 'bold 22px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = CONFIG.colors.redBright;
    ctx.textAlign = 'left';
    ctx.fillText('PASSENGER SERVICE  \u2022  TICKETS', counterX + 30, counterY - 45);

    // Counter Desk Top & Base (Solid Modernist Silhouette)
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(counterX, counterY, counterW, counterH);

    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(counterX, counterY, counterW, counterH);

    // Counter top overhang lip
    ctx.fillStyle = CONFIG.colors.red;
    ctx.fillRect(counterX - 25, counterY - 12, counterW + 40, 14);

    // Baggage scale beside the counter
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + counterW - 40, floorY - 35, 120, 35);
    ctx.beginPath();
    ctx.moveTo(counterX + counterW + 40, floorY - 35);
    ctx.lineTo(counterX + counterW + 40, floorY - 95);
    ctx.arc(counterX + counterW + 40, floorY - 110, 15, 0, Math.PI * 2);
    ctx.stroke();

    // AIRLINE TICKET AGENT (Behind counter)
    // Agent is calmly waiting, observing the arriving passenger
    drawTicketAgent(ctx, {
      x: counterX + 170,
      y: counterY + 120,
      scale: 1.35,
      action: 'idle',
      actionProgress: 0
    });

    // MIDDLE-AGED MAN
    // Approaches counter from left:
    // Walks smoothly, decelerates and stops at counter (around progress 0.65)
    const stopProgress = 0.62;
    const isStopping = progress >= stopProgress;
    const walkT = MathUtils.clamp(progress / stopProgress, 0, 1);
    const manCurrentX = MathUtils.lerp(380, 890, MathUtils.easeOutQuad(walkT));

    // Stride slows down as he reaches the counter
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

    // Quiet, tense hold moment from progress 0.65 to 1.0
    // The two figures face each other across the counter in calm silence.

    // Transitions
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

    // Medium shot: closer framing focusing on the transaction between man and agent
    // Camera pushes in slowly toward the transaction on the counter
    const camZoom = MathUtils.lerp(1.22, 1.38, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(40, -10, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    const floorY = 860;
    const counterY = 610;
    const counterX = 920;

    // Background horizontal divider lines
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(200, 360);
    ctx.lineTo(width - 200, 360);
    ctx.moveTo(200, 450);
    ctx.lineTo(width - 200, 450);
    ctx.stroke();

    // Counter Desk
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(counterX - 40, counterY, 600, floorY - counterY);
    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(counterX - 40, counterY, 600, floorY - counterY);

    // Counter Top
    ctx.fillStyle = CONFIG.colors.red;
    ctx.fillRect(counterX - 80, counterY - 14, 680, 16);

    // 1971 Ticket Validator / Stamp Machine outline on desk
    ctx.strokeStyle = CONFIG.colors.redMuted;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + 180, counterY - 45, 60, 32);
    ctx.beginPath();
    ctx.moveTo(counterX + 230, counterY - 45);
    ctx.lineTo(counterX + 245, counterY - 60); // stamp handle
    ctx.stroke();

    // TRANSACTION TIMELINE:
    // Phase 1 (progress 0.0 -> 0.35): Man extends hand with payment
    // Phase 2 (progress 0.35 -> 0.65): Agent processes and slides ticket across counter
    // Phase 3 (progress 0.65 -> 1.0): Man reaches out and picks up ticket
    const p1 = MathUtils.clamp(progress / 0.35, 0, 1);
    const p2 = MathUtils.clamp((progress - 0.35) / 0.30, 0, 1);
    const p3 = MathUtils.clamp((progress - 0.65) / 0.35, 0, 1);

    // Airline Agent behind counter
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

    drawTicketAgent(ctx, {
      x: counterX + 260,
      y: counterY + 115,
      scale: 1.5,
      action: agentAction,
      actionProgress: agentProgress
    });

    // Middle-Aged Man at counter
    // Holding briefcase firmly in right hand, left arm interacts with counter
    const armReach = (progress < 0.35)
      ? MathUtils.easeOutQuad(p1)
      : (progress < 0.65)
        ? 0.35
        : MathUtils.lerp(0.35, 0.95, MathUtils.easeOutQuad(p3));

    drawManSilhouette(ctx, {
      x: 720,
      y: floorY,
      scale: 1.5,
      walkPhase: 0,
      isWalking: false,
      briefcaseHold: true,
      armReachProgress: armReach,
      facing: 1
    });

    // THE PHYSICAL TICKET ON THE COUNTER
    // Slid from agent's side to man's side
    if (progress >= 0.35) {
      const ticketX = (progress < 0.65)
        ? MathUtils.lerp(counterX + 180, counterX + 20, MathUtils.easeInOutQuad(p2))
        : (progress < 0.85)
          ? counterX + 20
          : MathUtils.lerp(counterX + 20, counterX - 10, MathUtils.easeOutQuad((progress - 0.85) / 0.15));

      const ticketY = (progress < 0.85)
        ? counterY - 14
        : MathUtils.lerp(counterY - 14, counterY - 30, MathUtils.easeOutQuad((progress - 0.85) / 0.15));

      const ticketRot = (progress < 0.85) ? 0 : -0.15 * ((progress - 0.85) / 0.15);

      ctx.save();
      ctx.translate(ticketX, ticketY);
      ctx.rotate(ticketRot);

      // Red rectangular ticket outline
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(-35, -12, 70, 24);
      ctx.strokeStyle = CONFIG.colors.redBright;
      ctx.lineWidth = 2.2;
      ctx.strokeRect(-35, -12, 70, 24);

      // Subtle ticket typography lines
      ctx.fillStyle = CONFIG.colors.redBright;
      ctx.fillRect(-28, -6, 25, 3);
      ctx.fillRect(-28, 0, 45, 3);
      ctx.fillRect(-28, 6, 32, 2);

      ctx.restore();
    } else {
      // Payment (folded dollar bills / travel voucher) handed over by man
      const billX = MathUtils.lerp(790, counterX + 20, MathUtils.easeOutQuad(p1));
      const billY = MathUtils.lerp(counterY - 35, counterY - 12, p1);
      ctx.save();
      ctx.fillStyle = CONFIG.colors.red;
      ctx.fillRect(billX - 18, billY - 6, 36, 12);
      ctx.strokeStyle = CONFIG.colors.cutout;
      ctx.lineWidth = 1;
      ctx.strokeRect(billX - 18, billY - 6, 36, 12);
      ctx.restore();
    }

    // Transitions
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

    // Slow, solemn camera drift and push-in toward the word "SEATTLE"
    const camZoom = MathUtils.lerp(1.0, 1.08, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(0, -15, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Reveal calculation
    // Fade in from black at 0.0 -> 0.15
    // Steady hold 0.15 -> 0.70
    // Fade to pure black at 0.70 -> 1.00
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

    // Silhouetted Hand Holding the Ticket at Left/Bottom
    ctx.save();
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.95})`;
    // Thumb resting over ticket border
    ctx.beginPath();
    ctx.arc(380, 540, 28, 0, Math.PI * 2);
    ctx.fill();
    // Fingers / hand mass below
    ctx.beginPath();
    ctx.moveTo(260, 780);
    ctx.lineTo(390, 620);
    ctx.lineTo(380, 530);
    ctx.lineTo(320, 500);
    ctx.lineTo(220, 780);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // THE 1971 AIRLINE PASSENGER TICKET
    const tW = 860;
    const tH = 460;
    const tX = (width - tW) / 2 + 50;
    const tY = (height - tH) / 2;

    // Ticket Background (Deep negative black with red border)
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(tX, tY, tW, tH);

    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha})`;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(tX, tY, tW, tH);

    // Inner dashed perforation / border line
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.45})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(tX + 12, tY + 12, tW - 24, tH - 24);
    ctx.setLineDash([]); // reset

    // Ticket Header Banner
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.7})`;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(tX + 12, tY + 65);
    ctx.lineTo(tX + tW - 12, tY + 65);
    ctx.stroke();

    // Header Text (Authentic 1971 Passenger Ticket & Baggage Check)
    ctx.font = '600 20px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha * 0.9})`;
    ctx.textAlign = 'left';
    ctx.fillText('PASSENGER TICKET & BAGGAGE CHECK', tX + 35, tY + 45);

    ctx.textAlign = 'right';
    ctx.font = '500 16px "Courier New", monospace';
    ctx.fillText('FORM 305-NW', tX + tW - 35, tY + 45);

    // --- MAIN REQUIRED TICKET CONTENT ---
    // 1. "ONE WAY"
    ctx.textAlign = 'left';
    ctx.font = 'bold 28px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha})`;
    ctx.fillText('ONE WAY', tX + 50, tY + 130);

    // Divider accent line
    ctx.strokeStyle = `rgba(255, 32, 32, ${alpha * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tX + 50, tY + 155);
    ctx.lineTo(tX + tW - 50, tY + 155);
    ctx.stroke();

    // 2. ROUTE: PORTLAND -> SEATTLE
    // Portland (medium size)
    ctx.font = 'bold 36px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.85})`;
    ctx.fillText('PORTLAND', tX + 50, tY + 230);

    // Route arrow
    ctx.font = 'bold 38px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha * 0.75})`;
    ctx.fillText('\u2192', tX + 300, tY + 230);

    // SEATTLE (Subtly emphasized: larger, bold, authoritative, bright red)
    ctx.font = 'bold 56px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 59, 59, ${alpha})`;
    ctx.fillText('SEATTLE', tX + 370, tY + 233);

    // Subtle underline accent under SEATTLE
    ctx.strokeStyle = `rgba(255, 59, 59, ${alpha * 0.85})`;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(tX + 370, tY + 252);
    ctx.lineTo(tX + 660, tY + 252);
    ctx.stroke();

    // 3. DATE: NOV 24, 1971
    ctx.font = '600 28px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.95})`;
    ctx.fillText('NOV 24, 1971', tX + 50, tY + 325);

    // Historical Period Details (Authentic 1971 Flight Info)
    ctx.font = '500 18px "Courier New", monospace';
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
    ctx.font = 'bold 12px "Helvetica Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255, 32, 32, ${alpha * 0.6})`;
    ctx.fillText('PDX AIRPORT', 0, -18);
    ctx.fillText('24 NOV 1971', 0, 4);
    ctx.fillText('TICKETING', 0, 24);
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // MASTER FRAME RENDER FUNCTION
  // =========================================================================
  function renderFrame(ctx, timeInSeconds) {
    const t = MathUtils.clamp(timeInSeconds, 0, CONFIG.totalDuration);
    const { width, height, shots } = CONFIG;

    // Clear frame to pure black
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Find current active shot
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
