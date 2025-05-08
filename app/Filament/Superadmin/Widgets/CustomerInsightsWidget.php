<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Pelanggan;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class CustomerInsightsWidget extends BaseWidget
{
    protected ?string $heading = 'Informasi Pelanggan';
    protected static ?int $sort = 6;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        // Total customers
        $totalCustomers = Pelanggan::count();

        // New customers this month
        $newCustomers = Pelanggan::whereMonth('created_at', now()->month)->count();

        // Most loyal customer (most orders)
        $loyalCustomer = Pelanggan::select('pelanggans.*', DB::raw('COUNT(reservations.id) as order_count'))
            ->leftJoin('reservations', 'pelanggans.id', '=', 'reservations.pelanggan_id')
            ->groupBy('pelanggans.id', 'pelanggans.name')
            ->orderByDesc('order_count')
            ->first();

        // Average order value
        $avgOrderValue = DB::table('payments')
            ->where('status', 'completed')
            ->avg('total_amount');

        return [
            Stat::make('Total Pelanggan', number_format($totalCustomers))
                ->description('Jumlah seluruh pelanggan')
                ->descriptionIcon('heroicon-m-users')
                ->chart([4, 7, 8, 6, 9, 3, 4])
                ->color('success'),

            Stat::make('Pelanggan Baru', $newCustomers)
                ->description('Bulan ini')
                ->descriptionIcon('heroicon-m-user-plus')
                ->chart([2, 4, 6, 8, 5, 3, 7])
                ->color('info'),

            Stat::make(
                'Pelanggan Terloyal',
                $loyalCustomer ? $loyalCustomer->name : 'N/A'
            )
                ->description(
                    $loyalCustomer
                        ? $loyalCustomer->order_count . ' pesanan'
                        : 'Belum ada data'
                )
                ->descriptionIcon('heroicon-m-heart')
                ->color('warning'),

            Stat::make(
                'Rata-rata Nilai Pesanan',
                'Rp ' . number_format($avgOrderValue ?? 0, 0, ',', '.')
            )
                ->description('Per transaksi')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart([5, 7, 3, 8, 6, 4, 9])
                ->color('success'),
        ];
    }
} 