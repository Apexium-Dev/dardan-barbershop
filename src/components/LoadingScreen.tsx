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

    // ── Barber Pole Stripe Texture ─────────────────────────────────────
    const texSize = 512;
    const texCanvas = document.createElement("canvas");
    texCanvas.width = texSize;
    texCanvas.height = texSize;
    const ctx = texCanvas.getContext("2d")!;

    // Dark base
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, texSize, texSize);

    // Diagonal gold stripes
    const stripeW = 60;
    const angle = 45;
    const rad = (angle * Math.PI) / 180;
    const repeat = 16;
    for (let i = -repeat; i < repeat * 2; i++) {
      const x = i * stripeW * 2;
      ctx.save();
      ctx.translate(texSize / 2, texSize / 2);
      ctx.rotate(rad);
      ctx.fillStyle = "#c9a961";
      ctx.fillRect(x - texSize, -texSize * 2, stripeW, texSize * 4);
      // Thin white accent inside gold stripe
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(x - texSize, -texSize * 2, stripeW * 0.2, texSize * 4);
      ctx.restore();
    }

    const poleTexture = new THREE.CanvasTexture(texCanvas);
    poleTexture.wrapS = THREE.RepeatWrapping;
    poleTexture.wrapT = THREE.RepeatWrapping;
    poleTexture.repeat.set(1, 3);

    // ── Barber Pole Body ───────────────────────────────────────────────
    const poleGeo = new THREE.CylinderGeometry(0.42, 0.42, 3.2, 64, 1, false);
    const poleMat = new THREE.MeshStandardMaterial({
      map: poleTexture,
      roughness: 0.3,
      metalness: 0.2,
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    scene.add(pole);

    // ── Gold Top & Bottom Caps ─────────────────────────────────────────
    const capMat = new THREE.MeshStandardMaterial({
      color: "#c9a961",
      roughness: 0.25,
      metalness: 0.7,
    });

    const topCapGeo = new THREE.CylinderGeometry(0.5, 0.42, 0.14, 64);
    const topCap = new THREE.Mesh(topCapGeo, capMat);
    topCap.position.y = 1.67;
    scene.add(topCap);

    const topDomeGeo = new THREE.SphereGeometry(0.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDome = new THREE.Mesh(topDomeGeo, capMat);
    topDome.position.y = 1.74;
    scene.add(topDome);

    const botCapGeo = new THREE.CylinderGeometry(0.42, 0.5, 0.14, 64);
    const botCap = new THREE.Mesh(botCapGeo, capMat);
    botCap.position.y = -1.67;
    scene.add(botCap);

    const botDomeGeo = new THREE.SphereGeometry(0.5, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const botDome = new THREE.Mesh(botDomeGeo, capMat);
    botDome.position.y = -1.74;
    scene.add(botDome);

    // ── Gold Ring Accents ──────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(0.46, 0.03, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: "#dcd0b4",
      roughness: 0.2,
      metalness: 0.9,
    });
    [-1.4, -0.7, 0, 0.7, 1.4].forEach((y) => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });

    // ── Floating Gold Particles ────────────────────────────────────────
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2.5 + Math.random() * 3.5;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = Math.sin(theta) * r - 3;
      sizes[i] = Math.random() * 3 + 1;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const partMat = new THREE.PointsMaterial({
      color: "#c9a961",
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // ── Lighting ───────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const keyLight = new THREE.PointLight("#c9a961", 40, 12);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 15, 10);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#dcd0b4", 0.6);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    // ── Progress ───────────────────────────────────────────────────────
    let prog = 0;
    const progInterval = setInterval(() => {
      prog = Math.min(prog + Math.random() * 4, 100);
      setProgress(Math.floor(prog));
      if (prog >= 100) clearInterval(progInterval);
    }, 50);

    // ── Auto-dismiss ───────────────────────────────────────────────────
    const dismissTimer = setTimeout(() => {
      setFading(true);
      setTimeout(onComplete, 900);
    }, 2800);

    // ── Animation loop ─────────────────────────────────────────────────
    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.016;

      // Stripe scroll upward + pole spin
      poleTexture.offset.y -= 0.004;
      pole.rotation.y += 0.008;

      // Gentle camera bob
      camera.position.y = Math.sin(t * 0.4) * 0.08;

      // Particles drift
      particles.rotation.y += 0.0015;

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
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      poleTexture.dispose();
      poleGeo.dispose();
      poleMat.dispose();
      partGeo.dispose();
      partMat.dispose();
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
        transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Bottom overlay — brand + progress */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 0 10vh 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          background:
            "linear-gradient(to top, rgba(15,15,15,0.95) 0%, transparent 100%)",
          paddingTop: 48,
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
