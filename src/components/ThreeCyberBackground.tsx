import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, Gauge, Eye, EyeOff, Sparkles, Shield, Compass } from 'lucide-react';
import { Language, getTranslation } from '../i18n/translations';

interface ThreeCyberBackgroundProps {
  currentLang: Language;
}

export type AnimationSpeed = 0.1 | 0.25 | 0.5 | 1.0 | 0.0;

export const ThreeCyberBackground: React.FC<ThreeCyberBackgroundProps> = ({ currentLang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<AnimationSpeed>(0.25); // Default to Slow Down (0.25x) as requested
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Store speed ref for smooth access inside requestAnimationFrame loop
  const speedRef = useRef<number>(0.25);
  const isPausedRef = useRef<boolean>(false);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.018); // Atmospheric cyber fog

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Objects in the Cyber Defense Hologram
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. Central Digital Shield Icosahedron (Core Defense Node)
    const coreGeo = new THREE.IcosahedronGeometry(7, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // Rose-500
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner glowing solid faceted nucleus
    const innerGeo = new THREE.OctahedronGeometry(3.5, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan-500
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    masterGroup.add(innerMesh);

    // B. Orbital Defense Rings (Radar Trajectories)
    // Ring 1 - Inclined 45 deg (Social / URL Vector)
    const ring1Geo = new THREE.TorusGeometry(12.5, 0.05, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Sky-400
      transparent: true,
      opacity: 0.28,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    ring1Mesh.rotation.y = Math.PI / 6;
    masterGroup.add(ring1Mesh);

    // Ring 2 - Inclined 75 deg (APK Malware / UPI Vector)
    const ring2Geo = new THREE.TorusGeometry(16.5, 0.05, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7, // Purple-500
      transparent: true,
      opacity: 0.24,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 4;
    ring2Mesh.rotation.z = Math.PI / 4;
    masterGroup.add(ring2Mesh);

    // Ring 3 - Outer Defense Perimeter
    const ring3Geo = new THREE.TorusGeometry(20.5, 0.06, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // Rose-500
      transparent: true,
      opacity: 0.2,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.y = Math.PI / 2.5;
    masterGroup.add(ring3Mesh);

    // C. Volumetric Cyber Threat Particles (550 nodes)
    const particleCount = 550;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xf43f5e), // Rose (Critical Threat)
      new THREE.Color(0x06b6d4), // Cyan (Verified Asset)
      new THREE.Color(0xf59e0b), // Amber (Suspicious Alert)
      new THREE.Color(0x8b5cf6), // Purple (Dark Web Leak)
      new THREE.Color(0x10b981), // Emerald (Clean Domain)
    ];

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical cloud with radius 10 to 45
      const radius = 10 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Random gentle drift velocities
      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      const color = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Custom circle particle texture to avoid square artifacts
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(particles);

    // D. Radar Pulse Sweep Plane
    const radarSweepGeo = new THREE.RingGeometry(0.5, 24, 64, 1, 0, Math.PI / 4);
    const radarSweepMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const radarSweep = new THREE.Mesh(radarSweepGeo, radarSweepMat);
    radarSweep.rotation.x = Math.PI / 2;
    masterGroup.add(radarSweep);

    // 3. Pointer parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normalizedX * 2.5;
      mouseRef.current.targetY = normalizedY * 2.0;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 4. Resize Handling with ResizeObserver
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop with Clock and Slow-Down Factor
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const currentSpeed = isPausedRef.current ? 0 : speedRef.current;

      // Smooth mouse parallax damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

      camera.position.x = mouseRef.current.x;
      camera.position.y = mouseRef.current.y;
      camera.lookAt(0, 0, 0);

      if (currentSpeed > 0) {
        // Master slow-down rotations
        const factor = delta * currentSpeed;

        // Core rotation (slow, deliberate)
        coreMesh.rotation.y += factor * 0.12;
        coreMesh.rotation.x += factor * 0.06;

        innerMesh.rotation.y -= factor * 0.2;
        innerMesh.rotation.z += factor * 0.1;

        // Ring orbital rotations at decoupled harmonic rates
        ring1Mesh.rotation.z += factor * 0.15;
        ring2Mesh.rotation.y += factor * 0.12;
        ring3Mesh.rotation.x += factor * 0.08;

        // Radar sweep rotation
        radarSweep.rotation.z -= factor * 0.4;

        // Slowly drift particles
        const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += particleVelocities[i * 3] * currentSpeed * 1.5;
          positions[i * 3 + 1] += particleVelocities[i * 3 + 1] * currentSpeed * 1.5;
          positions[i * 3 + 2] += particleVelocities[i * 3 + 2] * currentSpeed * 1.5;

          // Boundary wrap-around
          const distSq =
            positions[i * 3] * positions[i * 3] +
            positions[i * 3 + 1] * positions[i * 3 + 1] +
            positions[i * 3 + 2] * positions[i * 3 + 2];

          if (distSq > 50 * 50) {
            positions[i * 3] *= 0.3;
            positions[i * 3 + 1] *= 0.3;
            positions[i * 3 + 2] *= 0.3;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      radarSweepGeo.dispose();
      radarSweepMat.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Background 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
          isVisible ? 'opacity-85' : 'opacity-0'
        }`}
        style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
      />

      {/* Floating 3D Cyber Animation Speed & HUD Controller */}
      <div className="fixed bottom-6 left-6 z-30 flex items-center select-none font-mono">
        {showControls ? (
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-300 shadow-2xl text-xs">
            {/* 3D Indicator */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800 text-rose-400 font-bold">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: speed === 0 || isPaused ? '0s' : `${12 / speed}s` }} />
              <span className="text-[11px] uppercase tracking-wider">
                {getTranslation(currentLang, 'threeDBackground')}
              </span>
            </div>

            {/* Speed Presets */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Speed:</span>

              {/* 0.1x Ultra-Slow */}
              <button
                onClick={() => {
                  setSpeed(0.1);
                  setIsPaused(false);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-all font-semibold ${
                  speed === 0.1 && !isPaused
                    ? 'bg-rose-900/60 text-rose-200 border border-rose-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={getTranslation(currentLang, 'threeDUltraSlow')}
              >
                0.1x
              </button>

              {/* 0.25x Slow Down (Default / Highlighted) */}
              <button
                onClick={() => {
                  setSpeed(0.25);
                  setIsPaused(false);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-all font-semibold flex items-center gap-1 ${
                  speed === 0.25 && !isPaused
                    ? 'bg-rose-600 text-white border border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={getTranslation(currentLang, 'threeDSlowDown')}
              >
                <span>0.25x</span>
                <span className="text-[9px] uppercase px-1 py-0.2 bg-rose-950 text-rose-300 rounded border border-rose-400/40">
                  {currentLang === 'te' ? 'స్లో' : currentLang === 'hi' ? 'धीमा' : currentLang === 'mr' ? 'मंद' : 'Slow'}
                </span>
              </button>

              {/* 0.5x Gentle */}
              <button
                onClick={() => {
                  setSpeed(0.5);
                  setIsPaused(false);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-all font-semibold hidden md:inline-block ${
                  speed === 0.5 && !isPaused
                    ? 'bg-rose-900/60 text-rose-200 border border-rose-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Gentle Pace (0.5x)"
              >
                0.5x
              </button>

              {/* 1.0x Normal */}
              <button
                onClick={() => {
                  setSpeed(1.0);
                  setIsPaused(false);
                }}
                className={`px-2 py-0.5 rounded text-[11px] transition-all font-semibold ${
                  speed === 1.0 && !isPaused
                    ? 'bg-rose-900/60 text-rose-200 border border-rose-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Normal Speed (1.0x)"
              >
                1.0x
              </button>

              {/* Pause / Resume */}
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className={`p-1 rounded text-[11px] transition-all ml-1 ${
                  isPaused
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isPaused ? 'Resume 3D Animation' : 'Pause 3D Animation'}
              >
                {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
              </button>

              {/* Toggle Canvas Visibility */}
              <button
                onClick={() => setIsVisible((prev) => !prev)}
                className={`p-1 rounded text-[11px] transition-all ml-1 ${
                  !isVisible ? 'text-slate-600' : 'text-slate-400 hover:text-white'
                }`}
                title={isVisible ? 'Hide 3D Background' : 'Show 3D Background'}
              >
                {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setShowControls(false)}
              className="text-slate-500 hover:text-slate-300 ml-1 text-[11px] px-1"
              title="Minimize 3D Speed HUD"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowControls(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 shadow-lg text-[11px]"
            title="Expand 3D Animation Speed Controller"
          >
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span>3D Speed: {isPaused ? 'Paused' : `${speed}x`}</span>
          </button>
        )}
      </div>
    </>
  );
};
