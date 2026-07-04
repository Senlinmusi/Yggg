'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef }: { FX1: THREE.Vector3, controlsRef: any }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const VT1 = useRef(new THREE.Vector3(0, 0, 0))

  scene.traverse((c) => {
    if (c instanceof THREE.Mesh) {
      c.material = new THREE.MeshToonMaterial({ color: (c.material as THREE.MeshStandardMaterial).color })
    }
  })

  useFrame((state, delta) => {
    if (!XR1.current) return

    if (FX1.length() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const move = FX1.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      XR1.current.position.add(move.multiplyScalar(delta * 3))
      XR1.current.lookAt(XR1.current.position.clone().add(move))
    }

    if (controlsRef.current) {
      VT1.current.lerp(XR1.current.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 0.1)
      controlsRef.current.target.copy(VT1.current)
    }
  })

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    FX1.length() > 0 ? act?.play() : act?.stop()
  }, [FX1, actions])

  return <primitive ref={XR1} object={scene} scale={1.2} />
}

