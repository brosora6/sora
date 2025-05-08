import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, AlertCircle, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    gambar: string;
    stok: number;
}

interface CartItem {
    id: number;
    menu: MenuItem;
    quantity: number;
    price: number;
}

interface CartProps {
    auth: {
        user: any;
    };
    carts: CartItem[];
}

export default function Cart({ auth, carts: initialCarts = [] }: CartProps) {
    const [carts, setCarts] = useState<CartItem[]>(initialCarts);
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchCarts = async () => {
        try {
            const response = await api.get('/carts');
            setCarts(response.data);
        } catch (error) {
            console.error('Error fetching carts:', error);
            toast.error('Failed to load cart items');
        }
    };

    const handleRemoveFromCart = async (cartId: number) => {
        try {
            setLoading(prev => ({ ...prev, [cartId]: true }));
            await api.delete(`/carts/${cartId}`);
            await fetchCarts(); // Refresh cart data
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
        try {
            setLoading(prev => ({ ...prev, [cartId]: true }));
            await api.post(`/carts/${cartId}`, {
                quantity: newQuantity
            });
            await fetchCarts(); // Refresh cart data
            toast.success('Cart updated successfully');
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Failed to update cart');
        } finally {
            setLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    const totalPrice = carts.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalItems = carts.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        setIsProcessing(true);
        setTimeout(() => {
            window.location.href = '/payment';
        }, 500);
    };

    return (
        <>
            <Head title="Cart | Solace Motorcycle" />
            <Navbar auth={auth} />

            <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Your Cart</h1>
                        <span className="text-gray-400 bg-gray-800/50 px-4 py-1 rounded-full text-sm">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {!carts || carts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#1a1a1a] border border-gray-800 rounded-lg p-8">
                            <ShoppingCart className="h-16 w-16 text-gray-600 mb-4" />
                            <h2 className="text-xl font-medium text-white mb-2">Your cart is empty</h2>
                            <p className="text-gray-400 text-center max-w-md mb-8">
                                Looks like you haven't added any items to your cart yet.
                            </p>
                            <Button 
                                asChild
                                className="bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-12 px-8"
                            >
                                <Link href="/menu">Browse Menu</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {carts.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 flex flex-col sm:flex-row gap-6 relative hover:border-gray-700 transition-colors"
                                    >
                                        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                                            <img
                                                src={`/storage/${item.menu?.gambar}`}
                                                alt={item.menu?.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/default-menu.jpg';
                                                }}
                                            />
                                        </div>
                                        
                                        <div className="flex-grow space-y-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold">{item.menu?.name}</h3>
                                                <p className="text-xl font-bold text-amber-500">
                                                    Rp {item.price?.toLocaleString() || '0'}
                                                </p>
                                            </div>
                                            
                                            <p className="text-gray-400">
                                                Rp {item.menu?.price?.toLocaleString() || '0'} per item
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center bg-gray-800/50 rounded-lg">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-l-lg text-white hover:bg-gray-700/50"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={loading[item.id] || item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-r-lg text-white hover:bg-gray-700/50"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={loading[item.id] || item.quantity >= item.menu.stok}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    disabled={loading[item.id]}
                                                >
                                                    {loading[item.id] ? (
                                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    <span className="ml-2">Remove</span>
                                                </Button>
                                            </div>
                                            
                                            {item.menu.stok <= 3 && (
                                                <p className="text-sm text-amber-500 flex items-center bg-amber-500/10 w-fit px-3 py-1 rounded-full">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    Only {item.menu.stok} left in stock
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="lg:col-span-1">
                                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 sticky top-24">
                                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span>Rp {totalPrice?.toLocaleString() || '0'}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Tax</span>
                                            <span>Included</span>
                                        </div>
                                        
                                        <Separator className="bg-gray-800 my-4" />
                                        
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-amber-500">Rp {totalPrice?.toLocaleString() || '0'}</span>
                                        </div>
                                        
                                        <Button 
                                            className="w-full mt-6 bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-12"
                                            onClick={handleCheckout}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center justify-center">
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    Proceed to Checkout
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </span>
                                            )}
                                        </Button>
                                        
                                        <p className="text-xs text-gray-500 text-center mt-4">
                                            By proceeding, you agree to our terms and conditions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </>
    );
}
