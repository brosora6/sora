<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class CategoryRevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Pendapatan per Kategori';
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        $data = Payment::query()
            ->join('carts', 'payments.id', '=', 'carts.payment_id')
            ->join('menus', 'carts.menu_id', '=', 'menus.id')
            ->join('categories', 'menus.category_id', '=', 'categories.id')
            ->where('payments.status', '=', 'completed')
            ->select(
                'categories.name as category',
                DB::raw('SUM(carts.quantity * menus.price) as revenue')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('revenue', 'desc')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue',
                    'data' => $data->pluck('revenue')->toArray(),
                    'backgroundColor' => [
                        '#4CAF50', '#2196F3', '#FFC107', '#E91E63', 
                        '#9C27B0', '#00BCD4', '#FF5722', '#795548'
                    ],
                ],
            ],
            'labels' => $data->pluck('category')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'callback' => 'function(value) { return "Rp " + value.toLocaleString(); }',
                    ],
                ],
            ],
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'tooltip' => [
                    'callbacks' => [
                        'label' => 'function(context) { return "Rp " + context.parsed.y.toLocaleString(); }',
                    ],
                ],
            ],
        ];
    }
} 