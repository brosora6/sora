"use client"

import { Head } from "@inertiajs/react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoaderCircle, ShoppingCart, Plus, AlertCircle, Search, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

  useEffect(() => {
    let filtered = menus

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((menu) => menu.category && menu.category.slug === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (menu) =>
          menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          menu.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (menu.category && menu.category.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredMenus(filtered)
  }, [searchQuery, selectedCategory, menus])

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
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        user: auth.user,
      })

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
      <Head title="Menu | Rumah Makan Salwa" />
      <Navbar auth={auth} />

      <main className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white min-h-screen pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative h-[40vh] max-h-[500px] min-h-[300px] overflow-hidden mb-12">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>
            <div className="absolute inset-0 bg-[url('images/cook2.jpg')] bg-cover bg-center bg-no-repeat transform scale-105 animate-slow-zoom"></div>
          </div>
          <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Discover Our <span className="text-amber-400">Delicious</span> Menu
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl">
                Authentic Indonesian flavors crafted with care at Rumah Makan Salwa
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-10 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search our menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-[#252525] border-gray-800 text-white h-14 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-lg w-full"
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
                          ? "All Categories"
                          : categories.find((c) => c.slug === selectedCategory)?.name || "Select Category"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] bg-[#252525] border-gray-700 max-h-[240px] overflow-y-auto"
                    align="top"
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
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <LoaderCircle className="h-12 w-12 animate-spin text-amber-400 mb-4" />
              <p className="text-gray-400">Loading our delicious menu...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#252525] border border-gray-800 p-8 rounded-xl shadow-xl">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-xl font-medium text-white mb-2">Unable to load menu</p>
              <p className="text-gray-400 text-center">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-6 border-gray-700 text-white hover:bg-gray-800 rounded-full px-6"
              >
                Try Again
              </Button>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#252525] border border-gray-800 p-8 rounded-xl shadow-xl">
              <ShoppingCart className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-xl font-medium text-white mb-2">No menu items found</p>
              <p className="text-gray-400 text-center">
                {searchQuery ? "Try a different search term" : "Check back later for our updated menu"}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="mt-6 border-gray-700 text-white hover:bg-gray-800 rounded-full px-6"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCategory === "all"
                    ? "All Menu Items"
                    : `${categories.find((c) => c.slug === selectedCategory)?.name || ""}`}
                  <span className="text-amber-400 ml-2">({filteredMenus.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredMenus.map((menu) => (
                  <Card
                    key={menu.id}
                    className="bg-[#252525] border-gray-800 overflow-hidden rounded-xl hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 group"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={`/storage/${menu.gambar}`}
                        alt={menu.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/images/default-menu.jpg"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {menu.category && (
                        <Badge className="absolute top-4 left-4 bg-amber-500/90 hover:bg-amber-500/90 text-black font-medium">
                          {menu.category.name}
                        </Badge>
                      )}

                      {menu.stok <= 3 && menu.stok > 0 && (
                        <Badge className="absolute top-4 right-4 bg-amber-600 hover:bg-amber-700 text-white">
                          Low Stock: {menu.stok} left
                        </Badge>
                      )}

                      {menu.stok === 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                          <Badge className="bg-red-600 hover:bg-red-600 text-white text-lg py-1.5 px-4">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                        {menu.name}
                      </h3>
                      <p className="text-gray-400 mb-4 line-clamp-2 h-12">{menu.desc}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-amber-400">Rp {menu.price.toLocaleString()}</p>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      {auth.user ? (
                        menu.stok > 0 ? (
                          <Button
                            className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-full h-12 font-medium shadow-lg shadow-amber-900/20"
                            onClick={() => handleAddToCart(menu.id)}
                            disabled={addingToCart === menu.id}
                          >
                            {addingToCart === menu.id ? (
                              <span className="flex items-center justify-center">
                                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                Adding...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Plus className="mr-2 h-5 w-5" />
                                Add to Cart
                              </span>
                            )}
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-gray-800 text-gray-400 hover:bg-gray-800 rounded-full h-12 cursor-not-allowed"
                            disabled
                          >
                            Out of Stock
                          </Button>
                        )
                      ) : (
                        <Button
                          className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-full h-12 font-medium shadow-lg shadow-amber-900/20"
                          onClick={() => (window.location.href = route("customer.login"))}
                        >
                          Login to Order
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
