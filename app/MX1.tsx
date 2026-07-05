'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, KZR1, CJR1 }: { FX1: THREE.Vector3, KZR1: any, CJR1: any }) {
  const M1 = useGLTF('/walk.glb')
  const M2 = useGLTF('/wait.glb')
  const { actions: A1 } = useAnimations(M1.animations, M1.scene)
  const { actions: A2 } = useAnimations(M2.animations, M2.scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    [M1.scene, M2.scene].forEach(s => s.traverse(c => {
      if (c instanceof THREE.Mesh) {
        c.material = new THREE.MeshToonMaterial({ 
          color: 0xffffff, 
          map: (c.material as any).map,
          gradientMap: null 
        })
      }
    }))
    if (XR1.current) {
      XR1.current.position.set(0, 0, 0)
    }
  }, [M1, M2])

  useFrame((state, delta) => {
    if (!XR1.current) return
    
    if (FX1.length() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const dir = FX1.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      const step = dir.multiplyScalar(delta * 4)
      
      const MB1 = XR1.current.position.clone().add(step)
      
      if (Math.abs(MB1.x) < 20 && Math.abs(MB1.z) < 20) {
        XR1.current.position.add(step)
        camera.position.add(step)
        if (KZR1.current) {
          KZR1.current.target.add(step)
        }
      }
      XR1.current.lookAt(XR1.current.position.clone().add(dir))
    }

    if (KZR1.current) {
      KZR1.current.update()
    }
  })

  const ZT1 = FX1.length() > 0

  useEffect(() => {
    const HD1 = A1[Object.keys(A1)[0]]
    const HD2 = A2[Object.keys(A2)[0]]
    if (ZT1) { 
      HD2?.fadeOut(0.2) 
      HD1?.reset().fadeIn(0.2).play() 
    } else { 
      HD1?.fadeOut(0.2) 
      HD2?.reset().fadeIn(0.2).play() 
    }
  }, [ZT1, A1, A2])

  return (
    <group ref={XR1} scale={1.2}>
      <primitive object={M1.scene} visible={ZT1} />
      <primitive object={M2.scene} visible={!ZT1} />
      <pointLight position={[0, 2, 0]} intensity={0.6} distance={10} color="#ffffff" />
    </group>
  )
}

