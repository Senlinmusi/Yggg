'use client'
import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Plane, OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import dynamic from 'next/dynamic'
import MX1 from './MX1'
import * as THREE from 'three'

function YX2() {
  const [FX1, SX1] = useState(new THREE.Vector3(0, 0, 0))
  const [XY1, SX2] = useState({ x: 0, y: 0 })
  const [JD1, SJ1] = useState(0.5)
  const [JD2, SJ2] = useState(0.5)
  const [SD1, SSD1] = useState(false)
  const [JS1, SJS1] = useState('00:00')
  const [MJ1, SS1] = useState(0) 
  const [FG1, SFG1] = useState(false)
  const [CD1, SCD1] = useState(0)
  
  const [FT1, SFT1] = useState(0)
  const [FF1, SFF1] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [monsterDisabled, setMonsterDisabled] = useState(false)
  const debugKeys = useRef<string[]>([])

  const { active: JZ_ZT, progress: JZ_JD } = useProgress()

  const KZR1 = useRef<any>(null)
  const CJ1 = useGLTF('/cjjj.glb')
  const CJR1 = useRef<THREE.Group>(null)

  const JC1 = (key: string) => {
    debugKeys.current.push(key)
    if (debugKeys.current.length > 6) {
      debugKeys.current.shift()
    }
    if (debugKeys.current.join('') === 'MMKKFF') {
      setMonsterDisabled(true)
    }
  }

  useEffect(() => {
    document.title = '1'
    if (CJ1.scene) {
      const box = new THREE.Box3().setFromObject(CJ1.scene)
      const center = new THREE.Vector3()
      box.getCenter(center)
      CJ1.scene.position.set(-center.x, 0, -center.z)

      CJ1.scene.traverse(c => {
        if (c instanceof THREE.Mesh) {
          if (c.material) {
            c.material.roughness = 0.6
            c.material.metalness = 0.1
            if ((c.material as any).map) {
              ;(c.material as any).map.minFilter = THREE.NearestFilter
              ;(c.material as any).map.magFilter = THREE.NearestFilter
            }
          }
        }
      })
    }
  }, [CJ1])

  useEffect(() => {
    if (isGameOver) return
    let m = 0
    let s = 0
    const IV1 = setInterval(() => {
      s++
      if (s >= 60) {
        s = 0
        m++
      }
      SJS1(`${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`)
    }, 1000)
    return () => clearInterval(IV1)
  }, [isGameOver])

  useEffect(() => {
    if (CD1 > 0) {
      const t = setTimeout(() => SCD1(CD1 - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [CD1])

  useEffect(() => {
    if (FT1 > 0) {
      const t = setTimeout(() => {
        const next = FT1 - 1
        SFT1(next)
        if (next === 0) SFF1(false)
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [FT1])

  const CZ1 = (e: React.PointerEvent) => {
    if (isGameOver) return
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
    SJ1(Math.max(0, Math.min(1, y)) || 0.001)
  }

  const CZ4 = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons === 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    SJ2(Math.max(0, Math.min(1, x)) || 0.001)
  }

  const CZ5 = (e: React.PointerEvent) => {
    e.preventDefault()
    if (isGameOver) return
    JC1('K')
    SSD1(p => !p)
  }

  const CZ6 = (e: React.PointerEvent) => {
    e.preventDefault()
    if (isGameOver) return
    JC1('M')
    if (CD1 > 0) return
    SFG1(true)
    SCD1(60)
    setTimeout(() => {
      SFG1(false)
    }, 15000)
  }

  const CZ7 = (e: React.PointerEvent) => {
    e.preventDefault()
    if (isGameOver) return
    JC1('F')
    if (FT1 > 0) return
    SFF1(true)
    SFT1(15)
  }

  const angleY = Math.PI / 6 + JD1 * (Math.PI / 3)
  const angleX = -(JD2 * Math.PI * 2)

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0]">
      <div className="relative w-full h-full max-w-[360px] max-h-[640px] aspect-[9/16] bg-[#050508] shadow-lg overflow-hidden cursor-pointer">
        {JZ_ZT && (
          <div className="absolute inset-0 bg-[#050508] z-[200] flex flex-col items-center justify-center select-none">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-white text-xs font-sans tracking-[0.2em] font-light uppercase opacity-70">LOADING</h2>
              <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 h-full bg-white/60 transition-all duration-300 ease-out" style={{ width: `${JZ_JD}%` }} />
              </div>
              <span className="text-[10px] text-white/30 font-mono tracking-wider">{Math.round(JZ_JD)}%</span>
            </div>
          </div>
        )}

        <div className="absolute top-6 left-6 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white font-mono text-xs tracking-wider z-50 select-none">
          {JS1}
        </div>

        <div className="absolute top-6 right-6 w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center text-white z-50 select-none shadow-lg transition-all duration-300">
          <span className="text-sm leading-none font-mono">{MJ1}</span>
          <span className="text-[9px] text-white/30 font-mono mt-0.5 scale-90">/5</span>
        </div>

        <Canvas 
          camera={{ position: [0, 3.8, -5.2], fov: 45 }}
          gl={{ antialias: false, powerPreference: 'high-performance', depth: true }}
          dpr={1.0}
        >
          <ambientLight intensity={0.12} color="#111125" />
          <directionalLight position={[10, 20, 10]} intensity={0.25} color="#556699" />
          <hemisphereLight args={['#0a0a20', '#020208', 0.3]} />
          <Plane rotation={[-Math.PI / 2, 0, 0]} args={[350, 350]}>
            <meshToonMaterial color="#030305" />
          </Plane>
          <primitive object={CJ1.scene} ref={CJR1} />
          <MX1 
            FX1={FX1} 
            KZR1={KZR1} 
            CJR1={CJR1} 
            SD1={SD1} 
            SS1={SS1} 
            FG1={FG1} 
            FF1={FF1}
            monsterDisabled={monsterDisabled}
            onGameOver={() => setIsGameOver(true)}
            isGameOver={isGameOver}
          />
          <OrbitControls 
            ref={KZR1} 
            target={[0, 1.8, 0]}
            enablePan={false} 
            enableZoom={true}
            minPolarAngle={angleY} 
            maxPolarAngle={angleY} 
            minAzimuthAngle={angleX}
            maxAzimuthAngle={angleX}
          />
        </Canvas>

        <div className="absolute bottom-6 left-8 flex items-end gap-5 z-50">
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

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <div 
                className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center text-white text-xs font-sans font-medium select-none cursor-pointer active:scale-95 transition-transform shadow-lg shrink-0"
                onPointerDown={CZ5}
                style={{ backgroundColor: SD1 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.05)' }}
              >
                K
              </div>
              <div 
                className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center text-white text-xs font-sans font-medium select-none cursor-pointer active:scale-95 transition-transform shadow-lg shrink-0"
                onPointerDown={CZ6}
                style={{ 
                  backgroundColor: FG1 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.05)',
                  opacity: CD1 > 0 ? 0.6 : 1
                }}
              >
                {CD1 > 0 ? `${CD1}s` : 'M'}
              </div>
              <div 
                className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center justify-center text-white text-xs font-sans font-medium select-none cursor-pointer active:scale-95 transition-transform shadow-lg shrink-0"
                onPointerDown={CZ7}
                style={{ 
                  backgroundColor: FF1 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.05)',
                  opacity: FT1 > 0 ? 0.6 : 1
                }}
              >
                {FT1 > 0 ? `${FT1}s` : 'F'}
              </div>
            </div>
            <div 
              className="w-40 h-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 relative touch-none"
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

        {isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center select-none">
            <h1 className="text-white text-3xl font-mono font-bold tracking-widest drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Game Over
            </h1>
          </div>
        )}
      </div>
    </div>
  )
}

const YX1 = dynamic(() => Promise.resolve(YX2), { ssr: false })
export default YX1

