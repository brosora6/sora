import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';

interface FailureProps {
    auth: {
        user: any;
    };
    error?: string;
}

export default function Failure({ auth, error }: FailureProps) {
    return (
        <>
            <Head title="Payment Failed" />
            <Navbar auth={auth} />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-lg mx-auto text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
                    <p className="text-gray-600 mb-8">
                        {error || 'We were unable to process your payment. Please try again or contact support if the problem persists.'}
                    </p>
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/payment">Try Again</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/menu">Return to Menu</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
} 