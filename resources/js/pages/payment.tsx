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
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { LoaderCircle, CreditCard, Upload, CheckCircle, ArrowLeft, Copy } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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
}

export default function Payment({ auth, carts }: PaymentProps) {
  const [loading, setLoading] = useState(false)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const totalAmount = carts.reduce((sum, item) => sum + item.price, 0)
  const totalItems = carts.reduce((sum, item) => sum + item.quantity, 0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentProof(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
      router.visit("/payment/success")
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

      <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white mb-4 pl-0"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold">Complete Your Payment</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-[#1a1a1a] border border-gray-800 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4">
                  {carts.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.menu.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} × Rp {item.menu.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">Rp {item.price.toLocaleString()}</p>
                    </div>
                  ))}

                  <Separator className="bg-gray-800 my-4" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>Rp {totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-[#1a1a1a] border border-gray-800 p-6 md:p-8">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Payment Details</h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bank Transfer Information</h3>
                    <div className="bg-[#121212] border border-gray-800 p-6 rounded-none">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-bold text-white text-lg">Bank BCA</p>
                          <p className="text-gray-400">Transfer the exact amount to complete your order</p>
                        </div>
                        <div className="h-12 w-12 bg-white p-1 rounded">
                          <img
                            src="/images/bca-logo.png"
                            alt="BCA Logo"
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/images/placeholder.jpg"
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Account Number</p>
                          <div className="flex items-center">
                            <p className="font-mono font-medium text-white mr-2">1234567890</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard("1234567890")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Account Name</p>
                          <p className="font-medium text-white">SOLACE MOTORCYCLE</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-gray-400">Amount</p>
                          <div className="flex items-center">
                            <p className="font-mono font-bold text-white mr-2">Rp {totalAmount.toLocaleString()}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
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
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center mr-3">
                        <Upload className="h-3 w-3 text-white" />
                      </div>
                      <Label htmlFor="payment_proof" className="text-lg font-medium">
                        Upload Payment Proof
                      </Label>
                    </div>

                    <div className="bg-[#121212] border border-gray-800 p-6 rounded-none">
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-700 rounded-none p-6 text-center">
                          {previewUrl ? (
                            <div className="space-y-4">
                              <div className="relative mx-auto max-w-xs">
                                <img
                                  src={previewUrl || "/placeholder.svg"}
                                  alt="Payment proof preview"
                                  className="max-h-48 mx-auto"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                                  onClick={() => {
                                    setPaymentProof(null)
                                    setPreviewUrl(null)
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                              <p className="text-sm text-green-500 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Image uploaded successfully
                              </p>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400 mb-2">Drag and drop your payment proof here</p>
                              <p className="text-gray-500 text-sm mb-4">or</p>
                              <Button
                                type="button"
                                variant="outline"
                                className="border-gray-700 text-white hover:bg-gray-800 rounded-none"
                                onClick={() => document.getElementById("payment_proof")?.click()}
                              >
                                Browse Files
                              </Button>
                            </>
                          )}
                          <Input
                            id="payment_proof"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="hidden"
                          />
                        </div>
                        <p className="text-sm text-gray-400">
                          Please upload a clear image of your payment receipt or screenshot. Supported formats: JPG,
                          PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12"
                    disabled={loading || !paymentProof}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      "Complete Payment"
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Your payment will be verified within 24 hours. You will receive a confirmation email once verified.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
