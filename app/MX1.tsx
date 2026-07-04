'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1 }: { FX1: THREE.Vector3 }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)
  const XR1 = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!XR1.current) return
    if (FX1.length() > 0) {
      XR1.current.position.add(FX1.multiplyScalar(delta * 2))
      XR1.current.lookAt(XR1.current.position.clone().add(FX1))
      state.camera.position.lerp(XR1.current.position.clone().add(new THREE.Vector3(0, 2, 5)), 0.1)
      state.camera.lookAt(XR1.current.position)
    }
  })

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    FX1.length() > 0 ? act?.play() : act?.stop()
  }, [FX1, actions])

  return <primitive ref={XR1} object={scene} />
}

