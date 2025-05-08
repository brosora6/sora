<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class ProductRevenueDonutChart extends ChartWidget
{
    protected static ?string $heading = 'Distribusi Pendapatan Menu';
    
    protected int | string | array $columnSpan = 6;

    protected static ?int $sort = 4;

    protected function getData(): array
    {
        $data = Payment::query()
            ->join('carts', 'payments.id', '=', 'carts.payment_id')
            ->join('menus', 'carts.menu_id', '=', 'menus.id')
            ->where('payments.status', '=', 'completed')
            ->select(
                'menus.name as menu',
                DB::raw('SUM(carts.quantity * menus.price) as revenue'),
                DB::raw('(SUM(carts.quantity * menus.price) / (SELECT SUM(c2.quantity * m2.price) FROM payments p2 JOIN carts c2 ON p2.id = c2.payment_id JOIN menus m2 ON c2.menu_id = m2.id WHERE p2.status = \'completed\')) * 100 as percentage')
            )
            ->groupBy('menus.id', 'menus.name')
            ->orderBy('revenue', 'desc')
            ->limit(10)  // Top 10 menus
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue Distribution',
                    'data' => $data->pluck('revenue')->toArray(),
                    'backgroundColor' => [
                        '#4CAF50', '#2196F3', '#FFC107', '#E91E63', 
                        '#9C27B0', '#00BCD4', '#FF5722', '#795548',
                        '#607D8B', '#F44336'
                    ],
                ],
            ],
            'labels' => $data->pluck('menu')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'right',
                ],
                'tooltip' => [
                    'callbacks' => [
                        'label' => 'function(context) { 
                            var value = context.parsed;
                            var total = context.dataset.data.reduce((a, b) => a + b, 0);
                            var percentage = Math.round((value / total) * 100);
                            return `Rp ${value.toLocaleString()} (${percentage}%)`;
                        }',
                    ],
                ],
            ],
            'cutout' => '70%',
        ];
    }
} 