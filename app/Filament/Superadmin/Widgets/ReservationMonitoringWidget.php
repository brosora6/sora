<?php

namespace App\Filament\Superadmin\Widgets;

use App\Models\Reservation;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class ReservationMonitoringWidget extends BaseWidget
{
    protected static ?string $heading = 'Monitoring Reservasi';
    protected static ?int $sort = 7;
    protected int | string | array $columnSpan = 6;
    protected int $defaultPaginationPageSize = 5;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Reservation::query()
                    ->latest()
                    ->whereDate('tanggal', '>=', now())
            )
            ->columns([
                TextColumn::make('pelanggan.name')
                    ->label('Nama Pelanggan')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('tanggal')
                    ->label('Tanggal Reservasi')
                    ->date('d M Y')
                    ->sortable(),
                TextColumn::make('waktu')
                    ->label('Waktu')
                    ->time('H:i')
                    ->sortable(),
                TextColumn::make('jumlah_orang')
                    ->label('Jumlah Orang')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'rejected' => 'danger',
                        default => 'secondary',
                    })
            ])
            ->defaultSort('tanggal', 'asc');
    }
} 