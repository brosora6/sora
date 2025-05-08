import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordForm {
    email: string;
}

interface ForgotPasswordProps {
    status?: string;
}

export default function CustomerForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm<Required<ForgotPasswordForm>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customer.password.email'));
    };

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col justify-center">
            <Head title="Forgot Password" />
            
            <div className="grid md:grid-cols-2 h-screen">
                {/* Left side - Image */}
                <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img 
                        src="/images/cook1.jpg" 
                        alt="Restaurant ambiance"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-8 left-8 z-20 flex items-center">
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                </div>
                
                {/* Right side - Forgot Password form */}
                <div className="flex flex-col justify-center p-8">
                    <div className="md:hidden flex items-center justify-center mb-8">
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
                            <p className="text-gray-400">Enter your email address and we'll send you a password reset link</p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-900/20 border border-green-800 text-green-400 text-sm">
                                {status}
                            </div>
                        )}
                        
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white text-sm uppercase tracking-wider">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                        autoComplete="email"
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} className="text-red-400 text-xs mt-1" />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12 font-medium uppercase tracking-wider transition-colors" 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Reset Link...
                                        </span>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>

                                <div className="text-center">
                                    <TextLink 
                                        href={route('customer.login')} 
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        Back to Login
                                    </TextLink>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 