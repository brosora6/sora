import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Reservation } from '@/types';
import axios from 'axios';

export default function Reservations({ auth }: PageProps) {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const handleStatusUpdate = async (id: number, status: Reservation['status']) => {
        try {
            await axios.put(`/api/reservations/${id}`, { status });
            setReservations((prevList: Reservation[]) => 
                prevList.map((item: Reservation) => 
                    item.id === id ? { ...item, status } : item
                )
            );
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Reservations" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-4">Reservation Management</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2">Customer Name</th>
                                            <th className="px-4 py-2">Reservation Date</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">WhatsApp</th>
                                            <th className="px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map((reservation: Reservation) => (
                                            <tr key={reservation.id} className="border-b">
                                                <td className="px-4 py-2">{reservation.pelanggan.name}</td>
                                                <td className="px-4 py-2">{reservation.reservation_date}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                                        reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        reservation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {reservation.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{reservation.pelanggan.no_telepon}</td>
                                                <td className="px-4 py-2">
                                                    {reservation.status === 'pending' && (
                                                        <div className="space-x-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(reservation.id, 'rejected')}
                                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 