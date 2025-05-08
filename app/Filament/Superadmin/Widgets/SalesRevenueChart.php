<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Payment;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SalesRevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Grafik Pendapatan';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'full';
    
    public ?string $filter = 'daily';

    protected function getFilters(): ?array
    {
        return [
            'daily' => 'Harian',
            'weekly' => 'Mingguan',
            'monthly' => 'Bulanan',
        ];
    }

    protected function getData(): array
    {
        $query = Payment::query()
            ->where('status', 'completed');

        if ($this->filter === 'weekly') {
            $data = $query
                ->where('created_at', '>=', now()->subWeeks(12))
                ->select(
                    DB::raw('YEARWEEK(created_at) as date'),
                    DB::raw('SUM(total_amount) as revenue'),
                    DB::raw('MIN(created_at) as week_start')
                )
                ->groupBy(DB::raw('YEARWEEK(created_at)'))
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    $weekStart = Carbon::parse($item->week_start)->startOfWeek();
                    return [
                        'date' => $weekStart->format('d M Y'),
                        'revenue' => $item->revenue,
                    ];
                });
        } elseif ($this->filter === 'monthly') {
            $data = $query
                ->where('created_at', '>=', now()->subMonths(12))
                ->select(
                    DB::raw('DATE_FORMAT(created_at, "%Y-%m") as date'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => Carbon::parse($item->date)->format('M Y'),
                        'revenue' => $item->revenue,
                    ];
                });
        } else {
            $data = $query
                ->where('created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => Carbon::parse($item->date)->format('d M'),
                        'revenue' => $item->revenue,
                    ];
                });
        }

        return [
            'datasets' => [
                [
                    'label' => 'Pendapatan',
                    'data' => $data->pluck('revenue')->toArray(),
                    'borderColor' => '#4CAF50',
                    'fill' => 'start',
                    'backgroundColor' => 'rgba(76, 175, 80, 0.1)',
                    'tension' => 0.3,
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
                    'grid' => [
                        'display' => true,
                        'drawBorder' => true,
                    ],
                    'ticks' => [
                        'callback' => 'function(value) { 
                            if (value >= 1000000) {
                                return "Rp " + (value/1000000).toLocaleString() + " Jt";
                            } else if (value >= 1000) {
                                return "Rp " + (value/1000).toLocaleString() + " Rb";
                            } else {
                                return "Rp " + value.toLocaleString();
                            }
                        }',
                    ],
                    'title' => [
                        'display' => true,
                        'text' => 'Total Pendapatan (Rupiah)',
                    ],
                ],
                'x' => [
                    'grid' => [
                        'display' => false,
                    ],
                    'title' => [
                        'display' => true,
                        'text' => match ($this->filter) {
                            'daily' => 'Tanggal',
                            'weekly' => 'Minggu',
                            'monthly' => 'Bulan',
                            default => 'Tanggal',
                        },
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
                        'label' => 'function(context) { 
                            return "Rp " + context.parsed.y.toLocaleString();
                        }',
                    ],
                ],
            ],
            'responsive' => true,
            'maintainAspectRatio' => false,
            'height' => 400,
        ];
    }
} 