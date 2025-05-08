import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

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

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col justify-center">
            <Head title="Reset Password" />
            
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
                
                {/* Right side - Reset Password form */}
                <div className="flex flex-col justify-center p-8">
                    <div className="md:hidden flex items-center justify-center mb-8">
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                            <p className="text-gray-400">Please enter your new password below</p>
                        </div>
                        
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
                                        autoComplete="email"
                                        value={data.email}
                                        readOnly
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                    <InputError message={errors.email} className="text-red-400 text-xs mt-1" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white text-sm uppercase tracking-wider">
                                        New Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                    <InputError message={errors.password} className="text-red-400 text-xs mt-1" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-white text-sm uppercase tracking-wider">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                        placeholder="••••••••"
                                    />
                                    <InputError message={errors.password_confirmation} className="text-red-400 text-xs mt-1" />
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12 font-medium uppercase tracking-wider transition-colors" 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting Password...
                                        </span>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 