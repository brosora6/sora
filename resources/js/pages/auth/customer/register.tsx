import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    no_telepon: string;
};

export default function CustomerRegister() {
    const { csrf_token } = usePage().props as any;
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        no_telepon: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customer.register'), {
            preserveScroll: true,
            preserveState: true,
            headers: {
                'X-CSRF-TOKEN': csrf_token,
            },
            onSuccess: () => {
                reset('password', 'password_confirmation');
                window.location.href = route('home');
            },
            onError: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col justify-center">
            <Head title="Register" />
            
            <div className="grid md:grid-cols-2 h-screen">
                {/* Left side - Image */}
                <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img 
                        src="/images/cook1.jpg" 
                        alt="Restaurant interior"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-8 left-8 z-20 flex items-center">
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                </div>
                
                {/* Right side - Register form */}
                <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 relative">
                    <div className="md:hidden flex items-center justify-center mb-8">
                        <span className="text-xl font-bold text-white">Rumah Makan Salwa</span>
                    </div>
                    
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-gray-400">Join the Rumah Makan Salwa community</p>
                        </div>
                        
                        <form className="space-y-6" onSubmit={submit}>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-white text-sm uppercase tracking-wider">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="John Doe"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.name} className="text-red-400 text-xs mt-1" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white text-sm uppercase tracking-wider">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="email@example.com"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.email} className="text-red-400 text-xs mt-1" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="no_telepon" className="text-white text-sm uppercase tracking-wider">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="no_telepon"
                                        type="tel"
                                        required
                                        tabIndex={3}
                                        value={data.no_telepon}
                                        onChange={(e) => setData('no_telepon', e.target.value)}
                                        disabled={processing}
                                        placeholder="+62 812-3456-7890"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.no_telepon} className="text-red-400 text-xs mt-1" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white text-sm uppercase tracking-wider">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="••••••••"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.password} className="text-red-400 text-xs mt-1" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-white text-sm uppercase tracking-wider">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={5}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="••••••••"
                                        className="bg-[#1a1a1a] border-gray-800 text-white rounded-none h-12 pl-4 w-full focus:border-white focus:ring-0 placeholder:text-gray-600"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="text-red-400 text-xs mt-1" />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12 font-medium uppercase tracking-wider transition-colors" 
                                tabIndex={6} 
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create Account"
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
                                    Already have an account?{' '}
                                    <TextLink 
                                        href={route('customer.login')} 
                                        tabIndex={7} 
                                        className="text-white hover:text-gray-300 font-medium"
                                    >
                                        Sign in
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