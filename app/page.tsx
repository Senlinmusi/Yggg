'use client'
import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Plane, OrbitControls, useGLTF } from '@react-three/drei'
import dynamic from 'next/dynamic'
import MX1 from './MX1'
import * as THREE from 'three'

function YX2() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ ZB7: 0, ZB8: 0 })
  const [JD1, SJ1] = useState(0.5)
  const [JD2, SJ2] = useState(0.5)
  const [SD1, SSD1] = useState(false)
  const [JS1, SJS1] = useState('00:00')
  const [SL2, SZ1] = useState(0) 
  const KZR1 = useRef<any>(null)
  const CJ1 = useGLTF('/cjjj.glb')
  const CJR1 = useRef<THREE.Group>(null)

  useEffect(() => {
    document.title = '1'
    if (CJ1.scene) {
      const HX1 = new THREE.Box3().setFromObject(CJ1.scene)
      const ZX1 = new THREE.Vector3()
      HX1.getCenter(ZX1)
      CJ1.scene.position.set(-ZX1.x, 0, -ZX1.z)

      CJ1.scene.traverse(DX4 => {
        if (DX4 instanceof THREE.Mesh) {
          if (DX4.material) {
            DX4.material.roughness = 0.6
            DX4.material.metalness = 0.1
          }
        }
      })
    }
  }, [CJ1])

  useEffect(() => {
    let FZ1 = 0
    let MZ1 = 0
    const DS1 = setInterval(() => {
      MZ1++
      if (MZ1 >= 60) {
        MZ1 = 0
        FZ1++
      }
      SJS1(`${FZ1 < 10 ? '0' + FZ1 : FZ1}:${MZ1 < 10 ? '0' + MZ1 : MZ1}`)
    }, 1000)
    return () => clearInterval(DS1)
  }, [])

  const CZ1 = (SJ3: React.PointerEvent) => {
    SJ3.currentTarget.setPointerCapture(SJ3.pointerId)
    const BJ1 = SJ3.currentTarget.getBoundingClientRect()
    const ZB7 = (SJ3.clientX - BJ1.left - 48) / 48
    const ZB8 = (SJ3.clientY - BJ1.top - 48) / 48
    const JL2 = Math.min(1, Math.sqrt(ZB7 * ZB7 + ZB8 * ZB8))
    const JD4 = Math.atan2(ZB8, ZB7)
    const ZB9 = JL2 * Math.cos(JD4)
    const ZB10 = JL2 * Math.sin(JD4)
    SX2({ ZB7: ZB9 * 40, ZB8: ZB10 * 40 })
    SX1(new THREE.Vector3(ZB9, 0, ZB10))
  }

  const CZ2 = (SJ3: React.PointerEvent) => { 
    SJ3.currentTarget.releasePointerCapture(SJ3.pointerId)
    SX2({ ZB7: 0, ZB8: 0 })
    SX1(new THREE.Vector3(0, 0, 0)) 
  }

  const CZ3 = (SJ3: React.PointerEvent) => {
    if (SJ3.pointerType === 'mouse' && SJ3.buttons === 0) return
    SJ3.currentTarget.setPointerCapture(SJ3.pointerId)
    const BJ1 = SJ3.currentTarget.getBoundingClientRect()
    const ZB8 = (SJ3.clientY - BJ1.top) / BJ1.height
    SJ1(Math.max(0, Math.min(1, ZB8)) || 0.001)
  }

  const CZ4 = (SJ3: React.PointerEvent) => {
    if (SJ3.pointerType === 'mouse' && SJ3.buttons === 0) return
    SJ3.currentTarget.setPointerCapture(SJ3.pointerId)
    const BJ1 = SJ3.currentTarget.getBoundingClientRect()
    const ZB7 = (SJ3.clientX - BJ1.left) / BJ1.width
    SJ2(Math.max(0, Math.min(1, ZB7)) || 0.001)
  }

  const CZ5 = (SJ3: React.PointerEvent) => {
    SJ3.preventDefault()
    SSD1(ZT3 => !ZT3)
  }

  const JD5 = Math.PI / 6 + JD1 * (Math.PI / 3)
  const JD6 = -(JD2 * Math.PI * 2)

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0]">
      <div className="relative w-full h-full max-w-[360px] max-h-[640px] aspect-[9/16] bg-[#050508] shadow-lg overflow-hidden cursor-pointer">
        <div className="absolute top-6 left-6 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white font-mono text-xs tracking-wider z-50 select-none">
          {JS1}
        </div>

        <div className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center text-white z-50 select-none shadow-lg transition-all duration-300">
          <span className="text-sm font-bold leading-none font-mono">{SL2}</span>
          <span className="text-[9px] text-white/30 font-mono mt-0.5 scale-90">/5</span>
        </div>

        <Canvas 
          camera={{ position: [0, 3.8, -5.2], fov: 45 }}
          gl={{ antialias: false, powerPreference: 'high-performance', depth: true }}
          dpr={1}
        >
          <ambientLight intensity={0.12} color="#111125" />
          <directionalLight position={[10, 20, 10]} intensity={0.25} color="#556699" />
          <hemisphereLight args={['#0a0a20', '#020208', 0.3]} />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[350, 350]}>
            <meshToonMaterial color="#030305" />
          </Plane>
          <primitive object={CJ1.scene} ref={CJR1} />
          <MX1 FX1={FX1} KZR1={KZR1} CJR1={CJR1} SD1={SD1} SZ1={SZ1} />
          <OrbitControls 
            ref={KZR1} 
            target={[0, 1.3, 0]}
            enablePan={false} 
            enableZoom={true}
            minPolarAngle={JD5} 
            maxPolarAngle={JD5} 
            minAzimuthAngle={JD6}
            maxAzimuthAngle={JD6}
          />
        </Canvas>

        <div className="absolute bottom-6 left-8 flex items-end gap-6 z-50">
          <div 
            className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-full border border-white/10 relative touch-none shrink-0" 
            onPointerDown={CZ1}
            onPointerMove={CZ1} 
            onPointerUp={CZ2}
            onPointerCancel={CZ2}
          >
            <div 
              className="absolute top-1/2 left-1/2 w-10 h-10 bg-white/80 rounded-full shadow-lg" 
              style={{ transform: `translate(calc(-50% + ${XY1.ZB7}px), calc(-50% + ${XY1.ZB8}px))` }} 
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white text-lg font-sans font-medium select-none cursor-pointer active:scale-95 transition-transform shadow-lg"
              onPointerDown={CZ5}
              style={{ backgroundColor: SD1 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.05)' }}
            >
              K
            </div>
            <div 
              className="w-44 h-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 relative touch-none"
              onPointerDown={CZ4}
              onPointerMove={CZ4}
            >
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 shadow-lg rounded-full"
                style={{ left: `calc(${JD2 * 100}% - 12px)` }}
              />
            </div>
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

