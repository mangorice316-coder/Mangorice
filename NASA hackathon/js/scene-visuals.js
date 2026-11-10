/* Starbridge scene art pass: reusable low-poly crew, room dressing, and bounded exterior terrain. */
(() => {
  const THREE = window.THREE;
  if (!THREE) return;

  const mats = {};
  const mat = (key, color, extra = {}) => {
    if (!mats[key]) mats[key] = new THREE.MeshPhongMaterial({ color, shininess: 24, ...extra });
    return mats[key];
  };
  const box = (parent, name, size, position, material, rotation = null) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const sphere = (parent, name, size, position, material, segments = 16) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, Math.max(8, Math.floor(segments * 0.7))), material);
    mesh.name = name;
    mesh.scale.set(...size);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const cylinder = (parent, name, radiusTop, radiusBottom, height, segments, position, material, rotation = null) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
    mesh.name = name;
    mesh.position.set(...position);
    if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const cylinderBetween = (parent, name, a, b, radius, material) => {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const delta = new THREE.Vector3().subVectors(end, start);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 7), material);
    mesh.name = name;
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const ring = (parent, name, radius, tube, position, material) => {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 40), material);
    mesh.name = name;
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(...position);
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  function astronaut(accentColor, label, robot = false) {
    const root = new THREE.Group();
    root.name = `${label.replace(/\s+/g, '_')}_Visual`;
    const suit = mat('suit', 0xe4ebf3, { shininess: 42 });
    const seam = mat('seam', 0x869bb0);
    const accent = new THREE.MeshPhongMaterial({ color: accentColor, shininess: 55, emissive: accentColor, emissiveIntensity: 0.07 });
    const dark = mat('suitDark', 0x22364f);
    const visorMat = new THREE.MeshPhongMaterial({ color: 0x163451, shininess: 110, specular: 0x9feeff, emissive: 0x073b53, emissiveIntensity: 0.25 });
    const glowMat = new THREE.MeshBasicMaterial({ color: accentColor });

    // Softly rounded pressure suit, with readable gloves, boots, hardware, and life-support pack.
    const torso = sphere(root, 'Suit_Torso', [0.59, 0.68, 0.43], [0, 0.03, 0], suit, 18);
    const chest = box(root, 'Chest_Telemetry', [0.48, 0.4, 0.12], [0, 0.12, 0.4], dark);
    box(root, 'Chest_Display', [0.3, 0.14, 0.025], [0, 0.2, 0.47], mat('display', 0x143c58, { emissive: 0x0b7896, emissiveIntensity: 0.5 }));
    box(root, 'Chest_Accent', [0.45, 0.07, 0.035], [0, -0.2, 0.43], accent);
    sphere(root, 'Neck_Ring', [0.31, 0.12, 0.31], [0, 0.66, 0], seam, 16);

    const pack = box(root, 'PLSS_Life_Support', [0.64, 0.84, 0.34], [0, 0.02, -0.48], mat('pack', 0x71869b), [0.04, 0, 0]);
    box(root, 'PLSS_Top', [0.55, 0.14, 0.36], [0, 0.47, -0.48], seam);
    box(root, 'PLSS_Battery', [0.16, 0.47, 0.12], [-0.35, 0.04, -0.48], dark);
    box(root, 'PLSS_Battery_R', [0.16, 0.47, 0.12], [0.35, 0.04, -0.48], dark);
    box(root, 'PLSS_Status', [0.34, 0.1, 0.035], [0, 0.2, -0.297], glowMat);

    // Helmet shell, dark wrap visor and a bright reflection line.
    sphere(root, 'Helmet_Shell', [0.43, 0.43, 0.43], [0, 0.93, 0.04], suit, 20);
    sphere(root, 'Helmet_Visor', [0.333, 0.255, 0.11], [0, 0.94, 0.405], visorMat, 18);
    box(root, 'Helmet_Brow', [0.48, 0.07, 0.13], [0, 1.14, 0.36], suit);
    box(root, 'Visor_Glint', [0.18, 0.025, 0.015], [-0.095, 1.045, 0.506], mat('visorGlint', 0x9bf3ff, { emissive: 0x71eaff, emissiveIntensity: 0.9 }));
    cylinder(root, 'Helmet_Antenna', 0.025, 0.04, 0.19, 7, [0.29, 1.24, -0.02], accent);
    sphere(root, 'Helmet_Beacon', [0.06, 0.06, 0.06], [0.29, 1.34, -0.02], glowMat, 10);

    const armPivots = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.59, 0.39, 0);
      root.add(arm);
      sphere(arm, 'Shoulder', [0.24, 0.25, 0.24], [0, 0, 0], suit, 12);
      cylinder(arm, 'Upper_Arm', 0.17, 0.19, 0.43, 9, [side * 0.015, -0.26, 0], suit);
      cylinder(arm, 'Sleeve_Stripe', 0.185, 0.185, 0.1, 9, [side * 0.015, -0.25, 0], accent);
      sphere(arm, 'Elbow', [0.17, 0.16, 0.17], [0, -0.49, 0], seam, 10);
      cylinder(arm, 'Forearm', 0.145, 0.17, 0.38, 9, [0, -0.68, 0.015], suit);
      cylinder(arm, 'Glove_Cuff', 0.17, 0.17, 0.09, 9, [0, -0.85, 0.015], dark);
      sphere(arm, 'Glove', [0.17, 0.18, 0.16], [0, -0.97, 0.035], suit, 10);
      armPivots.push(arm);
    }

    const legPivots = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.27, -0.45, 0);
      root.add(leg);
      cylinder(leg, 'Thigh', 0.23, 0.22, 0.48, 9, [0, -0.25, 0], suit);
      cylinder(leg, 'Leg_Stripe', 0.235, 0.235, 0.11, 9, [0, -0.28, 0], accent);
      sphere(leg, 'Knee', [0.2, 0.18, 0.2], [0, -0.5, 0], seam, 10);
      cylinder(leg, 'Boot_Shaft', 0.19, 0.18, 0.38, 9, [0, -0.7, 0], suit);
      box(leg, 'Boot', [0.43, 0.22, 0.56], [0, -0.91, 0.09], dark);
      box(leg, 'Boot_Sole', [0.43, 0.07, 0.56], [0, -1.035, 0.09], accent);
      legPivots.push(leg);
    }

    root.scale.setScalar(0.72);
    root.userData.armPivots = armPivots;
    root.userData.legPivots = legPivots;
    root.userData.baseY = 0;
    root.userData.phase = Math.random() * Math.PI * 2;
    root.userData.label = label;
    root.userData.isRobot = robot;
    return root;
  }

  function makeNameplate(text, tint) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 112;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(4, 14, 31, 0.88)';
    ctx.beginPath();
    ctx.moveTo(22, 4); ctx.lineTo(490, 4); ctx.quadraticCurveTo(508, 4, 508, 22);
    ctx.lineTo(508, 90); ctx.quadraticCurveTo(508, 108, 490, 108); ctx.lineTo(22, 108);
    ctx.quadraticCurveTo(4, 108, 4, 90); ctx.lineTo(4, 22); ctx.quadraticCurveTo(4, 4, 22, 4); ctx.fill();
    ctx.strokeStyle = tint; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = tint; ctx.beginPath(); ctx.arc(32, 56, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f4f8ff'; ctx.font = '700 34px Segoe UI, Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), 56, 56, 420);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  }

  function addRoomSign(scene, text, position, color) {
    const sprite = makeNameplate(text, color);
    sprite.name = `Sign_${text.replace(/\s+/g, '_')}`;
    sprite.position.set(...position);
    sprite.scale.set(3.5, 0.76, 1);
    scene.add(sprite);
  }

  function addGlobe(station) {
    if (station.earthGlobe) station.scene.remove(station.earthGlobe);
    const canvas = document.createElement('canvas');
    canvas.width = 768; canvas.height = 384;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 384);
    gradient.addColorStop(0, '#153c7d'); gradient.addColorStop(0.52, '#2477bb'); gradient.addColorStop(1, '#092556');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 768, 384);
    ctx.fillStyle = '#33885f';
    const continents = [
      [122, 122, 62, 37, -0.3], [183, 194, 37, 74, 0.1], [332, 109, 94, 42, -0.1],
      [393, 189, 39, 77, -0.25], [538, 123, 112, 46, 0.12], [631, 235, 58, 32, -0.1]
    ];
    continents.forEach(([x, y, rx, ry, angle], i) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = i % 2 ? '#49936b' : '#27754e';
      ctx.beginPath(); ctx.ellipse(rx * 0.42, -ry * 0.25, rx * 0.34, ry * 0.28, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); ctx.fillStyle = '#33885f';
    });
    ctx.strokeStyle = 'rgba(240,250,255,.32)'; ctx.lineWidth = 18;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); ctx.ellipse(384, 192 + i * 3 - 11, 370 - i * 15, 102 + i * 5, 0, 0.4, 2.5); ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.encoding = THREE.sRGBEncoding;
    station.earthGlobe = new THREE.Mesh(
      new THREE.SphereGeometry(36, 48, 36),
      new THREE.MeshPhongMaterial({ map: texture, shininess: 34, specular: 0x708fb4, emissive: 0x07142b, emissiveIntensity: 0.14 })
    );
    station.earthGlobe.name = 'Earth_Detailed_Globe';
    station.earthGlobe.position.set(90, 80, 160);
    station.scene.add(station.earthGlobe);

    const haloCanvas = document.createElement('canvas'); haloCanvas.width = 256; haloCanvas.height = 256;
    const hctx = haloCanvas.getContext('2d');
    const halo = hctx.createRadialGradient(128, 128, 18, 128, 128, 126);
    halo.addColorStop(0, 'rgba(68,180,255,.25)'); halo.addColorStop(0.55, 'rgba(46,133,230,.13)'); halo.addColorStop(1, 'rgba(46,133,230,0)');
    hctx.fillStyle = halo; hctx.fillRect(0, 0, 256, 256);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloCanvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    glow.name = 'Earth_Atmosphere_Glow'; glow.position.copy(station.earthGlobe.position); glow.scale.set(112, 112, 1); station.scene.add(glow);
  }

  function setupPlanetEnvironment(station, planet) {
    if (station.environmentGroup) station.scene.remove(station.environmentGroup);
    const group = new THREE.Group(); group.name = 'Planet_Surface_Environment';
    station.environmentGroup = group;
    station.scene.add(group);
    const isMoon = planet !== 'mars';
    const base = isMoon ? new THREE.Color(0x8b94a2) : new THREE.Color(0x9c5035);
    const low = isMoon ? new THREE.Color(0x626d7c) : new THREE.Color(0x733820);
    const geo = new THREE.PlaneGeometry(54, 66, 36, 36);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const crater = Math.exp(-((x - 9) ** 2 + (z + 10) ** 2) / 70) * 0.55 + Math.exp(-((x + 14) ** 2 + (z - 15) ** 2) / 110) * 0.35;
      const height = -0.22 + Math.sin(x * 0.18 + z * 0.08) * 0.22 + Math.cos(z * 0.2 - x * 0.09) * 0.16 - crater;
      pos.setY(i, height);
      const variation = Math.max(0.72, Math.min(1.13, 0.91 + height * 0.11 + Math.sin(x * 0.7 + z * 0.4) * 0.045));
      const c = base.clone().lerp(low, Math.max(0, crater * 0.65)).multiplyScalar(variation);
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const surface = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    surface.name = 'Bounded_Regolith_Surface';
    surface.position.set(-73, -0.3, 0);
    surface.receiveShadow = true;
    group.add(surface);
    station.terrainMesh = surface;

    const rockMat = mat(isMoon ? 'moonRock' : 'marsRock', isMoon ? 0x667384 : 0x70412f);
    let seed = isMoon ? 45 : 125;
    const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 43; i++) {
      const x = -99 + random() * 50;
      const z = -30 + random() * 60;
      if (x > -57 && Math.abs(z) < 5) continue;
      const scale = 0.18 + random() * 0.72;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 0), rockMat);
      rock.name = `Regolith_Boulder_${i}`;
      rock.position.set(x, -0.12 + random() * 0.28, z);
      rock.scale.set(1.1 + random() * 0.8, 0.65 + random() * 0.7, 0.9 + random() * 0.5);
      rock.rotation.set(random() * 0.4, random() * Math.PI, random() * 0.35);
      rock.castShadow = true; rock.receiveShadow = true; group.add(rock);
    }
    const craterMat = mat(isMoon ? 'craterShadowMoon' : 'craterShadowMars', isMoon ? 0x4a5868 : 0x663a2b, { side: THREE.DoubleSide });
    [[-84, -14, 3.8], [-58, 22, 2.8], [-95, 15, 2.3]].forEach(([x, z, r], i) => {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.16, 6, 28), mat(isMoon ? 'craterRimMoon' : 'craterRimMars', isMoon ? 0x7c8795 : 0x9a5336));
      rim.name = `Crater_Rim_${i}`; rim.rotation.x = Math.PI / 2; rim.scale.set(1.4, 1, 0.32); rim.position.set(x, -0.12, z); group.add(rim);
      const center = new THREE.Mesh(new THREE.CircleGeometry(r * 0.94, 24), craterMat);
      center.name = `Crater_Shadow_${i}`; center.rotation.x = -Math.PI / 2; center.scale.set(1.4, 1, 1); center.position.set(x, -0.19, z); group.add(center);
    });

    // Guided EVA route from the airlock to the rover; markers are low and do not obstruct movement.
    for (let i = 0; i < 7; i++) {
      const x = -48 - i * 2.25;
      const markerColor = i % 2 ? 0x54d9ed : 0xffbd4b;
      const marker = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 1.25), mat(i % 2 ? 'pathMarkerCyan' : 'pathMarkerAmber', markerColor, { emissive: i % 2 ? 0x168ba3 : 0x965c12, emissiveIntensity: 0.65 }));
      marker.name = `EVA_Path_Marker_${i}`; marker.position.set(x, 0.04, -4.1); group.add(marker);
      if (i % 2 === 0) {
        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.08, 1.0, 8), mat('beaconPost', 0x9eb2c6));
        beacon.position.set(x, 0.5, -4.1); group.add(beacon);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), mat('beaconLamp', 0x55dff1, { emissive: 0x35d5ef, emissiveIntensity: 1.5 }));
        lamp.position.set(x, 1.03, -4.1); group.add(lamp);
      }
    }
    if (station.earthGlobe && station.earthGlobe.material.map) {
      station.earthGlobe.material.color.set(isMoon ? 0xffffff : 0xffd2bd);
    }
  }

  function dressModules(station) {
    const scene = station.scene;
    const steel = mat('stationSteel', 0x71879c, { shininess: 52 });
    const cupolaSteel = mat('cupolaFrame', 0x3d586e, { shininess: 38 });
    const darkSteel = mat('stationDarkSteel', 0x31465e);
    const cyan = mat('stationCyan', 0x4bd9ee, { emissive: 0x178ba0, emissiveIntensity: 0.8 });
    const amber = mat('stationAmber', 0xffbf4a, { emissive: 0x9a5b0e, emissiveIntensity: 0.55 });
    const glass = mat('stationGlass', 0x2d8298, { transparent: true, opacity: 0.025, depthWrite: false, side: THREE.DoubleSide, shininess: 50 });
    const green = mat('stationGreen', 0x40bb78);
    const leaf = mat('stationLeaf', 0x60d78d);
    const soil = mat('stationSoil', 0x342b27);

    // Command cupola: structural ribs, observation panes, floor trim, and readable wall panels.
    ring(scene, 'Command_Deck_Outer_Rim', 7.86, 0.13, [0, 0.31, 0], steel);
    ring(scene, 'Command_Deck_Inner_Rim', 6.15, 0.035, [0, 0.312, 0], cyan);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const x = Math.cos(a) * 7.73, z = Math.sin(a) * 7.73;
      cylinder(scene, `Cupola_Rib_${i}`, 0.055, 0.055, 4.45, 7, [x, 2.35, z], cupolaSteel);
    }
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2 + Math.PI / 4;
      const console = new THREE.Group(); console.name = `Command_Console_${i}`;
      console.position.set(Math.cos(a) * 5.1, 0.7, Math.sin(a) * 5.1); console.rotation.y = -a + Math.PI / 2;
      box(console, 'Console_Base', [1.5, 0.8, 0.72], [0, 0, 0], darkSteel);
      box(console, 'Console_Screen', [1.1, 0.48, 0.05], [0, 0.5, 0.36], mat(`screen${i}`, [0x168bb1, 0x2b9d79, 0xd18a35, 0x4971bb][i], { emissive: [0x0b536e, 0x146243, 0x704610, 0x294372][i], emissiveIntensity: 0.7 }));
      box(console, 'Console_Keyline', [1.12, 0.06, 0.07], [0, 0.22, 0.4], cyan);
      scene.add(console);
    }

    // Greenhouse dome ribs and raised beds with leaves; retain the existing strawberry interactions.
    for (let i = 0; i < 8; i++) {
      const phi = i * Math.PI / 4;
      const points = [];
      for (let j = 0; j <= 16; j++) {
        const theta = (j / 16) * Math.PI / 2;
        points.push(new THREE.Vector3(24 + 7 * Math.cos(theta) * Math.cos(phi), 0.31 + 7 * Math.sin(theta), 7 * Math.cos(theta) * Math.sin(phi)));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const rib = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.075, 6, false), steel);
      rib.name = `Greenhouse_Dome_Rib_${i}`; rib.castShadow = true; scene.add(rib);
    }
    for (let i = -1; i <= 1; i++) {
      const x = 24 + i * 3.5, z = i * 2.5;
      const bed = box(scene, `Hydroponic_Raised_Bed_${i}`, [3.8, 0.55, 2.15], [x, 0.72, z], green);
      box(scene, `Hydroponic_Grow_Tray_${i}`, [3.32, 0.12, 1.68], [x, 1.06, z], soil);
      box(scene, `Grow_Light_Bar_${i}`, [3.0, 0.08, 0.12], [x, 3.7, z], mat(`growLight${i}`, 0xb78cff, { emissive: 0x7f36da, emissiveIntensity: 1.1 }));
      for (let j = 0; j < 5; j++) {
        const lx = x - 1.3 + j * 0.62;
        const stem = cylinder(scene, `Strawberry_Stem_${i}_${j}`, 0.035, 0.045, 0.44, 6, [lx, 1.32, z], green);
        stem.rotation.z = (j % 2 ? 0.22 : -0.22);
        const leafMesh = sphere(scene, `Strawberry_Leaf_${i}_${j}`, [0.2, 0.07, 0.12], [lx + (j % 2 ? 0.12 : -0.12), 1.5, z], leaf, 8);
        leafMesh.rotation.z = j % 2 ? -0.35 : 0.35;
      }
    }
    const growLamp = new THREE.PointLight(0x9d62ff, 1.2, 13); growLamp.position.set(24, 5.2, 0); scene.add(growLamp);

    // Solar farm was an empty walkable room; give it a pair of recognizable photovoltaic wings.
    const solarFloor = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 0.24, 12), mat('solarDeck', 0x263951));
    solarFloor.name = 'Solar_Farm_Deck'; solarFloor.position.set(0, -0.16, -22); solarFloor.receiveShadow = true; scene.add(solarFloor);
    ring(scene, 'Solar_Farm_Rim', 6.25, 0.11, [0, -0.025, -22], steel);
    const panelMat = mat('solarCells', 0x143c69, { emissive: 0x0a244a, emissiveIntensity: 0.35, shininess: 88 });
    for (let side = -1; side <= 1; side += 2) {
      const centerX = side * 3.8;
      for (let post = -1; post <= 1; post += 2) {
        cylinderBetween(scene, `Solar_Array_Support_${side}_${post}`, [centerX + post * 1.8, 0.14, -22 - 1.1], [centerX + post * 1.8, 2.45, -22 + 1.1], 0.08, steel);
      }
      const panel = box(scene, `Solar_Array_Panel_${side}`, [3.6, 0.12, 2.2], [centerX, 2.38, -22], panelMat, [-0.13, 0, side * 0.025]);
      panel.castShadow = true;
      for (let j = -2; j <= 2; j++) box(scene, `Solar_Array_Cellline_${side}_${j}`, [0.035, 0.02, 2.55], [centerX + j * 0.86, 2.455, -22], cyan, [-0.13, 0, side * 0.025]);
      for (let j = -1; j <= 1; j++) box(scene, `Solar_Array_Rowline_${side}_${j}`, [3.5, 0.02, 0.025], [centerX, 2.455, -22 + j * 0.68], cyan, [-0.13, 0, side * 0.025]);
    }
    const sunLamp = new THREE.PointLight(0xffbf58, 0.75, 14); sunLamp.position.set(0, 4, -22); scene.add(sunLamp);

    // ECLSS: ring-banded filter tank, pipe loop, and a lit inspection gauge.
    ring(scene, 'ECLSS_Deck_Rim', 6.85, 0.1, [-22, 0.31, 0], steel);
    cylinder(scene, 'ECLSS_Tank_Cap', 1.9, 1.9, 0.28, 12, [-22, 5.15, 0], steel);
    [0.8, 2.0, 3.4, 4.4].forEach((y, i) => cylinder(scene, `ECLSS_Tank_Band_${i}`, 3.58, 3.58, 0.14, 12, [-22, y, 0], i === 1 ? cyan : steel));
    for (let i = 0; i < 3; i++) {
      cylinderBetween(scene, `ECLSS_Filter_Pipe_${i}`, [-24.5 + i * 2.2, 0.5, -4.3], [-24.5 + i * 2.2, 3.5, -4.3], 0.11, cyan);
      sphere(scene, `ECLSS_Filter_Valve_${i}`, [0.23, 0.23, 0.23], [-24.5 + i * 2.2, 2.2, -4.3], amber, 8);
    }
    box(scene, 'ECLSS_Status_Panel', [1.7, 1.2, 0.18], [-17.2, 2.1, -3.8], darkSteel);
    box(scene, 'ECLSS_Status_Screen', [1.3, 0.72, 0.05], [-17.2, 2.2, -3.68], mat('eclssScreen', 0x137d88, { emissive: 0x0d7b8b, emissiveIntensity: 0.8 }));

    // ARED gym and airlock get simple structural frames and cyan/amber guidance.
    ring(scene, 'Gym_Deck_Rim', 6.25, 0.1, [0, 0.31, 22], steel);
    box(scene, 'ARED_Machine_Base', [4.1, 0.18, 3.8], [0, 0.42, 23], darkSteel);
    for (let side = -1; side <= 1; side += 2) {
      cylinderBetween(scene, `ARED_Frame_Post_${side}`, [side * 1.55, 0.5, 21.6], [side * 1.55, 3.1, 21.6], 0.1, steel);
      cylinderBetween(scene, `ARED_Frame_Rail_${side}`, [side * 1.55, 3.1, 21.6], [side * 1.55, 3.1, 24.7], 0.1, amber);
    }
    cylinderBetween(scene, 'ARED_Top_Bar', [-1.55, 3.1, 24.7], [1.55, 3.1, 24.7], 0.1, steel);
    ring(scene, 'Airlock_Deck_Rim', 4.8, 0.1, [-40, 0.31, 0], amber);
    const hatchFrame = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.14, 8, 32), amber);
    hatchFrame.name = 'Airlock_Outer_Hatch_Ring'; hatchFrame.position.set(-45.1, 2, 0); hatchFrame.rotation.y = Math.PI / 2; scene.add(hatchFrame);
    for (let side = -1; side <= 1; side += 2) {
      box(scene, `Airlock_Safety_Light_${side}`, [0.12, 0.36, 0.12], [-44.2, 3.1, side * 2.45], side === -1 ? cyan : amber);
    }

    // Tunnel portals make the travel routes legible without closing or changing them.
    const portals = [[12, 0, 0], [-11, 0, 0], [-31.5, 0, 0], [0, 0, 11.5], [0, 0, -11.5]];
    portals.forEach(([x, y, z], i) => {
      const orientation = i < 3;
      const frame = new THREE.Mesh(new THREE.TorusGeometry(2, 0.1, 7, 24), i === 2 ? amber : cyan);
      frame.name = `Corridor_Guidance_Ring_${i}`; frame.position.set(x, 1.55, z);
      if (orientation) frame.rotation.y = Math.PI / 2;
      scene.add(frame);
    });

    // Turn the existing rover chassis and rocket blockouts into identifiable silhouettes.
    const rover = scene.children.find(child => child.isMesh && child.position.distanceTo(new THREE.Vector3(-62, 0.9, 10)) < 0.2);
    if (rover) {
      rover.name = 'Scoop_Rover_Chassis'; rover.material = mat('roverHull', 0xd7e2ec, { shininess: 56 });
      for (const xSide of [-1, 1]) for (const zSide of [-1, 0, 1]) {
        const wheel = cylinder(scene, `Rover_Wheel_${xSide}_${zSide}`, 0.57, 0.57, 0.34, 10, [-62 + xSide * 2.03, 0.38, 10 + zSide * 1.56], darkSteel, [0, 0, Math.PI / 2]);
        wheel.rotation.z = Math.PI / 2;
        cylinder(scene, `Rover_Hub_${xSide}_${zSide}`, 0.22, 0.22, 0.37, 8, [-62 + xSide * 2.03, 0.38, 10 + zSide * 1.56], amber, [0, 0, Math.PI / 2]);
      }
      box(scene, 'Rover_Windshield', [2.05, 0.52, 0.12], [-62, 1.36, 12.2], mat('roverGlass', 0x1b5677, { emissive: 0x0a334a, emissiveIntensity: 0.35, shininess: 96 }));
      box(scene, 'Rover_Solar_Rack', [2.4, 0.12, 1.65], [-62, 1.85, 9.85], panelMat);
      cylinderBetween(scene, 'Rover_Antenna', [-60.7, 1.65, 8.8], [-60.3, 2.8, 8.6], 0.045, steel);
    }
    const rocket = scene.children.find(child => child.isMesh && child.position.distanceTo(new THREE.Vector3(-85, 8.2, 0)) < 0.3);
    if (rocket) {
      rocket.name = 'Starbridge_Rocket_Core'; rocket.material = mat('rocketHull', 0xe6edf3, { shininess: 74 });
      box(scene, 'Rocket_Orange_Band', [2.65, 0.26, 2.65], [-85, 3.3, 0], amber);
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2;
        const fin = box(scene, `Rocket_Fin_${i}`, [0.16, 2.7, 1.15], [-85 + Math.cos(angle) * 2.1, 1.0, Math.sin(angle) * 2.1], mat('rocketFin', 0xc64538), [0, -angle, 0.18]);
        fin.castShadow = true;
      }
    }

    addRoomSign(scene, 'Command', [0, 5.15, 0], '#55d9ef');
    addRoomSign(scene, 'Food Dome', [24, 5.6, 0], '#53da91');
    addRoomSign(scene, 'ECLSS Water', [-22, 5.5, 0], '#61c9ef');
    addRoomSign(scene, 'AREd Gym', [0, 4.3, 22], '#c79aff');
    addRoomSign(scene, 'Solar Farm', [0, 4.3, -22], '#ffc54f');
    addRoomSign(scene, 'Airlock', [-40, 4.3, 0], '#ffc54f');
  }

  function spawnCrew(station) {
    station.visualCrew = [];
    const crew = [
      { name: 'Dr. Priya', job: 'BOTANIST', x: 26, z: -2.7, color: 0x4ecb83, phase: 0.4 },
      { name: 'Engineer Leo', job: 'ENGINEER', x: -19.4, z: 3.2, color: 0xffa94e, phase: 2.1 },
      { name: 'Commander Maya', job: 'COMMANDER', x: 3.0, z: 2.6, color: 0xef6f78, phase: 4.2 },
      { name: 'Scientist Sam', job: 'SCIENTIST', x: -1.6, z: 22.8, color: 0x64a9f2, phase: 5.1 }
    ];
    crew.forEach((member, i) => {
      const character = astronaut(member.color, member.name);
      character.name = `${member.name.replace(/\s+/g, '_')}_NPC`;
      character.position.set(member.x, 0.96, member.z);
      character.rotation.y = i === 0 ? -Math.PI / 2 : Math.PI;
      character.userData.phase = member.phase;
      const plate = makeNameplate(`${member.name}  ·  ${member.job}`, `#${member.color.toString(16).padStart(6, '0')}`);
      plate.name = `${character.name}_Nameplate`;
      plate.position.set(0, 1.8, 0); plate.scale.set(4.2, 0.92, 1); character.add(plate);
      station.scene.add(character);
      station.visualCrew.push(character);
    });
  }

  function decorate(station) {
    if (station.scene.userData.starbridgeVisualPass) return;
    station.scene.userData.starbridgeVisualPass = true;
    if (station.renderer) {
      station.renderer.outputEncoding = THREE.sRGBEncoding;
      station.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      station.renderer.toneMappingExposure = 0.92;
      station.renderer.shadowMap.enabled = true;
      station.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      station.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    }
    const hemi = new THREE.HemisphereLight(0xbedaff, 0x25384b, 0.48);
    hemi.name = 'Station_Ambient_Hemisphere'; station.scene.add(hemi);
    if (station.sunLight) { station.sunLight.intensity = 1.35; station.sunLight.shadow.mapSize.set(1024, 1024); }

    addGlobe(station);
    if (station.cadet) {
      while (station.cadet.children.length) station.cadet.remove(station.cadet.children[0]);
      const model = astronaut(0x3bbde1, 'Cadet');
      model.name = 'Cadet_Spacesuit_Model';
      station.cadet.add(model);

      station.cadet.userData.model = model;
    }
    dressModules(station);
    spawnCrew(station);
  }

  function tick(station) {
    const t = performance.now() * 0.001;
    if (station.earthGlobe) station.earthGlobe.rotation.y += 0.0005;
    if (station.visualCrew) station.visualCrew.forEach((crew, i) => {
      const phase = t * 1.1 + crew.userData.phase;
      crew.position.y = Math.sin(phase) * 0.035;
      crew.rotation.y += Math.sin(phase * 0.45) * 0.0007;
      crew.userData.armPivots.forEach((arm, armIndex) => {
        arm.rotation.x = Math.sin(phase + armIndex * Math.PI) * 0.055;
      });
    });
    if (station.cadet && station.cadet.userData.model) {
      const model = station.cadet.userData.model;
      const moving = Object.values(station.keys || {}).some(Boolean);
      const phase = t * (moving ? 8 : 1.7) + model.userData.phase;
      const stride = moving ? 0.34 : 0.025;
      model.userData.legPivots.forEach((leg, i) => { leg.rotation.x = Math.sin(phase + i * Math.PI) * stride; });
      model.userData.armPivots.forEach((arm, i) => { arm.rotation.x = Math.sin(phase + (i + 1) * Math.PI) * stride * 0.62; });
      model.position.y = Math.sin(phase * 2) * (moving ? 0.018 : 0.012);
    }
  }

  window.StarbridgeVisuals = { astronaut, setupPlanetEnvironment, decorate, tick };
})();



