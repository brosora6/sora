export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Reservation {
    id: number;
    pelanggan_id: number;
    pelanggan: {
        name: string;
        no_telepon: string;
    };
    reservation_date: string;
    status: 'pending' | 'confirmed' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface PageProps {
    auth: {
        user: User;
    };
} 