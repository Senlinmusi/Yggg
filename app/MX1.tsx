'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef }: { FX1: THREE.Vector3, controlsRef: any }) {
  const MX2 = useGLTF('/walk.glb')
  const MX3 = useGLTF('/wait.glb')
  const DH1 = useAnimations(MX2.animations, MX2.scene)
  const DH2 = useAnimations(MX3.animations, MX3.scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    [MX2.scene, MX3.scene].forEach((s) => {
      s.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.material = new THREE.MeshToonMaterial({
            color: (c.material as THREE.MeshStandardMaterial).color,
            map: (c.material as THREE.MeshStandardMaterial).map,
          })
          c.castShadow = true
        }
      })
    })
  }, [MX2, MX3])

  useFrame((state, delta) => {
    if (!XR1.current) return

    const len = FX1.length()
    if (len > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const move = FX1.clone().normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      const step = move.multiplyScalar(delta * 3 * Math.min(len, 1))
      
      XR1.current.position.add(step)
      XR1.current.lookAt(XR1.current.position.clone().add(move))
      
      if (controlsRef.current) {
        controlsRef.current.target.add(step)
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  useEffect(() => {
    const act1 = DH1.actions[Object.keys(DH1.actions)[0]]
    const act2 = DH2.actions[Object.keys(DH2.actions)[0]]
    if (FX1.length() > 0) {
      act2?.stop()
      act1?.play()
    } else {
      act1?.stop()
      act2?.play()
    }
  }, [FX1, DH1, DH2])

  return (
    <group ref={XR1} scale={1.2}>
      <primitive object={FX1.length() > 0 ? MX2.scene : MX3.scene} />
    </group>
  )
}

