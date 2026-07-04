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
    const BJ1 = e.currentTarget.getBoundingClientRect()
    const XZ1 = (e.touches[0].clientX - BJ1.left - 40) / 40
    const YZ1 = (e.touches[0].clientY - BJ1.top - 40) / 40
    SX2({ x: Math.max(-40, Math.min(40, XZ1 * 40)), y: Math.max(-40, Math.min(40, YZ1 * 40)) })
    SX1(new THREE.Vector3(XZ1, 0, YZ1))
  }

  const CZ2 = () => { SX2({ x: 0, y: 0 }); SX1(new THREE.Vector3(0, 0, 0)) }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#1a1a1a] touch-none">
      <title>1</title>
      <div className="relative w-full h-full max-w-[360px] max-h-[640px] bg-[#f0f0f0] shadow-lg overflow-hidden">
        <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 2]} intensity={1.5} color="#ff0033" />
          <Environment preset="dawn" intensity={0.1} />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]}>
            <meshStandardMaterial color="#fff" roughness={1} />
          </Plane>
          <MX1 FX1={FX1} CR1={CR1} />
          <OrbitControls ref={CR1} enablePan={false} maxDistance={4} minDistance={2} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>

        <div 
          className="absolute bottom-10 left-10 w-20 h-20 bg-black/10 backdrop-blur-md rounded-full border border-black/10 flex items-center justify-center z-50"
          onTouchMove={CZ1}
          onTouchEnd={CZ2}
        >
          <div className="w-8 h-8 bg-black/80 rounded-full shadow-lg" style={{ transform: `translate(${XY1.x}px, ${XY1.y}px)` }} />
        </div>
      </div>
    </div>
  )
}

