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

  useFrame((state, delta) => {
    if (!XR1.current) return
    if (FX1.length() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const move = FX1.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      XR1.current.position.add(move.multiplyScalar(delta * 2))
      XR1.current.lookAt(XR1.current.position.clone().add(move))
      camera.position.x = XR1.current.position.x + 5 * Math.sin(angle)
      camera.position.z = XR1.current.position.z + 5 * Math.cos(angle)
      camera.lookAt(XR1.current.position)
    }
  })

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    FX1.length() > 0 ? act?.play() : act?.stop()
  }, [FX1, actions])

  return <primitive ref={XR1} object={scene} />
}

