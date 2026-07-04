'use client'
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Plane, OrbitControls } from '@react-three/drei'
import MX1 from './MX1'
import * as THREE from 'three'

export default function YX1() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ x: 0, y: 0 })
  const CR1 = useRef<any>(null)

  const CZ1 = (e: React.TouchEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.touches[0].clientX - r.left - 40) / 40
    const y = (e.touches[0].clientY - r.top - 40) / 40
    SX2({ x: Math.max(-40, Math.min(40, x * 40)), y: Math.max(-40, Math.min(40, y * 40)) })
    SX1(new THREE.Vector3(x, 0, y))
  }

  const CZ2 = () => { SX2({ x: 0, y: 0 }); SX1(new THREE.Vector3(0, 0, 0)) }

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
          <OrbitControls ref={CR1} enablePan={false} minDistance={2} maxDistance={8} />
        </Canvas>

        <div className="absolute bottom-10 left-10 w-20 h-20 bg-black/10 backdrop-blur-md rounded-full border border-white/30 z-50" onTouchMove={CZ1} onTouchEnd={CZ2}>
          <div className="w-8 h-8 bg-white/70 rounded-full absolute top-6 left-6" style={{ transform: `translate(${XY1.x}px, ${XY1.y}px)` }} />
        </div>
      </div>
    </div>
  )
}

