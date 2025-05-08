"use client"

import { Head } from "@inertiajs/react"
import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, ChevronRight, Star, ArrowRight, Utensils, Plus, LoaderCircle } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { usePage } from "@inertiajs/react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

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

export default function Home({ auth, recommendedMenus }: HomeProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
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
      'customer.login': '/customer/login',
      'customer.register': '/customer/register',
      'menu': '/menu',
      'Reservation': '/reservations/create',
      'home': '/'
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

    // Auto-rotate featured menu items
    if (recommendedMenus && recommendedMenus.length > 0) {
      const interval = setInterval(() => {
        setActiveMenuIndex((prev) => (prev + 1) % recommendedMenus.length)
      }, 5000)
      return () => clearInterval(interval)
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

  return (
    <>
      <Head title="Home" />
      <Navbar auth={auth} />

      <main className="bg-[#0a0a0a] text-white overflow-hidden">
        {/* Hero Section with Enhanced Animation */}
        <motion.div
          ref={heroRef}
          className="relative h-screen"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Hero Background Video with Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10"></div>
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
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
            <AnimatePresence>
              {isLoaded && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-8"
                  >
                    <motion.div
                      className="absolute -inset-4 rounded-full bg-white/10"
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
                    <div className="relative z-10 w-28 h-28 flex items-center justify-center">
                      <Utensils className="w-20 h-20 text-amber-400" />
                    </div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white text-center max-w-5xl"
                  >
                    AUTHENTIC <span className="text-amber-400">INDONESIAN</span> <br />
                    <span className="text-gray-300">CULINARY EXPERIENCE</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-8 text-lg md:text-xl text-gray-300 text-center max-w-2xl font-light"
                  >
                    Discover the rich flavors and traditions of Indonesian cuisine in a modern, inviting atmosphere at
                    Rumah Makan Salwa.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-12 flex flex-col sm:flex-row gap-5"
                  >
                    <Button
                      className="px-8 py-7 bg-amber-500 text-black font-medium rounded-none hover:bg-amber-400 transition-all group overflow-hidden relative"
                      onClick={() => (window.location.href = route("menu"))}
                    >
                      <span className="relative z-10 flex items-center">
                        EXPLORE MENU
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                        >
                          <Utensils className="h-5 w-5" />
                        </motion.div>
                      </span>
                      <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                    <Button
                      className="px-8 py-7 border-2 border-white text-white font-medium rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-300 group overflow-hidden relative"
                      onClick={() => {
                        if (!auth.user) {
                          window.location.href = route("customer.login")
                        } else {
                          window.location.href = route("Reservation")
                        }
                      }}
                    >
                      <span className="relative z-10 flex items-center">
                        MAKE RESERVATION
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
                          <Calendar className="h-5 w-5" />
                        </motion.div>
                      </span>
                      <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <motion.p
                className="text-sm text-gray-400 mb-2"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                Scroll to explore
              </motion.p>
              <motion.div
                className="w-0.5 h-10 bg-gradient-to-b from-white to-transparent"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
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
                <h2 className="text-4xl md:text-5xl font-bold mb-6">MOST LOVED MENU</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  Our most celebrated creations, crafted with passion and enjoyed by thousands of satisfied customers.
                </p>
                <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
              </motion.div>

              {/* Featured Menu Item - Large Display */}
              <div className="hidden lg:block relative mb-20">
                <AnimatePresence mode="wait">
                  {recommendedMenus.map(
                    (menu, index) =>
                      index === activeMenuIndex && (
                        <motion.div
                          key={menu.id}
                          className="grid grid-cols-2 gap-12 items-center"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="relative">
                            <motion.div
                              className="absolute -inset-4 border border-amber-500/20"
                              animate={{
                                scale: [1, 1.03, 1],
                              }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            />
                            <div className="aspect-[4/3] overflow-hidden relative">
                              <motion.img
                                src={`/storage/${menu.gambar}`}
                                alt={menu.name}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.7 }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/images/default-menu.jpg"
                                }}
                              />
                              {menu.stok <= 3 && menu.stok > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="absolute top-4 left-4"
                                >
                                  <Badge className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-sm">
                                    Low Stock: {menu.stok} left
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
                                  <Badge className="bg-red-900 hover:bg-red-900 text-white text-lg py-1 px-3">
                                    Out of Stock
                                  </Badge>
                                </motion.div>
                              )}
                              <motion.div
                                className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 flex items-center gap-2"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium">{menu.total_purchased} ordered</span>
                              </motion.div>
                            </div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          >
                            <h3 className="text-3xl font-bold mb-4">{menu.name}</h3>
                            <div className="w-16 h-0.5 bg-amber-500 mb-6"></div>
                            {menu.desc && <p className="text-gray-300 text-lg mb-8 leading-relaxed">{menu.desc}</p>}
                            <p className="text-2xl font-bold text-amber-400 mb-8">
                              Rp {menu.price.toLocaleString("id-ID")}
                            </p>

                            {auth.user ? (
                              menu.stok > 0 ? (
                                <Button
                                  className="bg-amber-500 text-black hover:bg-amber-400 rounded-none px-8 py-6 text-lg group relative overflow-hidden"
                                  onClick={() => handleAddToCart(menu.id)}
                                  disabled={addingToCart === menu.id}
                                >
                                  {addingToCart === menu.id ? (
                                    <span className="relative z-10 flex items-center">
                                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                      Adding to Cart...
                                    </span>
                                  ) : (
                                    <span className="relative z-10 flex items-center">
                                      <Plus className="mr-2 h-5 w-5" />
                                      Add to Cart
                                    </span>
                                  )}
                                  <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Button>
                              ) : (
                                <Button
                                  className="bg-gray-800 text-gray-400 hover:bg-gray-800 rounded-none px-8 py-6 text-lg cursor-not-allowed"
                                  disabled
                                >
                                  Out of Stock
                                </Button>
                              )
                            ) : (
                              <Button
                                className="bg-amber-500 text-black hover:bg-amber-400 rounded-none px-8 py-6 text-lg group relative overflow-hidden"
                                onClick={() => (window.location.href = route("customer.login"))}
                              >
                                <span className="relative z-10 flex items-center">
                                  Login to Order
                                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                                <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                              </Button>
                            )}
                          </motion.div>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-3 mt-12">
                  {recommendedMenus.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeMenuIndex ? "bg-amber-500 scale-125" : "bg-gray-600"
                      }`}
                      onClick={() => setActiveMenuIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Menu Grid for Mobile/Tablet */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-8">
                {recommendedMenus.map((menu, index) => (
                  <motion.div
                    key={menu.id}
                    className="bg-[#121212] overflow-hidden group relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={`/storage/${menu.gambar}`}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/images/default-menu.jpg"
                        }}
                      />
                      {menu.stok <= 3 && menu.stok > 0 && (
                        <Badge className="absolute top-4 left-4 bg-amber-600 hover:bg-amber-700 text-white">
                          Low Stock: {menu.stok} left
                        </Badge>
                      )}
                      {menu.stok === 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <Badge className="bg-red-900 hover:bg-red-900 text-white text-lg py-1 px-3">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 text-sm flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>{menu.total_purchased}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{menu.name}</h3>
                        <p className="text-amber-400 font-bold">Rp {menu.price.toLocaleString("id-ID")}</p>
                      </div>
                      {menu.desc && <p className="text-gray-400 mb-4 font-light line-clamp-2">{menu.desc}</p>}

                      {auth.user ? (
                        menu.stok > 0 ? (
                          <Button
                            className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-none group"
                            onClick={() => handleAddToCart(menu.id)}
                            disabled={addingToCart === menu.id}
                          >
                            {addingToCart === menu.id ? (
                              <span className="flex items-center justify-center">
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Plus className="mr-2 h-4 w-4" />
                                Add to Cart
                              </span>
                            )}
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-gray-800 text-gray-400 hover:bg-gray-800 rounded-none cursor-not-allowed"
                            disabled
                          >
                            Out of Stock
                          </Button>
                        )
                      ) : (
                        <Button
                          className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-none"
                          onClick={() => (window.location.href = route("customer.login"))}
                        >
                          Login to Order
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
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
                    View Complete Menu
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
        <motion.div ref={reservationRef} className="relative py-32 overflow-hidden">
          {/* Parallax Background */}
          <motion.div className="absolute inset-0 z-0" style={{ y: reservationY }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10"></div>
            <img
              src="/images/resto1.jpg"
              alt="Reservation Background"
              className="w-full h-full object-cover"
            />
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
                <h2 className="text-4xl md:text-5xl font-bold mb-6">RESERVE YOUR TABLE</h2>
                <div className="w-20 h-1 bg-amber-500 mb-8"></div>
                <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                  Experience the perfect blend of traditional Indonesian flavors and modern dining atmosphere. Book your
                  table now for an unforgettable culinary journey at Rumah Makan Salwa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-black/30 backdrop-blur-sm"
                    whileHover={{ y: -5, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Calendar className="h-8 w-8 text-amber-500 mb-4" />
                    <div>
                      <p className="font-medium text-lg mb-1">Easy Booking</p>
                      <p className="text-sm text-gray-400">Simple reservation process</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-black/30 backdrop-blur-sm"
                    whileHover={{ y: -5, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="h-8 w-8 text-amber-500 mb-4" />
                    <div>
                      <p className="font-medium text-lg mb-1">Flexible Hours</p>
                      <p className="text-sm text-gray-400">Open 7 days a week</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center text-center p-6 bg-black/30 backdrop-blur-sm"
                    whileHover={{ y: -5, backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Users className="h-8 w-8 text-amber-500 mb-4" />
                    <div>
                      <p className="font-medium text-lg mb-1">Group Friendly</p>
                      <p className="text-sm text-gray-400">Perfect for gatherings</p>
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
                    Make a Reservation
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
                  <img
                    src="/images/resto2.jpg"
                    alt="Restaurant Interior"
                    className="w-full h-full object-cover"
                  />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-16">WHAT OUR GUESTS SAY</h2>

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
                  Visit Us Today
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
