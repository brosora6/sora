"use client"

import { Head } from "@inertiajs/react"
import { useState, useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Star, ArrowRight, Utensils, Users } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

interface AboutProps {
  auth: {
    user: any
  }
}

export default function About({ auth }: AboutProps) {
  const [isLoaded, setIsLoaded] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)

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

  return (
    <>
      <Head title="About Us" />
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
              <h2 className="text-lg md:text-xl uppercase tracking-wider text-amber-400 font-medium">Our Story</h2>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              ABOUT <span className="text-amber-400">RUMAH MAKAN</span> SALWA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            >
              A culinary journey through the rich and diverse flavors of Indonesian cuisine, 
              crafted with passion and served with pride.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button
                className="px-8 py-6 bg-transparent border-2 border-white text-white font-medium rounded-none hover:bg-white hover:text-black transition-all duration-300 group overflow-hidden relative"
                onClick={() => window.location.href = route("menu")}
              >
                <span className="relative z-10 flex items-center">
                  EXPLORE OUR MENU
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
                  >
                    <Utensils className="h-5 w-5" />
                  </motion.div>
                </span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
                <motion.div
                  className="inline-block mb-6"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <Star className="h-12 w-12 text-amber-500" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">OUR HUMBLE BEGINNINGS</h2>
                <div className="w-20 h-1 bg-amber-500 mb-8"></div>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    Founded in 2017, Rumah Makan Salwa is located at Jl. Balikpapan - Samarinda KM 15, Karang Joang, Kecamatan Balikpapan Utara. What started as a small restaurant has grown into a beloved culinary destination known for its affordable and delicious Indonesian cuisine.
                  </p>
                  <p>
                    Our restaurant offers a variety of dishes at affordable prices, making it perfect for families, students, and workers. In addition to our budget-friendly menu packages, we also accept large orders and provide catering services for various events.
                  </p>
                  <p>
                    What sets us apart is our commitment to quality. We process our own chicken, ensuring freshness and quality in every dish we serve. This dedication to quality ingredients has helped us build a reputation as a trusted dining establishment.
                  </p>
                  <p>
                    Beyond our culinary focus, Rumah Makan Salwa has a social mission: to provide employment opportunities for school dropouts and those who haven't yet found work. Through our commitment to quality and service, we continue to grow as a comfortable and reliable dining place while making a positive contribution to the surrounding community.
                  </p>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">OUR VALUES</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                The principles that guide everything we do, from sourcing ingredients to serving our guests.
              </p>
              <div className="w-24 h-1 bg-amber-500 mx-auto mt-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  title: "Authenticity",
                  description: "We stay true to traditional recipes and cooking methods, preserving the genuine flavors of Indonesian cuisine.",
                  icon: "🌿",
                },
                {
                  title: "Quality",
                  description: "We use only the freshest, locally-sourced ingredients to create dishes that delight and satisfy our guests.",
                  icon: "✨",
                },
                {
                  title: "Hospitality",
                  description: "We treat every guest like family, providing warm, attentive service that makes everyone feel at home.",
                  icon: "🏠",
                },
                {
                  title: "Innovation",
                  description: "While respecting tradition, we continuously explore new ways to elevate and reimagine Indonesian cuisine.",
                  icon: "💡",
                },
                {
                  title: "Community",
                  description: "We support local farmers and suppliers, contributing to the sustainability of our community.",
                  icon: "🤝",
                },
                {
                  title: "Passion",
                  description: "We pour our hearts into every dish, sharing our love for Indonesian cuisine with every guest we serve.",
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">OUR CUISINE</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                A celebration of Indonesia's diverse culinary heritage, featuring dishes from across the archipelago.
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
                  At Rumah Makan Salwa, we take pride in offering a variety of Indonesian dishes at affordable prices. Our menu features a selection of budget-friendly options that don't compromise on taste or quality.
                </p>
                <p className="text-lg leading-relaxed">
                  We process our own chicken, ensuring that every dish is prepared with the freshest ingredients. This commitment to quality has helped us build a loyal customer base who appreciate our dedication to serving delicious food at reasonable prices.
                </p>
                <p className="text-lg leading-relaxed">
                  In addition to our regular menu, we also offer catering services for various events, from family gatherings to corporate functions. Our team is experienced in handling large orders while maintaining the quality and taste that our customers have come to expect.
                </p>
                <div className="pt-4">
                  <Button
                    className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-none px-8 py-5 text-lg transition-all duration-300 group relative overflow-hidden"
                    onClick={() => window.location.href = route("menu")}
                  >
                    <span className="relative z-10 flex items-center">
                      Explore Our Menu
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
                {[
                  {
                    name: "Rendang",
                    description: "Slow-cooked beef in coconut milk and spices",
                    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feed11.jpg-cGKoUKFU4AYV49Cs4F96KKnZw5N1vJ.jpeg"
                  },
                  {
                    name: "Nasi Goreng",
                    description: "Indonesian fried rice with sweet soy sauce",
                    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feed11.jpg-cGKoUKFU4AYV49Cs4F96KKnZw5N1vJ.jpeg"
                  },
                  {
                    name: "Sate Ayam",
                    description: "Grilled chicken skewers with peanut sauce",
                    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feed11.jpg-cGKoUKFU4AYV49Cs4F96KKnZw5N1vJ.jpeg"
                  },
                  {
                    name: "Gado-Gado",
                    description: "Mixed vegetables with peanut sauce dressing",
                    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/feed11.jpg-cGKoUKFU4AYV49Cs4F96KKnZw5N1vJ.jpeg"
                  }
                ].map((dish, index) => (
                  <motion.div
                    key={index}
                    className="relative overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={dish.image || "/placeholder.svg"}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-lg font-bold">{dish.name}</h3>
                      <p className="text-sm text-gray-300">{dish.description}</p>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-8">JOIN OUR MISSION</h2>
              <p className="text-xl text-gray-300 mb-12">
                Experience delicious Indonesian cuisine while supporting our mission to provide employment opportunities and contribute positively to our community.
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
                    MAKE A RESERVATION
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
                <Button
                  className="px-8 py-6 bg-transparent border-2 border-white text-white font-medium rounded-none hover:bg-white hover:text-black transition-all duration-300 group overflow-hidden relative"
                  onClick={() => window.location.href = route("contact")}
                >
                  <span className="relative z-10 flex items-center">
                    CONTACT US
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse", delay: 0.2 }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
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
