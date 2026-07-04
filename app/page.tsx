'use client'
import { Canvas } from '@react-three/fiber'
import { useState, useRef } from 'react'
import MX1 from './MX1'
import * as THREE from 'three'

export default function YX1() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [SD1, SS1] = useState(false)

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0]">
      <div className="relative w-[360px] h-[640px] bg-white shadow-lg overflow-hidden">
        <Canvas camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={0.8} />
          <MX1 FX1={FX1} />
        </Canvas>

        <div 
          className="absolute bottom-10 left-10 w-20 h-20 bg-black/20 rounded-full"
          onTouchStart={() => SS1(true)}
          onTouchMove={(e) => {
            const x = (e.touches[0].clientX - 140) / 40
            const z = (e.touches[0].clientY - 500) / 40
            SX1(new THREE.Vector3(x, 0, z))
          }}
          onTouchEnd={() => { SS1(false); SX1(new THREE.Vector3(0,0,0)) }}
        />
      </div>
    </div>
  )
}

