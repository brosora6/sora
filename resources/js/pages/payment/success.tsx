import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';

interface SuccessProps {
    auth: {
        user: any;
    };
}

export default function Success({ auth }: SuccessProps) {
    return (
        <>
            <Head title="Payment Successful" />
            <Navbar auth={auth} />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-lg mx-auto text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for your payment. Your order has been received and is being processed.
                        You can track your order status in your order history in your profile.
                    </p>
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/settings/profile">View Orders</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/menu">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
} 