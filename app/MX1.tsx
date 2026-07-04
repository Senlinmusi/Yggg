'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef }: { FX1: THREE.Vector3, controlsRef: any }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)
  const XR1 = useRef<THREE.Group>(null)
  const VT1 = useRef(new THREE.Vector3(0, 0, 0))

  // 将材质替换为卡通材质，消除油腻感
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshToonMaterial({
        color: (child.material as THREE.MeshStandardMaterial).color,
        map: (child.material as THREE.MeshStandardMaterial).map,
      })
    }
  })

  useFrame((state, delta) => {
    if (!XR1.current) return
    
    // 1. 角色移动逻辑
    if (FX1.length() > 0) {
      const angle = Math.atan2(FX1.x, FX1.z)
      XR1.current.rotation.y = angle
      XR1.current.position.add(FX1.clone().multiplyScalar(delta * 3))
    }

    // 2. 平滑跟随逻辑：让 OrbitControls 的 target 平滑移动到角色位置
    if (controlsRef.current) {
      VT1.current.lerp(XR1.current.position, 0.1) // 0.1 为平滑系数
      controlsRef.current.target.copy(VT1.current)
      controlsRef.current.update()
    }
  })

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    FX1.length() > 0 ? act?.play() : act?.stop()
  }, [FX1, actions])

  return <primitive ref={XR1} object={scene} scale={1.5} />
}

