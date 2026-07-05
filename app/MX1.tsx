'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef, CJR1 }: { FX1: THREE.Vector3, controlsRef: any, CJR1: any }) {
  const M1 = useGLTF('/walk.glb')
  const M2 = useGLTF('/wait.glb')
  const { actions: A1 } = useAnimations(M1.animations, M1.scene)
  const { actions: A2 } = useAnimations(M2.animations, M2.scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useEffect(() => {
    [M1.scene, M2.scene].forEach(s => s.traverse(c => {
      if (c instanceof THREE.Mesh) {
        c.material = new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          map: (c.material as any).map,
          roughness: 0.4,
          metalness: 0.1
        })
      }
    }))
  }, [M1, M2])

  useFrame((state, delta) => {
    if (!XR1.current) return
    
    if (FX1.length() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const dir = FX1.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
      const step = dir.multiplyScalar(delta * 4)
      
      const NP1 = XR1.current.position.clone().add(step)
      
      if (Math.abs(NP1.x) < 18 && Math.abs(NP1.z) < 18) {
        let PZ1 = false
        if (CJR1.current) {
          const YC1 = new THREE.Raycaster(XR1.current.position.clone().add(new THREE.Vector3(0, 0.5, 0)), dir.clone().normalize(), 0, 0.6)
          const JZ1 = YC1.intersectObjects(CJR1.current.children, true)
          if (JZ1.length > 0) PZ1 = true
        }

        if (!PZ1) {
          XR1.current.position.add(step)
          camera.position.add(step)
          if (controlsRef.current) {
            controlsRef.current.target.add(step)
          }
        }
      }
      XR1.current.lookAt(XR1.current.position.clone().add(dir))
    }

    if (CJR1.current) {
      const YC2 = new THREE.Raycaster(XR1.current.position.clone().add(new THREE.Vector3(0, 5, 0)), new THREE.Vector3(0, -1, 0))
      const JZ2 = YC2.intersectObjects(CJR1.current.children, true)
      if (JZ2.length > 0) {
        XR1.current.position.y = JZ2[0].point.y
      }
    }

    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  const ZT1 = FX1.length() > 0

  useEffect(() => {
    const actW = A1[Object.keys(A1)[0]]
    const actI = A2[Object.keys(A2)[0]]
    if (ZT1) { 
      actI?.fadeOut(0.2) 
      actW?.reset().fadeIn(0.2).play() 
    } else { 
      actW?.fadeOut(0.2) 
      actI?.reset().fadeIn(0.2).play() 
    }
  }, [ZT1, A1, A2])

  return (
    <group ref={XR1} scale={1.2}>
      <primitive object={M1.scene} visible={ZT1} />
      <primitive object={M2.scene} visible={!ZT1} />
      <pointLight position={[0, 2, 0]} intensity={0.6} distance={12} color="#ffffff" />
    </group>
  )
}

