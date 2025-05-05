import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { LoaderCircle, ShoppingCart, Calendar, CreditCard, Camera, Trash2, User, Mail, Phone, Save, ChevronRight } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            no_telepon: string;
            profile_photo?: string;
            profile_photo_url?: string;
            email_verified_at?: string;
            carts?: any[];
            reservations?: any[];
            payments?: any[];
        };
    };
    status?: string;
    mustVerifyEmail?: boolean;
}

type ProfileForm = {
    name: string;
    email: string;
    no_telepon: string;
    profile_photo?: File | null;
    remove_photo: boolean;
}

export default function Profile({ auth, status, mustVerifyEmail }: ProfileProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [activityFilter, setActivityFilter] = useState('all');
    
    // Initialize form with user data
    const { data, setData, errors, reset, processing } = useForm<ProfileForm>({
        name: auth.user.name,
        email: auth.user.email,
        no_telepon: auth.user.no_telepon || '',
        profile_photo: null,
        remove_photo: false,
    });

    const getPhotoUrl = (): string | undefined => {
        if (photoPreview) return photoPreview;
        if (auth.user.profile_photo) {
            return `/storage/${auth.user.profile_photo}`;
        }
        return undefined;
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            setData('remove_photo', false);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoRemove = () => {
        setData('profile_photo', null);
        setData('remove_photo', true);
        setPhotoPreview(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Create form data
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('no_telepon', data.no_telepon);
        
        if (data.profile_photo instanceof File) {
            formData.append('profile_photo', data.profile_photo);
        }
        formData.append('remove_photo', data.remove_photo ? '1' : '0');

        // Submit the form using Inertia's router
        router.post(route('profile.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Profile | Solace Motorcycle" />
            <Navbar auth={auth} />

            <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="relative mb-12">
                        {/* Background Banner */}
                        <div className="h-48 w-full bg-gradient-to-r from-gray-900 to-black rounded-lg overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/horde1.jpg-M9FqtdHbTEKOupNuwHndNNdbeNZr2A.jpeg')] bg-cover bg-center mix-blend-overlay"></div>
                        </div>
                        
                        {/* Profile Photo and Name */}
                        <div className="absolute bottom-0 left-8 transform translate-y-1/2 flex items-end">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-[#121212] overflow-hidden bg-[#1a1a1a]">
                                    {getPhotoUrl() ? (
                                        <img 
                                            src={getPhotoUrl() || "/placeholder.svg"} 
                                            alt={auth.user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                            {auth.user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Photo Upload Overlay */}
                                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                    <div className="flex flex-col items-center">
                                        <label htmlFor="profile_photo" className="cursor-pointer p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                            <Camera className="h-5 w-5 text-white" />
                                            <input
                                                id="profile_photo"
                                                name="profile_photo"
                                                type="file"
                                                onChange={handlePhotoChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="ml-6 mb-4">
                                <h1 className="text-3xl font-bold text-white">{auth.user.name}</h1>
                                <p className="text-gray-400">{auth.user.email}</p>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-0 right-8 transform translate-y-1/2">
                            {(auth.user.profile_photo || photoPreview) && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handlePhotoRemove}
                                    className="rounded-none bg-red-900 hover:bg-red-800 text-white border-none"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove Photo
                                </Button>
                            )}
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-20">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1a1a1a] border border-gray-800 p-1">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full text-left p-4 flex items-center justify-between ${activeTab === 'profile' ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`}
                                >
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 mr-3" />
                                        <span>Profile Information</span>
                                    </div>
                                    {activeTab === 'profile' && <ChevronRight className="h-4 w-4" />}
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab('activity')}
                                    className={`w-full text-left p-4 flex items-center justify-between ${activeTab === 'activity' ? 'bg-white text-black' : 'text-white hover:bg-gray-800'}`}
                                >
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 mr-3" />
                                        <span>Activity</span>
                                    </div>
                                    {activeTab === 'activity' && <ChevronRight className="h-4 w-4" />}
                                </button>
                            </div>
                            
                            {/* Stats Summary */}
                            <div className="mt-8 bg-[#1a1a1a] border border-gray-800 p-6 space-y-6">
                                <h3 className="text-lg font-medium text-white mb-4">Account Summary</h3>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-300">Cart Items</span>
                                    </div>
                                    <span className="text-white font-medium">{auth.user.carts?.filter(cart => !cart.payment_id).length || 0}</span>
                                </div>
                                
                                <Separator className="bg-gray-800" />
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-300">Reservations</span>
                                    </div>
                                    <span className="text-white font-medium">{auth.user.reservations?.length || 0}</span>
                                </div>
                                
                                <Separator className="bg-gray-800" />
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-300">Payments</span>
                                    </div>
                                    <span className="text-white font-medium">{auth.user.payments?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {activeTab === 'profile' && (
                                <div className="bg-[#1a1a1a] border border-gray-800">
                                    <div className="p-8">
                                        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                                        
                                        <form onSubmit={submit} className="space-y-8">
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="text-sm text-gray-400 uppercase tracking-wider">Name</Label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                                            <Input
                                                                id="name"
                                                                name="name"
                                                                type="text"
                                                                value={data.name}
                                                                onChange={e => setData('name', e.target.value)}
                                                                required
                                                                autoComplete="name"
                                                                className="bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-none focus:border-white focus:ring-0"
                                                            />
                                                        </div>
                                                        <InputError message={errors.name} className="text-red-400 text-xs" />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="text-sm text-gray-400 uppercase tracking-wider">Email</Label>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                                            <Input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                value={data.email}
                                                                onChange={e => setData('email', e.target.value)}
                                                                required
                                                                autoComplete="email"
                                                                className="bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-none focus:border-white focus:ring-0"
                                                            />
                                                        </div>
                                                        <InputError message={errors.email} className="text-red-400 text-xs" />
                                                        {mustVerifyEmail && !auth.user.email_verified_at && (
                                                            <p className="text-xs text-yellow-500 flex items-center mt-1">
                                                                <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                                                Your email address is unverified
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="no_telepon" className="text-sm text-gray-400 uppercase tracking-wider">Phone Number</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                                                        <Input
                                                            id="no_telepon"
                                                            name="no_telepon"
                                                            type="tel"
                                                            value={data.no_telepon}
                                                            onChange={e => setData('no_telepon', e.target.value)}
                                                            placeholder="08xxxxxxxxxxx"
                                                            required
                                                            className="bg-[#121212] border-gray-800 text-white pl-10 h-12 rounded-none focus:border-white focus:ring-0"
                                                        />
                                                    </div>
                                                    <InputError message={errors.no_telepon} className="text-red-400 text-xs" />
                                                    <p className="text-xs text-gray-500">
                                                        Enter your phone number starting with 08 (e.g., 0878743646120)
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="bg-white text-black hover:bg-gray-200 rounded-none h-12 px-8"
                                                >
                                                    {processing ? (
                                                        <span className="flex items-center">
                                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                            Saving...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </span>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'activity' && (
                                <div className="bg-[#1a1a1a] border border-gray-800">
                                    <div className="p-8">
                                        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                                        
                                        {/* Activity Tabs */}
                                        <div className="border-b border-gray-800 mb-6">
                                            <div className="flex space-x-8">
                                                <button 
                                                    onClick={() => setActivityFilter('all')}
                                                    className={`pb-4 font-medium transition-colors ${
                                                        activityFilter === 'all' 
                                                        ? 'text-white border-b-2 border-white' 
                                                        : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    All Activity
                                                </button>
                                                <button 
                                                    onClick={() => setActivityFilter('orders')}
                                                    className={`pb-4 font-medium transition-colors ${
                                                        activityFilter === 'orders' 
                                                        ? 'text-white border-b-2 border-white' 
                                                        : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    Orders
                                                </button>
                                                <button 
                                                    onClick={() => setActivityFilter('reservations')}
                                                    className={`pb-4 font-medium transition-colors ${
                                                        activityFilter === 'reservations' 
                                                        ? 'text-white border-b-2 border-white' 
                                                        : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    Reservations
                                                </button>
                                                <button 
                                                    onClick={() => setActivityFilter('payments')}
                                                    className={`pb-4 font-medium transition-colors ${
                                                        activityFilter === 'payments' 
                                                        ? 'text-white border-b-2 border-white' 
                                                        : 'text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    Payments
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Activity List */}
                                        {(auth.user.reservations?.length || 0) > 0 || (auth.user.carts?.length || 0) > 0 || (auth.user.payments?.length || 0) > 0 ? (
                                            <div className="space-y-4">
                                                {/* Reservations */}
                                                {(activityFilter === 'all' || activityFilter === 'reservations') && 
                                                    auth.user.reservations?.map((reservation: any) => (
                                                        <div key={reservation.id} className="bg-[#121212] p-4 border border-gray-800">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <p className="font-medium">Reservasi #{reservation.id}</p>
                                                                    <p className="text-sm text-gray-400">
                                                                        {(() => {
                                                                            const date = new Date(reservation.tanggal);
                                                                            const time = reservation.waktu;
                                                                            return `${date.toLocaleDateString('id-ID', {
                                                                                weekday: 'long',
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric'
                                                                            })} pukul ${time} WIB`;
                                                                        })()}
                                                                    </p>
                                                                </div>
                                                                <div className={`px-3 py-1 rounded-full text-sm ${
                                                                    reservation.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                                                    reservation.status === 'rejected' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                                                    'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                                                                }`}>
                                                                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                                                </div>
                                                            </div>
                                                            {reservation.note && (
                                                                <p className="text-sm text-gray-400 mt-2">
                                                                    Note: {reservation.note}
                                                                </p>
                                                            )}
                                                            {reservation.staff_whatsapp && reservation.status === 'confirmed' && (
                                                                <Button 
                                                                    variant="outline" 
                                                                    className="mt-3 border-gray-700 text-white hover:bg-gray-800 rounded-none flex items-center gap-2"
                                                                    onClick={() => window.open(`https://wa.me/${reservation.staff_whatsapp}`, '_blank')}
                                                                >
                                                                    <Phone className="h-4 w-4" />
                                                                    Contact Staff
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))
                                                }

                                                {/* Orders/Menu Items */}
                                                {(activityFilter === 'all' || activityFilter === 'orders') && 
                                                    auth.user.carts?.filter(cart => !cart.payment_id).map((cart: any) => (
                                                        <div key={cart.id} className="bg-[#121212] p-4 border border-gray-800">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <p className="font-medium">Order #{cart.id}</p>
                                                                    <p className="text-sm text-gray-400">
                                                                        {new Date(cart.created_at).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                                <div className="text-sm text-gray-400">
                                                                    Total: Rp {(cart.quantity * (cart.price || 0)).toLocaleString('id-ID')}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 space-y-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex-1">
                                                                        <p className="text-gray-300">
                                                                            {cart.menu?.name || 'Menu item not available'}
                                                                        </p>
                                                                        {cart.menu?.desc && (
                                                                            <p className="text-sm text-gray-500">{cart.menu.desc}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right ml-4">
                                                                        <p className="text-gray-400">
                                                                            {cart.quantity} x Rp {(cart.price || 0).toLocaleString('id-ID')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }

                                                {/* Payments */}
                                                {(activityFilter === 'all' || activityFilter === 'payments') && 
                                                    auth.user.payments?.map((payment: any) => (
                                                        <div key={payment.id} className="bg-[#121212] p-4 border border-gray-800">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {payment.order_number}
                                                                        <span className="text-gray-500 text-sm ml-2">
                                                                            (Payment #{payment.id})
                                                                        </span>
                                                                    </p>
                                                                    <p className="text-sm text-gray-400">
                                                                        {new Date(payment.created_at).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </p>
                                                                </div>
                                                                <div className={`px-3 py-1 rounded-full text-sm ${
                                                                    payment.status === 'completed' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                                                                    payment.status === 'failed' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                                                                    'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                                                                }`}>
                                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-300">Amount</span>
                                                                    <span className="text-gray-400">
                                                                        {payment.total_amount 
                                                                            ? `Rp ${Number(payment.total_amount).toLocaleString('id-ID')}`
                                                                            : 'Rp 0'
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-300">Payment Method</span>
                                                                    <span className="text-gray-400">
                                                                        {payment.payment_method}
                                                                    </span>
                                                                </div>
                                                                {payment.description && (
                                                                    <div className="text-sm text-gray-400 mt-2">
                                                                        Note: {payment.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-[#121212] border border-gray-800">
                                                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-white mb-2">No activity yet</h3>
                                                <p className="text-gray-400 max-w-md mx-auto">
                                                    {activityFilter === 'orders' 
                                                        ? "You haven't placed any orders yet."
                                                        : activityFilter === 'reservations'
                                                        ? "You haven't made any reservations yet."
                                                        : activityFilter === 'payments'
                                                        ? "You haven't made any payments yet."
                                                        : "When you make orders, reservations, or payments, they will appear here."
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Status Message */}
                            {status && (
                                <div className="mt-6 bg-green-900/20 border border-green-800 p-4">
                                    <p className="text-sm text-green-400">{status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </>
    );
}