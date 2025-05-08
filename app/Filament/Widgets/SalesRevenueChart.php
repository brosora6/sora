<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesRevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Sales & Revenue Analytics';
    
    protected int | string | array $columnSpan = 'full';
    
    public ?string $filter = 'daily';

    protected function getFilters(): ?array
    {
        return [
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
        ];
    }

    protected function getData(): array
    {
        $query = Order::query()
            ->where('status', 'completed')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->groupBy('date');

        // Adjust date range based on filter
        $startDate = match ($this->filter) {
            'daily' => now()->subDays(30),
            'weekly' => now()->subWeeks(12),
            'monthly' => now()->subMonths(12),
            default => now()->subDays(30),
        };

        $query->where('created_at', '>=', $startDate);

        $data = $query->get();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue',
                    'data' => $data->pluck('revenue')->toArray(),
                    'borderColor' => '#4CAF50',
                    'fill' => false,
                ],
            ],
            'labels' => $data->pluck('date')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
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
                    'display' => true,
                    'position' => 'top',
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