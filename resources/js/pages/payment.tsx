"use client"

import type React from "react"

import { Head } from "@inertiajs/react"
import { useState } from "react"
import axios from "axios"
import { router } from "@inertiajs/react"
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
  bankAccounts?: Array<{
    id: number
    bank_name: string
    account_number: string
    account_name: string
    is_primary: boolean
  }>
}

export default function Payment({
  auth,
  carts,
  bankAccounts = [
    {
      id: 1,
      bank_name: "BCA",
      account_number: "1234567890",
      account_name: "SOLACE MOTORCYCLE",
      is_primary: true,
    },
  ],
}: PaymentProps) {
  const [loading, setLoading] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadKey, setUploadKey] = useState(Date.now()) // Used to reset the file input

  const totalAmount = carts.reduce((sum, item) => sum + item.price, 0)
  const totalItems = carts.reduce((sum, item) => sum + item.quantity, 0)

  // Sort bank accounts to show primary first
  const sortedBankAccounts = [...bankAccounts].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return 0
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updatePaymentProof(file)
    }
  }

  const updatePaymentProof = (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit")
      return
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed")
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

    toast.success("Payment proof uploaded successfully")
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
      toast.error("Please upload payment proof")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("payment_proof", paymentProof)
      formData.append("total_amount", totalAmount.toString())

      const response = await axios.post("/api/payments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Payment submitted successfully")
      router.visit(`/payment/success?order=${response.data.payment.order_number}`)
    } catch (error: any) {
      console.error("Payment error:", error)
      toast.error(error.response?.data?.message || "Failed to process payment")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <>
      <Head title="Payment | Solace Motorcycle" />
      <Navbar auth={auth} />

      <main className="bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-amber-400 mb-4 pl-0 -ml-2 group"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#1a1a1a]/70 border border-gray-800 rounded-xl p-6 sticky top-24 overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-50"></div>
                <div className="relative">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-amber-400" />
                    Order Summary
                  </h2>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    {carts.map((item) => (
                      <div key={item.id} className="flex justify-between group">
                        <div>
                          <p className="font-medium group-hover:text-amber-400 transition-colors">{item.menu.name}</p>
                          <p className="text-sm text-gray-400">
                            {item.quantity} × Rp {item.menu.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium text-amber-400">Rp {item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-800 my-4" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-amber-400">Rp {totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-full">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
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
                className="bg-[#1a1a1a]/70 border border-gray-800 rounded-xl p-6 md:p-8 overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-30"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-4">
                      <CreditCard className="h-5 w-5 text-amber-400" />
                    </div>
                    <h2 className="text-xl font-bold">Payment Details</h2>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center mr-2 text-xs text-amber-400 font-bold">
                          1
                        </span>
                        Bank Transfer Information
                      </h3>
                      <div className="bg-[#121212] border border-gray-800 p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-bold text-white text-lg">{sortedBankAccounts[0].bank_name}</p>
                            <p className="text-gray-400">Transfer the exact amount to complete your order</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-gray-400">Account Number</p>
                            <div className="flex items-center">
                              <p className="font-mono font-medium text-white mr-2">
                                {sortedBankAccounts[0].account_number}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-400 rounded-full"
                                onClick={() => copyToClipboard(sortedBankAccounts[0].account_number)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-gray-400">Account Name</p>
                            <p className="font-medium text-white">{sortedBankAccounts[0].account_name}</p>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-gray-400">Amount</p>
                            <div className="flex items-center">
                              <p className="font-mono font-bold text-amber-400 mr-2">
                                Rp {totalAmount.toLocaleString()}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-400 rounded-full"
                                onClick={() => copyToClipboard(totalAmount.toString())}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center mr-2 text-xs text-amber-400 font-bold">
                          2
                        </span>
                        Upload Payment Proof
                      </h3>

                      <div className="bg-[#121212] border border-gray-800 p-6 rounded-xl">
                        <div className="space-y-4">
                          {previewUrl ? (
                            <div className="space-y-4">
                              <div className="relative mx-auto max-w-xs">
                                {previewUrl === "pdf" ? (
                                  <div className="h-48 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="text-center">
                                      <div className="bg-amber-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-amber-400" />
                                      </div>
                                      <p className="text-white font-medium">PDF Document</p>
                                      <p className="text-gray-400 text-sm mt-1">{paymentProof?.name}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={previewUrl || "/placeholder.svg"}
                                    alt="Payment proof preview"
                                    className="max-h-48 mx-auto rounded-lg border border-gray-700"
                                  />
                                )}

                                <div className="absolute top-2 right-2 flex space-x-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-full"
                                    onClick={() => {
                                      document.getElementById("payment_proof")?.click()
                                    }}
                                    title="Replace file"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-full"
                                    onClick={resetFileUpload}
                                    title="Remove file"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-green-500 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Payment proof uploaded successfully
                              </p>
                              <p className="text-xs text-gray-400 text-center">
                                You can replace this file by clicking the refresh icon or dragging a new file
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`border-2 border-dashed ${
                                dragActive ? "border-amber-500 bg-amber-500/5" : "border-gray-700"
                              } rounded-xl p-6 text-center transition-colors`}
                              onDragEnter={handleDrag}
                              onDragLeave={handleDrag}
                              onDragOver={handleDrag}
                              onDrop={handleDrop}
                            >
                              <div className="bg-amber-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-amber-400" />
                              </div>
                              <p className="text-gray-300 mb-2">Drag and drop your payment proof here</p>
                              <p className="text-gray-500 text-sm mb-4">or</p>
                              <Button
                                type="button"
                                variant="outline"
                                className="border-gray-700 text-white hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-400 rounded-full"
                                onClick={() => document.getElementById("payment_proof")?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Browse Files
                              </Button>
                            </div>
                          )}

                          <Input
                            id="payment_proof"
                            key={uploadKey} // This forces the component to re-render when we reset
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />

                          <p className="text-sm text-gray-400">
                            Please upload a clear image of your payment receipt or screenshot. Supported formats: JPG,
                            PNG, PDF (max 5MB)
                          </p>

                          {!paymentProof && (
                            <div className="flex items-center mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                              <AlertCircle className="h-4 w-4 text-amber-400 mr-2 flex-shrink-0" />
                              <p className="text-xs text-amber-400">
                                Payment proof is required to complete your order. Please upload a screenshot of your
                                transfer receipt.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-full h-12 shadow-lg shadow-amber-900/20"
                      disabled={loading || !paymentProof}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Complete Payment
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Your payment will be verified within 24 hours. You will receive a confirmation email once
                      verified.
                    </p>
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
