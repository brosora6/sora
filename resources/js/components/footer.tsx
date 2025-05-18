"use client"

import type React from "react"

import { useState } from "react"
import { Utensils, Instagram, Facebook, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const route = (routeName: string, params: object = {}) => {
    // Map route names to their actual paths
    const routes: { [key: string]: string } = {
      "customer.login": "/customer/login",
      "customer.register": "/customer/register",
      menu: "/menu",
      Reservation: "/reservations/create",
      home: "/",
      about: "/about",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1000)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const navigationItems = [
    { key: "footer.nav.home", href: route("home") },
    { key: "footer.nav.about", href: route("about") },
    { key: "footer.nav.menu", href: route("menu") },
    { key: "footer.nav.reservations", href: route("Reservation") },
  ]

  const policyItems = [
    { key: "footer.privacy", href: route("privacy") },
    { key: "footer.terms", href: route("terms") },
    { key: "footer.cookies", href: route("cookies") },
  ]

  return (
    <footer className="bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      {/* Accent gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={fadeInUp}
              className="flex items-center"
            >
              <div className="w-12 h-12 mr-3 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg">
                <Utensils className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">RUMAH MAKAN SALWA</span>
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              variants={fadeInUp}
              className="text-gray-400 text-sm leading-relaxed max-w-xs"
            >
              {t("footer.description")}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeInUp}
              className="pt-2"
            >
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#111111] hover:bg-amber-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#111111] hover:bg-amber-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-[#111111] hover:bg-amber-500 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-gray-500 text-sm"
            >
              © {currentYear} <span className="text-gray-400">Rumah Makan Salwa</span>. {t("footer.rights")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex space-x-6 mt-4 md:mt-0"
            >
              {policyItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-500 hover:text-amber-400 text-xs transition-colors duration-300"
                >
                  {t(item.key)}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
