<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class ProductRevenueDonutChart extends ChartWidget
{
    protected static ?string $heading = 'Product Revenue Distribution';
    
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = Order::query()
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', 'completed')
            ->select(
                'products.name as product',
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue'),
                DB::raw('(SUM(order_items.quantity * order_items.price) / (SELECT SUM(oi.quantity * oi.price) FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.status = "completed")) * 100 as percentage')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('revenue', 'desc')
            ->limit(10)  // Top 10 products
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
            'labels' => $data->pluck('product')->toArray(),
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