"use client"

import { Head } from "@inertiajs/react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoaderCircle, ShoppingCart, Plus, AlertCircle, Search, ChevronDown, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import React from "react"

interface MenuProps {
  auth: {
    user: any
  }
}

interface MenuItem {
  id: number
  name: string
  price: number
  desc: string
  gambar: string
  stok: number
  status: string
  category: {
    id: number
    name: string
    slug: string
  }
}

interface Category {
  id: number
  name: string
  slug: string
}

// Declare route function (replace with actual implementation if needed)
declare function route(name: string, params?: any): string

export default function Menu({ auth }: MenuProps) {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [filteredMenus, setFilteredMenus] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [cartCount, setCartCount] = useState(0)
  const { t } = useTranslation()

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [menusResponse, categoriesResponse] = await Promise.all([
          api.get("/menus"),
          api.get("/categories"),
        ])
        setMenus(menusResponse.data)
        setFilteredMenus(menusResponse.data)
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load menu items. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Add filtering logic
  useEffect(() => {
    const filtered = menus.filter((menu) => {
      const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        menu.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredMenus(filtered);
  }, [searchQuery, selectedCategory, menus]);

  const handleAddToCart = async (menuId: number) => {
    if (!auth.user) {
      toast.error("Please log in to add items to cart")
      window.location.href = route("customer.login")
      return
    }

    try {
      setAddingToCart(menuId)
      await api.post("/carts", {
        menu_id: menuId,
        quantity: 1,
      })

      // Update cart count with animation
      setCartCount((prev) => prev + 1)

      // Update menu stock locally
      setMenus(
        menus.map((menu) => {
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

  return (
    <>
      <Head title="Menu" />
      <Navbar auth={auth} cartCount={cartCount} />

      <main className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white min-h-screen pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative h-[40vh] max-h-[500px] min-h-[300px] overflow-hidden mb-12">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
            <div className="absolute inset-0 bg-[url('/images/cook2.jpg')] bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"></div>
          </div>
          <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <motion.div
              className="max-w-xl"
              initial="hidden"
              animate="visible"
              variants={heroVariants}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {t("menu.hero.title")}
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl">
                {t("menu.hero.subtitle")}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <motion.div 
            className="mb-10 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={t("menu.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-[#252525] border-gray-800 text-white h-14 rounded-full focus:border-amber-400 focus:ring-amber-400 shadow-lg w-full"
                />
              </div>

              {/* Category Dropdown - Unified for all devices */}
              <div className="w-full md:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto min-w-[200px] rounded-full border-gray-700 bg-[#252525] text-white hover:bg-gray-800 hover:text-amber-400 h-14 px-6"
                    >
                      <span className="mr-2">
                        {selectedCategory === "all"
                          ? t("menu.categories.all")
                          : categories.find((c) => c.slug === selectedCategory)?.name || t("menu.categories.select")}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#252525] border-gray-700 max-h-[240px] overflow-y-auto"
                    sideOffset={5}
                  >
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("all")}
                      className={selectedCategory === "all" ? "bg-amber-500/20 text-amber-400" : ""}
                    >
                      All Categories
                    </DropdownMenuItem>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={selectedCategory === category.slug ? "bg-amber-500/20 text-amber-400" : ""}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <motion.div 
              className="flex flex-col items-center justify-center min-h-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoaderCircle className="h-12 w-12 animate-spin text-amber-400 mb-4" />
              <p className="text-gray-400">{t("menu.loading")}</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="flex flex-col items-center justify-center min-h-[300px] bg-[#252525] border border-gray-800 p-8 rounded-xl shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-xl font-medium text-white mb-2">{t("menu.error.title")}</p>
              <p className="text-gray-400 text-center">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-6 border-gray-700 text-white hover:bg-gray-800 rounded-full px-6"
              >
                {t("menu.error.try_again")}
              </Button>
            </motion.div>
          ) : filteredMenus.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center min-h-[300px] bg-[#252525] border border-gray-800 p-8 rounded-xl shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingCart className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-xl font-medium text-white mb-2">{t("menu.empty.title")}</p>
              <p className="text-gray-400 text-center">
                {searchQuery ? t("menu.empty.subtitle") : t("menu.empty.check_back")}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="mt-6 border-gray-700 text-white hover:bg-gray-800 rounded-full px-6"
                >
                  {t("menu.empty.clear_search")}
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory === "all"
                    ? t("menu.items.title")
                    : categories.find((c) => c.slug === selectedCategory)?.name || ""}
                  <span className="text-amber-400 ml-2">({filteredMenus.length})</span>
                </h2>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="popLayout">
                  {filteredMenus.map((menu) => (
                    <motion.div
                      key={menu.id}
                      variants={itemVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all duration-300 border border-amber-500/20 relative"
                      >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <div className="relative aspect-[4/3] overflow-hidden w-full -mt-6">
                          <motion.img
                            src={`/storage/${menu.gambar}`}
                            alt={menu.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/images/default-menu.jpg"
                            }}
                          />
                          {/* Image Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {menu.category && (
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="absolute top-4 left-4"
                            >
                              <Badge className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 text-xs shadow-lg">
                                {menu.category.name}
                              </Badge>
                            </motion.div>
                          )}

                          {menu.stok <= 3 && menu.stok > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="absolute top-4 right-4"
                            >
                              <Badge className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 text-xs shadow-lg">
                                {t("menu.item.low_stock", { count: menu.stok })}
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
                                {t("menu.item.out_of_stock")}
                              </Badge>
                            </motion.div>
                          )}
                        </div>

                        <div className="p-4 relative -mt-6">
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
                                    {t("menu.item.adding")}
                                  </span>
                                ) : (
                                  <span className="relative z-10 flex items-center justify-center">
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    {t("menu.item.add_to_cart")}
                                  </span>
                                )}
                                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                              </Button>
                            ) : (
                              <Button
                                className="w-full bg-gray-800 text-gray-400 hover:bg-gray-800 rounded-lg py-2 text-xs cursor-not-allowed shadow-lg"
                                disabled
                              >
                                {t("menu.item.out_of_stock")}
                              </Button>
                            )
                          ) : (
                            <Button
                              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 rounded-lg py-2 text-xs group relative overflow-hidden shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                              onClick={() => (window.location.href = route("customer.login"))}
                            >
                              <span className="relative z-10 flex items-center justify-center">
                                {t("menu.item.login_to_order")}
                                <ChevronRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                              </span>
                              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
