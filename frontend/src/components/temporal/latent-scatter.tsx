import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

const REGIME_COLORS: Record<string, string> = {
  bullish: "#22C55E",
  bearish: "#EF4444",
  crisis: "#7C3AED",
  sideways: "#FACC15",
}

interface DataPoint {
  x: number
  y: number
  z: number
  regime: string
}

interface ClusterInfo {
  center: [number, number, number]
  regime: string
}

interface LatentScatterProps {
  currentRegime: string
  selectedDate: string
  mockData: DataPoint[]
  currentPoint: DataPoint
}

function AnimatedPoint({
  position,
  color,
  size = 0.06,
  isCurrent = false,
  delay = 0,
}: {
  position: [number, number, number]
  color: string
  size?: number
  isCurrent?: boolean
  delay?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetPos = useMemo(() => new THREE.Vector3(...position), [position])

  const startPos = useMemo(() => {
    const angle = Math.random() * Math.PI * 2
    const dist = 1.5 + Math.random() * 1
    return new THREE.Vector3(Math.cos(angle) * dist, Math.sin(angle) * dist, 0)
  }, [])

  const progress = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    progress.current = Math.min(progress.current + delta * 0.6, 1 + delay)
    const t = Math.max(0, Math.min(1, (progress.current - delay) / 0.8))
    const eased = 1 - Math.pow(1 - t, 3)
    meshRef.current.position.lerpVectors(startPos, targetPos, eased)

    if (isCurrent) {
      const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15
      meshRef.current.scale.setScalar(pulse)
    }
  })

  const baseScale = isCurrent ? 2.2 : 1

  return (
    <mesh
      ref={meshRef}
      position={startPos.toArray()}
      scale={[baseScale, baseScale, baseScale]}
    >
      <sphereGeometry args={[size, isCurrent ? 20 : 12, isCurrent ? 20 : 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={isCurrent ? 1 : 0.85}
      />
      {isCurrent && (
        <pointLight
          color={color}
          intensity={0.6}
          distance={0.5}
          decay={2}
        />
      )}
    </mesh>
  )
}

function ClusterLabel({
  position,
  label,
}: {
  position: [number, number, number]
  label: string
}) {
  const spriteRef = useRef<THREE.Sprite>(null)

  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 256, 64)
  ctx.font = "bold 28px Inter, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "rgba(255,255,255,0.7)"
  ctx.fillText(label, 128, 32)

  const texture = new THREE.CanvasTexture(canvas)

  return (
    <sprite ref={spriteRef} position={position} scale={[0.6, 0.15, 1]}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}

export function LatentScatter(props: LatentScatterProps) {
  const { currentRegime, currentPoint, mockData } = props

  const clusters: ClusterInfo[] = useMemo(() => {
    const regimeSet = [...new Set(mockData.map((p) => p.regime))]
    return regimeSet.map((regime) => {
      const points = mockData.filter((p) => p.regime === regime)
      const cx = points.reduce((s, p) => s + p.x, 0) / points.length
      const cy = points.reduce((s, p) => s + p.y, 0) / points.length
      return { center: [cx, cy, 0] as [number, number, number], regime }
    })
  }, [mockData])

  return (
    <group>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={0.5}
        maxDistance={6}
        enablePan
      />

      {mockData.map((point, i) => (
        <AnimatedPoint
          key={`${point.regime}-${i}`}
          position={[point.x, point.y, point.z]}
          color={REGIME_COLORS[point.regime] || "#888"}
          delay={i * 0.008}
        />
      ))}

      <AnimatedPoint
        position={[currentPoint.x, currentPoint.y, currentPoint.z]}
        color={REGIME_COLORS[currentRegime] || "#22C55E"}
        size={0.1}
        isCurrent
      />

      {clusters.map((cluster) => {
        const clusterPoints = mockData.filter((p) => p.regime === cluster.regime)
        if (clusterPoints.length < 2) return null

        const color = new THREE.Color(REGIME_COLORS[cluster.regime] || "#888")
        color.multiplyScalar(0.6)
        const hexColor = "#" + color.getHexString()

        return (
          <group key={cluster.regime}>
            <AnimatedPoint
              position={cluster.center}
              color={hexColor}
              size={0.04}
            />
            <ClusterLabel
              position={[cluster.center[0], cluster.center[1] - 0.35, 0]}
              label={cluster.regime.charAt(0).toUpperCase() + cluster.regime.slice(1)}
            />
          </group>
        )
      })}

      {/* Grid helpers */}
      <gridHelper
        args={[3, 6, "rgba(255,255,255,0.06)", "rgba(255,255,255,0.03)"]}
        position={[0, 0, -0.01]}
      />
    </group>
  )
}
