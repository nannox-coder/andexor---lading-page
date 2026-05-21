(function () {
  if (typeof THREE === 'undefined') {
    console.warn('ANDEXOR: Three.js no disponible.');
    return;
  }

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const isMobile = window.innerWidth < 600;
  const isLowEnd = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  const CFG = {
    nodes: isLowEnd ? 45 : 90,
    connections: isLowEnd ? 70 : 140,
    particles: isLowEnd ? 250 : 550,
    speed: 0.00035,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 32);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Paleta ANDEXOR
  const GOLD  = new THREE.Color(0xd4a843);
  const TEAL  = new THREE.Color(0x2ab8b0);
  const WHITE = new THREE.Color(0xf0f2f5);

  // ---- Nodos de red neuronal ----
  const nodePositions = [];
  const nodeGroup = new THREE.Group();
  const nodeGeo = new THREE.SphereGeometry(0.13, 8, 8);

  for (let i = 0; i < CFG.nodes; i++) {
    const x = (Math.random() - 0.5) * 90;
    const y = (Math.random() - 0.5) * 55;
    const z = (Math.random() - 0.5) * 45 - 8;
    nodePositions.push(new THREE.Vector3(x, y, z));

    const color = Math.random() > 0.55 ? TEAL : GOLD;
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: Math.random() * 0.55 + 0.25,
    });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.position.set(x, y, z);
    mesh.userData.phase = Math.random() * Math.PI * 2;
    nodeGroup.add(mesh);
  }
  scene.add(nodeGroup);

  // ---- Conexiones entre nodos ----
  const lineGroup = new THREE.Group();
  let connCount = 0;

  for (let i = 0; i < nodePositions.length && connCount < CFG.connections; i++) {
    for (let j = i + 1; j < nodePositions.length && connCount < CFG.connections; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < 20) {
        const pts = [nodePositions[i].clone(), nodePositions[j].clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const opacity = (1 - dist / 20) * 0.22;
        const color = Math.random() > 0.5 ? GOLD : TEAL;
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        lineGroup.add(new THREE.Line(geo, mat));
        connCount++;
      }
    }
  }
  scene.add(lineGroup);

  // ---- Partículas de fondo ----
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(CFG.particles * 3);
  const pCol = new Float32Array(CFG.particles * 3);

  for (let i = 0; i < CFG.particles; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 130;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 90;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 70 - 18;

    const c = Math.random() > 0.5 ? GOLD : TEAL;
    pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));

  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
  }));
  scene.add(particles);

  // ---- Pirámide 1 dorada (símbolo del logo) ----
  const pyr1 = new THREE.Mesh(
    new THREE.ConeGeometry(4.5, 7, 4),
    new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.07 })
  );
  pyr1.position.set(20, 2, -6);
  pyr1.rotation.y = Math.PI / 4;
  scene.add(pyr1);

  // ---- Pirámide 2 teal ----
  const pyr2 = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 5.5, 4),
    new THREE.MeshBasicMaterial({ color: TEAL, wireframe: true, transparent: true, opacity: 0.065 })
  );
  pyr2.position.set(-22, 3, -9);
  pyr2.rotation.y = Math.PI / 6;
  scene.add(pyr2);

  // ---- Icosaedro central (IA / tech) ----
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.5, 1),
    new THREE.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.05 })
  );
  ico.position.set(-5, -8, -12);
  scene.add(ico);

  // ---- Scroll & mouse ----
  let scrollY = 0, targetScrollY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('scroll', () => { targetScrollY = window.scrollY; }, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Loop ----
  let t = 0, rafId;

  function animate() {
    rafId = requestAnimationFrame(animate);
    t++;

    scrollY += (targetScrollY - scrollY) * 0.05;
    const sf = scrollY * 0.0014;

    camera.position.y = -sf * 8 + mouseY * 1.8;
    camera.position.x = mouseX * 2.5;
    camera.lookAt(0, -sf * 8, 0);

    nodeGroup.rotation.y += CFG.speed;
    nodeGroup.rotation.x  = Math.sin(t * 0.0007) * 0.07;
    lineGroup.rotation.y  += CFG.speed * 0.65;
    particles.rotation.y  += CFG.speed * 0.28;
    particles.rotation.x  += CFG.speed * 0.13;

    pyr1.rotation.y += 0.0028;
    pyr1.rotation.x  = Math.sin(t * 0.005) * 0.14;
    pyr2.rotation.y -= 0.0022;
    pyr2.rotation.x  = Math.cos(t * 0.004) * 0.11;
    ico.rotation.y  += 0.0018;
    ico.rotation.x  += 0.0012;

    nodeGroup.children.forEach((node) => {
      node.material.opacity = 0.25 + Math.sin(t * 0.014 + node.userData.phase) * 0.25;
    });

    renderer.render(scene, camera);
  }

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animate();
  });
})();
