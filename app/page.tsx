'use client'
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Plane, OrbitControls } from '@react-three/drei'
import MX1 from './MX1'
import * as THREE from 'three'

export default function YX1() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ x: 0, y: 0 })
  const [JD1, SD1] = useState(0)
  const CR1 = useRef<any>(null)

  const CZ1 = (e: React.TouchEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const touchX = e.touches[0].clientX - r.left - 40
    const touchY = e.touches[0].clientY - r.top - 40
    const distance = Math.sqrt(touchX * touchX + touchY * touchY)
    const maxLen = 40
    let moveX = touchX
    let moveY = touchY

    if (distance > maxLen) {
      moveX = (touchX / distance) * maxLen
      moveY = (touchY / distance) * maxLen
    }

    SX2({ x: moveX, y: moveY })
    SX1(new THREE.Vector3(moveX / maxLen, 0, moveY / maxLen))
  }

  const CZ2 = () => { 
    SX2({ x: 0, y: 0 })
    SX1(new THREE.Vector3(0, 0, 0)) 
  }

  const CZ3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    SD1(v)
    if (CR1.current) {
      CR1.current.setAzimuthalAngle(v)
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#fafafa] touch-none">
      <title>1</title>
      <div className="relative w-full h-full max-w-[360px] max-h-[640px] bg-white shadow-sm overflow-hidden">
        <Canvas shadows camera={{ position: [0, 5, 5], fov: 40 }}>
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[10, 15, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]} 
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-bias={-0.0005} 
          />
          <Environment preset="dawn" intensity={0.2} />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]} receiveShadow>
            <meshToonMaterial color="#f5f5f5" />
          </Plane>
          <MX1 FX1={FX1} controlsRef={CR1} />
          <OrbitControls 
            ref={CR1} 
            enablePan={false} 
            enableRotate={false}
            maxDistance={12} 
            minDistance={3} 
            maxPolarAngle={Math.PI / 2.2} 
          />
        </Canvas>

        <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between z-50 px-2">
          <div 
            className="w-20 h-20 bg-black/[0.03] backdrop-blur-md rounded-full border border-black/[0.06] flex items-center justify-center select-none"
            onTouchMove={CZ1}
            onTouchEnd={CZ2}
          >
            <div className="w-8 h-8 bg-black/80 rounded-full shadow-sm pointer-events-none" style={{ transform: `translate(${XY1.x}px, ${XY1.y}px)` }} />
          </div>

          <div className="flex flex-col items-center w-44 bg-black/[0.03] backdrop-blur-md py-3 px-4 rounded-2xl border border-black/[0.06]">
            <input 
              type="range" 
              min={-Math.PI} 
              max={Math.PI} 
              step="0.01" 
              value={JD1} 
              onChange={CZ3}
              className="w-full h-[2px] bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

