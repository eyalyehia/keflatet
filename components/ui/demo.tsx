'use client'

import { CardStack3D } from "@/components/ui/3d-flip-card"

export function CardStackDemo() {
  const images = [
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop", alt: "Mountains" },
    { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop", alt: "Forest" },
    { src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop", alt: "River" },
    { src: "https://images.unsplash.com/photo-1500534318473-7c46ae54308c?q=80&w=1600&auto=format&fit=crop", alt: "Desert" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CardStack3D 
        images={images}
        cardWidth={320}
        cardHeight={320}
        spacing={{ x: 50, y: 50 }}
      />
    </div>
  )
}
