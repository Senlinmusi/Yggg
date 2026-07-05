'use client'
import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Plane, OrbitControls, useGLTF, Environment, useProgress } from '@react-three/drei'
import dynamic from 'next/dynamic'
import MX1 from './MX1'
import * as THREE from 'three'

// 独立的加载界面组件（白底，黑色加载条）
function LoadingScreen() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="w-40 h-[4px] bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-150 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function YX2() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ x: 0, y: 0 })
  const [JD1, SJ1] = useState(0.5)
  const [JD2, SJ2] = useState(0.5) // 默认 0.5 居中
  const CR1 = useRef<any>(null)
  const CJ1 = useGLTF('/cjjj.glb')
  const CJR1 = useRef<THREE.Group>(null)

  useEffect(() => {
    if (CJ1.scene) {
      CJ1.scene.traverse(c => {
        if (c instanceof THREE.Mesh) {
          if (c.material) {
            c.material.roughness = 0.4
            c.material.metalness = 0.1
          }
        }
      })
    }
  }, [CJ1])

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
  // 修正初始视角为背面（Math.PI），滑动方向与控制条完全同步
  const angleX = Math.PI + (JD2 - 0.5) * Math.PI * 2

  return (
    <div className="w-screen h-screen bg-[#050508] touch-none flex items-center justify-center">
      <title>1</title>
      <div className="relative w-[360px] h-[640px] bg-black shadow-lg overflow-hidden">
        
        {/* dpr 限制防止高分屏卡顿，不开启 shadows 极大提升运行效率 */}
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3, -5], fov: 45 }}>
          {/* 大幅度调亮全局场景环境光照 */}
          <ambientLight intensity={0.7} color="#ffffff" />
          <directionalLight position={[10, 20, 10]} intensity={0.6} color="#ffffff" />
          <Environment preset="city" environmentIntensity={0.5} />
          
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]}>
            <meshToonMaterial color="#111115" />
          </Plane>
          <primitive object={CJ1.scene} ref={CJR1} />
          <MX1 FX1={FX1} controlsRef={CR1} CJR1={CJR1} />
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

        {/* 顶部/全局覆盖的白底黑条加载层 */}
        <LoadingScreen />

        <div className="absolute bottom-10 left-10 flex items-center gap-6 z-50">
          <div 
            className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-full border border-white/10 relative touch-none shrink-0" 
            onPointerDown={CZ1}
            onPointerMove={CZ1} 
            onPointerUp={CZ2}
            onPointerCancel={CZ2}
          >
            <div 
              className="absolute top-1/2 left-1/2 w-10 h-10 bg-white/80 rounded-full shadow-lg" 
              style={{ transform: `translate(calc(-50% + ${XY1.x}px), calc(-50% + ${XY1.y}px))` }} 
            />
          </div>

          <div 
            className="w-48 h-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 relative touch-none"
            onPointerDown={CZ4}
            onPointerMove={CZ4}
          >
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 shadow-lg rounded-full"
              style={{ left: `calc(${JD2 * 100}% - 12px)` }}
            />
          </div>
        </div>

        <div 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-48 bg-white/5 backdrop-blur-md rounded-full border border-white/10 z-50 touch-none"
          onPointerDown={CZ3}
          onPointerMove={CZ3}
        >
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white/80 rounded-full shadow-lg"
            style={{ top: `calc(${JD1 * 100}% - 12px)` }}
          />
        </div>
      </div>
    </div>
  )
}

const YX1 = dynamic(() => Promise.resolve(YX2), { ssr: false })
export default YX1

