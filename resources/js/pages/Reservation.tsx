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
  ChevronLeft,
  Utensils,
  Info,
} from "lucide-react"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

interface OpeningHours {
  [key: string]: string[]
}

interface ReservationProps {
  auth: {
    user: any
  }
  reservation?: {
    id: number
    order_number: string
    status: "pending" | "confirmed" | "rejected"
    staff_whatsapp: string | null
  }
  openingHours?: OpeningHours
  whatsappNumber?: string
}

type ReservationForm = {
  tanggal: string
  waktu: string
  jumlah_orang: number
  note: string
}

// Declare route function (replace with actual implementation if needed)
declare function route(name: string, params?: any): string

export default function Reservation({ auth, reservation, openingHours = {}, whatsappNumber }: ReservationProps) {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)
  const [animateBackground, setAnimateBackground] = useState(false)
  const [isNewReservation, setIsNewReservation] = useState(false)

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

  // Reset isNewReservation when component unmounts
  useEffect(() => {
    return () => {
      setIsNewReservation(false)
    }
  }, [])

  // Handle form navigation between steps
  const handleStepNavigation = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1 && (!data.tanggal || !data.waktu)) {
        return
      }
      if (currentStep === 2 && !data.jumlah_orang) {
        return
      }
      nextStep()
    }
  }

  // Handle final form submission - only called when explicitly submitting on step 3
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data.tanggal || !data.waktu || !data.jumlah_orang) {
      return
    }

    post(route("reservation.store"), {
      preserveScroll: true,
      onError: (errors) => {
        console.error("Reservation failed:", errors)
      },
    })
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
    const englishDay = selectedDay || ""
    if (!actualOpeningHours[englishDay]) return null
    return actualOpeningHours[englishDay]
  }

  const hours = getCurrentDayHours()

  // Function to get translated day name
  const getTranslatedDay = (day: string) => {
    const dayKey = day.toLowerCase()
    return t(`days.${dayKey}`)
  }

  // Function to format date that returns English day name for internal use
  const formatDateForInternal = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  // Function to format date for display that uses translated day name
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const dayName = getTranslatedDay(date.toLocaleDateString("en-US", { weekday: "long" }))
    return `${dayName}, ${date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric"
    })}`
  }

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
        return
      }
      if (currentStep === 2 && !data.jumlah_orang) {
        return
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

  const whatsappNumberToUse = whatsappNumber?.replace(/[^0-9]/g, '') || ''

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumberToUse}`
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = url
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <Head title={t("reservation.title")} />
      <Navbar auth={auth} />

      <main className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white min-h-screen pt-12 sm:pt-20 lg:pt-24 pb-6 sm:pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 sm:mb-8 lg:mb-12 text-center relative overflow-hidden py-6 sm:py-12 lg:py-16 rounded-lg sm:rounded-2xl bg-gradient-to-r from-amber-900/20 to-amber-800/10"
          >
            <motion.div className="relative z-10 px-3 sm:px-6">
              <Utensils className="h-10 w-10 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-6 text-amber-400" />
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 relative">
                {t("reservation.title")}
              </h1>
              <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto relative">
                {t("reservation.subtitle")}
              </p>
            </motion.div>
          </motion.div>

          <div className={`grid grid-cols-1 ${!reservation ? 'lg:grid-cols-3' : ''} gap-2 sm:gap-6 lg:gap-8`}>
            {/* Form Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`${!reservation ? 'lg:col-span-2 order-1 lg:order-2' : 'max-w-3xl mx-auto w-full'}`}
            >
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg sm:rounded-xl overflow-hidden">
                {/* Progress Steps */}
                <div className="p-2 sm:p-4 md:p-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    {[
                      { step: 1, icon: Calendar, label: "Date & Time" },
                      { step: 2, icon: Users, label: "Party Size" },
                      { step: 3, icon: MessageSquare, label: "Details" },
                    ].map(({ step, icon: Icon, label }) => (
                      <div key={step} className="flex flex-col items-center relative">
                        <motion.div
                          className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 ${
                            currentStep >= step ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-400"
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="h-3 w-3 sm:h-5 sm:w-5" />
                        </motion.div>
                        <span className="mt-1 sm:mt-2 text-[10px] sm:text-sm font-medium text-center">
                          {step === 1 ? t("reservation.steps.date_time") :
                           step === 2 ? t("reservation.steps.party_size") :
                           t("reservation.steps.details")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Steps */}
                <div className="p-3 sm:p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <Label htmlFor="tanggal" className="text-xs sm:text-base block font-medium text-amber-400/90">
                            {t("reservation.date")}
                          </Label>
                          <div className="relative group">
                            <Calendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-3 sm:h-5 w-3 sm:w-5 transition-transform duration-200 group-hover:scale-110" />
                            <Input
                              id="tanggal"
                              type="date"
                              value={data.tanggal}
                              onChange={(e) => setData("tanggal", e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              required
                              className="bg-[#2a2a2a] border border-amber-500/50 text-white pl-8 sm:pl-10 h-9 sm:h-12 text-xs sm:text-base rounded-lg focus:border-amber-500 focus:ring-amber-500/20 cursor-pointer hover:border-amber-500 hover:bg-[#333333] transition-all duration-200 shadow-sm hover:shadow-md [&::-webkit-calendar-picker-indicator]:bg-amber-500 [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-amber-400 [&::-webkit-calendar-picker-indicator]:transition-colors [&::-webkit-calendar-picker-indicator]:duration-200"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/10 group-hover:to-amber-500/5 transition-all duration-300 pointer-events-none" />
                          </div>
                        </div>

                        {data.tanggal && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 sm:space-y-4"
                          >
                            <p className="text-sm sm:text-lg font-medium">
                              {t("reservation.time_slots_for")} {formatDateForDisplay(data.tanggal)}:
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2">
                              {timeSlots.map((time) => (
                                <motion.button
                                  key={time}
                                  onClick={() => handleTimeSlotSelect(time)}
                                  className={`p-1.5 sm:p-3 text-[10px] sm:text-sm rounded-lg transition-all ${
                                    selectedTimeSlot === time
                                      ? "bg-amber-500 text-black border-amber-500"
                                      : "border border-gray-800 hover:border-amber-500/50 hover:bg-amber-500/10"
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                          <h2 className="text-lg sm:text-2xl font-bold text-center">
                            {t("reservation.party_size.title")}
                          </h2>
                          
                          <div className="flex items-center justify-center gap-4 sm:gap-8">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setData("jumlah_orang", Math.max(1, (data.jumlah_orang || 1) - 1))}
                              className="h-8 w-8 sm:h-12 sm:w-12 rounded-full border-gray-700 text-base sm:text-xl"
                              disabled={data.jumlah_orang <= 1}
                            >
                              -
                            </Button>
                            <span className="text-2xl sm:text-4xl font-bold text-amber-400 min-w-[2ch] sm:min-w-[3ch] text-center">
                              {data.jumlah_orang}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setData("jumlah_orang", Math.min(20, (data.jumlah_orang || 1) + 1))}
                              className="h-8 w-8 sm:h-12 sm:w-12 rounded-full border-gray-700 text-base sm:text-xl"
                              disabled={data.jumlah_orang >= 20}
                            >
                              +
                            </Button>
                          </div>

                          <p className="text-xs sm:text-base text-gray-400 text-center max-w-md">
                            {data.jumlah_orang > 8
                              ? t("reservation.party_size.large_party")
                              : t("reservation.party_size.no_charge")}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 sm:space-y-6"
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <Label htmlFor="note" className="text-xs sm:text-base block font-medium">
                            {t("reservation.special_requests")}
                          </Label>
                          <Input
                            id="note"
                            value={data.note}
                            onChange={(e) => setData("note", e.target.value)}
                            placeholder={t("reservation.special_requests.placeholder")}
                            className="bg-[#121212] border-gray-800 text-xs sm:text-base text-white rounded-lg focus:border-amber-500 focus:ring-amber-500/20 min-h-[80px] sm:min-h-[120px] py-2 px-3"
                          />
                        </div>

                        <div className="bg-[#121212] border border-gray-800 p-3 sm:p-6 rounded-lg space-y-2 sm:space-y-3">
                          <h3 className="text-xs sm:text-base font-medium">{t("reservation.summary.title")}</h3>
                          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-base text-gray-400">
                            <div className="flex justify-between">
                              <span>{t("reservation.summary.date")}</span>
                              <span className="text-amber-400">{formatDateForDisplay(data.tanggal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("reservation.summary.time")}</span>
                              <span className="text-amber-400">{data.waktu}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("reservation.summary.party_size")}</span>
                              <span className="text-amber-400">
                                {data.jumlah_orang} {t("reservation.summary.people")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4 mt-4 sm:mt-8">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="w-full sm:w-auto border-gray-700 text-white hover:bg-amber-500/10 hover:border-amber-500/50 rounded-lg h-9 sm:h-12 px-3 sm:px-6 text-xs sm:text-base"
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t("reservation.buttons.back")}</span>
                        <span className="sm:hidden">Back</span>
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={currentStep === 3 ? handleFinalSubmit : handleStepNavigation}
                      disabled={
                        (currentStep === 1 && (!data.tanggal || !data.waktu)) ||
                        (currentStep === 2 && !data.jumlah_orang) ||
                        processing
                      }
                      className="w-full sm:w-auto bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-9 sm:h-12 px-3 sm:px-6 text-xs sm:text-base"
                    >
                      <span className="flex items-center justify-center">
                        {processing ? (
                          <>
                            <Clock className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                            <span>{t("reservation.buttons.processing")}</span>
                          </>
                        ) : (
                          <>
                            <span>
                              {currentStep === 3
                                ? t("reservation.buttons.complete")
                                : t("reservation.buttons.continue")}
                            </span>
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Opening Hours Column */}
            {!reservation && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1 order-2 lg:order-1"
              >
                <div className="bg-[#1a1a1a] border border-gray-800 p-3 sm:p-6 rounded-lg sm:rounded-xl sticky top-16 sm:top-24 overflow-hidden relative">
                  <h2 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 flex items-center relative">
                    <Clock className="w-3 h-3 sm:w-5 sm:h-5 text-amber-400 mr-1.5 sm:mr-2" />
                    {t("reservation.opening_hours")}
                  </h2>

                  <div className="space-y-1.5 sm:space-y-3 relative">
                    {Object.entries(actualOpeningHours).map(([day, hours], index) => (
                      <motion.div
                        key={day}
                        className={`flex justify-between p-2 sm:p-3 rounded-lg text-xs sm:text-base ${
                          selectedDay === day
                            ? "border-amber-500/50 bg-amber-500/10"
                            : hoveredDay === day
                              ? "border-gray-700 bg-[#1f1f1f]"
                              : "border-gray-800 bg-[#1a1a1a]"
                        } transition-colors duration-200`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(245,158,11,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-medium">{getTranslatedDay(day)}</span>
                        <span className="text-amber-400">
                          {hours[0]} - {hours[1]}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-gray-800 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {whatsappNumber && (
                      <>
                        <h3 className="text-sm sm:text-lg font-medium mb-2 sm:mb-4 flex items-center">
                          <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-amber-400" />
                          {t("reservation.need_assistance")}
                        </h3>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-1.5 sm:gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 group relative overflow-hidden rounded-lg h-9 sm:h-12 text-xs sm:text-base"
                          onClick={openWhatsApp}
                        >
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{t("reservation.contact_whatsapp")}</span>
                        </Button>
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
