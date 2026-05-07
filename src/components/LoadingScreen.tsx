"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0f0f0f");
    scene.fog = new THREE.FogExp2("#0f0f0f", 0.18);

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // ── Materials ──────────────────────────────────────────────────────
    const goldMat = new THREE.MeshStandardMaterial({ color: "#c9a961", roughness: 0.25, metalness: 0.85 });
    const darkMat = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.5, metalness: 0.4 });
    const silverMat = new THREE.MeshStandardMaterial({ color: "#aaaaaa", roughness: 0.2, metalness: 0.95 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: "#cccccc", roughness: 0.1, metalness: 1.0 });

    // ── Clipper Machine ────────────────────────────────────────────────
    const clipperGroup = new THREE.Group();
    clipperGroup.position.set(-1.4, 0, 0);

    clipperGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 0.55), darkMat));

    [-0.4, 0, 0.4].forEach((y) => {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.055, 0.58), goldMat);
      ridge.position.y = y;
      clipperGroup.add(ridge);
    });

    const taper = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.55, 0.4, 6), darkMat);
    taper.position.y = 1.1;
    clipperGroup.add(taper);

    const bladeHouse = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.18, 0.52), chromeMat);
    bladeHouse.position.y = 1.36;
    clipperGroup.add(bladeHouse);

    for (let i = 0; i < 5; i++) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.06), silverMat);
      tooth.position.set(-0.24 + i * 0.12, 1.58, 0);
      clipperGroup.add(tooth);
    }

    const movingBlade = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const mTooth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), goldMat);
      mTooth.position.set(-0.18 + i * 0.12, 1.52, 0);
      movingBlade.add(mTooth);
    }
    clipperGroup.add(movingBlade);

    const switchMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16), goldMat);
    switchMesh.rotation.z = Math.PI / 2;
    switchMesh.position.set(0.62, 0.3, 0);
    clipperGroup.add(switchMesh);

    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12), darkMat);
    cord.position.y = -1.05;
    clipperGroup.add(cord);
    scene.add(clipperGroup);

    // ── Scissors ──────────────────────────────────────────────────────
    const scissorsGroup = new THREE.Group();
    scissorsGroup.position.set(1.5, 0, 0);
    scissorsGroup.rotation.z = -Math.PI / 6;

    const makeBlade = (flip: number) => {
      const g = new THREE.Group();
      const bl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.06), chromeMat);
      bl.position.y = 0.9;
      g.add(bl);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 8), silverMat);
      tip.position.y = 2.08;
      g.add(tip);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.055, 16, 32), goldMat);
      ring.position.set(flip * 0.12, -0.85, 0);
      g.add(ring);
      const shank = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.06), goldMat);
      shank.position.set(flip * 0.06, -0.45, 0);
      g.add(shank);
      return g;
    };

    const bladeA = makeBlade(-1);
    const bladeB = makeBlade(1);
    const pivotMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16), goldMat);
    pivotMesh.rotation.x = Math.PI / 2;
    scissorsGroup.add(bladeA, bladeB, pivotMesh);
    scene.add(scissorsGroup);

    // ── Dust particles ─────────────────────────────────────────────────
    const pCount = 80;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: "#c9a961", size: 0.035, transparent: true, opacity: 0.45 });
    const dustPoints = new THREE.Points(pGeo, pMat);
    scene.add(dustPoints);

    // ── Lighting ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.PointLight("#dcd0b4", 50, 14);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight("#c9a961", 25, 10);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    // ── Fast progress (1.6 s) ──────────────────────────────────────────
    let prog = 0;
    const progInterval = setInterval(() => {
      prog = Math.min(prog + Math.random() * 9 + 3, 100);
      setProgress(Math.floor(prog));
      if (prog >= 100) clearInterval(progInterval);
    }, 30);

    const dismissTimer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 700);
    }, 1600);

    // ── Animation loop ─────────────────────────────────────────────────
    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.018;

      // Clipper float + blade buzz
      clipperGroup.position.y = Math.sin(t * 1.2) * 0.12;
      clipperGroup.rotation.z = Math.sin(t * 0.8) * 0.04;
      movingBlade.position.x = Math.sin(t * 28) * 0.055;

      // Scissors open/close + float opposite phase
      const openAngle = (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.45;
      bladeA.rotation.z = openAngle;
      bladeB.rotation.z = -openAngle;
      scissorsGroup.position.y = Math.sin(t * 1.2 + Math.PI) * 0.12;

      dustPoints.rotation.y += 0.003;
      dustPoints.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progInterval);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      [goldMat, darkMat, silverMat, chromeMat, pMat].forEach((m) => m.dispose());
      pGeo.dispose();
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0f0f0f",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: "8vh",
          paddingTop: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          background: "linear-gradient(to top, rgba(15,15,15,0.92) 0%, transparent 100%)",
        }}
      >
        {/* Wordmark */}
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(11px, 1.8vw, 15px)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#dcd0b4",
            margin: 0,
          }}
        >
          Dardan Barbershop
        </p>

        {/* Thin gold divider */}
        <div
          style={{
            width: 48,
            height: 1,
            background: "linear-gradient(to right, transparent, #c9a961, transparent)",
          }}
        />

        {/* Progress bar */}
        <div
          style={{
            width: "clamp(160px, 30vw, 280px)",
            height: 1,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(to right, #8a6f3a, #c9a961, #dcd0b4)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
