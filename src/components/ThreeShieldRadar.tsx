import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Sparkles, AlertTriangle, Play, Pause, RotateCcw, Compass, ExternalLink } from 'lucide-react';
import { Language, getTranslation } from '../i18n/translations';

interface ThreeShieldRadarProps {
  brandName: string;
  criticalCount: number;
  totalThreats: number;
  currentLang: Language;
  onExploreCampaigns?: () => void;
}

export const ThreeShieldRadar: React.FC<ThreeShieldRadarProps> = ({
  brandName,
  criticalCount,
  totalThreats,
  currentLang,
  onExploreCampaigns,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<number>(0.25); // Default to Slow Down
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeVector, setActiveVector] = useState<string>('PHI_URL');

  const speedRef = useRef<number>(0.25);
  const isPausedRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Dimensions
    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 260;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Root Group for interactive rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Procedural 3D Cyber Shield
    // Outer Shield Shell (Icosahedron faceted)
    const shieldGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const shieldWireGeo = new THREE.WireframeGeometry(shieldGeo);
    const shieldWireMat = new THREE.LineBasicMaterial({
      color: 0xf43f5e, // Rose
      transparent: true,
      opacity: 0.7,
      linewidth: 1.5,
    });
    const shieldWire = new THREE.LineSegments(shieldWireGeo, shieldWireMat);
    rootGroup.add(shieldWire);

    // Inner translucent shield core
    const shieldCoreMat = new THREE.MeshBasicMaterial({
      color: 0x9f1239,
      wireframe: false,
      transparent: true,
      opacity: 0.18,
    });
    const shieldCore = new THREE.Mesh(shieldGeo, shieldCoreMat);
    rootGroup.add(shieldCore);

    // 2. Central Brand Hologram Core (Golden-Cyan octahedron)
    const brandCoreGeo = new THREE.OctahedronGeometry(1.4, 0);
    const brandCoreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const brandCore = new THREE.Mesh(brandCoreGeo, brandCoreMat);
    rootGroup.add(brandCore);

    // 3. Radar Scan Sweep Ring
    const radarRingGeo = new THREE.RingGeometry(0.2, 5.5, 48);
    const radarRingMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const radarRing = new THREE.Mesh(radarRingGeo, radarRingMat);
    radarRing.rotation.x = Math.PI / 2;
    rootGroup.add(radarRing);

    // Sweeping Radar Line
    const radarLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5.5, 0, 0),
    ]);
    const radarLineMat = new THREE.LineBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.8,
    });
    const radarLine = new THREE.Line(radarLineGeo, radarLineMat);
    radarRing.add(radarLine);

    // 4. Orbiting Threat Vector Satellites
    const vectorData = [
      { id: 'INSTA_BOT', name: 'Instagram Fake Bot', color: 0xf59e0b, radius: 4.8, speed: 0.8, angle: 0 },
      { id: 'PHI_URL', name: 'PhiUSIIL Phishing URL', color: 0xf43f5e, radius: 5.2, speed: 0.6, angle: 1.2 },
      { id: 'MAL_APK', name: 'MalDroid APK Spyware', color: 0xa855f7, radius: 4.4, speed: 0.7, angle: 2.5 },
      { id: 'UPI_SCAM', name: 'Rogue UPI VPA Radar', color: 0x06b6d4, radius: 5.6, speed: 0.5, angle: 3.8 },
      { id: 'CANARY_DECOY', name: 'Canary Honeytoken', color: 0x10b981, radius: 4.0, speed: 0.9, angle: 5.0 },
    ];

    const satelliteMeshes: { mesh: THREE.Mesh; orbit: (typeof vectorData)[0] }[] = [];

    vectorData.forEach((vec) => {
      const satGeo = new THREE.SphereGeometry(0.25, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({ color: vec.color });
      const satMesh = new THREE.Mesh(satGeo, satMat);

      // Add a small orbit ring
      const orbitRingGeo = new THREE.TorusGeometry(vec.radius, 0.02, 8, 64);
      const orbitRingMat = new THREE.MeshBasicMaterial({
        color: vec.color,
        transparent: true,
        opacity: 0.15,
      });
      const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
      orbitRing.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      rootGroup.add(orbitRing);

      rootGroup.add(satMesh);
      satelliteMeshes.push({ mesh: satMesh, orbit: vec });
    });

    // 5. Ambient Data Field Particles
    const fieldCount = 120;
    const fieldPos = new Float32Array(fieldCount * 3);
    for (let i = 0; i < fieldCount; i++) {
      fieldPos[i * 3] = (Math.random() - 0.5) * 16;
      fieldPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      fieldPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(fieldPos, 3));
    const fieldMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x64748b,
      transparent: true,
      opacity: 0.4,
    });
    const fieldPoints = new THREE.Points(fieldGeo, fieldMat);
    rootGroup.add(fieldPoints);

    // 6. Interactive Drag-to-Rotate controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const newWidth = mount.clientWidth || 320;
      const newHeight = mount.clientHeight || 260;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    resizeObserver.observe(mount);

    // 8. Animation Loop
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentSpeed = isPausedRef.current ? 0 : speedRef.current;

      if (currentSpeed > 0) {
        const factor = delta * currentSpeed;

        // Auto rotation
        if (!isDraggingRef.current) {
          rootGroup.rotation.y += factor * 0.35;
          rootGroup.rotation.x = Math.sin(clock.getElapsedTime() * currentSpeed * 0.5) * 0.15;
        }

        // Inner brand core counter-rotation
        brandCore.rotation.y -= factor * 0.6;
        brandCore.rotation.z += factor * 0.3;

        // Sweeping radar
        radarLine.rotation.z -= factor * 1.8;

        // Orbiting satellites
        satelliteMeshes.forEach(({ mesh, orbit }) => {
          orbit.angle += factor * orbit.speed;
          mesh.position.x = Math.cos(orbit.angle) * orbit.radius;
          mesh.position.z = Math.sin(orbit.angle) * orbit.radius;
          mesh.position.y = Math.sin(orbit.angle * 2) * 0.6;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();

      shieldGeo.dispose();
      shieldWireGeo.dispose();
      shieldWireMat.dispose();
      shieldCoreMat.dispose();
      brandCoreGeo.dispose();
      brandCoreMat.dispose();
      radarRingGeo.dispose();
      radarRingMat.dispose();
      radarLineGeo.dispose();
      radarLineMat.dispose();
      fieldGeo.dispose();
      fieldMat.dispose();

      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-rose-950/20 p-5 shadow-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>3D Holographic Threat Radar</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-500/40 font-mono">
                LIVE 3D
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {brandName} perimeter defense across 5 multi-vector satellites
            </p>
          </div>
        </div>

        {/* Speed Slow Down Badge */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <button
            onClick={() => {
              setSpeed(0.25);
              setIsPaused(false);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
              speed === 0.25 && !isPaused
                ? 'bg-rose-600 text-white border border-rose-400 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
            title="Slow Down (0.25x)"
          >
            0.25x Slow
          </button>
          <button
            onClick={() => {
              setSpeed(1.0);
              setIsPaused(false);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
              speed === 1.0 && !isPaused
                ? 'bg-rose-900 text-rose-200 border border-rose-500'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
            title="Normal Speed (1.0x)"
          >
            1.0x
          </button>
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 rounded bg-slate-800/80 text-slate-400 hover:text-white"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div className="relative w-full h-56 flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
        <div ref={mountRef} className="w-full h-full" />

        {/* Subtle overlay hint */}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-1">
          <Compass className="w-3 h-3 text-slate-500" />
          <span>Click & drag to rotate 3D shield</span>
        </div>

        <div className="absolute top-2 right-2 text-right pointer-events-none">
          <div className="text-[10px] font-mono text-slate-400">Total Monitored</div>
          <div className="text-sm font-bold font-mono text-white tabular-nums">{totalThreats}</div>
          <div className="text-[9px] font-mono text-rose-400 font-bold">{criticalCount} Critical</div>
        </div>
      </div>

      {/* Satellite Threat Vectors Strip */}
      <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-800/80 text-center font-mono text-[10px] z-10">
        <div
          onClick={() => setActiveVector('INSTA_BOT')}
          className={`p-1.5 rounded cursor-pointer transition-all ${
            activeVector === 'INSTA_BOT'
              ? 'bg-amber-950/60 border border-amber-500/50 text-amber-300'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mb-1" />
          <span className="truncate block font-semibold">Social Bot</span>
          <span className="text-[9px] text-slate-500 block">Kaggle/Cresci</span>
        </div>

        <div
          onClick={() => setActiveVector('PHI_URL')}
          className={`p-1.5 rounded cursor-pointer transition-all ${
            activeVector === 'PHI_URL'
              ? 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mx-auto mb-1 animate-pulse" />
          <span className="truncate block font-semibold">Phish URL</span>
          <span className="text-[9px] text-slate-500 block">PhiUSIIL</span>
        </div>

        <div
          onClick={() => setActiveVector('MAL_APK')}
          className={`p-1.5 rounded cursor-pointer transition-all ${
            activeVector === 'MAL_APK'
              ? 'bg-purple-950/60 border border-purple-500/50 text-purple-300'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mx-auto mb-1" />
          <span className="truncate block font-semibold">Rogue APK</span>
          <span className="text-[9px] text-slate-500 block">CICMalDroid</span>
        </div>

        <div
          onClick={() => setActiveVector('UPI_SCAM')}
          className={`p-1.5 rounded cursor-pointer transition-all ${
            activeVector === 'UPI_SCAM'
              ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mx-auto mb-1" />
          <span className="truncate block font-semibold">UPI VPA</span>
          <span className="text-[9px] text-slate-500 block">Indic Radar</span>
        </div>

        <div
          onClick={() => setActiveVector('CANARY_DECOY')}
          className={`p-1.5 rounded cursor-pointer transition-all ${
            activeVector === 'CANARY_DECOY'
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto mb-1" />
          <span className="truncate block font-semibold">Canary Trap</span>
          <span className="text-[9px] text-slate-500 block">Honeytoken</span>
        </div>
      </div>
    </div>
  );
};
