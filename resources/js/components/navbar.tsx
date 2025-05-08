import { Link, router } from '@inertiajs/react';
import { LogOut, Menu, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            profile_photo?: string;
        };
    };
}

export default function Navbar({ auth }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Handle scroll event to change navbar background
    useEffect(() => {
        const handleScroll = () => {
            // Assuming hero section is approximately 100vh
            const scrollThreshold = window.innerHeight * 0.1; // 10% of viewport height
            setIsScrolled(window.scrollY > scrollThreshold);
        };
        
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Initial check in case page is loaded scrolled down
        handleScroll();
        
        // Clean up event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const handleLogout = () => {
        router.post(route('customer.logout'));
    };

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-[#121212] border-b border-gray-800 shadow-md' 
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href={route('home')} className="flex items-center">
                            {/* <img 
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-iDUuZx8q74HbuOfQjIPSDQbSD16WAg.png"
                                alt="Solace Motorcycle Logo"
                                className="h-8 w-8 mr-2"
                            /> */}
                            <span className="text-xl font-bold text-white">SORA</span>
                        </Link>
                    </div>

                    <NavigationMenu className="hidden md:block">
                        <NavigationMenuList className="space-x-8 flex">
                            <NavigationMenuItem>
                                <Link 
                                    href={route('home')} 
                                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                                >
                                    HOME
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link 
                                    href={route('menu')}
                                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                                >
                                    MENU
                                </Link>
                            </NavigationMenuItem>
                            {auth.user && (
                                <NavigationMenuItem>
                                    <Link 
                                        href={route('reservations.create')}
                                        className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                                    >
                                        RESERVATION
                                    </Link>
                                </NavigationMenuItem>
                            )}
                            <NavigationMenuItem>
                                <Link 
                                    href={route('about')}
                                    className="text-sm font-medium text-white hover:text-gray-200 transition-colors"
                                >
                                    ABOUT
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <>
                                <Link 
                                    href={route('cart')} 
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="focus:outline-none">
                                            {auth.user.profile_photo ? (
                                                <img
                                                    src={`/storage/${auth.user.profile_photo}`}
                                                    alt={auth.user.name}
                                                    className="h-8 w-8 rounded-full object-cover border-2 border-white"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {auth.user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-[#121212] border-gray-800">
                                        <DropdownMenuItem asChild>
                                            <Link 
                                                href={route('profile.edit')}
                                                className="text-white hover:bg-gray-800 cursor-pointer"
                                            >
                                                Profile Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={handleLogout}
                                            className="text-white hover:bg-gray-800 cursor-pointer"
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link href={route('customer.login')}>
                                    <Button 
                                        variant="ghost" 
                                        className="text-white hover:text-gray-200 hover:bg-white/10 rounded-none"
                                    >
                                        LOG IN
                                    </Button>
                                </Link>
                                <Link href={route('customer.register')}>
                                    <Button 
                                        className="bg-white text-black hover:bg-gray-200 rounded-none"
                                    >
                                        SIGN UP
                                    </Button>
                                </Link>
                            </div>
                        )}
                        
                        {/* Mobile menu button */}
                        <button 
                            className="md:hidden text-white hover:text-gray-200"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#121212] border-t border-gray-800 shadow-lg">
                    <div className="px-4 py-3 space-y-1">
                        <Link 
                            href={route('home')} 
                            className="block py-2 text-base font-medium text-white hover:text-gray-200"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            HOME
                        </Link>
                        <Link 
                            href={route('menu')} 
                            className="block py-2 text-base font-medium text-white hover:text-gray-200"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            MENU
                        </Link>
                        {auth.user && (
                            <Link 
                                href={route('reservations.create')} 
                                className="block py-2 text-base font-medium text-white hover:text-gray-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                RESERVATION
                            </Link>
                        )}
                        <Link 
                            href={route('about')}
                            className="block py-2 text-base font-medium text-white hover:text-gray-200"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            ABOUT
                        </Link>
                        
                        {!auth.user && (
                            <div className="pt-4 pb-2 border-t border-gray-800">
                                <Link 
                                    href={route('customer.login')}
                                    className="block py-2 text-base font-medium text-white hover:text-gray-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    LOG IN
                                </Link>
                                <Link 
                                    href={route('customer.register')}
                                    className="block py-2 text-base font-medium text-white hover:text-gray-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    SIGN UP
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}