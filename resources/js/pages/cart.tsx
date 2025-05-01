import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

    const handleRemoveFromCart = async (cartId: number) => {
        try {
            setLoading(prev => ({ ...prev, [cartId]: true }));
            await axios.delete(`/api/carts/${cartId}`);
            
            // Update local state instead of reloading
            setCarts(currentCarts => currentCarts.filter(cart => cart.id !== cartId));
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            toast.error('Failed to remove item from cart');
        } finally {
            setLoading(prev => ({ ...prev, [cartId]: false }));
        }
    };

    const handleUpdateQuantity = async (cartId: number, newQuantity: number, menuStok: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > menuStok) {
            toast.error('Not enough stock available');
            return;
        }

        setLoading(prev => ({ ...prev, [cartId]: true }));

        try {
            const response = await axios.post(`/api/carts/${cartId}`, {
                quantity: newQuantity,
            });

            // Update local state
            setCarts(currentCarts =>
                currentCarts.map(cart =>
                    cart.id === cartId
                        ? {
                              ...cart,
                              quantity: newQuantity,
                              price: cart.menu.price * newQuantity,
                          }
                        : cart
                )
            );

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
                        <span className="text-gray-400">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                    </div>

                    {!carts || carts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#1a1a1a] border border-gray-800 p-8">
                            <ShoppingCart className="h-16 w-16 text-gray-600 mb-4" />
                            <h2 className="text-xl font-medium text-white mb-2">Your cart is empty</h2>
                            <p className="text-gray-400 text-center max-w-md mb-8">
                                Looks like you haven't added any items to your cart yet.
                            </p>
                            <Button 
                                asChild
                                className="bg-white text-black hover:bg-gray-200 rounded-none h-12 px-8"
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
                                        className="bg-[#1a1a1a] border border-gray-800 p-6 flex flex-col sm:flex-row gap-6 relative"
                                    >
                                        <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden bg-gray-900">
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
                                        
                                        <div className="flex-grow space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold">{item.menu?.name}</h3>
                                                <p className="text-xl font-bold">
                                                    Rp {item.price?.toLocaleString() || '0'}
                                                </p>
                                            </div>
                                            
                                            <p className="text-gray-400">
                                                Rp {item.menu?.price?.toLocaleString() || '0'} per item
                                            </p>
                                            
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none border-gray-700 text-white"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.menu.stok)}
                                                        disabled={loading[item.id] || item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-12 text-center">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none border-gray-700 text-white"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.menu.stok)}
                                                        disabled={loading[item.id] || item.quantity >= item.menu.stok}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-400 hover:text-red-500 hover:bg-transparent"
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
                                                <p className="text-sm text-amber-500 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    Only {item.menu.stok} left in stock
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="lg:col-span-1">
                                <div className="bg-[#1a1a1a] border border-gray-800 p-6 sticky top-24">
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
                                            <span>Rp {totalPrice?.toLocaleString() || '0'}</span>
                                        </div>
                                        
                                        <Button 
                                            className="w-full mt-6 bg-white text-black hover:bg-gray-200 rounded-none h-12"
                                            onClick={handleCheckout}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <span className="flex items-center">
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
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
