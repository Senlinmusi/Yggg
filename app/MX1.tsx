'use client'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface JK1 {
  FX1: THREE.Vector3
  KZR1: any
  CJR1: any
  SD1: boolean
  SZ1: React.Dispatch<React.SetStateAction<number>>
}

export default function MX1({ FX1, KZR1, CJR1, SD1, SZ1 }: JK1) {
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
  const FX2 = useRef(new THREE.Vector3())
  const BB1 = useRef(new THREE.Vector3())
  const MB1 = useRef(new THREE.Vector3())

  const SQ1 = useRef(false)
  const MK1 = useRef<{ MX2: THREE.Group; SJ4: boolean }[]>([])
  const { camera: XJ1 } = useThree()

  useEffect(() => {
    [M1.scene, M2.scene].forEach(CJ2 => CJ2.traverse(DX1 => {
      if (DX1 instanceof THREE.Mesh) {
        DX1.material = new THREE.MeshToonMaterial({ 
          color: 0xffffff, 
          map: (DX1.material as any).map,
          gradientMap: null 
        })
      }
    }))
  }, [M1, M2])

  useFrame((ZT2, SC1) => {
    if (!XR1.current) return

    if (!SQ1.current && CJR1.current && M3.scene) {
      let ZB1 = 0, ZB2 = 0, ZB3 = 0
      for (let I1 = 0; I1 < 20; I1++) {
        ZB1 = (Math.random() - 0.5) * 220
        ZB2 = (Math.random() - 0.5) * 220
        XR1.current.position.set(ZB1, 20, ZB2)
        YC2.current.set(XR1.current.position, YD1.current)
        YC2.current.far = 40
        const JD1 = YC2.current.intersectObject(CJR1.current, true)
        if (JD1.length > 0) {
          ZB3 = JD1[0].point.y
          if (ZB3 < 0.5) break
        }
      }
      XR1.current.position.set(ZB1, ZB3, ZB2)
      XJ1.position.set(ZB1, ZB3 + 3.8, ZB2 - 5.2)
      if (KZR1.current) {
        KZR1.current.target.copy(XR1.current.position).add(W2.current.set(0, 1.3, 0))
      }

      const SZ2 = []
      for (let I2 = 0; I2 < 5; I2++) {
        let ZB4 = 0, ZB5 = 0, ZB6 = 0
        for (let J1 = 0; J1 < 20; J1++) {
          ZB4 = (Math.random() - 0.5) * 220
          ZB5 = (Math.random() - 0.5) * 220
          W3.current.set(ZB4, 20, ZB5)
          YC2.current.set(W3.current, YD1.current)
          YC2.current.far = 40
          const JD2 = YC2.current.intersectObject(CJR1.current, true)
          if (JD2.length > 0) {
            ZB6 = JD2[0].point.y
            if (ZB6 < 0.5) break
          }
        }
        const KL1 = M3.scene.clone()
        KL1.scale.set(0.08, 0.08, 0.08)

        KL1.traverse(DX2 => {
          if (DX2 instanceof THREE.Mesh) {
            DX2.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              map: (DX2.material as any).map || null,
              roughness: 0.6,
              metalness: 0.1
            })
          }
        })
        KL1.position.set(ZB4, ZB6 + 0.3, ZB5)
        if (MKR1.current) {
          MKR1.current.add(KL1)
        }
        SZ2.push({ MX2: KL1, SJ4: false })
      }
      MK1.current = SZ2
      SQ1.current = true
    }
    
    if (SQ1.current && MK1.current.length > 0) {
      let BH1 = false
      let SL1 = 0

      MK1.current.forEach(DX3 => {
        if (DX3.SJ4) return
        SL1++
        DX3.MX2.rotation.y += SC1 * 1.5
        const JL1 = XR1.current!.position.distanceTo(DX3.MX2.position)
        
        let FG1 = false
        if (SD1 && JL1 < 25) {
          W5.current.copy(DX3.MX2.position).sub(XR1.current!.position).normalize()
          W6.current.set(0, 0, 1).applyQuaternion(XR1.current!.quaternion).normalize()
          if (W6.current.dot(W5.current) > 0.5) {
            FG1 = true
          }
        }

        DX3.MX2.visible = FG1

        if (JL1 < 1.2) {
          DX3.SJ4 = true
          DX3.MX2.visible = false
          if (MKR1.current) {
            MKR1.current.remove(DX3.MX2)
          }
          BH1 = true
        }
      })

      if (BH1) {
        SZ1(5 - (SL1 - 1))
      }
    }

    if (FX1.lengthSq() > 0) {
      const JD3 = Math.atan2(XJ1.position.x - XR1.current.position.x, XJ1.position.z - XR1.current.position.z)
      FX2.current.copy(FX1).applyAxisAngle(W4.current, JD3).normalize()
      BB1.current.copy(FX2.current).multiplyScalar(SC1 * 4)
      MB1.current.copy(XR1.current.position).add(BB1.current)
      
      if (Math.abs(MB1.current.x) < 127 && Math.abs(MB1.current.z) < 127) {
        let KY1 = true
        let ND1 = XR1.current.position.y

        if (CJR1.current) {
          W1.current.copy(XR1.current.position).add(W2.current.set(0, 0.45, 0))
          YC1.current.set(W1.current, FX2.current)
          YC1.current.far = 0.6
          const JZ1 = YC1.current.intersectObject(CJR1.current, true)
          if (JZ1.length > 0) {
            KY1 = false
          }

          if (KY1) {
            W3.current.copy(MB1.current).add(W2.current.set(0, 3, 0))
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
          XR1.current.position.copy(MB1.current)
          XR1.current.position.y = ND1
          XJ1.position.add(BB1.current)
          if (KZR1.current) {
            KZR1.current.target.copy(XR1.current.position).add(W2.current.set(0, 1.3, 0))
          }
        }
      }
      W1.current.copy(XR1.current.position).add(FX2.current)
      XR1.current.lookAt(W1.current)
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

