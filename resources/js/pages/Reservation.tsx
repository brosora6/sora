import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PhoneIcon } from 'lucide-react';

interface OpeningHours {
    [key: string]: string[];
}

interface ReservationProps {
    auth: {
        user: any;
    };
    reservation?: {
        id: number;
        status: 'pending' | 'confirmed' | 'rejected';
        staff_whatsapp: string | null;
    };
    openingHours?: OpeningHours;
}

type ReservationForm = {
    tanggal: string;
    waktu: string;
    jumlah_orang: number;
    note: string;
};

export default function Reservation({ auth, reservation, openingHours = {} }: ReservationProps) {
    const [selectedDay, setSelectedDay] = useState<string>('');
    const { data, setData, post, processing, errors } = useForm<ReservationForm>({
        tanggal: '',
        waktu: '',
        jumlah_orang: 1,
        note: '',
    });

    useEffect(() => {
        if (data.tanggal) {
            const date = new Date(data.tanggal);
            setSelectedDay(date.toLocaleDateString('en-US', { weekday: 'long' }));
        }
    }, [data.tanggal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'));
    };

    if (!auth.user) {
        window.location.href = route('login');
        return null;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        }
    };

    const defaultOpeningHours: OpeningHours = {
        'Monday': ['08:00', '22:00'],
        'Tuesday': ['08:00', '22:00'],
        'Wednesday': ['08:00', '22:00'],
        'Thursday': ['08:00', '22:00'],
        'Friday': ['07:00', '22:00'],
        'Saturday': ['08:00', '22:00'],
        'Sunday': ['08:00', '22:00'],
    };

    const actualOpeningHours = Object.keys(openingHours).length > 0 ? openingHours : defaultOpeningHours;

    const getCurrentDayHours = () => {
        if (!selectedDay || !actualOpeningHours[selectedDay]) return null;
        return actualOpeningHours[selectedDay];
    };

    const hours = getCurrentDayHours();

    return (
        <>
            <Head title="Reservation" />
            <Navbar auth={auth} />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mx-auto max-w-2xl">
                    <h1 className="text-3xl font-bold text-center mb-8">Make a Reservation</h1>

                    <div className="mb-8 p-4 bg-white rounded-lg border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                            <Clock className="w-5 h-5 mr-2" />
                            Opening Hours
                        </h2>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(actualOpeningHours).map(([day, hours]) => (
                                <div key={day} className="flex justify-between text-gray-600">
                                    <span className="font-medium text-gray-900">{day}</span>
                                    <span>{hours[0]} - {hours[1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {reservation && (
                        <Alert className={`mb-6 ${getStatusColor(reservation.status)}`}>
                            <AlertTitle>Reservation {reservation.status}</AlertTitle>
                            <AlertDescription>
                                {reservation.status === 'confirmed' && reservation.staff_whatsapp && (
                                    <div className="mt-2">
                                        <p>Contact our staff for any questions:</p>
                                        <Button
                                            variant="outline"
                                            className="mt-2"
                                            onClick={() => window.open(`https://wa.me/${reservation.staff_whatsapp}`, '_blank')}
                                        >
                                            <PhoneIcon className="w-4 h-4 mr-2" />
                                            WhatsApp Staff
                                        </Button>
                                    </div>
                                )}
                                {reservation.status === 'pending' && (
                                    <p>Your reservation is being processed. We will contact you soon.</p>
                                )}
                                {reservation.status === 'rejected' && (
                                    <p>Sorry, your reservation could not be accommodated at this time.</p>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {(!reservation || reservation.status === 'rejected') && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="tanggal">Date</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={e => setData('tanggal', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                <InputError message={errors.tanggal} />
                            </div>

                            <div>
                                <Label htmlFor="waktu">Time</Label>
                                <Input
                                    id="waktu"
                                    type="time"
                                    value={data.waktu}
                                    onChange={e => setData('waktu', e.target.value)}
                                    min={hours ? hours[0] : undefined}
                                    max={hours ? hours[1] : undefined}
                                    required
                                />
                                {hours && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Opening hours for {selectedDay}: {hours[0]} - {hours[1]}
                                    </p>
                                )}
                                <InputError message={errors.waktu} />
                            </div>

                            <div>
                                <Label htmlFor="jumlah_orang">Number of People</Label>
                                <Input
                                    id="jumlah_orang"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={data.jumlah_orang}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setData('jumlah_orang', isNaN(value) ? 1 : value);
                                    }}
                                    required
                                />
                                <InputError message={errors.jumlah_orang} />
                            </div>

                            <div>
                                <Label htmlFor="note">Special Requests</Label>
                                <Input
                                    id="note"
                                    value={data.note}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('note', e.target.value)}
                                    placeholder="Any special requests or notes?"
                                />
                                <InputError message={errors.note} />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Make Reservation
                            </Button>
                        </form>
                    )}
                </div>
            </main>
        </>
    );
} 