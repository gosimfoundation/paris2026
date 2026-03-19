(function() {
  var container = document.getElementById('vol-canvas-container');
  if (!container) return;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0012);

  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0a0f);
  container.appendChild(renderer.domElement);

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function gaussRand() { var u = 0, v = 0; while(u === 0) u = Math.random(); while(v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  var COL_TOWER_BASE = new THREE.Color(0xc9a96e);
  var COL_TOWER_TIP  = new THREE.Color(0xffe4a8);
  var COL_GROUND     = new THREE.Color(0x2a5a3a);
  var COL_GROUND2    = new THREE.Color(0x1a3a2a);
  var COL_WATER      = new THREE.Color(0x2a4a6a);
  var COL_WATER2     = new THREE.Color(0x4a7a9a);
  var COL_BUILDING   = new THREE.Color(0x6a6a7a);
  var COL_BUILDING2  = new THREE.Color(0x8a8a9a);
  var COL_ROAD       = new THREE.Color(0x4a4a55);
  var COL_TREE       = new THREE.Color(0x1a5a2a);
  var COL_TREE2      = new THREE.Color(0x3a7a4a);
  var COL_WARM       = new THREE.Color(0xffd080);

  var positions = [];
  var colors = [];
  var sizes = [];
  var col = new THREE.Color();

  function addPt(x, y, z, c, s) {
    positions.push(x, y, z);
    colors.push(c.r, c.g, c.b);
    sizes.push(s);
  }

  // ── Eiffel Tower ──
  var towerHeight = 320;
  var baseSpread = 65;

  for (var leg = 0; leg < 4; leg++) {
    var angle = (leg / 4) * Math.PI * 2 + Math.PI / 4;
    for (var i = 0; i < 18000; i++) {
      var t = Math.random(), h = t * towerHeight;
      var spread = baseSpread * Math.pow(1 - t, 1.8);
      var thickness = Math.max(1.5, 8 * (1 - t * 0.7));
      col.lerpColors(COL_TOWER_BASE, COL_TOWER_TIP, t * t);
      if (Math.random() < 0.03) col.lerp(COL_WARM, 0.7);
      addPt(Math.cos(angle)*spread + gaussRand()*thickness, h, Math.sin(angle)*spread + gaussRand()*thickness, col, rand(1.2, 2.5));
    }
  }

  // Platforms
  [{h:57,r:35,th:3,n:5000},{h:115,r:22,th:2.5,n:4000},{h:276,r:8,th:2,n:2500}].forEach(function(p) {
    for (var i = 0; i < p.n; i++) {
      var a = Math.random()*Math.PI*2, r = Math.random()*p.r;
      col.lerpColors(COL_TOWER_BASE, COL_TOWER_TIP, p.h/towerHeight);
      addPt(Math.cos(a)*r, p.h+gaussRand()*p.th, Math.sin(a)*r, col, rand(1.5, 3));
    }
  });

  // Antenna
  for (var i = 0; i < 3000; i++) {
    var t = Math.random(), h = 276+t*48, r = Math.max(0.3,2*(1-t)), a = Math.random()*Math.PI*2;
    col.copy(COL_TOWER_TIP);
    if (Math.random()<0.08) col.lerp(new THREE.Color(0xff4444), 0.8);
    addPt(Math.cos(a)*r+gaussRand()*0.5, h, Math.sin(a)*r+gaussRand()*0.5, col, rand(1, 2));
  }

  // Cross-braces
  for (var level = 0; level < 12; level++) {
    var t = level/12, h = t*260, spread = baseSpread*Math.pow(1-t,1.8);
    for (var leg = 0; leg < 4; leg++) {
      var a1 = (leg/4)*Math.PI*2+Math.PI/4, a2 = ((leg+1)/4)*Math.PI*2+Math.PI/4;
      for (var i = 0; i < 300; i++) {
        var lt = Math.random();
        col.lerpColors(COL_TOWER_BASE, COL_TOWER_TIP, t);
        addPt(Math.cos(a1)*spread*(1-lt)+Math.cos(a2)*spread*lt+gaussRand()*0.8, h+gaussRand()*2, Math.sin(a1)*spread*(1-lt)+Math.sin(a2)*spread*lt+gaussRand()*0.8, col, rand(1, 2));
      }
    }
  }

  // Arches
  for (var leg = 0; leg < 4; leg++) {
    var a1 = (leg/4)*Math.PI*2+Math.PI/4, a2 = ((leg+1)/4)*Math.PI*2+Math.PI/4;
    for (var i = 0; i < 1200; i++) {
      var lt = Math.random(), archH = Math.sin(lt*Math.PI)*30+25;
      col.copy(COL_TOWER_BASE);
      addPt(Math.cos(a1)*baseSpread*0.85*(1-lt)+Math.cos(a2)*baseSpread*0.85*lt+gaussRand(), archH+gaussRand()*1.5, Math.sin(a1)*baseSpread*0.85*(1-lt)+Math.sin(a2)*baseSpread*0.85*lt+gaussRand(), col, rand(1, 2.2));
    }
  }

  // ── Champ de Mars ──
  for (var i = 0; i < 25000; i++) {
    col.lerpColors(COL_GROUND, COL_GROUND2, Math.random());
    if (Math.random()<0.05) col.lerp(COL_TREE, 0.5);
    addPt(rand(-120,120), gaussRand()*0.3, rand(80,400), col, rand(1.5, 3));
  }
  for (var row = 0; row < 2; row++) {
    var xBase = row===0?-80:80;
    for (var tz = 100; tz < 380; tz += 20) {
      for (var i = 0; i < 400; i++) {
        col.lerpColors(COL_TREE, COL_TREE2, Math.random());
        addPt(xBase+gaussRand()*8, rand(0,18), tz+gaussRand()*6, col, rand(1.5, 3.5));
      }
    }
  }

  // ── Trocadéro ──
  for (var i = 0; i < 15000; i++) {
    col.lerpColors(COL_GROUND, new THREE.Color(0x3a4a3a), Math.random());
    addPt(rand(-160,160), gaussRand()*0.5+5, rand(-280,-120), col, rand(1.5, 3));
  }
  for (var wing = -1; wing <= 1; wing += 2) {
    for (var i = 0; i < 5000; i++) {
      var t = Math.random(), a = wing*t*0.8, r = 80+t*70;
      col.lerpColors(COL_BUILDING, new THREE.Color(0x9a9aaa), Math.random());
      addPt(Math.sin(a)*r*wing+gaussRand()*3, rand(5,25+gaussRand()*3), -200-Math.cos(a)*30+gaussRand()*3, col, rand(1.5, 2.5));
    }
  }

  // ── Seine ──
  for (var i = 0; i < 20000; i++) {
    var t = Math.random(), x = (t-0.5)*600, curveZ = -80+Math.sin(t*Math.PI*1.5)*20;
    col.lerpColors(COL_WATER, COL_WATER2, Math.random());
    if (Math.random()<0.04) col.lerp(COL_WARM, 0.5);
    addPt(x, -1+gaussRand()*0.3, curveZ+gaussRand()*18, col, rand(1.5, 3.5));
  }
  for (var i = 0; i < 3000; i++) {
    col.lerpColors(COL_BUILDING, new THREE.Color(0xaaa89a), Math.random());
    addPt(gaussRand()*8, rand(0,4), rand(-100,-60), col, rand(1.5, 2.5));
  }

  // ── Buildings ──
  [{cx:-180,cz:100,w:80,d:120,h:30,n:8000},{cx:180,cz:100,w:80,d:120,h:25,n:8000},
   {cx:-180,cz:300,w:100,d:80,h:25,n:6000},{cx:180,cz:300,w:100,d:80,h:25,n:6000},
   {cx:-200,cz:-150,w:80,d:80,h:22,n:5000},{cx:200,cz:-150,w:80,d:80,h:22,n:5000},
   {cx:0,cz:440,w:200,d:60,h:20,n:8000}].forEach(function(b) {
    for (var i = 0; i < b.n; i++) {
      var bx=b.cx+rand(-b.w/2,b.w/2), bz=b.cz+rand(-b.d/2,b.d/2);
      var blockX=Math.floor((bx-b.cx+b.w/2)/20), blockZ=Math.floor((bz-b.cz+b.d/2)/20);
      var localH=b.h*(0.5+0.5*Math.abs(Math.sin(blockX*3.7+blockZ*2.3)));
      var y=rand(0,localH);
      col.lerpColors(COL_BUILDING, COL_BUILDING2, Math.random());
      if (Math.random()<0.03&&y>localH*0.7) col.lerp(COL_WARM, 0.8);
      addPt(bx, y, bz, col, rand(1.2, 2.5));
    }
  });

  // Ground / Roads
  for (var i = 0; i < 30000; i++) {
    var x=rand(-350,350), z=rand(-320,500);
    var curveZ=-80+Math.sin(((x/600)+0.5)*Math.PI*1.5)*20;
    if (Math.abs(z-curveZ)<22) continue;
    var isRoad=(Math.abs(x%80)<4)||(Math.abs(z%80)<4);
    if (isRoad) { col.copy(COL_ROAD); if(Math.random()<0.02) col.lerp(COL_WARM,0.9); }
    else col.lerpColors(new THREE.Color(0x1a1a22), new THREE.Color(0x2a2a32), Math.random());
    addPt(x, gaussRand()*0.2, z, col, rand(1.2, 2.8));
  }

  // Trees
  for (var i = 0; i < 80; i++) {
    var tx=rand(-300,300), tz=rand(-250,450);
    if (Math.abs(tx)<80&&Math.abs(tz)<80) continue;
    for (var j = 0; j < 200; j++) {
      col.lerpColors(COL_TREE, COL_TREE2, Math.random());
      addPt(tx+gaussRand()*5, rand(0,12), tz+gaussRand()*5, col, rand(1.5, 3));
    }
  }

  // Ambient particles
  for (var i = 0; i < 5000; i++) {
    col.set(0xffffff); col.multiplyScalar(rand(0.15, 0.3));
    addPt(rand(-400,400), rand(0,350), rand(-350,500), col, rand(0.5, 1.2));
  }

  // ── Geometry ──
  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  var material = new THREE.ShaderMaterial({
    uniforms: { uTime:{value:0}, uPixelRatio:{value:Math.min(window.devicePixelRatio,2)} },
    vertexShader: [
      'attribute float size;','varying vec3 vColor;','varying float vDist;',
      'uniform float uPixelRatio;',
      'void main() {','  vColor = color;','  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
      '  vDist = -mvPosition.z;','  gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);',
      '  gl_PointSize = max(gl_PointSize, 0.5);','  gl_Position = projectionMatrix * mvPosition;','}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vColor;','varying float vDist;',
      'void main() {','  float d = length(gl_PointCoord - vec2(0.5));','  if (d > 0.5) discard;',
      '  float alpha = 1.0 - smoothstep(0.1, 0.5, d);','  alpha *= smoothstep(800.0, 200.0, vDist);',
      '  gl_FragColor = vec4(vColor, alpha);','}'
    ].join('\n'),
    transparent: true, vertexColors: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  var pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);

  // ── Camera: tower pinned to right half of viewport ──
  var radiusClose = 200;
  var radiusFar   = 580;
  var heightClose = 380;
  var heightFar   = 180;
  var orbitSpeed  = 0.06;

  var lookOffsetClose = 120;
  var lookOffsetFar   = 230;

  var lookYClose = 150;
  var lookYFar   = 80;

  var startAngle = 0.4;
  var time = startAngle / orbitSpeed / 0.1;

  var scrollY = 0;
  var scrollTarget = 0;
  window.addEventListener('scroll', function() {
    scrollTarget = window.scrollY;
  });

  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    scrollY += (scrollTarget - scrollY) * 0.05;

    var angle = time * orbitSpeed;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var scrollFrac = maxScroll > 0 ? scrollY / maxScroll : 0;

    var ease = scrollFrac * scrollFrac * (3 - 2 * scrollFrac);

    var radius = radiusClose + (radiusFar - radiusClose) * ease;
    var height = heightClose + (heightFar - heightClose) * ease;
    var lookLeftOffset = lookOffsetClose + (lookOffsetFar - lookOffsetClose) * ease;

    var camX = Math.cos(angle) * radius;
    var camZ = Math.sin(angle) * radius;
    var camY = height;

    camera.position.set(camX, camY, camZ);

    var perpX = -Math.sin(angle);
    var perpZ =  Math.cos(angle);

    var lookY = lookYClose + (lookYFar - lookYClose) * ease;
    camera.lookAt(new THREE.Vector3(
      perpX * lookLeftOffset,
      lookY,
      perpZ * lookLeftOffset
    ));

    camera.position.x += Math.sin(time * 0.7) * 2;
    camera.position.y += Math.cos(time * 0.5) * 1.5;

    material.uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  });

  animate();
})();
