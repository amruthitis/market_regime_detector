import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef, useMemo, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ParticlesProps {
  count?: number
}

function Particles({ count = 2000 }: ParticlesProps) {
  const mesh = useRef<any>(null)
  const dummy = useRef<any>(new THREE.Object3D())

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return pos
  }, [count])

  const velocities = useMemo(() => {
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return vel
  }, [count])

  const posRef = useRef(positions)
  const velRef = useRef(velocities)

  useFrame(() => {
    if (!mesh.current) return
    const pos = posRef.current
    const vel = velRef.current
    for (let i = 0; i < count; i++) {
      pos[i * 3] += vel[i * 3]
      pos[i * 3 + 1] += vel[i * 3 + 1]
      pos[i * 3 + 2] += vel[i * 3 + 2]
      if (Math.abs(pos[i * 3]) > 25) vel[i * 3] *= -1
      if (Math.abs(pos[i * 3 + 1]) > 25) vel[i * 3 + 1] *= -1
      if (Math.abs(pos[i * 3 + 2]) > 25) vel[i * 3 + 2] *= -1
      dummy.current.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
      dummy.current.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.current.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 4, 4]} />
      <meshBasicMaterial color="white" transparent opacity={0.35} />
    </instancedMesh>
  )
}

interface ParticleFieldProps {
  className?: string
}

export function ParticleField({ className }: ParticleFieldProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)")
    setIsMobile(media.matches)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <Particles count={isMobile ? 500 : 2000} />
      </Canvas>
    </div>
  )
}
