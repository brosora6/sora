"use client"

import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Utensils, Mail, ArrowRight } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function CustomerResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation()
    const [isHovering, setIsHovering] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customer.password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center">
            <Head title={t("auth.reset_password.title") || "Reset Password"} />
            
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
                        <img 
                            src="/images/cook1.jpg" 
                            alt={t("auth.reset_password.hero_image_alt") || "Restaurant ambiance"}
                            className="w-full h-full object-cover"
                        />
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
                            <span className="text-2xl font-bold text-white">{t("app.name") || "Rumah Makan Salwa"}</span>
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
                            {t("auth.reset_password.hero_title") || "Create a new password"}
                        </h2>
                        <p className="text-gray-300 max-w-md">
                            {t("auth.reset_password.hero_description") || "Choose a strong password to keep your account secure"}
                        </p>
                    </motion.div>
                </div>
                
                {/* Right side - Reset Password form */}
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
                            <span className="text-2xl font-bold text-white">{t("app.name") || "Rumah Makan Salwa"}</span>
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
                            <h2 className="text-4xl font-bold text-white mb-3">
                                {t("auth.reset_password.title") || "Reset Password"}
                            </h2>
                            <p className="text-gray-400 text-lg">
                                {t("auth.reset_password.description") || "Please enter your new password below"}
                            </p>
                        </motion.div>
                        
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                <motion.div className="space-y-2" variants={fadeIn}>
                                    <Label htmlFor="email" className="text-white text-sm font-medium">
                                        {t("auth.reset_password.email_label") || "Email Address"}
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            readOnly
                                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="text-red-400 text-xs mt-1" />
                                </motion.div>

                                <motion.div className="space-y-2" variants={fadeIn}>
                                    <Label htmlFor="password" className="text-white text-sm font-medium">
                                        {t("auth.reset_password.password_label") || "New Password"}
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="text-red-400 text-xs mt-1" />
                                </motion.div>

                                <motion.div className="space-y-2" variants={fadeIn}>
                                    <Label htmlFor="password_confirmation" className="text-white text-sm font-medium">
                                        {t("auth.reset_password.confirm_password_label") || "Confirm Password"}
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-lg h-14 pl-12 w-full focus:border-amber-500 focus:ring-amber-500/20 placeholder:text-gray-600"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <InputError message={errors.password_confirmation} className="text-red-400 text-xs mt-1" />
                                </motion.div>

                                <motion.div variants={fadeIn}>
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-14 font-medium text-lg shadow-lg shadow-amber-900/20 transition-all duration-200 relative overflow-hidden group" 
                                        disabled={processing}
                                        onMouseEnter={() => setIsHovering(true)}
                                        onMouseLeave={() => setIsHovering(false)}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                {t("auth.reset_password.resetting") || "Resetting Password..."}
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center relative z-10">
                                                {t("auth.reset_password.reset_button") || "Reset Password"}
                                                <motion.div 
                                                    animate={{ x: isHovering ? 5 : 0 }} 
                                                    transition={{ duration: 0.2 }} 
                                                    className="ml-2"
                                                >
                                                    <ArrowRight className="h-5 w-5" />
                                                </motion.div>
                                            </span>
                                        )}
                                        <span className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    </Button>
                                </motion.div>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div
                        className="mt-16 text-center text-xs text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        {t("app.copyright", { year: new Date().getFullYear() }) || `© ${new Date().getFullYear()} Rumah Makan Salwa. All rights reserved.`}
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 