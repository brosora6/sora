import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    no_telepon: string;
};

export default function CustomerRegister() {
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
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="CREATE ACCOUNT" description="Join the Solace Motorcycle community">
            <Head title="Register | Solace Motorcycle" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-white text-sm font-medium">NAME</Label>
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
                            placeholder="Full name"
                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-none focus:border-white focus:ring-0 placeholder:text-gray-500"
                        />
                        <InputError message={errors.name} className="mt-2 text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white text-sm font-medium">EMAIL ADDRESS</Label>
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
                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-none focus:border-white focus:ring-0 placeholder:text-gray-500"
                        />
                        <InputError message={errors.email} className="text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="no_telepon" className="text-white text-sm font-medium">PHONE NUMBER</Label>
                        <Input
                            id="no_telepon"
                            type="tel"
                            required
                            tabIndex={3}
                            value={data.no_telepon}
                            onChange={(e) => setData('no_telepon', e.target.value)}
                            disabled={processing}
                            placeholder="Phone number"
                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-none focus:border-white focus:ring-0 placeholder:text-gray-500"
                        />
                        <InputError message={errors.no_telepon} className="text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-white text-sm font-medium">PASSWORD</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-none focus:border-white focus:ring-0 placeholder:text-gray-500"
                        />
                        <InputError message={errors.password} className="text-red-400" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-white text-sm font-medium">CONFIRM PASSWORD</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                            className="bg-[#1a1a1a] border-gray-800 text-white rounded-none focus:border-white focus:ring-0 placeholder:text-gray-500"
                        />
                        <InputError message={errors.password_confirmation} className="text-red-400" />
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full bg-white text-black hover:bg-gray-200 rounded-none font-medium" 
                        tabIndex={6} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        CREATE ACCOUNT
                    </Button>
                </div>

                <div className="text-gray-400 text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('customer.login')} tabIndex={7} className="text-white hover:text-gray-300 font-medium">
                        LOG IN
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}