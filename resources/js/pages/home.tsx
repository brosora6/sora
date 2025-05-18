"use client"

import type React from "react"

import { Head } from "@inertiajs/react"
import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  Star,
  ArrowRight,
  Utensils,
  Plus,
  LoaderCircle,
  ChevronLeft,
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence, type PanInfo } from "framer-motion"
import { usePage } from "@inertiajs/react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useTranslation } from "@/contexts/TranslationContext"

// Configure axios
axios.defaults.withCredentials = true
axios.defaults.headers.common["X-CSRF-TOKEN"] = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content")
axios.defaults.headers.common["Accept"] = "application/json"

interface HomeProps {
  auth: {
    user: any
  }
  recommendedMenus?: {
    id: number
    name: string
    price: number
    desc?: string
    gambar: string
    total_purchased: number
    stok: number
    status: string
  }[]
}

export default function Home({ auth, recommendedMenus = [] }: HomeProps) {
  const { t } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [menus, setMenus] = useState(recommendedMenus)
  const heroRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const featuredMenuRef = useRef<HTMLDivElement>(null)
  const [dragStartX, setDragStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(heroScrollProgress, [0, 1], [1, 0])
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.8])
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 100])

  const { url } = usePage().props
  const route = (routeName: string, params: object = {}) => {
    // Map route names to their actual paths
    const routes: { [key: string]: string } = {
      "customer.login": "/customer/login",
      "customer.register": "/customer/register",
      menu: "/menu",
      Reservation: "/reservations/create",
      home: "/",
    }

    // Get the base path
    const path = routes[routeName] || `/${routeName}`

    // Add query parameters if any
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams(params as Record<string, string>)
      return `${path}?${queryParams.toString()}`
    }

    return path
  }

  useEffect(() => {
    setIsLoaded(true)
    setMenus(recommendedMenus)

    // Handle video loading
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {
        // Handle autoplay failure silently
      })
    }

    // Auto-rotate featured menu items
    if (recommendedMenus && recommendedMenus.length > 0) {
      const interval = setInterval(() => {
        setActiveMenuIndex((prev) => (prev + 1) % recommendedMenus.length)
      }, 20000)
      return () => clearInterval(interval)
    }

    // Cleanup video on component unmount
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
        videoRef.current.load()
      }
    }
  }, [recommendedMenus])

  // Parallax effect for reservation section
  const reservationRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: reservationScrollProgress } = useScroll({
    target: reservationRef,
    offset: ["start end", "end start"],
  })
  const reservationY = useTransform(reservationScrollProgress, [0, 1], [100, -100])

  const handleAddToCart = async (menuId: number) => {
    if (!auth.user) {
      toast.error("Please log in to add items to cart")
      window.location.href = route("customer.login")
      return
    }

    try {
      setAddingToCart(menuId)
      await axios.post("/api/carts", {
        menu_id: menuId,
        quantity: 1,
      })

      // Update cart count with animation
      setCartCount((prev) => prev + 1)

      // Update menu stock locally
      setMenus((prevMenus) =>
        prevMenus.map((menu) => {
          if (menu.id === menuId) {
            return { ...menu, stok: menu.stok - 1 }
          }
          return menu
        }),
      )

      toast.success("Item added to cart successfully")
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        window.location.href = route("customer.login")
      } else if (error.response?.status === 422) {
        toast.error(error.response.data.message || "Validation error")
      } else {
        toast.error(error.response?.data?.message || "Failed to add item to cart")
      }
    } finally {
      setAddingToCart(null)
    }
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent | PointerEvent) => {
    setIsDragging(true)
    // Get the starting position
    if ("touches" in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }
  }

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    // Determine if we should navigate based on drag distance
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        // Dragged right - go to previous
        setActiveMenuIndex((prev) => (prev === 0 ? menus.length - 1 : prev - 1))
      } else {
        // Dragged left - go to next
        setActiveMenuIndex((prev) => (prev + 1) % menus.length)
      }
    }
  }

  const goToPrevious = () => {
    setActiveMenuIndex((prev) => (prev === 0 ? menus.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveMenuIndex((prev) => (prev + 1) % menus.length)
  }

  return (
    <>
      <Head title="Home" />
      <Navbar auth={auth} cartCount={cartCount} />

      <main className="bg-[#0a0a0a] text-white overflow-hidden">
        {/* Hero Section with Enhanced Animation */}
        <motion.div
          ref={heroRef}
          className="relative min-h-[100svh] h-screen w-full"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Hero Background Video with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 z-10"></div>
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/videos/masak.mp4" type="video/mp4" />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/horde1.jpg-M9FqtdHbTEKOupNuwHndNNdbeNZr2A.jpeg"
                alt="Restaurant Background"
                className="w-full h-full object-cover"
              />
            </video>
          </div>

          {/* Hero Content with Staggered Animation */}
          <div className="relative z-20 flex flex-col items-center justify-center min-h-[600px] h-full w-full container mx-auto">
            <AnimatePresence>
              {isLoaded && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-4 xs:mb-5 sm:mb-6 lg:mb-8"
                  >
                    <motion.div
                      className="absolute -inset-1.5 xs:-inset-2 sm:-inset-2.5 lg:-inset-3 rounded-full bg-white/10"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                    <div className="relative z-10 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                      <Utensils className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-amber-400" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center w-full"
                  >
                    <h1 className="text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-[95%] xs:max-w-[90%] sm:max-w-[85%] lg:max-w-4xl mx-auto leading-[1.2] xs:leading-[1.15] sm:leading-[1.1]">
                      <span className="block mb-0.5 xs:mb-1 sm:mb-2">{t("hero.title.authentic")}</span>
                      <span className="block text-amber-400 mb-0.5 xs:mb-1 sm:mb-2">{t("hero.title.indonesian")}</span>
                      <span className="block text-gray-300">{t("hero.title.culinary")}</span>
                    </h1>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="mt-4 xs:mt-5 sm:mt-6 lg:mt-8 text-sm xs:text-base sm:text-lg lg:text-xl text-gray-300 max-w-[90%] xs:max-w-[85%] sm:max-w-xl lg:max-w-2xl mx-auto font-light leading-relaxed"
                    >
                      {t("hero.description")}
                    </motion.p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-6 xs:mt-7 sm:mt-8 lg:mt-10 w-full sm:w-auto flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 px-4 sm:px-0 max-w-[90%] xs:max-w-lg sm:max-w-none mx-auto"
                  >
                    <Button
                      className="w-full sm:w-auto px-5 xs:px-6 sm:px-8 lg:px-10 py-3.5 xs:py-4 sm:py-5 lg:py-6 bg-amber-500 text-black font-medium rounded-none hover:bg-amber-400 transition-all group overflow-hidden relative text-[13px] xs:text-sm sm:text-base"
                      onClick={() => (window.location.href = route("menu"))}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {t("hero.explore_menu")}
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                        >
                          <Utensils className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                        </motion.div>
                      </span>
                      <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                    <Button
                      className="w-full sm:w-auto px-5 xs:px-6 sm:px-8 lg:px-10 py-3.5 xs:py-4 sm:py-5 lg:py-6 border-2 border-white text-white font-medium rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-300 group overflow-hidden relative text-[13px] xs:text-sm sm:text-base"
                      onClick={() => {
                        if (!auth.user) {
                          window.location.href = route("customer.login")
                        } else {
                          window.location.href = route("Reservation")
                        }
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {t("hero.make_reservation")}
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            repeatType: "reverse",
                            delay: 0.2,
                          }}
                        >
                          <Calendar className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                        </motion.div>
                      </span>
                      <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </motion.div>

                  {/* Scroll Indicator - Now below buttons */}
                  <motion.div
                    className="mt-8 xs:mt-9 sm:mt-10 lg:mt-12 flex flex-col items-center pointer-events-none select-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                  >
                    <motion.p
                      className="text-[8px] xs:text-[9px] sm:text-[10px] lg:text-xs text-gray-400/60 mb-1 sm:mb-1.5 font-light tracking-wider uppercase"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    >
                      {t("hero.scroll")}
                    </motion.p>
                    <motion.div
                      className="flex flex-col items-center gap-0.5 xs:gap-1"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.2 }}
                    >
                      <div className="w-[1px] h-3 xs:h-4 sm:h-5 lg:h-6 bg-gradient-to-b from-white/30 to-transparent" />
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                        className="w-0.5 h-0.5 xs:w-1 xs:h-1 rounded-full bg-white/30"
                      />
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Featured Menu Section with Interactive Elements */}
        {recommendedMenus && recommendedMenus.length > 0 && (
          <div ref={menuRef} className="py-32 px-4 sm:px-6 lg:px-8 relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-10 w-64 h-64 rounded-full bg-amber-500/5"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              />
              <motion.div
                className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-amber-500/5"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              />
            </div>

            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-block mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <Star className="h-10 w-10 text-amber-500 mx-auto" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("featured.title")}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  {t("featured.description")}
                </p>
                <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
              </motion.div>

              {/* Swipeable Card Carousel */}
              <div className="relative mb-20">
                {/* Navigation Arrows */}
                <div className="absolute top-1/2 left-4 z-30 transform -translate-y-1/2 hidden md:block">
                  <button
                    onClick={goToPrevious}
                    className="w-12 h-12 rounded-full bg-black/50 hover:bg-amber-500 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous item"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 right-4 z-30 transform -translate-y-1/2 hidden md:block">
                  <button
                    onClick={goToNext}
                    className="w-12 h-12 rounded-full bg-black/50 hover:bg-amber-500 text-white flex items-center justify-center transition-colors"
                    aria-label="Next item"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Swipeable Container */}
                <motion.div
                  ref={featuredMenuRef}
                  className="overflow-hidden relative"
                  style={{ position: "relative" }}
                >
                  <AnimatePresence mode="wait">
                    {recommendedMenus.map(
                      (menu, index) =>
                        index === activeMenuIndex && (
                          <motion.div
                            key={menu.id}
                            className="max-w-md mx-auto px-4"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            style={{ touchAction: "pan-y" }}
                          >
                            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all duration-300 border border-amber-500/20 relative">
                              {/* Decorative Elements */}
                              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                              
                              <div className="relative aspect-[16/9] overflow-hidden">
                                <motion.img
                                  src={`/storage/${menu.gambar}`}
                                  alt={menu.name}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ duration: 0.3 }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/images/default-menu.jpg"
                                  }}
                                />
                                {/* Image Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                
                                {menu.stok <= 3 && menu.stok > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute top-4 left-4"
                                  >
                                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 text-xs shadow-lg">
                                      {t("featured.low_stock").replace("{count}", menu.stok.toString())}
                                    </Badge>
                                  </motion.div>
                                )}
                                {menu.stok === 0 && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute inset-0 bg-black/70 flex items-center justify-center"
                                  >
                                    <Badge className="bg-red-900 hover:bg-red-900 text-white text-base py-0.5 px-2 shadow-lg">
                                      {t("featured.out_of_stock")}
                                    </Badge>
                                  </motion.div>
                                )}
                                <motion.div
                                  className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5 rounded-lg shadow-lg"
                                  initial={{ y: -20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                  <span className="text-xs font-medium">
                                    {menu.total_purchased} {t("featured.ordered")}
                                  </span>
                                </motion.div>
                              </div>

                              <div className="p-4 relative">
                                {/* Content Background Glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                                
                                <div className="mb-2 relative">
                                  <h3 className="text-lg font-bold text-white mb-1">{menu.name}</h3>
                                  <p className="text-base font-bold text-amber-400">
                                    Rp {menu.price.toLocaleString("id-ID")}
                                  </p>
                                </div>
                                <div className="w-8 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 mb-2"></div>
                                {menu.desc && (
                                  <p className="text-gray-300 text-xs mb-3 line-clamp-2">{menu.desc}</p>
                                )}

                                {auth.user ? (
                                  menu.stok > 0 ? (
                                    <Button
                                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 rounded-lg py-2 text-xs group relative overflow-hidden shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                                      onClick={() => handleAddToCart(menu.id)}
                                      disabled={addingToCart === menu.id}
                                    >
                                      {addingToCart === menu.id ? (
                                        <span className="relative z-10 flex items-center justify-center">
                                          <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                          {t("featured.adding_to_cart")}
                                        </span>
                                      ) : (
                                        <span className="relative z-10 flex items-center justify-center">
                                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                                          {t("featured.add_to_cart")}
                                        </span>
                                      )}
                                      <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </Button>
                                  ) : (
                                    <Button
                                      className="w-full bg-gray-800 text-gray-400 hover:bg-gray-800 rounded-lg py-2 text-xs cursor-not-allowed shadow-lg"
                                      disabled
                                    >
                                      {t("featured.out_of_stock")}
                                    </Button>
                                  )
                                ) : (
                                  <Button
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 rounded-lg py-2 text-xs group relative overflow-hidden shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                                    onClick={() => (window.location.href = route("customer.login"))}
                                  >
                                    <span className="relative z-10 flex items-center justify-center">
                                      {t("featured.login_to_order")}
                                      <ChevronRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ),
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Swipe Indicator for Mobile */}
                <div className="mt-6 text-center text-sm text-gray-400 lg:hidden">
                  <p>{t("featured.swipe_hint")}</p>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-3 mt-12">
                  {recommendedMenus.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeMenuIndex ? "bg-amber-500 scale-125" : "bg-gray-600"
                      }`}
                      onClick={() => setActiveMenuIndex(index)}
                      aria-label={`Go to item ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* View All Menu Button */}
              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Button
                  className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-none px-10 py-6 text-lg transition-all duration-300 group"
                  onClick={() => (window.location.href = route("menu"))}
                >
                  <span className="flex items-center">
                    {t("featured.view_all")}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Reservation Section with Parallax */}
        <motion.div ref={reservationRef} className="relative py-32 overflow-hidden" style={{ position: "relative" }}>
          {/* Parallax Background */}
          <motion.div className="absolute inset-0 z-0" style={{ y: reservationY }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10"></div>
            <img src="/images/resto1.jpg" alt="Reservation Background" className="w-full h-full object-cover" />
          </motion.div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-block mb-6"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <Calendar className="h-12 w-12 text-amber-500" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("reserve.title")}</h2>
                <div className="w-20 h-1 bg-amber-500 mb-8"></div>
                <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                  {t("reserve.description")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-black/30 backdrop-blur-sm"
                    whileHover={{ y: -5, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Calendar className="h-8 w-8 text-amber-500 mb-4" />
                    <div>
                      <p className="font-medium text-lg mb-1">{t("reserve.easy_booking")}</p>
                      <p className="text-sm text-gray-400">{t("reserve.easy_booking_desc")}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-black/30 backdrop-blur-sm"
                    whileHover={{ y: -5, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="h-8 w-8 text-amber-500 mb-4" />
                    <div>
                      <p className="font-medium text-lg mb-1">{t("reserve.flexible_hours")}</p>
                      <p className="text-sm text-gray-400">{t("reserve.flexible_hours_desc")}</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-black/30 backdrop-blur-sm"
                    whileHover={{ y: -5, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="h-8 w-8 text-amber-500 mb-4" />
                    <div>
                      <p className="font-medium text-lg mb-1">{t("reserve.group_friendly")}</p>
                      <p className="text-sm text-gray-400">{t("reserve.group_friendly_desc")}</p>
                    </div>
                  </motion.div>
                </div>
                <Button
                  className="bg-amber-500 text-black hover:bg-amber-400 rounded-none px-10 py-7 text-lg group relative overflow-hidden"
                  onClick={() => {
                    if (!auth.user) {
                      window.location.href = route("customer.login")
                    } else {
                      window.location.href = route("Reservation")
                    }
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    {t("reserve.make_reservation")}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="aspect-[4/3] relative z-10 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src="/images/resto2.jpg" alt="Restaurant Interior" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-8 -right-8 w-64 h-64 bg-amber-500/20 -z-10"
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.div
                  className="absolute -top-8 -left-8 w-64 h-64 bg-amber-500/10 -z-10"
                  animate={{
                    rotate: [0, -5, 0, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          className="py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative" }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              className="inline-block mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Star className="h-10 w-10 text-amber-500 mx-auto fill-amber-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-16">{t("testimonials.title")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Andi Wijaya",
                  text: "The flavors at Rumah Makan Salwa are incredible! Every dish tastes authentic and reminds me of my grandmother's cooking. The rendang is a must-try!",
                  role: "Food Blogger",
                },
                {
                  name: "Sarah Tanoto",
                  text: "Perfect place for family gatherings. The atmosphere is warm and inviting, and the staff is extremely attentive. We've made this our regular weekend spot.",
                  role: "Regular Customer",
                },
                {
                  name: "Michael Hartono",
                  text: "As someone who travels frequently, I can confidently say that Rumah Makan Salwa offers some of the best Indonesian cuisine I've ever tasted. Truly exceptional!",
                  role: "Business Traveler",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-[#121212] p-8 relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="mb-6">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500 inline-block" />
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500 inline-block" />
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500 inline-block" />
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500 inline-block" />
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500 inline-block" />
                  </div>
                  <p className="text-gray-300 mb-8 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-bold text-lg">{testimonial.name}</p>
                      <p className="text-amber-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Button
                className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-none px-10 py-6 text-lg transition-all duration-300"
                onClick={() => (window.location.href = route("menu"))}
              >
                <span className="flex items-center">
                  {t("testimonials.visit_us")}
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Add noise texture SVG */}
      <svg className="hidden">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
        </filter>
      </svg>
    </>
  )
}
