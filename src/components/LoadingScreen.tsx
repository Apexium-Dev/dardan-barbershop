"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
      isMobile ? 55 : 40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.2, isMobile ? 5.5 : 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    const keyLight = new THREE.PointLight(0xffffff, 160, 22);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight("#e8c47a", 100, 18);
    fillLight.position.set(-4, 0, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLight.position.set(-1, 3, -3);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 0, 8);
    scene.add(frontLight);

    // ── Material overrides ─────────────────────────────────────────────
    const goldOverride = new THREE.MeshStandardMaterial({
      color: "#c9a961",
      roughness: 0.18,
      metalness: 0.95,
      emissive: "#7a5a20",
      emissiveIntensity: 0.25,
    });

    // Dark polished steel for the blades
    const steelOverride = new THREE.MeshStandardMaterial({
      color: "#3a3d42",
      roughness: 0.08,
      metalness: 0.97,
      emissive: "#1a1c20",
      emissiveIntensity: 0.1,
    });

    // ── Dust particles ─────────────────────────────────────────────────
    const pCount = 90;
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
      size: 0.03,
      transparent: true,
      opacity: 0.5,
    });
    const dustPoints = new THREE.Points(pGeo, pMat);
    scene.add(dustPoints);

    // ── Animation state ────────────────────────────────────────────────
    let raf: number;
    let mixer: THREE.AnimationMixer | null = null;
    let scissorsRoot: THREE.Object3D | null = null;
    let t = 0;

    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.018;
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      if (scissorsRoot) {
        // Gentle float + slow y-axis turn so model looks alive
        scissorsRoot.position.y = Math.sin(t * 0.9) * 0.08;
        scissorsRoot.rotation.y = Math.sin(t * 0.3) * 0.35;
      }

      dustPoints.rotation.y += 0.003;
      dustPoints.rotation.x += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    // ── Load GLB ──────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      "/barbers_scissors.glb",
      (gltf) => {
        const model = gltf.scene;

        // Auto-centre and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = (isMobile ? 2.2 : 2.8) / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Material overrides per node type
        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          const name = child.name.toLowerCase();
          if (
            name.includes("handle") ||
            name.includes("padding") ||
            name.includes("screw") ||
            name.includes("damper")
          ) {
            child.material = goldOverride;
          } else if (name.includes("blade") || name.includes("object")) {
            child.material = steelOverride;
          }
        });

        scissorsRoot = model;
        scene.add(model);

        // Play the built-in animation if it exists
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.timeScale = 0.6; // slightly slower = more elegant
          action.play();
        }
      },
      undefined,
      (err) => console.error("GLB load error:", err),
    );

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

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const mobile = mount.clientWidth < 640;
      camera.fov = mobile ? 55 : 40;
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
      if (mount.contains(renderer.domElement))
        mount.removeChild(renderer.domElement);
      renderer.dispose();
      goldOverride.dispose();
      steelOverride.dispose();
      pGeo.dispose();
      pMat.dispose();
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
