"use client"

import { Head, Link } from "@inertiajs/react"
import { CheckCircle, ArrowRight, ShoppingBag, Receipt, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SuccessProps {
  auth: {
    user: any
  }
}

export default function Success({ auth }: SuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const orderNumber = new URLSearchParams(window.location.search).get('order') || 'ORD-000000'

  return (
    <>
      <Head title="Payment Successful" />
      <Navbar auth={auth} />

      {/* Enhanced Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                top: "110%",
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut",
                delay: Math.random() * 0.5,
              }}
              style={{
                backgroundColor: [
                  "#FFD700", // Gold
                  "#FFA500", // Orange
                  "#FF4500", // Red-Orange
                  "#ffffff", // White
                  "#E6E6FA", // Lavender
                ][Math.floor(Math.random() * 5)],
              }}
              onAnimationComplete={() => {
                if (i === 0) setTimeout(() => setShowConfetti(false), 3000)
              }}
            />
          ))}
        </div>
      )}

      <main className="bg-gradient-to-b from-[#0f0f0f] to-[#121212] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            {/* Enhanced Success Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#161616] to-[#0f0f0f] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
              {/* Top Section with Enhanced Animation */}
              <div className="relative h-72 bg-gradient-to-b from-[#1a1a1a] to-transparent overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Enhanced animated rings */}
                    {[1, 2, 3].map((index) => (
                      <motion.div
                        key={index}
                        className="absolute rounded-full border-2 border-white/5"
                        initial={{ width: 80, height: 80, opacity: 0 }}
                        animate={{ 
                          width: 120 + (index * 80), 
                          height: 120 + (index * 80), 
                          opacity: 0.2 - (index * 0.05) 
                        }}
                        transition={{ 
                          repeat: Number.POSITIVE_INFINITY, 
                          duration: 3, 
                          delay: index * 0.4,
                          ease: "easeOut" 
                        }}
                        style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                      />
                    ))}

                    {/* Enhanced success icon */}
                    <motion.div
                      className="relative z-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full p-6"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    >
                      <CheckCircle className="h-20 w-20 text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Enhanced Content Section */}
              <div className="p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-center"
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text">
                    Payment Successful!
                  </h1>

                  {/* Order Details Card */}
                  <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                      <div className="text-left">
                        <p className="text-gray-400 text-sm font-medium">Order Number</p>
                        <p className="text-xl font-mono font-bold text-white">{orderNumber}</p>
                      </div>
                      <motion.div 
                        className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Receipt className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Payment Verified</span>
                      </motion.div>
                    </div>

                    <div className="space-y-4 text-left">
                      <p className="text-gray-300 leading-relaxed">
                        Thank you for your payment. We've received your order and it's being processed. 
                        You'll receive an email confirmation shortly with all the details.
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild className="bg-white text-black hover:bg-gray-100 rounded-lg h-12 transition-all duration-200 hover:shadow-lg">
                      <Link href="/settings/profile" className="flex items-center justify-center gap-2">
                        <Receipt className="h-4 w-4" />
                        View Orders
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-white hover:text-black rounded-lg h-12 transition-all duration-200"
                    >
                      <Link href="/menu" className="flex items-center justify-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Continue Shopping
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}
