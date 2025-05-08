<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Cart;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class CartAnalyticsWidget extends ChartWidget
{
    protected static ?string $heading = 'Analisis Keranjang';
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        $cartData = Cart::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as cart_count'),
            DB::raw('COUNT(CASE WHEN payment_id IS NOT NULL THEN 1 END) as completed_count'),
            DB::raw('COUNT(CASE WHEN payment_id IS NULL THEN 1 END) as pending_count')
        )
            ->groupBy('date')
            ->orderBy('date', 'DESC')
            ->limit(7)
            ->get()
            ->reverse();

        return [
            'datasets' => [
                [
                    'label' => 'Total Cart',
                    'data' => $cartData->pluck('cart_count')->toArray(),
                    'borderColor' => '#36A2EB',
                    'fill' => false,
                ],
                [
                    'label' => 'Selesai',
                    'data' => $cartData->pluck('completed_count')->toArray(),
                    'borderColor' => '#4BC0C0',
                    'fill' => false,
                ],
                [
                    'label' => 'Pending',
                    'data' => $cartData->pluck('pending_count')->toArray(),
                    'borderColor' => '#FF6384',
                    'fill' => false,
                ],
            ],
            'labels' => $cartData->pluck('date')->map(function ($date) {
                return date('d M', strtotime($date));
            })->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Jumlah Cart',
                    ],
                ],
            ],
        ];
    }
} 