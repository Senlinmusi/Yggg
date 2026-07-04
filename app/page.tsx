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
  const [JD2, SJ2] = useState(0.5)
  const CR1 = useRef<any>(null)

  const CZ1 = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left - 48) / 48
    const y = (e.clientY - r.top - 48) / 48
    const dist = Math.min(1, Math.sqrt(x * x + y * y))
    const angle = Math.atan2(y, x)
    const finalX = dist * Math.cos(angle)
    const finalY = dist * Math.sin(angle)
    SX2({ x: finalX * 40, y: finalY * 40 })
    SX1(new THREE.Vector3(finalX, 0, finalY))
  }

  const CZ2 = (e: React.PointerEvent) => { 
    e.currentTarget.releasePointerCapture(e.pointerId)
    SX2({ x: 0, y: 0 })
    SX1(new THREE.Vector3(0, 0, 0)) 
  }

  const CZ3 = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons === 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const r = e.currentTarget.getBoundingClientRect()
    const y = (e.clientY - r.top) / r.height
    SJ1(Math.max(0, Math.min(1, y)))
  }

  const CZ4 = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons === 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    SJ2(Math.max(0, Math.min(1, x)))
  }

  const angleY = Math.PI / 6 + JD1 * (Math.PI / 3)
  const angleX = -Math.PI + JD2 * (Math.PI * 2)

  return (
    <div className="w-screen h-screen bg-[#f0f0f0] touch-none flex items-center justify-center">
      <title>1</title>
      <div className="relative w-[360px] h-[640px] bg-white shadow-lg overflow-hidden">
        <Canvas shadows camera={{ position: [0, 3, 5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[20, 20, 20]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]}>
            <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50, 0.1, 100]} />
          </directionalLight>
          <Environment preset="city" />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]} receiveShadow>
            <meshToonMaterial color="#fff" />
          </Plane>
          <MX1 FX1={FX1} controlsRef={CR1} />
          <OrbitControls 
            ref={CR1} 
            target={[0, 1.5, 0]}
            enablePan={false} 
            enableZoom={true}
            minPolarAngle={angleY} 
            maxPolarAngle={angleY} 
            minAzimuthAngle={angleX}
            maxAzimuthAngle={angleX}
          />
        </Canvas>

        <div className="absolute bottom-10 left-10 flex items-center gap-6 z-50">
          <div 
            className="w-24 h-24 bg-black/10 backdrop-blur-md rounded-full border border-white/30 relative touch-none shrink-0" 
            onPointerDown={CZ1}
            onPointerMove={CZ1} 
            onPointerUp={CZ2}
            onPointerCancel={CZ2}
          >
            <div 
              className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full shadow-lg" 
              style={{ transform: `translate(calc(-50% + ${XY1.x}px), calc(-50% + ${XY1.y}px))` }} 
            />
          </div>

          <div 
            className="w-48 h-8 bg-black/10 backdrop-blur-md rounded-full border border-white/30 relative touch-none"
            onPointerDown={CZ4}
            onPointerMove={CZ4}
          >
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white shadow-lg rounded-full"
              style={{ left: `calc(${JD2 * 100}% - 12px)` }}
            />
          </div>
        </div>

        <div 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-48 bg-black/10 backdrop-blur-md rounded-full border border-white/30 z-50 touch-none"
          onPointerDown={CZ3}
          onPointerMove={CZ3}
        >
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg"
            style={{ top: `calc(${JD1 * 100}% - 12px)` }}
          />
        </div>
      </div>
    </div>
  )
}

