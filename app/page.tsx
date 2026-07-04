'use client'
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Plane, OrbitControls } from '@react-three/drei'
import MX1 from './MX1'
import * as THREE from 'three'

export default function YX1() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ x: 0, y: 0 })
  // 创建 OrbitControls 的 ref
  const controlsRef = useRef<any>(null)

  const CZ1 = (e: React.TouchEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.touches[0].clientX - r.left - 40) / 40
    const y = (e.touches[0].clientY - r.top - 40) / 40
    SX2({ x: Math.max(-40, Math.min(40, x * 40)), y: Math.max(-40, Math.min(40, y * 40)) })
    SX1(new THREE.Vector3(x, 0, y))
  }

  const CZ2 = () => { SX2({ x: 0, y: 0 }); SX1(new THREE.Vector3(0, 0, 0)) }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0] touch-none">
      <div className="relative w-full h-full max-w-[360px] max-h-[640px] bg-white shadow-lg overflow-hidden">
        {/* 初始化相机位置为后上方，更像原神 */}
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          {/* 更换环境预设并大幅降低强度，解决油腻反光 */}
          <Environment preset="dawn" intensity={0.2} />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]}>
            <meshStandardMaterial color="#f0f0f0" roughness={1} />
          </Plane>
          
          {/* 传入 controlsRef */}
          <MX1 FX1={FX1} controlsRef={controlsRef} />
          
          {/* 配置 OrbitControls */}
          <OrbitControls 
            ref={controlsRef} 
            enablePan={false} 
            maxDistance={8} 
            minDistance={2}
            // 允许一定范围的垂直旋转
            maxPolarAngle={Math.PI / 2.2} 
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>

        <div 
          className="absolute bottom-10 left-10 w-20 h-20 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center z-50 border border-white/20"
          onTouchMove={CZ1}
          onTouchEnd={CZ2}
        >
          <div className="w-8 h-8 bg-white/60 rounded-full shadow-inner" style={{ transform: `translate(${XY1.x}px, ${XY1.y}px)` }} />
        </div>
      </div>
    </div>
  )
}

