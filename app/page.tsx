'use client'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { OrbitControls, Environment, Plane } from '@react-three/drei'
import MX1 from './MX1'
import * as THREE from 'three'

export default function YX1() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black overflow-hidden touch-none">
      <div className="relative w-[360px] h-[640px] bg-white shadow-lg overflow-hidden">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <Environment preset="city" />
          {/* 简单的地板 */}
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]}>
            <meshStandardMaterial color="#888" />
          </Plane>
          <MX1 FX1={FX1} />
          <OrbitControls makeDefault />
        </Canvas>

        {/* 摇杆：添加 touch-action: none 防止页面滑动 */}
        <div 
          className="absolute bottom-10 left-10 w-24 h-24 bg-black/50 rounded-full z-10 touch-none"
          onTouchMove={(e) => {
            e.preventDefault()
            const x = (e.touches[0].clientX - 160) / 40
            const z = (e.touches[0].clientY - 520) / 40
            SX1(new THREE.Vector3(x, 0, z))
          }}
          onTouchEnd={() => SX1(new THREE.Vector3(0,0,0))}
        />
      </div>
    </div>
  )
}

