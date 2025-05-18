"use client"

import { Head, Link } from "@inertiajs/react"
import { CheckCircle, ArrowRight, Calendar, Receipt, ChevronRight, MessageSquare, Phone, CalendarDays, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import React, { Component } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

interface SuccessProps {
  auth: {
    user: any
  }
  reservation?: {
    order_number: string
    tanggal: string
    waktu: string
    jumlah_orang: number
    note: string
    status: "pending" | "confirmed" | "rejected"
  }
  whatsappNumber?: string
}

interface SuccessState {
  showConfetti: boolean
}

function withTranslation(WrappedComponent: any) {
  return function WithTranslationComponent(props: any) {
    const { t } = useTranslation()
    return <WrappedComponent {...props} t={t} />
  }
}

class Success extends Component<SuccessProps & { t: any }, SuccessState> {
  constructor(props: SuccessProps & { t: any }) {
    super(props)
    this.state = {
      showConfetti: true
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showConfetti: false })
    }, 3000)
  }

  formatDate = (date: string) => {
    const { t } = this.props
    const d = new Date(date)
    const weekday = t(`reservation.date.weekdays.${d.getDay()}`)
    const month = t(`reservation.date.months.${d.getMonth()}`)
    const day = d.getDate()
    const year = d.getFullYear()
    
    return t('reservation.date.format')
      .replace('{weekday}', weekday)
      .replace('{day}', day.toString())
      .replace('{month}', month)
      .replace('{year}', year.toString())
  }

  formatTime = (time: string) => {
    const date = new Date(`2000-01-01T${time}`)
    const hour = date.getHours()
    let period = ""

    if (hour >= 5 && hour < 12) {
      period = this.props.t("reservation.time.morning")
    } else if (hour >= 12 && hour < 15) {
      period = this.props.t("reservation.time.afternoon")
    } else if (hour >= 15 && hour < 18) {
      period = this.props.t("reservation.time.evening")
    } else {
      period = this.props.t("reservation.time.night")
    }

    const timeFormat = this.props.t("reservation.time.format")
    const formattedTime = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: timeFormat.includes("A")
    }).format(date)

    return `${formattedTime} (${period})`
  }

  render() {
    const { auth, reservation, whatsappNumber, t } = this.props
    const { showConfetti } = this.state
    const orderNumber = reservation?.order_number || new URLSearchParams(window.location.search).get('order') || 'RES-000000'
    const whatsappNumberToUse = whatsappNumber?.replace(/[^0-9]/g, '') || ''

    const openWhatsApp = () => {
      const message = t("reservation.whatsapp.message", {
        name: auth.user.name,
        orderNumber: orderNumber,
        date: this.formatDate(reservation?.tanggal || ''),
        time: this.formatTime(reservation?.waktu || ''),
        people: reservation?.jumlah_orang,
        note: reservation?.note
      })
      console.log('WhatsApp Message:', message)
      const cleanNumber = whatsappNumberToUse.replace(/\D/g, '')
      const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
      console.log('WhatsApp URL:', url)
      if (/Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = url
      } else {
        window.open(url, '_blank')
      }
    }

    return (
      <>
        <Head title={t("reservation.success.title")} />
        <Navbar auth={auth} />

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
                    "#FFD700",
                    "#FFA500",
                    "#FF4500",
                    "#ffffff",
                    "#E6E6FA",
                  ][Math.floor(Math.random() * 5)],
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
              <div className="bg-gradient-to-br from-[#1a1a1a] via-[#161616] to-[#0f0f0f] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="relative h-72 bg-gradient-to-b from-[#1a1a1a] to-transparent overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
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

                      <motion.div
                        className="relative z-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-6"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                      >
                        <CheckCircle className="h-20 w-20 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-center"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text">
                      {t("reservation.success.title")}
                    </h1>

                    <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="text-left">
                          <p className="text-gray-400 text-sm font-medium">{t("reservation.success.reservation_number")}</p>
                          <p className="text-xl font-mono font-bold text-white">{orderNumber}</p>
                        </div>
                        <motion.div 
                          className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <Calendar className="h-4 w-4 text-amber-400" />
                          <span className="text-amber-400 text-sm font-medium">
                            {reservation?.status === "confirmed" ? t("reservation.status.confirmed_status") :
                             reservation?.status === "rejected" ? t("reservation.status.rejected_status") :
                             t("reservation.status.pending_status")}
                          </span>
                        </motion.div>
                      </div>

                      {reservation && (
                        <div className="space-y-4 text-left border-t border-gray-800 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 text-sm">{t("reservation.summary.date")}</p>
                              <p className="text-white font-medium">{this.formatDate(reservation.tanggal)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">{t("reservation.summary.time")}</p>
                              <p className="text-white font-medium">{this.formatTime(reservation.waktu)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">{t("reservation.summary.party_size")}</p>
                              <p className="text-white font-medium">{reservation.jumlah_orang} {t("reservation.summary.people")}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <p className="text-gray-300 leading-relaxed">
                          {t("reservation.success.message")}
                        </p>
                        {whatsappNumber && (
                          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-sm text-amber-400 mb-2">
                              {t("reservation.success.need_help")}
                            </p>
                            <Button
                              onClick={openWhatsApp}
                              className="w-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center gap-2 h-10"
                            >
                              <Phone className="h-4 w-4" />
                              {t("reservation.success.contact_whatsapp")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button asChild className="bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-12">
                        <Link href={route("profile.edit", { tab: "activity" })} className="flex items-center justify-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {t("reservation.success.view_reservations")}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg h-12"
                      >
                        <Link href={route("reservation.create")} className="flex items-center justify-center gap-2">
                          <PlusCircle className="h-4 w-4" />
                          {t("reservation.success.new_reservation")}
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
}

export default withTranslation(Success)