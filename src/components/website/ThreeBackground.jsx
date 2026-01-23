import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = ({ isDark }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(isDark ? 0x000000 : 0xffffff, 0.003);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Abstract Globe
    const geometry = new THREE.IcosahedronGeometry(10, 2);
    const material = new THREE.MeshBasicMaterial({
      color: isDark ? 0x444444 : 0xdddddd,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.2 : 0.4
    });
    const globe = new THREE.Mesh(geometry, material);
    globeRef.current = globe;
    scene.add(globe);

    // Floating Particles
    const particlesGeo = new THREE.BufferGeometry();
    const count = 1000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 60;
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: isDark ? 0xffffff : 0x000000,
      opacity: 0.4,
      transparent: true
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      if (globe) {
        globe.rotation.y += 0.0005;
        globe.rotation.x -= 0.0002;
      }
      particles.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.FogExp2(isDark ? 0x000000 : 0xffffff, 0.003);
    }
  }, [isDark]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default ThreeBackground;
