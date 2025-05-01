import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, ShoppingCart, Plus, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
axios.defaults.headers.common['Accept'] = 'application/json';

interface MenuProps {
    auth: {
        user: any;
    };
}

interface MenuItem {
    id: number;
    name: string;
    price: number;
    desc: string;
    gambar: string;
    stok: number;
    status: string;
}

export default function Menu({ auth }: MenuProps) {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [filteredMenus, setFilteredMenus] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/api/menus');
                setMenus(response.data);
                setFilteredMenus(response.data);
            } catch (error) {
                console.error('Error fetching menus:', error);
                setError('Failed to load menu items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMenus(menus);
        } else {
            const filtered = menus.filter(menu => 
                menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                menu.desc.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMenus(filtered);
        }
    }, [searchQuery, menus]);

    const handleAddToCart = async (menuId: number) => {
        if (!auth.user) {
            toast.error('Please log in to add items to cart');
            window.location.href = route('customer.login');
            return;
        }

        try {
            setAddingToCart(menuId);
            const response = await axios.post('/api/carts', {
                menu_id: menuId,
                quantity: 1,
            });
            
            // Update menu stock locally
            setMenus(menus.map(menu => {
                if (menu.id === menuId) {
                    return { ...menu, stok: menu.stok - 1 };
                }
                return menu;
            }));

            toast.success('Item added to cart successfully');
        } catch (error: any) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                user: auth.user
            });
            
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                window.location.href = route('customer.login');
            } else if (error.response?.status === 422) {
                toast.error(error.response.data.message || 'Validation error');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add item to cart');
            }
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <>
            <Head title="Menu | Solace Motorcycle" />
            <Navbar auth={auth} />

            <main className="bg-[#121212] text-white min-h-screen pt-24 pb-16">
                {/* Hero Section */}
                <div className="relative h-64 md:h-80 overflow-hidden mb-12">
                    <div className="absolute inset-0 bg-black">
                        <div className="absolute inset-0 opacity-40 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/horde1.jpg-M9FqtdHbTEKOupNuwHndNNdbeNZr2A.jpeg')] bg-cover bg-center"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Our Menu</h1>
                        <p className="text-lg text-gray-200 max-w-2xl text-center">
                            Fuel your ride with our selection of premium food and beverages
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search and Filter */}
                    <div className="mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#1a1a1a] border-gray-800 text-white h-12 rounded-none focus:border-white focus:ring-0"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px]">
                            <LoaderCircle className="h-12 w-12 animate-spin text-white mb-4" />
                            <p className="text-gray-400">Loading menu items...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#1a1a1a] border border-gray-800 p-8">
                            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                            <p className="text-xl font-medium text-white mb-2">Unable to load menu</p>
                            <p className="text-gray-400 text-center">{error}</p>
                            <Button 
                                onClick={() => window.location.reload()} 
                                variant="outline" 
                                className="mt-6 border-gray-700 text-white hover:bg-gray-800"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : filteredMenus.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#1a1a1a] border border-gray-800 p-8">
                            <ShoppingCart className="h-12 w-12 text-gray-600 mb-4" />
                            <p className="text-xl font-medium text-white mb-2">No menu items found</p>
                            <p className="text-gray-400 text-center">
                                {searchQuery ? 'Try a different search term' : 'Check back later for our updated menu'}
                            </p>
                            {searchQuery && (
                                <Button 
                                    onClick={() => setSearchQuery('')} 
                                    variant="outline" 
                                    className="mt-6 border-gray-700 text-white hover:bg-gray-800"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMenus.map((menu) => (
                                <Card key={menu.id} className="bg-[#1a1a1a] border-gray-800 overflow-hidden rounded-none hover:border-gray-600 transition-colors duration-300">
                                    <div className="aspect-[4/3] overflow-hidden relative group">
                                        <img
                                            src={`/storage/${menu.gambar}`}
                                            alt={menu.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/default-menu.jpg';
                                            }}
                                        />
                                        {menu.stok <= 3 && menu.stok > 0 && (
                                            <Badge className="absolute top-4 right-4 bg-amber-600 hover:bg-amber-700 text-white">
                                                Low Stock: {menu.stok} left
                                            </Badge>
                                        )}
                                        {menu.stok === 0 && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <Badge className="bg-red-900 hover:bg-red-900 text-white text-lg py-1 px-3">
                                                    Out of Stock
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{menu.name}</h3>
                                        <p className="text-gray-400 mb-4 line-clamp-2 h-12">{menu.desc}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-2xl font-bold text-white">
                                                Rp {menu.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                    
                                    <CardFooter className="p-6 pt-0">
                                        {auth.user ? (
                                            menu.stok > 0 ? (
                                                <Button 
                                                    className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12"
                                                    onClick={() => handleAddToCart(menu.id)}
                                                    disabled={addingToCart === menu.id}
                                                >
                                                    {addingToCart === menu.id ? (
                                                        <span className="flex items-center">
                                                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                            Adding...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add to Cart
                                                        </span>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button 
                                                    className="w-full bg-gray-800 text-gray-400 hover:bg-gray-800 rounded-none h-12 cursor-not-allowed"
                                                    disabled
                                                >
                                                    Out of Stock
                                                </Button>
                                            )
                                        ) : (
                                            <Button 
                                                className="w-full bg-white text-black hover:bg-gray-200 rounded-none h-12"
                                                onClick={() => window.location.href = route('customer.login')}
                                            >
                                                Login to Order
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}