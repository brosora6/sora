<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Reservation;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\ActionGroup;

class ReservationMonitoringWidget extends BaseWidget
{
    protected static ?string $heading = 'Monitoring Reservasi';
    protected static ?int $sort = 7;
    protected int | string | array $columnSpan = 'full';
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

                TextColumn::make('order_number')
                    ->label('No. Reservasi')
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

                SelectColumn::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'rejected' => 'Rejected',
                    ])
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'confirmed',
                        'danger' => 'rejected',
                    ]),

                TextColumn::make('note')
                    ->label('Catatan')
                    ->limit(30),
            ])
            ->actions([
                ActionGroup::make([
                    Action::make('confirm')
                        ->label('Konfirmasi Reservasi')
                        ->icon('heroicon-m-check-circle')
                        ->color('success')
                        ->action(fn (Reservation $record) => $record->update(['status' => 'confirmed']))
                        ->visible(fn (Reservation $record) => $record->status === 'pending'),

                    Action::make('reject')
                        ->label('Tolak Reservasi')
                        ->icon('heroicon-m-x-circle')
                        ->color('danger')
                        ->action(fn (Reservation $record) => $record->update(['status' => 'rejected']))
                        ->visible(fn (Reservation $record) => $record->status === 'pending'),
                ]),
            ])
            ->defaultSort('tanggal', 'asc')
            ->poll('10s'); // Auto refresh every 10 seconds
    }
} 