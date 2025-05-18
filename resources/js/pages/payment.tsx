"use client"

import type React from "react"

import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  LoaderCircle,
  CreditCard,
  Upload,
  CheckCircle,
  ArrowLeft,
  Copy,
  ShoppingCart,
  AlertCircle,
  ImageIcon,
  RefreshCw,
  X,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { route } from "ziggy-js"

interface CartItem {
  id: number
  menu: {
    name: string
    price: number
  }
  quantity: number
  price: number
}

interface PaymentProps {
  auth: {
    user: any
  }
  carts: CartItem[]
  bankAccounts: Array<{
    id: number
    bank_name: string
    account_number: string
    account_name: string
    is_active: boolean
  }>
}

// Add CSRF token setup
axios.defaults.headers.common["X-CSRF-TOKEN"] = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute("content")

export default function Payment({
  auth,
  carts = [],
  bankAccounts = [
    {
      id: 1,
      bank_name: "BCA",
      account_number: "1234567890",
      account_name: "SOLACE MOTORCYCLE",
      is_active: true,
    },
  ],
}: PaymentProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadKey, setUploadKey] = useState(Date.now())
  const [isNavigating, setIsNavigating] = useState(false)
  const [selectedBankAccount, setSelectedBankAccount] = useState<number | null>(null)

  const handleBackToCart = () => {
    setIsNavigating(true)
    router.get(route("cart"))
  }

  useEffect(() => {
    if (!carts || carts.length === 0) {
      toast.error(t("cart.empty.title"))
      router.get(route("cart"))
    }
  }, [carts, t])

  const totalAmount = carts.reduce((sum, item) => sum + item.price, 0)
  const totalItems = carts.reduce((sum, item) => sum + item.quantity, 0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updatePaymentProof(file)
    }
  }

  const updatePaymentProof = (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("payment.error.file_size"))
      return
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("payment.error.file_type"))
      return
    }

    setPaymentProof(file)

    // Only create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      // For PDFs, show a generic preview
      setPreviewUrl("pdf")
    }

    toast.success(t("payment.proof_uploaded"))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      updatePaymentProof(e.dataTransfer.files[0])
    }
  }

  const resetFileUpload = () => {
    setPaymentProof(null)
    setPreviewUrl(null)
    setUploadKey(Date.now()) // This forces the file input to reset
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentProof) {
      toast.error(t("payment.proof_required"))
      return
    }

    if (!selectedBankAccount) {
      toast.error(t("payment.bank_required"))
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('payment_proof', paymentProof)
      formData.append('total_amount', totalAmount.toString())
      formData.append('bank_account_id', selectedBankAccount.toString())

      const response = await axios.post("/api/payments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success(t("payment.success.submitted"))
      router.visit(`/payment/success?order=${response.data.payment.order_number}`)
    } catch (error: any) {
      console.error("Payment error:", error)
      toast.error(t("payment.error.process_failed"))
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t("payment.success.copied"))
    } catch (err) {
      console.error("Failed to copy:", err)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        toast.success(t("payment.success.copied"))
      } catch (err) {
        toast.error(t("payment.error.copy_failed"))
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <>
      <Head title={t("payment.title")} />
      <Navbar auth={auth} />

      <main className="min-h-screen bg-[#0f0f0f] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.1),rgba(255,255,255,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Header Section with Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                className="relative inline-flex items-center text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 active:bg-amber-500/20 group px-4 py-2 rounded-full border border-transparent hover:border-amber-500/20 transition-all duration-200"
                onClick={() => router.visit('/cart', { preserveState: true })}
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                <span>{t("payment.back_to_cart")}</span>
              </Button>
              
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <span className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-medium">1</div>
                  <span className="ml-2 text-amber-400">Cart</span>
                </span>
                <div className="w-12 h-0.5 bg-amber-500"></div>
                <span className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-medium">2</div>
                  <span className="ml-2 text-amber-400">Payment</span>
                </span>
                <div className="w-12 h-0.5 bg-gray-700"></div>
                <span className="flex items-center opacity-50">
                  <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center font-medium">3</div>
                  <span className="ml-2 text-gray-400">Complete</span>
                </span>
              </div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400"
            >
              {t("payment.complete_payment")}
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary Card */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 sticky top-24 overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent"></div>
                <div className="relative">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-amber-400" />
                    {t("payment.order_summary")}
                  </h2>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                    {carts.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-between group p-3 rounded-xl hover:bg-amber-500/5 transition-colors duration-200"
                      >
                        <div>
                          <p className="font-medium group-hover:text-amber-400 transition-colors">{item.menu.name}</p>
                          <p className="text-sm text-gray-400">
                            {t("payment.item_quantity", { quantity: item.quantity, price: item.menu.price.toLocaleString() })}
                          </p>
                        </div>
                        <p className="font-medium text-amber-400">{t("payment.currency")} {item.price.toLocaleString()}</p>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="bg-gray-800/50 my-6" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>{t("payment.total")}</span>
                    <span className="text-amber-400">{t("payment.currency")} {totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="mt-6 text-center">
                    <span className="inline-flex items-center justify-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm rounded-full">
                      {totalItems} {totalItems === 1 ? t("payment.item") : t("payment.items")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent"></div>
                <div className="relative">
                  <div className="flex items-center mb-8">
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
                      {t("payment.details")}
                    </h2>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center mr-3 text-sm text-amber-400 font-bold">
                          1
                        </span>
                        {t("payment.bank_transfer_info")}
                      </h3>
                      <div className="bg-[#121212]/80 backdrop-blur border border-gray-800/50 p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-gray-400">{t("payment.select_bank")}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {bankAccounts.filter(account => account.is_active).map((account) => (
                            <motion.div
                              key={account.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                                selectedBankAccount === account.id
                                  ? 'border-amber-500 bg-amber-500/10'
                                  : 'border-gray-700/50 hover:border-amber-500/50'
                              }`}
                              onClick={() => setSelectedBankAccount(account.id)}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-white text-xl">{account.bank_name}</p>
                                  <p className="text-gray-400 mt-1">{t("payment.transfer_instruction")}</p>
                                </div>
                                {selectedBankAccount === account.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="h-6 w-6 rounded-full bg-amber-500 flex items-center justify-center"
                                  >
                                    <CheckCircle className="h-4 w-4 text-black" />
                                  </motion.div>
                                )}
                              </div>

                              <div className="space-y-4 mt-6">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                                  <p className="text-gray-400">{t("payment.account_number")}</p>
                                  <div className="flex items-center">
                                    <p className="font-mono font-medium text-white mr-3">
                                      {account.account_number}
                                    </p>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-400 rounded-full transition-colors"
                                      onClick={() => copyToClipboard(account.account_number)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
                                  <p className="text-gray-400">{t("payment.account_name")}</p>
                                  <p className="font-medium text-white">{account.account_name}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {!selectedBankAccount && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4"
                            >
                              <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                              <p className="text-sm text-amber-400">
                                {t("payment.bank_required")}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center mr-3 text-sm text-amber-400 font-bold">
                          2
                        </span>
                        {t("payment.upload_proof")}
                      </h3>

                      <div className="bg-[#121212]/80 backdrop-blur border border-gray-800/50 p-6 rounded-xl">
                        <div className="space-y-4">
                          {previewUrl ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="space-y-4"
                            >
                              <div className="relative mx-auto max-w-sm">
                                {previewUrl === "pdf" ? (
                                  <div className="h-56 flex items-center justify-center bg-gray-800/50 rounded-xl border border-gray-700/50">
                                    <div className="text-center">
                                      <div className="bg-amber-500/10 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                        <Upload className="h-10 w-10 text-amber-400" />
                                      </div>
                                      <p className="text-white font-medium">{t("payment.pdf_document")}</p>
                                      <p className="text-gray-400 text-sm mt-2">{paymentProof?.name}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={previewUrl || "/placeholder.svg"}
                                    alt={t("payment.image.preview_alt")}
                                    className="max-h-56 w-full object-cover mx-auto rounded-xl border border-gray-700/50 shadow-xl"
                                  />
                                )}

                                <div className="absolute top-3 right-3 flex space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-full backdrop-blur-sm"
                                    onClick={() => {
                                      document.getElementById("payment_proof")?.click()
                                    }}
                                    title={t("payment.button.replace_file")}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-full backdrop-blur-sm"
                                    onClick={resetFileUpload}
                                    title={t("payment.button.remove_file")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-green-500 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t("payment.proof_uploaded")}
                              </p>
                              <p className="text-xs text-gray-400 text-center">
                                {t("payment.replace_instruction")}
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`border-2 border-dashed ${
                                dragActive ? "border-amber-500 bg-amber-500/5" : "border-gray-700/50"
                              } rounded-xl p-8 text-center transition-all duration-200`}
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                            >
                              <div className="bg-amber-500/10 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                <ImageIcon className="h-10 w-10 text-amber-400" />
                              </div>
                              <p className="text-gray-300 text-lg mb-2">{t("payment.drag_drop")}</p>
                              <p className="text-gray-500 text-sm mb-6">{t("payment.or")}</p>
                              <Button
                                type="button"
                                variant="outline"
                                className="border-gray-700/50 text-white hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 rounded-full px-6 transition-all duration-200"
                                onClick={() => document.getElementById("payment_proof")?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {t("payment.browse_files")}
                              </Button>
                            </motion.div>
                          )}

                          <Input
                            id="payment_proof"
                            key={uploadKey}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />

                          <p className="text-sm text-gray-400 text-center">
                            {t("payment.upload_instruction")}
                          </p>

                          {!paymentProof && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4"
                            >
                              <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                              <p className="text-sm text-amber-400">
                                {t("payment.proof_required")}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 rounded-full h-14 text-lg font-semibold shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-amber-600 transition-all duration-200"
                        disabled={loading || !paymentProof || !selectedBankAccount}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                            {t("payment.processing")}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            {!selectedBankAccount && !paymentProof ? (
                              t("payment.complete_button.select_both")
                            ) : !selectedBankAccount ? (
                              t("payment.complete_button.select_bank")
                            ) : !paymentProof ? (
                              t("payment.complete_button.upload_proof")
                            ) : (
                              t("payment.complete_button")
                            )}
                            <CheckCircle className="ml-2 h-5 w-5" />
                          </span>
                        )}
                      </Button>

                      <p className="text-sm text-gray-500 text-center mt-4">
                        {t("payment.verification_note")}
                      </p>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
