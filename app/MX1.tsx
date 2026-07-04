'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef }: { FX1: THREE.Vector3, controlsRef: any }) {
  const M1 = useGLTF('/walk.glb')
  const M2 = useGLTF('/wait.glb')
  const { actions: A1 } = useAnimations(M1.animations, M1.scene)
  const { actions: A2 } = useAnimations(M2.animations, M2.scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    [M1.scene, M2.scene].forEach(s => s.traverse(c => {
      if (c instanceof THREE.Mesh) {
        c.material = new THREE.MeshToonMaterial({ color: 0xffffff, map: (c.material as any).map })
        c.castShadow = true
      }
    }))
  }, [M1, M2])

  useFrame((state, delta) => {
    if (!XR1.current) return
    
    if (FX1.length() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const dir = FX1.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      const step = dir.multiplyScalar(delta * 3)
      
      XR1.current.position.add(step)
      XR1.current.lookAt(XR1.current.position.clone().add(dir))
      
      camera.position.add(step)
      if (controlsRef.current) {
        controlsRef.current.target.add(step)
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  useEffect(() => {
    const actW = A1[Object.keys(A1)[0]]
    const actI = A2[Object.keys(A2)[0]]
    if (FX1.length() > 0) { 
      actI?.stop() 
      actW?.play() 
    } else { 
      actW?.stop() 
      actI?.play() 
    }
  }, [FX1, A1, A2])

  return (
    <group ref={XR1} scale={1.2}>
      <primitive object={M1.scene} visible={FX1.length() > 0} />
      <primitive object={M2.scene} visible={FX1.length() === 0} />
    </group>
  )
}

