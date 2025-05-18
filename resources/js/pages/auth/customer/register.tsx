"use client"

import { Head, useForm, usePage } from "@inertiajs/react"
import { type FormEventHandler, useState, useEffect } from "react"
import { Eye, EyeOff, LoaderCircle, Mail, Lock, User, Phone, ArrowRight, Utensils, ChevronLeft, AlertCircle, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { toast } from "react-hot-toast"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define the route function (assuming it's globally available or imported elsewhere)
declare function route(name: string, params?: any): string

type RegisterForm = {
  name: string
  email: string
  password: string
  password_confirmation: string
  no_telepon: string
}

export default function CustomerRegister() {
  const { t } = useTranslation()
  const { csrf_token } = usePage().props as any
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [emailWarning, setEmailWarning] = useState<string>("")

  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    no_telepon: "",
  })

  // Clear form errors when form data changes
  useEffect(() => {
    setFormErrors({})
  }, [data])

  // Validate Gmail address
  const validateGmail = (email: string): { isValid: boolean; warning?: string } => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
    const gmailPlusRegex = /^[a-zA-Z0-9._%+-]+\+[a-zA-Z0-9._%+-]+@gmail\.com$/i
    
    if (!gmailRegex.test(email)) {
      return { isValid: false }
    }

    // Check for common Gmail issues
    if (email.length > 64) {
      return { 
        isValid: false,
        warning: t("auth.register.errors.gmail_too_long")
      }
    }

    if (gmailPlusRegex.test(email)) {
      return {
        isValid: true,
        warning: t("auth.register.errors.gmail_plus_warning")
      }
    }

    // Check for consecutive dots
    if (email.includes("..")) {
      return {
        isValid: false,
        warning: t("auth.register.errors.gmail_consecutive_dots")
      }
    }

    // Check for invalid characters
    const invalidChars = email.match(/[^a-zA-Z0-9._%+-@]/g)
    if (invalidChars) {
      return {
        isValid: false,
        warning: t("auth.register.errors.gmail_invalid_chars")
      }
    }

    return { isValid: true }
  }

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    setEmailWarning("")

    if (!data.name.trim()) {
      newErrors.name = t("auth.register.errors.name_required")
    }

    if (!data.email.trim()) {
      newErrors.email = t("auth.register.errors.email_required")
    } else {
      const emailValidation = validateGmail(data.email)
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.warning || t("auth.register.errors.email_invalid")
      } else if (emailValidation.warning) {
        setEmailWarning(emailValidation.warning)
      }
    }

    if (!data.no_telepon.trim()) {
      newErrors.no_telepon = t("auth.register.errors.phone_required")
    } else if (!/^08[0-9]{9,11}$/.test(data.no_telepon)) {
      newErrors.no_telepon = t("auth.register.errors.phone_invalid")
    }

    if (!data.password) {
      newErrors.password = t("auth.register.errors.password_required")
    } else if (data.password.length < 8) {
      newErrors.password = t("auth.register.errors.password_min_length")
    }

    if (!data.password_confirmation) {
      newErrors.password_confirmation = t("auth.register.errors.confirm_password_required")
    } else if (data.password !== data.password_confirmation) {
      newErrors.password_confirmation = t("auth.register.errors.passwords_mismatch")
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error(t("auth.register.errors.validation_failed"))
      return
    }

    post(route("customer.register"), {
      preserveScroll: true,
      preserveState: true,
      headers: {
        "X-CSRF-TOKEN": csrf_token,
      },
      onSuccess: () => {
        toast.success(t("auth.register.success"))
        reset("password", "password_confirmation")
        window.location.href = route("home")
      },
      onError: (errors) => {
        toast.error(t("auth.register.errors.registration_failed"))
        reset("password", "password_confirmation")
        setFormErrors(errors as Record<string, string>)
      },
    })
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center">
      <Head title={t("auth.register.title")} />

      <div className="grid md:grid-cols-2 min-h-screen">
        {/* Left side - Image with enhanced overlay */}
        <div className="hidden md:block relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></motion.div>

          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img src="/images/cook1.jpg" alt={t("auth.register.hero_image_alt")} className="w-full h-full object-cover" />
          </motion.div>

          {/* Branding on image */}
          <motion.div
            className="absolute top-0 left-0 w-full z-20 p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => window.location.href = route("home")}
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <Utensils className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold text-white">{t("app.name")}</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="absolute bottom-0 left-0 w-full z-20 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              {t("auth.register.hero_title.prefix")}{" "}
              <span className="text-amber-400">{t("auth.register.hero_title.highlight")}</span>{" "}
              {t("auth.register.hero_title.suffix")}
            </h2>
            <p className="text-gray-300 max-w-md text-sm">
              {t("auth.register.hero_description")}
            </p>
          </motion.div>
        </div>

        {/* Right side - Register form with enhanced styling */}
        <div className="flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 relative bg-gradient-to-b from-[#0a0a0a] to-[#121212] overflow-y-auto">
          {/* Mobile logo */}
          <motion.div
            className="md:hidden flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => window.location.href = route("home")}
            >
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <Utensils className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">{t("app.name")}</span>
            </div>
          </motion.div>

          {/* Form container with animations */}
          <motion.div
            className="w-full max-w-sm mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            <motion.div className="mb-6" variants={fadeIn}>
              <h2 className="text-2xl font-bold mb-2 text-white">{t("auth.register.create_account")}</h2>
              <p className="text-gray-400 text-sm">{t("auth.register.join_family")}</p>
            </motion.div>

            <form className="space-y-4" onSubmit={submit}>
              <input type="hidden" name="_token" value={csrf_token} />

              <motion.div className="space-y-1.5" variants={fadeIn}>
                <Label htmlFor="name" className="text-white text-sm font-medium">
                  {t("auth.register.name_label")}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    disabled={processing}
                    placeholder={t("auth.register.name_placeholder")}
                    className={`bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-10 pl-9 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200 text-sm ${
                      (errors.name || formErrors.name) ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  {(errors.name || formErrors.name) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <InputError message={errors.name || formErrors.name} className="text-red-400 text-xs" />
              </motion.div>

              <motion.div className="space-y-2" variants={fadeIn}>
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  {t("auth.register.email_label")}
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => {
                      setData("email", e.target.value)
                      // Clear email warning when user types
                      setEmailWarning("")
                    }}
                    disabled={processing}
                    placeholder={t("auth.register.email_placeholder")}
                    className={`bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200 ${
                      (errors.email || formErrors.email) ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  {(errors.email || formErrors.email) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                {emailWarning && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs mt-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{emailWarning}</span>
                  </div>
                )}
                <InputError message={errors.email || formErrors.email} className="text-red-400 text-xs mt-1" />
              </motion.div>

              <motion.div className="space-y-2" variants={fadeIn}>
                <Label htmlFor="no_telepon" className="text-white text-sm font-medium">
                  {t("auth.register.phone_label")} (WhatsApp)
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <Input
                    id="no_telepon"
                    type="tel"
                    required
                    tabIndex={3}
                    value={data.no_telepon}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '')
                      setData("no_telepon", value)
                    }}
                    disabled={processing}
                    placeholder="081234567890"
                    pattern="^08[0-9]{9,11}$"
                    title="Please enter a valid Indonesian phone number starting with 08 (e.g. 081234567890)"
                    className={`bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200 ${
                      (errors.no_telepon || formErrors.no_telepon) ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  {(errors.no_telepon || formErrors.no_telepon) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs">Format: Indonesian phone number starting with 08 (e.g. 081234567890)</p>
                <InputError message={errors.no_telepon || formErrors.no_telepon} className="text-red-400 text-xs mt-1" />
              </motion.div>

              <motion.div className="space-y-2" variants={fadeIn}>
                <Label htmlFor="password" className="text-white text-sm font-medium">
                  {t("auth.register.password_label")}
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    disabled={processing}
                    placeholder={t("auth.register.password_placeholder")}
                    className={`bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 pr-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200 ${
                      (errors.password || formErrors.password) ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {(errors.password || formErrors.password) && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <InputError message={errors.password || formErrors.password} className="text-red-400 text-xs mt-1" />
              </motion.div>

              <motion.div className="space-y-2" variants={fadeIn}>
                <Label htmlFor="password_confirmation" className="text-white text-sm font-medium">
                  {t("auth.register.confirm_password_label")}
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    tabIndex={5}
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    disabled={processing}
                    placeholder={t("auth.register.confirm_password_placeholder")}
                    className={`bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 pr-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200 ${
                      (errors.password_confirmation || formErrors.password_confirmation) ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {(errors.password_confirmation || formErrors.password_confirmation) && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <InputError message={errors.password_confirmation || formErrors.password_confirmation} className="text-red-400 text-xs mt-1" />
              </motion.div>

              <motion.div variants={fadeIn}>
                <Button
                  type="submit"
                  className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-10 font-medium text-sm shadow-lg shadow-amber-900/20 transition-all duration-200 relative overflow-hidden group mt-2"
                  tabIndex={6}
                  disabled={processing}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.register.creating_account")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center relative z-10">
                      {t("auth.register.create_account_button")}
                      <motion.div animate={{ x: isHovering ? 5 : 0 }} transition={{ duration: 0.2 }} className="ml-2">
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </span>
                  )}
                  <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>

              <motion.div className="relative my-4" variants={fadeIn}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[#121212] text-gray-500">{t("auth.register.or")}</span>
                </div>
              </motion.div>

              <motion.div className="text-center" variants={fadeIn}>
                <p className="text-gray-400 text-sm">
                  {t("auth.register.have_account")}{" "}
                  <TextLink
                    href={route("customer.login")}
                    tabIndex={7}
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center justify-center gap-1 mt-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("auth.register.back_to_login")}
                  </TextLink>
                </p>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            className="mt-16 text-center text-xs text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {t("app.copyright", { year: new Date().getFullYear() })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
