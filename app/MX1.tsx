'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef }: { FX1: THREE.Vector3, controlsRef: any }) {
  const walkGLTF = useGLTF('/walk.glb')
  const waitGLTF = useGLTF('/wait.glb')
  
  const walkAnim = walkGLTF.animations[0]
  const waitAnim = waitGLTF.animations[0]
  
  if (walkAnim) walkAnim.name = 'walk'
  if (waitAnim) waitAnim.name = 'wait'

  const { actions } = useAnimations([walkAnim, waitAnim].filter(Boolean), walkGLTF.scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const currentAction = useRef<any>(null)

  useEffect(() => {
    walkGLTF.scene.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.material = new THREE.MeshToonMaterial({
          color: (c.material as THREE.MeshStandardMaterial).color,
          map: (c.material as THREE.MeshStandardMaterial).map,
        })
        c.castShadow = true
        c.receiveShadow = true
      }
    })
  }, [walkGLTF.scene])

  useFrame((state, delta) => {
    if (!XR1.current) return

    if (FX1.length() > 0) {
      const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir)
      camDir.y = 0 
      camDir.normalize()

      const camRight = new THREE.Vector3()
      camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize().negate()

      const move = new THREE.Vector3()
      move.addScaledVector(camDir, -FX1.z) 
      move.addScaledVector(camRight, FX1.x) 
      move.y = 0

      if (move.length() > 0) {
        move.normalize()
        const step = move.clone().multiplyScalar(delta * 2.5)
        XR1.current.position.add(step)

        const targetRotation = Math.atan2(move.x, move.z)
        XR1.current.rotation.y = THREE.MathUtils.lerp(XR1.current.rotation.y, targetRotation, delta * 15)
      }
    }

    if (controlsRef.current) {
      controlsRef.current.target.set(
        XR1.current.position.x,
        XR1.current.position.y + 1.2, 
        XR1.current.position.z
      )
      controlsRef.current.update()
    }
  })

  useEffect(() => {
    const nextAnimName = FX1.length() > 0 ? 'walk' : 'wait'
    const nextAction = actions[nextAnimName]

    if (nextAction && currentAction.current !== nextAction) {
      if (nextAnimName === 'walk') {
        nextAction.setLoop(THREE.LoopRepeat, Infinity)
      }
      nextAction.reset().fadeIn(0.2).play()
      if (currentAction.current) {
        currentAction.current.fadeOut(0.2)
      }
      currentAction.current = nextAction
    }
  }, [FX1, actions])

  return <primitive ref={XR1} object={walkGLTF.scene} scale={1.2} />
}

useGLTF.preload('/walk.glb')
useGLTF.preload('/wait.glb')

