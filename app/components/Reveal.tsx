"use client"

import { motion } from "framer-motion"
import { SlidUp, SlidUpLeft, SlidUpRight } from "../lib/utils"
import React from "react"

export type RevealType = "heading" | "paragraph" | "media" | "default"

type SupportedTags = 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: SupportedTags
  type?: RevealType
  delay?: number
  className?: string
  children: React.ReactNode
  dir?: string
}

export default function Reveal({ as = "div", type = "default", delay = 0, className, children, ...rest }: RevealProps) {
  const variants = type === "heading" || type === "paragraph"
    ? SlidUpLeft(delay)
    : type === "media"
    ? SlidUpRight(delay)
    : SlidUp(delay)

  const components = {
    div: motion.div,
    p: motion.p,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    h5: motion.h5,
    h6: motion.h6,
    span: motion.span,
  } as const

  const Component = (components as Record<string, any>)[as] ?? motion.div

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: true, 
        amount: 0.2,
        margin: "-50px 0px -50px 0px"
      }}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  )
}
