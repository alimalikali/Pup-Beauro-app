---
name: add-three-scene
description: Add a new Three.js WebGL scene to admin/src/components/mithaq/background/ — vanilla three.js (NOT r3f), mandatory disposal in useEffect cleanup. Use when the user asks to "add 3D scene", "new webgl background", "extend ThreeHero".
argument-hint: [scene-name]
allowed-tools: Read, Write, Edit
paths: admin/**
---

# Add Three.js scene: $ARGUMENTS

**Vanilla Three.js only.** Do NOT add `@react-three/fiber` or `drei` without explicit user approval — the codebase pattern is manual setup.

## Template

```tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function $ARGUMENTS() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45, mount.clientWidth / mount.clientHeight, 0.1, 1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // mandatory cap
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Geometry, materials, lights
    // ...

    // Resize handler
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      // animation logic
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // CLEANUP — mandatory
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) (mat as THREE.Material).dispose();
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hidden md:block w-full h-full" />;
}
```

## Cleanup contract — non-negotiable

Every `useEffect` that creates a Three.js scene must return a cleanup that does ALL of:

1. `cancelAnimationFrame(rafId)`
2. Remove every `window` event listener attached (`resize`, `pointermove`, etc.)
3. `renderer.dispose()`
4. Traverse the scene, disposing every geometry + every material (array or single)
5. `mount.removeChild(renderer.domElement)`

Skip any one and you leak GPU memory on hot reload / route change.

## Rules

- **DPR cap**: `Math.min(window.devicePixelRatio, 2)` — never the raw value
- **Mobile hidden by default**: `hidden md:block` on the mount wrapper. Override only when explicitly required.
- **Particle counts**: stay around 180 (matches `ThreeHero`). Higher needs performance review.
- **No drei**: no `@react-three/fiber`, no `drei`. Vanilla three only.
- **No external loaders** without confirmation (GLTFLoader etc. — pull in only when needed)

## Reference

Existing implementations to mirror: `admin/src/components/mithaq/background/ThreeHero.tsx` (full scene with disposal), `LeavesBackground.tsx` (2D canvas, similar cleanup pattern).

## Verify

- Mount the component in a test page — scene renders
- Resize the window — geometry adapts (resize handler fires)
- Navigate away from the page — check the browser's GPU memory in DevTools (Performance Monitor): should not climb on repeated navigations
- Hot reload during development — should not throw "Context lost" errors after a few iterations
