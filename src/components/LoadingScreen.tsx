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

    const isMobile = mount.clientWidth < 640;

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 60 : 45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, isMobile ? 8 : 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Materials ──────────────────────────────────────────────────────
    const goldMat = new THREE.MeshStandardMaterial({
      color: "#e8c47a",
      roughness: 0.15,
      metalness: 0.9,
      emissive: "#7a5a20",
      emissiveIntensity: 0.25,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: "#e8e8e8",
      roughness: 0.08,
      metalness: 1.0,
      emissive: "#444444",
      emissiveIntensity: 0.15,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: "#f0f0f0",
      roughness: 0.05,
      metalness: 1.0,
      emissive: "#555555",
      emissiveIntensity: 0.2,
    });

    // ── Scissors (centred) ─────────────────────────────────────────────
    const scissorsGroup = new THREE.Group();
    scissorsGroup.position.set(0, 0, 0);
    scissorsGroup.rotation.z = -Math.PI / 6;
    // Scale down slightly on mobile so handles fit in view
    const s = isMobile ? 0.72 : 1;
    scissorsGroup.scale.set(s, s, s);

    const makeBlade = (flip: number) => {
      const g = new THREE.Group();
      // Blade — wider and thicker for visibility
      const bl = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 2.4, 0.1),
        chromeMat,
      );
      bl.position.y = 1.0;
      g.add(bl);
      // Sharp tip
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.07, 0.42, 8),
        silverMat,
      );
      tip.position.y = 2.31;
      g.add(tip);
      // Finger ring — bigger torus
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.34, 0.07, 16, 48),
        goldMat,
      );
      ring.position.set(flip * 0.14, -0.95, 0);
      g.add(ring);
      // Shank connecting ring to pivot
      const shank = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.8, 0.08),
        goldMat,
      );
      shank.position.set(flip * 0.07, -0.5, 0);
      g.add(shank);
      return g;
    };

    const bladeA = makeBlade(-1);
    const bladeB = makeBlade(1);
    const pivotMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.14, 24),
      goldMat,
    );
    pivotMesh.rotation.x = Math.PI / 2;
    scissorsGroup.add(bladeA, bladeB, pivotMesh);
    scene.add(scissorsGroup);

    // ── Dust particles ─────────────────────────────────────────────────
    const pCount = 80;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: "#c9a961",
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    const dustPoints = new THREE.Points(pGeo, pMat);
    scene.add(dustPoints);

    // ── Lighting ───────────────────────────────────────────────────────
    // Strong ambient so no part falls into pure black
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    // Bright warm key from front-top-right
    const keyLight = new THREE.PointLight(0xffffff, 120, 20);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);
    // Gold fill from left
    const fillLight = new THREE.PointLight("#e8c47a", 80, 16);
    fillLight.position.set(-4, 0, 4);
    scene.add(fillLight);
    // White rim / back-light to separate from bg
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-1, 2, -3);
    scene.add(rimLight);
    // Front-facing fill so details on blades stay bright
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 0, 8);
    scene.add(frontLight);

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

      // Scissors open/close + gentle float
      const openAngle = (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.55;
      bladeA.rotation.z = openAngle;
      bladeB.rotation.z = -openAngle;
      scissorsGroup.position.y = Math.sin(t * 1.0) * 0.1;
      // Very slow y-axis rotation so you see the 3D shape
      scissorsGroup.rotation.y = Math.sin(t * 0.4) * 0.3;

      dustPoints.rotation.y += 0.003;
      dustPoints.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const mobile = mount.clientWidth < 640;
      camera.fov = mobile ? 60 : 45;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      const ns = mobile ? 0.72 : 1;
      scissorsGroup.scale.set(ns, ns, ns);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progInterval);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
      renderer.dispose();
      [goldMat, silverMat, chromeMat, pMat].forEach((m) => m.dispose());
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
          background:
            "linear-gradient(to top, rgba(15,15,15,0.92) 0%, transparent 100%)",
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
            background:
              "linear-gradient(to right, transparent, #c9a961, transparent)",
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
              background:
                "linear-gradient(to right, #8a6f3a, #c9a961, #dcd0b4)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
