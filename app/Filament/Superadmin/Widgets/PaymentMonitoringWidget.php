<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Payment;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\BadgeColumn;

class PaymentMonitoringWidget extends BaseWidget
{
    protected static ?string $heading = 'Monitoring Pembayaran';
    protected static ?int $sort = 7;
    protected int | string | array $columnSpan = 'full';
    protected int $defaultPaginationPageSize = 5;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Payment::query()
                    ->latest()
                    ->with('pelanggan', 'carts.menu')
            )
            ->columns([
                TextColumn::make('order_number')
                    ->label('No. Order')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('pelanggan.name')
                    ->label('Pelanggan')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('carts_count')
                    ->label('Jumlah Item')
                    ->counts('carts')
                    ->sortable(),

                TextColumn::make('total_amount')
                    ->label('Total Pembayaran')
                    ->money('IDR')
                    ->sortable(),

                ImageColumn::make('payment_proof')
                    ->label('Bukti Pembayaran')
                    ->circular(),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'danger' => 'rejected',
                        'warning' => 'pending',
                        'success' => 'completed',
                    ]),

                TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('10s'); // Auto refresh every 10 seconds
    }
} 