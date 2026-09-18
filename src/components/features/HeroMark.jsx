import { useEffect, useRef } from "react";
import * as THREE from "three";

// Widest extent of the wordmark with padding; the scene is scaled so it
// always fits the canvas regardless of aspect.
const SPAN = 3.6;

/**
 * Extruded 3D "CX" wordmark: a chrome "C" and a cyan "X" made of two
 * crossing bars, lit by a hemisphere + key light. It sways within a
 * bounded angle (never turns its back) and leans toward the cursor,
 * strongly while hovered and gently otherwise. Renders only while on
 * screen and the tab is visible.
 *
 * Loaded lazily from Home; calls onFail if a WebGL context can't be
 * created so the caller can show the static mark instead.
 */
export default function HeroMark({ onFail }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: cv,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
      });
      if (!renderer.getContext()) throw new Error("no context");
    } catch {
      onFail?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

const metal = new THREE.MeshPhongMaterial({ color: 0xdce4f0, emissive: 0x0a1830, emissiveIntensity: 0.18, shininess: 120, specular: 0x8fb4ff });
    const accent = new THREE.MeshPhongMaterial({ color: 0x5ccbfa, emissive: 0x0e5a82, emissiveIntensity: 0.5, shininess: 90, specular: 0xd6f0ff });
    const bevel = { depth: 0.6, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 8, curveSegments: 64 };
    // Resting pose: a 3/4 view so the extruded sides catch light and read as 3D.
    const BASE_X = -0.22;
    const BASE_Y = 0.34;

    // "C": an open ring (outer arc, then inner arc back)
    const cShape = new THREE.Shape();
    cShape.absarc(0, 0, 0.85, Math.PI * 0.27, Math.PI * 1.73, false);
    cShape.absarc(0, 0, 0.5, Math.PI * 1.73, Math.PI * 0.27, true);
    const cGeo = new THREE.ExtrudeGeometry(cShape, bevel);
    cGeo.translate(-0.95, 0, 0);
    cGeo.deleteAttribute("normal");
    cGeo.computeVertexNormals();
    const cMesh = new THREE.Mesh(cGeo, metal);

    // "X": two crossing bars
    const barShape = (bw, bl) => {
      const s = new THREE.Shape();
      s.moveTo(-bw / 2, -bl / 2);
      s.lineTo(bw / 2, -bl / 2);
      s.lineTo(bw / 2, bl / 2);
      s.lineTo(-bw / 2, bl / 2);
      s.closePath();
      return s;
    };
    const bar1 = new THREE.ExtrudeGeometry(barShape(0.32, 1.9), bevel);
    bar1.rotateZ(Math.PI / 4);
    const bar2 = new THREE.ExtrudeGeometry(barShape(0.32, 1.9), bevel);
    bar2.rotateZ(-Math.PI / 4);
    const x1 = new THREE.Mesh(bar1, accent);
    const x2 = new THREE.Mesh(bar2, accent);
    x1.position.x = 0.85;
    x2.position.x = 0.85;

    const wordmark = new THREE.Group();
    wordmark.add(cMesh, x1, x2);
    wordmark.rotation.x = BASE_X;
    wordmark.rotation.y = BASE_Y;
    const root = new THREE.Group();
    root.add(wordmark);
    scene.add(root);

scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x0a0f1a, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 4, 5);
    // soft cyan rim from the lower left so the extruded sides stay legible
    const rim = new THREE.PointLight(0x38bdf8, 18, 14);
    rim.position.set(-3.4, -1.2, 2.8);
    scene.add(key, rim);

    const resize = () => {
      const rect = cv.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      const aspect = rect.width / rect.height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const half = Math.tan((camera.fov * Math.PI) / 360);
      const visH = 2 * half * camera.position.z;
      const visW = visH * aspect;
      // fill the canvas (up to 1.15x natural size on wide columns)
      root.scale.setScalar(Math.min(1.15, Math.min(visW, visH) / SPAN));
      renderer.render(scene, camera);
    };

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = cv.getBoundingClientRect();
      const hovering = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      target.x = hovering ? relX * 0.9 : (e.clientX / window.innerWidth - 0.5) * 0.5;
      target.y = hovering ? relY * 0.6 : (e.clientY / window.innerHeight - 0.5) * 0.3;
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let onScreen = true;
    let contextLost = false;

    const tick = () => {
      if (contextLost || !onScreen || document.hidden) {
        raf = 0;
        return;
      }
      const t = clock.getElapsedTime();
      cur.x += (target.x - cur.x) * 0.1;
      cur.y += (target.y - cur.y) * 0.1;
      wordmark.rotation.y = BASE_Y + Math.sin(t * 0.35) * 0.22 + cur.x * 0.9;
      wordmark.rotation.x = BASE_X + cur.y * 0.45 + Math.sin(t * 0.5) * 0.04;
      root.position.y = Math.sin(t * 0.7) * 0.07;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
      },
      { threshold: 0.05, rootMargin: "200px" }
    );
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    // A lost context (GPU reset, tab discard) pauses rendering; the browser
    // usually restores it and three.js re-initialises on that event.
    const onContextLost = (e) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
      resize();
      start();
    };

    resize();
    start();
    io.observe(cv);
    cv.addEventListener("webglcontextlost", onContextLost);
    cv.addEventListener("webglcontextrestored", onContextRestored);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cv.removeEventListener("webglcontextlost", onContextLost);
      cv.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cGeo.dispose();
      bar1.dispose();
      bar2.dispose();
      metal.dispose();
      accent.dispose();
      // No forceContextLoss(): the canvas element outlives this effect under
      // React StrictMode and a forced loss would poison the next mount.
      renderer.dispose();
    };
  }, [onFail]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
