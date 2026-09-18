import { useEffect, useRef } from "react";
import * as THREE from "three";

// Widest extent of the mark plus its orbit ring, with padding. Used to
// scale the scene so it always fits the canvas regardless of aspect.
const SPAN = 3.9;

/**
 * Bevelled 3D "X" with a glowing edge outline and a thin orbit ring,
 * slowly rotating and leaning toward the cursor. Renders only while the
 * canvas is on screen and the tab is visible.
 *
 * Loaded lazily from Home; falls back to the static mark if WebGL is
 * unavailable (caller handles the fallback via onFail).
 */
export default function HeroMark({ onFail }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onFail?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // Plus-shaped outline, rotated 45deg below to read as an X.
    const w = 0.27;
    const L = 1.05;
    const pts = [[-w, -L], [w, -L], [w, -w], [L, -w], [L, w], [w, w], [w, L], [-w, L], [-w, w], [-L, w], [-L, -w], [-w, -w]];
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      bevelSegments: 4,
      curveSegments: 4,
    });
    geo.center();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x11245e,
      metalness: 0.55,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      emissive: 0x0b2a6b,
      emissiveIntensity: 0.55,
    });
    const mesh = new THREE.Mesh(geo, mat);

    const edgesGeo = new THREE.EdgesGeometry(geo, 25);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.55 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);

    const group = new THREE.Group();
    group.rotation.z = Math.PI / 4;
    group.add(mesh, edges);

    const ringGeo = new THREE.TorusGeometry(1.85, 0.007, 8, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;

    const root = new THREE.Group();
    root.add(group, ring);
    scene.add(root);

    scene.add(new THREE.AmbientLight(0x9ec5ff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(3, 4, 5);
    const rim = new THREE.PointLight(0x38bdf8, 26, 14);
    rim.position.set(-3.4, -1.4, 2.6);
    const back = new THREE.PointLight(0x1d4ed8, 18, 16);
    back.position.set(1.6, 2.4, -4);
    scene.add(key, rim, back);

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
      root.scale.setScalar(Math.min(1, Math.min(visW, visH) / SPAN));
    };

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.7;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let onScreen = true;

    const tick = () => {
      if (!onScreen || document.hidden) {
        raf = 0;
        return;
      }
      const t = clock.getElapsedTime();
      cur.x += (target.x - cur.x) * 0.045;
      cur.y += (target.y - cur.y) * 0.045;
      root.rotation.y = t * 0.28 + cur.x;
      root.rotation.x = Math.sin(t * 0.4) * 0.09 + cur.y;
      root.position.y = Math.sin(t * 0.7) * 0.08;
      ring.rotation.z = t * 0.16;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
    });
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    resize();
    start();
    io.observe(cv);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      mat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [onFail]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
