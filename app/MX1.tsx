'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MX1({ FX1, KZR1, CJR1, SD1 }: { FX1: THREE.Vector3, KZR1: any, CJR1: any, SD1: boolean }) {
  const M1 = useGLTF('/walk.glb')
  const M2 = useGLTF('/wait.glb')
  const M3 = useGLTF('/jokers_mask.glb')
  const { actions: A1 } = useAnimations(M1.animations, M1.scene)
  const { actions: A2 } = useAnimations(M2.animations, M2.scene)
  const XR1 = useRef<THREE.Group>(null)
  const MKR1 = useRef<THREE.Group>(null)
  const YC1 = useRef(new THREE.Raycaster())
  const YC2 = useRef(new THREE.Raycaster())
  const YD1 = useRef(new THREE.Vector3(0, -1, 0))
  const W1 = useRef(new THREE.Vector3())
  const W2 = useRef(new THREE.Vector3())
  const W3 = useRef(new THREE.Vector3())
  const W4 = useRef(new THREE.Vector3(0, 1, 0))
  const W5 = useRef(new THREE.Vector3())
  const W6 = useRef(new THREE.Vector3())
  const SQ1 = useRef(false)
  const MK1 = useRef<{ mesh: THREE.Group; collected: boolean }[]>([])
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
  }, [M1, M2])

  useFrame((state, delta) => {
    if (!XR1.current) return

    if (!SQ1.current && CJR1.current && M3.scene) {
      const rx = (Math.random() - 0.5) * 230
      const rz = (Math.random() - 0.5) * 230
      XR1.current.position.set(rx, 20, rz)
      YC2.current.set(XR1.current.position, YD1.current)
      YC2.current.far = 40
      const JZ = YC2.current.intersectObject(CJR1.current, true)
      if (JZ.length > 0) {
        XR1.current.position.y = JZ[0].point.y
      } else {
        XR1.current.position.y = 0
      }
      camera.position.set(rx, XR1.current.position.y + 3.8, rz - 5.2)
      if (KZR1.current) {
        KZR1.current.target.copy(XR1.current.position).add(W2.current.set(0, 1.3, 0))
      }

      const arr = []
      for (let i = 0; i < 5; i++) {
        const mx = (Math.random() - 0.5) * 230
        const mz = (Math.random() - 0.5) * 230
        const clone = M3.scene.clone()
        clone.traverse(c => {
          if (c instanceof THREE.Mesh) {
            c.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              map: (c.material as any).map || null,
              roughness: 0.6,
              metalness: 0.1,
              emissive: new THREE.Color(0x000000),
              emissiveIntensity: 0
            })
          }
        })
        W3.current.set(mx, 20, mz)
        YC2.current.set(W3.current, YD1.current)
        YC2.current.far = 40
        const JZ_M = YC2.current.intersectObject(CJR1.current, true)
        const my = JZ_M.length > 0 ? JZ_M[0].point.y + 0.5 : 0.5
        clone.position.set(mx, my, mz)
        if (MKR1.current) {
          MKR1.current.add(clone)
        }
        arr.push({ mesh: clone, collected: false })
      }
      MK1.current = arr
      SQ1.current = true
    }
    
    if (SQ1.current && MK1.current.length > 0) {
      MK1.current.forEach(m => {
        if (m.collected) return
        m.mesh.rotation.y += delta * 1.5
        const dist = XR1.current!.position.distanceTo(m.mesh.position)
        
        let glow = false
        if (SD1 && dist < 25) {
          W5.current.copy(m.mesh.position).sub(XR1.current!.position).normalize()
          W6.current.set(0, 0, 1).applyQuaternion(XR1.current!.quaternion).normalize()
          if (W6.current.dot(W5.current) > 0.5) {
            glow = true
          }
        }

        m.mesh.traverse(c => {
          if (c instanceof THREE.Mesh && c.material) {
            if (glow) {
              ;(c.material as any).emissive.setHex(0xffcc44)
              ;(c.material as any).emissiveIntensity = 4.0
            } else {
              ;(c.material as any).emissive.setHex(0x000000)
              ;(c.material as any).emissiveIntensity = 0
            }
          }
        })

        if (dist < 1.6) {
          m.collected = true
          m.mesh.visible = false
          if (MKR1.current) {
            MKR1.current.remove(m.mesh)
          }
        }
      })
    }

    if (FX1.length() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      const dir = FX1.clone().applyAxisAngle(W4.current, angle).normalize()
      const step = dir.clone().multiplyScalar(delta * 4)
      const MB1 = XR1.current.position.clone().add(step)
      
      if (Math.abs(MB1.x) < 127 && Math.abs(MB1.z) < 127) {
        let KY1 = true
        let ND1 = XR1.current.position.y

        if (CJR1.current) {
          W1.current.copy(XR1.current.position).add(W2.current.set(0, 0.45, 0))
          YC1.current.set(W1.current, dir)
          YC1.current.far = 0.6
          const JZ1 = YC1.current.intersectObject(CJR1.current, true)
          if (JZ1.length > 0) {
            KY1 = false
          }

          if (KY1) {
            W3.current.copy(MB1).add(W2.current.set(0, 3, 0))
            YC2.current.set(W3.current, YD1.current)
            YC2.current.far = 6
            const JZ2 = YC2.current.intersectObject(CJR1.current, true)
            if (JZ2.length > 0) {
              const GD1 = JZ2[0].point.y
              if (GD1 - XR1.current.position.y > 0.4) {
                KY1 = false
              } else {
                ND1 = GD1
              }
            } else {
              KY1 = false
            }
          }
        }

        if (KY1) {
          XR1.current.position.copy(MB1)
          XR1.current.position.y = ND1
          camera.position.add(step)
          if (KZR1.current) {
            KZR1.current.target.copy(XR1.current.position).add(W2.current.set(0, 1.3, 0))
          }
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
    <>
      <group ref={XR1} scale={1.2}>
        <primitive object={M1.scene} visible={ZT1} />
        <primitive object={M2.scene} visible={!ZT1} />
        <pointLight position={[0, 2, 0]} intensity={0.1} distance={10} color="#ffffff" />
        {SD1 && <pointLight position={[0, 1.2, 1.5]} intensity={8} distance={30} color="#ffffff" />}
      </group>
      <group ref={MKR1} />
    </>
  )
}

