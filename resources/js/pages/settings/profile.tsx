"use client"

import type React from "react"

import { Head, useForm, router } from "@inertiajs/react"
import { type FormEventHandler, useState } from "react"
import {
  LoaderCircle,
  ShoppingCart,
  Calendar,
  CreditCard,
  Camera,
  Trash2,
  User,
  Mail,
  Phone,
  Save,
  ChevronRight,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  ChevronDown,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InputError from "@/components/input-error"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Page } from '@inertiajs/core'

interface ProfileProps {
  auth: {
    user: {
      id: number
      name: string
      email: string
      no_telepon: string
      profile_photo?: string
      profile_photo_url?: string
      email_verified_at?: string
      carts?: any[]
      reservations?: any[]
      payments?: Array<{
        id: number
        order_number: string
        total_amount: number
        status: string
        created_at: string
        description?: string
        bank_account?: {
          id: number
          bank_name: string
          account_number: string
          account_name: string
        }
      }>
    }
  }
  status?: string
  mustVerifyEmail?: boolean
}

interface ProfileForm {
  name: string
  email: string
  no_telepon: string
  profile_photo: File | null
  remove_photo: boolean
  [key: string]: string | File | null | boolean
}

interface PageProps {
  auth: {
    user: {
      name: string
      email: string
      no_telepon: string
      profile_photo?: string
      profile_photo_url?: string
    }
  }
  errors?: Record<string, string>
  deferred?: Record<string, string[]>
}

export default function Profile({ auth, status, mustVerifyEmail }: ProfileProps) {
  const { t } = useTranslation()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [activityFilter, setActivityFilter] = useState("all")
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    no_telepon?: string
  }>({})

  // Initialize form with user data
  const form = useForm<ProfileForm>({
    name: auth.user.name,
    email: auth.user.email,
    no_telepon: auth.user.no_telepon,
    profile_photo: null,
    remove_photo: false,
  })

  const getPhotoUrl = (): string | undefined => {
    if (photoPreview) return photoPreview
    if (auth.user.profile_photo) {
      return `/storage/${auth.user.profile_photo}`
    }
    return undefined
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setData("profile_photo", file)
      form.setData("remove_photo", false)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoRemove = () => {
    form.setData("profile_photo", null)
    form.setData("remove_photo", true)
    setPhotoPreview(null)

    // Create form data
    const formData = new FormData()
    formData.append("_method", "PATCH")
    formData.append("name", form.data.name)
    formData.append("email", form.data.email)
    formData.append("no_telepon", form.data.no_telepon)
    formData.append("remove_photo", "1")

    // Submit the form using Inertia's router
    router.post(route("profile.update"), formData, {
      forceFormData: true,
      preserveScroll: true,
    })
  }

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  // Phone number validation function
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '')
    // Check if it starts with 0 and has 10-13 digits
    return /^0[0-9]{9,12}$/.test(cleanPhone)
  }

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    form.setData("email", email)
    
    if (email && !validateEmail(email)) {
      setValidationErrors(prev => ({
        ...prev,
        email: "Please enter a valid email address"
      }))
    } else {
      setValidationErrors(prev => ({
        ...prev,
        email: undefined
      }))
    }
  }

  // Handle phone number change with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    let formattedPhone = value

    // Ensure the number starts with 0
    if (value.startsWith('8')) {
      formattedPhone = '0' + value
    }

    form.setData("no_telepon", formattedPhone)

    if (formattedPhone && !validatePhoneNumber(formattedPhone)) {
      setValidationErrors(prev => ({
        ...prev,
        no_telepon: "Please enter a valid phone number (10-13 digits starting with 0)"
      }))
    } else {
      setValidationErrors(prev => ({
        ...prev,
        no_telepon: undefined
      }))
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.data.email)) {
        setValidationErrors({ email: 'Please enter a valid email address' });
        return;
    }

    // Validate phone number format
    const phoneRegex = /^0\d{9,12}$/;
    if (!phoneRegex.test(form.data.no_telepon)) {
        setValidationErrors({ no_telepon: 'Phone number must start with 0 and be 10-13 digits' });
        return;
    }

    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('name', form.data.name);
    formData.append('email', form.data.email);
    formData.append('no_telepon', form.data.no_telepon);
    
    if (form.data.profile_photo) {
        formData.append('profile_photo', form.data.profile_photo);
    }
    
    if (form.data.remove_photo) {
        formData.append('remove_photo', '1');
    }

    router.post(route('profile.update'), formData, {
        forceFormData: true,
        onError: (errors) => {
            setValidationErrors(errors);
        },
        onSuccess: () => {
            // Refresh the page to get fresh data
            window.location.reload();
        },
    });
  };

  // Add error display in the form
  const renderError = (field: keyof ProfileForm) => {
    if (field in form.errors && form.errors[field]) {
      return (
        <div className="text-red-500 text-sm mt-1">
          {form.errors[field]}
        </div>
      )
    }
    if (field in validationErrors && validationErrors[field as keyof typeof validationErrors]) {
      return (
        <div className="text-red-500 text-sm mt-1">
          {validationErrors[field as keyof typeof validationErrors]}
        </div>
      )
    }
    return null
  }

  return (
    <>
      <Head title={t("profile.title")} />
      <Navbar auth={auth} />

      <main className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12 md:mb-20"
          >
            {/* Background Banner */}
            <div className="h-48 sm:h-64 w-full rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-gray-900/80 z-10"></div>
              <div className="absolute inset-0 bg-[url('/images/resto1.jpg')] bg-cover bg-center transform scale-105 animate-slow-zoom"></div>

              {/* Decorative elements */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-amber-500/10 blur-xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-amber-500/10 blur-xl"></div>
              </div>
            </div>

            {/* Profile Photo and Name */}
            <div className="absolute bottom-0 left-4 sm:left-8 transform translate-y-1/2 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-20">
              <div className="relative group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36 rounded-full border-4 border-[#121212] overflow-hidden bg-[#1a1a1a] shadow-xl">
                  {getPhotoUrl() ? (
                    <img
                      src={getPhotoUrl() || "/placeholder.svg"}
                      alt={auth.user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 bg-amber-900/20">
                      {auth.user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Photo Upload Overlay */}
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <div className="flex flex-col items-center gap-2">
                    <label
                      htmlFor="profile_photo"
                      className="cursor-pointer p-2 sm:p-3 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors"
                    >
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-black" />
                      <input
                        id="profile_photo"
                        name="profile_photo"
                        type="file"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{auth.user.name}</h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-0 right-4 sm:right-8 transform translate-y-1/2 z-30">
              {(auth.user.profile_photo || photoPreview) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePhotoRemove}
                  className="bg-red-900/20 border-red-900/30 text-red-400 hover:bg-red-900/30 hover:text-red-300 rounded-full text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t("profile.photo.remove")}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mt-20">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-[#1a1a1a]/70 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left p-4 flex items-center justify-between rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "bg-amber-500 text-black font-medium"
                        : "text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3" />
                      <span>{t("profile.title")}</span>
                    </div>
                    {activeTab === "profile" && <ChevronRight className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => setActiveTab("activity")}
                    className={`w-full text-left p-4 flex items-center justify-between rounded-lg transition-colors ${
                      activeTab === "activity"
                        ? "bg-amber-500 text-black font-medium"
                        : "text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3" />
                      <span>{t("profile.activity")}</span>
                    </div>
                    {activeTab === "activity" && <ChevronRight className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Stats Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 bg-[#1a1a1a]/70 border border-gray-800 p-6 space-y-6 rounded-xl shadow-lg overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50"></div>

                <div className="relative">
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-amber-400" />
                    {t("profile.account_summary")}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#121212]/80 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-amber-500/30 transition-colors">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4">
                          <ShoppingCart className="h-5 w-5 text-amber-400" />
                        </div>
                        <span className="text-gray-200">{t("profile.stats.cart_items")}</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-400">
                        {auth.user.carts?.filter((cart) => !cart.payment_id).length || 0}
                      </span>
                    </div>

                    <div className="bg-[#121212]/80 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-amber-500/30 transition-colors">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4">
                          <Calendar className="h-5 w-5 text-amber-400" />
                        </div>
                        <span className="text-gray-200">{t("profile.stats.reservations")}</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-400">{auth.user.reservations?.length || 0}</span>
                    </div>

                    <div className="bg-[#121212]/80 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-amber-500/30 transition-colors">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4">
                          <CreditCard className="h-5 w-5 text-amber-400" />
                        </div>
                        <span className="text-gray-200">{t("profile.stats.payments")}</span>
                      </div>
                      <span className="text-2xl font-bold text-amber-400">{auth.user.payments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              {activeTab === "profile" && (
                <div className="bg-[#1a1a1a]/70 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Settings className="h-6 w-6 mr-2 text-amber-400" />
                      {t("profile.title")}
                    </h2>

                    <form onSubmit={submit} className="space-y-8">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm text-gray-400 font-medium">
                              {t("profile.form.name")}
                            </Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData("name", e.target.value)}
                                required
                                autoComplete="name"
                                className="bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-lg focus:border-amber-500 focus:ring-amber-500/20"
                              />
                            </div>
                            {renderError("name")}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm text-gray-400 font-medium">
                              {t("profile.form.email")}
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.data.email}
                                onChange={handleEmailChange}
                                required
                                autoComplete="email"
                                className={`bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-lg focus:border-amber-500 focus:ring-amber-500/20 ${
                                  validationErrors.email ? 'border-red-500' : ''
                                }`}
                              />
                            </div>
                            {renderError("email")}
                            {mustVerifyEmail && !auth.user.email_verified_at && (
                              <p className="text-xs text-amber-400 flex items-center mt-1">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {t("profile.verify.message")}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="no_telepon" className="text-sm text-gray-400 font-medium">
                            {t("profile.form.phone")}
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-5 w-5" />
                            <Input
                              id="no_telepon"
                              name="no_telepon"
                              type="tel"
                              value={form.data.no_telepon}
                              onChange={handlePhoneChange}
                              placeholder="08xxxxxxxxxxx"
                              required
                              className={`bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-lg focus:border-amber-500 focus:ring-amber-500/20 ${
                                validationErrors.no_telepon ? 'border-red-500' : ''
                              }`}
                            />
                          </div>
                          {renderError("no_telepon")}
                          <p className="text-xs text-gray-500">
                            {t("profile.form.phone_hint")}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={form.processing}
                          className="bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-12 px-8 shadow-lg shadow-amber-900/20"
                        >
                          {form.processing ? (
                            <span className="flex items-center">
                              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                              {t("profile.form.saving")}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Save className="mr-2 h-4 w-4" />
                              {t("profile.form.save")}
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="bg-[#1a1a1a]/70 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Bell className="h-6 w-6 mr-2 text-amber-400" />
                      {t("profile.activity.recent")}
                    </h2>

                    {/* Activity Tabs */}
                    <div className="border-b border-gray-800 mb-6">
                      {/* Desktop Tabs */}
                      <div className="hidden md:flex space-x-6 min-w-max pb-1">
                        <button
                          onClick={() => setActivityFilter("all")}
                          className={`pb-4 font-medium transition-colors ${
                            activityFilter === "all"
                              ? "text-amber-400 border-b-2 border-amber-400"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                        >
                          {t("profile.activity.all")}
                        </button>
                        <button
                          onClick={() => setActivityFilter("orders")}
                          className={`pb-4 font-medium transition-colors ${
                            activityFilter === "orders"
                              ? "text-amber-400 border-b-2 border-amber-400"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                        >
                          {t("profile.activity.orders")}
                        </button>
                        <button
                          onClick={() => setActivityFilter("reservations")}
                          className={`pb-4 font-medium transition-colors ${
                            activityFilter === "reservations"
                              ? "text-amber-400 border-b-2 border-amber-400"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                        >
                          {t("profile.activity.reservations")}
                        </button>
                        <button
                          onClick={() => setActivityFilter("payments")}
                          className={`pb-4 font-medium transition-colors ${
                            activityFilter === "payments"
                              ? "text-amber-400 border-b-2 border-amber-400"
                              : "text-gray-400 hover:text-gray-300"
                          }`}
                        >
                          {t("profile.activity.payments")}
                        </button>
                      </div>

                      {/* Enhanced Mobile Dropdown */}
                      <div className="md:hidden mb-4">
                        <Select value={activityFilter} onValueChange={setActivityFilter}>
                          <SelectTrigger className="w-full bg-[#121212] border-gray-800 text-white h-12 rounded-lg focus:border-amber-500 focus:ring-amber-500/20 transition-colors hover:bg-[#1a1a1a]">
                            <SelectValue>
                              <div className="flex items-center">
                                {activityFilter === "all" && <Bell className="w-4 h-4 mr-2 text-amber-400" />}
                                {activityFilter === "orders" && <ShoppingCart className="w-4 h-4 mr-2 text-amber-400" />}
                                {activityFilter === "reservations" && <Calendar className="w-4 h-4 mr-2 text-amber-400" />}
                                {activityFilter === "payments" && <CreditCard className="w-4 h-4 mr-2 text-amber-400" />}
                                <span>
                                  {activityFilter === "all" && t("profile.activity.all")}
                                  {activityFilter === "orders" && t("profile.activity.orders")}
                                  {activityFilter === "reservations" && t("profile.activity.reservations")}
                                  {activityFilter === "payments" && t("profile.activity.payments")}
                                </span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-[#121212] border-gray-800 text-white min-w-[200px] animate-in fade-in-0 zoom-in-95">
                            <SelectItem value="all" className="focus:bg-amber-500/10 focus:text-amber-400">
                              <div className="flex items-center">
                                <Bell className="w-4 h-4 mr-2 text-amber-400" />
                                <span>{t("profile.activity.all")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="orders" className="focus:bg-amber-500/10 focus:text-amber-400">
                              <div className="flex items-center">
                                <ShoppingCart className="w-4 h-4 mr-2 text-amber-400" />
                                <span>{t("profile.activity.orders")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="reservations" className="focus:bg-amber-500/10 focus:text-amber-400">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-amber-400" />
                                <span>{t("profile.activity.reservations")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="payments" className="focus:bg-amber-500/10 focus:text-amber-400">
                              <div className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-2 text-amber-400" />
                                <span>{t("profile.activity.payments")}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Activity List */}
                    {(auth.user.reservations?.length || 0) > 0 ||
                    (auth.user.carts?.length || 0) > 0 ||
                    (auth.user.payments?.length || 0) > 0 ? (
                      <div className="space-y-4">
                        {/* Combined and Sorted Activities */}
                        {(() => {
                          // Prepare activities based on filter
                          const activities = []

                          if (activityFilter === "all" || activityFilter === "reservations") {
                            activities.push(
                              ...(auth.user.reservations?.map((res) => ({
                                ...res,
                                type: "reservation",
                                timestamp: new Date(res.created_at).getTime(),
                              })) || []),
                            )
                          }

                          if (activityFilter === "all" || activityFilter === "orders") {
                            activities.push(
                              ...(auth.user.carts
                                ?.filter((cart) => !cart.payment_id)
                                .map((cart) => ({
                                  ...cart,
                                  type: "order",
                                  timestamp: new Date(cart.created_at).getTime(),
                                })) || []),
                            )
                          }

                          if (activityFilter === "all" || activityFilter === "payments") {
                            activities.push(
                              ...(auth.user.payments?.map((payment) => ({
                                ...payment,
                                type: "payment",
                                timestamp: new Date(payment.created_at).getTime(),
                              })) || []),
                            )
                          }

                          // Sort all activities by timestamp, newest first
                          activities.sort((a, b) => b.timestamp - a.timestamp)

                          return activities.map((activity, index) => {
                            if (activity.type === "reservation") {
                              return (
                                <motion.div
                                  key={`reservation-${activity.id}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * (index % 5), duration: 0.4 }}
                                  className="bg-[#121212]/80 p-5 border border-gray-800 rounded-lg hover:border-amber-500/30 transition-colors"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                    <div>
                                      <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-amber-400 mr-2" />
                                        <p className="font-medium">
                                          {activity.order_number}
                                          <span className="text-gray-500 text-xs sm:text-sm ml-2">
                                            (Reservation #{activity.id})
                                          </span>
                                        </p>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        {(() => {
                                          const date = new Date(activity.tanggal)
                                          const time = activity.waktu
                                          return `${date.toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })} pukul ${time} WIB`
                                        })()}
                                      </p>
                                    </div>
                                    <div
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        activity.status === "confirmed"
                                          ? "bg-green-900/20 text-green-400 border border-green-900/30"
                                          : activity.status === "rejected"
                                            ? "bg-red-900/20 text-red-400 border border-red-900/30"
                                            : "bg-amber-900/20 text-amber-400 border border-amber-900/30"
                                      }`}
                                    >
                                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                    </div>
                                  </div>
                                  {activity.note && (
                                    <div className="mt-3 bg-[#1a1a1a]/50 border border-gray-800 p-3 rounded-lg">
                                      <p className="text-sm text-gray-300">Note: {activity.note}</p>
                                    </div>
                                  )}
                                  {activity.staff_whatsapp && activity.status === "confirmed" && (
                                    <Button
                                      variant="outline"
                                      className="mt-4 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 rounded-lg flex items-center gap-2"
                                      onClick={() => window.open(`https://wa.me/${activity.staff_whatsapp}`, "_blank")}
                                    >
                                      <Phone className="h-4 w-4" />
                                      Contact Staff
                                    </Button>
                                  )}
                                </motion.div>
                              )
                            } else if (activity.type === "order") {
                              return (
                                <motion.div
                                  key={`order-${activity.id}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * (index % 5), duration: 0.4 }}
                                  className="bg-[#121212]/80 p-5 border border-gray-800 rounded-lg hover:border-amber-500/30 transition-colors"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                    <div>
                                      <div className="flex items-center">
                                        <ShoppingCart className="h-5 w-5 text-amber-400 mr-2" />
                                        <p className="font-medium">Order #{activity.id}</p>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        {new Date(activity.created_at).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <div className="text-sm font-medium text-amber-400">
                                      Rp {(activity.quantity * (activity.price || 0)).toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                  <div className="mt-3 bg-[#1a1a1a]/50 border border-gray-800 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="text-gray-200 font-medium">
                                          {activity.menu?.name || "Menu item not available"}
                                        </p>
                                        {activity.menu?.desc && (
                                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                            {activity.menu.desc}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right ml-4">
                                        <p className="text-gray-300 text-sm">
                                          {activity.quantity} × Rp {(activity.price || 0).toLocaleString("id-ID")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            } else if (activity.type === "payment") {
                              return (
                                <motion.div
                                  key={`payment-${activity.id}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * (index % 5), duration: 0.4 }}
                                  className="bg-[#121212]/80 p-5 border border-gray-800 rounded-lg hover:border-amber-500/30 transition-colors"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                    <div>
                                      <div className="flex items-center">
                                        <CreditCard className="h-5 w-5 text-amber-400 mr-2" />
                                        <p className="font-medium">
                                          {activity.order_number}
                                          <span className="text-gray-500 text-xs sm:text-sm ml-2">
                                            (Payment #{activity.id})
                                          </span>
                                        </p>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                        {new Date(activity.created_at).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <div
                                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        activity.status === "completed"
                                          ? "bg-green-900/20 text-green-400 border border-green-900/30"
                                          : activity.status === "failed"
                                            ? "bg-red-900/20 text-red-400 border border-red-900/30"
                                            : "bg-amber-900/20 text-amber-400 border border-amber-900/30"
                                      }`}
                                    >
                                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                    </div>
                                  </div>
                                  <div className="mt-3 bg-[#1a1a1a]/50 border border-gray-800 p-3 rounded-lg">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <p className="text-xs text-gray-400">Amount</p>
                                        <p className="text-sm font-medium text-gray-200">
                                          {activity.total_amount
                                            ? `Rp ${Number(activity.total_amount).toLocaleString("id-ID")}`
                                            : "Rp 0"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400">Payment Method</p>
                                        <p className="text-sm font-medium text-gray-200">
                                          {activity.bank_account ? (
                                            <span className="flex items-center">
                                              <CreditCard className="h-4 w-4 mr-2 text-amber-400" />
                                              {activity.bank_account.bank_name}
                                            </span>
                                          ) : (
                                            <span className="flex items-center">
                                              <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                                              Bank Transfer
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    {activity.description && (
                                      <div className="mt-3 pt-3 border-t border-gray-800">
                                        <p className="text-xs text-gray-400">Note</p>
                                        <p className="text-sm text-gray-300">{activity.description}</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )
                            }
                            return null
                          })
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-[#121212]/50 border border-gray-800 rounded-lg">
                        <div className="bg-[#1a1a1a]/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Clock className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">{t("profile.activity.no_activity")}</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                          {activityFilter === "orders"
                            ? t("profile.activity.no_orders")
                            : activityFilter === "reservations"
                              ? t("profile.activity.no_reservations")
                              : activityFilter === "payments"
                                ? t("profile.activity.no_payments")
                                : t("profile.activity.no_activity_description")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Message */}
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-green-900/20 border border-green-800 p-4 rounded-lg"
                >
                  <p className="text-sm text-green-400 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {status}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
