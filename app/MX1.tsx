'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function MX1({ FX1 }: { FX1: THREE.Vector3 }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (ref.current && FX1.length() > 0) {
      ref.current.position.add(FX1.multiplyScalar(delta * 2))
      ref.current.lookAt(ref.current.position.clone().add(FX1))
    }
  })

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    if (FX1.length() > 0) act?.play()
    else act?.stop()
  }, [FX1, actions])

  return <primitive ref={ref} object={scene} />
}

