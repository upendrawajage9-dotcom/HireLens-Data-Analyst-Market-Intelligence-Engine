'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Convert latitude and longitude to 3D Cartesian coordinates on a sphere
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Global data hub coordinates
const TECH_HUBS = [
  { name: 'San Francisco', lat: 37.77, lon: -122.41 },
  { name: 'New York', lat: 40.71, lon: -74.0 },
  { name: 'London', lat: 51.5, lon: -0.12 },
  { name: 'Bengaluru', lat: 12.97, lon: 77.59 },
  { name: 'Singapore', lat: 1.35, lon: 103.81 },
  { name: 'Tokyo', lat: 35.67, lon: 139.65 },
  { name: 'Berlin', lat: 52.52, lon: 13.4 },
];

const CONNECTIONS = [
  [0, 1], // SF -> NYC
  [1, 2], // NYC -> London
  [2, 3], // London -> Bengaluru
  [3, 4], // Bengaluru -> Singapore
  [4, 5], // Singapore -> Tokyo
  [0, 5], // SF -> Tokyo
  [2, 6], // London -> Berlin
];

export default function EarthGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 720;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1200);
    camera.position.z = 320;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Monumental scale: 132 units radius
    const GLOBE_RADIUS = 132;

    // 2. Dark Translucent Inner Core Sphere
    const coreGeometry = new THREE.SphereGeometry(GLOBE_RADIUS - 0.5, 48, 48);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x05070c,
      transparent: true,
      opacity: 0.96,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // 3. Subtle Atmospheric Glow Rim (Atmosphere Crescent on top-left)
    const atmosGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 1.6, 48, 48);
    // Custom rim shader for electric cyan crescent lighting matching the reference image
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          // Directional rim light pointing from upper-left (-0.65, 0.75, 0.45)
          vec3 lightDir = normalize(vec3(-0.65, 0.75, 0.45));
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          rim = pow(rim, 2.4);
          float lightFactor = max(dot(vNormal, lightDir), 0.0);
          float intensity = rim * (0.35 + 0.65 * lightFactor);

          vec3 cyanColor = vec3(0.024, 0.839, 0.961); // #06D6F5
          vec3 violetColor = vec3(0.545, 0.361, 0.965); // #8B5CF6
          vec3 finalColor = mix(cyanColor, violetColor, smoothstep(0.0, 1.0, 1.0 - lightFactor));

          gl_FragColor = vec4(finalColor, intensity * 0.95);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    scene.add(atmosMesh);

    // 4. Latitude & Longitude Coordinate Wireframe
    const wireframeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x142036,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframeMesh);

    // 5. Dense Fibonacci Dot Matrix Cloud (3,400+ points for intricate depth)
    const DOT_COUNT = 3400;
    const dotPositions: number[] = [];
    const dotColors: number[] = [];
    const colorCyan = new THREE.Color(0x06d6f5);
    const colorElectricBlue = new THREE.Color(0x38bdf8);
    const colorViolet = new THREE.Color(0x8b5cf6);
    const colorDim = new THREE.Color(0x0a1828);

    for (let i = 0; i < DOT_COUNT; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / DOT_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.cos(phi);
      const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);

      dotPositions.push(x, y, z);

      // High-signal vs dim distribution
      const isHighSignal = i % 4 === 0 || i % 7 === 0;
      const isVioletAccent = i % 15 === 0;
      const c = isHighSignal
        ? isVioletAccent
          ? colorViolet
          : i % 2 === 0
          ? colorCyan
          : colorElectricBlue
        : colorDim;

      dotColors.push(c.r, c.g, c.b);
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotMaterial = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
    });
    const dotPoints = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dotPoints);

    // 6. Prominent Tech Hub Nodes
    const hubPositions = TECH_HUBS.map((hub) => latLongToVector3(hub.lat, hub.lon, GLOBE_RADIUS + 0.8));
    const hubGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const hubMat = new THREE.MeshBasicMaterial({ color: 0x06d6f5 });

    const beaconGroup = new THREE.Group();
    hubPositions.forEach((pos) => {
      const mesh = new THREE.Mesh(hubGeo, hubMat);
      mesh.position.copy(pos);
      beaconGroup.add(mesh);
    });
    globeGroup.add(beaconGroup);

    // 7. Great Circle Connection Trajectory Arcs
    const arcMaterial = new THREE.LineBasicMaterial({
      color: 0x06d6f5,
      transparent: true,
      opacity: 0.68,
    });

    CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const start = hubPositions[startIdx];
      const end = hubPositions[endIdx];

      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      const elevation = GLOBE_RADIUS + distance * 0.22;
      mid.normalize().multiplyScalar(elevation);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcLine = new THREE.Line(arcGeo, arcMaterial);
      globeGroup.add(arcLine);
    });

    // 8. Tilted Sweeping Orbital Ellipses with Orbiting Data Packets
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    const ringRadiusX = GLOBE_RADIUS * 1.42;
    const ringRadiusY = GLOBE_RADIUS * 0.74;

    const createOrbitalRing = (tiltX: number, tiltY: number, colorHex: number, opacity: number) => {
      const ringPts: THREE.Vector3[] = [];
      const segments = 140;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(theta) * ringRadiusX, Math.sin(theta) * ringRadiusY, 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(ringPts);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
      });
      const ring = new THREE.Line(geo, mat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const orbit1 = createOrbitalRing(Math.PI / 3.4, Math.PI / 4.8, 0x06d6f5, 0.42);
    const orbit2 = createOrbitalRing(-Math.PI / 3.8, -Math.PI / 5.2, 0x8b5cf6, 0.32);
    orbitalGroup.add(orbit1);
    orbitalGroup.add(orbit2);

    // Orbiting Data Packets
    const packetGeo = new THREE.SphereGeometry(2.0, 12, 12);
    const packetMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packetMat2 = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    const packet1 = new THREE.Mesh(packetGeo, packetMat1);
    const packet2 = new THREE.Mesh(packetGeo, packetMat2);
    orbit1.add(packet1);
    orbit2.add(packet2);

    // 9. Floating Space Particles Field
    const PARTICLE_COUNT = 340;
    const particlePositions: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = GLOBE_RADIUS * (1.2 + Math.random() * 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 1.6,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particleField);

    // 10. Initial Orientation
    globeGroup.rotation.x = 0.22;
    globeGroup.rotation.y = -0.45;

    // 11. Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 0.35;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 12. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 13. Visibility Observer
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 14. Continuous, Independent Rotation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let orbitProgress1 = 0;
    let orbitProgress2 = Math.PI;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Continuous, silky smooth rotation (~45s per complete rotation)
      globeGroup.rotation.y += delta * 0.06;

      // Orbit data packets
      orbitProgress1 += delta * 0.55;
      orbitProgress2 += delta * 0.45;
      packet1.position.set(
        Math.cos(orbitProgress1) * ringRadiusX,
        Math.sin(orbitProgress1) * ringRadiusY,
        0
      );
      packet2.position.set(
        Math.cos(orbitProgress2) * ringRadiusX,
        Math.sin(orbitProgress2) * ringRadiusY,
        0
      );

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x * 24;
      camera.position.y = -mouseRef.current.y * 14;
      camera.lookAt(0, 0, 0);

      // Beacon breathing pulse
      const elapsedTime = now / 1000;
      const pulseScale = 1 + 0.2 * Math.sin(elapsedTime * 2.8);
      beaconGroup.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };

    animate();

    // 15. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      coreGeometry.dispose();
      coreMaterial.dispose();
      atmosGeometry.dispose();
      atmosMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      hubGeo.dispose();
      hubMat.dispose();
      arcMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      packetGeo.dispose();
      packetMat1.dispose();
      packetMat2.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] sm:min-h-[640px] lg:min-h-[760px] xl:min-h-[840px] flex items-center justify-center pointer-events-none select-none"
    >
      {/* Massive layered celestial backlights matching reference glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[380px] sm:w-[540px] lg:w-[620px] h-[380px] sm:h-[540px] lg:h-[620px] rounded-full bg-cyan-500/[0.09] blur-[110px]" />
        <div className="absolute w-[480px] sm:w-[660px] lg:w-[780px] h-[480px] sm:h-[660px] lg:h-[780px] rounded-full bg-cyan-600/[0.05] blur-[180px]" />
        <div className="absolute w-[280px] sm:w-[420px] lg:w-[500px] h-[280px] sm:h-[420px] lg:h-[500px] rounded-full bg-violet-600/[0.08] blur-[100px]" />
      </div>
    </div>
  );
}
