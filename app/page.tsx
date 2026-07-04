'use client'
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Plane, OrbitControls } from '@react-three/drei'
import MX1 from './MX1'
import * as THREE from 'three'

export default function YX1() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ x: 0, y: 0 })
  const [JD1, SJ1] = useState(0.5)
  const CR1 = useRef<any>(null)

  const CZ1 = (e: React.TouchEvent) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.touches[0].clientX - r.left - 40) / 40
    const y = (e.touches[0].clientY - r.top - 40) / 40
    SX2({ x: Math.max(-40, Math.min(40, x * 40)), y: Math.max(-40, Math.min(40, y * 40)) })
    SX1(new THREE.Vector3(x, 0, y))
  }

  const CZ2 = (e: React.TouchEvent) => { 
    e.stopPropagation()
    SX2({ x: 0, y: 0 })
    SX1(new THREE.Vector3(0, 0, 0)) 
  }

  const CZ3 = (e: React.TouchEvent) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    const y = (e.touches[0].clientY - r.top) / r.height
    SJ1(Math.max(0, Math.min(1, y)))
  }

  const angle = Math.PI / 6 + JD1 * (Math.PI / 3)

  return (
    <div className="w-screen h-screen bg-[#f0f0f0] touch-none flex items-center justify-center">
      <title>1</title>
      <div className="relative w-[360px] h-[640px] bg-white shadow-lg overflow-hidden">
        <Canvas shadows camera={{ position: [0, 3, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
          </directionalLight>
          <Environment preset="city" />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]} receiveShadow>
            <meshToonMaterial color="#fff" />
          </Plane>
          <MX1 FX1={FX1} controlsRef={CR1} />
          <OrbitControls 
            ref={CR1} 
            target={[0, 1.5, 0]}
            enablePan={false} 
            enableZoom={false}
            minPolarAngle={angle} 
            maxPolarAngle={angle} 
          />
        </Canvas>

        <div 
          className="absolute bottom-10 left-10 w-20 h-20 bg-black/10 backdrop-blur-md rounded-full border border-white/30 z-50" 
          onTouchStart={CZ1}
          onTouchMove={CZ1} 
          onTouchEnd={CZ2}
        >
          <div className="w-8 h-8 bg-white/70 rounded-full absolute top-6 left-6" style={{ transform: `translate(${XY1.x}px, ${XY1.y}px)` }} />
        </div>

        <div 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-48 bg-black/10 backdrop-blur-md rounded-full border border-white/30 z-50"
          onTouchStart={CZ3}
          onTouchMove={CZ3}
        >
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white/90 rounded-full shadow-lg"
            style={{ top: `calc(${JD1 * 100}% - 12px)` }}
          />
        </div>
      </div>
    </div>
  )
}

