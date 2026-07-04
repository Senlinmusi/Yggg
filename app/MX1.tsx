'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, CR1 }: { FX1: THREE.Vector3, CR1: any }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()

  scene.traverse((DX1) => {
    if (DX1 instanceof THREE.Mesh) {
      DX1.material = new THREE.MeshToonMaterial({
        color: (DX1.material as THREE.MeshStandardMaterial).color,
        map: (DX1.material as THREE.MeshStandardMaterial).map
      })
    }
  })

  useFrame((ZT1, SJ1) => {
    if (!XR1.current) return

    if (FX1.length() > 0) {
      const JD1 = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const YD1 = FX1.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), JD1)
      XR1.current.position.add(YD1.multiplyScalar(SJ1 * 3))
      XR1.current.lookAt(XR1.current.position.clone().add(YD1))
    }

    if (CR1.current) {
      CR1.current.target.copy(XR1.current.position).setY(1.2)
    }
  })

  useEffect(() => {
    const DZ1 = actions[Object.keys(actions)[0]]
    FX1.length() > 0 ? DZ1?.play() : DZ1?.stop()
  }, [FX1, actions])

  return <primitive ref={XR1} object={scene} scale={1.2} />
}

