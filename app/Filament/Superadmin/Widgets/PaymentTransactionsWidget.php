<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Payment;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class PaymentTransactionsWidget extends BaseWidget
{
    protected ?string $heading = 'Transaksi Pembayaran';
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $todayRevenue = Payment::whereDate('created_at', today())
            ->where('status', 'completed')
            ->sum('total_amount');

        $monthlyRevenue = Payment::whereMonth('created_at', now()->month)
            ->where('status', 'completed')
            ->sum('total_amount');

        $pendingPayments = Payment::where('status', 'pending')->count();

        return [
            Stat::make('Pendapatan Hari Ini', 'Rp ' . number_format($todayRevenue, 0, ',', '.'))
                ->description('Total transaksi hari ini')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart([3, 7, 6, 9, 4, 5, 8])
                ->color('success'),

            Stat::make('Pendapatan Bulan Ini', 'Rp ' . number_format($monthlyRevenue, 0, ',', '.'))
                ->description('Total transaksi bulan ini')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->chart([8, 5, 7, 6, 9, 3, 5])
                ->color('primary'),

            Stat::make(
                'Pembayaran Pending',
                number_format($pendingPayments)
            )
                ->description('Menunggu konfirmasi')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
} 