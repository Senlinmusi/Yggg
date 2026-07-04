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
    // 算相对圆心的绝对偏移像素
    const touchX = e.touches[0].clientX - r.left - 40
    const touchY = e.touches[0].clientY - r.top - 40
    
    // 限制最大拖拽半径为 40 像素
    const distance = Math.sqrt(touchX * touchX + touchY * touchY)
    const maxLen = 40
    
    let moveX = touchX
    let moveY = touchY

    if (distance > maxLen) {
      moveX = (touchX / distance) * maxLen
      moveY = (touchY / distance) * maxLen
    }

    SX2({ x: moveX, y: moveY })
    
    // 传给 3D 的输入做归一化处理（数值在 0 到 1 之间），解决斜向走太快、拉太远走太快的问题
    SX1(new THREE.Vector3(moveX / maxLen, 0, moveY / maxLen))
  }

  const CZ2 = () => { 
    SX2({ x: 0, y: 0 })
    SX1(new THREE.Vector3(0, 0, 0)) 
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0] touch-none">
      <title>1</title>
      <div className="relative w-full h-full max-w-[360px] max-h-[640px] bg-white shadow-lg overflow-hidden">
        <Canvas shadows camera={{ position: [0, 4, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          
          {/* 优化灯光的阴影相机配置（Shadow Camera），将其范围放大，防止走几步影子被边缘裁剪 */}
          <directionalLight 
            position={[10, 15, 10]} 
            intensity={1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]} // 提高分辨率让边缘更清晰
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-bias={-0.0005} // 防止阴影悬浮或出现奇怪网格
          />
          
          <Environment preset="dawn" intensity={0.2} />
          
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]} receiveShadow>
            <meshToonMaterial color="#eaeaea" />
          </Plane>
          
          <MX1 FX1={FX1} controlsRef={CR1} />
          
          {/* 移除 target 初始设定，交给 MX1 内部去动态追踪。关闭 enablePan 集中控制权 */}
          <OrbitControls 
            ref={CR1} 
            enablePan={false} 
            maxDistance={8} 
            minDistance={3} 
            maxPolarAngle={Math.PI / 2.1} // 稍微限制无法贴地反仰
          />
        </Canvas>

        {/* 摇杆 UI */}
        <div 
          className="absolute bottom-10 left-10 w-20 h-20 bg-black/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center z-50 select-none"
          onTouchMove={CZ1}
          onTouchEnd={CZ2}
        >
          <div className="w-8 h-8 bg-white/80 rounded-full shadow-lg pointer-events-none" style={{ transform: `translate(${XY1.x}px, ${XY1.y}px)` }} />
        </div>
      </div>
    </div>
  )
}

