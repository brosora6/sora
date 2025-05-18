import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Trash2, ArrowRight, AlertCircle, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from "@/contexts/TranslationContext"
import { motion, AnimatePresence } from 'framer-motion';

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
    const { t } = useTranslation()
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
        router.visit('/payment', {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsProcessing(false)
        });
    };

    return (
        <>
            <Head title={t("cart.title")} />
            <Navbar auth={auth} />

            <motion.main 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#121212] text-white min-h-screen pt-24 pb-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <h1 className="text-3xl font-bold">{t("cart.title")}</h1>
                        <motion.span 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-gray-400 bg-gray-800/50 px-4 py-1 rounded-full text-sm"
                        >
                            {totalItems} {totalItems === 1 ? t("cart.items_count") : t("cart.items_count_plural")}
                        </motion.span>
                    </motion.div>

                    {!carts || carts.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center min-h-[300px] bg-[#1a1a1a] border border-gray-800 rounded-lg p-8"
                        >
                            <motion.div
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <ShoppingCart className="h-16 w-16 text-gray-600 mb-4" />
                            </motion.div>
                            <h2 className="text-xl font-medium text-white mb-2">{t("cart.empty.title")}</h2>
                            <p className="text-gray-400 text-center max-w-md mb-8">
                                {t("cart.empty.description")}
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    asChild
                                    className="bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-12 px-8"
                                >
                                    <Link href="/menu">{t("cart.empty.browse_menu")}</Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <AnimatePresence>
                                    {carts.map((item, index) => (
                                        <motion.div 
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 flex flex-col sm:flex-row gap-6 relative hover:border-gray-700 transition-colors"
                                        >
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900"
                                            >
                                                <img
                                                    src={`/storage/${item.menu?.gambar}`}
                                                    alt={item.menu?.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/images/default-menu.jpg';
                                                    }}
                                                />
                                            </motion.div>
                                            
                                            <motion.div 
                                                whileHover={{ scale: 1.02 }}
                                                className="flex-grow space-y-4"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-xl font-bold">{item.menu?.name}</h3>
                                                    <p className="text-xl font-bold text-amber-500">
                                                        Rp {item.price?.toLocaleString() || '0'}
                                                    </p>
                                                </div>
                                                
                                                <p className="text-gray-400">
                                                    {t("cart.item.per_item", { price: item.menu?.price?.toLocaleString() || '0' })}
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
                                                        <span className="ml-2">{t("cart.item.remove")}</span>
                                                    </Button>
                                                </div>
                                                
                                                {item.menu.stok <= 3 && (
                                                    <p className="text-sm text-amber-500 flex items-center bg-amber-500/10 w-fit px-3 py-1 rounded-full">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {t("cart.item.low_stock", { count: item.menu.stok })}
                                                    </p>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="lg:col-span-1"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 sticky top-24"
                                >
                                    <h2 className="text-xl font-bold mb-6">{t("cart.summary.title")}</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{t("cart.summary.subtotal")}</span>
                                            <span>Rp {totalPrice?.toLocaleString() || '0'}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">{t("cart.summary.tax")}</span>
                                            <span>{t("cart.summary.tax_included")}</span>
                                        </div>
                                        
                                        <Separator className="bg-gray-800 my-4" />
                                        
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>{t("cart.summary.total")}</span>
                                            <span className="text-amber-500">Rp {totalPrice?.toLocaleString() || '0'}</span>
                                        </div>
                                        
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button 
                                                className="w-full mt-6 bg-amber-500 text-black hover:bg-amber-400 rounded-lg h-12"
                                                onClick={handleCheckout}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <span className="flex items-center justify-center">
                                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                        {t("cart.checkout.processing")}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center">
                                                        {t("cart.checkout.button")}
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </span>
                                                )}
                                            </Button>
                                        </motion.div>
                                        
                                        <p className="text-xs text-gray-500 text-center mt-4">
                                            {t("cart.checkout.terms")}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </motion.main>
            
            <Footer />
        </>
    );
}
