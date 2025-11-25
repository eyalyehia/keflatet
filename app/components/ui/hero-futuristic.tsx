'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import * as THREE from 'three';

// Define the component as a simple variant first - WebGPU might not be available everywhere
const Scene = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const material = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create scanning effect
          float scan = sin((uv.y + uTime * 0.5) * 20.0) * 0.04;
          
          // Create grid pattern
          vec2 grid = abs(fract(uv * 10.0) - 0.5);
          float gridPattern = smoothstep(0.0, 0.05, min(grid.x, grid.y));
          
          // Add some noise
          float noise = random(uv + uTime * 0.1) * 0.1;
          
          // Create glow effect based on mouse position
          float dist = distance(uv, uPointer * 0.5 + 0.5);
          float glow = 1.0 - smoothstep(0.0, 0.3, dist);
          
          // Combine effects
          vec3 color = vec3(0.2, 0.8, 1.0) * gridPattern;
          color += vec3(1.0, 0.3, 0.0) * glow * 0.5;
          color += vec3(1.0, 0.0, 0.0) * scan;
          color += noise;
          
          gl_FragColor = vec4(color, 0.8);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true
    });
    
    return material;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (material && 'uniforms' in material) {
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uPointer.value = pointer;
    }
    
    if (meshRef.current && material && 'opacity' in material) {
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        visible ? 0.8 : 0,
        0.07
      );
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[4, 4]} />
    </mesh>
  );
};

export const HeroFuturistic = () => {
  const titleImageSrc = '/title.png';
  const titleImageAlt = 'כיף לתת - עם כל נתינה הלב מתמלא';
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    // Show image after a short delay
    const timeout = setTimeout(() => setImageVisible(true), 800);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="overflow-hidden relative w-full h-screen bg-black cyber-grid">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Scene />
        </Canvas>
      </div>

      {/* Image Content */}
      <div className="flex relative z-10 flex-col justify-center items-center px-10 space-y-4 h-full text-center">
        {/* Hearts Section */}
        <div className="flex justify-center items-center mb-2 space-x-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="text-3xl text-pink-500 animate-float"
              style={{
                animationDelay: `${i * 0.2}s`,
                textShadow: '0 0 15px rgba(255, 0, 85, 0.7)'
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Title Image */}
        <div className="relative">
          <div
            className={`transition-all duration-1000 ${
              imageVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-10'
            }`}
            style={{ 
              animationDelay: '0.5s'
            }}
          >
            <div className="w-[200px] sm:w-[250px] md:w-[300px] transition-all duration-300">
              <Image
                src={titleImageSrc}
                alt={titleImageAlt}
                width={300}
                height={100}
                className="object-contain transition-all duration-500 ease-in-out cursor-pointer hover:scale-105 hover:rotate-1 active:scale-95"
                style={{
                  animation: 'glitch 3s ease-in-out infinite alternate'
                }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-2">
          <button 
            className="px-8 py-3 font-bold font-staff text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg transition-all duration-300 transform hover:from-pink-600 hover:to-purple-700 hover:scale-105 active:scale-95"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            התחל עכשיו
          </button>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 animate-bounce transform -translate-x-1/2 text-white/70"
          style={{ animationDelay: '2.5s' }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium font-staff">גלול למטה</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="animate-pulse"
            >
              <path 
                d="M12 5V19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M7 14L12 19L17 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFuturistic;