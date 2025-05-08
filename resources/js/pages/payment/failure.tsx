"use client"

import { Head, Link } from "@inertiajs/react"
import { XCircle, AlertTriangle, RefreshCw, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useState } from "react"

interface FailureProps {
  auth: {
    user: any
  }
  error?: string
}

export default function Failure({ auth, error }: FailureProps) {
  const [errorCode] = useState(`ERR-${Math.floor(100000 + Math.random() * 900000)}`)

  return (
    <>
      <Head title="Payment Failed" />
      <Navbar auth={auth} />

      <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Error Card */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#121212] border border-gray-800 overflow-hidden">
              {/* Top Section with Animation */}
              <div className="relative h-64 bg-[#1a1a1a] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Animated warning sign */}
                    <motion.div
                      className="absolute w-full h-full rounded-full"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                      style={{
                        background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, rgba(0,0,0,0) 70%)",
                        x: "-50%",
                        y: "-50%",
                        left: "50%",
                        top: "50%",
                        width: 300,
                        height: 300,
                      }}
                    />

                    {/* Error icon */}
                    <motion.div
                      className="relative z-10 bg-red-600 rounded-full p-5"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    >
                      <XCircle className="h-16 w-16 text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Animated glitch effect */}
                <motion.div
                  className="absolute inset-0 bg-red-900/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.2,
                    repeatType: "mirror",
                    times: [0, 0.5, 1],
                    repeatDelay: Math.random() * 5 + 2,
                  }}
                />

                {/* Horizontal glitch lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-[1px] w-full bg-red-500/30"
                    style={{ top: `${Math.random() * 100}%` }}
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{
                      opacity: [0, 0.7, 0],
                      x: ["100%", "-100%"],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.5,
                      repeatDelay: Math.random() * 5 + 2,
                    }}
                  />
                ))}
              </div>

              {/* Content Section */}
              <div className="p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Payment Failed</h1>

                  <div className="flex items-center justify-center gap-2 mb-8">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="text-red-500 font-medium">We couldn't process your payment</p>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>

                  <div className="bg-[#1a1a1a] border border-gray-800 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <p className="text-gray-400 text-sm">Error Reference</p>
                        <p className="text-xl font-mono font-bold">{errorCode}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-red-900/20 px-4 py-2 border border-red-900/30">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500 text-sm">Transaction Failed</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-300">
                        {error || "We were unable to process your payment due to an issue with the transaction."}
                      </p>

                      <div className="bg-[#121212] border border-gray-800 p-4">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-sm text-amber-500 font-medium mb-1">Possible reasons:</p>
                            <ul className="text-sm text-gray-400 list-disc pl-4 space-y-1">
                              <li>Insufficient funds in your account</li>
                              <li>Bank declined the transaction</li>
                              <li>Incorrect payment details</li>
                              <li>Network or connection issues</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What to do next */}
                  <div className="mb-12">
                    <h3 className="text-lg font-medium mb-6">What to do next</h3>

                    <div className="space-y-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">1</span>
                        </div>
                        <p className="text-gray-300">Check your payment details and ensure you have sufficient funds</p>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">2</span>
                        </div>
                        <p className="text-gray-300">Try again with the same or a different payment method</p>
                      </div>

                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">3</span>
                        </div>
                        <p className="text-gray-300">
                          If the problem persists, contact our support team for assistance
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild className="bg-white text-black hover:bg-gray-200 rounded-none h-12">
                      <Link href="/payment" className="flex items-center justify-center">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800 rounded-none h-12"
                    >
                      <Link href="/contact" className="flex items-center justify-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Support
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
