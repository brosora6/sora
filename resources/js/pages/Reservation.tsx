"use client"

import type React from "react"

import { Head, useForm } from "@inertiajs/react"
import {
  Clock,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  ChevronRight,
  Check,
  CalendarDays,
  ArrowRight,
  Star,
} from "lucide-react"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { motion, AnimatePresence } from "framer-motion"

interface OpeningHours {
  [key: string]: string[]
}

interface ReservationProps {
    auth: {
    user: any
  }
    reservation?: {
    id: number
    status: "pending" | "confirmed" | "rejected"
    staff_whatsapp: string | null
  }
  openingHours?: OpeningHours
}

type ReservationForm = {
  tanggal: string
  waktu: string
  jumlah_orang: number
  note: string
}

export default function Reservation({ auth, reservation, openingHours = {} }: ReservationProps) {
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)
  const [animateBackground, setAnimateBackground] = useState(false)

    const { data, setData, post, processing, errors } = useForm<ReservationForm>({
    tanggal: "",
    waktu: "",
    jumlah_orang: 2,
    note: "",
  })

    useEffect(() => {
        if (data.tanggal) {
      const date = new Date(data.tanggal)
      setSelectedDay(date.toLocaleDateString("en-US", { weekday: "long" }))
    }
  }, [data.tanggal])

  // Animation effect when changing steps
  useEffect(() => {
    setAnimateBackground(true)
    const timer = setTimeout(() => setAnimateBackground(false), 700)
    return () => clearTimeout(timer)
  }, [currentStep])

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only submit if we're on the final step
    if (currentStep === 3) {
      // Validate all required fields before submission
      if (!data.tanggal || !data.waktu || !data.jumlah_orang) {
        return;
      }

      // Post the reservation data
      post(route('reservations.store'), {
        onSuccess: () => {
          setShowConfetti(true)
        },
      })
    } else {
      // If not on final step, just go to next step
      nextStep()
    }
  }

    if (!auth.user) {
    window.location.href = "/login"
    return null
    }

    const getStatusColor = (status: string) => {
        switch (status) {
      case "confirmed":
        return "bg-green-900/20 text-green-500 border-green-900/30"
      case "rejected":
        return "bg-red-900/20 text-red-500 border-red-900/30"
            default:
        return "bg-amber-900/20 text-amber-500 border-amber-900/30"
    }
        }

    const defaultOpeningHours: OpeningHours = {
    Monday: ["08:00", "22:00"],
    Tuesday: ["08:00", "22:00"],
    Wednesday: ["08:00", "22:00"],
    Thursday: ["08:00", "22:00"],
    Friday: ["07:00", "22:00"],
    Saturday: ["08:00", "22:00"],
    Sunday: ["08:00", "22:00"],
  }

  const actualOpeningHours = Object.keys(openingHours).length > 0 ? openingHours : defaultOpeningHours

    const getCurrentDayHours = () => {
    if (!selectedDay || !actualOpeningHours[selectedDay]) return null
    return actualOpeningHours[selectedDay]
  }

  const hours = getCurrentDayHours()

  // Generate time slots based on opening hours
  const generateTimeSlots = () => {
    if (!hours) return []

    const [openTime, closeTime] = hours
    const slots = []
    const [openHour, openMinute] = openTime.split(":").map(Number)
    const [closeHour, closeMinute] = closeTime.split(":").map(Number)

    let currentHour = openHour
    let currentMinute = openMinute

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMinute <= closeMinute - 30) // Stop 30 minutes before closing
    ) {
      const formattedHour = currentHour.toString().padStart(2, "0")
      const formattedMinute = currentMinute.toString().padStart(2, "0")
      slots.push(`${formattedHour}:${formattedMinute}`)

      // Increment by 30 minutes
      currentMinute += 30
      if (currentMinute >= 60) {
        currentHour += 1
        currentMinute = 0
      }
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  const nextStep = () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1 && (!data.tanggal || !data.waktu)) {
        return;
      }
      if (currentStep === 2 && !data.jumlah_orang) {
        return;
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time)
    setData("waktu", time)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

    return (
        <>
      <Head title="Reservation | Solace Motorcycle" />
            <Navbar auth={auth} />

      {/* Enhanced confetti effect when reservation is successful */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
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
                backgroundColor: ["#ffffff", "#cccccc", "#888888", "#ffcc00", "#ff8800"][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
              }}
            />
          ))}

          {/* Add sparkle effects */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              initial={{
                scale: 0,
                opacity: 0,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 2,
                repeat: 2,
                repeatDelay: Math.random() * 2,
              }}
            >
              <Star className="text-yellow-400 h-8 w-8" />
            </motion.div>
          ))}
        </div>
      )}

      <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Hero Section with parallax effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center relative overflow-hidden py-12"
          >
            {/* Background elements with parallax effect */}
            <motion.div
              className="absolute inset-0 opacity-10 pointer-events-none"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-white/5"></div>
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/5"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5"></div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Reserve Your Experience
            </motion.h1>

            <motion.p
              className="text-gray-400 max-w-2xl mx-auto relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Book your table at our motorcycle-themed café and enjoy the unique atmosphere surrounded by custom bikes
              and motorcycle culture.
            </motion.p>

            {/* Animated decorative elements */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            ></motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Opening Hours with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-[#1a1a1a] border border-gray-800 p-6 sticky top-24 overflow-hidden relative">
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
                  animate={{
                    opacity: [0.05, 0.1, 0.05],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                ></motion.div>

                <h2 className="text-xl font-bold mb-6 flex items-center relative">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 15,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </motion.div>
                            Opening Hours
                        </h2>

                <div className="space-y-4 relative">
                  {Object.entries(actualOpeningHours).map(([day, hours], index) => (
                    <motion.div
                      key={day}
                      className={`flex justify-between p-3 border ${
                        selectedDay === day
                          ? "border-white bg-white/10"
                          : hoveredDay === day
                            ? "border-gray-700 bg-[#1f1f1f]"
                            : "border-gray-800"
                      } transition-colors duration-200`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-400">
                        {hours[0]} - {hours[1]}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-8 pt-6 border-t border-gray-800 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-gray-700 text-white hover:bg-gray-800 group relative overflow-hidden"
                    onClick={() => window.open(`https://wa.me/+6281234567890`, "_blank")}
                  >
                    <motion.div
                      animate={{
                        x: [-2, 2, -2],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </motion.div>
                    <span>Contact via WhatsApp</span>
                    <motion.div
                      className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Reservation Form or Status with enhanced animations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              {reservation ? (
                <motion.div
                  className="bg-[#1a1a1a] border border-gray-800 p-8 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {/* Background animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
                    animate={{
                      opacity: [0.05, 0.1, 0.05],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 5,
                      ease: "easeInOut",
                    }}
                  ></motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="flex items-center justify-center mb-8"
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute rounded-full border-2 border-white/10"
                        initial={{ width: 80, height: 80, opacity: 0 }}
                        animate={{ width: 200, height: 200, opacity: 0.2 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeOut" }}
                        style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                      />
                      <motion.div
                        className="absolute rounded-full border-2 border-white/10"
                        initial={{ width: 80, height: 80, opacity: 0 }}
                        animate={{ width: 140, height: 140, opacity: 0.15 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeOut", delay: 0.5 }}
                        style={{ x: "-50%", y: "-50%", left: "50%", top: "50%" }}
                      />
                      <motion.div
                        className="relative z-10 bg-white rounded-full p-5"
                        animate={{
                          boxShadow: [
                            "0 0 0 rgba(255,255,255,0.3)",
                            "0 0 20px rgba(255,255,255,0.5)",
                            "0 0 0 rgba(255,255,255,0.3)",
                          ],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2,
                          ease: "easeInOut",
                        }}
                      >
                        <Check className="h-12 w-12 text-black" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-center mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Reservation Received
                  </motion.h2>

                  <motion.div
                    className={`p-4 mb-6 ${getStatusColor(reservation.status)} border relative overflow-hidden`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {/* Animated highlight effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/5"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    ></motion.div>

                    <div className="flex items-center justify-between mb-2 relative">
                      <span className="font-medium">Status</span>
                      <span className="capitalize font-bold">{reservation.status}</span>
                                </div>
                    <p className="text-sm relative">
                      {reservation.status === "pending"
                        ? "Your reservation is being reviewed. We'll confirm shortly."
                        : reservation.status === "confirmed"
                          ? "Your reservation has been confirmed. We look forward to seeing you!"
                          : "Unfortunately, your reservation could not be accommodated. Please contact us for details."}
                    </p>
                  </motion.div>

                  <motion.div
                    className="space-y-6 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <p className="text-gray-300">
                      Thank you for your reservation request. For faster response, you can contact us directly via
                      WhatsApp or check your reservation status in your profile.
                    </p>

                    <div className="bg-[#121212] border border-gray-800 p-6 relative overflow-hidden">
                      {/* Subtle animated gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 8,
                          ease: "linear",
                        }}
                      ></motion.div>

                      <h3 className="text-lg font-medium mb-4 relative">What's Next?</h3>
                      <div className="space-y-4 relative">
                        {[1, 2, 3].map((step, index) => (
                          <motion.div
                            key={step}
                            className="flex gap-4 items-start"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                          >
                            <motion.div
                              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
                              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                            >
                              <span className="text-sm font-medium">{step}</span>
                            </motion.div>
                            <p className="text-gray-300">
                              {step === 1
                                ? "You'll receive a confirmation email once your reservation is confirmed"
                                : step === 2
                                  ? "You can modify or cancel your reservation up to 2 hours before the scheduled time"
                                  : "Please arrive on time. We'll hold your table for 15 minutes after your reservation time"}
                            </p>
                          </motion.div>
                            ))}
                        </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 rounded-none h-12 relative overflow-hidden group"
                      onClick={() => window.open(`https://wa.me/+6281234567890`, "_blank")}
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                      <motion.div
                        className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 1 }}
                      />
                    </Button>
                                        <Button
                                            variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-gray-700 text-white hover:bg-gray-800 rounded-none h-12 relative overflow-hidden group"
                      onClick={() => {
                        window.location.href = "/settings/profile"
                      }}
                    >
                      <Clock className="w-4 h-4" />
                      <span>View Reservation Status</span>
                      <motion.div
                        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 1 }}
                      />
                                        </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-[#1a1a1a] border border-gray-800 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {/* Animated background effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
                    animate={{
                      opacity: animateBackground ? [0.05, 0.15, 0.05] : 0.05,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  ></motion.div>

                  {/* Progress Steps with enhanced animations */}
                  <div className="p-6 border-b border-gray-800 relative">
                    <div className="relative">
                      <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-gray-800 -translate-y-1/2"
                        style={{ width: "100%" }}
                      ></motion.div>

                      <motion.div
                        className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep - 1) * 50}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      ></motion.div>

                      <div className="relative flex justify-between">
                        {[
                          { step: 1, icon: Calendar, label: "Date & Time" },
                          { step: 2, icon: Users, label: "Party Size" },
                          { step: 3, icon: MessageSquare, label: "Details" },
                        ].map(({ step, icon: Icon, label }) => (
                          <div key={step} className="flex flex-col items-center">
                            <motion.div
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                currentStep >= step ? "bg-white text-black" : "bg-gray-800 text-gray-400"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              animate={{
                                boxShadow:
                                  currentStep === step
                                    ? [
                                        "0 0 0 rgba(255,255,255,0.3)",
                                        "0 0 10px rgba(255,255,255,0.5)",
                                        "0 0 0 rgba(255,255,255,0.3)",
                                      ]
                                    : "none",
                              }}
                              transition={{
                                repeat: currentStep === step ? Number.POSITIVE_INFINITY : 0,
                                duration: 2,
                              }}
                            >
                              <Icon className="h-5 w-5" />
                            </motion.div>
                            <motion.span
                              className="mt-2 text-sm font-medium"
                              animate={{
                                color: currentStep === step ? "#ffffff" : "#9ca3af",
                              }}
                            >
                              {label}
                            </motion.span>
                          </div>
                        ))}
                      </div>
                    </div>
                                    </div>

                  {/* Form Steps with enhanced animations */}
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="p-8 relative">
                      <AnimatePresence mode="wait">
                        {/* Step 1: Date & Time */}
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                          >
                            <motion.h2
                              className="text-2xl font-bold mb-6 flex items-center"
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                            >
                              <motion.div
                                animate={{
                                  rotate: [0, 5, 0, -5, 0],
                                }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 8,
                                  ease: "easeInOut",
                                  repeatDelay: 1,
                                }}
                                className="mr-2"
                              >
                                <CalendarDays className="h-6 w-6" />
                              </motion.div>
                              Select Date & Time
                            </motion.h2>

                            <div className="space-y-4">
                              <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                              >
                                <Label htmlFor="tanggal">Date</Label>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData("tanggal", e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    className="bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-none focus:border-white focus:ring-0"
                                />
                                </div>
                                <InputError message={errors.tanggal} />
                              </motion.div>

                              {data.tanggal && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <p className="text-lg font-medium mb-4 mt-6">
                                    Available time slots for {formatDate(data.tanggal)}:
                                  </p>

                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {timeSlots.map((time, index) => (
                                      <motion.button
                                        key={time}
                                        type="button"
                                        className={`p-3 border ${
                                          selectedTimeSlot === time
                                            ? "border-white bg-white text-black"
                                            : "border-gray-800 hover:border-gray-700"
                                        } text-center transition-colors relative overflow-hidden`}
                                        onClick={() => handleTimeSlotSelect(time)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
                                      >
                                        {selectedTimeSlot === time && (
                                          <motion.div
                                            className="absolute inset-0 bg-white"
                                            layoutId="selectedTime"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                          />
                                        )}
                                        <span
                                          className={`relative z-10 ${selectedTimeSlot === time ? "text-black" : ""}`}
                                        >
                                          {time}
                                        </span>
                                      </motion.button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Party Size */}
                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                          >
                            <motion.h2
                              className="text-2xl font-bold mb-6 flex items-center"
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                            >
                              <motion.div
                                animate={{
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 2,
                                  ease: "easeInOut",
                                }}
                                className="mr-2"
                              >
                                <Users className="h-6 w-6" />
                              </motion.div>
                              How many people?
                            </motion.h2>

                            <div className="space-y-4">
                              <motion.div
                                className="flex items-center justify-center"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                              >
                                <motion.div
                                  className="flex items-center gap-6"
                                  initial={{ scale: 0.9 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                >
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 w-12 rounded-full border-gray-700 text-white hover:bg-gray-800"
                                    onClick={() => setData("jumlah_orang", Math.max(1, (data.jumlah_orang || 1) - 1))}
                                    disabled={data.jumlah_orang <= 1}
                                  >
                                    -
                                  </Button>
                                  <motion.div
                                    className="text-4xl font-bold w-16 text-center"
                                    key={data.jumlah_orang}
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    {data.jumlah_orang}
                                  </motion.div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 w-12 rounded-full border-gray-700 text-white hover:bg-gray-800"
                                    onClick={() => setData("jumlah_orang", Math.min(20, (data.jumlah_orang || 1) + 1))}
                                    disabled={data.jumlah_orang >= 20}
                                  >
                                    +
                                  </Button>
                                </motion.div>
                              </motion.div>
                                <InputError message={errors.jumlah_orang} />

                              <motion.div
                                className="pt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                              >
                                <p className="text-gray-400 text-center">
                                  {data.jumlah_orang > 8
                                    ? "For parties larger than 8, a 10% service charge will be applied."
                                    : "No additional service charge for parties of 8 or fewer."}
                                </p>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Special Requests */}
                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                          >
                            <motion.h2
                              className="text-2xl font-bold mb-6 flex items-center"
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                            >
                              <motion.div
                                animate={{
                                  rotate: [0, 10, 0, -10, 0],
                                }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 8,
                                  ease: "easeInOut",
                                }}
                                className="mr-2"
                              >
                                <MessageSquare className="h-6 w-6" />
                              </motion.div>
                              Any special requests?
                            </motion.h2>

                            <motion.div
                              className="space-y-4"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.8 }}
                            >
                              <Label htmlFor="note">Special Requests (Optional)</Label>
                                <Input
                                    id="note"
                                    value={data.note}
                                onChange={(e) => setData("note", e.target.value)}
                                placeholder="Let us know if you have any special requests or dietary requirements..."
                                className="bg-[#121212] border-gray-800 text-white rounded-none focus:border-white focus:ring-0 min-h-[120px]"
                                />
                                <InputError message={errors.note} />
                            </motion.div>

                            <motion.div
                              className="bg-[#121212] border border-gray-800 p-4 mt-6 relative overflow-hidden"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.4 }}
                            >
                              {/* Animated highlight effect */}
                              <motion.div
                                className="absolute inset-0 bg-white/5"
                                animate={{
                                  x: ["-100%", "100%"],
                                }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 3,
                                  ease: "easeInOut",
                                }}
                              ></motion.div>

                              <h3 className="font-medium mb-2 relative">Reservation Summary</h3>
                              <div className="space-y-2 text-gray-400 relative">
                                <div className="flex justify-between">
                                  <span>Date:</span>
                                  <span className="text-white">{formatDate(data.tanggal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Time:</span>
                                  <span className="text-white">{data.waktu}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Party Size:</span>
                                  <span className="text-white">{data.jumlah_orang} people</span>
                                </div>
                            </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Navigation Buttons with enhanced animations */}
                      <div className="flex justify-between mt-8">
                        {currentStep > 1 ? (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              onClick={prevStep}
                              className="border-gray-700 text-white hover:bg-gray-800 rounded-none h-12 px-6 relative overflow-hidden group"
                            >
                              <span className="relative z-10">Back</span>
                              <motion.div
                                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                                initial={{ x: "100%" }}
                                whileHover={{ x: "0%" }}
                                transition={{ duration: 0.6 }}
                              />
                            </Button>
                          </motion.div>
                        ) : (
                          <div></div>
                        )}

                        {currentStep < 3 ? (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          >
                            <Button
                              type="button"
                              onClick={nextStep}
                              className="bg-white text-black hover:bg-gray-200 rounded-none h-12 px-6 relative overflow-hidden group"
                              disabled={
                                (currentStep === 1 && (!data.tanggal || !data.waktu)) ||
                                (currentStep === 2 && !data.jumlah_orang)
                              }
                            >
                              <span className="flex items-center relative z-10">
                                Continue
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </span>
                              <motion.div
                                className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "0%" }}
                                transition={{ duration: 0.6 }}
                              />
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          >
                            <Button
                              type="button"
                              onClick={handleSubmit}
                              className="bg-white text-black hover:bg-gray-200 rounded-none h-12 px-8 relative overflow-hidden"
                              disabled={!data.tanggal || !data.waktu || !data.jumlah_orang}
                            >
                              <span className="flex items-center relative z-10">
                                Complete Reservation
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </span>
                              <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-white via-gray-200 to-white"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 2,
                                  ease: "linear",
                                }}
                                style={{ opacity: 0.3 }}
                              />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </div>
                </div>
            </main>

      <Footer />
        </>
  )
} 
