'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'

export default function MX1() {
  const { scene } = useGLTF('/yg.glb')
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <primitive object={scene} />
      <OrbitControls />
      <Environment preset="city" />
    </Canvas>
  )
}

