<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Menu;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class MenuPerformanceWidget extends ChartWidget
{
    protected static ?string $heading = 'Performa Menu';
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        $topMenus = Menu::select('menus.name', DB::raw('COUNT(*) as order_count'), DB::raw('SUM(carts.quantity) as total_quantity'))
            ->join('carts', 'menus.id', '=', 'carts.menu_id')
            ->whereNotNull('carts.payment_id') // Only count items that have been paid
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Total Dipesan',
                    'data' => $topMenus->pluck('total_quantity')->toArray(),
                    'backgroundColor' => ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40', '#9966FF'],
                ],
            ],
            'labels' => $topMenus->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Jumlah Dipesan',
                    ],
                ],
            ],
        ];
    }
} 