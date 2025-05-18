"use client"

import { Head, useForm, usePage } from "@inertiajs/react"
import { type FormEventHandler, useState } from "react"
import { Eye, EyeOff, LoaderCircle, Mail, Lock, ArrowRight, Utensils } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define the route function (assuming it's globally available or imported elsewhere)
declare function route(name: string, params?: any): string

type LoginForm = {
  email: string
  password: string
  remember: boolean
}

interface LoginProps {
  status?: string
  canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { t } = useTranslation()
  const { csrf_token } = usePage().props as any
  const [showPassword, setShowPassword] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: "",
    password: "",
    remember: false,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route("customer.login"), {
      onSuccess: () => {
        window.location.href = route("home")
      },
      onError: () => {
        reset("password")
      },
      preserveScroll: true,
      preserveState: true,
      headers: {
        "X-CSRF-TOKEN": csrf_token,
      },
    })
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center">
      <Head title={t("auth.login.title")} />

      <div className="grid md:grid-cols-2 h-screen">
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
            <img src="/images/cook1.jpg" alt={t("auth.login.hero_image_alt")} className="w-full h-full object-cover" />
          </motion.div>

          {/* Branding on image */}
          <motion.div
            className="absolute top-0 left-0 w-full z-20 p-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => window.location.href = route("home")}
            >
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <Utensils className="h-5 w-5 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">{t("app.name")}</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="absolute bottom-0 left-0 w-full z-20 p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              {t("auth.login.hero_title.prefix")}{" "}
              <span className="text-amber-400">{t("auth.login.hero_title.highlight")}</span>{" "}
              {t("auth.login.hero_title.suffix")}
            </h2>
            <p className="text-gray-300 max-w-md">
              {t("auth.login.hero_description")}
            </p>
          </motion.div>
        </div>

        {/* Right side - Login form with enhanced styling */}
        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 relative bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
          {/* Mobile logo */}
          <motion.div
            className="md:hidden flex items-center justify-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => window.location.href = route("home")}
            >
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <Utensils className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">{t("app.name")}</span>
            </div>
          </motion.div>

          {/* Form container with animations */}
          <motion.div
            className="max-w-md w-full mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            <motion.div className="mb-10" variants={fadeIn}>
              <h2 className="text-4xl font-bold text-white mb-3">{t("auth.login.welcome_back")}</h2>
              <p className="text-gray-400 text-lg">{t("auth.login.sign_in_prompt")}</p>
            </motion.div>

            {status && (
              <motion.div
                className="mb-6 p-4 bg-green-900/20 border border-green-800/50 text-green-400 text-sm rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                {status}
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={submit}>
              <input type="hidden" name="_token" value={csrf_token} />

              <motion.div className="space-y-2" variants={fadeIn}>
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  {t("auth.login.email_label")}
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder={t("auth.login.email_placeholder")}
                    className="bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200"
                  />
                </div>
                <InputError message={errors.email} className="text-red-400 text-xs mt-1" />
              </motion.div>

              <motion.div className="space-y-2" variants={fadeIn}>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white text-sm font-medium">
                    {t("auth.login.password_label")}
                  </Label>
                  {canResetPassword && (
                    <TextLink
                      href={route("customer.password.request")}
                      className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                      tabIndex={5}
                    >
                      {t("auth.login.forgot_password")}
                    </TextLink>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    tabIndex={2}
                    autoComplete="current-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder={t("auth.login.password_placeholder")}
                    className="bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 pr-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <InputError message={errors.password} className="text-red-400 text-xs mt-1" />
              </motion.div>

              <motion.div className="flex items-center" variants={fadeIn}>
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData("remember", !data.remember)}
                  tabIndex={3}
                  className="border-gray-600 text-amber-500 rounded-sm focus:ring-amber-500/20 data-[state=checked]:bg-amber-500 data-[state=checked]:text-black"
                />
                <Label htmlFor="remember" className="text-gray-300 text-sm ml-3">
                  {t("auth.login.remember_me")}
                </Label>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Button
                  type="submit"
                  className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-14 font-medium text-lg shadow-lg shadow-amber-900/20 transition-all duration-200 relative overflow-hidden group"
                  tabIndex={4}
                  disabled={processing}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                      {t("auth.login.signing_in")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center relative z-10">
                      {t("auth.login.sign_in")}
                      <motion.div animate={{ x: isHovering ? 5 : 0 }} transition={{ duration: 0.2 }} className="ml-2">
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </span>
                  )}
                  <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>

              <motion.div className="relative my-8" variants={fadeIn}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[#121212] text-gray-500">{t("auth.login.or_continue_with")}</span>
                </div>
              </motion.div>

              <motion.div className="text-center" variants={fadeIn}>
                <p className="text-gray-400 text-base">
                  {t("auth.login.no_account")}{" "}
                  <TextLink
                    href={route("customer.register")}
                    tabIndex={5}
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    {t("auth.login.create_account")}
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
