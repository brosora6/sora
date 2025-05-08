<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Reservation;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OrderSummaryWidget extends BaseWidget
{
    protected ?string $heading = 'Ringkasan Reservasi';
    
    protected static ?int $sort = 1;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $todayCount = Reservation::whereDate('created_at', today())->count();
        $pendingCount = Reservation::where('status', Reservation::STATUS_PENDING)->count();
        $confirmedCount = Reservation::where('status', Reservation::STATUS_CONFIRMED)->count();

        return [
            Stat::make('Reservasi Hari Ini', $todayCount)
                ->description('Reservasi dalam 24 jam terakhir')
                ->descriptionIcon('heroicon-m-calendar')
                ->chart([7, 3, 4, 5, 6, 3, 5])
                ->color('success'),
                
            Stat::make('Reservasi Pending', $pendingCount)
                ->description('Menunggu konfirmasi')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
                
            Stat::make('Reservasi Dikonfirmasi', $confirmedCount)
                ->description('Berhasil dikonfirmasi')
                ->descriptionIcon('heroicon-m-check-circle')
                ->chart([3, 5, 7, 4, 8, 6, 9])
                ->color('success'),
        ];
    }
} 