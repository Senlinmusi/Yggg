'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1 }: { FX1: THREE.Vector3 }) {
  const { scene, animations } = useGLTF('/walk.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    const act = actions[Object.keys(actions)[0]]
    if (FX1.length() > 0) {
      act?.play()
      scene.lookAt(FX1.clone().add(scene.position))
    } else {
      act?.stop()
    }
  }, [FX1, actions, scene])

  return <primitive object={scene} />
}

