"use client"

import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: "#1a1a1a",
          color: "white",
          border: "1px solid #333",
        },
      }}
    />
  )
} 