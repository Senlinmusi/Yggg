'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1 }: { FX1: THREE.Vector3 }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const VT1 = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    if (!XR1.current) return
    
    if (FX1.length() > 0) {
      const angle = Math.atan2(FX1.x, FX1.z)
      XR1.current.rotation.y = angle
      XR1.current.position.add(FX1.clone().multiplyScalar(delta * 3))
    }

    VT1.current.lerp(XR1.current.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 0.1)
    camera.lookAt(VT1.current)
  })

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    FX1.length() > 0 ? act?.play() : act?.stop()
  }, [FX1, actions])

  return <primitive ref={XR1} object={scene} />
}

