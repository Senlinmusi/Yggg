'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, controlsRef }: { FX1: THREE.Vector3, controlsRef: any }) {
  // 同时加载走路和待机动画
  const walkGLTF = useGLTF('/walk.glb')
  const waitGLTF = useGLTF('/wait.glb')
  
  // 提取待机动画并放入当前场景的动画列表中
  const walkAnim = walkGLTF.animations[0]
  const waitAnim = waitGLTF.animations[0]
  
  // 命名区分动画
  if (walkAnim) walkAnim.name = 'walk'
  if (waitAnim) waitAnim.name = 'wait'

  const { actions } = useAnimations([walkAnim, waitAnim].filter(Boolean), walkGLTF.scene)
  const XR1 = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // 记录上一次播放的动画，用于平滑过渡 (Fade)
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
      // 1. 修复视角移动判定：基于相机看向角色的水平面投影方向
      const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir)
      camDir.y = 0 // 只要水平方向
      camDir.normalize()

      // 算出相机的右方向
      const camRight = new THREE.Vector3()
      camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize().negate()

      // 将摇杆的输入(FX1)映射到相机的空间坐标系
      const move = new THREE.Vector3()
      move.addScaledVector(camDir, -FX1.z) // 摇杆 Y (在 Three 中对应 Z)
      move.addScaledVector(camRight, FX1.x) // 摇杆 X
      move.y = 0

      if (move.length() > 0) {
        move.normalize()
        const speed = 2.5 // 控制行走速度
        const step = move.clone().multiplyScalar(delta * speed)
        
        // 移动角色
        XR1.current.position.add(step)

        // 让角色平滑转向（防止瞬间僵硬转身）
        const targetRotation = Math.atan2(move.x, move.z)
        // 每次转动一点点，15 是转向速度
        XR1.current.rotation.y = THREE.MathUtils.lerp(XR1.current.rotation.y, targetRotation, delta * 15)
      }
    }

    // 2. 修复镜头抽搐：让控制器的目标严格死锁在角色的腰部/头部高度（比如 y = 1.0）
    if (controlsRef.current) {
      controlsRef.current.target.set(
        XR1.current.position.x,
        XR1.current.position.y + 1.0, 
        XR1.current.position.z
      )
      controlsRef.current.update()
    }
  })

  // 3. 切换待机与走路动画（带混合过渡）
  useEffect(() => {
    const nextAnimName = FX1.length() > 0 ? 'walk' : 'wait'
    const nextAction = actions[nextAnimName]

    if (nextAction && currentAction.current !== nextAction) {
      // 0.2秒平滑淡入淡出，防止动作骨骼突变卡顿
      nextAction.reset().fadeIn(0.2).play()
      if (currentAction.current) {
        currentAction.current.fadeOut(0.2)
      }
      currentAction.current = nextAction
    }
  }, [FX1, actions])

  return <primitive ref={XR1} object={walkGLTF.scene} scale={1.2} />
}

// 预加载模型，防止渲染时卡顿
useGLTF.preload('/walk.glb')
useGLTF.preload('/wait.glb')

