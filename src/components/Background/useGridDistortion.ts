
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { MouseState } from "./types";
import { vertexShader, fragmentShader } from "./shaders";

export const useGridDistortion = (
  containerRef: React.RefObject<HTMLDivElement>,
  grid: number,
  mouse: number,
  strength: number,
  relaxation: number,
  imageSrc: string
) => {
  const imageAspectRef = useRef<number>(1);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    camera.position.z = 2;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    
    textureLoader.load(
      imageSrc,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        imageAspectRef.current = texture.image.width / texture.image.height;
        uniforms.uTexture.value = texture;
        handleResize();
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 512, 512);
          gradient.addColorStop(0, '#1a1a1a');
          gradient.addColorStop(1, '#2a2a2a');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          
          const fallbackTexture = new THREE.CanvasTexture(canvas);
          fallbackTexture.minFilter = THREE.LinearFilter;
          fallbackTexture.magFilter = THREE.LinearFilter;
          uniforms.uTexture.value = fallbackTexture;
          imageAspectRef.current = 1;
          handleResize();
        }
      }
    );

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 0.1 - 0.05;
      data[i * 4 + 1] = Math.random() * 0.1 - 0.05;
      data[i * 4 + 2] = 0;
      data[i * 4 + 3] = 1;
    }

    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    
    const geometry = new THREE.PlaneGeometry(2, 2, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const handleResize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      if (width === 0 || height === 0) return;
      
      renderer.setSize(width, height);
      
      const containerAspect = width / height;
      const imageAspect = imageAspectRef.current;
      
      if (imageAspect > containerAspect) {
        plane.scale.set(1, 1 / imageAspect * containerAspect, 1);
      } else {
        plane.scale.set(imageAspect / containerAspect, 1, 1);
      }

      uniforms.resolution.value.set(width, height, 1, 1);
    };

    const mouseState: MouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    };

    const handleMouseLeave = () => {
      Object.assign(mouseState, {
        vX: 0,
        vY: 0,
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    
    handleResize();

    const animate = () => {
      if (!uniforms.uDataTexture.value || !scene || !renderer) return;
      
      animationIdRef.current = requestAnimationFrame(animate);
      uniforms.time.value += 0.01;

      const data = uniforms.uDataTexture.value.image.data;
      for (let i = 0; i < size * size; i++) {
        data[i * 4] *= relaxation;
        data[i * 4 + 1] *= relaxation;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
          if (distSq < maxDist * maxDist) {
            const index = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            data[index] += strength * mouseState.vX * power;
            data[index + 1] -= strength * mouseState.vY * power;
          }
        }
      }

      uniforms.uDataTexture.value.needsUpdate = true;
      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (uniforms.uTexture.value) {
        uniforms.uTexture.value.dispose();
      }
      
      if (uniforms.uDataTexture.value) {
        uniforms.uDataTexture.value.dispose();
      }
      
      geometry.dispose();
      material.dispose();
      
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);
};
