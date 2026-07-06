'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface MX1Props {
  FX1: THREE.Vector3
  KZR1: any
  CJR1: any
  SD1: boolean
  SS1: React.Dispatch<React.SetStateAction<number>>
  FG1: boolean
}

export default function MX1({ FX1, KZR1, CJR1, SD1, SS1, FG1 }: MX1Props) {
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
  const V_DIR = useRef(new THREE.Vector3())
  const V_STEP = useRef(new THREE.Vector3())
  const V_MB1 = useRef(new THREE.Vector3())

  const SQ1 = useRef(false)
  const MK1 = useRef<{ mesh: THREE.Group; collected: boolean }[]>([])
  const { camera } = useThree()

  const PL1 = useRef(0)
  const GD2 = useRef(0)
  const CJ_MS = useRef<THREE.Object3D[]>([])

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

    if (CJ_MS.current.length === 0 && CJR1.current) {
      CJR1.current.traverse(c => {
        if (c instanceof THREE.Mesh) CJ_MS.current.push(c)
      })
    }

    if (!SQ1.current && CJR1.current && M3.scene) {
      let rx = 0, rz = 0, ry = 0
      for (let i = 0; i < 300; i++) {
        rx = (Math.random() - 0.5) * 220
        rz = (Math.random() - 0.5) * 220
        W3.current.set(rx, 40, rz)
        YC2.current.set(W3.current, YD1.current)
        YC2.current.far = 60
        const JZ = YC2.current.intersectObjects(CJ_MS.current)
        if (JZ.length > 0) {
          const hit = JZ[0]
          const name = hit.object.name.toLowerCase()
          if (name.includes('house') || name.includes('build') || name.includes('房') || name.includes('roof') || hit.point.y > 1.0) {
            continue
          }
          ry = hit.point.y
          break
        }
      }
      XR1.current.position.set(rx, ry, rz)
      GD2.current = ry
      camera.position.set(rx, ry + 3.8, rz - 5.2)
      if (KZR1.current) {
        KZR1.current.target.copy(XR1.current.position).add(W2.current.set(0, 1.8, 0))
      }

      const arr = []
      for (let i = 0; i < 5; i++) {
        let mx = 0, mz = 0, my = 0
        for (let j = 0; j < 300; j++) {
          mx = (Math.random() - 0.5) * 220
          mz = (Math.random() - 0.5) * 220
          W3.current.set(mx, 40, mz)
          YC2.current.set(W3.current, YD1.current)
          YC2.current.far = 60
          const JZ_M = YC2.current.intersectObjects(CJ_MS.current)
          if (JZ_M.length > 0) {
            const hit = JZ_M[0]
            const name = hit.object.name.toLowerCase()
            if (name.includes('house') || name.includes('build') || name.includes('房') || name.includes('roof') || hit.point.y > 1.0) {
              continue
            }
            my = hit.point.y
            break
          }
        }
        const clone = M3.scene.clone()
        clone.scale.set(0.08, 0.08, 0.08)

        clone.traverse(c => {
          if (c instanceof THREE.Mesh) {
            c.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              map: (c.material as any).map || null,
              roughness: 0.6,
              metalness: 0.1
            })
          }
        })
        clone.position.set(mx, my + 0.3, mz)
        if (MKR1.current) {
          MKR1.current.add(clone)
        }
        arr.push({ mesh: clone, collected: false })
      }
      MK1.current = arr
      SQ1.current = true
    }
    
    if (SQ1.current && MK1.current.length > 0) {
      let changed = false
      let activeCount = 0

      MK1.current.forEach(m => {
        if (m.collected) return
        activeCount++
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

        m.mesh.visible = glow || FG1

        m.mesh.traverse(c => {
          if (c instanceof THREE.Mesh && c.material) {
            const mat = c.material as any
            if (mat.emissive) {
              if (FG1) {
                mat.emissive.setHex(0xffffff)
                mat.emissiveIntensity = 2.5
              } else if (glow) {
                mat.emissive.setHex(0xffffff)
                mat.emissiveIntensity = 0.6
              } else {
                mat.emissive.setHex(0x000000)
                mat.emissiveIntensity = 0.0
              }
            }
          }
        })

        if (dist < 1.2) {
          m.collected = true
          m.mesh.visible = false
          if (MKR1.current) {
            MKR1.current.remove(m.mesh)
          }
          changed = true
        }
      })

      if (changed) {
        SS1(5 - (activeCount - 1))
      }
    }

    if (FX1.lengthSq() > 0) {
      const angle = Math.atan2(camera.position.x - XR1.current.position.x, camera.position.z - XR1.current.position.z)
      V_DIR.current.copy(FX1).applyAxisAngle(W4.current, angle).normalize()
      V_STEP.current.copy(V_DIR.current).multiplyScalar(delta * 4)
      V_MB1.current.copy(XR1.current.position).add(V_STEP.current)
      
      if (Math.abs(V_MB1.current.x) < 130 && Math.abs(V_MB1.current.z) < 127) {
        let KY1 = true
        let ND1 = XR1.current.position.y

        if (CJ_MS.current.length > 0) {
          W1.current.copy(XR1.current.position).add(W2.current.set(0, 0.3, 0))
          YC1.current.set(W1.current, V_DIR.current)
          YC1.current.far = 0.8
          const JZ1 = YC1.current.intersectObjects(CJ_MS.current)
          if (JZ1.length > 0) {
            KY1 = false
          }

          if (KY1) {
            if (PL1.current % 2 === 0) {
              W3.current.copy(V_MB1.current).add(W2.current.set(0, 3, 0))
              YC2.current.set(W3.current, YD1.current)
              YC2.current.far = 6
              const JZ2 = YC2.current.intersectObjects(CJ_MS.current)
              if (JZ2.length > 0) {
                const GD1 = JZ2[0].point.y
                if (GD1 - XR1.current.position.y > 0.4) {
                  KY1 = false
                } else {
                  ND1 = GD1
                  GD2.current = GD1
                }
              } else {
                KY1 = false
              }
            } else {
              ND1 = GD2.current
            }
          }
        }

        if (KY1) {
          XR1.current.position.copy(V_MB1.current)
          XR1.current.position.y = ND1
          camera.position.add(V_STEP.current)
        }
      }
      W1.current.copy(XR1.current.position).add(V_DIR.current)
      XR1.current.lookAt(W1.current)
    }

    if (KZR1.current) {
      KZR1.current.target.copy(XR1.current.position).add(W2.current.set(0, 1.8, 0))
      KZR1.current.update()
      
      if (PL1.current % 2 === 1 && CJ_MS.current.length > 0) {
        W1.current.copy(XR1.current.position).add(W2.current.set(0, 1.8, 0))
        W5.current.copy(camera.position).sub(W1.current)
        const CD1 = W5.current.length()
        W5.current.normalize()
        YC1.current.set(W1.current, W5.current)
        YC1.current.far = CD1
        const JZ3 = YC1.current.intersectObjects(CJ_MS.current)
        if (JZ3.length > 0) {
          const FG1 = JZ3.find(h => {
            const n = h.object.name.toLowerCase()
            return n.includes('house') || n.includes('build') || n.includes('房') || n.includes('wall') || n.includes('roof') || n.includes('cube') || n.includes('mesh') || h.point.y > GD2.current + 0.5
          })
          if (FG1) {
            camera.position.copy(FG1.point).add(W5.current.clone().multiplyScalar(-0.2))
          }
        }
      }
    }
    PL1.current++
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

