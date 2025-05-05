"use client"

import { Head, Link } from "@inertiajs/react"
import { CheckCircle, ArrowRight, Home, Clock, Package, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface SuccessProps {
  auth: {
    user: any
  }
}

export default function Success({ auth }: SuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const orderNumber = new URLSearchParams(window.location.search).get('order') || 'ORD-000000'

  useEffect(() => {
    // Cycle through the steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev >= 3 ? 1 : prev + 1))
    }, 3000)

    // Clean up
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head title="Payment Successful | Solace Motorcycle" />
      <Navbar auth={auth} />

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
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
                backgroundColor: ["#ffffff", "#cccccc", "#888888"][Math.floor(Math.random() * 3)],
              }}
              onAnimationComplete={() => {
                if (i === 0) setTimeout(() => setShowConfetti(false), 3000)
              }}
            />
          ))}
        </div>
      )}

      <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Success Card */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#121212] border border-gray-800 overflow-hidden">
              {/* Top Section with Animation */}
              <div className="relative h-64 bg-[#1a1a1a] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Animated rings */}
                    <motion.div
                      className="absolute rounded-full border-2 border-white/10"
                      initial={{ width: 80, height: 80, opacity: 0 }}
                      animate={{ width: 280, height: 280, opacity: 0.2 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeOut" }}
                      style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                    />
                    <motion.div
                      className="absolute rounded-full border-2 border-white/10"
                      initial={{ width: 80, height: 80, opacity: 0 }}
                      animate={{ width: 200, height: 200, opacity: 0.15 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeOut", delay: 0.5 }}
                      style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                    />
                    <motion.div
                      className="absolute rounded-full border-2 border-white/10"
                      initial={{ width: 80, height: 80, opacity: 0 }}
                      animate={{ width: 140, height: 140, opacity: 0.1 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeOut", delay: 1 }}
                      style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                    />

                    {/* Success icon */}
                    <motion.div
                      className="relative z-10 bg-white rounded-full p-5"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    >
                      <CheckCircle className="h-16 w-16 text-black" />
                    </motion.div>
                  </div>
                </div>

                {/* Animated particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-1 w-1 bg-white rounded-full"
                      initial={{
                        x: Math.random() * 100 - 50 + "%",
                        y: Math.random() * 100 - 50 + "%",
                        opacity: 0,
                      }}
                      animate={{
                        x: [
                          Math.random() * 100 - 50 + "%",
                          Math.random() * 100 - 50 + "%",
                          Math.random() * 100 - 50 + "%",
                        ],
                        y: [
                          Math.random() * 100 - 50 + "%",
                          Math.random() * 100 - 50 + "%",
                          Math.random() * 100 - 50 + "%",
                        ],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Payment Successful!</h1>

                  <div className="flex items-center justify-center gap-2 mb-8">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <p className="text-amber-500 font-medium">Your order has been confirmed</p>
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </div>

                  <div className="bg-[#1a1a1a] border border-gray-800 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <p className="text-gray-400 text-sm">Order Number</p>
                        <p className="text-xl font-mono font-bold">{orderNumber}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 text-sm">Payment Verified</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Thank you for your payment. Your order has been received and is now being processed. You will
                        receive an email confirmation shortly.
                      </p>

                      <p className="text-gray-300">
                        You can track your order status in your order history in your profile.
                      </p>
                    </div>
                  </div>

                  {/* Order Progress */}
                  <div className="mb-12">
                    <h3 className="text-lg font-medium mb-6">Order Progress</h3>

                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-800"></div>

                      <div className="relative flex justify-between">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                            ${currentStep >= 1 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <span className="mt-2 text-sm font-medium">Confirmed</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                            ${currentStep >= 2 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
                          >
                            <Package className="h-5 w-5" />
                          </div>
                          <span className="mt-2 text-sm font-medium">Processing</span>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                            ${currentStep >= 3 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
                          >
                            <Home className="h-5 w-5" />
                          </div>
                          <span className="mt-2 text-sm font-medium">Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild className="bg-white text-black hover:bg-gray-200 rounded-none h-12">
                      <Link href="/settings/profile" className="flex items-center justify-center">
                        View Orders
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800 rounded-none h-12"
                    >
                      <Link href="/menu" className="flex items-center justify-center">
                        Continue Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
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
