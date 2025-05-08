import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function CustomerLogin({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customer.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col justify-center">
            <Head title="Login" />
            
            <div className="grid md:grid-cols-2 h-screen">
                {/* Left side - Image */}
                <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img 
                        src="/images/cook1.jpg" 
                        alt="Motorcycle at night"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-8 left-8 z-20 flex items-center">
                        {/* <img 
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-iDUuZx8q74HbuOfQjIPSDQbSD16WAg.png"
                            alt="Solace Motorcycle Logo"
                            className="h-10 w-10 mr-3"
                        /> */}
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                </div>
                
                {/* Right side - Login form */}
                <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 relative">
                    <div className="md:hidden flex items-center justify-center mb-8">
                        {/* <img 
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-iDUuZx8q74HbuOfQjIPSDQbSD16WAg.png"
                            alt="Solace Motorcycle Logo"
                            className="h-12 w-12 mr-3"
                        /> */}
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-gray-400">Sign in to access your account</p>
                        </div>
                        
                        {status && (
                            <div className="mb-6 p-4 bg-green-900/20 border border-green-800 text-green-400 text-sm">
                                {status}
                            </div>
                        )}
                        
                        <form className="space-y-6" onSubmit={submit}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white text-sm uppercase tracking-wider">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.email} className="text-red-400 text-xs mt-1" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-white text-sm uppercase tracking-wider">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink 
                                            href={route('customer.password.request')} 
                                            className="text-xs text-gray-400 hover:text-white transition-colors" 
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.password} className="text-red-400 text-xs mt-1" />
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="border-gray-600 text-white rounded-none focus:ring-0 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                />
                                <Label htmlFor="remember" className="text-gray-300 text-sm ml-3">
                                    Remember me
                                </Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12 font-medium uppercase tracking-wider transition-colors" 
                                tabIndex={4} 
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                            
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-[#121212] text-gray-500">or</span>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <TextLink 
                                        href={route('customer.register')} 
                                        tabIndex={5} 
                                        className="text-white hover:text-gray-300 font-medium"
                                    >
                                        Create account
                                    </TextLink>
                                </p>
                            </div>
                        </form>
                    </div>
                    
                    <div className="mt-12 text-center text-xs text-gray-600">
                        © {new Date().getFullYear()} Rumah Makan Salwa. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}