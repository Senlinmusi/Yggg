'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

function MX1() {
  const { scene } = useGLTF('/yg.glb')
  return <primitive object={scene} />
}

export default function YX1() {
  useEffect(() => {
    document.title = '1'
  }, [])

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0]">
      <div className="w-[360px] h-[640px] bg-white shadow-lg">
        <Canvas>
          <ambientLight intensity={1} />
          <MX1 />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  )
}

