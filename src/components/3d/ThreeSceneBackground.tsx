import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneBackgroundProps {
  effectType?: 'falling-hearts' | 'floating-stars' | 'rose-petals' | 'sparkles' | 'none';
  theme?: 'romantic-rose' | 'twilight-purple' | 'midnight-blue' | 'golden-luxury' | 'emerald-dream';
  isAdminOpen?: boolean;
}

export const ThreeSceneBackground: React.FC<ThreeSceneBackgroundProps> = ({
  effectType = 'falling-hearts',
  theme = 'romantic-rose',
  isAdminOpen = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0512, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '0';

    container.appendChild(renderer.domElement);

    // --- 2. Dynamic Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Primary Mouse-Following Point Light with Specular Glow
    const mouseLight = new THREE.PointLight(0xec4899, 4, 35);
    mouseLight.position.set(0, 0, 8);
    mouseLight.castShadow = true;
    scene.add(mouseLight);

    // Secondary Accent Lights (Tesla / Apple Vision Pro Neon Ambient Orbs)
    const light1 = new THREE.PointLight(0x8b5cf6, 3, 40); // Purple
    light1.position.set(-12, 10, -5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xf43f5e, 3, 40); // Rose Red
    light2.position.set(12, -10, -5);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xf59e0b, 2.5, 30); // Golden Amber
    light3.position.set(0, -15, 5);
    scene.add(light3);

    // --- 3. Create 3D Floating Geometries (Hearts, Crystals, Torus Rings) ---
    const floatingObjectsGroup = new THREE.Group();
    scene.add(floatingObjectsGroup);

    // Heart Shape Helper
    const createHeartShape = () => {
      const shape = new THREE.Shape();
      const x = 0, y = 0;
      shape.moveTo(x + 0.25, y + 0.25);
      shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
      shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
      shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
      shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
      shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
      return shape;
    };

    const heartShape = createHeartShape();
    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();

    // Metallic Physical Materials for Premium Apple Vision Pro look
    const pinkMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      emissive: 0x881337,
      emissiveIntensity: 0.3,
      roughness: 0.15,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.2,
      ior: 1.5,
    });

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 0.8,
    });

    const glassCrystalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc084fc,
      emissive: 0x581c87,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      ior: 1.7,
      thickness: 1.2,
    });

    // Generate floating 3D elements
    const meshCount = 28;
    const items: {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      floatOffset: number;
      initialY: number;
    }[] = [];

    const crystalGeom = new THREE.IcosahedronGeometry(0.4, 0);
    const ringGeom = new THREE.TorusGeometry(0.5, 0.08, 16, 32);

    for (let i = 0; i < meshCount; i++) {
      let geom: THREE.BufferGeometry = heartGeometry;
      let mat = pinkMaterial;

      const randType = i % 3;
      if (randType === 1) {
        geom = crystalGeom;
        mat = glassCrystalMaterial;
      } else if (randType === 2) {
        geom = ringGeom;
        mat = goldMaterial;
      }

      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const scale = 0.6 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);

      const posX = (Math.random() - 0.5) * 26;
      const posY = (Math.random() - 0.5) * 22;
      const posZ = (Math.random() - 0.5) * 16 - 2;
      mesh.position.set(posX, posY, posZ);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      floatingObjectsGroup.add(mesh);

      items.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.015,
        floatSpeed: 0.001 + Math.random() * 0.002,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: posY,
      });
    }

    // --- 4. Glowing 3D Particle Constellation / Dust ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 40;
      particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 30;
      particleScales[p] = Math.random() * 0.15 + 0.05;
    }

    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0xfbcfe8,
      size: 0.25,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 5. Mouse Interactivity ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- 6. Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- 7. Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Update Mouse Light position
      mouseLight.position.x = currentMouseX * 12;
      mouseLight.position.y = currentMouseY * 8;

      // Parallax camera tilt
      camera.position.x = currentMouseX * 1.5;
      camera.position.y = currentMouseY * 1.5;
      camera.lookAt(0, 0, 0);

      // Animate floating objects
      items.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;

        item.mesh.position.y =
          item.initialY + Math.sin(elapsedTime * 1.5 + item.floatOffset) * 0.8;
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.03;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Pulse background lights
      light1.intensity = 2.5 + Math.sin(elapsedTime * 2) * 1.0;
      light2.intensity = 2.5 + Math.cos(elapsedTime * 2.2) * 1.0;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      heartGeometry.dispose();
      crystalGeom.dispose();
      ringGeom.dispose();
      particleGeo.dispose();
      pinkMaterial.dispose();
      goldMaterial.dispose();
      glassCrystalMaterial.dispose();
      particleMat.dispose();
    };
  }, [effectType, theme]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-500 ${
        isAdminOpen ? 'opacity-30 blur-md scale-105' : 'opacity-100'
      }`}
      style={{
        zIndex: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(circle at 50% 20%, #1a0b2e 0%, #0d0614 60%, #05020a 100%)',
      }}
    />
  );
};
