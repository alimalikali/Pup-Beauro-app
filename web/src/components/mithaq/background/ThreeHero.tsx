import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ThreeHero — full-screen fixed Three.js scene.
 * Crescent moon, geometric diamond, three orbital rings,
 * particle field, and a pulsing star — all in pink tones.
 * Hidden on mobile via parent CSS for performance.
 */
const ThreeHero = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xfce7f3, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 5, 5);
    scene.add(dir);
    const p1 = new THREE.PointLight(0xf0134d, 0.6, 10);
    p1.position.set(-3, 2, 2);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xfbcfe8, 0.4, 8);
    p2.position.set(3, -2, 1);
    scene.add(p2);

    // --- Crescent moon (two offset torus arcs) ---
    const crescent = new THREE.Group();
    const crescentMat = new THREE.MeshPhongMaterial({
      color: 0xfda4af,
      emissive: 0xf9a8d4,
      emissiveIntensity: 0.3,
      shininess: 80,
      transparent: true,
      opacity: 0.9,
    });
    const arc1 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.18, 24, 64, Math.PI * 1.4), crescentMat);
    crescent.add(arc1);
    const arc2 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.18, 24, 64, Math.PI * 1.2), crescentMat);
    arc2.position.x = 0.25;
    arc2.scale.setScalar(0.95);
    arc2.rotation.z = 0.1;
    // subtractive feel: hide second arc by pushing back slightly with smaller emissive
    // We'll fake the crescent shape by overlaying a small sphere matching bg — but bg is gradient, so skip cut.
    // Instead use two arcs overlapping for an aesthetic moon-like shape.
    crescent.add(arc2);
    crescent.position.set(-3, 2, -1);
    scene.add(crescent);

    // --- Diamond (octahedron) ---
    const diamond = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.MeshPhongMaterial({
        color: 0xf9a8d4,
        emissive: 0xfecdd3,
        emissiveIntensity: 0.4,
        shininess: 120,
      })
    );
    diamond.position.set(3.5, 0.5, -0.5);
    scene.add(diamond);

    // --- Three rings ---
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.04, 16, 80),
      new THREE.MeshPhongMaterial({ color: 0xf0134d, transparent: true, opacity: 0.4, shininess: 60 })
    );
    ring1.position.set(-1, -2, -2);
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.8, 0.03, 16, 80),
      new THREE.MeshPhongMaterial({ color: 0xfbcfe8, transparent: true, opacity: 0.5, shininess: 60 })
    );
    ring2.position.set(2, 1.5, -3);
    scene.add(ring2);

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.025, 16, 80),
      new THREE.MeshPhongMaterial({ color: 0xfda4af, transparent: true, opacity: 0.3, shininess: 60 })
    );
    ring3.position.set(0, 0, -4);
    scene.add(ring3);

    // --- Particle field ---
    const PARTICLE_COUNT = 180;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -3 - Math.random() * 5;
      sizes[i] = 0.025 + Math.random() * 0.035;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf9a8d4,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Star of light ---
    const star = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.3, 0),
      new THREE.MeshPhongMaterial({
        color: 0xf0134d,
        emissive: 0xf0134d,
        emissiveIntensity: 0.8,
        shininess: 200,
      })
    );
    star.position.set(1, 2.5, 0);
    scene.add(star);

    // --- Mouse parallax ---
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouse);

    // --- Resize ---
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // --- Animate ---
    let rafId = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();

      crescent.rotation.y += 0.003;
      crescent.position.y = 2 + Math.sin(t * 0.8) * 0.3;

      diamond.rotation.x += 0.005;
      diamond.rotation.y += 0.007;
      diamond.rotation.z += 0.003;
      diamond.position.y = 0.5 + Math.sin(t * 0.6 + 1) * 0.25;

      ring1.rotation.x += 0.006;
      ring2.rotation.y += 0.008;
      ring3.rotation.z += 0.002;

      particles.rotation.y += 0.0005;
      const pos = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let y = pos.getY(i);
        y += 0.002;
        if (y > 6) y = -6;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      const pulse = 0.8 + (Math.sin(t * 2) + 1) * 0.2;
      star.scale.setScalar(pulse);
      star.position.x = 1 + Math.cos(t * 0.5) * 0.4;
      star.position.y = 2.5 + Math.sin(t * 0.5) * 0.4;

      // camera lerp toward mouse target
      target.x = mouse.x * 0.3;
      target.y = mouse.y * 0.2;
      camera.position.x += (target.x - camera.position.x) * 0.05;
      camera.position.y += (target.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) (mat as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
    />
  );
};

export default ThreeHero;
