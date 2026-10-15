/**
 * 1971 Mystery Documentary Animation Engine
 * Red-on-Black Minimalist Cinematic Motion Graphic
 *
 * Sequence:
 * Narration: "In the afternoon of November 24, 1971, a middle-aged man carrying a briefcase
 * walked into Portland International Airport and purchased a one-way ticket to Seattle, Washington."
 *
 * Visual Rules:
 * - Background: Pure Black (#000000)
 * - Characters & Key Elements: Crimson Red (#FF2020 / #FF3B3B)
 * - Negative Space: Pure Black (#000000) for shirt collar, seams, lapels
 * - No green, blue, yellow, or photographic textures
 * - Deterministic 1920x1080 30 FPS rendering
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
      redDeep: '#9A1010',
      redDim: 'rgba(255, 32, 32, 0.45)',
      redFaint: 'rgba(255, 32, 32, 0.14)',
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

  // --- MATH & EASING UTILITIES ---
  const MathUtils = {
    clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
    lerp: (a, b, t) => a + (b - a) * t,
    smoothstep: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    },
    easeInOutQuad: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    },
    easeOutQuad: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return 1 - (1 - c) * (1 - c);
    },
    easeInOutCubic: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
    },
    easeOutCubic: (t) => {
      const c = Math.max(0, Math.min(1, t));
      return 1 - Math.pow(1 - c, 3);
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

  // =========================================================================
  // CHARACTER SILHOUETTES
  // =========================================================================

  /**
   * Draws the Middle-Aged Man silhouette.
   * True profile/three-quarter view of a 1971 businessman:
   * - Tailored two-piece suit with curved back, chest profile, wide lapels
   * - Negative space white shirt collar cutout & sleek necktie
   * - Mature head profile: clean brow, straight nose, firm chin, side-parted hair
   * - Classic straight trousers over low-heel dress shoes
   * - Hard-shell 1971 attache briefcase held in right hand with physics inertia
   * - Left arm swinging in natural counter-motion or reaching forward across counter
   */
  function drawManSilhouette(ctx, options = {}) {
    const {
      x = 960,
      y = 800,
      scale = 1.45,
      walkPhase = 0,
      isWalking = false,
      armReachProgress = 0, // 0 to 1
      briefcaseHold = true,
      facing = 1 // 1: right, -1: left
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    const red = CONFIG.colors.red;
    const redBright = CONFIG.colors.redBright;
    const redDeep = CONFIG.colors.redDeep;
    const cutout = CONFIG.colors.cutout;

    let bob = 0;
    let torsoTilt = 0.02;
    let nearLegAngle = 0;
    let farLegAngle = 0;
    let nearKneeAngle = 0;
    let farKneeAngle = 0;
    let nearArmAngle = 0;
    let farArmAngle = 0;
    let briefcaseTilt = 0;

    if (isWalking) {
      const cycle = walkPhase * Math.PI * 2;
      bob = -Math.abs(Math.sin(cycle)) * 4.5;
      torsoTilt = 0.025 + Math.sin(cycle) * 0.008;

      const stride = 0.38;
      nearLegAngle = Math.sin(cycle) * stride;
      farLegAngle = Math.sin(cycle + Math.PI) * stride;

      nearKneeAngle = Math.max(0, -Math.sin(cycle) * 0.45);
      farKneeAngle = Math.max(0, -Math.sin(cycle + Math.PI) * 0.45);

      farArmAngle = -Math.sin(cycle) * 0.32;
      nearArmAngle = Math.sin(cycle) * 0.12;
      briefcaseTilt = nearArmAngle * 0.85;
    } else {
      torsoTilt = 0.01;
      nearLegAngle = 0.02;
      farLegAngle = -0.03;
      nearKneeAngle = 0.02;
      farKneeAngle = 0.02;
      farArmAngle = armReachProgress > 0 ? -1.15 * armReachProgress : 0.04;
      nearArmAngle = 0.02;
      briefcaseTilt = 0.01;
    }

    ctx.translate(0, bob);

    // --- 1. FAR ARM (Left arm swinging or reaching) ---
    ctx.save();
    ctx.translate(-2, -145); // Shoulder joint
    ctx.rotate(farArmAngle);

    ctx.fillStyle = redDeep;
    // Bicep
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 46, 5);
    ctx.fill();

    // Forearm
    ctx.translate(0, 44);
    if (armReachProgress > 0) {
      ctx.rotate(-0.50 * armReachProgress);
    }
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 42, 4);
    ctx.fill();

    // Shirt cuff slit in negative space
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5, 36);
    ctx.lineTo(5, 36);
    ctx.stroke();

    // Hand
    ctx.translate(0, 40);
    ctx.beginPath();
    ctx.arc(0, 4, 5.5, 0, Math.PI * 2);
    ctx.fill();

    if (armReachProgress > 0.25) {
      ctx.fillRect(-2, 2, 10, 5);
    }
    ctx.restore(); // Far arm

    // --- 2. FAR LEG (Left leg) ---
    const drawLeg = (angle, kneeBend, isBack) => {
      ctx.save();
      ctx.translate(isBack ? -4 : 4, -105); // Hip joint
      ctx.rotate(angle);

      ctx.fillStyle = isBack ? redDeep : red;

      // Thigh (tailored trouser cut)
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.lineTo(10, 56);
      ctx.lineTo(-10, 56);
      ctx.closePath();
      ctx.fill();

      // Knee joint & Shin
      ctx.translate(0, 56);
      ctx.rotate(kneeBend);

      // Smooth knee joint cap
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Lower trouser (1971 straight cut, slight break at cuff)
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.lineTo(12, 52);
      ctx.lineTo(-11, 52);
      ctx.closePath();
      ctx.fill();

      // Crease line in negative space
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(1, 4);
      ctx.lineTo(1.5, 48);
      ctx.stroke();

      // 1971 Oxford Leather Dress Shoe
      ctx.translate(0, 52);
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(9, 0);
      ctx.lineTo(20, 7);
      ctx.lineTo(19, 13);
      ctx.lineTo(-11, 13);
      ctx.lineTo(-11, 3);
      ctx.closePath();
      ctx.fill();

      // Shoe heel cutout
      ctx.fillStyle = cutout;
      ctx.fillRect(-11, 8, 4.5, 5);

      ctx.restore();
    };

    drawLeg(farLegAngle, farKneeAngle, true);

    // --- 3. TORSO & COAT (Profile / Three-Quarter) ---
    ctx.save();
    ctx.translate(0, -105);
    ctx.rotate(torsoTilt);

    ctx.fillStyle = red;
    // Tailored suit jacket silhouette (flowing curve from collar to skirt)
    ctx.beginPath();
    ctx.moveTo(-14, -72); // back collar
    ctx.bezierCurveTo(-20, -50, -19, -20, -18, 16); // natural back curve
    ctx.lineTo(15, 16);  // bottom hem
    ctx.bezierCurveTo(18, -10, 20, -45, 12, -72);   // chest curve into front collar
    ctx.closePath();
    ctx.fill();

    // White shirt collar opening in negative space
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.moveTo(3, -72);
    ctx.lineTo(13, -72);
    ctx.lineTo(7, -48);
    ctx.lineTo(1, -48);
    ctx.closePath();
    ctx.fill();

    // Red necktie inside collar cutout
    ctx.fillStyle = redBright;
    ctx.beginPath();
    ctx.moveTo(5, -66);
    ctx.lineTo(9, -66);
    ctx.lineTo(8, -42);
    ctx.lineTo(6, -42);
    ctx.closePath();
    ctx.fill();

    // Suit lapel seam line
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(13, -70);
    ctx.lineTo(9, -46);
    ctx.lineTo(4, -22);
    ctx.stroke();

    // Jacket back vent slit in negative space
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(-16, 16);
    ctx.stroke();

    // --- 4. MATURE BUSINESSMAN HEAD IN PROFILE ---
    // Neck
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(-9, -72);
    ctx.lineTo(-7, -84);
    ctx.lineTo(6, -84);
    ctx.lineTo(8, -72);
    ctx.closePath();
    ctx.fill();

    // Shirt collar ring in negative space
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-7, -73);
    ctx.lineTo(8, -73);
    ctx.stroke();

    // Clean, confident, iconic mid-century silhouette head:
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

    // 1971 side-parted hair line in negative space
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-7, -106);
    ctx.quadraticCurveTo(1, -108, 11, -103);
    ctx.stroke();

    // Ear contour
    ctx.beginPath();
    ctx.arc(-1, -94, 3.5, -Math.PI * 0.45, Math.PI * 0.55);
    ctx.stroke();

    ctx.restore(); // Torso

    // --- 5. NEAR LEG (Right leg) ---
    drawLeg(nearLegAngle, nearKneeAngle, false);

    // --- 6. NEAR ARM & BRIEFCASE (Right arm) ---
    ctx.save();
    ctx.translate(5, -177 + bob); // Near shoulder socket
    ctx.rotate(nearArmAngle);

    // Upper arm
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.roundRect(-6, 0, 12, 46, 5);
    ctx.fill();

    // Negative space separation seam between arm and torso
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(-6, 40);
    ctx.stroke();

    // Forearm
    ctx.translate(0, 44);
    ctx.beginPath();
    ctx.roundRect(-5, 0, 10, 42, 4);
    ctx.fill();

    // Shirt cuff slit
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-5, 36);
    ctx.lineTo(5, 36);
    ctx.stroke();

    // Hand
    ctx.translate(0, 38);
    ctx.beginPath();
    ctx.arc(0, 4, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // BRIEFCASE (1971 Hard-shell Executive Attache)
    if (briefcaseHold) {
      ctx.save();
      ctx.translate(1, 8);
      ctx.rotate(briefcaseTilt);

      // Handle loop
      ctx.strokeStyle = red;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, -5, 7.5, Math.PI, 0, false);
      ctx.stroke();

      // Briefcase rectangular body
      const bw = 54;
      const bh = 36;
      ctx.fillStyle = red;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, 0, bw, bh, 3);
      ctx.fill();

      // Negative space center seam
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-bw / 2 + 1, bh / 2);
      ctx.lineTo(bw / 2 - 1, bh / 2);
      ctx.stroke();

      // Dual keylatches
      ctx.fillStyle = cutout;
      ctx.fillRect(-15, bh / 2 - 2.5, 4.5, 5);
      ctx.fillRect(10.5, bh / 2 - 2.5, 4.5, 5);

      // Corner guards
      ctx.strokeStyle = cutout;
      ctx.lineWidth = 1.0;
      ctx.strokeRect(-bw / 2 + 1, 1, 5, 5);
      ctx.strokeRect(bw / 2 - 6, 1, 5, 5);
      ctx.strokeRect(-bw / 2 + 1, bh - 6, 5, 5);
      ctx.strokeRect(bw / 2 - 6, bh - 6, 5, 5);

      ctx.restore();
    }

    ctx.restore(); // Near arm
    ctx.restore(); // Base
  }

  /**
   * Draws the Airline Ticket Agent behind the counter.
   * 1971 airline uniform (collared blazer, neck scarf cutout, neat updo hairstyle).
   * Positioned on floor level behind ticket desk.
   */
  function drawTicketAgent(ctx, options = {}) {
    const {
      x = 1320,
      y = 820,
      scale = 1.45,
      action = 'idle', // 'idle', 'greet', 'receive', 'give'
      actionProgress = 0,
      facing = -1 // -1: facing left toward passenger
    } = options;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * Math.abs(facing), scale);

    const red = CONFIG.colors.red;
    const redBright = CONFIG.colors.redBright;
    const cutout = CONFIG.colors.cutout;

    // Torso (waist up, authentic 1971 airline blazer)
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-16, 0);
    ctx.bezierCurveTo(-18, -40, -20, -90, -15, -135); // front shoulder
    ctx.lineTo(15, -135);                              // back shoulder
    ctx.bezierCurveTo(18, -90, 18, -40, 16, 0);
    ctx.closePath();
    ctx.fill();

    // White collared blouse cutout in negative space
    ctx.fillStyle = cutout;
    ctx.beginPath();
    ctx.moveTo(-9, -135);
    ctx.lineTo(0, -135);
    ctx.lineTo(-5, -108);
    ctx.closePath();
    ctx.fill();

    // Red airline silk neck scarf knot
    ctx.fillStyle = redBright;
    ctx.beginPath();
    ctx.arc(-5, -112, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = red;
    ctx.fillRect(-7, -150, 14, 16);

    // Blouse collar seam line
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-8, -136);
    ctx.lineTo(8, -136);
    ctx.stroke();

    // Head in Profile facing left toward the passenger
    ctx.beginPath();
    ctx.moveTo(6, -150);                               // back of neck
    ctx.bezierCurveTo(17, -154, 18, -178, 6, -184);    // 1971 updo hair bun
    ctx.bezierCurveTo(-4, -186, -13, -182, -14, -172); // crown & forehead
    ctx.lineTo(-14, -166);                            // brow
    ctx.lineTo(-18, -163);                             // nose
    ctx.lineTo(-14.5, -160);                           // philtrum
    ctx.lineTo(-15, -157);                             // lips
    ctx.lineTo(-13, -154);                             // chin
    ctx.lineTo(-3, -151);                              // jawline
    ctx.closePath();
    ctx.fill();

    // Hair contour
    ctx.strokeStyle = cutout;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(6, -174);
    ctx.quadraticCurveTo(-2, -176, -10, -170);
    ctx.stroke();

    // Ear
    ctx.beginPath();
    ctx.arc(0, -162, 3, -Math.PI * 0.55, Math.PI * 0.45);
    ctx.stroke();

    // Arms & Hand Positions
    // Base shoulder pivot at (-15, -132)
    let armRot = 0.25;
    if (action === 'receive') {
      armRot = MathUtils.lerp(0.25, -0.65, MathUtils.clamp(actionProgress, 0, 1));
    } else if (action === 'give') {
      armRot = MathUtils.lerp(0.25, -0.75, MathUtils.clamp(actionProgress, 0, 1));
    }

    ctx.save();
    ctx.translate(-15, -132);
    ctx.rotate(armRot);

    // Upper arm
    ctx.fillStyle = red;
    ctx.beginPath();
    ctx.roundRect(-5.5, 0, 11, 46, 4);
    ctx.fill();

    // Forearm
    ctx.translate(0, 44);
    ctx.beginPath();
    ctx.roundRect(-4.5, 0, 9, 44, 3);
    ctx.fill();

    // Hand
    ctx.translate(0, 42);
    ctx.beginPath();
    ctx.arc(0, 4, 5, 0, Math.PI * 2);
    ctx.fill();

    // If sliding ticket envelope in hand
    if (action === 'give' && actionProgress > 0.3) {
      ctx.save();
      ctx.translate(-14, -4);
      ctx.rotate(-0.2);
      ctx.fillStyle = cutout;
      ctx.fillRect(-20, -6, 40, 18);
      ctx.strokeStyle = redBright;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-20, -6, 40, 18);
      ctx.fillStyle = redBright;
      ctx.fillRect(-16, -2, 16, 2.5);
      ctx.fillRect(-16, 3, 26, 2.5);
      ctx.restore();
    }

    ctx.restore(); // Arm
    ctx.restore(); // Root
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
    ctx.arc(0, -112, 12, 0, Math.PI * 2);
    ctx.fill();

    // Torso / Overcoat
    ctx.beginPath();
    ctx.moveTo(-16, -96);
    ctx.lineTo(16, -96);
    ctx.lineTo(19, 0);
    ctx.lineTo(-19, 0);
    ctx.closePath();
    ctx.fill();

    // Legs
    const legSwing = walking ? Math.sin(phase * Math.PI * 2) * 12 : 0;
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(-6 - legSwing, 46);
    ctx.moveTo(6, 0);
    ctx.lineTo(6 + legSwing, 46);
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // SCENE 1 — AIRPORT ESTABLISHING SHOT
  // =========================================================================
  function scene_establishing_airport(ctx, width, height, t, progress, camera) {
    // 0.0s to 0.4s: Total pitch black screen
    // 0.4s to 1.8s: Slow cinematic reveal
    const reveal = MathUtils.clamp((progress - 0.12) / 0.70, 0, 1);
    const alpha = MathUtils.smoothstep(reveal);

    if (alpha <= 0.001) {
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    ctx.save();
    const camZoom = MathUtils.lerp(0.95, 1.07, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(18, -12, progress);
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
    // Subtle beacon pulse
    const beaconPulse = 0.5 + 0.5 * Math.sin(t * 4);
    ctx.fillStyle = `rgba(255, 59, 59, ${beaconPulse * alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(towerX, towerY + 12, 3, 0, Math.PI * 2);
    ctx.fill();
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

    const camPanX = MathUtils.lerp(-110, 80, progress);
    const camZoom = MathUtils.lerp(0.99, 1.03, progress);

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
    ctx.strokeStyle = CONFIG.colors.redMuted || CONFIG.colors.redDim;
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
    ctx.strokeStyle = CONFIG.colors.redDim;
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
    const manStartX = 180;
    const manEndX = 1060;
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
    const counterW = 490;
    // Counter top waist height relative to floorY
    const counterTopY = floorY - 175; // 645
    const counterH = floorY - counterTopY;

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

    // Hanging Overhead Desk Signage
    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + 20, counterTopY - 180, counterW - 40, 42);

    // Pendant suspension rods
    ctx.beginPath();
    ctx.moveTo(counterX + 80, counterTopY - 180);
    ctx.lineTo(counterX + 80, 140);
    ctx.moveTo(counterX + counterW - 80, counterTopY - 180);
    ctx.lineTo(counterX + counterW - 80, 140);
    ctx.stroke();

    ctx.font = `bold 20px ${CONFIG.fonts.bold}`;
    ctx.fillStyle = CONFIG.colors.redBright;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PASSENGER SERVICE \u2022 TICKETS', counterX + counterW / 2, counterTopY - 159);

    // 1. AIRLINE TICKET AGENT (Drawn standing on floorY BEHIND the counter)
    drawTicketAgent(ctx, {
      x: counterX + 260,
      y: floorY,
      scale: 1.45,
      action: progress > 0.6 ? 'greet' : 'idle',
      actionProgress: 0,
      facing: -1
    });

    // 2. COUNTER DESK (Solid black fill in front of agent to occlude lower body)
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(counterX, counterTopY, counterW, counterH);

    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(counterX, counterTopY, counterW, counterH);

    // Counter top shelf overhang
    ctx.fillStyle = CONFIG.colors.red;
    ctx.fillRect(counterX - 25, counterTopY - 14, counterW + 40, 16);

    // Desk fascia accent stripe
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(counterX, counterTopY + 50);
    ctx.lineTo(counterX + counterW, counterTopY + 50);
    ctx.stroke();

    // Baggage scale beside the counter
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterX + counterW - 40, floorY - 35, 120, 35);
    ctx.beginPath();
    ctx.moveTo(counterX + counterW + 40, floorY - 35);
    ctx.lineTo(counterX + counterW + 40, floorY - 95);
    ctx.arc(counterX + counterW + 40, floorY - 110, 15, 0, Math.PI * 2);
    ctx.stroke();

    // 3. MIDDLE-AGED MAN APPROACHING COUNTER
    const stopProgress = 0.58;
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

    // Medium shot framing focusing on the counter transaction
    // Smooth camera push-in toward the counter transaction
    const camZoom = MathUtils.lerp(1.30, 1.48, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(15, -10, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    const floorY = 880;
    const counterTopY = floorY - 175; // 705
    const counterY = counterTopY + 14;
    const counterLeft = 700;
    const counterRight = 1440;
    const counterW = counterRight - counterLeft;

    // Background horizontal divider lines
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(100, 360);
    ctx.lineTo(width - 100, 360);
    ctx.moveTo(100, 450);
    ctx.lineTo(width - 100, 450);
    ctx.stroke();

    // Flight NW 305 Board in background
    ctx.strokeStyle = CONFIG.colors.redFaint;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(740, 220, 520, 95);
    ctx.font = `bold 16px ${CONFIG.fonts.mono}`;
    ctx.fillStyle = CONFIG.colors.redDim;
    ctx.fillText('NW 305   PORTLAND -> SEATTLE   14:50', 770, 258);
    ctx.fillText('STATUS: BOARDING ON TIME       GATE 4', 770, 290);

    // TRANSACTION PHASES:
    // Phase 1 (0.0 -> 0.35): Man hands over cash payment ($20 bill fold)
    // Phase 2 (0.35 -> 0.70): Agent validates and slides ticket envelope across counter
    // Phase 3 (0.70 -> 1.00): Man reaches forward and takes the ticket
    const p1 = MathUtils.clamp(progress / 0.35, 0, 1);
    const p2 = MathUtils.clamp((progress - 0.35) / 0.35, 0, 1);
    const p3 = MathUtils.clamp((progress - 0.70) / 0.30, 0, 1);

    let agentAct = 'idle';
    let agentProg = 0;
    if (progress < 0.35) {
      agentAct = 'receive';
      agentProg = p1;
    } else if (progress < 0.70) {
      agentAct = 'give';
      agentProg = p2;
    } else {
      agentAct = 'give';
      agentProg = 1.0;
    }

    // 1. TICKET AGENT (standing on floorY behind counter)
    drawTicketAgent(ctx, {
      x: 1330,
      y: floorY,
      scale: 1.45,
      action: agentAct,
      actionProgress: agentProg,
      facing: -1
    });

    // 2. COUNTER DESK (Solid black fill in front of agent to occlude lower body)
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(counterLeft, counterY, counterW, floorY - counterY + 20);

    ctx.strokeStyle = CONFIG.colors.red;
    ctx.lineWidth = 3.0;
    ctx.strokeRect(counterLeft, counterY, counterW, floorY - counterY + 20);

    // Counter Top Surface
    ctx.fillStyle = CONFIG.colors.red;
    ctx.fillRect(counterLeft - 40, counterTopY, counterW + 60, 16);

    // 1971 Ticket Validator / Stamp Machine outline on desk
    ctx.strokeStyle = CONFIG.colors.redDim;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(counterLeft + counterW - 180, counterTopY - 35, 55, 32);

    // 3. THE MIDDLE-AGED MAN
    const manArmReach = (progress < 0.35)
      ? MathUtils.easeOutQuad(p1)
      : (progress < 0.70)
        ? 0.45
        : MathUtils.lerp(0.45, 0.95, MathUtils.easeOutQuad(p3));

    drawManSilhouette(ctx, {
      x: 580,
      y: floorY,
      scale: 1.45,
      walkPhase: 0,
      isWalking: false,
      briefcaseHold: true,
      armReachProgress: manArmReach,
      facing: 1
    });

    // 4. TRANSACTION ITEMS (Folded Money / Airline Ticket)
    if (progress < 0.35) {
      // Payment (folded currency) handed over by man
      const billX = MathUtils.lerp(740, 890, MathUtils.easeOutQuad(p1));
      const billY = MathUtils.lerp(counterTopY - 25, counterTopY - 12, p1);
      ctx.save();
      ctx.fillStyle = CONFIG.colors.redBright;
      ctx.fillRect(billX - 16, billY - 7, 32, 14);
      ctx.strokeStyle = CONFIG.colors.cutout;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(billX - 16, billY - 7, 32, 14);
      ctx.restore();
    } else {
      // Ticket envelope sliding across counter and being picked up
      const ticketStartX = counterLeft + counterW - 220; // 1220 (near agent)
      const ticketMidX = 960; // center of counter
      const ticketEndX = 860; // near man's hand

      const ticketX = (progress < 0.70)
        ? MathUtils.lerp(ticketStartX, ticketMidX, MathUtils.easeInOutQuad(p2))
        : MathUtils.lerp(ticketMidX, ticketEndX, MathUtils.easeOutQuad(p3));

      const ticketY = (progress < 0.85)
        ? counterTopY - 14
        : MathUtils.lerp(counterTopY - 14, counterTopY - 30, MathUtils.easeOutQuad((progress - 0.85) / 0.15));

      const ticketRot = (progress < 0.85) ? 0 : -0.14 * ((progress - 0.85) / 0.15);

      ctx.save();
      ctx.translate(ticketX, ticketY);
      ctx.rotate(ticketRot);

      // Red ticket envelope
      ctx.fillStyle = CONFIG.colors.bg;
      ctx.fillRect(-38, -12, 76, 24);
      ctx.strokeStyle = CONFIG.colors.redBright;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(-38, -12, 76, 24);

      // Typography lines
      ctx.fillStyle = CONFIG.colors.redBright;
      ctx.fillRect(-30, -6, 28, 3);
      ctx.fillRect(-30, 0, 50, 3);
      ctx.fillRect(-30, 6, 36, 2);

      // Ticket "SEATTLE" tag in miniature
      ctx.font = `bold 8px ${CONFIG.fonts.mono}`;
      ctx.fillText('SEATTLE', 6, -3);

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

    const camZoom = MathUtils.lerp(1.0, 1.06, MathUtils.easeInOutQuad(progress));
    const camPanY = MathUtils.lerp(0, -12, progress);

    ctx.translate(width / 2, height / 2);
    ctx.scale(camZoom, camZoom);
    ctx.translate(-width / 2, -height / 2 + camPanY);

    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, width, height);

    // Fade in from black 0.0 -> 0.15
    // Steady contemplative hold 0.15 -> 0.70
    // Slow fade to pure black 0.70 -> 1.00
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

    // Hand palm & fingers supporting bottom edge of ticket
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
    ctx.bezierCurveTo(wristX + 40, wristY - 70, tX - 25, tY + 210, tX + 28, tY + 235);
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
