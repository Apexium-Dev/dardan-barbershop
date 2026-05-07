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
    const s = isMobile ? 0.72 : 1;
    scissorsGroup.scale.set(s, s, s);

    // Build one arm: tapered cutting blade (up) + tapered shank (down) + ring
    const makeArm = (flip: number, zOff: number) => {
      const g = new THREE.Group();

      // ── Cutting blade — tapered ExtrudeGeometry ──────────────────────
      // Profile: wide at pivot base, narrows to a fine point at tip.
      // Spine (right/+x) is slightly wider & straighter; cutting edge curves in.
      const bladeProfile = new THREE.Shape();
      bladeProfile.moveTo(0, 0); // base, cutting-edge corner
      bladeProfile.bezierCurveTo(
        // cutting edge — gently concave
        -0.04,
        0.9,
        -0.03,
        1.9,
        0.01,
        2.72, // near-tip
      );
      bladeProfile.lineTo(0.03, 2.78); // very tip
      bladeProfile.bezierCurveTo(
        // spine — slightly convex, wider
        0.1,
        1.95,
        0.17,
        0.9,
        0.18,
        0, // base, spine corner
      );
      bladeProfile.lineTo(0, 0);

      const bladeGeo = new THREE.ExtrudeGeometry(bladeProfile, {
        depth: 0.07,
        bevelEnabled: true,
        bevelThickness: 0.018,
        bevelSize: 0.014,
        bevelSegments: 3,
      });
      // Centre z so pivot is at local origin
      bladeGeo.translate(-0.09, 0, -0.053);
      g.add(new THREE.Mesh(bladeGeo, chromeMat));

      // ── Shank — tapered gold handle bar ──────────────────────────────
      const shankProfile = new THREE.Shape();
      shankProfile.moveTo(-0.07, 0);
      shankProfile.lineTo(-0.055, -0.88);
      shankProfile.lineTo(0.055, -0.88);
      shankProfile.lineTo(0.07, 0);
      shankProfile.lineTo(-0.07, 0);

      const shankGeo = new THREE.ExtrudeGeometry(shankProfile, {
        depth: 0.09,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.012,
        bevelSegments: 2,
      });
      shankGeo.translate(flip * 0.04, 0, -0.06);
      g.add(new THREE.Mesh(shankGeo, goldMat));

      // ── Finger ring ───────────────────────────────────────────────────
      const ringR = flip < 0 ? 0.29 : 0.26; // thumb ring slightly smaller
      const ringTube = 0.068;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(ringR, ringTube, 22, 64),
        goldMat,
      );
      ring.position.set(flip * 0.11, -1.18, 0);
      g.add(ring);

      // Inner ring edge accent (thinner, silver) for depth
      const ringInner = new THREE.Mesh(
        new THREE.TorusGeometry(ringR - ringTube * 0.6, 0.012, 12, 64),
        silverMat,
      );
      ringInner.position.copy(ring.position);
      g.add(ringInner);

      // ── Finger tang / rest (only on the upper blade, one side) ───────
      if (flip === 1) {
        const tang = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 14, 10),
          goldMat,
        );
        tang.scale.set(1, 1.5, 1);
        tang.position.set(0.12, -1.58, 0);
        g.add(tang);
        // Stem of tang
        const tangStem = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.032, 0.28, 10),
          goldMat,
        );
        tangStem.rotation.z = 0.25;
        tangStem.position.set(0.07, -1.45, 0);
        g.add(tangStem);
      }

      // Offset in z so blades overlap at pivot but don't clip each other
      g.position.z = zOff;
      return g;
    };

    const bladeA = makeArm(-1, -0.04);
    const bladeB = makeArm(1, 0.04);

    // ── Pivot screw — layered discs ──────────────────────────────────
    const pivotBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.17, 0.06, 32),
      goldMat,
    );
    pivotBase.rotation.x = Math.PI / 2;

    const pivotHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.06, 32),
      silverMat,
    );
    pivotHead.rotation.x = Math.PI / 2;
    pivotHead.position.z = 0.06;

    // Cross slot on screw head
    const slotH = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.022, 0.04),
      new THREE.MeshStandardMaterial({
        color: "#222",
        roughness: 0.8,
        metalness: 0.2,
      }),
    );
    slotH.position.z = 0.1;
    const slotV = slotH.clone();
    slotV.rotation.z = Math.PI / 2;
    slotV.position.z = 0.1;

    scissorsGroup.add(bladeA, bladeB, pivotBase, pivotHead, slotH, slotV);
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

      // Scissors: arms open/close around pivot at origin
      const openAngle = (Math.sin(t * 2.2) * 0.5 + 0.5) * 0.48;
      bladeA.rotation.z = openAngle;
      bladeB.rotation.z = -openAngle;
      // Gentle float + slow y-turn to show 3D shape
      scissorsGroup.position.y = Math.sin(t * 1.0) * 0.1;
      scissorsGroup.rotation.y = Math.sin(t * 0.35) * 0.28;

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
