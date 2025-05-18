"use client"

import { Head, Link } from "@inertiajs/react"
import { CheckCircle, ArrowRight, ShoppingBag, Receipt, ChevronRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { toast } from "sonner"

interface SuccessProps {
  auth: {
    user: any
  }
}

export default function Success({ auth }: SuccessProps) {
  const { t } = useTranslation()
  const [showConfetti, setShowConfetti] = useState(true)
  const orderNumber = new URLSearchParams(window.location.search).get('order') || 'ORD-000000'

  return (
    <>
      <Head title={t("success.title")} />
      <Navbar auth={auth} />

      {/* Enhanced Confetti effect with more variety */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                top: "110%",
                opacity: [1, 1, 0],
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                duration: Math.random() * 2.5 + 1,
                ease: "easeOut",
                delay: Math.random() * 0.8,
              }}
              style={{
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                backgroundColor: [
                  "#FFD700", // Gold
                  "#FFA500", // Orange
                  "#FF8C00", // Dark Orange
                  "#ffffff", // White
                  "#FFE4B5", // Moccasin
                  "#FFB6C1", // Light Pink
                  "#E6E6FA", // Lavender
                ][Math.floor(Math.random() * 7)],
                filter: `brightness(${Math.random() * 50 + 100}%)`,
              }}
              onAnimationComplete={() => {
                if (i === 0) setTimeout(() => setShowConfetti(false), 4000)
              }}
            />
          ))}
        </div>
      )}

      <main className="min-h-screen bg-[#0f0f0f] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,197,94,0.1),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            {/* Enhanced Success Card */}
            <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
              {/* Top Section with Enhanced Animation */}
              <div className="relative h-80 bg-gradient-to-b from-[#1a1a1a]/50 to-transparent overflow-hidden">
                <div className="absolute inset-0">
                  {/* Animated background patterns */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <motion.div
                        key={`pattern-${index}`}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: [0.5, 0.2, 0.5], 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 8,
                          delay: index * 0.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 transform rotate-45" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Enhanced animated rings */}
                    {[1, 2, 3, 4].map((index) => (
                      <motion.div
                        key={index}
                        className="absolute rounded-full border border-green-500/20"
                        initial={{ width: 100, height: 100, opacity: 0 }}
                        animate={{ 
                          width: 140 + (index * 80), 
                          height: 140 + (index * 80), 
                          opacity: [0.3 - (index * 0.05), 0.1, 0.3 - (index * 0.05)]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 4, 
                          delay: index * 0.5,
                          ease: "easeInOut" 
                        }}
                        style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                      />
                    ))}

                    {/* Enhanced success icon */}
                    <motion.div
                      className="relative z-10 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-full p-8 shadow-lg shadow-green-500/20"
                      initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 100, 
                        delay: 0.3,
                        duration: 1 
                      }}
                    >
                      <CheckCircle className="h-24 w-24 text-white drop-shadow-lg" />
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
                  className="text-center space-y-8"
                >
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-200 via-emerald-300 to-green-200 text-transparent bg-clip-text">
                    {t("success.title")}
                  </h1>

                  {/* Order Details Card */}
                  <div className="bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                      <div className="text-left">
                        <p className="text-gray-400 text-sm font-medium mb-1">{t("success.order_number")}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-mono font-bold text-white tracking-wider">{orderNumber}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-green-500/10 hover:text-green-400 rounded-full"
                            onClick={() => {
                              navigator.clipboard.writeText(orderNumber)
                              toast.success(t("success.order_copied"))
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <motion.div 
                        className="flex items-center gap-2 bg-green-500/10 px-6 py-3 rounded-full border border-green-500/20"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Receipt className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-medium">{t("payment.status.verified")}</span>
                      </motion.div>
                    </div>

                    <div className="space-y-4 text-left">
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {t("success.message")}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button 
                      asChild 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 rounded-xl h-14 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
                    >
                      <Link href="/settings/profile" className="flex items-center justify-center gap-3">
                        <Receipt className="h-5 w-5" />
                        {t("success.view_orders")}
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="border-gray-700/50 text-white hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30 rounded-xl h-14 text-lg font-semibold transition-all duration-200"
                    >
                      <Link href="/menu" className="flex items-center justify-center gap-3">
                        <ShoppingBag className="h-5 w-5" />
                        {t("success.continue_shopping")}
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <motion.p 
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {t("success.email_notification")}
                  </motion.p>
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
