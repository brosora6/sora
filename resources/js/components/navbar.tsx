"use client"

import { Link, router } from "@inertiajs/react"
import { LogOut, Menu, ShoppingCart, User, Utensils, X, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { useState, useEffect } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

interface NavbarProps {
  auth: {
    user: {
      id: number
      name: string
      email: string
      profile_photo?: string
    }
  }
  cartCount?: number
}

// Declare route function (replace with actual implementation if needed)
declare function route(name: string, params?: any): string

export default function Navbar({ auth, cartCount = 0 }: NavbarProps) {
  const { currentLanguage, setLanguage, t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [localCartCount, setLocalCartCount] = useState(cartCount)

  useEffect(() => {
    setLocalCartCount(cartCount)
  }, [cartCount])

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      // Assuming hero section is approximately 100vh
      const scrollThreshold = window.innerHeight * 0.1 // 10% of viewport height
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Initial check in case page is loaded scrolled down
    handleScroll()

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    router.post(route("customer.logout"))
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen ? "bg-[#121212] border-b border-gray-800 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={route("home")} className="flex items-center">
              <span className={`text-xl font-bold ${mobileMenuOpen || isScrolled ? "text-white" : "text-white"}`}>SORA</span>
            </Link>
          </div>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className={`flex items-center ${!auth.user ? 'justify-center' : 'justify-start'} space-x-8`}>
              <NavigationMenuItem>
                <Link
                  href={route("home")}
                  className={`text-sm font-medium ${mobileMenuOpen || isScrolled ? "text-white hover:text-amber-400" : "text-white hover:text-amber-400"} transition-colors`}
                >
                  {t("nav.home")}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={route("menu")}
                  className={`text-sm font-medium ${mobileMenuOpen || isScrolled ? "text-white hover:text-amber-400" : "text-white hover:text-amber-400"} transition-colors`}
                >
                  {t("nav.menu")}
                </Link>
              </NavigationMenuItem>
              {auth.user && (
                <NavigationMenuItem>
                  <Link
                    href={route("reservation.create")}
                    className={`text-sm font-medium ${mobileMenuOpen || isScrolled ? "text-white hover:text-amber-400" : "text-white hover:text-amber-400"} transition-colors`}
                  >
                    {t("nav.reservation")}
                  </Link>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <Link
                  href={route("about")}
                  className={`text-sm font-medium ${mobileMenuOpen || isScrolled ? "text-white hover:text-amber-400" : "text-white hover:text-amber-400"} transition-colors`}
                >
                  {t("nav.about")}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-6">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={`${mobileMenuOpen || isScrolled ? "text-white hover:text-amber-400" : "text-white hover:text-amber-400"}`}>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24 bg-[#121212] border-gray-800">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={`text-white hover:bg-gray-800 cursor-pointer ${
                    currentLanguage === "en" ? "text-amber-400" : ""
                  }`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("id")}
                  className={`text-white hover:bg-gray-800 cursor-pointer ${
                    currentLanguage === "id" ? "text-amber-400" : ""
                  }`}
                >
                  Indonesia
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {auth.user ? (
              <>
                <Link href={route("cart")} className="text-white hover:text-amber-400 transition-colors relative">
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence mode="popLayout">
                    {localCartCount > 0 && (
                      <motion.span
                        key={localCartCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {localCartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      {auth.user.profile_photo ? (
                        <img
                          src={`/store/${auth.user.profile_photo}`}
                          alt={auth.user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center transition-all duration-300 hover:bg-amber-400">
                          <span className="text-black font-medium">{auth.user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#121212] border-gray-800">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-sm font-medium text-white truncate">{auth.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link
                        href={route("profile.edit")}
                        className="text-white hover:bg-gray-800 cursor-pointer flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-white hover:bg-gray-800 cursor-pointer flex items-center text-red-400 hover:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href={route("customer.login")}>
                  <Button variant="ghost" className="text-white hover:text-amber-400 hover:bg-white/10 rounded-full">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href={route("customer.register")}>
                  <Button className="bg-amber-500 text-black hover:bg-amber-400 rounded-full">
                    {t("nav.signup")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.button
              className="md:hidden text-white hover:text-amber-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#121212] fixed w-full inset-0 top-16 z-50 flex items-center justify-center border-b border-gray-800"
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center w-full space-y-8 px-4"
            >
              <Link
                href={route("home")}
                className="block py-2 text-2xl font-normal text-white hover:text-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href={route("menu")}
                className="block py-2 text-2xl font-normal text-white hover:text-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.menu")}
              </Link>
              {auth.user ? (
                <Link
                  href={route("reservation.create")}
                  className="block py-2 text-2xl font-normal text-white hover:text-amber-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.reservation")}
                </Link>
              ) : null}
              <Link
                href={route("about")}
                className="block py-2 text-2xl font-normal text-white hover:text-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </Link>

              {!auth.user && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-8 flex flex-col items-center"
                >
                  <Link
                    href={route("customer.login")}
                    className="block py-2 text-2xl font-normal text-white hover:text-amber-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href={route("customer.register")}
                    className="block py-2 text-2xl font-normal text-white hover:text-amber-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.signup")}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

