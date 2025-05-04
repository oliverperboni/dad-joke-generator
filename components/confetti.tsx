"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  active: boolean
}

export function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; color: string; size: number; rotation: number }>
  >([])

  useEffect(() => {
    if (!active) return

    const colors = ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#f0abfc"]
    const newParticles = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 2,
        rotation: Math.random() * 360,
      })
    }

    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
    }, 2000)

    return () => clearTimeout(timer)
  }, [active])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti ${Math.random() * 1 + 1}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  )
}
