"use client"

import type React from "react"
import { Head } from "@inertiajs/react"
import { useState, useRef, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Star, ArrowRight, Utensils, Users, ChevronLeft, Plus, LoaderCircle } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence, type PanInfo } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import axios from "axios"

// Configure axios
axios.defaults.withCredentials = true
axios.defaults.headers.common["X-CSRF-TOKEN"] = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content")
axios.defaults.headers.common["Accept"] = "application/json"

interface AboutProps {
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
    is_recommended: boolean
  }[]
}

export default function About({ auth, recommendedMenus = [] }: AboutProps) {
  const { t, currentLanguage, setLanguage } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)

  // Add this useEffect to handle menu rotation
  useEffect(() => {
    if (recommendedMenus.length > 0) {
      const interval = setInterval(() => {
        setActiveMenuIndex((prev) => (prev + 1) % recommendedMenus.length)
      }, 20000)
      return () => clearInterval(interval)
    }
  }, [recommendedMenus])

  // Parallax effect for story section
  const { scrollYProgress: storyScrollProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  })
  const storyY = useTransform(storyScrollProgress, [0, 1], [100, -100])

  // Route function (simplified version)
  const route = (routeName: string, params: object = {}) => {
    // Basic implementation - replace with your actual route generation logic
    const routes: { [key: string]: string } = {
      'menu': '/menu',
      'Reservation': '/reservations/create',
      'contact': '/contact',
      'customer.login': '/customer/login'  // Added correct login route
    }
    let urlString = routes[routeName] || `/${routeName}`
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams(params as Record<string, string>)
      urlString += `?${queryParams.toString()}`
    }
    return urlString
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent | PointerEvent) => {
    setIsDragging(true)
    if ("touches" in e) {
      setDragStartX(e.touches[0].clientX)
    } else {
      setDragStartX(e.clientX)
    }
  }

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        setActiveMenuIndex((prev) => (prev === 0 ? recommendedMenus.length - 1 : prev - 1))
      } else {
        setActiveMenuIndex((prev) => (prev + 1) % recommendedMenus.length)
      }
    }
  }

  const goToPrevious = () => {
    setActiveMenuIndex((prev) => (prev === 0 ? recommendedMenus.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveMenuIndex((prev) => (prev + 1) % recommendedMenus.length)
  }

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

      setCartCount((prev) => prev + 1)
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
      <Head title={t("nav.about")} />
      <Navbar auth={auth} />

      <main className="bg-[#0a0a0a] text-white overflow-hidden">
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          className="relative py-32 md:py-40 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 z-10"></div>
            <img
              src="/images/resto1.jpg"
              alt="Restaurant Interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 inline-block"
            >
              <div className="h-1 w-20 bg-amber-500 mx-auto mb-6"></div>
              <h2 className="text-lg md:text-xl uppercase tracking-wider text-amber-400 font-medium">
                {t("about.hero.subtitle")}
              </h2>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              {t("about.hero.title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            >
              {t("about.hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button
                className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-none px-8 py-5 text-lg transition-all duration-300 group relative overflow-hidden"
                onClick={() => window.location.href = route("menu")}
              >
                <span className="relative z-10 flex items-center">
                  {t("about.hero.explore_menu")}
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
                <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Our Story Section with Parallax */}
        <motion.div 
          ref={storyRef} 
          className="relative py-24 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Parallax Background */}
          <motion.div className="absolute inset-0 z-0" style={{ y: storyY }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/70 z-10"></div>
            <img
              src="/images/resto1.jpg"
              alt="Traditional Indonesian Food"
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
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("about.story.title")}</h2>
                  <div className="space-y-6">
                    <p className="text-gray-300">{t("about.story.p1")}</p>
                    <p className="text-gray-300">{t("about.story.p2")}</p>
                    <p className="text-gray-300">{t("about.story.p3")}</p>
                    <p className="text-gray-300">{t("about.story.p4")}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div
                  className="aspect-square relative z-10 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/images/resto2.jpg"
                    alt="Restaurant Founder"
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

        {/* Our Values Section */}
        <motion.div 
          ref={valuesRef} 
          className="py-24 bg-[#0c0c0c]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("about.values.title")}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                {t("about.values.description")}
              </p>
              <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: t("about.values.authenticity.title"),
                  description: t("about.values.authenticity.description"),
                  icon: "🌿",
                },
                {
                  title: t("about.values.quality.title"),
                  description: t("about.values.quality.description"),
                  icon: "✨",
                },
                {
                  title: t("about.values.hospitality.title"),
                  description: t("about.values.hospitality.description"),
                  icon: "🏠",
                },
                {
                  title: t("about.values.innovation.title"),
                  description: t("about.values.innovation.description"),
                  icon: "💡",
                },
                {
                  title: t("about.values.community.title"),
                  description: t("about.values.community.description"),
                  icon: "🤝",
                },
                {
                  title: t("about.values.passion.title"),
                  description: t("about.values.passion.description"),
                  icon: "❤️",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-[#1a1a1a] p-8 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-amber-500/5 z-0"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-amber-500 w-0 group-hover:w-full transition-all duration-500"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Our Cuisine Section */}
        <div className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
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
                <Utensils className="h-10 w-10 text-amber-500 mx-auto" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("about.cuisine.title")}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                {t("about.cuisine.description")}
              </p>
              <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="space-y-6 text-gray-300"
              >
                <p className="text-lg leading-relaxed">
                  {t("about.cuisine.p1")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("about.cuisine.p2")}
                </p>
                <p className="text-lg leading-relaxed">
                  {t("about.cuisine.p3")}
                </p>
                <div className="pt-4">
                  <Button
                    className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-none px-8 py-5 text-lg transition-all duration-300 group relative overflow-hidden"
                    onClick={() => window.location.href = route("menu")}
                  >
                    <span className="relative z-10 flex items-center">
                      {t("about.cuisine.explore_menu")}
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </span>
                    <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Button>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                {(recommendedMenus || []).slice(0, 4).map((menu, index) => (
                  <motion.div
                    key={menu.id}
                    className="relative overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`/storage/${menu.gambar}`}
                        alt={menu.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/default-menu.jpg";
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold mb-2">{menu.name}</h3>
                      {menu.desc && (
                        <p className="text-sm text-gray-300 line-clamp-2">{menu.desc}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 relative overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 z-10"></div>
            <img
              src="/images/resto1.jpg"
              alt="Restaurant Ambiance"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">{t("about.cta.title")}</h2>
              <p className="text-xl text-gray-300 mb-12">
                {t("about.cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
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
                    {t("about.cta.make_reservation")}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                    >
                      <Calendar className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
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
